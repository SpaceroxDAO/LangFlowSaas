"""
Analytics service for dashboard metrics and reporting.

Provides aggregated analytics data for the dashboard.

Updated 2026-01-15: Removed references to deprecated agents and usage_metrics tables.
Analytics now queries agent_components and workflows only.
"""
import logging
import uuid
from datetime import date, datetime, timedelta
from typing import Dict, Any, List, Union

from sqlalchemy import select, func, String, cast, Date
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.analytics_daily import AnalyticsDaily
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.agent_component import AgentComponent
from app.models.workflow import Workflow

logger = logging.getLogger(__name__)


def _calculate_percent_change(previous: int, current: int) -> float:
    """Calculate percentage change between two values."""
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round(((current - previous) / previous) * 100, 1)


def _to_str(user_id: Union[str, uuid.UUID]) -> str:
    """Convert user_id to string for database queries on String columns."""
    if isinstance(user_id, str):
        return user_id
    return str(user_id)


class AnalyticsService:
    """Service for analytics and dashboard data."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_dashboard_stats(
        self,
        user_id: Union[str, uuid.UUID],
        days: int = 30,
        custom_start: date = None,
        custom_end: date = None,
    ) -> Dict[str, Any]:
        """
        Get dashboard statistics for a user.

        Args:
            user_id: User ID
            days: Number of days to include (default 30)
            custom_start: Optional custom start date (overrides days)
            custom_end: Optional custom end date (overrides days)

        Returns:
            Dictionary with dashboard stats including period comparison
        """
        uid = _to_str(user_id)

        # Use custom date range if provided, otherwise calculate from days
        if custom_start and custom_end:
            start_date = custom_start
            end_date = custom_end
            days = (end_date - start_date).days + 1
        else:
            end_date = date.today()
            start_date = end_date - timedelta(days=days - 1)

        # Previous period (same length, immediately before)
        prev_end_date = start_date - timedelta(days=1)
        prev_start_date = prev_end_date - timedelta(days=days - 1)

        # Get aggregated daily data for current period
        daily_stats = await self._get_daily_stats(uid, start_date, end_date)

        # Get daily data for previous period (for comparison)
        prev_daily_stats = await self._get_daily_stats(uid, prev_start_date, prev_end_date)

        # Calculate period totals
        current_messages = sum(d['messages'] for d in daily_stats)
        current_conversations = sum(d['conversations'] for d in daily_stats)
        current_tokens = sum(d['tokens'] for d in daily_stats)

        prev_messages = sum(d['messages'] for d in prev_daily_stats)
        prev_conversations = sum(d['conversations'] for d in prev_daily_stats)
        prev_tokens = sum(d['tokens'] for d in prev_daily_stats)

        # Get totals (all-time counts)
        totals = await self._get_totals(uid)

        # Get recent activity
        recent_conversations = await self._get_recent_conversations(uid, limit=5)

        # Get workflow performance stats
        workflow_stats = await self._get_workflow_stats(uid)

        return {
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat(),
                "days": days,
            },
            "totals": totals,
            "daily": daily_stats,
            "recent_conversations": recent_conversations,
            "agent_stats": workflow_stats,  # Keep key name for frontend compatibility
            "comparison": {
                "messages_change": _calculate_percent_change(prev_messages, current_messages),
                "conversations_change": _calculate_percent_change(prev_conversations, current_conversations),
                "tokens_change": _calculate_percent_change(prev_tokens, current_tokens),
                "previous_period": {
                    "start": prev_start_date.isoformat(),
                    "end": prev_end_date.isoformat(),
                    "messages": prev_messages,
                    "conversations": prev_conversations,
                    "tokens": prev_tokens,
                },
                "current_period": {
                    "messages": current_messages,
                    "conversations": current_conversations,
                    "tokens": current_tokens,
                },
            },
        }

    def _get_date_expr(self, column):
        """Get a database-agnostic date expression for grouping by date."""
        # Check if we're using SQLite or PostgreSQL
        is_sqlite = "sqlite" in settings.database_url.lower()

        if is_sqlite:
            # SQLite: use date() function which returns YYYY-MM-DD format
            return func.date(column)
        else:
            # PostgreSQL: use to_char for consistent formatting
            return func.to_char(column, 'YYYY-MM-DD')

    async def _get_daily_stats(
        self,
        user_id: str,
        start_date: date,
        end_date: date,
    ) -> List[Dict[str, Any]]:
        """Get daily aggregated stats - computed on-the-fly from actual data."""
        # Convert to ISO strings for database compatibility
        start_str = start_date.isoformat()
        end_str = end_date.isoformat()

        # Get message counts grouped by date
        # Use database-agnostic date expression
        msg_date_expr = self._get_date_expr(Message.created_at)

        msg_stmt = (
            select(
                msg_date_expr.label("msg_date"),
                func.count(Message.id).label("count"),
            )
            .join(Conversation, Conversation.id == Message.conversation_id)
            .where(
                Conversation.user_id == user_id,
                msg_date_expr >= start_str,
                msg_date_expr <= end_str,
            )
            .group_by(msg_date_expr)
        )
        msg_result = await self.session.execute(msg_stmt)
        # Keys are now strings like "2026-01-14"
        msg_by_date = {row[0]: row[1] for row in msg_result.all()}

        # Get conversation counts grouped by date
        conv_date_expr = self._get_date_expr(Conversation.created_at)

        conv_stmt = (
            select(
                conv_date_expr.label("conv_date"),
                func.count(Conversation.id).label("count"),
            )
            .where(
                Conversation.user_id == user_id,
                conv_date_expr >= start_str,
                conv_date_expr <= end_str,
            )
            .group_by(conv_date_expr)
        )
        conv_result = await self.session.execute(conv_stmt)
        conv_by_date = {row[0]: row[1] for row in conv_result.all()}

        # Build daily stats list
        daily = []
        current = start_date
        while current <= end_date:
            date_key = current.isoformat()  # Match the string format from SQL
            messages = msg_by_date.get(date_key, 0)
            daily.append({
                "date": date_key,
                "conversations": conv_by_date.get(date_key, 0),
                "messages": messages,
                "tokens": messages * 100,  # Estimate ~100 tokens per message
            })
            current += timedelta(days=1)

        return daily

    async def _get_totals(self, user_id: str) -> Dict[str, int]:
        """Get total counts for user."""
        # Count agent_components (the "Agents" shown in sidebar)
        component_stmt = select(func.count()).select_from(AgentComponent).where(
            AgentComponent.user_id == user_id,
        )
        component_result = await self.session.execute(component_stmt)
        agent_count = component_result.scalar_one()

        # Count workflows
        workflow_stmt = select(func.count()).select_from(Workflow).where(
            Workflow.user_id == user_id,
        )
        workflow_result = await self.session.execute(workflow_stmt)
        workflow_count = workflow_result.scalar_one()

        # Count conversations
        conv_stmt = select(func.count()).select_from(Conversation).where(
            Conversation.user_id == user_id,
        )
        conv_result = await self.session.execute(conv_stmt)
        conversation_count = conv_result.scalar_one()

        # Get this month's messages
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        msg_stmt = (
            select(func.count())
            .select_from(Message)
            .join(Conversation, Conversation.id == Message.conversation_id)
            .where(
                Conversation.user_id == user_id,
                Message.created_at >= month_start,
            )
        )
        msg_result = await self.session.execute(msg_stmt)
        messages_this_month = msg_result.scalar_one()

        # Tokens: estimate based on message count (~100 tokens per message)
        tokens_this_month = messages_this_month * 100

        return {
            "agents": agent_count,
            "workflows": workflow_count,
            "conversations": conversation_count,
            "messages_this_month": messages_this_month,
            "tokens_this_month": tokens_this_month,
        }

    async def _get_recent_conversations(
        self,
        user_id: str,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """Get recent conversations."""
        stmt = (
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.updated_at.desc())
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        conversations = result.scalars().all()

        return [
            {
                "id": str(c.id),
                "title": c.title or "Untitled",
                "workflow_id": str(c.workflow_id) if c.workflow_id else None,
                "updated_at": c.updated_at.isoformat() if c.updated_at else None,
            }
            for c in conversations
        ]

    async def _get_workflow_stats(self, user_id: str) -> List[Dict[str, Any]]:
        """Get per-workflow statistics."""
        stmt = (
            select(
                Workflow.id,
                Workflow.name,
                func.count(Conversation.id).label("conversation_count"),
            )
            .outerjoin(Conversation, Conversation.workflow_id == Workflow.id)
            .where(
                Workflow.user_id == user_id,
            )
            .group_by(Workflow.id, Workflow.name)
            .order_by(func.count(Conversation.id).desc())
            .limit(10)
        )
        result = await self.session.execute(stmt)
        rows = result.all()

        return [
            {
                "id": str(row[0]),
                "name": row[1],
                "conversations": row[2],
            }
            for row in rows
        ]

    async def record_daily_stats(
        self,
        user_id: str,
        record_date: date = None,
    ) -> AnalyticsDaily:
        """
        Record or update daily analytics for a user.

        This can be called at the end of each day or on-demand.
        """
        if record_date is None:
            record_date = date.today()

        # Check if record exists
        stmt = select(AnalyticsDaily).where(
            AnalyticsDaily.user_id == user_id,
            AnalyticsDaily.record_date == record_date,
        )
        result = await self.session.execute(stmt)
        record = result.scalar_one_or_none()

        # Calculate stats for the day
        day_start = datetime.combine(record_date, datetime.min.time())
        day_end = datetime.combine(record_date, datetime.max.time())

        # Count conversations created today
        conv_stmt = select(func.count()).select_from(Conversation).where(
            Conversation.user_id == user_id,
            Conversation.created_at >= day_start,
            Conversation.created_at <= day_end,
        )
        conv_result = await self.session.execute(conv_stmt)
        conversations_count = conv_result.scalar_one()

        # Count messages today
        msg_stmt = (
            select(func.count())
            .select_from(Message)
            .join(Conversation, Conversation.id == Message.conversation_id)
            .where(
                Conversation.user_id == user_id,
                Message.created_at >= day_start,
                Message.created_at <= day_end,
            )
        )
        msg_result = await self.session.execute(msg_stmt)
        messages_count = msg_result.scalar_one()

        # Count agent components created today
        component_stmt = select(func.count()).select_from(AgentComponent).where(
            AgentComponent.user_id == user_id,
            AgentComponent.created_at >= day_start,
            AgentComponent.created_at <= day_end,
        )
        component_result = await self.session.execute(component_stmt)
        agents_created = component_result.scalar_one()

        # Count active agent components
        active_stmt = select(func.count()).select_from(AgentComponent).where(
            AgentComponent.user_id == user_id,
            AgentComponent.is_active == True,
        )
        active_result = await self.session.execute(active_stmt)
        agents_active = active_result.scalar_one()

        # Count workflows created today
        wf_stmt = select(func.count()).select_from(Workflow).where(
            Workflow.user_id == user_id,
            Workflow.created_at >= day_start,
            Workflow.created_at <= day_end,
        )
        wf_result = await self.session.execute(wf_stmt)
        workflows_created = wf_result.scalar_one()

        if record:
            record.conversations_count = conversations_count
            record.messages_count = messages_count
            record.agents_created = agents_created
            record.agents_active = agents_active
            record.workflows_created = workflows_created
        else:
            record = AnalyticsDaily(
                user_id=user_id,
                record_date=record_date,
                conversations_count=conversations_count,
                messages_count=messages_count,
                agents_created=agents_created,
                agents_active=agents_active,
                workflows_created=workflows_created,
            )
            self.session.add(record)

        await self.session.flush()
        return record
