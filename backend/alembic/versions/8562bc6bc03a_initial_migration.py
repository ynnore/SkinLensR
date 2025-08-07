"""initial migration

Revision ID: 8562bc6bc03a
Revises: 60355fa971a5
Create Date: 2025-08-07 15:02:42.465407

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8562bc6bc03a'
down_revision: Union[str, None] = '60355fa971a5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
