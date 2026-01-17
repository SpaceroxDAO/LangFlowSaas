"""
Dashboard API endpoints for analytics and metrics.
"""
import csv
import io
import logging
from datetime import date
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.services.user_service import UserService
from app.services.analytics_service import AnalyticsService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# =============================================================================
# Response Models
# =============================================================================

class DailyMetric(BaseModel):
    """Daily metric data point."""

    date: str
    conversations: int = 0
    messages: int = 0
    tokens: int = 0


class TotalsResponse(BaseModel):
    """Total counts response."""

    agents: int = 0
    agent_components: int = 0
    workflows: int = 0
    conversations: int = 0
    messages_this_month: int = 0
    tokens_this_month: int = 0


class RecentConversation(BaseModel):
    """Recent conversation summary."""

    id: str
    title: str
    agent_id: Optional[str] = None
    workflow_id: Optional[str] = None
    updated_at: Optional[str] = None


class AgentStat(BaseModel):
    """Per-agent statistics."""

    id: str
    name: str
    conversations: int = 0


class PeriodInfo(BaseModel):
    """Period information."""

    start: str
    end: str
    days: int


class PeriodTotals(BaseModel):
    """Period totals for comparison."""

    start: str
    end: str
    messages: int = 0
    conversations: int = 0
    tokens: int = 0


class ComparisonResponse(BaseModel):
    """Period comparison data."""

    messages_change: float = 0.0
    conversations_change: float = 0.0
    tokens_change: float = 0.0
    previous_period: PeriodTotals
    current_period: PeriodTotals


class DashboardStatsResponse(BaseModel):
    """Complete dashboard statistics response."""

    period: PeriodInfo
    totals: TotalsResponse
    daily: List[DailyMetric]
    recent_conversations: List[RecentConversation]
    agent_stats: List[AgentStat]
    comparison: Optional[ComparisonResponse] = None


# =============================================================================
# Helper Functions
# =============================================================================

async def get_user_from_clerk(clerk_user: CurrentUser, session: AsyncSessionDep):
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


# =============================================================================
# Endpoints
# =============================================================================

@router.get(
    "/stats",
    response_model=DashboardStatsResponse,
    summary="Get dashboard statistics",
    description="Get aggregated analytics for the dashboard. Use days for preset periods, or start_date/end_date for custom ranges.",
)
async def get_dashboard_stats(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    days: int = Query(default=30, ge=1, le=365, description="Number of days for preset periods"),
    start_date: Optional[date] = Query(default=None, description="Custom range start (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(default=None, description="Custom range end (YYYY-MM-DD)"),
) -> DashboardStatsResponse:
    """Get dashboard statistics for the authenticated user."""
    user = await get_user_from_clerk(clerk_user, session)
    analytics = AnalyticsService(session)

    # Validate custom date range if provided
    if start_date and end_date:
        if start_date > end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="start_date must be before or equal to end_date",
            )
        # Calculate days from custom range
        calculated_days = (end_date - start_date).days + 1
        stats = await analytics.get_dashboard_stats(
            user_id=str(user.id),
            days=calculated_days,
            custom_start=start_date,
            custom_end=end_date,
        )
    else:
        stats = await analytics.get_dashboard_stats(
            user_id=str(user.id),
            days=days,
        )

    # Build comparison response if available
    comparison = None
    if "comparison" in stats:
        comp = stats["comparison"]
        comparison = ComparisonResponse(
            messages_change=comp["messages_change"],
            conversations_change=comp["conversations_change"],
            tokens_change=comp["tokens_change"],
            previous_period=PeriodTotals(
                start=comp["previous_period"]["start"],
                end=comp["previous_period"]["end"],
                messages=comp["previous_period"]["messages"],
                conversations=comp["previous_period"]["conversations"],
                tokens=comp["previous_period"]["tokens"],
            ),
            current_period=PeriodTotals(
                start=stats["period"]["start"],
                end=stats["period"]["end"],
                messages=comp["current_period"]["messages"],
                conversations=comp["current_period"]["conversations"],
                tokens=comp["current_period"]["tokens"],
            ),
        )

    return DashboardStatsResponse(
        period=PeriodInfo(**stats["period"]),
        totals=TotalsResponse(**stats["totals"]),
        daily=[DailyMetric(**d) for d in stats["daily"]],
        recent_conversations=[RecentConversation(**c) for c in stats["recent_conversations"]],
        agent_stats=[AgentStat(**a) for a in stats["agent_stats"]],
        comparison=comparison,
    )


