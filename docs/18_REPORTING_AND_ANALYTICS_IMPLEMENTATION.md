# Reporting and Analytics Implementation Plan

**Document**: 18_REPORTING_AND_ANALYTICS_IMPLEMENTATION.md
**Created**: 2026-01-09
**Status**: Planning
**Priority**: High (Required for SaaS operations)

---

## Executive Summary

This document outlines a comprehensive, phased approach to implementing reporting and analytics for Teach Charlie AI. The strategy maintains our **wrapper philosophy** (minimal Langflow modifications) while providing:

1. **User-facing analytics** - Simple, educational metrics for non-technical users
2. **Admin/founder analytics** - Detailed operational insights for business decisions
3. **Error visibility** - Real-time error tracking and alerting
4. **Cost tracking** - Token usage monitoring for billing and optimization

### Key Architectural Decision

After evaluating LangSmith, Langfuse, LangWatch, and other observability tools, we've determined that **iframe embedding is problematic** for user-facing analytics due to:

- Security headers (X-Frame-Options) blocking embedding
- Multi-tenancy complexity (separate projects per user)
- Developer-focused UIs inappropriate for educational users
- Authentication complexity requiring SSO

**Our approach**: Custom user-facing analytics + external tools for admin debugging.

---

## Architecture Overview

```
                    REPORTING ARCHITECTURE

    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                 │
    │   USER-FACING                        ADMIN/FOUNDER              │
    │   ┌─────────────────┐               ┌─────────────────┐        │
    │   │  "Charlie Stats" │               │  Admin Dashboard │        │
    │   │   (Custom React) │               │  (Custom + Links)│        │
    │   └────────┬────────┘               └────────┬────────┘        │
    │            │                                  │                  │
    │            └──────────────┬──────────────────┘                  │
    │                           │                                      │
    │   ┌────────────────────────────────────────────┐                │
    │   │           FastAPI Backend                   │                │
    │   │  /api/v1/analytics/my-stats                │                │
    │   │  /api/v1/analytics/admin/*                 │                │
    │   │  Background aggregation jobs               │                │
    │   └────────────────────────────────────────────┘                │
    │                           │                                      │
    │          ┌────────────────┼────────────────┐                    │
    │          │                │                │                     │
    │   ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐            │
    │   │  PostgreSQL  │  │  Langflow   │  │  External   │            │
    │   │  (our data)  │  │  (traces)   │  │  Services   │            │
    │   │              │  │             │  │             │            │
    │   │ - users      │  │ - messages  │  │ - Sentry    │            │
    │   │ - workflows  │  │ - sessions  │  │ - LangSmith │            │
    │   │ - messages   │  │ - tokens    │  │ - PostHog   │            │
    │   │ - metrics    │  │             │  │   (future)  │            │
    │   └─────────────┘  └─────────────┘  └─────────────┘            │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Foundation (Week 1)

**Goal**: Establish observability infrastructure with minimal code changes.

### 1.1 LangSmith Integration (Admin Debugging)

LangSmith provides deep LLM tracing for debugging. This is **founder-only** - not exposed to users.

#### Environment Configuration

Add to `.env`:

```bash
# =============================================================================
# OBSERVABILITY - LangSmith (Admin/Debugging Only)
# =============================================================================
# LangSmith provides detailed LLM tracing for debugging.
# Access traces at: https://smith.langchain.com
# Get API key from: https://smith.langchain.com/settings

LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com/
LANGSMITH_API_KEY=lsv2_pt_xxxxxxxxxxxx
LANGSMITH_PROJECT=teach-charlie-production

# Optional: Sample rate for production (0.0-1.0)
# Set to 1.0 for full tracing, lower for high-volume production
LANGSMITH_SAMPLE_RATE=1.0
```

Add to `.env.example`:

```bash
# =============================================================================
# OBSERVABILITY - LangSmith (Optional, Admin/Debugging)
# =============================================================================
# LangSmith provides detailed LLM tracing for debugging agent behavior.
# This is for admin/developer use - not exposed to end users.
# Sign up at: https://smith.langchain.com

LANGSMITH_TRACING=false
LANGSMITH_ENDPOINT=https://api.smith.langchain.com/
LANGSMITH_API_KEY=
LANGSMITH_PROJECT=teach-charlie-dev
```

#### How It Works

Langflow automatically detects these environment variables and enables tracing. No code changes required. When enabled:

1. Every Langflow flow execution generates a trace
2. Traces include: inputs, outputs, latency, token usage, errors
3. View traces at smith.langchain.com
4. Filter by project, time, status

#### Usage for Debugging

When a user reports an issue:

1. Get their `conversation_id` from our database
2. The `langflow_session_id` maps to LangSmith traces
3. Search LangSmith by session ID to see exact execution
4. Identify where the flow failed or behaved unexpectedly

### 1.2 Sentry Integration (Error Tracking)

Sentry provides real-time error tracking and alerting.

#### Dependencies

Add to `requirements.txt`:

```
# Error Tracking
sentry-sdk[fastapi]==1.39.1
```

#### Environment Configuration

Add to `.env`:

```bash
# =============================================================================
# OBSERVABILITY - Sentry (Error Tracking)
# =============================================================================
# Sentry captures errors and exceptions automatically.
# Sign up at: https://sentry.io (free tier: 5K errors/month)

SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxx
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
```

Add to `.env.example`:

```bash
# =============================================================================
# OBSERVABILITY - Sentry (Error Tracking)
# =============================================================================
# Sentry captures and alerts on application errors.
# Free tier includes 5,000 errors/month.
# Sign up at: https://sentry.io

SENTRY_DSN=
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=0.1
```

#### Config Updates

Add to `src/backend/app/config.py`:

```python
class Settings(BaseSettings):
    # ... existing fields ...

    # Sentry Error Tracking
    sentry_dsn: str = ""
    sentry_environment: str = "development"
    sentry_traces_sample_rate: float = 0.1

    # LangSmith (for reference, Langflow reads these directly)
    langsmith_tracing: bool = False
    langsmith_project: str = "teach-charlie-dev"
```

#### Backend Integration

Update `src/backend/app/main.py`:

```python
"""
Teach Charlie AI - FastAPI Backend Application
"""
from contextlib import asynccontextmanager
from pathlib import Path

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import create_tables
from app.api import (
    # ... existing imports ...
)


