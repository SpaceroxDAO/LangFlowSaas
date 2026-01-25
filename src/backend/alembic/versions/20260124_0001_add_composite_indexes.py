"""Add composite database indexes for query performance

Revision ID: 20260124_0001
Revises: 20260121_0001
Create Date: 2026-01-24

Adds composite indexes to frequently filtered and sorted columns:
- (user_id, created_at) for list queries with time-based sorting
- (conversation_id, created_at) for message ordering
- (user_id, langflow_flow_id) for workflow lookups

These indexes improve query performance for common list operations.
"""
from alembic import op

# revision identifiers, used by Alembic.
revision = "20260124_0001"
down_revision = "20260121_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add composite indexes for query optimization."""

    # Messages: indexed by conversation_id + created_at for ordered message retrieval
    op.create_index(
        "ix_messages_conversation_created",
        "messages",
        ["conversation_id", "created_at"],
        unique=False,
    )

    # Conversations: indexed by user_id + created_at for user's conversation list
    op.create_index(
        "ix_conversations_user_created",
        "conversations",
        ["user_id", "created_at"],
        unique=False,
    )

    # Workflows: indexed by user_id + created_at for user's workflow list
    op.create_index(
        "ix_workflows_user_created",
        "workflows",
        ["user_id", "created_at"],
        unique=False,
    )

    # Workflows: indexed by user_id + langflow_flow_id for flow lookups
    op.create_index(
        "ix_workflows_user_langflow",
        "workflows",
        ["user_id", "langflow_flow_id"],
        unique=False,
    )

    # Agent components: indexed by user_id + created_at for user's agent list
    op.create_index(
        "ix_agent_components_user_created",
        "agent_components",
        ["user_id", "created_at"],
        unique=False,
    )

    # Agent components: indexed by user_id + is_published for filtering published agents
    op.create_index(
        "ix_agent_components_user_published",
        "agent_components",
        ["user_id", "is_published"],
        unique=False,
    )

    # Knowledge sources: indexed by user_id + created_at for user's knowledge list
    op.create_index(
        "ix_knowledge_sources_user_created",
        "knowledge_sources",
        ["user_id", "created_at"],
        unique=False,
    )

    # Billing events: indexed by user_id + created_at for audit trail queries
    op.create_index(
        "ix_billing_events_user_created",
        "billing_events",
        ["user_id", "created_at"],
        unique=False,
    )

    # Projects: indexed by user_id + sort_order for ordered project list
    op.create_index(
        "ix_projects_user_sort",
        "projects",
        ["user_id", "sort_order"],
        unique=False,
    )

    # MCP servers: indexed by user_id + created_at for user's server list
    op.create_index(
        "ix_mcp_servers_user_created",
        "mcp_servers",
        ["user_id", "created_at"],
        unique=False,
    )

    # User connections: indexed by user_id + status for filtering active connections
    op.create_index(
        "ix_user_connections_user_status",
        "user_connections",
        ["user_id", "status"],
        unique=False,
    )


def downgrade() -> None:
    """Remove composite indexes."""
    op.drop_index("ix_user_connections_user_status", table_name="user_connections")
    op.drop_index("ix_mcp_servers_user_created", table_name="mcp_servers")
    op.drop_index("ix_projects_user_sort", table_name="projects")
    op.drop_index("ix_billing_events_user_created", table_name="billing_events")
    op.drop_index("ix_knowledge_sources_user_created", table_name="knowledge_sources")
    op.drop_index("ix_agent_components_user_published", table_name="agent_components")
    op.drop_index("ix_agent_components_user_created", table_name="agent_components")
    op.drop_index("ix_workflows_user_langflow", table_name="workflows")
    op.drop_index("ix_workflows_user_created", table_name="workflows")
    op.drop_index("ix_conversations_user_created", table_name="conversations")
    op.drop_index("ix_messages_conversation_created", table_name="messages")
