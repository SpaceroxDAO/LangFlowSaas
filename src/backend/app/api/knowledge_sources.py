"""
Knowledge Sources API endpoints.

Handles CRUD operations for RAG knowledge sources (files, URLs, text).
"""
import uuid
from typing import Optional

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.user import User
from app.services.user_service import UserService
from app.services.knowledge_service import KnowledgeService, KnowledgeServiceError
from app.schemas.knowledge_source import (
    KnowledgeSourceResponse,
    KnowledgeSourceListResponse,
    KnowledgeSourceCreateFromURL,
    KnowledgeSourceCreateFromText,
    KnowledgeSourceProcessResponse,
    SUPPORTED_EXTENSIONS,
    MAX_FILE_SIZE,
)

router = APIRouter(prefix="/knowledge-sources", tags=["knowledge-sources"])


async def get_user_from_clerk(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(
        clerk_user=clerk_user,
        email=clerk_user.email,
    )


@router.get("", response_model=KnowledgeSourceListResponse)
async def list_knowledge_sources(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
    project_id: Optional[uuid.UUID] = Query(None, description="Filter by project"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
):
    """List all knowledge sources for the current user."""
    user = await get_user_from_clerk(clerk_user, session)
    service = KnowledgeService(session)
    sources, total = await service.list_by_user(
        user_id=user.id,
        project_id=project_id,
        page=page,
        page_size=page_size,
    )

    return KnowledgeSourceListResponse(
        knowledge_sources=[KnowledgeSourceResponse.model_validate(s) for s in sources],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{source_id}", response_model=KnowledgeSourceResponse)
async def get_knowledge_source(
    source_id: uuid.UUID,
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
):
    """Get a specific knowledge source by ID."""
    user = await get_user_from_clerk(clerk_user, session)
    service = KnowledgeService(session)
    source = await service.get_by_id(source_id, user.id)

    if not source:
        raise HTTPException(status_code=404, detail="Knowledge source not found")

    return KnowledgeSourceResponse.model_validate(source)


@router.post("/upload", response_model=KnowledgeSourceResponse, status_code=201)
async def upload_file(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
    file: UploadFile = File(...),
    project_id: Optional[uuid.UUID] = Form(None),
):
    """
    Upload a file as a knowledge source.

    Supported formats: PDF, TXT, MD, DOCX, CSV
    Max file size: 10MB
    """
    user = await get_user_from_clerk(clerk_user, session)

    # Validate file extension
    filename = file.filename or "unknown"
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Supported: {', '.join(SUPPORTED_EXTENSIONS)}"
        )

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )

    # Validate not empty
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="File is empty")

    service = KnowledgeService(session)
    try:
        source = await service.create_from_file(
            user=user,
            file_content=content,
            filename=filename,
            mime_type=file.content_type or "application/octet-stream",
            project_id=project_id,
        )
        await session.commit()
        return KnowledgeSourceResponse.model_validate(source)
    except KnowledgeServiceError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/url", response_model=KnowledgeSourceResponse, status_code=201)
async def add_url(
    data: KnowledgeSourceCreateFromURL,
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
):
    """
    Add a URL as a knowledge source.

    The URL content will be fetched and stored for RAG retrieval.
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = KnowledgeService(session)
    try:
        source = await service.create_from_url(
            user=user,
            url=data.url,
            name=data.name,
            project_id=data.project_id,
        )
        await session.commit()
        return KnowledgeSourceResponse.model_validate(source)
    except KnowledgeServiceError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/text", response_model=KnowledgeSourceResponse, status_code=201)
async def add_text(
    data: KnowledgeSourceCreateFromText,
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
):
    """
    Add pasted text as a knowledge source.

    The text will be stored and made available for RAG retrieval.
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = KnowledgeService(session)
    try:
        source = await service.create_from_text(
            user=user,
            content=data.content,
            name=data.name,
            project_id=data.project_id,
        )
        await session.commit()
        return KnowledgeSourceResponse.model_validate(source)
    except KnowledgeServiceError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{source_id}", status_code=204)
async def delete_knowledge_source(
    source_id: uuid.UUID,
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
):
    """Delete a knowledge source."""
    user = await get_user_from_clerk(clerk_user, session)
    service = KnowledgeService(session)
    source = await service.get_by_id(source_id, user.id)

    if not source:
        raise HTTPException(status_code=404, detail="Knowledge source not found")

    await service.delete(source)
    await session.commit()
    return None
