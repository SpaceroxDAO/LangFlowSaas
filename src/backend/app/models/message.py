"""
Message model - stores individual chat messages.
"""
import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, Text, ForeignKey, JSON, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.conversation import Conversation


class MessageRole(str, Enum):
    """Message sender role."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class FeedbackType(str, Enum):
    """Feedback type for assistant messages."""
    POSITIVE = "positive"
    NEGATIVE = "negative"


class Message(BaseModel):
    """
    Individual message in a conversation.

    Stores both user messages and assistant responses.
    """

    __tablename__ = "messages"

    # Conversation relationship
    conversation_id: Mapped[uuid.UUID] = mapped_column(
        String(36),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Message content
    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        comment="Message role: user, assistant, or system",
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # Optional metadata from Langflow response
    message_metadata: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
        comment="Additional metadata from Langflow response",
    )

    # Edit tracking
    is_edited: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether this message has been edited",
    )

    edited_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True,
        comment="When the message was last edited",
    )

    original_content: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Original content before editing",
    )

    # Feedback (for assistant messages)
    feedback: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
        comment="User feedback: positive or negative",
    )

    feedback_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True,
        comment="When feedback was submitted",
    )

    # Relationship
    conversation: Mapped["Conversation"] = relationship(
        "Conversation",
        back_populates="messages",
        lazy="select",
    )

    def __repr__(self) -> str:
        content_preview = self.content[:50] + "..." if len(self.content) > 50 else self.content
        return f"<Message(id={self.id}, role={self.role}, content={content_preview})>"