def init_sentry():
    """Initialize Sentry error tracking if configured."""
    if settings.sentry_dsn:
        sentry_sdk.init(
            dsn=settings.sentry_dsn,
            environment=settings.sentry_environment,
            traces_sample_rate=settings.sentry_traces_sample_rate,
            # Capture user context for better debugging
            send_default_pii=False,  # Don't send PII by default
            # Filter out health check noise
            before_send=filter_health_checks,
        )
        logger.info(f"✅ Sentry initialized (env: {settings.sentry_environment})")
    else:
        logger.info("ℹ️  Sentry not configured (SENTRY_DSN not set)")


def filter_health_checks(event, hint):
    """Filter out health check endpoint errors from Sentry."""
    if "request" in event:
        url = event.get("request", {}).get("url", "")
        if "/health" in url:
            return None
    return event


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Initialize error tracking first
    init_sentry()

    # ... rest of existing lifespan code ...
```

#### Frontend Integration (Optional)

Add to `src/frontend/src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

// Initialize Sentry for frontend error tracking
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || "development",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,  // Privacy: mask all text
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

### 1.3 Analytics Database Schema

Create new tables for storing aggregated analytics data.

#### Migration File

Create `src/backend/alembic/versions/xxxx_add_analytics_tables.py`:

```python
"""Add analytics tables for reporting

Revision ID: add_analytics_tables
Revises: [previous_revision]
Create Date: 2026-01-09
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

# revision identifiers
revision = 'add_analytics_tables'
down_revision = '[previous_revision]'  # Update this
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Daily metrics aggregation table
    op.create_table(
        'daily_metrics',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('workflow_id', UUID(as_uuid=True), sa.ForeignKey('workflows.id', ondelete='CASCADE'), nullable=True),
        sa.Column('date', sa.Date(), nullable=False),

        # Message metrics
        sa.Column('message_count', sa.Integer(), default=0, nullable=False),
        sa.Column('user_message_count', sa.Integer(), default=0, nullable=False),
        sa.Column('assistant_message_count', sa.Integer(), default=0, nullable=False),

        # Session metrics
        sa.Column('conversation_count', sa.Integer(), default=0, nullable=False),
        sa.Column('unique_sessions', sa.Integer(), default=0, nullable=False),
        sa.Column('avg_messages_per_session', sa.Float(), default=0.0, nullable=False),

        # Token/cost metrics
        sa.Column('input_tokens', sa.Integer(), default=0, nullable=False),
        sa.Column('output_tokens', sa.Integer(), default=0, nullable=False),
        sa.Column('total_tokens', sa.Integer(), default=0, nullable=False),
        sa.Column('estimated_cost_usd', sa.Numeric(10, 6), default=0, nullable=False),

        # Error metrics
        sa.Column('error_count', sa.Integer(), default=0, nullable=False),

        # Metadata
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),

        # Ensure one row per user/workflow/date combination
        sa.UniqueConstraint('user_id', 'workflow_id', 'date', name='uq_daily_metrics_user_workflow_date'),
    )

    # Indexes for common queries
    op.create_index('ix_daily_metrics_user_date', 'daily_metrics', ['user_id', 'date'])
    op.create_index('ix_daily_metrics_workflow', 'daily_metrics', ['workflow_id'])
    op.create_index('ix_daily_metrics_date', 'daily_metrics', ['date'])

    # User activity events table (for funnel analysis)
    op.create_table(
        'user_activity_events',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),

        # Event details
        sa.Column('event_type', sa.String(50), nullable=False),  # e.g., 'workflow_created', 'message_sent'
        sa.Column('event_category', sa.String(50), nullable=False),  # e.g., 'engagement', 'onboarding'

        # Related entities (nullable - depends on event type)
        sa.Column('workflow_id', UUID(as_uuid=True), sa.ForeignKey('workflows.id', ondelete='SET NULL'), nullable=True),
        sa.Column('component_id', UUID(as_uuid=True), sa.ForeignKey('agent_components.id', ondelete='SET NULL'), nullable=True),
        sa.Column('conversation_id', UUID(as_uuid=True), sa.ForeignKey('conversations.id', ondelete='SET NULL'), nullable=True),

        # Additional context
        sa.Column('metadata', JSONB, default={}, nullable=False),

        # Timestamp
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), index=True),
    )

    # Indexes for event queries
    op.create_index('ix_user_activity_user_type', 'user_activity_events', ['user_id', 'event_type'])
    op.create_index('ix_user_activity_category', 'user_activity_events', ['event_category', 'created_at'])

    # Error logs table (supplements Sentry with queryable data)
    op.create_table(
        'error_logs',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),

        # Error details
        sa.Column('service', sa.String(50), nullable=False),  # 'langflow', 'openai', 'backend'
        sa.Column('error_type', sa.String(100), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=False),
        sa.Column('error_code', sa.String(50), nullable=True),

        # Context
        sa.Column('workflow_id', UUID(as_uuid=True), nullable=True),
        sa.Column('endpoint', sa.String(200), nullable=True),
        sa.Column('request_id', sa.String(100), nullable=True),
        sa.Column('metadata', JSONB, default={}, nullable=False),

        # Sentry reference (if applicable)
        sa.Column('sentry_event_id', sa.String(100), nullable=True),

        # Timestamp
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), index=True),
    )

    # Indexes for error analysis
    op.create_index('ix_error_logs_service', 'error_logs', ['service', 'created_at'])
    op.create_index('ix_error_logs_user', 'error_logs', ['user_id', 'created_at'])


def downgrade() -> None:
    op.drop_table('error_logs')
    op.drop_table('user_activity_events')
    op.drop_table('daily_metrics')
```

#### SQLAlchemy Models

Create `src/backend/app/models/analytics.py`:

