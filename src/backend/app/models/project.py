"""
Project model - organizes agents into folders/projects.

Updated 2026-01-15: Removed legacy agents relationship.
"""
import uuid
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, Text, ForeignKey, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.agent_component import AgentComponent
    from app.models.workflow import Workflow
    from app.models.mcp_server import MCPServer
    from app.models.user_file import UserFile


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
        lazy="select",
    )

    # Primary models for three-tab architecture
    agent_components: Mapped[List["AgentComponent"]] = relationship(
        "AgentComponent",
        back_populates="project",
        lazy="select",
    )

    workflows: Mapped[List["Workflow"]] = relationship(
        "Workflow",
        back_populates="project",
        lazy="select",
    )

    mcp_servers: Mapped[List["MCPServer"]] = relationship(
        "MCPServer",
        back_populates="project",
        lazy="select",
    )

    files: Mapped[List["UserFile"]] = relationship(
        "UserFile",
        back_populates="project",
        lazy="select",
    )

    def __repr__(self) -> str:
        return f"<Project(id={self.id}, name={self.name})>"
