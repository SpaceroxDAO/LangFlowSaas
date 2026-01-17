"""
Files API endpoints.

Provides endpoints for file upload, listing, and deletion.
"""
import logging
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, status
from fastapi.responses import FileResponse as FastAPIFileResponse
from pydantic import BaseModel, Field

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.middleware.redis_rate_limit import check_rate_limit_with_user
from app.models.user import User
from app.services.user_service import UserService
from app.services.file_service import FileService, FileServiceError, ALLOWED_EXTENSIONS, MAX_FILE_SIZE

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/files", tags=["files"])


# =============================================================================
# Request/Response Models
# =============================================================================

class FileResponse(BaseModel):
    """Response model for a file."""

    id: str
    name: str = Field(..., description="Original filename")
    size: int = Field(..., description="File size in bytes")
    type: str = Field(..., description="MIME type")
    created_at: str = Field(..., description="ISO timestamp of upload")
    url: str = Field(..., description="URL to download the file")
    project_id: Optional[str] = None
    description: Optional[str] = None


class FileListResponse(BaseModel):
    """Response model for file listing."""

    files: list[FileResponse]
    total: int
    page: int
    page_size: int


class StorageStatsResponse(BaseModel):
    """Response model for storage statistics."""

    file_count: int
    total_size: int
    total_size_mb: float


class AllowedTypesResponse(BaseModel):
    """Response model for allowed file types."""

    extensions: list[str]
    max_size_bytes: int
    max_size_mb: float


# =============================================================================
# Helper Functions
# =============================================================================

async def get_user_from_clerk(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


def file_to_response(user_file, base_url: str = "") -> FileResponse:
    """Convert UserFile model to response."""
    return FileResponse(
        id=str(user_file.id),
        name=user_file.original_filename,
        size=user_file.size,
        type=user_file.content_type,
        created_at=user_file.created_at.isoformat(),
        url=f"{base_url}/api/v1/files/{user_file.id}/download",
        project_id=str(user_file.project_id) if user_file.project_id else None,
        description=user_file.description,
    )


# =============================================================================
# Endpoints
# =============================================================================

@router.get(
    "",
    response_model=FileListResponse,
    summary="List files",
    description="List files for the current user with pagination.",
)
async def list_files(
    page: int = 1,
    page_size: int = 20,
    project_id: Optional[str] = None,
    session: AsyncSessionDep = None,
    clerk_user: CurrentUser = None,
) -> FileListResponse:
    """List files for the current user."""
    user = await get_user_from_clerk(clerk_user, session)
    service = FileService(session)

    project_uuid = uuid.UUID(project_id) if project_id else None
    files, total = await service.list_files(
        user_id=user.id,
        project_id=project_uuid,
        page=page,
        page_size=page_size,
    )

    return FileListResponse(
        files=[file_to_response(f) for f in files],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post(
    "",
    response_model=FileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload file",
    description="Upload a new file.",
)
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    project_id: Optional[str] = None,
    description: Optional[str] = None,
    session: AsyncSessionDep = None,
    clerk_user: CurrentUser = None,
) -> FileResponse:
    """Upload a new file."""
    # Rate limit file uploads to prevent abuse
    await check_rate_limit_with_user(request, user_id=clerk_user.user_id)

    user = await get_user_from_clerk(clerk_user, session)
    service = FileService(session)

    # Read file content
    content = await file.read()

    try:
        project_uuid = uuid.UUID(project_id) if project_id else None
        user_file = await service.upload_file(
            user=user,
            filename=file.filename or "unnamed",
            content=content,
            content_type=file.content_type or "application/octet-stream",
            project_id=project_uuid,
            description=description,
        )
        await session.commit()
        return file_to_response(user_file)

    except FileServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.exception(f"Failed to upload file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload file. Please try again.",
        )


@router.get(
    "/{file_id}",
    response_model=FileResponse,
    summary="Get file metadata",
    description="Get metadata for a specific file.",
)
async def get_file(
    file_id: str,
    session: AsyncSessionDep = None,
    clerk_user: CurrentUser = None,
) -> FileResponse:
    """Get file metadata."""
    user = await get_user_from_clerk(clerk_user, session)
    service = FileService(session)

    try:
        file_uuid = uuid.UUID(file_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file ID format",
        )

    user_file = await service.get_file(file_uuid, user.id)
    if not user_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    return file_to_response(user_file)


@router.get(
    "/{file_id}/download",
    summary="Download file",
    description="Download a file.",
)
async def download_file(
    file_id: str,
    session: AsyncSessionDep = None,
    clerk_user: CurrentUser = None,
):
    """Download a file."""
    user = await get_user_from_clerk(clerk_user, session)
    service = FileService(session)

    try:
        file_uuid = uuid.UUID(file_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file ID format",
        )

    user_file = await service.get_file(file_uuid, user.id)
    if not user_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    file_path = service.get_file_path(user_file)
    if not file_path.exists():
        logger.error(f"File not found on disk: {file_path}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on disk",
        )

    return FastAPIFileResponse(
        path=str(file_path),
        filename=user_file.original_filename,
        media_type=user_file.content_type,
    )


@router.delete(
    "/{file_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete file",
    description="Delete a file.",
)
async def delete_file(
    file_id: str,
    session: AsyncSessionDep = None,
    clerk_user: CurrentUser = None,
):
    """Delete a file."""
    user = await get_user_from_clerk(clerk_user, session)
    service = FileService(session)

    try:
        file_uuid = uuid.UUID(file_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file ID format",
        )

    deleted = await service.delete_file(file_uuid, user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    await session.commit()


@router.get(
    "/stats/storage",
    response_model=StorageStatsResponse,
    summary="Get storage stats",
    description="Get storage statistics for the current user.",
)
async def get_storage_stats(
    session: AsyncSessionDep = None,
    clerk_user: CurrentUser = None,
) -> StorageStatsResponse:
    """Get storage statistics."""
    user = await get_user_from_clerk(clerk_user, session)
    service = FileService(session)
    stats = await service.get_storage_stats(user.id)
    return StorageStatsResponse(**stats)


@router.get(
    "/info/allowed-types",
    response_model=AllowedTypesResponse,
    summary="Get allowed file types",
    description="Get list of allowed file types and size limits.",
)
async def get_allowed_types() -> AllowedTypesResponse:
    """Get allowed file types and limits."""
    return AllowedTypesResponse(
        extensions=list(ALLOWED_EXTENSIONS.keys()),
        max_size_bytes=MAX_FILE_SIZE,
        max_size_mb=MAX_FILE_SIZE / (1024 * 1024),
    )
