"""Mise à jour des modèles

Revision ID: 7810ae54ada6
Revises: ceb32f8024b8
Create Date: 2025-08-09 01:00:16.721214

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7810ae54ada6'
down_revision: Union[str, None] = 'ceb32f8024b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Création des tables agents, documents, progress et agent_legal_documents
    op.create_table('agents',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_agents_email'), 'agents', ['email'], unique=True)
    op.create_index(op.f('ix_agents_id'), 'agents', ['id'], unique=False)

    op.create_table('agent_legal_documents',
        sa.Column('agent_id', sa.Integer(), nullable=False),
        sa.Column('legal_document_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['agent_id'], ['agents.id']),
        sa.ForeignKeyConstraint(['legal_document_id'], ['legal_documents.id']),
        sa.PrimaryKeyConstraint('agent_id', 'legal_document_id')
    )

    op.create_table('documents',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.String(), nullable=False),
        sa.Column('agent_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['agent_id'], ['agents.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_documents_id'), 'documents', ['id'], unique=False)

    op.create_table('progress',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('step', sa.String(), nullable=False),
        sa.Column('completed', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_progress_id'), 'progress', ['id'], unique=False)

    # Ajout de la colonne agent_id dans agent_documents avec clé étrangère
    op.add_column('agent_documents', sa.Column('agent_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'agent_documents', 'agents', ['agent_id'], ['id'])

    # Ajout manuel de la colonne embedding avec type VECTOR(384) via SQL natif
    op.execute('ALTER TABLE agent_documents ADD COLUMN embedding VECTOR(384) NOT NULL')

    # Modification des colonnes NOT NULL dans legal_documents
    op.alter_column('legal_documents', 'type', existing_type=sa.VARCHAR(), nullable=False)
    op.alter_column('legal_documents', 'version', existing_type=sa.VARCHAR(), nullable=False)
    op.alter_column('legal_documents', 'language', existing_type=sa.VARCHAR(), nullable=False)

    # Suppression de la contrainte d'unicité sur type+version+language dans legal_documents
    op.drop_constraint('uq_legal_document_type_version_lang', 'legal_documents', type_='unique')

    # Rendre NOT NULL les colonnes email et role dans users
    op.alter_column('users', 'email', existing_type=sa.VARCHAR(), nullable=False)
    op.alter_column('users', 'role', existing_type=sa.VARCHAR(), nullable=False)


def downgrade() -> None:
    # Revert des modifications dans l'ordre inverse

    op.alter_column('users', 'role', existing_type=sa.VARCHAR(), nullable=True)
    op.alter_column('users', 'email', existing_type=sa.VARCHAR(), nullable=True)

    op.create_unique_constraint('uq_legal_document_type_version_lang', 'legal_documents', ['type', 'version', 'language'], postgresql_nulls_not_distinct=False)
    op.alter_column('legal_documents', 'language', existing_type=sa.VARCHAR(), nullable=True)
    op.alter_column('legal_documents', 'version', existing_type=sa.VARCHAR(), nullable=True)
    op.alter_column('legal_documents', 'type', existing_type=sa.VARCHAR(), nullable=True)

    # Suppression de la colonne embedding dans agent_documents
    op.execute('ALTER TABLE agent_documents DROP COLUMN embedding')

    op.drop_constraint(None, 'agent_documents', type_='foreignkey')
    op.drop_column('agent_documents', 'agent_id')

    op.drop_index(op.f('ix_progress_id'), table_name='progress')
    op.drop_table('progress')

    op.drop_index(op.f('ix_documents_id'), table_name='documents')
    op.drop_table('documents')

    op.drop_table('agent_legal_documents')

    op.drop_index(op.f('ix_agents_id'), table_name='agents')
    op.drop_index(op.f('ix_agents_email'), table_name='agents')
    op.drop_table('agents')
