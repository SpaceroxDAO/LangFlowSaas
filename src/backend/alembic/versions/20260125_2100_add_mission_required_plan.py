"""Add required_plan column to missions table.

Part of education-first pricing strategy.
See docs/19_PRICING_STRATEGY.md for gating strategy.

Revision ID: 20260125_2100
Revises: 20260125_1800
Create Date: 2026-01-25 21:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260125_2100'
down_revision = '20260125_1800'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add required_plan column to missions table."""
    # Add required_plan column with default 'free'
    op.add_column(
        'missions',
        sa.Column(
            'required_plan',
            sa.String(20),
            nullable=False,
            server_default='free'
        )
    )

    # Update existing missions based on difficulty/sort_order
    # Missions L001 and L002 are starter missions (free)
    # All others require 'individual' plan
    op.execute("""
        UPDATE missions
        SET required_plan = 'individual'
        WHERE id NOT IN ('L001-hello-charlie', 'L002-faq-bot-v1')
    """)


def downgrade() -> None:
    """Remove required_plan column from missions table."""
    op.drop_column('missions', 'required_plan')
