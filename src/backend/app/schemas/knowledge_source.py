"""
KnowledgeSource schemas for request/response validation.
"""
import uuid
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class KnowledgeSourceBase(BaseModel):
    """Base knowledge source schema."""
    name: str = Field(..., min_length=1, max_length=255)


class KnowledgeSourceCreateFromURL(BaseModel):
    """Schema for creating a knowledge source from a URL."""
    url: str = Field(
        ...,
        min_length=10,
        max_length=2000,
        description="URL to fetch and index",
    )
    name: Optional[str] = Field(
        None,
        max_length=255,
        description="Display name (auto-generated from URL if not provided)",
    )
    project_id: Optional[uuid.UUID] = Field(
        None,
        description="Project to associate with (optional)",
    )


class KnowledgeSourceCreateFromText(BaseModel):
    """Schema for creating a knowledge source from pasted text."""
    content: str = Field(
        ...,
        min_length=10,
        max_length=100000,
        description="Text content to index",
    )
    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Display name for this content",
    )
    project_id: Optional[uuid.UUID] = Field(
        None,
        description="Project to associate with (optional)",
    )


class KnowledgeSourceCreateFromUserFile(BaseModel):
    """Schema for creating a knowledge source from an existing user file."""
    file_id: uuid.UUID = Field(
        ...,
        description="ID of the user file to convert to knowledge source",
    )
    project_id: Optional[uuid.UUID] = Field(
        None,
        description="Project to associate with (optional)",
    )


class KnowledgeSourceResponse(BaseModel):
    """Schema for knowledge source responses."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    project_id: Optional[uuid.UUID] = None
    name: str
    source_type: str
    file_path: Optional[str] = None
    original_filename: Optional[str] = None
    mime_type: Optional[str] = None
    file_size: Optional[int] = None
    url: Optional[str] = None
    status: str
    error_message: Optional[str] = None
    chunk_count: int = 0
    content_preview: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    updated_at: datetime


class KnowledgeSourceListResponse(BaseModel):
    """Schema for paginated knowledge source list."""
    knowledge_sources: List[KnowledgeSourceResponse]
    total: int
    page: int
    page_size: int


class KnowledgeSourceProcessResponse(BaseModel):
    """Schema for processing status response."""
    id: uuid.UUID
    name: str
    status: str
    chunk_count: int = 0
    error_message: Optional[str] = None
    message: str


# Supported file types for upload
SUPPORTED_FILE_TYPES = {
    "application/pdf": ".pdf",
    "text/plain": ".txt",
    "text/markdown": ".md",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "text/csv": ".csv",
}

SUPPORTED_EXTENSIONS = [".pdf", ".txt", ".md", ".docx", ".csv"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
