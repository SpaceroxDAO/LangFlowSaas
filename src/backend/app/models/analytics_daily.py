"""
Analytics daily model for aggregated metrics.
"""
import datetime as dt
from typing import Optional, Dict, Any

from sqlalchemy import String, Integer, BigInteger, Date, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import BaseModel


class AnalyticsDaily(BaseModel):
    """
    Daily aggregated analytics per user.

    Tracks metrics like:
    - conversations_count: Total conversations started
    - messages_count: Total messages sent
    - tokens_used: Total LLM tokens consumed
    - agents_created: New agents created
    - workflows_executed: Workflow runs
    """

    __tablename__ = "analytics_daily"

    __table_args__ = (
        UniqueConstraint('user_id', 'record_date', name='uq_analytics_user_date'),
    )

    # Foreign key to user
    user_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Date for this record
    record_date: Mapped[dt.date] = mapped_column(Date, nullable=False)

    # Conversation metrics
    conversations_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    messages_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    tokens_used: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)

    # Agent metrics
    agents_created: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    agents_active: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Workflow metrics
    workflows_created: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    workflows_executed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Engagement metrics
    avg_response_time_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    error_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Optional breakdown by agent/workflow
    breakdown: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)

    def __repr__(self) -> str:
        return f"<AnalyticsDaily user={self.user_id} date={self.record_date}>"
