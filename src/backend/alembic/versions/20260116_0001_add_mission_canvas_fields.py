"""Add mission canvas integration fields

This migration adds:
1. template_id - Links mission to a flow template
2. component_pack - JSON with allowed components and validation rules
3. canvas_mode - Boolean flag for canvas-enabled missions

Revision ID: 20260116_0001
Revises: 20260115_0001
Create Date: 2026-01-16
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '20260116_0001'
down_revision: Union[str, None] = '20260115_0001'
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

    # Add template_id - references a flow template name
    if not column_exists("missions", "template_id"):
        op.add_column(
            "missions",
            sa.Column("template_id", sa.String(100), nullable=True)
        )

    # Add component_pack - JSON type
    # Schema: {
    #   "allowed_components": ["ChatInput", "ChatOutput", "Agent"],
    #   "allowed_categories": ["input & output", "models & agents"],
    #   "validation_rules": {"require_chat_input": true, "max_nodes": 5}
    # }
    if not column_exists("missions", "component_pack"):
        if dialect == 'postgresql':
            from sqlalchemy.dialects import postgresql
            op.add_column(
                "missions",
                sa.Column("component_pack", postgresql.JSONB(), nullable=True)
            )
        else:
            # SQLite and others use JSON type
            op.add_column(
                "missions",
                sa.Column("component_pack", sa.JSON(), nullable=True)
            )

    # Add canvas_mode flag - whether mission uses canvas view
    if not column_exists("missions", "canvas_mode"):
        op.add_column(
            "missions",
            sa.Column(
                "canvas_mode",
                sa.Boolean(),
                nullable=False,
                server_default="false"
            )
        )


def downgrade() -> None:
    op.drop_column("missions", "canvas_mode")
    op.drop_column("missions", "component_pack")
    op.drop_column("missions", "template_id")
