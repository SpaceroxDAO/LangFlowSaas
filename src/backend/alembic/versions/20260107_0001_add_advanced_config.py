"""Add advanced_config and publish fields to agent_components table.

Revision ID: 20260107_0001
Revises: 0001
Create Date: 2026-01-07

This migration adds columns for component publishing functionality:
- advanced_config: JSON column for LLM configuration
- component_file_path: Path to generated Python component file
- component_class_name: Class name of the generated component
- is_published: Whether the component is published to Langflow
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20260107_0001'
down_revision: Union[str, None] = '0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add advanced_config, component_file_path, component_class_name, is_published columns."""
    op.add_column(
        'agent_components',
        sa.Column(
            'advanced_config',
            sa.JSON(),
            nullable=True,
            comment='Advanced configuration: model_provider, model_name, temperature, max_tokens, etc.',
        )
    )
    op.add_column(
        'agent_components',
        sa.Column(
            'component_file_path',
            sa.String(500),
            nullable=True,
            comment='Path to the generated Python component file',
        )
    )
    op.add_column(
        'agent_components',
        sa.Column(
            'component_class_name',
            sa.String(100),
            nullable=True,
            comment='Class name of the generated component',
        )
    )
    op.add_column(
        'agent_components',
        sa.Column(
            'is_published',
            sa.Boolean(),
            nullable=False,
            server_default='0',
            comment='Whether this component is published to Langflow',
        )
    )


def downgrade() -> None:
    """Remove added columns."""
    op.drop_column('agent_components', 'is_published')
    op.drop_column('agent_components', 'component_class_name')
    op.drop_column('agent_components', 'component_file_path')
    op.drop_column('agent_components', 'advanced_config')
