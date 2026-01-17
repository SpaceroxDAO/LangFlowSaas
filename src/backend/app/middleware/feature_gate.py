"""
Feature gating middleware based on subscription tier.

Provides decorators and dependencies for restricting features
by plan and enforcing usage limits.
"""
import logging
from functools import wraps
from typing import Callable, List, Optional

from fastapi import HTTPException, status

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.services.billing_service import BillingService
from app.services.user_service import UserService

logger = logging.getLogger(__name__)


class FeatureGateError(Exception):
    """Exception raised when feature access is denied."""
    pass


async def check_plan_access(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    allowed_plans: List[str],
    feature_name: str = "this feature",
) -> None:
    """
    Check if user's plan allows access to a feature.

    Raises HTTPException if access denied.
    """
    user_service = UserService(session)
    user = await user_service.get_or_create_from_clerk(clerk_user)

    billing = BillingService(session)
    subscription = await billing.get_or_create_subscription(user)

    if subscription.plan_id not in allowed_plans:
        allowed_names = ", ".join(p.title() for p in allowed_plans)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"{feature_name} requires a {allowed_names} plan. Please upgrade to access it.",
        )


async def check_usage_limit(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    limit_type: str,
    increment: int = 1,
) -> None:
    """
    Check if user is within usage limits before allowing action.

    Raises HTTPException if limit exceeded.
    """
    user_service = UserService(session)
    user = await user_service.get_or_create_from_clerk(clerk_user)

    billing = BillingService(session)
    is_within, current, max_limit = await billing.check_limit(
        str(user.id), limit_type
    )

    # Check if this action would exceed the limit
    if current + increment > max_limit:
        # Format the limit type for display
        limit_display = limit_type.replace("_", " ").title()
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"You've reached your {limit_display} limit ({current}/{max_limit}). Please upgrade your plan to continue.",
        )


def require_plan(*allowed_plans: str, feature_name: str = "This feature"):
    """
    Decorator to require specific plan(s) for an endpoint.

    Usage:
        @router.post("/agents/{agent_id}/export")
        @require_plan("pro", "team", feature_name="Agent export")
        async def export_agent(...):
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, session: AsyncSessionDep, clerk_user: CurrentUser, **kwargs):
            await check_plan_access(
                session=session,
                clerk_user=clerk_user,
                allowed_plans=list(allowed_plans),
                feature_name=feature_name,
            )
            return await func(*args, session=session, clerk_user=clerk_user, **kwargs)
        return wrapper
    return decorator


def enforce_limit(limit_type: str, increment: int = 1):
    """
    Decorator to check usage limits before allowing action.

    Usage:
        @router.post("/agents")
        @enforce_limit("agents", increment=1)
        async def create_agent(...):
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, session: AsyncSessionDep, clerk_user: CurrentUser, **kwargs):
            await check_usage_limit(
                session=session,
                clerk_user=clerk_user,
                limit_type=limit_type,
                increment=increment,
            )
            return await func(*args, session=session, clerk_user=clerk_user, **kwargs)
        return wrapper
    return decorator


# Convenience functions for common checks

async def require_pro_or_team(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    feature_name: str = "This feature",
) -> None:
    """Require Pro or Team plan."""
    await check_plan_access(
        session=session,
        clerk_user=clerk_user,
        allowed_plans=["pro", "team"],
        feature_name=feature_name,
    )


async def require_team(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    feature_name: str = "This feature",
) -> None:
    """Require Team plan."""
    await check_plan_access(
        session=session,
        clerk_user=clerk_user,
        allowed_plans=["team"],
        feature_name=feature_name,
    )
