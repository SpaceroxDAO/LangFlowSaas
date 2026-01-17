"""
Pricing plan configuration for Teach Charlie AI.

Defines the subscription tiers, their limits, and features.
Uses hybrid pricing: base tier + usage overage.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class PlanLimits:
    """Resource limits for a plan."""

    agents: int
    messages_per_month: int
    tokens_per_month: int
    file_storage_mb: int
    workflows: int
    mcp_servers: int
    projects: int


@dataclass
class Plan:
    """Subscription plan definition."""

    id: str
    name: str
    price_monthly: int  # in cents (e.g., 2900 = $29.00)
    stripe_price_id: Optional[str]  # Stripe Price ID for checkout
    limits: PlanLimits
    features: List[str]
    description: str = ""

    @property
    def price_display(self) -> str:
        """Get display price string."""
        if self.price_monthly == 0:
            return "Free"
        dollars = self.price_monthly // 100
        cents = self.price_monthly % 100
        if cents == 0:
            return f"${dollars}/mo"
        return f"${dollars}.{cents:02d}/mo"


# Plan definitions
PLANS: Dict[str, Plan] = {
    "free": Plan(
        id="free",
        name="Free",
        price_monthly=0,
        stripe_price_id=None,  # No Stripe price for free tier
        description="Get started with AI agents",
        limits=PlanLimits(
            agents=3,
            messages_per_month=100,
            tokens_per_month=50_000,
            file_storage_mb=50,
            workflows=1,
            mcp_servers=2,
            projects=1,
        ),
        features=[
            "3 agents",
            "100 messages/month",
            "Basic playground",
            "Community support",
        ],
    ),
    "pro": Plan(
        id="pro",
        name="Pro",
        price_monthly=2900,  # $29.00
        stripe_price_id=None,  # Set via STRIPE_PRO_PRICE_ID env var
        description="For power users and small teams",
        limits=PlanLimits(
            agents=20,
            messages_per_month=2000,
            tokens_per_month=500_000,
            file_storage_mb=500,
            workflows=10,
            mcp_servers=10,
            projects=5,
        ),
        features=[
            "20 agents",
            "2,000 messages/month",
            "Advanced analytics",
            "Custom components",
            "Canvas unlock",
            "Export & embed",
            "Email support",
        ],
    ),
    "team": Plan(
        id="team",
        name="Team",
        price_monthly=7900,  # $79.00
        stripe_price_id=None,  # Set via STRIPE_TEAM_PRICE_ID env var
        description="For growing teams and businesses",
        limits=PlanLimits(
            agents=100,
            messages_per_month=10_000,
            tokens_per_month=2_000_000,
            file_storage_mb=2000,
            workflows=50,
            mcp_servers=50,
            projects=20,
        ),
        features=[
            "100 agents",
            "10,000 messages/month",
            "Team collaboration",
            "API access",
            "White-label options",
            "Priority support",
            "Custom integrations",
        ],
    ),
}


def get_plan(plan_id: str) -> Plan:
    """Get plan by ID, defaulting to free if not found."""
    return PLANS.get(plan_id, PLANS["free"])


def get_all_plans() -> List[Plan]:
    """Get all available plans in order."""
    return [PLANS["free"], PLANS["pro"], PLANS["team"]]


# Usage overage rates (for hybrid billing)
# These are charged when users exceed their plan limits
OVERAGE_RATES = {
    "messages": 0.01,  # $0.01 per message over limit
    "tokens": 0.0001,  # $0.0001 per token over limit (=$0.10/1K tokens)
}


def calculate_overage(
    plan_id: str,
    messages_used: int,
    tokens_used: int,
) -> Dict[str, float]:
    """
    Calculate overage charges for usage beyond plan limits.

    Returns dict with overage amounts in dollars.
    """
    plan = get_plan(plan_id)

    message_overage = max(0, messages_used - plan.limits.messages_per_month)
    token_overage = max(0, tokens_used - plan.limits.tokens_per_month)

    return {
        "messages_overage_count": message_overage,
        "messages_overage_amount": message_overage * OVERAGE_RATES["messages"],
        "tokens_overage_count": token_overage,
        "tokens_overage_amount": token_overage * OVERAGE_RATES["tokens"],
        "total_overage": (
            message_overage * OVERAGE_RATES["messages"]
            + token_overage * OVERAGE_RATES["tokens"]
        ),
    }
