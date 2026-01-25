"""Add auto top-up and spend cap settings to subscriptions.

Revision ID: 20260125_1800
Revises: 20260125_1706
Create Date: 2026-01-25 18:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20260125_1800'
down_revision: Union[str, None] = '20260125_1706'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add auto top-up and spend cap settings columns."""
    # Auto top-up settings
    op.add_column(
        'subscriptions',
        sa.Column('auto_top_up_enabled', sa.Boolean(), nullable=False, server_default='false')
    )
    op.add_column(
        'subscriptions',
        sa.Column('auto_top_up_threshold', sa.Integer(), nullable=False, server_default='100')
    )
    op.add_column(
        'subscriptions',
        sa.Column('auto_top_up_pack_id', sa.String(50), nullable=False, server_default='credits_5500')
    )
    op.add_column(
        'subscriptions',
        sa.Column('auto_top_up_max_monthly', sa.Integer(), nullable=False, server_default='3')
    )
    op.add_column(
        'subscriptions',
        sa.Column('auto_top_ups_this_month', sa.Integer(), nullable=False, server_default='0')
    )

    # Spend cap settings
    op.add_column(
        'subscriptions',
        sa.Column('spend_cap_enabled', sa.Boolean(), nullable=False, server_default='false')
    )
    op.add_column(
        'subscriptions',
        sa.Column('spend_cap_amount_cents', sa.Integer(), nullable=False, server_default='10000')
    )
    op.add_column(
        'subscriptions',
        sa.Column('spend_this_month_cents', sa.Integer(), nullable=False, server_default='0')
    )


def downgrade() -> None:
    """Remove auto top-up and spend cap settings columns."""
    op.drop_column('subscriptions', 'spend_this_month_cents')
    op.drop_column('subscriptions', 'spend_cap_amount_cents')
    op.drop_column('subscriptions', 'spend_cap_enabled')
    op.drop_column('subscriptions', 'auto_top_ups_this_month')
    op.drop_column('subscriptions', 'auto_top_up_max_monthly')
    op.drop_column('subscriptions', 'auto_top_up_pack_id')
    op.drop_column('subscriptions', 'auto_top_up_threshold')
    op.drop_column('subscriptions', 'auto_top_up_enabled')
