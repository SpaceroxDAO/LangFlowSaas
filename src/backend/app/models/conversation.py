"""
Conversation model - stores chat sessions between users and agents.
"""
import uuid
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.agent import Agent
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
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Agent relationship
    agent_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("agents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
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
        lazy="joined",
    )

    agent: Mapped["Agent"] = relationship(
        "Agent",
        back_populates="conversations",
        lazy="joined",
    )

    messages: Mapped[List["Message"]] = relationship(
        "Message",
        back_populates="conversation",
        lazy="selectin",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )

    def __repr__(self) -> str:
        return f"<Conversation(id={self.id}, agent_id={self.agent_id})>"
