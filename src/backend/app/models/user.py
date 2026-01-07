"""
User model - stores Clerk user information.
"""
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.agent import Agent
    from app.models.conversation import Conversation
    from app.models.project import Project
    from app.models.user_settings import UserSettings
    from app.models.agent_component import AgentComponent
    from app.models.workflow import Workflow
    from app.models.mcp_server import MCPServer


class User(BaseModel):
    """
    User model synced from Clerk.

    We store minimal user data - Clerk is the source of truth.
    The clerk_id links to the Clerk user record.
    """

    __tablename__ = "users"

    # Clerk user ID (from JWT 'sub' claim)
    clerk_id: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    # Basic info (synced from Clerk on first login)
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    first_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    last_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    # Account status
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Relationships - use lazy="select" (default) to avoid N+1 query cascade
    # Load these explicitly when needed using selectinload() in queries
    agents: Mapped[List["Agent"]] = relationship(
        "Agent",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan",
    )

    conversations: Mapped[List["Conversation"]] = relationship(
        "Conversation",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan",
    )

    projects: Mapped[List["Project"]] = relationship(
        "Project",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan",
    )

    settings: Mapped[Optional["UserSettings"]] = relationship(
        "UserSettings",
        back_populates="user",
        lazy="select",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # Relationships for three-tab architecture
    agent_components: Mapped[List["AgentComponent"]] = relationship(
        "AgentComponent",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan",
    )

    workflows: Mapped[List["Workflow"]] = relationship(
        "Workflow",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan",
    )

    mcp_servers: Mapped[List["MCPServer"]] = relationship(
        "MCPServer",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan",
    )

    @property
    def full_name(self) -> str:
        """Get user's full name."""
        parts = [p for p in [self.first_name, self.last_name] if p]
        return " ".join(parts) if parts else self.email

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"
