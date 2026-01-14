"""
Chat file upload endpoints for handling attachments in chat.
"""
import uuid
from typing import Optional, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from pydantic import BaseModel

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.services.user_service import UserService
from app.config import settings

router = APIRouter(prefix="/chat/files", tags=["Chat Files"])

# Allowed file types
ALLOWED_TEXT_TYPES = {
    "text/csv", "application/json", "application/pdf", "text/plain",
    "text/markdown", "application/x-yaml", "text/yaml", "text/xml",
    "application/xml", "text/html", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/x-python", "application/javascript", "application/typescript",
    "application/x-typescript", "text/x-sql",
}

ALLOWED_IMAGE_TYPES = {
    "image/jpeg", "image/jpg", "image/png", "image/bmp", "image/gif", "image/webp",
}

ALLOWED_AUDIO_TYPES = {
    "audio/webm", "audio/wav", "audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a",
}

ALLOWED_TYPES = ALLOWED_TEXT_TYPES | ALLOWED_IMAGE_TYPES | ALLOWED_AUDIO_TYPES

# File extension mappings
EXTENSION_TO_TYPE = {
    ".csv": "text/csv",
    ".json": "application/json",
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".yaml": "application/x-yaml",
    ".yml": "application/x-yaml",
    ".xml": "text/xml",
    ".html": "text/html",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".py": "text/x-python",
    ".js": "application/javascript",
    ".ts": "application/typescript",
    ".sql": "text/x-sql",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".bmp": "image/bmp",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".webm": "audio/webm",
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".m4a": "audio/x-m4a",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


class FileUploadResponse(BaseModel):
    """Response for file upload."""
    id: str
    name: str
    size: int
    mime_type: str
    file_type: str  # "text", "image", or "audio"
    langflow_file_id: Optional[str] = None
    preview_url: Optional[str] = None
    uploaded_at: str


async def get_user_from_clerk(clerk_user: CurrentUser, session: AsyncSessionDep):
    """Get or create user from Clerk authentication."""
    if not clerk_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )
    user_service = UserService(session)
    user = await user_service.get_or_create_from_clerk(clerk_user)
    return user


def get_file_type(mime_type: str) -> str:
    """Get file type category from MIME type."""
    if mime_type in ALLOWED_TEXT_TYPES:
        return "text"
    elif mime_type in ALLOWED_IMAGE_TYPES:
        return "image"
    elif mime_type in ALLOWED_AUDIO_TYPES:
        return "audio"
    return "unknown"


def validate_file(file: UploadFile) -> tuple[str, str]:
    """Validate file and return (mime_type, file_type)."""
    # Check file size
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB.",
        )

    # Determine MIME type
    mime_type = file.content_type
    if not mime_type or mime_type == "application/octet-stream":
        # Try to infer from extension
        if file.filename:
            ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
            mime_type = EXTENSION_TO_TYPE.get(ext, "application/octet-stream")

    # Validate type
    if mime_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{mime_type}' not allowed. Allowed types: text files, images, and audio.",
        )

    file_type = get_file_type(mime_type)
    return mime_type, file_type


@router.post(
    "",
    response_model=FileUploadResponse,
    summary="Upload a file for chat",
    description="Upload a file to use as an attachment in chat messages.",
)
async def upload_chat_file(
    file: UploadFile = File(...),
    workflow_id: str = Form(...),
    session: AsyncSessionDep = None,
    clerk_user: CurrentUser = None,
):
    """
    Upload a file for use in chat.

    Supports:
    - Text files: csv, json, pdf, txt, md, yaml, xml, html, docx, py, js, ts, sql
    - Images: jpg, jpeg, png, bmp, gif, webp
    - Audio: webm, wav, mp3, m4a

    Maximum file size: 10MB
    """
    from app.services.langflow_client import langflow_client, LangflowClientError
    from app.services.workflow_service import WorkflowService

    user = await get_user_from_clerk(clerk_user, session)

    # Validate file
    mime_type, file_type = validate_file(file)

    # Verify workflow ownership
    service = WorkflowService(session)
    workflow = await service.get_by_id(uuid.UUID(workflow_id), user_id=user.id)
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    # Read file content
    content = await file.read()
    file_size = len(content)

    # Generate file ID
    file_id = str(uuid.uuid4())

    # Upload to Langflow if available
    langflow_file_id = None
    try:
        # Try to upload to Langflow's file API
        langflow_file_id = await langflow_client.upload_file(
            flow_id=workflow.langflow_flow_id,
            file_name=file.filename or f"file_{file_id}",
            file_content=content,
            mime_type=mime_type,
        )
    except LangflowClientError as e:
        # Log but don't fail - file can still be used locally
        print(f"Warning: Failed to upload file to Langflow: {e}")
    except Exception as e:
        print(f"Warning: Unexpected error uploading to Langflow: {e}")

    return FileUploadResponse(
        id=file_id,
        name=file.filename or f"file_{file_id}",
        size=file_size,
        mime_type=mime_type,
        file_type=file_type,
        langflow_file_id=langflow_file_id,
        preview_url=None,  # Could generate preview URL for images
        uploaded_at=datetime.utcnow().isoformat(),
    )


@router.post(
    "/audio",
    response_model=FileUploadResponse,
    summary="Upload an audio recording",
    description="Upload an audio recording from voice input.",
)
async def upload_audio_file(
    file: UploadFile = File(...),
    workflow_id: str = Form(...),
    session: AsyncSessionDep = None,
    clerk_user: CurrentUser = None,
):
    """
    Upload an audio recording.

    Supports: webm, wav, mp3, m4a
    Maximum size: 10MB
    """
    user = await get_user_from_clerk(clerk_user, session)

    # Validate audio file
    mime_type = file.content_type
    if mime_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid audio type. Allowed: webm, wav, mp3, m4a",
        )

    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB.",
        )

    # Read file content
    content = await file.read()
    file_size = len(content)

    # Generate file ID
    file_id = str(uuid.uuid4())

    return FileUploadResponse(
        id=file_id,
        name=file.filename or f"audio_{file_id}.webm",
        size=file_size,
        mime_type=mime_type,
        file_type="audio",
        langflow_file_id=None,
        preview_url=None,
        uploaded_at=datetime.utcnow().isoformat(),
    )
