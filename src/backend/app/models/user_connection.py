"""
UserConnection model - stores user's Composio app connections.

Tracks OAuth connections to external services (Gmail, Slack, etc.)
via Composio's multi-tenant authentication system.
"""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional, List

from sqlalchemy import String, Text, ForeignKey, Boolean, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.user import User


class UserConnection(BaseModel):
    """
    A user's connection to an external app via Composio.

    Composio handles OAuth flows, token storage, and refresh.
    We store metadata about the connection for UI display and validation.

    Example apps: gmail, googlecalendar, slack, hubspot, notion, etc.
    """

    __tablename__ = "user_connections"

    # Owner relationship (user who owns this connection)
    user_id: Mapped[uuid.UUID] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # App identification
    app_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
        comment="Composio app key: gmail, slack, googlecalendar, etc.",
    )

    app_display_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Human-friendly name: Gmail, Slack, Google Calendar",
    )

    # Composio identifiers
    composio_connection_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        index=True,
        comment="Composio's connection ID",
    )

    composio_entity_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Entity ID in Composio (should match user_id)",
    )

    # Connection status
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="pending",
        comment="Status: pending, active, expired, revoked, error",
    )

    # Account details (for display)
    account_identifier: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="User-friendly identifier: john@gmail.com, @johndoe",
    )

    # OAuth scopes granted
    scopes: Mapped[Optional[list]] = mapped_column(
        JSON,
        nullable=True,
        comment="OAuth scopes granted by user",
    )

    # Available actions from Composio
    available_actions: Mapped[Optional[list]] = mapped_column(
        JSON,
        nullable=True,
        comment="List of available Composio actions for this connection",
    )

    # Timestamps
    connected_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(),
        nullable=True,
        comment="When the connection was successfully established",
    )

    last_used_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(),
        nullable=True,
        comment="Last time this connection was used in a tool call",
    )

    expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(),
        nullable=True,
        comment="When the OAuth token expires (if known)",
    )

    # Error tracking
    last_error: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Last error message if status is 'error'",
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="connections",
        lazy="select",
    )

    def __repr__(self) -> str:
        return f"<UserConnection(id={self.id}, app={self.app_name}, status={self.status})>"

    @property
    def is_active(self) -> bool:
        """Check if connection is active and usable."""
        return self.status == "active"

    @property
    def needs_reconnection(self) -> bool:
        """Check if connection needs to be re-established."""
        return self.status in ("expired", "error", "revoked")
