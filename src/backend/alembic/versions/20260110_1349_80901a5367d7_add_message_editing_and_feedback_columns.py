"""Add message editing and feedback columns

Revision ID: 80901a5367d7
Revises: 20260110_0001
Create Date: 2026-01-10 13:49:00.010702

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '80901a5367d7'
down_revision: Union[str, None] = '20260110_0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add message editing and feedback columns
    # Use batch mode for SQLite compatibility with NOT NULL columns
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_edited', sa.Boolean(), nullable=False, server_default='0', comment='Whether this message has been edited'))
        batch_op.add_column(sa.Column('edited_at', sa.DateTime(), nullable=True, comment='When the message was last edited'))
        batch_op.add_column(sa.Column('original_content', sa.Text(), nullable=True, comment='Original content before editing'))
        batch_op.add_column(sa.Column('feedback', sa.String(length=20), nullable=True, comment='User feedback: positive or negative'))
        batch_op.add_column(sa.Column('feedback_at', sa.DateTime(), nullable=True, comment='When feedback was submitted'))


def downgrade() -> None:
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.drop_column('feedback_at')
        batch_op.drop_column('feedback')
        batch_op.drop_column('original_content')
        batch_op.drop_column('edited_at')
        batch_op.drop_column('is_edited')
