"""
Pricing plan configuration for Teach Charlie AI.

Defines subscription tiers, AI credits system, and feature gating.
Uses hybrid pricing: subscription + AI credits (with BYO API key option).
"""
import os
from dataclasses import dataclass, field
from typing import Dict, List, Optional
from enum import Enum


class PlanTier(str, Enum):
    """Plan tier identifiers."""
    FREE = "free"
    INDIVIDUAL = "individual"
    BUSINESS = "business"


@dataclass
class PlanLimits:
    """Resource limits for a plan."""
    agents: int
    workflows: int
    mcp_servers: int
    projects: int
    file_storage_mb: int
    monthly_credits: int  # AI credits included per month
    knowledge_files: int  # Number of knowledge base files
    team_members: int  # Number of team seats


@dataclass
class Plan:
    """Subscription plan definition."""
    id: str
    name: str
    price_monthly: int  # in cents (e.g., 1900 = $19.00)
    stripe_price_id: Optional[str]  # Stripe Price ID for monthly checkout
    limits: PlanLimits
    features: List[str]
    description: str = ""
    is_custom: bool = False  # For Business/Enterprise plans
    highlight: bool = False  # Highlight as recommended
    price_yearly: int = 0  # in cents (e.g., 18000 = $180.00)
    stripe_yearly_price_id: Optional[str] = None  # Stripe Price ID for yearly checkout

    @property
    def price_display(self) -> str:
        """Get display price string."""
        if self.is_custom:
            return "Custom"
        if self.price_monthly == 0:
            return "Free"
        dollars = self.price_monthly // 100
        cents = self.price_monthly % 100
        if cents == 0:
            return f"${dollars}/mo"
        return f"${dollars}.{cents:02d}/mo"

    @property
    def yearly_price_display(self) -> str:
        """Get yearly display price string."""
        if self.price_yearly == 0:
            return ""
        dollars = self.price_yearly // 100
        return f"${dollars}/yr"

    @property
    def yearly_savings_display(self) -> str:
        """Get savings for yearly vs monthly."""
        if self.price_yearly == 0 or self.price_monthly == 0:
            return ""
        monthly_total = self.price_monthly * 12
        savings = monthly_total - self.price_yearly
        if savings > 0:
            return f"Save ${savings // 100}"
        return ""


# Plan definitions - education-first positioning
# See docs/19_PRICING_STRATEGY.md for full strategy
PLANS: Dict[str, Plan] = {
    "free": Plan(
        id="free",
        name="Free",
        price_monthly=0,
        stripe_price_id=None,
        description="Learn AI fundamentals and build your first agent",
        limits=PlanLimits(
            agents=1,  # 1 live agent (education entry point)
            workflows=2,
            mcp_servers=2,
            projects=1,
            file_storage_mb=50,
            monthly_credits=500,  # ~1000 runs
            knowledge_files=5,
            team_members=1,
        ),
        features=[
            "3 Starter Missions",
            "1 Live Agent",
            "1,000 test runs/month",
            "Canvas preview (read-only)",
            "Basic playground",
            "5 knowledge files",
        ],
    ),
    "individual": Plan(
        id="individual",
        name="Individual",
        price_monthly=1900,  # $19.00
        stripe_price_id=os.getenv("STRIPE_INDIVIDUAL_MONTHLY_PRICE_ID"),
        description="Master AI agents with full curriculum access",
        highlight=True,  # Recommended plan
        price_yearly=18000,  # $180.00/year (save $48)
        stripe_yearly_price_id=os.getenv("STRIPE_INDIVIDUAL_YEARLY_PRICE_ID"),
        limits=PlanLimits(
            agents=-1,  # Unlimited agents
            workflows=20,
            mcp_servers=10,
            projects=5,
            file_storage_mb=500,
            monthly_credits=5000,  # Unlimited runs
            knowledge_files=50,
            team_members=1,
        ),
        features=[
            "Full Mission Library (20+)",
            "Unlimited Agents",
            "Unlimited test runs",
            "Full Canvas editor",
            "AI Agent Academy",
            "Community access",
            "Export & embed agents",
            "50 knowledge files",
            "Email support",
        ],
    ),
    "business": Plan(
        id="business",
        name="Business",
        price_monthly=0,  # Custom pricing
        stripe_price_id=None,
        description="Transform your team's AI capabilities",
        is_custom=True,
        limits=PlanLimits(
            agents=-1,  # -1 = unlimited
            workflows=-1,
            mcp_servers=-1,
            projects=-1,
            file_storage_mb=10000,
            monthly_credits=50000,
            knowledge_files=-1,
            team_members=-1,
        ),
        features=[
            "Everything in Individual",
            "Custom learning paths",
            "Live weekly workshops",
            "Team workspace",
            "Team progress tracking",
            "SSO (SAML/OIDC)",
            "Audit logs",
            "Priority support",
            "Dedicated onboarding",
            "Custom SLAs",
        ],
    ),
}

