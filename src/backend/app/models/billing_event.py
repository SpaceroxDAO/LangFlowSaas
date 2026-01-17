"""
Billing events model for audit trail.
"""
from typing import Optional, Dict, Any

from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import BaseModel


class BillingEvent(BaseModel):
    """
    Billing event audit trail.

    Records all Stripe webhook events for compliance and debugging.
    """

    __tablename__ = "billing_events"

    # Foreign key to user
    user_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Event type (e.g., "subscription.created", "invoice.paid", etc.)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)

    # Stripe event ID (for deduplication)
    stripe_event_id: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True, unique=True, index=True
    )

    # Full event payload for debugging
    payload: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)

    def __repr__(self) -> str:
        return f"<BillingEvent {self.event_type} user={self.user_id}>"
