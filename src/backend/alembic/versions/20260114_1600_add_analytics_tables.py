"""Add analytics daily table for aggregated metrics

Revision ID: analytics_tables_001
Revises: billing_tables_001
Create Date: 2026-01-14 16:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'analytics_tables_001'
down_revision: Union[str, None] = 'billing_tables_001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create analytics_daily table for aggregated daily metrics
    op.create_table(
        'analytics_daily',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('user_id', sa.String(length=255), nullable=False),
        sa.Column('record_date', sa.Date(), nullable=False),
        # Conversation metrics
        sa.Column('conversations_count', sa.Integer(), server_default='0', nullable=False),
        sa.Column('messages_count', sa.Integer(), server_default='0', nullable=False),
        sa.Column('tokens_used', sa.BigInteger(), server_default='0', nullable=False),
        # Agent metrics
        sa.Column('agents_created', sa.Integer(), server_default='0', nullable=False),
        sa.Column('agents_active', sa.Integer(), server_default='0', nullable=False),
        # Workflow metrics
        sa.Column('workflows_created', sa.Integer(), server_default='0', nullable=False),
        sa.Column('workflows_executed', sa.Integer(), server_default='0', nullable=False),
        # Engagement metrics
        sa.Column('avg_response_time_ms', sa.Integer(), nullable=True),
        sa.Column('error_count', sa.Integer(), server_default='0', nullable=False),
        # Optional breakdown by agent/workflow
        sa.Column('breakdown', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('user_id', 'record_date', name='uq_analytics_user_date'),
    )
    op.create_index('ix_analytics_daily_user_date', 'analytics_daily', ['user_id', 'record_date'])


def downgrade() -> None:
    op.drop_table('analytics_daily')
