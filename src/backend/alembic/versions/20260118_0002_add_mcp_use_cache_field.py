"""Add MCP server use_cache field

Revision ID: 20260118_0002
Revises: 20260118_0001
Create Date: 2026-01-18

Adds use_cache field to mcp_servers table for caching server connections and tool lists.
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260118_0002"
down_revision = "20260118_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add use_cache column with default False
    op.add_column(
        "mcp_servers",
        sa.Column("use_cache", sa.Boolean(), nullable=False, server_default="0")
    )


def downgrade() -> None:
    # Remove use_cache column
    op.drop_column("mcp_servers", "use_cache")