```python
"""
Analytics models for reporting and metrics tracking.
"""
import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Optional, Dict, Any

from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime,
    Numeric, ForeignKey, Text, UniqueConstraint, Index
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.database import Base


class DailyMetrics(Base):
    """
    Aggregated daily metrics per user and workflow.

    This table is populated by a background job that aggregates
    data from messages, conversations, and Langflow API responses.
    """
    __tablename__ = "daily_metrics"

    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    workflow_id: Optional[uuid.UUID] = Column(UUID(as_uuid=True), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=True)
    date: date = Column(Date, nullable=False)

    # Message metrics
    message_count: int = Column(Integer, default=0, nullable=False)
    user_message_count: int = Column(Integer, default=0, nullable=False)
    assistant_message_count: int = Column(Integer, default=0, nullable=False)

    # Session metrics
    conversation_count: int = Column(Integer, default=0, nullable=False)
    unique_sessions: int = Column(Integer, default=0, nullable=False)
    avg_messages_per_session: float = Column(Float, default=0.0, nullable=False)

    # Token/cost metrics
    input_tokens: int = Column(Integer, default=0, nullable=False)
    output_tokens: int = Column(Integer, default=0, nullable=False)
    total_tokens: int = Column(Integer, default=0, nullable=False)
    estimated_cost_usd: Decimal = Column(Numeric(10, 6), default=0, nullable=False)

    # Error metrics
    error_count: int = Column(Integer, default=0, nullable=False)

    # Timestamps
    created_at: datetime = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: datetime = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="daily_metrics")
    workflow = relationship("Workflow", back_populates="daily_metrics")

    __table_args__ = (
        UniqueConstraint('user_id', 'workflow_id', 'date', name='uq_daily_metrics_user_workflow_date'),
        Index('ix_daily_metrics_user_date', 'user_id', 'date'),
        Index('ix_daily_metrics_workflow', 'workflow_id'),
    )


class UserActivityEvent(Base):
    """
    Individual user activity events for funnel analysis.

    Events are recorded as users progress through the platform:
    - signup → onboarding_completed
    - component_created → component_published
    - workflow_created → workflow_published
    - message_sent → conversation_completed
    """
    __tablename__ = "user_activity_events"

    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Event details
    event_type: str = Column(String(50), nullable=False)
    event_category: str = Column(String(50), nullable=False)

    # Related entities
    workflow_id: Optional[uuid.UUID] = Column(UUID(as_uuid=True), ForeignKey("workflows.id", ondelete="SET NULL"), nullable=True)
    component_id: Optional[uuid.UUID] = Column(UUID(as_uuid=True), ForeignKey("agent_components.id", ondelete="SET NULL"), nullable=True)
    conversation_id: Optional[uuid.UUID] = Column(UUID(as_uuid=True), ForeignKey("conversations.id", ondelete="SET NULL"), nullable=True)

    # Additional context
    metadata: Dict[str, Any] = Column(JSONB, default=dict, nullable=False)

    # Timestamp
    created_at: datetime = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="activity_events")

    __table_args__ = (
        Index('ix_user_activity_user_type', 'user_id', 'event_type'),
        Index('ix_user_activity_category', 'event_category', 'created_at'),
    )


class ErrorLog(Base):
    """
    Queryable error logs for analytics.

    Supplements Sentry with in-database error tracking for:
    - Admin dashboard error visibility
    - Error rate calculations
    - Service-specific error analysis
    """
    __tablename__ = "error_logs"

    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Optional[uuid.UUID] = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Error details
    service: str = Column(String(50), nullable=False)  # 'langflow', 'openai', 'anthropic', 'backend'
    error_type: str = Column(String(100), nullable=False)
    error_message: str = Column(Text, nullable=False)
    error_code: Optional[str] = Column(String(50), nullable=True)

    # Context
    workflow_id: Optional[uuid.UUID] = Column(UUID(as_uuid=True), nullable=True)
    endpoint: Optional[str] = Column(String(200), nullable=True)
    request_id: Optional[str] = Column(String(100), nullable=True)
    metadata: Dict[str, Any] = Column(JSONB, default=dict, nullable=False)

    # Sentry reference
    sentry_event_id: Optional[str] = Column(String(100), nullable=True)

    # Timestamp
    created_at: datetime = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="error_logs")

    __table_args__ = (
        Index('ix_error_logs_service', 'service', 'created_at'),
        Index('ix_error_logs_user', 'user_id', 'created_at'),
    )


# Event type constants for consistency
class EventTypes:
    """Standard event types for user activity tracking."""

    # Onboarding
    USER_SIGNED_UP = "user_signed_up"
    ONBOARDING_STARTED = "onboarding_started"
    ONBOARDING_COMPLETED = "onboarding_completed"

    # Components
    COMPONENT_CREATED = "component_created"
    COMPONENT_UPDATED = "component_updated"
    COMPONENT_PUBLISHED = "component_published"
    COMPONENT_DELETED = "component_deleted"

    # Workflows
    WORKFLOW_CREATED = "workflow_created"
    WORKFLOW_UPDATED = "workflow_updated"
    WORKFLOW_PUBLISHED = "workflow_published"
    WORKFLOW_DELETED = "workflow_deleted"

    # Engagement
    MESSAGE_SENT = "message_sent"
    CONVERSATION_STARTED = "conversation_started"
    CONVERSATION_COMPLETED = "conversation_completed"

    # Canvas
    CANVAS_OPENED = "canvas_opened"
    NODE_ADDED = "node_added"
    NODE_MODIFIED = "node_modified"


class EventCategories:
    """Standard event categories for grouping."""
    ONBOARDING = "onboarding"
    COMPONENTS = "components"
    WORKFLOWS = "workflows"
    ENGAGEMENT = "engagement"
    CANVAS = "canvas"
```

### 1.4 Analytics Service

Create `src/backend/app/services/analytics_service.py`:

