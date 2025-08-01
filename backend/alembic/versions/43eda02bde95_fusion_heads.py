"""Fusion heads

Revision ID: 43eda02bde95
Revises: c1e74b197d15, c483a92dafd4
Create Date: 2025-08-01 23:17:21.880533

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '43eda02bde95'
down_revision: Union[str, None] = ('c1e74b197d15', 'c483a92dafd4')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
