"""
Pydantic schemas for AI credits and billing.

Handles credit balance, purchases, usage, and settings.
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator


# =============================================================================
# CREDIT BALANCE
# =============================================================================

class CreditBalanceResponse(BaseModel):
    """Current credit balance for a user."""
    balance: int = Field(..., description="Current credit balance")
    monthly_credits: int = Field(..., description="Credits included with plan")
    purchased_credits: int = Field(..., description="Additional purchased credits")
    credits_used_this_month: int = Field(..., description="Credits consumed this billing period")
    credits_remaining: int = Field(..., description="Usable credits remaining")
    reset_date: Optional[datetime] = Field(None, description="When monthly credits reset")
    using_byo_key: bool = Field(False, description="User has BYO API keys (credits not consumed)")


class CreditUsageItem(BaseModel):
    """Individual credit usage record."""
    id: str
    timestamp: datetime
    model: str
    model_display_name: str
    input_tokens: int
    output_tokens: int
    credits_used: int
    agent_id: Optional[str] = None
    agent_name: Optional[str] = None
    workflow_id: Optional[str] = None
    workflow_name: Optional[str] = None


class CreditUsageResponse(BaseModel):
    """Credit usage history."""
    items: List[CreditUsageItem]
    total_credits_used: int
    total_items: int
    page: int = 1
    page_size: int = 50
    has_more: bool = False


class CreditUsageSummary(BaseModel):
    """Summary of credit usage by period or model."""
    period: str  # "day", "week", "month"
    start_date: datetime
    end_date: datetime
    total_credits: int
    by_model: Dict[str, int]  # model_id -> credits
    by_agent: Dict[str, int]  # agent_id -> credits


# =============================================================================
# CREDIT PACKS
# =============================================================================

class CreditPackResponse(BaseModel):
    """Credit pack available for purchase."""
    id: str
    name: str
    credits: int
    price_cents: int
    price_display: str
    price_per_credit: float
    popular: bool = False


class CreditPacksResponse(BaseModel):
    """All available credit packs."""
    packs: List[CreditPackResponse]


# =============================================================================
# CREDIT PURCHASE
# =============================================================================

class PurchaseCreditsRequest(BaseModel):
    """Request to purchase a credit pack."""
    pack_id: str = Field(..., description="Credit pack ID to purchase")
    success_url: Optional[str] = Field(None, description="Redirect URL on success")
    cancel_url: Optional[str] = Field(None, description="Redirect URL on cancel")


class PurchaseCreditsResponse(BaseModel):
    """Response with Stripe checkout session."""
    checkout_url: str = Field(..., description="Stripe checkout URL")
    session_id: str = Field(..., description="Stripe session ID")


class CreditPurchaseRecord(BaseModel):
    """Record of a credit purchase."""
    id: str
    pack_id: str
    pack_name: str
    credits: int
    amount_cents: int
    status: str  # "pending", "completed", "failed", "refunded"
    stripe_session_id: Optional[str] = None
    purchased_at: datetime


class CreditPurchasesResponse(BaseModel):
    """List of credit purchases."""
    purchases: List[CreditPurchaseRecord]
    total_spent_cents: int
    total_credits_purchased: int


# =============================================================================
# AUTO TOP-UP
# =============================================================================

class AutoTopUpSettingsRequest(BaseModel):
    """Update auto top-up settings."""
    enabled: bool = Field(..., description="Enable/disable auto top-up")
    threshold_credits: int = Field(
        default=100,
        ge=50,
        le=1000,
        description="Trigger when balance falls below this"
    )
    top_up_pack_id: str = Field(
        default="credits_5500",
        description="Credit pack to purchase on trigger"
    )
    max_monthly_top_ups: int = Field(
        default=3,
        ge=1,
        le=10,
        description="Maximum auto top-ups per month"
    )

    @field_validator('top_up_pack_id')
    @classmethod
    def validate_pack_id(cls, v: str) -> str:
        valid_packs = ["credits_2000", "credits_5500", "credits_12500"]
        if v not in valid_packs:
            raise ValueError(f"Invalid pack_id. Must be one of: {valid_packs}")
        return v


class AutoTopUpSettingsResponse(BaseModel):
    """Current auto top-up settings."""
    enabled: bool
    threshold_credits: int
    top_up_pack_id: str
    top_up_pack_name: str
    top_up_credits: int
    top_up_price_display: str
    max_monthly_top_ups: int
    top_ups_this_month: int
    can_top_up: bool  # True if not at max for month


# =============================================================================
# SPEND CAP
# =============================================================================

class SpendCapSettingsRequest(BaseModel):
    """Update monthly spend cap settings."""
    enabled: bool = Field(..., description="Enable/disable spend cap")
    max_monthly_spend_cents: int = Field(
        default=10000,
        ge=500,  # Min $5
        le=100000,  # Max $1000
        description="Maximum monthly spend in cents"
    )


class SpendCapSettingsResponse(BaseModel):
    """Current spend cap settings."""
    enabled: bool
    max_monthly_spend_cents: int
    max_monthly_spend_display: str
    current_month_spend_cents: int
    current_month_spend_display: str
    spend_remaining_cents: int
    spend_remaining_display: str
    at_limit: bool  # True if spend cap reached


# =============================================================================
# MODEL COSTS
# =============================================================================

class ModelCostResponse(BaseModel):
    """Credit cost information for a model."""
    model_id: str
    display_name: str
    provider: str
    credits_per_1k_input: float
    credits_per_1k_output: float
    supports_byo_key: bool


class ModelCostsResponse(BaseModel):
    """All model costs."""
    models: List[ModelCostResponse]


# =============================================================================
# PLANS
# =============================================================================

class PlanLimitsResponse(BaseModel):
    """Plan limits."""
    agents: int
    workflows: int
    mcp_servers: int
    projects: int
    file_storage_mb: int
    monthly_credits: int
    knowledge_files: int
    team_members: int


class PlanResponse(BaseModel):
    """Plan details."""
    id: str
    name: str
    price_monthly: int
    price_display: str
    description: str
    features: List[str]
    limits: PlanLimitsResponse
    is_custom: bool
    highlight: bool


class PlansResponse(BaseModel):
    """All available plans."""
    plans: List[PlanResponse]


class PricingComparisonRow(BaseModel):
    """Single row in pricing comparison."""
    name: str
    free: Any  # Can be bool, str, or int
    individual: Any
    business: Any


class PricingComparisonCategory(BaseModel):
    """Category of features in pricing comparison."""
    category: str
    features: List[PricingComparisonRow]


class PricingComparisonResponse(BaseModel):
    """Full pricing comparison table."""
    categories: List[PricingComparisonCategory]
    plans: List[PlanResponse]


# =============================================================================
# SUBSCRIPTION
# =============================================================================

class SubscriptionResponse(BaseModel):
    """Current subscription status."""
    plan_id: str
    plan_name: str
    status: str  # "active", "canceled", "past_due", "trialing"
    is_paid: bool
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool = False
    stripe_subscription_id: Optional[str] = None
    stripe_customer_id: Optional[str] = None


class UpgradeRequest(BaseModel):
    """Request to upgrade subscription."""
    plan_id: str = Field(..., description="Plan to upgrade to")
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None


class UpgradeResponse(BaseModel):
    """Response with checkout URL for upgrade."""
    checkout_url: str
    session_id: str


class BillingPortalRequest(BaseModel):
    """Request to open billing portal."""
    return_url: Optional[str] = None


class BillingPortalResponse(BaseModel):
    """Response with billing portal URL."""
    portal_url: str


# =============================================================================
# USAGE OVERVIEW
# =============================================================================

class UsageOverviewResponse(BaseModel):
    """Complete usage overview for billing page."""
    # Credit balance
    credit_balance: CreditBalanceResponse

    # Subscription
    subscription: SubscriptionResponse

    # Plan limits and usage
    plan: PlanResponse
    usage: Dict[str, Any]  # resource -> {used, limit, percent}

    # Spend tracking
    spend_cap: SpendCapSettingsResponse
    auto_top_up: AutoTopUpSettingsResponse

    # Feature access
    can_buy_credits: bool
    can_use_auto_top_up: bool
    using_byo_keys: bool
