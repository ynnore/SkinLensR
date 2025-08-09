"""Description de la modif

Revision ID: 8107e4adf123
Revises: a7c9e5807ad0
Create Date: 2025-08-09 02:14:25.799756

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision: str = '8107e4adf123'
down_revision: Union[str, None] = 'a7c9e5807ad0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Ajout de la colonne embedding (vector 384 dimensions) à agent_documents
    op.add_column(
        'agent_documents',
        sa.Column('embedding', Vector(dim=384), nullable=True)
    )


def downgrade() -> None:
    # Suppression de la colonne embedding
    op.drop_column('agent_documents', 'embedding')
