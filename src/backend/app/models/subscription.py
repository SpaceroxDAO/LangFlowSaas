"""
Subscription model for billing and plan management.
"""
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel


class Subscription(BaseModel):
    """
    User subscription for billing.

    Tracks Stripe subscription state and plan information.
    """

    __tablename__ = "subscriptions"

    # Foreign key to user
    user_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        unique=True,
    )

    # Stripe identifiers
    stripe_customer_id: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True, index=True
    )
    stripe_subscription_id: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )

    # Plan details
    plan_id: Mapped[str] = mapped_column(
        String(50), default="free", nullable=False
    )  # free, pro, team

    # Subscription status
    status: Mapped[str] = mapped_column(
        String(50), default="active", nullable=False
    )  # active, canceled, past_due, trialing

    # Billing period
    current_period_start: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    current_period_end: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Cancel at period end flag
    cancel_at_period_end: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationship to user
    user = relationship("User", back_populates="subscription")

    def __repr__(self) -> str:
        return f"<Subscription {self.id} user={self.user_id} plan={self.plan_id}>"

    @property
    def is_active(self) -> bool:
        """Check if subscription is currently active."""
        return self.status in ("active", "trialing")

    @property
    def is_paid(self) -> bool:
        """Check if this is a paid plan."""
        return self.plan_id in ("pro", "team")