```python
"""
Analytics service for tracking events and computing metrics.
"""
import uuid
from datetime import date, datetime, timedelta
from decimal import Decimal
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func, and_, case
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analytics import (
    DailyMetrics, UserActivityEvent, ErrorLog,
    EventTypes, EventCategories
)
from app.models.message import Message
from app.models.conversation import Conversation


class AnalyticsService:
    """Service for analytics operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    # =========================================================================
    # Event Tracking
    # =========================================================================

    async def track_event(
        self,
        user_id: uuid.UUID,
        event_type: str,
        event_category: str,
        workflow_id: Optional[uuid.UUID] = None,
        component_id: Optional[uuid.UUID] = None,
        conversation_id: Optional[uuid.UUID] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> UserActivityEvent:
        """
        Track a user activity event.

        Usage:
            await analytics.track_event(
                user_id=user.id,
                event_type=EventTypes.WORKFLOW_CREATED,
                event_category=EventCategories.WORKFLOWS,
                workflow_id=workflow.id,
                metadata={"template": "support_bot"}
            )
        """
        event = UserActivityEvent(
            user_id=user_id,
            event_type=event_type,
            event_category=event_category,
            workflow_id=workflow_id,
            component_id=component_id,
            conversation_id=conversation_id,
            metadata=metadata or {},
        )
        self.session.add(event)
        await self.session.commit()
        return event

    async def log_error(
        self,
        service: str,
        error_type: str,
        error_message: str,
        user_id: Optional[uuid.UUID] = None,
        workflow_id: Optional[uuid.UUID] = None,
        error_code: Optional[str] = None,
        endpoint: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        sentry_event_id: Optional[str] = None,
    ) -> ErrorLog:
        """Log an error for analytics tracking."""
        error = ErrorLog(
            user_id=user_id,
            service=service,
            error_type=error_type,
            error_message=error_message[:5000],  # Truncate long messages
            error_code=error_code,
            workflow_id=workflow_id,
            endpoint=endpoint,
            request_id=request_id,
            metadata=metadata or {},
            sentry_event_id=sentry_event_id,
        )
        self.session.add(error)
        await self.session.commit()
        return error

    # =========================================================================
    # User-Facing Stats
    # =========================================================================

    async def get_user_stats(
        self,
        user_id: uuid.UUID,
        days: int = 30,
    ) -> Dict[str, Any]:
        """
        Get aggregated stats for a user's dashboard.

        Returns:
            {
                "total_messages": 147,
                "total_conversations": 34,
                "total_workflows": 5,
                "active_workflows": 3,
                "messages_this_week": 42,
                "conversations_this_week": 12,
                "daily_breakdown": [...],
                "most_active_workflow": {...},
                "avg_messages_per_conversation": 4.3,
            }
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        week_start = end_date - timedelta(days=7)

        # Total messages for user
        total_messages_query = select(func.count(Message.id)).where(
            Message.conversation_id.in_(
                select(Conversation.id).where(Conversation.user_id == user_id)
            )
        )
        total_messages = (await self.session.execute(total_messages_query)).scalar() or 0

        # Total conversations
        total_conversations_query = select(func.count(Conversation.id)).where(
            Conversation.user_id == user_id
        )
        total_conversations = (await self.session.execute(total_conversations_query)).scalar() or 0

        # Messages this week
        week_messages_query = select(func.count(Message.id)).where(
            and_(
                Message.conversation_id.in_(
                    select(Conversation.id).where(Conversation.user_id == user_id)
                ),
                Message.created_at >= week_start
            )
        )
        messages_this_week = (await self.session.execute(week_messages_query)).scalar() or 0

        # Conversations this week
        week_conversations_query = select(func.count(Conversation.id)).where(
            and_(
                Conversation.user_id == user_id,
                Conversation.created_at >= week_start
            )
        )
        conversations_this_week = (await self.session.execute(week_conversations_query)).scalar() or 0

        # Daily breakdown (last N days)
        daily_breakdown = await self._get_daily_breakdown(user_id, days)

        # Most active workflow
        most_active = await self._get_most_active_workflow(user_id)

        # Average messages per conversation
        avg_messages = total_messages / total_conversations if total_conversations > 0 else 0

        return {
            "total_messages": total_messages,
            "total_conversations": total_conversations,
            "messages_this_week": messages_this_week,
            "conversations_this_week": conversations_this_week,
            "daily_breakdown": daily_breakdown,
            "most_active_workflow": most_active,
            "avg_messages_per_conversation": round(avg_messages, 1),
            "period_days": days,
        }

    async def _get_daily_breakdown(
        self,
        user_id: uuid.UUID,
        days: int,
    ) -> List[Dict[str, Any]]:
        """Get message counts per day."""
        end_date = date.today()
        start_date = end_date - timedelta(days=days)

        # Query messages grouped by date
        query = select(
            func.date(Message.created_at).label('date'),
            func.count(Message.id).label('count')
        ).where(
            and_(
                Message.conversation_id.in_(
                    select(Conversation.id).where(Conversation.user_id == user_id)
                ),
                Message.created_at >= start_date
            )
        ).group_by(func.date(Message.created_at)).order_by(func.date(Message.created_at))

        result = await self.session.execute(query)
        rows = result.all()

        # Convert to dict for easy lookup
        counts_by_date = {row.date: row.count for row in rows}

        # Fill in all days (including zeros)
        breakdown = []
        current = start_date
        while current <= end_date:
            breakdown.append({
                "date": current.isoformat(),
                "messages": counts_by_date.get(current, 0),
            })
            current += timedelta(days=1)

        return breakdown

    async def _get_most_active_workflow(
        self,
        user_id: uuid.UUID,
    ) -> Optional[Dict[str, Any]]:
        """Get the workflow with most messages in last 30 days."""
        from app.models.workflow import Workflow

        thirty_days_ago = datetime.utcnow() - timedelta(days=30)

        query = select(
            Workflow.id,
            Workflow.name,
            func.count(Message.id).label('message_count')
        ).join(
            Conversation, Conversation.workflow_id == Workflow.id
        ).join(
            Message, Message.conversation_id == Conversation.id
        ).where(
            and_(
                Workflow.user_id == user_id,
                Message.created_at >= thirty_days_ago
            )
        ).group_by(Workflow.id, Workflow.name).order_by(
            func.count(Message.id).desc()
        ).limit(1)

        result = await self.session.execute(query)
        row = result.first()

        if row:
            return {
                "id": str(row.id),
                "name": row.name,
                "message_count": row.message_count,
            }
        return None

    # =========================================================================
    # Admin Stats
    # =========================================================================

    async def get_admin_overview(
        self,
        days: int = 30,
    ) -> Dict[str, Any]:
        """
        Get platform-wide admin statistics.

        Returns:
            {
                "total_users": 150,
                "active_users_today": 23,
                "active_users_week": 67,
                "total_workflows": 340,
                "total_messages_today": 1234,
                "total_messages_week": 8765,
                "error_count_today": 3,
                "error_rate": 0.002,
                "estimated_cost_today": 12.34,
                "funnel": {...},
            }
        """
        from app.models.user import User
        from app.models.workflow import Workflow

        today = date.today()
        week_ago = today - timedelta(days=7)

        # Total users
        total_users = (await self.session.execute(
            select(func.count(User.id))
        )).scalar() or 0

        # Active users today (had a message)
        active_today = (await self.session.execute(
            select(func.count(func.distinct(Conversation.user_id))).where(
                func.date(Conversation.updated_at) == today
            )
        )).scalar() or 0

        # Active users this week
        active_week = (await self.session.execute(
            select(func.count(func.distinct(Conversation.user_id))).where(
                Conversation.updated_at >= week_ago
            )
        )).scalar() or 0

        # Total workflows
        total_workflows = (await self.session.execute(
            select(func.count(Workflow.id))
        )).scalar() or 0

        # Messages today
        messages_today = (await self.session.execute(
            select(func.count(Message.id)).where(
                func.date(Message.created_at) == today
            )
        )).scalar() or 0

        # Messages this week
        messages_week = (await self.session.execute(
            select(func.count(Message.id)).where(
                Message.created_at >= week_ago
            )
        )).scalar() or 0

        # Errors today
        errors_today = (await self.session.execute(
            select(func.count(ErrorLog.id)).where(
                func.date(ErrorLog.created_at) == today
            )
        )).scalar() or 0

        # Error rate
        error_rate = errors_today / messages_today if messages_today > 0 else 0

        # Cost estimation from daily metrics
        cost_today = (await self.session.execute(
            select(func.sum(DailyMetrics.estimated_cost_usd)).where(
                DailyMetrics.date == today
            )
        )).scalar() or Decimal('0')

        # User funnel
        funnel = await self._get_user_funnel(days)

        return {
            "total_users": total_users,
            "active_users_today": active_today,
            "active_users_week": active_week,
            "total_workflows": total_workflows,
            "total_messages_today": messages_today,
            "total_messages_week": messages_week,
            "error_count_today": errors_today,
            "error_rate": round(error_rate, 4),
            "estimated_cost_today_usd": float(cost_today),
            "funnel": funnel,
        }

    async def _get_user_funnel(self, days: int) -> Dict[str, int]:
        """Get user funnel metrics."""
        from app.models.user import User
        from app.models.agent_component import AgentComponent
        from app.models.workflow import Workflow

        cutoff = datetime.utcnow() - timedelta(days=days)

        # Users signed up
        signed_up = (await self.session.execute(
            select(func.count(User.id)).where(User.created_at >= cutoff)
        )).scalar() or 0

        # Users who created a component
        created_component = (await self.session.execute(
            select(func.count(func.distinct(AgentComponent.user_id))).where(
                AgentComponent.created_at >= cutoff
            )
        )).scalar() or 0

        # Users who created a workflow
        created_workflow = (await self.session.execute(
            select(func.count(func.distinct(Workflow.user_id))).where(
                Workflow.created_at >= cutoff
            )
        )).scalar() or 0

        # Users who sent a message
        sent_message = (await self.session.execute(
            select(func.count(func.distinct(Conversation.user_id))).where(
                Conversation.created_at >= cutoff
            )
        )).scalar() or 0

        return {
            "signed_up": signed_up,
            "created_component": created_component,
            "created_workflow": created_workflow,
            "sent_message": sent_message,
        }

    async def get_recent_errors(
        self,
        limit: int = 20,
        service: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Get recent errors for admin dashboard."""
        query = select(ErrorLog).order_by(ErrorLog.created_at.desc()).limit(limit)

        if service:
            query = query.where(ErrorLog.service == service)

        result = await self.session.execute(query)
        errors = result.scalars().all()

        return [
            {
                "id": str(e.id),
                "service": e.service,
                "error_type": e.error_type,
                "error_message": e.error_message[:200],  # Truncate for display
                "error_code": e.error_code,
                "endpoint": e.endpoint,
                "created_at": e.created_at.isoformat(),
                "sentry_url": f"https://sentry.io/issues/?query={e.sentry_event_id}" if e.sentry_event_id else None,
            }
            for e in errors
        ]
```

