"""initial migration

Revision ID: ceb32f8024b8
Revises: 8562bc6bc03a
Create Date: 2025-08-07 15:09:50.525789

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ceb32f8024b8'
down_revision: Union[str, None] = '8562bc6bc03a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
