"""
Usage metrics model for tracking consumption.
"""
from datetime import datetime
from typing import Optional, Dict, Any

from sqlalchemy import String, BigInteger, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import BaseModel


class UsageMetric(BaseModel):
    """
    Usage metrics for tracking consumption per billing period.

    Tracks various metrics like:
    - llm_tokens: Total LLM tokens consumed
    - messages_sent: Total messages sent
    - agents_created: Number of agents created
    """

    __tablename__ = "usage_metrics"

    # Foreign key to user
    user_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Metric type (e.g., "llm_tokens", "messages_sent", "agents_created")
    metric_type: Mapped[str] = mapped_column(String(50), nullable=False)

    # Value (count/amount)
    value: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)

    # Billing period (monthly)
    period_start: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    period_end: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    # Optional extra data (e.g., breakdown by model, agent, etc.)
    extra_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)

    def __repr__(self) -> str:
        return f"<UsageMetric {self.metric_type}={self.value} user={self.user_id}>"