### 1.5 Updated Analytics API Endpoints

Update `src/backend/app/api/analytics.py`:

```python
"""
Analytics endpoints for user and admin dashboards.
"""
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.user import User
from app.services.user_service import UserService
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


# =============================================================================
# Response Models
# =============================================================================

class DailyBreakdown(BaseModel):
    date: str
    messages: int


class MostActiveWorkflow(BaseModel):
    id: str
    name: str
    message_count: int


class UserStatsResponse(BaseModel):
    """User-facing stats for 'My Stats' dashboard."""
    total_messages: int
    total_conversations: int
    messages_this_week: int
    conversations_this_week: int
    daily_breakdown: List[DailyBreakdown]
    most_active_workflow: Optional[MostActiveWorkflow]
    avg_messages_per_conversation: float
    period_days: int


class FunnelData(BaseModel):
    signed_up: int
    created_component: int
    created_workflow: int
    sent_message: int


class AdminOverviewResponse(BaseModel):
    """Admin dashboard overview stats."""
    total_users: int
    active_users_today: int
    active_users_week: int
    total_workflows: int
    total_messages_today: int
    total_messages_week: int
    error_count_today: int
    error_rate: float
    estimated_cost_today_usd: float
    funnel: FunnelData


class ErrorLogItem(BaseModel):
    id: str
    service: str
    error_type: str
    error_message: str
    error_code: Optional[str]
    endpoint: Optional[str]
    created_at: str
    sentry_url: Optional[str]


class RecentErrorsResponse(BaseModel):
    errors: List[ErrorLogItem]
    total: int


# =============================================================================
# Helper Functions
# =============================================================================

async def get_user_from_clerk(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


# =============================================================================
# User-Facing Endpoints
# =============================================================================

@router.get(
    "/my-stats",
    response_model=UserStatsResponse,
    summary="Get user's analytics",
    description="Get aggregated statistics for the current user's dashboard.",
)
async def get_my_stats(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    days: int = 30,
):
    """
    Get personalized analytics for the user's dashboard.

    Shows:
    - Total messages and conversations
    - This week's activity
    - Daily message breakdown
    - Most active workflow
    """
    user = await get_user_from_clerk(clerk_user, session)
    analytics = AnalyticsService(session)

    stats = await analytics.get_user_stats(user.id, days=days)
    return UserStatsResponse(**stats)


# =============================================================================
# Admin Endpoints (Protected)
# =============================================================================

async def require_admin(clerk_user: CurrentUser) -> None:
    """Check if user has admin privileges."""
    # For MVP, check if user email is in admin list
    # TODO: Implement proper role-based access control
    admin_emails = ["adam@teachcharlie.ai"]  # Configure via env var
    if clerk_user.get("email") not in admin_emails:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )


@router.get(
    "/admin/overview",
    response_model=AdminOverviewResponse,
    summary="Get admin overview",
    description="Get platform-wide statistics for admin dashboard.",
)
async def get_admin_overview(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    days: int = 30,
):
    """
    Get platform-wide admin statistics.

    Requires admin privileges.
    """
    await require_admin(clerk_user)
    analytics = AnalyticsService(session)

    overview = await analytics.get_admin_overview(days=days)
    return AdminOverviewResponse(**overview)


@router.get(
    "/admin/errors",
    response_model=RecentErrorsResponse,
    summary="Get recent errors",
    description="Get recent error logs for admin dashboard.",
)
async def get_admin_errors(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    limit: int = 20,
    service: Optional[str] = None,
):
    """
    Get recent errors for the admin error dashboard.

    Optionally filter by service (langflow, openai, anthropic, backend).
    """
    await require_admin(clerk_user)
    analytics = AnalyticsService(session)

    errors = await analytics.get_recent_errors(limit=limit, service=service)
    return RecentErrorsResponse(errors=errors, total=len(errors))
```

