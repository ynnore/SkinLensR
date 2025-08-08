"""Ajout du modèle Progress

Revision ID: a553aacce156
Revises: 7810ae54ada6
Create Date: 2025-08-09 01:18:54.858533

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a553aacce156'
down_revision: Union[str, None] = '7810ae54ada6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "progress",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("step", sa.String(), nullable=False),
        sa.Column("completed", sa.Integer(), nullable=True, default=0),
    )
    op.create_index(op.f("ix_progress_id"), "progress", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_progress_id"), table_name="progress")
    op.drop_table("progress")
