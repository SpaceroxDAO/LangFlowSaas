"""Add MCP servers table

Revision ID: 20260117_0002
Revises: 20260117_0001_add_mission_ui_config
Create Date: 2026-01-17

Creates the mcp_servers table for storing MCP server configurations.
MCP servers provide external tool integrations like database access,
browser automation, file operations, etc.
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260117_0002"
down_revision = "20260117_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "mcp_servers",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        # Owner relationship
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
        # Project relationship (nullable - MCP servers can be global or project-specific)
        sa.Column("project_id", sa.String(36), sa.ForeignKey("projects.id", ondelete="SET NULL"), nullable=True, index=True),
        # Server identity
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        # Server type (for UI and validation)
        sa.Column("server_type", sa.String(50), nullable=False),
        # Configuration (matches .mcp.json structure)
        sa.Column("command", sa.String(500), nullable=False),
        sa.Column("args", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("env", sa.JSON(), nullable=False, server_default="{}"),
        # Encrypted credentials (sensitive data)
        sa.Column("credentials_encrypted", sa.Text(), nullable=True),
        # Server status
        sa.Column("is_enabled", sa.Boolean(), nullable=False, server_default="1"),
        # Sync status
        sa.Column("needs_sync", sa.Boolean(), nullable=False, server_default="1"),
        # Health monitoring
        sa.Column("last_health_check", sa.DateTime(), nullable=True),
        sa.Column("health_status", sa.String(50), nullable=True, server_default="unknown"),
    )


def downgrade() -> None:
    op.drop_table("mcp_servers")