---

## Phase 2: User-Facing Stats (Week 2)

**Goal**: Build the "Charlie Stats" UI component for user dashboards.

### 2.1 Frontend API Client

Add to `src/frontend/src/lib/api.ts`:

```typescript
// =============================================================================
// Analytics API
// =============================================================================

export interface DailyBreakdown {
  date: string;
  messages: number;
}

export interface MostActiveWorkflow {
  id: string;
  name: string;
  message_count: number;
}

export interface UserStats {
  total_messages: number;
  total_conversations: number;
  messages_this_week: number;
  conversations_this_week: number;
  daily_breakdown: DailyBreakdown[];
  most_active_workflow: MostActiveWorkflow | null;
  avg_messages_per_conversation: number;
  period_days: number;
}

export async function getMyStats(days: number = 30): Promise<UserStats> {
  return apiRequest<UserStats>(`/analytics/my-stats?days=${days}`);
}
```

### 2.2 Stats Card Component

Create `src/frontend/src/components/analytics/StatsCard.tsx`:

```tsx
import { useQuery } from "@tanstack/react-query";
import { getMyStats, UserStats } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, TrendingUp, Zap } from "lucide-react";
import { MiniChart } from "./MiniChart";

interface StatItemProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  trend?: number;
}

function StatItem({ icon, value, label, trend }: StatItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {trend !== undefined && trend !== 0 && (
            <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export function StatsCard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["my-stats"],
    queryFn: () => getMyStats(14), // Last 14 days
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Charlie Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Charlie Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load stats</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate week-over-week trend (simplified)
  const thisWeek = stats.messages_this_week;
  const avgDaily = stats.total_messages / stats.period_days;
  const expectedWeek = avgDaily * 7;
  const trend = expectedWeek > 0
    ? Math.round(((thisWeek - expectedWeek) / expectedWeek) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Charlie Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatItem
            icon={<MessageSquare className="h-5 w-5 text-primary" />}
            value={stats.messages_this_week}
            label="Messages this week"
            trend={trend}
          />
          <StatItem
            icon={<Users className="h-5 w-5 text-primary" />}
            value={stats.conversations_this_week}
            label="Conversations"
          />
          <StatItem
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            value={stats.avg_messages_per_conversation}
            label="Avg per conversation"
          />
          <StatItem
            icon={<Zap className="h-5 w-5 text-primary" />}
            value={stats.total_messages}
            label="Total messages"
          />
        </div>

        {/* Activity chart */}
        <div>
          <h4 className="text-sm font-medium mb-2">Activity</h4>
          <MiniChart data={stats.daily_breakdown} />
        </div>

        {/* Most active workflow */}
        {stats.most_active_workflow && (
          <div className="pt-2 border-t">
            <span className="text-sm text-muted-foreground">Most active: </span>
            <span className="font-medium">{stats.most_active_workflow.name}</span>
            <span className="text-sm text-muted-foreground">
              {" "}({stats.most_active_workflow.message_count} messages)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 2.3 Mini Chart Component

Create `src/frontend/src/components/analytics/MiniChart.tsx`:

```tsx
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { DailyBreakdown } from "@/lib/api";

interface MiniChartProps {
  data: DailyBreakdown[];
}

