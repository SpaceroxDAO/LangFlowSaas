"""
Conversation model - stores chat sessions between users and agents.
"""
import uuid
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.agent import Agent
    from app.models.workflow import Workflow
    from app.models.message import Message


class Conversation(BaseModel):
    """
    A conversation session between a user and an agent.

    Each conversation maps to a Langflow session_id for
    maintaining chat context across messages.
    """

    __tablename__ = "conversations"

    # Owner relationship
    user_id: Mapped[uuid.UUID] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Agent relationship (legacy - will be deprecated)
    agent_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        String(36),
        ForeignKey("agents.id", ondelete="CASCADE"),
        nullable=True,  # Made nullable for migration to workflows
        index=True,
    )

    # Workflow relationship (new - will replace agent_id)
    workflow_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        String(36),
        ForeignKey("workflows.id", ondelete="CASCADE"),
        nullable=True,  # Nullable during migration period
        index=True,
        comment="Workflow this conversation belongs to (replaces agent_id)",
    )

    # Langflow session ID for context continuity
    langflow_session_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
        comment="Session ID used in Langflow API calls",
    )

    # Optional title (auto-generated from first message)
    title: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )

    # Relationships - use lazy="select" to avoid N+1 query cascade
    # Load these explicitly when needed using joinedload()/selectinload() in queries
    user: Mapped["User"] = relationship(
        "User",
        back_populates="conversations",
        lazy="select",
    )

    agent: Mapped[Optional["Agent"]] = relationship(
        "Agent",
        back_populates="conversations",
        lazy="select",
    )

    workflow: Mapped[Optional["Workflow"]] = relationship(
        "Workflow",
        back_populates="conversations",
        lazy="select",
    )

    messages: Mapped[List["Message"]] = relationship(
        "Message",
        back_populates="conversation",
        lazy="select",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )

    def __repr__(self) -> str:
        return f"<Conversation(id={self.id}, agent_id={self.agent_id})>"
