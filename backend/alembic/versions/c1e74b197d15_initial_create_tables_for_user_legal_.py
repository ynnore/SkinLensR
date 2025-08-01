"""Initial create tables for user, legal documents, and agent documents

Revision ID: c1e74b197d15
Revises: 6e3a3a071e03
Create Date: 2025-08-01 20:03:17.822584

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c1e74b197d15'
down_revision: Union[str, None] = '6e3a3a071e03'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
