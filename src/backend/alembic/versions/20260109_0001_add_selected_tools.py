"""Add selected_tools column to agent_components table.

Revision ID: 20260109_0001
Revises: 20260107_0001
Create Date: 2026-01-09

This migration adds the selected_tools column to store the array of tool IDs
selected during agent creation (e.g., ['web_search', 'weather']).
This fixes a bug where tools weren't being persisted and passed to workflow creation.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20260109_0001'
down_revision: Union[str, None] = '20260107_0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add selected_tools JSON column."""
    op.add_column(
        'agent_components',
        sa.Column(
            'selected_tools',
            sa.JSON(),
            nullable=True,
            comment='Array of selected tool IDs (e.g., [\"web_search\", \"weather\"])',
        )
    )


def downgrade() -> None:
    """Remove selected_tools column."""
    op.drop_column('agent_components', 'selected_tools')
