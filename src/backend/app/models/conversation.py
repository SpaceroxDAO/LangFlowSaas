"""
Conversation model - stores chat sessions between users and workflows.

Updated 2026-01-15: Removed legacy agent_id relationship.
Conversations now link to workflows only.
"""
import uuid
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.workflow import Workflow
    from app.models.message import Message


class Conversation(BaseModel):
    """
    A conversation session between a user and a workflow.

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

    # Workflow relationship (primary link for conversations)
    workflow_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        String(36),
        ForeignKey("workflows.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
        comment="Workflow this conversation belongs to",
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

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
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
        return f"<Conversation(id={self.id}, workflow_id={self.workflow_id})>"
