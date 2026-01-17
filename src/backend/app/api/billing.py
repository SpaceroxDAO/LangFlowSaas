"""
Billing and subscription endpoints.

Handles subscription management, usage tracking, and Stripe webhooks.
"""
import logging
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, Field

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.services.user_service import UserService
from app.services.billing_service import BillingService, BillingServiceError
from app.plans import get_all_plans, get_plan

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/billing", tags=["Billing"])


# =============================================================================
# Request/Response Models
# =============================================================================

class PlanResponse(BaseModel):
    """Response model for a pricing plan."""

    id: str
    name: str
    price_monthly: int = Field(..., description="Price in cents")
    price_display: str
    description: str
    features: List[str]
    limits: dict


class SubscriptionResponse(BaseModel):
    """Response model for user subscription."""

    plan_id: str
    plan_name: str
    status: str
    current_period_end: Optional[str] = None
    cancel_at_period_end: bool = False
    is_paid: bool = False


class UsageResponse(BaseModel):
    """Response model for usage statistics."""

    messages_sent: int = 0
    tokens_used: int = 0
    agents_count: int = 0
    workflows_count: int = 0
    limits: dict
    usage_percent: dict


class CheckoutRequest(BaseModel):
    """Request model for creating checkout session."""

    plan_id: str
    success_url: str
    cancel_url: str


class CheckoutResponse(BaseModel):
    """Response model for checkout session."""

    checkout_url: str


class PortalRequest(BaseModel):
    """Request model for customer portal session."""

    return_url: str


class PortalResponse(BaseModel):
    """Response model for portal session."""

    portal_url: str


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
    "/plans",
    response_model=List[PlanResponse],
    summary="List pricing plans",
    description="Get all available subscription plans.",
)
async def list_plans() -> List[PlanResponse]:
    """List all available pricing plans."""
    plans = get_all_plans()
    return [
        PlanResponse(
            id=p.id,
            name=p.name,
            price_monthly=p.price_monthly,
            price_display=p.price_display,
            description=p.description,
            features=p.features,
            limits={
                "agents": p.limits.agents,
                "messages_per_month": p.limits.messages_per_month,
                "tokens_per_month": p.limits.tokens_per_month,
                "workflows": p.limits.workflows,
                "mcp_servers": p.limits.mcp_servers,
                "projects": p.limits.projects,
                "file_storage_mb": p.limits.file_storage_mb,
            },
        )
        for p in plans
    ]


@router.get(
    "/subscription",
    response_model=SubscriptionResponse,
    summary="Get current subscription",
    description="Get the current user's subscription status.",
)
async def get_subscription(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> SubscriptionResponse:
    """Get current user's subscription."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)
    sub = await billing.get_or_create_subscription(user)
    plan = get_plan(sub.plan_id)

    return SubscriptionResponse(
        plan_id=sub.plan_id,
        plan_name=plan.name,
        status=sub.status,
        current_period_end=(
            sub.current_period_end.isoformat() if sub.current_period_end else None
        ),
        cancel_at_period_end=sub.cancel_at_period_end,
        is_paid=sub.is_paid,
    )


@router.get(
    "/usage",
    response_model=UsageResponse,
    summary="Get usage statistics",
    description="Get current billing period usage and limits.",
)
async def get_usage(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> UsageResponse:
    """Get current usage statistics."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    usage = await billing.get_usage_summary(str(user.id))
    plan = await billing.get_plan_for_user(str(user.id))

    # Calculate usage percentages
    messages_sent = usage.get("messages_sent", 0)
    tokens_used = usage.get("llm_tokens", 0)
    agents_count = usage.get("agents_created", 0)
    workflows_count = usage.get("workflows_created", 0)

    return UsageResponse(
        messages_sent=messages_sent,
        tokens_used=tokens_used,
        agents_count=agents_count,
        workflows_count=workflows_count,
        limits={
            "messages_per_month": plan.limits.messages_per_month,
            "tokens_per_month": plan.limits.tokens_per_month,
            "agents": plan.limits.agents,
            "workflows": plan.limits.workflows,
        },
        usage_percent={
            "messages": min(
                100,
                int(messages_sent / plan.limits.messages_per_month * 100)
                if plan.limits.messages_per_month > 0 else 0,
            ),
            "tokens": min(
                100,
                int(tokens_used / plan.limits.tokens_per_month * 100)
                if plan.limits.tokens_per_month > 0 else 0,
            ),
        },
    )


@router.post(
    "/checkout",
    response_model=CheckoutResponse,
    summary="Create checkout session",
    description="Create a Stripe checkout session for subscription upgrade.",
)
async def create_checkout(
    request: CheckoutRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> CheckoutResponse:
    """Create Stripe checkout session for subscription."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    try:
        checkout_url = await billing.create_checkout_session(
            user=user,
            plan_id=request.plan_id,
            success_url=request.success_url,
            cancel_url=request.cancel_url,
        )
        await session.commit()
        return CheckoutResponse(checkout_url=checkout_url)

    except BillingServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/portal",
    response_model=PortalResponse,
    summary="Create portal session",
    description="Create a Stripe customer portal session for subscription management.",
)
async def create_portal(
    request: PortalRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> PortalResponse:
    """Create Stripe customer portal session."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    try:
        portal_url = await billing.create_portal_session(
            user=user,
            return_url=request.return_url,
        )
        return PortalResponse(portal_url=portal_url)

    except BillingServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/webhook",
    status_code=status.HTTP_200_OK,
    summary="Stripe webhook",
    description="Handle Stripe webhook events.",
)
async def stripe_webhook(
    request: Request,
    session: AsyncSessionDep,
):
    """Handle Stripe webhook events."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing stripe-signature header",
        )

    billing = BillingService(session)

    try:
        result = await billing.handle_webhook(payload, sig_header)
        await session.commit()
        return result

    except BillingServiceError as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
