"""Description de la modification

Revision ID: a71cd448062e
Revises: a553aacce156
Create Date: 2025-08-09 01:32:26.831873

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a71cd448062e'
down_revision: Union[str, None] = 'a553aacce156'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Ajout de la colonne is_active dans la table users, par défaut True
    op.add_column("users", sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")))

def downgrade() -> None:
    # Suppression de la colonne is_active dans la table users
    op.drop_column("users", "is_active")