# Legacy plan mapping (for existing subscriptions)
LEGACY_PLAN_MAPPING = {
    "pro": "individual",  # Pro users -> Individual
    "team": "business",   # Team users -> Business
}


def get_plan(plan_id: str) -> Plan:
    """Get plan by ID, defaulting to free if not found."""
    # Handle legacy plan IDs
    plan_id = LEGACY_PLAN_MAPPING.get(plan_id, plan_id)
    return PLANS.get(plan_id, PLANS["free"])


def get_all_plans() -> List[Plan]:
    """Get all available plans in display order."""
    return [PLANS["free"], PLANS["individual"], PLANS["business"]]


# =============================================================================
# AI CREDITS SYSTEM
# =============================================================================

@dataclass
class CreditPack:
    """Credit pack available for purchase."""
    id: str
    name: str
    credits: int
    price_cents: int  # Price in cents
    stripe_price_id: Optional[str] = None
    popular: bool = False

    @property
    def price_display(self) -> str:
        """Get display price string."""
        dollars = self.price_cents // 100
        cents = self.price_cents % 100
        if cents == 0:
            return f"${dollars}"
        return f"${dollars}.{cents:02d}"

    @property
    def price_per_credit(self) -> float:
        """Price per credit in dollars."""
        return self.price_cents / 100 / self.credits


# Credit packs available for purchase
# Aligned with Stripe products: $10, $25, $50 packs
CREDIT_PACKS: Dict[str, CreditPack] = {
    "credits_2000": CreditPack(
        id="credits_2000",
        name="2,000 Credits",
        credits=2000,
        price_cents=1000,  # $10 = $0.005/credit
        stripe_price_id=os.getenv("STRIPE_CREDITS_10_PRICE_ID"),
    ),
    "credits_5500": CreditPack(
        id="credits_5500",
        name="5,500 Credits",
        credits=5500,
        price_cents=2500,  # $25 = $0.0045/credit (10% bonus)
        stripe_price_id=os.getenv("STRIPE_CREDITS_25_PRICE_ID"),
        popular=True,
    ),
    "credits_12500": CreditPack(
        id="credits_12500",
        name="12,500 Credits",
        credits=12500,
        price_cents=5000,  # $50 = $0.004/credit (25% bonus)
        stripe_price_id=os.getenv("STRIPE_CREDITS_50_PRICE_ID"),
    ),
}


def get_credit_pack(pack_id: str) -> Optional[CreditPack]:
    """Get credit pack by ID."""
    return CREDIT_PACKS.get(pack_id)


def get_all_credit_packs() -> List[CreditPack]:
    """Get all available credit packs."""
    return list(CREDIT_PACKS.values())


# =============================================================================
# MODEL CREDIT COSTS
# =============================================================================

@dataclass
class ModelCost:
    """Credit cost for a model."""
    model_id: str
    display_name: str
    provider: str
    credits_per_1k_input: float
    credits_per_1k_output: float
    supports_byo_key: bool = True  # Can user bring their own API key?


