"""Add purchased_credits column to subscriptions table.

Revision ID: 20260125_1706
Revises:
Create Date: 2026-01-25 17:06:14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20260125_1706'
down_revision: Union[str, None] = '20260124_0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add purchased_credits column to subscriptions table."""
    # Add purchased_credits column with default 0
    op.add_column(
        'subscriptions',
        sa.Column('purchased_credits', sa.Integer(), nullable=False, server_default='0')
    )


def downgrade() -> None:
    """Remove purchased_credits column from subscriptions table."""
    op.drop_column('subscriptions', 'purchased_credits')
