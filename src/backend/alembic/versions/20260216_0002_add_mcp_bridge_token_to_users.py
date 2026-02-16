"""Add mcp_bridge_token column to users table.

Supports TC Connector authentication - stores a unique token
per user for MCP bridge access.

Revision ID: 20260216_0002
Revises: 20260216_0001
Create Date: 2026-02-16 00:02:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260216_0002'
down_revision = '20260216_0001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add mcp_bridge_token column to users table."""
    op.add_column(
        'users',
        sa.Column(
            'mcp_bridge_token',
            sa.String(255),
            nullable=True,
        )
    )
    op.create_index(
        'ix_users_mcp_bridge_token',
        'users',
        ['mcp_bridge_token'],
        unique=True,
    )


def downgrade() -> None:
    """Remove mcp_bridge_token column from users table."""
    op.drop_index('ix_users_mcp_bridge_token', table_name='users')
    op.drop_column('users', 'mcp_bridge_token')
