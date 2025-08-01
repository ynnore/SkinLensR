from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = '6e3a3a071e03'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Vérifie si la table 'users' existe déjà avant de la créer
    if 'users' not in inspect(op.get_bind()).get_table_names():
        op.create_table('users',
            sa.Column('id', sa.Integer, primary_key=True, index=True),
            sa.Column('username', sa.String, unique=True, index=True, nullable=False),
            sa.Column('email', sa.String, unique=True, index=True, nullable=False),
            sa.Column('password_hash', sa.String, nullable=False),
            sa.Column('role', sa.String, default='classic', nullable=False),
            sa.Column('created_at', sa.DateTime, default=sa.func.utcnow),
            sa.Column('updated_at', sa.DateTime, default=sa.func.utcnow, onupdate=sa.func.utcnow)
        )

    # Vérifie si la table 'legal_documents' existe déjà avant de la créer
    if 'legal_documents' not in inspect(op.get_bind()).get_table_names():
        op.create_table('legal_documents',
            sa.Column('id', sa.Integer, primary_key=True, index=True),
            sa.Column('document_type', sa.String, index=True, nullable=False), # e.g., 'CGU', 'Confidentialite'
            sa.Column('version', sa.String, index=True, nullable=False),
            sa.Column('content', sa.String, nullable=False), # Stocker le contenu texte du document
            sa.Column('created_at', sa.DateTime, default=sa.func.utcnow)
        )

    # Vérifie si la table 'user_legal_agreements' existe déjà avant de la créer
    if 'user_legal_agreements' not in inspect(op.get_bind()).get_table_names():
        op.create_table('user_legal_agreements',
            sa.Column('id', sa.Integer, primary_key=True, index=True),
            sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
            sa.Column('legal_document_id', sa.Integer, sa.ForeignKey('legal_documents.id'), nullable=False),
            sa.Column('agreed_at', sa.DateTime, default=sa.func.utcnow, nullable=False)
        )


def downgrade() -> None:
    # Suppression des tables dans l'ordre inverse de leur création
    op.drop_table('user_legal_agreements')
    op.drop_table('legal_documents')
    op.drop_table('users')