@router.get(
    "/totals",
    response_model=TotalsResponse,
    summary="Get total counts",
    description="Get current total counts for all resources.",
)
async def get_totals(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> TotalsResponse:
    """Get total counts for the authenticated user."""
    user = await get_user_from_clerk(clerk_user, session)
    analytics = AnalyticsService(session)

    stats = await analytics.get_dashboard_stats(
        user_id=str(user.id),
        days=1,
    )

    return TotalsResponse(**stats["totals"])


@router.get(
    "/export",
    summary="Export analytics data",
    description="Export analytics data as CSV or JSON.",
)
async def export_analytics(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    days: int = Query(default=30, ge=1, le=365, description="Number of days to export"),
    format: str = Query(default="csv", description="Export format (csv or json)"),
    start_date: Optional[date] = Query(default=None, description="Custom range start (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(default=None, description="Custom range end (YYYY-MM-DD)"),
) -> StreamingResponse:
    """Export analytics data for the authenticated user."""
    user = await get_user_from_clerk(clerk_user, session)
    analytics = AnalyticsService(session)

    # Use custom date range if provided
    if start_date and end_date:
        if start_date > end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="start_date must be before or equal to end_date",
            )
        calculated_days = (end_date - start_date).days + 1
        stats = await analytics.get_dashboard_stats(
            user_id=str(user.id),
            days=calculated_days,
            custom_start=start_date,
            custom_end=end_date,
        )
        filename_suffix = f"{start_date}_{end_date}"
    else:
        stats = await analytics.get_dashboard_stats(
            user_id=str(user.id),
            days=days,
        )
        filename_suffix = f"{days}d"

    if format == "json":
        import json
        content = json.dumps(stats, indent=2)
        return StreamingResponse(
            iter([content]),
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename=analytics_{filename_suffix}.json"
            },
        )

    # Default to CSV
    output = io.StringIO()
    writer = csv.writer(output)

    # Write header
    writer.writerow(["Date", "Conversations", "Messages", "Tokens"])

    # Write daily data
    for day in stats["daily"]:
        writer.writerow([
            day["date"],
            day["conversations"],
            day["messages"],
            day["tokens"],
        ])

    # Add summary row
    writer.writerow([])
    writer.writerow(["Summary"])
    writer.writerow(["Period", f'{stats["period"]["start"]} to {stats["period"]["end"]}'])
    writer.writerow(["Total Messages", stats["comparison"]["current_period"]["messages"]])
    writer.writerow(["Total Conversations", stats["comparison"]["current_period"]["conversations"]])
    writer.writerow(["Total Tokens", stats["comparison"]["current_period"]["tokens"]])

    if stats.get("comparison"):
        writer.writerow([])
        writer.writerow(["Comparison to Previous Period"])
        writer.writerow(["Previous Period", f'{stats["comparison"]["previous_period"]["start"]} to {stats["comparison"]["previous_period"]["end"]}'])
        writer.writerow(["Messages Change", f'{stats["comparison"]["messages_change"]}%'])
        writer.writerow(["Conversations Change", f'{stats["comparison"]["conversations_change"]}%'])
        writer.writerow(["Tokens Change", f'{stats["comparison"]["tokens_change"]}%'])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=analytics_{filename_suffix}.csv"
        },
    )
