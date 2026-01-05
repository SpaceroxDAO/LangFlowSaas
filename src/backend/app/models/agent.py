"""
Agent model - stores Charlie AI agents created by users.
"""
import uuid
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, Text, ForeignKey, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.conversation import Conversation


class Agent(BaseModel):
    """
    Agent (Charlie) created by a user.

    Each agent is backed by a Langflow flow.
    The Q&A answers are stored for display/editing,
    while the flow_id links to the actual Langflow flow.
    """

    __tablename__ = "agents"

    # Owner relationship
    user_id: Mapped[uuid.UUID] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Agent display info
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Q&A answers from onboarding (used for template mapping)
    qa_who: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Answer to: Who is Charlie? What kind of job does he have?",
    )

    qa_rules: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Answer to: What are the rules to his job?",
    )

    qa_tricks: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Answer to: What tricks does Charlie know?",
    )

    # Generated system prompt (from Q&A mapping)
    system_prompt: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # Langflow integration
    langflow_flow_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
        comment="UUID of the flow in Langflow",
    )

    # Template used (for future multiple template support)
    template_name: Mapped[str] = mapped_column(
        String(100),
        default="support_bot",
        nullable=False,
    )

    # Agent status
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Optional: store the full flow JSON for reference
    flow_data: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
        comment="Cached copy of Langflow flow JSON",
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="agents",
        lazy="joined",
    )

    conversations: Mapped[List["Conversation"]] = relationship(
        "Conversation",
        back_populates="agent",
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Agent(id={self.id}, name={self.name})>"
