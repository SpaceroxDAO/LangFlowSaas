"""
UserSettings model - stores user preferences and API keys.
"""
import uuid
from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, Text, ForeignKey, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.user import User


class UserSettings(BaseModel):
    """
    User settings and preferences.

    Stores API keys (encrypted), UI preferences, and default configurations.
    One-to-one relationship with User.
    """

    __tablename__ = "user_settings"

    # Owner relationship (one-to-one)
    user_id: Mapped[uuid.UUID] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    # Default LLM provider
    default_llm_provider: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        default="openai",
        comment="Default LLM provider: openai, anthropic, etc.",
    )

    # API Keys (encrypted JSON)
    # Format: {"openai": "encrypted_key", "anthropic": "encrypted_key"}
    api_keys_encrypted: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
        comment="Encrypted API keys for LLM providers",
    )

    # UI Preferences
    theme: Mapped[str] = mapped_column(
        String(20),
        default="light",
        nullable=False,
        comment="UI theme: light, dark, system",
    )

    sidebar_collapsed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether sidebar is collapsed",
    )

    # Onboarding state
    onboarding_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether user has completed onboarding tours",
    )

    tours_completed: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
        default=dict,
        comment="Map of completed tour IDs",
    )

    # Extensible settings
    settings_json: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
        comment="Additional settings as JSON",
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="settings",
        lazy="joined",
    )

    def __repr__(self) -> str:
        return f"<UserSettings(user_id={self.user_id})>"
