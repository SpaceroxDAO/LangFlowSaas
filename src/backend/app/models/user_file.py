"""
UserFile model for storing user uploaded files metadata.
"""
import uuid
from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.project import Project


class UserFile(BaseModel):
    """
    Model for storing file metadata.

    Files are stored on disk, this model tracks metadata and ownership.
    """

    __tablename__ = "user_files"

    # Owner relationship
    user_id: Mapped[uuid.UUID] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Optional project association
    project_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        String(36),
        ForeignKey("projects.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # File metadata
    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Stored filename (UUID-based)",
    )

    original_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Original filename from upload",
    )

    content_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="MIME type of the file",
    )

    size: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        comment="File size in bytes",
    )

    # Storage path (relative to uploads directory)
    storage_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        comment="Path to file on disk (relative to uploads dir)",
    )

    # Optional description
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="files",
        lazy="select",
    )

    project: Mapped[Optional["Project"]] = relationship(
        "Project",
        back_populates="files",
        lazy="select",
    )

    def __repr__(self) -> str:
        return f"<UserFile(id={self.id}, filename={self.original_filename}, user_id={self.user_id})>"