# Credit costs per model (credits per 1K tokens)
# These are internal "Charlie credits" - not tied to provider pricing
MODEL_COSTS: Dict[str, ModelCost] = {
    # OpenAI models
    "gpt-4o": ModelCost(
        model_id="gpt-4o",
        display_name="GPT-4o",
        provider="openai",
        credits_per_1k_input=5,
        credits_per_1k_output=15,
    ),
    "gpt-4o-mini": ModelCost(
        model_id="gpt-4o-mini",
        display_name="GPT-4o Mini",
        provider="openai",
        credits_per_1k_input=0.5,
        credits_per_1k_output=1.5,
    ),
    "gpt-4-turbo": ModelCost(
        model_id="gpt-4-turbo",
        display_name="GPT-4 Turbo",
        provider="openai",
        credits_per_1k_input=10,
        credits_per_1k_output=30,
    ),
    # Anthropic models
    "claude-3-5-sonnet": ModelCost(
        model_id="claude-3-5-sonnet",
        display_name="Claude 3.5 Sonnet",
        provider="anthropic",
        credits_per_1k_input=3,
        credits_per_1k_output=15,
    ),
    "claude-3-5-haiku": ModelCost(
        model_id="claude-3-5-haiku",
        display_name="Claude 3.5 Haiku",
        provider="anthropic",
        credits_per_1k_input=1,
        credits_per_1k_output=5,
    ),
    "claude-3-opus": ModelCost(
        model_id="claude-3-opus",
        display_name="Claude 3 Opus",
        provider="anthropic",
        credits_per_1k_input=15,
        credits_per_1k_output=75,
    ),
    # Google models
    "gemini-1.5-pro": ModelCost(
        model_id="gemini-1.5-pro",
        display_name="Gemini 1.5 Pro",
        provider="google",
        credits_per_1k_input=2,
        credits_per_1k_output=8,
    ),
    "gemini-1.5-flash": ModelCost(
        model_id="gemini-1.5-flash",
        display_name="Gemini 1.5 Flash",
        provider="google",
        credits_per_1k_input=0.2,
        credits_per_1k_output=0.8,
    ),
}


def get_model_cost(model_id: str) -> Optional[ModelCost]:
    """Get credit cost for a model."""
    return MODEL_COSTS.get(model_id)


def calculate_credit_cost(model_id: str, input_tokens: int, output_tokens: int) -> int:
    """
    Calculate credit cost for a model usage.

    Returns credits consumed (rounded up).
    """
    cost = get_model_cost(model_id)
    if not cost:
        # Default fallback for unknown models
        return int((input_tokens + output_tokens) / 1000 * 10)

    input_credits = (input_tokens / 1000) * cost.credits_per_1k_input
    output_credits = (output_tokens / 1000) * cost.credits_per_1k_output

    # Round up to ensure we always charge at least 1 credit
    import math
    return max(1, math.ceil(input_credits + output_credits))


# =============================================================================
# AUTO TOP-UP CONFIGURATION
# =============================================================================

@dataclass
class AutoTopUpConfig:
    """Auto top-up configuration for a user."""
    enabled: bool = False
    threshold_credits: int = 100  # Trigger when balance falls below
    top_up_pack_id: str = "credits_5500"  # Which pack to purchase ($25 pack)
    max_monthly_top_ups: int = 3  # Safety limit


# Default auto top-up settings
DEFAULT_AUTO_TOP_UP = AutoTopUpConfig()


# =============================================================================
# SPEND CAP CONFIGURATION
# =============================================================================

@dataclass
class SpendCapConfig:
    """Monthly spend cap configuration."""
    enabled: bool = False
    max_monthly_spend_cents: int = 10000  # $100 default cap


# Default spend cap settings
DEFAULT_SPEND_CAP = SpendCapConfig()


# =============================================================================
# FEATURE GATING
# =============================================================================

# Features that require specific plans
FEATURE_REQUIREMENTS: Dict[str, List[str]] = {
    # Feature name -> list of plan IDs that have access
    "canvas_editor": ["individual", "business"],
    "export_agents": ["individual", "business"],
    "custom_components": ["individual", "business"],
    "advanced_analytics": ["individual", "business"],
    "buy_credits": ["individual", "business"],
    "auto_top_up": ["individual", "business"],
    "team_collaboration": ["business"],
    "sso": ["business"],
    "audit_logs": ["business"],
    "custom_branding": ["business"],
    "api_access": ["business"],
    "sla": ["business"],
}


