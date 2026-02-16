"""
User model - stores Clerk user information.

Updated 2026-01-15: Removed legacy agents relationship.
"""
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.conversation import Conversation
    from app.models.project import Project
    from app.models.user_settings import UserSettings
    from app.models.agent_component import AgentComponent
    from app.models.workflow import Workflow
    from app.models.mcp_server import MCPServer
    from app.models.user_file import UserFile
    from app.models.subscription import Subscription
    from app.models.user_connection import UserConnection


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

    # MCP bridge token for TC Connector authentication
    mcp_bridge_token: Mapped[Optional[str]] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=True,
    )

    # Account status
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Relationships
    conversations: Mapped[List["Conversation"]] = relationship(
        "Conversation",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan",
    )

    projects: Mapped[List["Project"]] = relationship(
        "Project",
        back_populates="user",
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    settings: Mapped[Optional["UserSettings"]] = relationship(
        "UserSettings",
        back_populates="user",
        lazy="select",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # Primary models for three-tab architecture
    agent_components: Mapped[List["AgentComponent"]] = relationship(
        "AgentComponent",
        back_populates="user",
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    workflows: Mapped[List["Workflow"]] = relationship(
        "Workflow",
        back_populates="user",
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    mcp_servers: Mapped[List["MCPServer"]] = relationship(
        "MCPServer",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan",
    )

    files: Mapped[List["UserFile"]] = relationship(
        "UserFile",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan",
    )

    # Billing relationship (one subscription per user)
    subscription: Mapped[Optional["Subscription"]] = relationship(
        "Subscription",
        back_populates="user",
        lazy="select",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # Composio connections (OAuth to external apps)
    connections: Mapped[List["UserConnection"]] = relationship(
        "UserConnection",
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
