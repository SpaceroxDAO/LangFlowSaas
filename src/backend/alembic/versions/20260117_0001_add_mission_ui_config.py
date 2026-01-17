"""Add mission ui_config field

This migration adds:
- ui_config - JSON field for canvas UI visibility settings (hide_sidebar, hide_minimap, etc.)

Revision ID: 20260117_0001
Revises: 20260116_0001
Create Date: 2026-01-17
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '20260117_0001'
down_revision: Union[str, None] = '20260116_0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Detect database dialect
    bind = op.get_bind()
    dialect = bind.dialect.name

    # Helper to check if column exists
    def column_exists(table_name: str, column_name: str) -> bool:
        if dialect == 'sqlite':
            result = bind.execute(sa.text(f"PRAGMA table_info({table_name})"))
            columns = [row[1] for row in result.fetchall()]
            return column_name in columns
        else:
            # PostgreSQL
            result = bind.execute(sa.text(
                f"SELECT column_name FROM information_schema.columns "
                f"WHERE table_name = '{table_name}' AND column_name = '{column_name}'"
            ))
            return result.fetchone() is not None

    # Add ui_config - JSON type for canvas UI visibility settings
    # Schema: {
    #   "hide_sidebar": true,       # Hide the entire sidebar
    #   "hide_minimap": true,       # Hide the minimap
    #   "hide_toolbar": false,      # Hide toolbar (except play button)
    #   "custom_actions_only": false # Only show "Actions" category
    # }
    if not column_exists("missions", "ui_config"):
        if dialect == 'postgresql':
            from sqlalchemy.dialects import postgresql
            op.add_column(
                "missions",
                sa.Column("ui_config", postgresql.JSONB(), nullable=True)
            )
        else:
            # SQLite and others use JSON type
            op.add_column(
                "missions",
                sa.Column("ui_config", sa.JSON(), nullable=True)
            )


def downgrade() -> None:
    op.drop_column("missions", "ui_config")
