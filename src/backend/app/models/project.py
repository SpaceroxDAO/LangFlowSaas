"""
Project model - organizes agents into folders/projects.
"""
import uuid
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, Text, ForeignKey, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.agent import Agent


class Project(BaseModel):
    """
    Project for organizing agents (Charlie's training programs).

    Each user has at least one default project.
    Agents belong to exactly one project.
    """

    __tablename__ = "projects"

    # Owner relationship
    user_id: Mapped[uuid.UUID] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Project display info
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Visual customization
    icon: Mapped[str] = mapped_column(
        String(50),
        default="folder",
        nullable=False,
        comment="Emoji or icon name for the project",
    )

    color: Mapped[str] = mapped_column(
        String(20),
        default="#f97316",
        nullable=False,
        comment="Hex color for the project",
    )

    # Project status
    is_default: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="One default project per user - cannot be deleted",
    )

    is_archived: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Soft delete - archived projects are hidden",
    )

    # Display order
    sort_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        comment="Manual ordering within user's projects",
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="projects",
        lazy="joined",
    )

    agents: Mapped[List["Agent"]] = relationship(
        "Agent",
        back_populates="project",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Project(id={self.id}, name={self.name})>"
