"""Add knowledge_source_ids column to agent_components table.

Revision ID: 20260110_0001
Revises: 20260109_0001
Create Date: 2026-01-10
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20260110_0001'
down_revision = '20260109_0001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add knowledge_source_ids column to agent_components table
    op.add_column(
        'agent_components',
        sa.Column(
            'knowledge_source_ids',
            sa.JSON(),
            nullable=True,
            comment='Array of knowledge source IDs for RAG retrieval'
        )
    )


def downgrade() -> None:
    op.drop_column('agent_components', 'knowledge_source_ids')
