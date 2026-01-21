"""Add user_connections table for Composio integration

Revision ID: 20260121_0001
Revises: 20260118_0002
Create Date: 2026-01-21

Creates the user_connections table for storing Composio OAuth connections.
Users can connect external apps like Gmail, Slack, Calendar, etc.
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260121_0001"
down_revision = "20260118_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "user_connections",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        # Owner relationship
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
        # App identification
        sa.Column("app_name", sa.String(100), nullable=False, index=True),
        sa.Column("app_display_name", sa.String(255), nullable=False),
        # Composio identifiers
        sa.Column("composio_connection_id", sa.String(255), nullable=True, index=True),
        sa.Column("composio_entity_id", sa.String(255), nullable=False),
        # Connection status
        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),
        # Account details
        sa.Column("account_identifier", sa.String(255), nullable=True),
        # OAuth scopes and available actions
        sa.Column("scopes", sa.JSON(), nullable=True),
        sa.Column("available_actions", sa.JSON(), nullable=True),
        # Timestamps
        sa.Column("connected_at", sa.DateTime(), nullable=True),
        sa.Column("last_used_at", sa.DateTime(), nullable=True),
        sa.Column("expires_at", sa.DateTime(), nullable=True),
        # Error tracking
        sa.Column("last_error", sa.Text(), nullable=True),
    )

    # Create unique constraint for user + app + account combination
    op.create_unique_constraint(
        "uq_user_connections_user_app_account",
        "user_connections",
        ["user_id", "app_name", "account_identifier"],
    )


def downgrade() -> None:
    op.drop_constraint("uq_user_connections_user_app_account", "user_connections", type_="unique")
    op.drop_table("user_connections")
