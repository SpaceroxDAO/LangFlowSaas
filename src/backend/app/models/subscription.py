"""
Subscription model for billing and plan management.
"""
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Boolean, DateTime, Integer, ForeignKey
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
    )  # free, individual, business

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

    # Purchased credits (from credit pack purchases)
    # These are in addition to monthly plan credits and don't reset
    purchased_credits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Auto top-up settings
    auto_top_up_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    auto_top_up_threshold: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    auto_top_up_pack_id: Mapped[str] = mapped_column(String(50), default="credits_5500", nullable=False)
    auto_top_up_max_monthly: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    auto_top_ups_this_month: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Spend cap settings
    spend_cap_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    spend_cap_amount_cents: Mapped[int] = mapped_column(Integer, default=10000, nullable=False)  # $100 default
    spend_this_month_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

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
        return self.plan_id in ("individual", "business", "pro", "team")
