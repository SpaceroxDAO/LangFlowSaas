"""Add MCP server transport fields

Revision ID: 20260118_0001
Revises: 20260117_0002
Create Date: 2026-01-18

Adds transport, url, headers, and ssl_verify fields to mcp_servers table
to support SSE/HTTP transport in addition to the existing STDIO transport.
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260118_0001"
down_revision = "20260117_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add transport type column (stdio, sse, http)
    op.add_column(
        "mcp_servers",
        sa.Column("transport", sa.String(20), nullable=False, server_default="stdio")
    )

    # Add URL column for SSE/HTTP transport
    op.add_column(
        "mcp_servers",
        sa.Column("url", sa.String(2000), nullable=True)
    )

    # Add headers column for SSE/HTTP transport
    op.add_column(
        "mcp_servers",
        sa.Column("headers", sa.JSON(), nullable=False, server_default="{}")
    )

    # Add SSL verification toggle
    op.add_column(
        "mcp_servers",
        sa.Column("ssl_verify", sa.Boolean(), nullable=False, server_default="1")
    )

    # Note: SQLite doesn't support ALTER COLUMN to change nullable constraint.
    # The command column will remain NOT NULL for now, but can be empty string for SSE/HTTP.
    # For PostgreSQL, uncomment the following:
    # op.alter_column(
    #     "mcp_servers",
    #     "command",
    #     existing_type=sa.String(500),
    #     nullable=True
    # )


def downgrade() -> None:
    # Remove added columns
    op.drop_column("mcp_servers", "ssl_verify")
    op.drop_column("mcp_servers", "headers")
    op.drop_column("mcp_servers", "url")
    op.drop_column("mcp_servers", "transport")
