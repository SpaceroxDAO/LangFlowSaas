"""
Billing and subscription endpoints.

Handles subscription management, usage tracking, AI credits, and Stripe webhooks.
"""
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime

from fastapi import APIRouter, HTTPException, Request, status, Query
from pydantic import BaseModel, Field

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.middleware.redis_rate_limit import check_rate_limit_with_user
from app.services.user_service import UserService
from app.services.billing_service import BillingService, BillingServiceError
from app.plans import (
    get_all_plans,
    get_plan,
    get_all_credit_packs,
    get_credit_pack,
    get_pricing_comparison,
    has_feature_access,
    MODEL_COSTS,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/billing", tags=["Billing"])


# =============================================================================
# Request/Response Models
# =============================================================================

class PlanResponse(BaseModel):
    """Response model for a pricing plan."""

    id: str
    name: str
    price_monthly: int = Field(..., description="Monthly price in cents")
    price_display: str
    price_yearly: int = Field(default=0, description="Yearly price in cents")
    yearly_price_display: str = ""
    yearly_savings_display: str = ""
    description: str
    features: List[str]
    limits: dict
    highlight: bool = False
    is_custom: bool = False


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
    billing_cycle: str = Field(default="monthly", description="Billing cycle: 'monthly' or 'yearly'")


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
            price_yearly=p.price_yearly,
            yearly_price_display=p.yearly_price_display,
            yearly_savings_display=p.yearly_savings_display,
            description=p.description,
            features=p.features,
            limits={
                "agents": p.limits.agents,
                "workflows": p.limits.workflows,
                "mcp_servers": p.limits.mcp_servers,
                "projects": p.limits.projects,
                "file_storage_mb": p.limits.file_storage_mb,
                "monthly_credits": p.limits.monthly_credits,
                "knowledge_files": p.limits.knowledge_files,
                "team_members": p.limits.team_members,
            },
            highlight=p.highlight,
            is_custom=p.is_custom,
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

    # Calculate usage from credits system
    credits_used = usage.get("credits_used", 0)
    agents_count = usage.get("agents_created", 0)
    workflows_count = usage.get("workflows_created", 0)

    return UsageResponse(
        messages_sent=usage.get("messages_sent", 0),
        tokens_used=usage.get("llm_tokens", 0),
        agents_count=agents_count,
        workflows_count=workflows_count,
        limits={
            "monthly_credits": plan.limits.monthly_credits,
            "agents": plan.limits.agents,
            "workflows": plan.limits.workflows,
        },
        usage_percent={
            "credits": min(
                100,
                int(credits_used / plan.limits.monthly_credits * 100)
                if plan.limits.monthly_credits > 0 else 0,
            ),
            "agents": min(
                100,
                int(agents_count / plan.limits.agents * 100)
                if plan.limits.agents > 0 else 0,
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
    checkout_request: CheckoutRequest,
    request: Request,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> CheckoutResponse:
    """Create Stripe checkout session for subscription."""
    # Rate limit billing requests to prevent abuse
    await check_rate_limit_with_user(request, user_id=clerk_user.user_id)

    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    try:
        checkout_url = await billing.create_checkout_session(
            user=user,
            plan_id=checkout_request.plan_id,
            success_url=checkout_request.success_url,
            cancel_url=checkout_request.cancel_url,
            billing_cycle=checkout_request.billing_cycle,
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
    portal_request: PortalRequest,
    request: Request,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> PortalResponse:
    """Create Stripe customer portal session."""
    # Rate limit billing requests to prevent abuse
    await check_rate_limit_with_user(request, user_id=clerk_user.user_id)

    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    try:
        portal_url = await billing.create_portal_session(
            user=user,
            return_url=portal_request.return_url,
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


# =============================================================================
# CREDITS ENDPOINTS
# =============================================================================

class CreditBalanceResponse(BaseModel):
    """Credit balance response."""
    balance: int
    monthly_credits: int
    purchased_credits: int
    credits_used_this_month: int
    credits_remaining: int
    reset_date: Optional[str] = None
    using_byo_key: bool = False


class CreditPackResponse(BaseModel):
    """Credit pack details."""
    id: str
    name: str
    credits: int
    price_cents: int
    price_display: str
    price_per_credit: float
    popular: bool = False


class PurchaseCreditsRequest(BaseModel):
    """Request to purchase credits."""
    pack_id: str
    success_url: str
    cancel_url: str


class PurchaseCreditsResponse(BaseModel):
    """Response with checkout URL."""
    checkout_url: str
    session_id: str


class AutoTopUpRequest(BaseModel):
    """Auto top-up settings request."""
    enabled: bool
    threshold_credits: int = Field(default=100, ge=50, le=1000)
    top_up_pack_id: str = "credits_5500"
    max_monthly_top_ups: int = Field(default=3, ge=1, le=10)


class AutoTopUpResponse(BaseModel):
    """Auto top-up settings response."""
    enabled: bool
    threshold_credits: int
    top_up_pack_id: str
    top_up_pack_name: str
    top_up_credits: int
    top_up_price_display: str
    max_monthly_top_ups: int
    top_ups_this_month: int
    can_top_up: bool


class SpendCapRequest(BaseModel):
    """Spend cap settings request."""
    enabled: bool
    max_monthly_spend_cents: int = Field(default=10000, ge=500, le=100000)


class SpendCapResponse(BaseModel):
    """Spend cap settings response."""
    enabled: bool
    max_monthly_spend_cents: int
    max_monthly_spend_display: str
    current_month_spend_cents: int
    current_month_spend_display: str
    spend_remaining_cents: int
    spend_remaining_display: str
    at_limit: bool


class ModelCostResponse(BaseModel):
    """Model credit cost info."""
    model_id: str
    display_name: str
    provider: str
    credits_per_1k_input: float
    credits_per_1k_output: float
    supports_byo_key: bool


class PricingComparisonResponse(BaseModel):
    """Pricing comparison table."""
    categories: List[Dict[str, Any]]
    plans: List[Dict[str, Any]]


class InvoiceResponse(BaseModel):
    """Invoice details."""
    id: str
    number: Optional[str] = None
    date: str
    amount_cents: int
    amount_display: str
    status: str
    description: str
    pdf_url: Optional[str] = None
    hosted_invoice_url: Optional[str] = None


class InvoiceListResponse(BaseModel):
    """List of invoices."""
    invoices: List[InvoiceResponse]
    has_more: bool = False


@router.get(
    "/credits/balance",
    response_model=CreditBalanceResponse,
    summary="Get credit balance",
    description="Get current AI credit balance and usage.",
)
async def get_credit_balance(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> CreditBalanceResponse:
    """Get current credit balance."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    balance = await billing.get_credit_balance(str(user.id))
    plan = await billing.get_plan_for_user(str(user.id))

    return CreditBalanceResponse(
        balance=balance.get("balance", 0),
        monthly_credits=plan.limits.monthly_credits,
        purchased_credits=balance.get("purchased_credits", 0),
        credits_used_this_month=balance.get("credits_used", 0),
        credits_remaining=balance.get("credits_remaining", plan.limits.monthly_credits),
        reset_date=balance.get("reset_date"),
        using_byo_key=balance.get("using_byo_key", False),
    )


@router.get(
    "/credits/packs",
    response_model=List[CreditPackResponse],
    summary="List credit packs",
    description="Get all available credit packs for purchase.",
)
async def list_credit_packs(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> List[CreditPackResponse]:
    """List available credit packs."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    # Check if user can buy credits
    sub = await billing.get_or_create_subscription(user)
    if not has_feature_access(sub.plan_id, "buy_credits"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Credit purchases require Individual or Business plan",
        )

    packs = get_all_credit_packs()
    return [
        CreditPackResponse(
            id=p.id,
            name=p.name,
            credits=p.credits,
            price_cents=p.price_cents,
            price_display=p.price_display,
            price_per_credit=p.price_per_credit,
            popular=p.popular,
        )
        for p in packs
    ]


@router.post(
    "/credits/purchase",
    response_model=PurchaseCreditsResponse,
    summary="Purchase credits",
    description="Create a Stripe checkout session to purchase a credit pack.",
)
async def purchase_credits(
    request: PurchaseCreditsRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> PurchaseCreditsResponse:
    """Purchase a credit pack."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    # Check if user can buy credits
    sub = await billing.get_or_create_subscription(user)
    if not has_feature_access(sub.plan_id, "buy_credits"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Credit purchases require Individual or Business plan",
        )

    # Validate pack exists
    pack = get_credit_pack(request.pack_id)
    if not pack:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid credit pack: {request.pack_id}",
        )

    try:
        checkout = await billing.create_credit_checkout(
            user=user,
            pack_id=request.pack_id,
            success_url=request.success_url,
            cancel_url=request.cancel_url,
        )
        await session.commit()
        return PurchaseCreditsResponse(
            checkout_url=checkout["url"],
            session_id=checkout["session_id"],
        )

    except BillingServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/credits/auto-top-up",
    response_model=AutoTopUpResponse,
    summary="Get auto top-up settings",
    description="Get current auto top-up configuration.",
)
async def get_auto_top_up(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> AutoTopUpResponse:
    """Get auto top-up settings."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    settings = await billing.get_auto_top_up_settings(str(user.id))
    pack = get_credit_pack(settings.get("top_up_pack_id", "credits_5500"))

    return AutoTopUpResponse(
        enabled=settings.get("enabled", False),
        threshold_credits=settings.get("threshold_credits", 100),
        top_up_pack_id=settings.get("top_up_pack_id", "credits_5500"),
        top_up_pack_name=pack.name if pack else "5,500 Credits",
        top_up_credits=pack.credits if pack else 5500,
        top_up_price_display=pack.price_display if pack else "$25",
        max_monthly_top_ups=settings.get("max_monthly_top_ups", 3),
        top_ups_this_month=settings.get("top_ups_this_month", 0),
        can_top_up=settings.get("can_top_up", True),
    )


@router.put(
    "/credits/auto-top-up",
    response_model=AutoTopUpResponse,
    summary="Update auto top-up settings",
    description="Update auto top-up configuration.",
)
async def update_auto_top_up(
    request: AutoTopUpRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> AutoTopUpResponse:
    """Update auto top-up settings."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    # Check if user can use auto top-up
    sub = await billing.get_or_create_subscription(user)
    if not has_feature_access(sub.plan_id, "auto_top_up"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Auto top-up requires Individual or Business plan",
        )

    # Validate pack exists
    pack = get_credit_pack(request.top_up_pack_id)
    if not pack:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid credit pack: {request.top_up_pack_id}",
        )

    settings = await billing.update_auto_top_up_settings(
        user_id=str(user.id),
        enabled=request.enabled,
        threshold_credits=request.threshold_credits,
        top_up_pack_id=request.top_up_pack_id,
        max_monthly_top_ups=request.max_monthly_top_ups,
    )
    await session.commit()

    return AutoTopUpResponse(
        enabled=settings.get("enabled", False),
        threshold_credits=settings.get("threshold_credits", 100),
        top_up_pack_id=settings.get("top_up_pack_id", "credits_5500"),
        top_up_pack_name=pack.name,
        top_up_credits=pack.credits,
        top_up_price_display=pack.price_display,
        max_monthly_top_ups=settings.get("max_monthly_top_ups", 3),
        top_ups_this_month=settings.get("top_ups_this_month", 0),
        can_top_up=settings.get("can_top_up", True),
    )


@router.get(
    "/credits/spend-cap",
    response_model=SpendCapResponse,
    summary="Get spend cap settings",
    description="Get current monthly spend cap configuration.",
)
async def get_spend_cap(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> SpendCapResponse:
    """Get spend cap settings."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    settings = await billing.get_spend_cap_settings(str(user.id))

    max_spend = settings.get("max_monthly_spend_cents", 10000)
    current_spend = settings.get("current_month_spend_cents", 0)
    remaining = max(0, max_spend - current_spend)

    return SpendCapResponse(
        enabled=settings.get("enabled", False),
        max_monthly_spend_cents=max_spend,
        max_monthly_spend_display=f"${max_spend / 100:.2f}",
        current_month_spend_cents=current_spend,
        current_month_spend_display=f"${current_spend / 100:.2f}",
        spend_remaining_cents=remaining,
        spend_remaining_display=f"${remaining / 100:.2f}",
        at_limit=current_spend >= max_spend if settings.get("enabled", False) else False,
    )


@router.put(
    "/credits/spend-cap",
    response_model=SpendCapResponse,
    summary="Update spend cap settings",
    description="Update monthly spend cap configuration.",
)
async def update_spend_cap(
    request: SpendCapRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> SpendCapResponse:
    """Update spend cap settings."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    settings = await billing.update_spend_cap_settings(
        user_id=str(user.id),
        enabled=request.enabled,
        max_monthly_spend_cents=request.max_monthly_spend_cents,
    )
    await session.commit()

    max_spend = settings.get("max_monthly_spend_cents", 10000)
    current_spend = settings.get("current_month_spend_cents", 0)
    remaining = max(0, max_spend - current_spend)

    return SpendCapResponse(
        enabled=settings.get("enabled", False),
        max_monthly_spend_cents=max_spend,
        max_monthly_spend_display=f"${max_spend / 100:.2f}",
        current_month_spend_cents=current_spend,
        current_month_spend_display=f"${current_spend / 100:.2f}",
        spend_remaining_cents=remaining,
        spend_remaining_display=f"${remaining / 100:.2f}",
        at_limit=current_spend >= max_spend if settings.get("enabled", False) else False,
    )


@router.get(
    "/invoices",
    response_model=InvoiceListResponse,
    summary="Get invoice history",
    description="Get billing invoice history from Stripe.",
)
async def get_invoice_history(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    limit: int = Query(default=10, ge=1, le=100, description="Number of invoices to return"),
) -> InvoiceListResponse:
    """Get invoice history."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    invoices = await billing.get_invoices(str(user.id), limit=limit)

    return InvoiceListResponse(
        invoices=[
            InvoiceResponse(
                id=inv.get("id", ""),
                number=inv.get("number"),
                date=inv.get("date", ""),
                amount_cents=inv.get("amount_cents", 0),
                amount_display=inv.get("amount_display", "$0.00"),
                status=inv.get("status", ""),
                description=inv.get("description", ""),
                pdf_url=inv.get("pdf_url"),
                hosted_invoice_url=inv.get("hosted_invoice_url"),
            )
            for inv in invoices
        ],
        has_more=len(invoices) == limit,
    )


@router.get(
    "/credits/models",
    response_model=List[ModelCostResponse],
    summary="List model costs",
    description="Get credit costs for all available AI models.",
)
async def list_model_costs() -> List[ModelCostResponse]:
    """List credit costs for all models."""
    return [
        ModelCostResponse(
            model_id=m.model_id,
            display_name=m.display_name,
            provider=m.provider,
            credits_per_1k_input=m.credits_per_1k_input,
            credits_per_1k_output=m.credits_per_1k_output,
            supports_byo_key=m.supports_byo_key,
        )
        for m in MODEL_COSTS.values()
    ]


@router.get(
    "/pricing/comparison",
    response_model=PricingComparisonResponse,
    summary="Get pricing comparison",
    description="Get full pricing comparison table for all plans.",
)
async def get_pricing_comparison_table() -> PricingComparisonResponse:
    """Get pricing comparison table."""
    categories = get_pricing_comparison()
    plans = get_all_plans()

    return PricingComparisonResponse(
        categories=categories,
        plans=[
            {
                "id": p.id,
                "name": p.name,
                "price_monthly": p.price_monthly,
                "price_display": p.price_display,
                "description": p.description,
                "features": p.features,
                "is_custom": p.is_custom,
                "highlight": p.highlight,
                "limits": {
                    "agents": p.limits.agents,
                    "workflows": p.limits.workflows,
                    "mcp_servers": p.limits.mcp_servers,
                    "projects": p.limits.projects,
                    "file_storage_mb": p.limits.file_storage_mb,
                    "monthly_credits": p.limits.monthly_credits,
                    "knowledge_files": p.limits.knowledge_files,
                    "team_members": p.limits.team_members,
                },
            }
            for p in plans
        ],
    )


@router.get(
    "/overview",
    summary="Get billing overview",
    description="Get complete billing overview including credits, subscription, and usage.",
)
async def get_billing_overview(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> Dict[str, Any]:
    """Get complete billing overview."""
    user = await get_user_from_clerk(clerk_user, session)
    billing = BillingService(session)

    # Get all billing data in parallel-ish manner
    sub = await billing.get_or_create_subscription(user)
    plan = get_plan(sub.plan_id)
    usage = await billing.get_usage_summary(str(user.id))
    balance = await billing.get_credit_balance(str(user.id))
    auto_top_up = await billing.get_auto_top_up_settings(str(user.id))
    spend_cap = await billing.get_spend_cap_settings(str(user.id))

    # Calculate percentages
    agents_count = usage.get("agents_created", 0)
    workflows_count = usage.get("workflows_created", 0)

    def calc_percent(used: int, limit: int) -> int:
        if limit == -1:  # Unlimited
            return 0
        if limit == 0:
            return 100 if used > 0 else 0
        return min(100, int(used / limit * 100))

    return {
        "subscription": {
            "plan_id": sub.plan_id,
            "plan_name": plan.name,
            "status": sub.status,
            "is_paid": sub.is_paid,
            "current_period_end": sub.current_period_end.isoformat() if sub.current_period_end else None,
            "cancel_at_period_end": sub.cancel_at_period_end,
        },
        "plan": {
            "id": plan.id,
            "name": plan.name,
            "price_display": plan.price_display,
            "description": plan.description,
            "features": plan.features,
            "is_custom": plan.is_custom,
            "limits": {
                "agents": plan.limits.agents,
                "workflows": plan.limits.workflows,
                "monthly_credits": plan.limits.monthly_credits,
                "knowledge_files": plan.limits.knowledge_files,
                "team_members": plan.limits.team_members,
            },
        },
        "credits": {
            "balance": balance.get("balance", 0),
            "monthly_credits": plan.limits.monthly_credits,
            "purchased_credits": balance.get("purchased_credits", 0),
            "credits_used_this_month": balance.get("credits_used", 0),
            "credits_remaining": balance.get("credits_remaining", plan.limits.monthly_credits),
            "reset_date": balance.get("reset_date"),
            "using_byo_key": balance.get("using_byo_key", False),
        },
        "usage": {
            "agents": {
                "used": agents_count,
                "limit": plan.limits.agents,
                "percent": calc_percent(agents_count, plan.limits.agents),
            },
            "workflows": {
                "used": workflows_count,
                "limit": plan.limits.workflows,
                "percent": calc_percent(workflows_count, plan.limits.workflows),
            },
            "credits": {
                "used": balance.get("credits_used", 0),
                "limit": plan.limits.monthly_credits,
                "percent": calc_percent(balance.get("credits_used", 0), plan.limits.monthly_credits),
            },
        },
        "auto_top_up": {
            "enabled": auto_top_up.get("enabled", False),
            "threshold_credits": auto_top_up.get("threshold_credits", 100),
            "top_up_pack_id": auto_top_up.get("top_up_pack_id", "credits_5500"),
            "top_ups_this_month": auto_top_up.get("top_ups_this_month", 0),
        },
        "spend_cap": {
            "enabled": spend_cap.get("enabled", False),
            "max_monthly_spend_cents": spend_cap.get("max_monthly_spend_cents", 10000),
            "current_month_spend_cents": spend_cap.get("current_month_spend_cents", 0),
        },
        "feature_access": {
            "can_buy_credits": has_feature_access(sub.plan_id, "buy_credits"),
            "can_use_auto_top_up": has_feature_access(sub.plan_id, "auto_top_up"),
            "canvas_editor": has_feature_access(sub.plan_id, "canvas_editor"),
            "export_agents": has_feature_access(sub.plan_id, "export_agents"),
            "team_collaboration": has_feature_access(sub.plan_id, "team_collaboration"),
            "sso": has_feature_access(sub.plan_id, "sso"),
        },
    }
