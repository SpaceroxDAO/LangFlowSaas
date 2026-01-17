"""
User mission progress model for tracking learning journey.
"""
from datetime import datetime
from typing import Optional, Dict, Any, List

from sqlalchemy import String, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel


class UserMissionProgress(BaseModel):
    """
    Tracks a user's progress through a mission.

    Status flow: not_started -> in_progress -> completed
    """

    __tablename__ = "user_mission_progress"

    __table_args__ = (
        UniqueConstraint('user_id', 'mission_id', name='uq_user_mission'),
    )

    # Foreign keys
    user_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    mission_id: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("missions.id", ondelete="CASCADE"),
        nullable=False,
    )

    # Progress status
    status: Mapped[str] = mapped_column(
        String(20), default="not_started", nullable=False, index=True
    )  # not_started, in_progress, completed

    # Current step (0-indexed)
    current_step: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Completed step IDs
    completed_steps: Mapped[List[int]] = mapped_column(JSONB, default=list, nullable=False)

    # Timestamps
    started_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)

    # Artifacts created during the mission (agent IDs, workflow IDs, etc.)
    artifacts: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)

    def __repr__(self) -> str:
        return f"<UserMissionProgress {self.mission_id} user={self.user_id} status={self.status}>"

    @property
    def is_completed(self) -> bool:
        return self.status == "completed"

    @property
    def is_in_progress(self) -> bool:
        return self.status == "in_progress"