def has_feature_access(plan_id: str, feature: str) -> bool:
    """Check if a plan has access to a feature."""
    plan_id = LEGACY_PLAN_MAPPING.get(plan_id, plan_id)
    allowed_plans = FEATURE_REQUIREMENTS.get(feature, [])

    # If feature not in requirements, it's available to all
    if not allowed_plans:
        return True

    return plan_id in allowed_plans


def get_required_plan_for_feature(feature: str) -> Optional[str]:
    """Get the minimum plan required for a feature."""
    allowed_plans = FEATURE_REQUIREMENTS.get(feature, [])
    if not allowed_plans:
        return None

    # Return the lowest tier that has access
    tier_order = ["free", "individual", "business"]
    for tier in tier_order:
        if tier in allowed_plans:
            return tier

    return allowed_plans[0] if allowed_plans else None


# =============================================================================
# PRICING PAGE DATA
# =============================================================================

def get_pricing_comparison() -> List[Dict]:
    """
    Get pricing comparison data for the pricing page.

    Returns a list of feature rows with plan availability.
    Education-first positioning: Learning features come before building features.
    See docs/19_PRICING_STRATEGY.md for full strategy.
    """
    return [
        {
            "category": "Learning Journey",
            "description": "Build your AI skills step by step",
            "features": [
                {"name": "Learning Missions", "free": "3 Starter", "individual": "Full Library (20+)", "business": "Full + Custom"},
                {"name": "Skill Sprints", "free": "Basics only", "individual": True, "business": True},
                {"name": "Applied Builds", "free": False, "individual": True, "business": True},
                {"name": "AI Agent Academy", "free": False, "individual": True, "business": True},
                {"name": "Live weekly workshops", "free": False, "individual": False, "business": True},
                {"name": "Custom learning paths", "free": False, "individual": False, "business": True},
            ]
        },
        {
            "category": "Building",
            "description": "Create production-ready AI agents",
            "features": [
                {"name": "Live Agents", "free": "1", "individual": "Unlimited", "business": "Unlimited"},
                {"name": "Test runs / month", "free": "1,000", "individual": "Unlimited", "business": "Unlimited"},
                {"name": "Canvas editor", "free": "Preview only", "individual": True, "business": True},
                {"name": "Export & embed", "free": False, "individual": True, "business": True},
                {"name": "Knowledge base files", "free": "5", "individual": "50", "business": "Unlimited"},
                {"name": "1000+ tools & integrations", "free": True, "individual": True, "business": True},
                {"name": "Bring your own API key", "free": True, "individual": True, "business": True},
            ]
        },
        {
            "category": "Community & Support",
            "description": "Get help when you need it",
            "features": [
                {"name": "Community access", "free": False, "individual": True, "business": True},
                {"name": "Email support", "free": False, "individual": True, "business": True},
                {"name": "Priority support", "free": False, "individual": False, "business": True},
                {"name": "Dedicated onboarding", "free": False, "individual": False, "business": True},
            ]
        },
        {
            "category": "Team & Admin",
            "description": "Scale AI capabilities across your organization",
            "features": [
                {"name": "Team workspace", "free": False, "individual": False, "business": True},
                {"name": "Team progress tracking", "free": False, "individual": False, "business": True},
                {"name": "Collaborators", "free": False, "individual": False, "business": True},
                {"name": "SSO / SAML", "free": False, "individual": False, "business": True},
                {"name": "Audit logs", "free": False, "individual": False, "business": True},
                {"name": "Custom SLAs", "free": False, "individual": False, "business": True},
            ]
        },
    ]


# =============================================================================
# PLAN OUTCOMES (for UI display)
# =============================================================================

PLAN_OUTCOMES: Dict[str, str] = {
    "free": "I understand AI agents and built my first one",
    "individual": "I can build any AI agent I need",
    "business": "Our whole team can build AI agents",
}


def get_plan_outcome(plan_id: str) -> str:
    """Get the outcome statement for a plan."""
    plan_id = LEGACY_PLAN_MAPPING.get(plan_id, plan_id)
    return PLAN_OUTCOMES.get(plan_id, PLAN_OUTCOMES["free"])
