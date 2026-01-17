"""Add embed fields to agent_components for embeddable widget

Revision ID: embed_fields_001
Revises: missions_tables_001
Create Date: 2026-01-14 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'embed_fields_001'
down_revision: Union[str, None] = 'missions_tables_001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add is_embeddable flag to agent_components
    op.add_column(
        'agent_components',
        sa.Column(
            'is_embeddable',
            sa.Boolean(),
            server_default='0',
            nullable=False,
        )
    )

    # Add embed_config JSON field for customization
    op.add_column(
        'agent_components',
        sa.Column(
            'embed_config',
            sa.JSON(),
            nullable=True,
        )
    )

    # Add embed_token for secure access (unique per agent)
    op.add_column(
        'agent_components',
        sa.Column(
            'embed_token',
            sa.String(length=64),
            nullable=True,
            comment='Unique token for embed authentication',
        )
    )
    op.create_index('ix_agent_components_embed_token', 'agent_components', ['embed_token'])


def downgrade() -> None:
    op.drop_index('ix_agent_components_embed_token', table_name='agent_components')
    op.drop_column('agent_components', 'embed_token')
    op.drop_column('agent_components', 'embed_config')
    op.drop_column('agent_components', 'is_embeddable')
