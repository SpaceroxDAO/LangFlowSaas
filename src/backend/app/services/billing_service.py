"""
Billing service for Stripe integration and usage tracking.

Handles subscriptions, usage metering, and billing webhooks.
"""
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional, Tuple

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.plans import get_plan, PLANS, Plan
from app.models.subscription import Subscription
from app.models.billing_event import BillingEvent
from app.models.user import User

logger = logging.getLogger(__name__)

# Lazy import stripe to avoid startup failures if not installed
_stripe = None


def get_stripe():
    """Get stripe module, importing lazily."""
    global _stripe
    if _stripe is None:
        try:
            import stripe
            from app.config import settings
            stripe.api_key = getattr(settings, "stripe_secret_key", None)
            _stripe = stripe
        except ImportError:
            logger.warning("Stripe package not installed")
            return None
    return _stripe


class BillingServiceError(Exception):
    """Exception raised when billing operations fail."""
    pass


class BillingService:
    """Service for billing, subscriptions, and usage tracking."""

    def __init__(self, session: AsyncSession):
        self.session = session

    # =========================================================================
    # Subscription Management
    # =========================================================================

    async def get_or_create_subscription(self, user: User) -> Subscription:
        """Get or create a subscription for a user."""
        stmt = select(Subscription).where(Subscription.user_id == str(user.id))
        result = await self.session.execute(stmt)
        subscription = result.scalar_one_or_none()

        if not subscription:
            subscription = Subscription(
                user_id=str(user.id),
                plan_id="free",
                status="active",
            )
            self.session.add(subscription)
            await self.session.flush()
            await self.session.refresh(subscription)
            logger.info(f"Created free subscription for user {user.id}")

        return subscription

    async def get_subscription(self, user_id: str) -> Optional[Subscription]:
        """Get subscription for a user."""
        stmt = select(Subscription).where(Subscription.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create_checkout_session(
        self,
        user: User,
        plan_id: str,
        success_url: str,
        cancel_url: str,
    ) -> str:
        """
        Create a Stripe Checkout session for subscription.

        Returns the checkout URL.
        """
        stripe = get_stripe()
        if not stripe:
            raise BillingServiceError("Stripe is not configured")

        plan = get_plan(plan_id)
        if not plan.stripe_price_id:
            raise BillingServiceError(f"Plan {plan_id} is not a paid plan")

        subscription = await self.get_or_create_subscription(user)

        # Get or create Stripe customer
        if not subscription.stripe_customer_id:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.full_name,
                metadata={"user_id": str(user.id)},
            )
            subscription.stripe_customer_id = customer.id
            await self.session.flush()
            logger.info(f"Created Stripe customer {customer.id} for user {user.id}")

        # Create checkout session
        session = stripe.checkout.Session.create(
            customer=subscription.stripe_customer_id,
            mode="subscription",
            line_items=[{"price": plan.stripe_price_id, "quantity": 1}],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"user_id": str(user.id), "plan_id": plan_id},
            subscription_data={
                "metadata": {"user_id": str(user.id), "plan_id": plan_id},
            },
        )

        logger.info(f"Created checkout session for user {user.id} plan {plan_id}")
        return session.url

    async def create_portal_session(
        self,
        user: User,
        return_url: str,
    ) -> str:
        """
        Create a Stripe Customer Portal session.

        Returns the portal URL.
        """
        stripe = get_stripe()
        if not stripe:
            raise BillingServiceError("Stripe is not configured")

        subscription = await self.get_subscription(str(user.id))
        if not subscription or not subscription.stripe_customer_id:
            raise BillingServiceError("No billing account found")

        session = stripe.billing_portal.Session.create(
            customer=subscription.stripe_customer_id,
            return_url=return_url,
        )

        return session.url

    async def handle_webhook(self, payload: bytes, sig_header: str) -> Dict[str, Any]:
        """
        Handle Stripe webhook events.

        Processes subscription lifecycle events.
        """
        stripe = get_stripe()
        if not stripe:
            raise BillingServiceError("Stripe is not configured")

        from app.config import settings
        webhook_secret = getattr(settings, "stripe_webhook_secret", None)

        if not webhook_secret:
            raise BillingServiceError("Stripe webhook secret not configured")

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except ValueError as e:
            raise BillingServiceError(f"Invalid payload: {e}")
        except stripe.error.SignatureVerificationError as e:
            raise BillingServiceError(f"Invalid signature: {e}")

        # Process event
        event_type = event.type
        event_data = event.data.object

        logger.info(f"Processing Stripe webhook: {event_type}")

        if event_type == "checkout.session.completed":
            await self._handle_checkout_completed(event_data)
        elif event_type == "customer.subscription.created":
            await self._handle_subscription_created(event_data)
        elif event_type == "customer.subscription.updated":
            await self._handle_subscription_updated(event_data)
        elif event_type == "customer.subscription.deleted":
            await self._handle_subscription_deleted(event_data)
        elif event_type == "invoice.payment_failed":
            await self._handle_payment_failed(event_data)
        elif event_type == "invoice.paid":
            await self._handle_invoice_paid(event_data)

        # Record the event for audit
        user_id = event_data.get("metadata", {}).get("user_id")
        if user_id:
            await self._record_billing_event(
                user_id=user_id,
                event_type=event_type,
                stripe_event_id=event.id,
                payload=event_data,
            )

        return {"status": "success", "event_type": event_type}

    async def _handle_checkout_completed(self, session: Dict) -> None:
        """Handle successful checkout."""
        user_id = session.get("metadata", {}).get("user_id")
        plan_id = session.get("metadata", {}).get("plan_id")
        stripe_subscription_id = session.get("subscription")

        if not user_id or not plan_id:
            logger.warning("Checkout completed without user_id or plan_id")
            return

        subscription = await self.get_subscription(user_id)
        if subscription:
            subscription.plan_id = plan_id
            subscription.stripe_subscription_id = stripe_subscription_id
            subscription.status = "active"
            await self.session.flush()
            logger.info(f"User {user_id} upgraded to {plan_id}")

    async def _handle_subscription_created(self, sub: Dict) -> None:
        """Handle new subscription."""
        user_id = sub.get("metadata", {}).get("user_id")
        if not user_id:
            return

        subscription = await self.get_subscription(user_id)
        if subscription:
            subscription.stripe_subscription_id = sub.get("id")
            subscription.status = sub.get("status", "active")
            subscription.current_period_start = datetime.fromtimestamp(
                sub.get("current_period_start", 0)
            )
            subscription.current_period_end = datetime.fromtimestamp(
                sub.get("current_period_end", 0)
            )
            await self.session.flush()

    async def _handle_subscription_updated(self, sub: Dict) -> None:
        """Handle subscription update (plan change, renewal, etc.)."""
        customer_id = sub.get("customer")
        if not customer_id:
            return

        stmt = select(Subscription).where(
            Subscription.stripe_customer_id == customer_id
        )
        result = await self.session.execute(stmt)
        subscription = result.scalar_one_or_none()

        if subscription:
            subscription.status = sub.get("status", subscription.status)
            subscription.cancel_at_period_end = sub.get(
                "cancel_at_period_end", False
            )
            subscription.current_period_start = datetime.fromtimestamp(
                sub.get("current_period_start", 0)
            )
            subscription.current_period_end = datetime.fromtimestamp(
                sub.get("current_period_end", 0)
            )
            await self.session.flush()

    async def _handle_subscription_deleted(self, sub: Dict) -> None:
        """Handle subscription cancellation."""
        customer_id = sub.get("customer")
        if not customer_id:
            return

        stmt = select(Subscription).where(
            Subscription.stripe_customer_id == customer_id
        )
        result = await self.session.execute(stmt)
        subscription = result.scalar_one_or_none()

        if subscription:
            subscription.plan_id = "free"
            subscription.status = "canceled"
            subscription.stripe_subscription_id = None
            await self.session.flush()
            logger.info(f"User {subscription.user_id} downgraded to free")

    async def _handle_payment_failed(self, invoice: Dict) -> None:
        """Handle failed payment."""
        customer_id = invoice.get("customer")
        if not customer_id:
            return

        stmt = select(Subscription).where(
            Subscription.stripe_customer_id == customer_id
        )
        result = await self.session.execute(stmt)
        subscription = result.scalar_one_or_none()

        if subscription:
            subscription.status = "past_due"
            await self.session.flush()
            logger.warning(f"Payment failed for user {subscription.user_id}")

    async def _handle_invoice_paid(self, invoice: Dict) -> None:
        """Handle successful payment."""
        customer_id = invoice.get("customer")
        if not customer_id:
            return

        stmt = select(Subscription).where(
            Subscription.stripe_customer_id == customer_id
        )
        result = await self.session.execute(stmt)
        subscription = result.scalar_one_or_none()

        if subscription and subscription.status == "past_due":
            subscription.status = "active"
            await self.session.flush()

    async def _record_billing_event(
        self,
        user_id: str,
        event_type: str,
        stripe_event_id: str,
        payload: Dict,
    ) -> None:
        """Record a billing event for audit."""
        # Check for duplicate
        stmt = select(BillingEvent).where(
            BillingEvent.stripe_event_id == stripe_event_id
        )
        result = await self.session.execute(stmt)
        if result.scalar_one_or_none():
            return  # Already processed

        event = BillingEvent(
            user_id=user_id,
            event_type=event_type,
            stripe_event_id=stripe_event_id,
            payload=payload,
        )
        self.session.add(event)
        await self.session.flush()

    # =========================================================================
    # Usage Tracking
    # Note: Usage metrics are now computed on-the-fly from Message/Conversation tables
    # The usage_metrics table has been removed (2026-01-15 cleanup)
    # =========================================================================

    async def track_usage(
        self,
        user_id: str,
        metric_type: str,
        value: int,
        extra_data: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """
        Track usage metric (e.g., LLM tokens, messages).

        Note: This method is now a no-op. Usage is computed on-the-fly from
        the messages table. Kept for API compatibility.
        """
        logger.debug(f"Usage tracking: user={user_id}, type={metric_type}, value={value}")
        return {"user_id": user_id, "metric_type": metric_type, "value": value}

    async def get_usage_summary(self, user_id: str) -> Dict[str, int]:
        """
        Get current billing period usage summary.

        Computed on-the-fly from Message/Conversation/AgentComponent/Workflow tables.
        """
        from sqlalchemy import func
        from app.models.message import Message
        from app.models.conversation import Conversation
        from app.models.agent_component import AgentComponent
        from app.models.workflow import Workflow

        now = datetime.utcnow()
        period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # Count messages this month
        msg_stmt = (
            select(func.count())
            .select_from(Message)
            .join(Conversation, Conversation.id == Message.conversation_id)
            .where(
                Conversation.user_id == user_id,
                Message.created_at >= period_start,
            )
        )
        msg_result = await self.session.execute(msg_stmt)
        messages_count = msg_result.scalar_one() or 0

        # Count agents (AgentComponents) - total active agents
        agent_stmt = select(func.count()).select_from(AgentComponent).where(
            AgentComponent.user_id == user_id,
            AgentComponent.is_active == True,
        )
        agent_result = await self.session.execute(agent_stmt)
        agents_count = agent_result.scalar_one() or 0

        # Count workflows - total active workflows
        workflow_stmt = select(func.count()).select_from(Workflow).where(
            Workflow.user_id == user_id,
            Workflow.is_active == True,
        )
        workflow_result = await self.session.execute(workflow_stmt)
        workflows_count = workflow_result.scalar_one() or 0

        # Estimate tokens (~100 per message)
        tokens_count = messages_count * 100

        # Return keys that match what the billing API expects
        return {
            "messages_sent": messages_count,
            "llm_tokens": tokens_count,
            "agents_created": agents_count,
            "workflows_created": workflows_count,
        }

    async def check_limit(
        self,
        user_id: str,
        limit_type: str,
    ) -> Tuple[bool, int, int]:
        """
        Check if user is within plan limits.

        Returns: (is_within_limit, current_usage, max_limit)
        """
        subscription = await self.get_subscription(user_id)
        plan = get_plan(subscription.plan_id if subscription else "free")

        usage = await self.get_usage_summary(user_id)

        # Map limit types to plan limits (updated for new credits-based model)
        limit_map = {
            "agents": plan.limits.agents,
            "workflows": plan.limits.workflows,
            "mcp_servers": plan.limits.mcp_servers,
            "projects": plan.limits.projects,
            "file_storage_mb": plan.limits.file_storage_mb,
            "monthly_credits": plan.limits.monthly_credits,
            "knowledge_files": plan.limits.knowledge_files,
            "team_members": plan.limits.team_members,
        }

        # Map limit types to usage keys (from get_usage_summary)
        usage_key_map = {
            "agents": "agents_created",
            "workflows": "workflows_created",
            "monthly_credits": "credits_used",
        }

        max_limit = limit_map.get(limit_type, float("inf"))

        # Handle unlimited (-1 means unlimited)
        if max_limit == -1:
            return True, 0, -1

        usage_key = usage_key_map.get(limit_type, limit_type)
        current = usage.get(usage_key, 0)

        return current < max_limit, current, max_limit

    async def get_plan_for_user(self, user_id: str) -> Plan:
        """Get the user's current plan."""
        subscription = await self.get_subscription(user_id)
        plan_id = subscription.plan_id if subscription else "free"
        return get_plan(plan_id)

    # =========================================================================
    # AI Credits Management
    # =========================================================================

    async def get_credit_balance(self, user_id: str) -> Dict[str, Any]:
        """
        Get current credit balance for a user.

        Returns dict with balance, purchased_credits, credits_used, etc.
        Note: In this initial implementation, credits are tracked via usage.
        A full implementation would have a separate credits table.
        """
        plan = await self.get_plan_for_user(user_id)
        usage = await self.get_usage_summary(user_id)

        # Calculate credits used this month (simplified: 1 message = 10 credits)
        credits_used = usage.get("messages_sent", 0) * 10

        # For now, return plan-based credits
        monthly_credits = plan.limits.monthly_credits
        credits_remaining = max(0, monthly_credits - credits_used)

        # Get billing period end for reset date
        subscription = await self.get_subscription(user_id)
        reset_date = None
        if subscription and subscription.current_period_end:
            reset_date = subscription.current_period_end.isoformat()

        return {
            "balance": credits_remaining,
            "monthly_credits": monthly_credits,
            "purchased_credits": 0,  # TODO: Track purchased credits in DB
            "credits_used": credits_used,
            "credits_remaining": credits_remaining,
            "reset_date": reset_date,
            "using_byo_key": False,  # TODO: Check if user has BYO API keys
        }

    async def create_credit_checkout(
        self,
        user: User,
        pack_id: str,
        success_url: str,
        cancel_url: str,
    ) -> Dict[str, str]:
        """
        Create a Stripe Checkout session for credit purchase.

        Returns dict with checkout URL and session ID.
        """
        from app.plans import get_credit_pack

        stripe = get_stripe()
        if not stripe:
            raise BillingServiceError("Stripe is not configured")

        pack = get_credit_pack(pack_id)
        if not pack:
            raise BillingServiceError(f"Invalid credit pack: {pack_id}")

        subscription = await self.get_or_create_subscription(user)

        # Get or create Stripe customer
        if not subscription.stripe_customer_id:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.full_name,
                metadata={"user_id": str(user.id)},
            )
            subscription.stripe_customer_id = customer.id
            await self.session.flush()
            logger.info(f"Created Stripe customer {customer.id} for user {user.id}")

        # Create one-time checkout session for credit purchase
        session = stripe.checkout.Session.create(
            customer=subscription.stripe_customer_id,
            mode="payment",
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "unit_amount": pack.price_cents,
                    "product_data": {
                        "name": pack.name,
                        "description": f"{pack.credits:,} AI credits for Teach Charlie",
                    },
                },
                "quantity": 1,
            }],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "user_id": str(user.id),
                "pack_id": pack_id,
                "credits": str(pack.credits),
                "type": "credit_purchase",
            },
        )

        logger.info(f"Created credit checkout session for user {user.id} pack {pack_id}")
        return {
            "url": session.url,
            "session_id": session.id,
        }

    async def get_auto_top_up_settings(self, user_id: str) -> Dict[str, Any]:
        """
        Get auto top-up settings for a user.

        Note: In this initial implementation, settings are defaults.
        A full implementation would store in DB.
        """
        # TODO: Fetch from user_settings table or dedicated auto_top_up table
        return {
            "enabled": False,
            "threshold_credits": 100,
            "top_up_pack_id": "credits_5000",
            "max_monthly_top_ups": 3,
            "top_ups_this_month": 0,
            "can_top_up": True,
        }

    async def update_auto_top_up_settings(
        self,
        user_id: str,
        enabled: bool,
        threshold_credits: int,
        top_up_pack_id: str,
        max_monthly_top_ups: int,
    ) -> Dict[str, Any]:
        """
        Update auto top-up settings for a user.

        Note: In this initial implementation, changes are not persisted.
        A full implementation would store in DB.
        """
        # TODO: Store in user_settings table or dedicated auto_top_up table
        logger.info(f"Auto top-up settings updated for user {user_id}: enabled={enabled}")
        return {
            "enabled": enabled,
            "threshold_credits": threshold_credits,
            "top_up_pack_id": top_up_pack_id,
            "max_monthly_top_ups": max_monthly_top_ups,
            "top_ups_this_month": 0,
            "can_top_up": True,
        }

    async def get_spend_cap_settings(self, user_id: str) -> Dict[str, Any]:
        """
        Get spend cap settings for a user.

        Note: In this initial implementation, settings are defaults.
        A full implementation would store in DB.
        """
        # TODO: Fetch from user_settings table or dedicated spend_cap table
        return {
            "enabled": False,
            "max_monthly_spend_cents": 10000,
            "current_month_spend_cents": 0,
        }

    async def update_spend_cap_settings(
        self,
        user_id: str,
        enabled: bool,
        max_monthly_spend_cents: int,
    ) -> Dict[str, Any]:
        """
        Update spend cap settings for a user.

        Note: In this initial implementation, changes are not persisted.
        A full implementation would store in DB.
        """
        # TODO: Store in user_settings table or dedicated spend_cap table
        logger.info(f"Spend cap settings updated for user {user_id}: enabled={enabled}")
        return {
            "enabled": enabled,
            "max_monthly_spend_cents": max_monthly_spend_cents,
            "current_month_spend_cents": 0,
        }
