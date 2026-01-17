"""Add missions tables for guided learning system

Revision ID: missions_tables_001
Revises: analytics_tables_001
Create Date: 2026-01-14 17:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'missions_tables_001'
down_revision: Union[str, None] = 'analytics_tables_001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create missions table (seed data for guided learning)
    op.create_table(
        'missions',
        sa.Column('id', sa.String(length=50), nullable=False),  # e.g., "L001", "L002"
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(length=50), nullable=False),  # skill_sprint, applied_build
        sa.Column('difficulty', sa.String(length=20), server_default='beginner', nullable=False),
        sa.Column('estimated_minutes', sa.Integer(), server_default='30', nullable=False),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('sort_order', sa.Integer(), server_default='0', nullable=False),
        # Mission steps stored as JSON array
        sa.Column('steps', sa.JSON(), nullable=False),
        # Prerequisites (array of mission IDs)
        sa.Column('prerequisites', sa.JSON(), nullable=True),
        # Learning outcomes
        sa.Column('outcomes', sa.JSON(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='1', nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_missions_category', 'missions', ['category'])
    op.create_index('ix_missions_sort_order', 'missions', ['sort_order'])

    # Create user_mission_progress table
    op.create_table(
        'user_mission_progress',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('user_id', sa.String(length=255), nullable=False),
        sa.Column('mission_id', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=20), server_default='not_started', nullable=False),  # not_started, in_progress, completed
        sa.Column('current_step', sa.Integer(), server_default='0', nullable=False),
        sa.Column('completed_steps', sa.JSON(), server_default='[]', nullable=False),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        # Store any artifacts created during the mission (agent IDs, workflow IDs)
        sa.Column('artifacts', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['mission_id'], ['missions.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('user_id', 'mission_id', name='uq_user_mission'),
    )
    op.create_index('ix_user_mission_progress_user', 'user_mission_progress', ['user_id'])
    op.create_index('ix_user_mission_progress_status', 'user_mission_progress', ['status'])


def downgrade() -> None:
    op.drop_table('user_mission_progress')
    op.drop_table('missions')
