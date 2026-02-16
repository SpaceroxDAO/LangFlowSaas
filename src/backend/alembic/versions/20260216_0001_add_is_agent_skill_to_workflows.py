"""Add is_agent_skill column to workflows table.

Supports OpenClaw integration - marks workflows as skills
that can be executed by the user's local AI agent.

Revision ID: 20260216_0001
Revises: 20260125_2100
Create Date: 2026-02-16 00:01:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260216_0001'
down_revision = '20260125_2100'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add is_agent_skill column to workflows table."""
    op.add_column(
        'workflows',
        sa.Column(
            'is_agent_skill',
            sa.Boolean(),
            nullable=False,
            server_default=sa.text('false'),
        )
    )


def downgrade() -> None:
    """Remove is_agent_skill column from workflows table."""
    op.drop_column('workflows', 'is_agent_skill')
