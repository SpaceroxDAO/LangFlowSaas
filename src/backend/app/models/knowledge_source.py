"""
KnowledgeSource model for RAG document storage.

Stores metadata about user-uploaded documents and URLs that can be
searched by agents using retrieval-augmented generation (RAG).
"""
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey, String, Text, Integer, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.database import BaseModel


class KnowledgeSource(BaseModel):
    """
    Represents a knowledge source (document or URL) for RAG.

    Users can upload files or add URLs, which are processed into
    vector embeddings and stored in Chroma for retrieval.
    """

    __tablename__ = "knowledge_sources"

    # Ownership
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    project_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("projects.id"),
        nullable=True,
        index=True,
    )

    # Source identification
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Display name (filename or URL title)",
    )
    source_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        comment="Type: 'file' or 'url'",
    )

    # File-specific fields
    file_path: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="Path to stored file (relative to storage root)",
    )
    original_filename: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Original uploaded filename",
    )
    mime_type: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="MIME type of the file",
    )
    file_size: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="File size in bytes",
    )

    # URL-specific fields
    url: Mapped[Optional[str]] = mapped_column(
        String(2000),
        nullable=True,
        comment="Source URL for URL-type sources",
    )

    # Processing status
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="pending",
        comment="Status: 'pending', 'processing', 'ready', 'error'",
    )
    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Error details if processing failed",
    )

    # Vector store information
    collection_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="Chroma collection ID for this source's embeddings",
    )
    chunk_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        comment="Number of text chunks created from this source",
    )

    # Content preview
    content_preview: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="First ~500 chars of content for preview",
    )

    # Metadata
    metadata_json: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
        default=None,
        comment="Additional metadata (page count, word count, etc.)",
    )

    # Soft delete
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    def __repr__(self) -> str:
        return f"<KnowledgeSource {self.name} ({self.source_type})>"
