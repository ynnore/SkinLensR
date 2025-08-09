"""Ajout et modifications drive et heart

Revision ID: e136604f14ee
Revises: 47e6d4fbbda1
Create Date: 2025-08-09 16:09:06.754225

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e136604f14ee'
down_revision: Union[str, None] = '47e6d4fbbda1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