export function MiniChart({ data }: MiniChartProps) {
  // Format date for display
  const formattedData = data.map(d => ({
    ...d,
    displayDate: new Date(d.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
  }));

  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="displayDate"
            tick={false}
            axisLine={false}
          />
          <YAxis hide />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border rounded-md p-2 shadow-md">
                    <p className="text-sm font-medium">{payload[0].payload.displayDate}</p>
                    <p className="text-sm text-muted-foreground">
                      {payload[0].value} messages
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="messages"
            stroke="hsl(var(--primary))"
            fill="url(#colorMessages)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### 2.4 Integration Points

Add StatsCard to relevant pages:

```tsx
// In ProjectDetailPage.tsx or Dashboard
import { StatsCard } from "@/components/analytics/StatsCard";

// Add to sidebar or overview section
<StatsCard />
```

---

## Phase 3: Admin Dashboard (Week 3)

**Goal**: Build admin-only dashboard with platform-wide metrics.

### 3.1 Admin Route Protection

Create `src/frontend/src/components/admin/AdminGuard.tsx`:

```tsx
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ADMIN_EMAILS = ["adam@teachcharlie.ai"]; // Move to env

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email || !ADMIN_EMAILS.includes(email)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

### 3.2 Admin Dashboard Page

Create `src/frontend/src/pages/AdminDashboardPage.tsx`:

```tsx
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, MessageSquare, Workflow, AlertTriangle,
  DollarSign, TrendingUp, Activity
} from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { FunnelChart } from "@/components/admin/FunnelChart";
import { ErrorList } from "@/components/admin/ErrorList";

interface AdminOverview {
  total_users: number;
  active_users_today: number;
  active_users_week: number;
  total_workflows: number;
  total_messages_today: number;
  total_messages_week: number;
  error_count_today: number;
  error_rate: number;
  estimated_cost_today_usd: number;
  funnel: {
    signed_up: number;
    created_component: number;
    created_workflow: number;
    sent_message: number;
  };
}

async function getAdminOverview(): Promise<AdminOverview> {
  const response = await fetch("/api/v1/analytics/admin/overview", {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch admin overview");
  return response.json();
}

function MetricCard({
  title,
  value,
  icon: Icon,
  subtitle,
  variant = "default"
}: {
  title: string;
  value: string | number;
  icon: any;
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const variantStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-500",
    warning: "bg-yellow-500/10 text-yellow-500",
    danger: "bg-red-500/10 text-red-500",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${variantStyles[variant]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) return <div>Loading admin dashboard...</div>;
  if (error || !data) return <div>Error loading dashboard</div>;

  return (
    <AdminGuard>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Users"
            value={data.total_users}
            icon={Users}
            subtitle={`${data.active_users_today} active today`}
          />
          <MetricCard
            title="Messages Today"
            value={data.total_messages_today.toLocaleString()}
            icon={MessageSquare}
            subtitle={`${data.total_messages_week.toLocaleString()} this week`}
          />
          <MetricCard
            title="Total Workflows"
            value={data.total_workflows}
            icon={Workflow}
          />
          <MetricCard
            title="Est. Cost Today"
            value={`$${data.estimated_cost_today_usd.toFixed(2)}`}
            icon={DollarSign}
            variant="warning"
          />
        </div>

        {/* Error Rate Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Errors Today"
            value={data.error_count_today}
            icon={AlertTriangle}
            subtitle={`Error rate: ${(data.error_rate * 100).toFixed(2)}%`}
            variant={data.error_count_today > 10 ? "danger" : "default"}
          />
          <MetricCard
            title="Active Users (Week)"
            value={data.active_users_week}
            icon={Activity}
            subtitle={`${Math.round((data.active_users_week / data.total_users) * 100)}% of total`}
            variant="success"
          />
        </div>

        {/* User Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>User Funnel (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <FunnelChart data={data.funnel} />
          </CardContent>
        </Card>

        {/* Recent Errors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Recent Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorList />
          </CardContent>
        </Card>

        {/* External Links */}
        <Card>
          <CardHeader>
            <CardTitle>External Dashboards</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <a
              href="https://smith.langchain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              LangSmith Traces
            </a>
            <a
              href="https://sentry.io"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Sentry Errors
            </a>
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
}
```

### 3.3 Funnel Chart Component

Create `src/frontend/src/components/admin/FunnelChart.tsx`:

```tsx
interface FunnelData {
  signed_up: number;
  created_component: number;
  created_workflow: number;
  sent_message: number;
}

interface FunnelChartProps {
  data: FunnelData;
}

export function FunnelChart({ data }: FunnelChartProps) {
  const steps = [
    { label: "Signed Up", value: data.signed_up, color: "bg-blue-500" },
    { label: "Created Component", value: data.created_component, color: "bg-purple-500" },
    { label: "Created Workflow", value: data.created_workflow, color: "bg-green-500" },
    { label: "Sent Message", value: data.sent_message, color: "bg-yellow-500" },
  ];

  const maxValue = Math.max(...steps.map(s => s.value));

  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const width = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
        const conversionRate = index > 0 && steps[index - 1].value > 0
          ? ((step.value / steps[index - 1].value) * 100).toFixed(1)
          : null;

        return (
          <div key={step.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{step.label}</span>
              <span className="font-medium">
                {step.value.toLocaleString()}
                {conversionRate && (
                  <span className="text-muted-foreground ml-2">
                    ({conversionRate}% conversion)
                  </span>
                )}
              </span>
            </div>
            <div className="h-8 bg-muted rounded-md overflow-hidden">
              <div
                className={`h-full ${step.color} transition-all duration-500`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### 3.4 Error List Component

Create `src/frontend/src/components/admin/ErrorList.tsx`:

```tsx
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";

interface ErrorItem {
  id: string;
  service: string;
  error_type: string;
  error_message: string;
  error_code: string | null;
  endpoint: string | null;
  created_at: string;
  sentry_url: string | null;
}

async function getRecentErrors(): Promise<{ errors: ErrorItem[] }> {
  const response = await fetch("/api/v1/analytics/admin/errors?limit=10", {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch errors");
  return response.json();
}

export function ErrorList() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-errors"],
    queryFn: getRecentErrors,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) return <div>Loading errors...</div>;
  if (!data?.errors?.length) {
    return <p className="text-muted-foreground">No recent errors</p>;
  }

  return (
    <div className="space-y-2">
      {data.errors.map((error) => (
        <div
          key={error.id}
          className="p-3 border rounded-md bg-red-500/5 border-red-500/20"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-500 rounded">
                  {error.service}
                </span>
                <span className="text-sm font-medium">{error.error_type}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {error.error_message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(error.created_at).toLocaleString()}
                {error.endpoint && ` • ${error.endpoint}`}
              </p>
            </div>
            {error.sentry_url && (
              <a
                href={error.sentry_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Phase 4: Cost Tracking (Week 4+)

**Goal**: Track token usage and estimate costs for billing preparation.

### 4.1 Token Extraction from Langflow Responses

Update the chat endpoint to extract and store token usage:

```python
# In workflow_service.py or chat handling

async def process_chat_with_metrics(
    self,
    workflow_id: uuid.UUID,
    user_id: uuid.UUID,
    message: str,
    session_id: str,
) -> Dict[str, Any]:
    """Process chat and extract metrics."""

    # Call Langflow
    response = await self.langflow_client.run_flow(
        flow_id=workflow.langflow_flow_id,
        input_value=message,
        session_id=session_id,
    )

    # Extract token usage from response metadata
    metadata = response.get("metadata", {})
    tokens = self._extract_tokens(metadata)

    # Update daily metrics
    await self._update_daily_metrics(
        user_id=user_id,
        workflow_id=workflow_id,
        tokens=tokens,
    )

    return response

def _extract_tokens(self, metadata: Dict[str, Any]) -> Dict[str, int]:
    """Extract token counts from Langflow response metadata."""
    # Langflow returns token info in various formats depending on LLM
    # This handles common patterns

    input_tokens = 0
    output_tokens = 0

    # OpenAI format
    if "usage" in metadata:
        usage = metadata["usage"]
        input_tokens = usage.get("prompt_tokens", 0)
        output_tokens = usage.get("completion_tokens", 0)

    # Anthropic format
    elif "input_tokens" in metadata:
        input_tokens = metadata.get("input_tokens", 0)
        output_tokens = metadata.get("output_tokens", 0)

    return {
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "total_tokens": input_tokens + output_tokens,
    }

async def _update_daily_metrics(
    self,
    user_id: uuid.UUID,
    workflow_id: uuid.UUID,
    tokens: Dict[str, int],
) -> None:
    """Update daily metrics with token usage."""
    from app.services.analytics_service import AnalyticsService

    analytics = AnalyticsService(self.session)

    # Estimate cost (example: GPT-4 pricing)
    # TODO: Make this configurable per LLM provider
    COST_PER_INPUT_TOKEN = 0.00003  # $0.03 per 1K tokens
    COST_PER_OUTPUT_TOKEN = 0.00006  # $0.06 per 1K tokens

    estimated_cost = (
        tokens["input_tokens"] * COST_PER_INPUT_TOKEN +
        tokens["output_tokens"] * COST_PER_OUTPUT_TOKEN
    )

    await analytics.update_daily_metrics(
        user_id=user_id,
        workflow_id=workflow_id,
        message_count=1,
        input_tokens=tokens["input_tokens"],
        output_tokens=tokens["output_tokens"],
        estimated_cost=estimated_cost,
    )
```

### 4.2 Cost Configuration

Add LLM pricing configuration:

```python
# In config.py or a separate pricing module

LLM_PRICING = {
    "gpt-4": {
        "input": 0.00003,   # $0.03 per 1K tokens
        "output": 0.00006,  # $0.06 per 1K tokens
    },
    "gpt-4-turbo": {
        "input": 0.00001,
        "output": 0.00003,
    },
    "gpt-3.5-turbo": {
        "input": 0.0000005,
        "output": 0.0000015,
    },
    "claude-3-opus": {
        "input": 0.000015,
        "output": 0.000075,
    },
    "claude-3-sonnet": {
        "input": 0.000003,
        "output": 0.000015,
    },
    "claude-3-haiku": {
        "input": 0.00000025,
        "output": 0.00000125,
    },
}
```

---

## Phase 5: Future Enhancements

### 5.1 PostHog Integration (Product Analytics)

For more sophisticated product analytics:

```bash
# Add to .env
VITE_POSTHOG_KEY=phc_xxxxx
VITE_POSTHOG_HOST=https://app.posthog.com
```

```typescript
// Frontend tracking
import posthog from 'posthog-js';

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
});

// Track events
posthog.capture('workflow_created', {
  workflow_id: workflow.id,
  template_type: 'support_bot',
});
```

### 5.2 Usage Alerts

Implement alerts for approaching limits:

```python
async def check_usage_alerts(user_id: uuid.UUID) -> List[Alert]:
    """Check if user is approaching usage limits."""
    alerts = []

    monthly_cost = await get_monthly_cost(user_id)
    monthly_limit = await get_user_limit(user_id)

    if monthly_cost > monthly_limit * 0.8:
        alerts.append(Alert(
            type="warning",
            message=f"You've used {monthly_cost/monthly_limit*100:.0f}% of your monthly quota",
        ))

    return alerts
```

### 5.3 Scheduled Reports

Implement weekly email reports:

```python
# Using background task scheduler
async def send_weekly_report(user_id: uuid.UUID):
    """Send weekly usage report to user."""
    stats = await analytics.get_user_stats(user_id, days=7)

    email_content = render_template(
        "weekly_report.html",
        stats=stats,
    )

    await send_email(
        to=user.email,
        subject="Your Weekly Charlie Stats",
        html=email_content,
    )
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Add LangSmith environment variables to `.env` and `.env.example`
- [ ] Add Sentry SDK to requirements.txt
- [ ] Add Sentry config to `config.py`
- [ ] Update `main.py` with Sentry initialization
- [ ] Create database migration for analytics tables
- [ ] Create SQLAlchemy models (`models/analytics.py`)
- [ ] Create analytics service (`services/analytics_service.py`)
- [ ] Update analytics API endpoints (`api/analytics.py`)
- [ ] Test LangSmith tracing is working
- [ ] Test Sentry error capture is working

### Phase 2: User-Facing Stats
- [ ] Add analytics types to frontend API client
- [ ] Create `StatsCard` component
- [ ] Create `MiniChart` component
- [ ] Add recharts to frontend dependencies
- [ ] Integrate StatsCard into dashboard/project pages
- [ ] Test user stats display

### Phase 3: Admin Dashboard
- [ ] Create admin guard component
- [ ] Create admin dashboard page
- [ ] Create funnel chart component
- [ ] Create error list component
- [ ] Add admin route to router
- [ ] Test admin dashboard access control

### Phase 4: Cost Tracking
- [ ] Add token extraction to chat flow
- [ ] Create LLM pricing configuration
- [ ] Update daily metrics with cost data
- [ ] Add cost display to user stats
- [ ] Add cost display to admin dashboard

---

## Dependencies to Add

### Backend (requirements.txt)
```
# Add to existing requirements.txt
sentry-sdk[fastapi]==1.39.1
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "recharts": "^2.10.0",
    "@sentry/react": "^7.92.0"
  }
}
```

---

## Environment Variables Summary

```bash
# =============================================================================
# OBSERVABILITY CONFIGURATION
# =============================================================================

# LangSmith (Admin/Debugging) - https://smith.langchain.com
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com/
LANGSMITH_API_KEY=lsv2_pt_xxxxxxxxxxxx
LANGSMITH_PROJECT=teach-charlie-production

# Sentry (Error Tracking) - https://sentry.io
SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxx
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1

# PostHog (Optional, Product Analytics) - https://posthog.com
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=https://app.posthog.com
```

---

## Estimated Timeline

| Phase | Duration | Complexity | Dependencies |
|-------|----------|------------|--------------|
| Phase 1: Foundation | 3-5 days | Medium | None |
| Phase 2: User Stats | 2-3 days | Low | Phase 1 |
| Phase 3: Admin Dashboard | 3-4 days | Medium | Phase 1, 2 |
| Phase 4: Cost Tracking | 2-3 days | Medium | Phase 1 |
| Phase 5: Enhancements | Ongoing | Variable | All phases |

**Total MVP (Phases 1-3)**: ~2 weeks
**Full Implementation**: ~3-4 weeks

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| LangSmith API changes | Environment variables allow easy updates |
| Sentry costs at scale | Use sampling rate, filter noisy errors |
| Database performance with analytics | Use indexes, consider time-partitioning for scale |
| Admin access bypass | Implement proper RBAC in Phase 5 |
| Token extraction varies by LLM | Build flexible extraction with fallbacks |

---

## Success Metrics

After implementation, track:

1. **Technical Health**
   - Error rate < 1%
   - API latency < 500ms p95
   - Zero untracked errors

2. **User Engagement**
   - Stats page view rate
   - User retention correlation with stats viewing
   - Feature adoption funnel conversion

3. **Business Insights**
   - Cost per user
   - Most valuable workflows
   - Churn prediction signals
