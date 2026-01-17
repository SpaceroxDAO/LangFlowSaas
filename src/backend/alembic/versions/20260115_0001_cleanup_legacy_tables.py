"""Cleanup legacy tables and data model

This migration:
1. Deletes legacy test conversations (those linked to deprecated 'agents' table)
2. Drops the agent_id column from conversations table
3. Drops the agents table (replaced by agent_components + workflows)

Background:
- The 'agents' table was the original MVP design (monolithic agent)
- The new architecture uses:
  - agent_components: Reusable AI personalities
  - workflows: Langflow flow execution
  - conversations: Now links via workflow_id only

Revision ID: 20260115_0001
Revises: embed_fields_001
Create Date: 2026-01-15
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '20260115_0001'
down_revision: Union[str, None] = 'embed_fields_001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Clean up legacy tables and data.

    This is a DESTRUCTIVE migration - data in these tables will be lost.
    The data being deleted is test/development artifacts only.
    """
    # Step 1: Delete legacy conversations that reference the 'agents' table
    # These are test conversations from E2E tests
    op.execute("""
        DELETE FROM messages
        WHERE conversation_id IN (
            SELECT id FROM conversations WHERE agent_id IS NOT NULL
        )
    """)
    op.execute("DELETE FROM conversations WHERE agent_id IS NOT NULL")

    # Step 2: Drop the agent_id index first
    op.drop_index('ix_conversations_agent_id', table_name='conversations')

    # Step 3: Drop the agent_id column from conversations using SQLite batch mode
    # Need to explicitly exclude the agent_id index from being recreated
    with op.batch_alter_table(
        'conversations',
        recreate='always',
        copy_from=sa.Table(
            'conversations',
            sa.MetaData(),
            sa.Column('id', sa.String(36), nullable=False),
            sa.Column('user_id', sa.String(36), nullable=False),
            sa.Column('agent_id', sa.String(36), nullable=True),
            sa.Column('workflow_id', sa.String(36), nullable=True),
            sa.Column('langflow_session_id', sa.String(255), nullable=False),
            sa.Column('title', sa.String(255), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
        )
    ) as batch_op:
        batch_op.drop_column('agent_id')

    # Step 4: Drop the agents table
    # Replaced by agent_components + workflows architecture
    op.drop_table('agents')

    print("✅ Legacy cleanup complete:")
    print("   - Removed agent_id column from conversations")
    print("   - Dropped agents table")


def downgrade() -> None:
    """
    Restore legacy tables (without data).

    Note: This restores the schema but NOT the data that was deleted.
    """
    # Recreate agents table
    op.create_table('agents',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('project_id', sa.String(length=36), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('qa_who', sa.Text(), nullable=True),
        sa.Column('qa_rules', sa.Text(), nullable=True),
        sa.Column('qa_tricks', sa.Text(), nullable=True),
        sa.Column('system_prompt', sa.Text(), nullable=True),
        sa.Column('langflow_flow_id', sa.String(length=255), nullable=True),
        sa.Column('template_name', sa.String(length=100), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('flow_data', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_agents_langflow_flow_id', 'agents', ['langflow_flow_id'])
    op.create_index('ix_agents_user_id', 'agents', ['user_id'])

    # Recreate agent_id column on conversations using batch mode for SQLite
    with op.batch_alter_table('conversations') as batch_op:
        batch_op.add_column(sa.Column('agent_id', sa.String(length=36), nullable=True))
