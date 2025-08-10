"""Add created_at and updated_at to users, add documentstatus enum to legal_documents

Revision ID: 505f26c94b34
Revises: e136604f14ee
Create Date: 2025-08-10 22:34:48.787299
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '505f26c94b34'
down_revision: Union[str, None] = 'e136604f14ee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Création du type ENUM documentstatus
    documentstatus = postgresql.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', name='documentstatus')
    documentstatus.create(op.get_bind(), checkfirst=True)

    # Création de la table drive_files
    op.create_table(
        'drive_files',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('filename', sa.String(), nullable=False, comment='Nom original du fichier'),
        sa.Column('unique_filename', sa.String(), nullable=False, comment='Nom de fichier unique stocké sur le serveur'),
        sa.Column('filepath', sa.String(), nullable=False, comment="Chemin d'accès au fichier sur le serveur"),
        sa.Column('content_type', sa.String(), nullable=True, comment='Type MIME du fichier (ex: application/pdf)'),
        sa.Column('size', sa.Integer(), nullable=False, comment='Taille du fichier en octets'),
        sa.Column('uploaded_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True, comment="Date et heure d'upload"),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('drive_files') as batch_op:
        batch_op.create_index(batch_op.f('ix_drive_files_filename'), ['filename'], unique=False)
        batch_op.create_index(batch_op.f('ix_drive_files_id'), ['id'], unique=False)
        batch_op.create_index(batch_op.f('ix_drive_files_unique_filename'), ['unique_filename'], unique=True)
        batch_op.create_index(batch_op.f('ix_drive_files_user_id'), ['user_id'], unique=False)

    # Création de la table progress_entries
    op.create_table(
        'progress_entries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False, comment="ID de l'utilisateur associé à cette progression"),
        sa.Column('activity_name', sa.String(), nullable=False, comment="Nom de l'activité suivie (ex: 'Completing Module 1')"),
        sa.Column('current_value', sa.Float(), nullable=False, comment='Valeur actuelle de la progression (ex: pourcentage, points)'),
        sa.Column('target_value', sa.Float(), nullable=True, comment='Valeur cible optionnelle (ex: 100 pour un pourcentage)'),
        sa.Column('status', sa.String(), nullable=True, comment="Statut de l'activité (ex: in_progress, completed, paused)"),
        sa.Column('timestamp', sa.DateTime(), server_default=sa.text('now()'), nullable=True, comment="Timestamp de l'enregistrement de la progression"),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('progress_entries') as batch_op:
        batch_op.create_index(batch_op.f('ix_progress_entries_activity_name'), ['activity_name'], unique=False)
        batch_op.create_index(batch_op.f('ix_progress_entries_id'), ['id'], unique=False)
        batch_op.create_index(batch_op.f('ix_progress_entries_status'), ['status'], unique=False)
        batch_op.create_index(batch_op.f('ix_progress_entries_user_id'), ['user_id'], unique=False)

    # Suppression des tables obsolètes et de leurs indexes
    with op.batch_alter_table('user_legal_agreements') as batch_op:
        batch_op.drop_index('ix_user_legal_agreements_id')
    op.drop_table('user_legal_agreements')

    with op.batch_alter_table('agent_documents') as batch_op:
        batch_op.drop_index('ix_agent_documents_id')
        batch_op.drop_index('ix_agent_documents_source')
        batch_op.drop_index('ix_agent_documents_title')
    op.drop_table('agent_documents')

    with op.batch_alter_table('documents') as batch_op:
        batch_op.drop_index('ix_documents_id')
    op.drop_table('documents')

    with op.batch_alter_table('agents') as batch_op:
        batch_op.drop_index('ix_agents_email')
        batch_op.drop_index('ix_agents_id')
    op.drop_table('agents')

    with op.batch_alter_table('progress') as batch_op:
        batch_op.drop_index('ix_progress_id')
    op.drop_table('progress')

    # Modification de la table legal_documents
    with op.batch_alter_table('legal_documents') as batch_op:
        batch_op.add_column(sa.Column('title', sa.String(), nullable=False, comment='Titre lisible du document'))
        batch_op.add_column(sa.Column('status', sa.Enum('DRAFT', 'PUBLISHED', 'ARCHIVED', name='documentstatus'), nullable=True))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
        batch_op.alter_column('type',
               existing_type=sa.VARCHAR(),
               comment='Type de document légal',
               existing_nullable=False)
        batch_op.alter_column('version',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               comment='Version du document (ex: 1.0.0)',
               existing_nullable=False)
        batch_op.alter_column('language',
               existing_type=sa.VARCHAR(),
               comment='Code langue ISO 639-1 (ex: fr, en)',
               existing_nullable=False)
        batch_op.alter_column('content',
               existing_type=sa.VARCHAR(),
               type_=sa.Text(),
               comment='Contenu complet du document',
               existing_nullable=False)
        batch_op.create_index(batch_op.f('ix_legal_documents_language'), ['language'], unique=False)
        batch_op.create_index(batch_op.f('ix_legal_documents_type'), ['type'], unique=False)
        batch_op.create_index(batch_op.f('ix_legal_documents_version'), ['version'], unique=False)

    # Modification de la table users
    with op.batch_alter_table('users') as batch_op:
        # Ces colonnes existent déjà, on commente leur création pour éviter les erreurs
        # batch_op.add_column(sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
        # batch_op.add_column(sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(),
               comment="Adresse email de l'utilisateur (utilisée comme login)",
               existing_nullable=False)
        batch_op.alter_column('hashed_password',
               existing_type=sa.VARCHAR(),
               comment="Mot de passe haché de l'utilisateur",
               existing_nullable=False)
        batch_op.alter_column('role',
               existing_type=sa.VARCHAR(),
               comment="Rôle de l'utilisateur (ex: user, admin)",
               existing_nullable=False)
        batch_op.drop_index('ix_users_username')
        batch_op.create_index(batch_op.f('ix_users_role'), ['role'], unique=False)
        batch_op.drop_column('is_active')
        batch_op.drop_column('username')

    # ### end Alembic commands ###


def downgrade() -> None:
    with op.batch_alter_table('users') as batch_op:
        batch_op.add_column(sa.Column('username', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=False))
        batch_op.drop_index(batch_op.f('ix_users_role'))
        batch_op.create_index('ix_users_username', ['username'], unique=True)
        batch_op.alter_column('role',
               existing_type=sa.VARCHAR(),
               comment=None,
               existing_comment="Rôle de l'utilisateur (ex: user, admin)",
               existing_nullable=False)
        batch_op.alter_column('hashed_password',
               existing_type=sa.VARCHAR(),
               comment=None,
               existing_comment="Mot de passe haché de l'utilisateur",
               existing_nullable=False)
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(),
               comment=None,
               existing_comment="Adresse email de l'utilisateur (utilisée comme login)",
               existing_nullable=False)
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')

    with op.batch_alter_table('legal_documents') as batch_op:
        batch_op.drop_index(batch_op.f('ix_legal_documents_version'))
        batch_op.drop_index(batch_op.f('ix_legal_documents_type'))
        batch_op.drop_index(batch_op.f('ix_legal_documents_language'))
        batch_op.alter_column('content',
               existing_type=sa.Text(),
               type_=sa.VARCHAR(),
               comment=None,
               existing_comment='Contenu complet du document',
               existing_nullable=False)
        batch_op.alter_column('language',
               existing_type=sa.VARCHAR(),
               comment=None,
               existing_comment='Code langue ISO 639-1 (ex: fr, en)',
               existing_nullable=False)
        batch_op.alter_column('version',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               comment=None,
               existing_comment='Version du document (ex: 1.0.0)',
               existing_nullable=False)
        batch_op.alter_column('type',
               existing_type=sa.VARCHAR(),
               comment=None,
               existing_comment='Type de document légal',
               existing_nullable=False)
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')
        batch_op.drop_column('status')
        batch_op.drop_column('title')

    # Recréation des tables supprimées avec leurs index
    op.create_table('progress',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('completion', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='progress_user_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='progress_pkey')
    )
    with op.batch_alter_table('progress') as batch_op:
        batch_op.create_index('ix_progress_id', ['id'], unique=False)

    op.create_table('agents',
        sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('agents_id_seq'::regclass)"), autoincrement=True, nullable=False),
        sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('email', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint('id', name='agents_pkey'),
        postgresql_ignore_search_path=False
    )
    with op.batch_alter_table('agents') as batch_op:
        batch_op.create_index('ix_agents_id', ['id'], unique=False)
        batch_op.create_index('ix_agents_email', ['email'], unique=True)

    op.create_table('documents',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('title', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('content', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('agent_id', sa.INTEGER(), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['agent_id'], ['agents.id'], name='documents_agent_id_fkey'),
        sa.PrimaryKeyConstraint('id', name='documents_pkey')
    )
    with op.batch_alter_table('documents') as batch_op:
        batch_op.create_index('ix_documents_id', ['id'], unique=False)

    op.create_table('agent_documents',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('title', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('content', sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column('source', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column('embedding', sa.NullType(), autoincrement=False, nullable=False),
        sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.Column('updated_at', postgresql.TIMESTAMP(timezone=True), autoincrement=False, nullable=True),
        sa.Column('agent_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['agent_id'], ['agents.id'], name='agent_documents_agent_id_fkey'),
        sa.PrimaryKeyConstraint('id', name='agent_documents_pkey')
    )
    with op.batch_alter_table('agent_documents') as batch_op:
        batch_op.create_index('ix_agent_documents_title', ['title'], unique=False)
        batch_op.create_index('ix_agent_documents_source', ['source'], unique=False)
        batch_op.create_index('ix_agent_documents_id', ['id'], unique=False)

    op.create_table('user_legal_agreements',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('document_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('is_latest_version_agreed', sa.BOOLEAN(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['document_id'], ['legal_documents.id'], name='user_legal_agreements_document_id_fkey', ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='user_legal_agreements_user_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='user_legal_agreements_pkey')
    )
    with op.batch_alter_table('user_legal_agreements') as batch_op:
        batch_op.create_index('ix_user_legal_agreements_id', ['id'], unique=False)

    with op.batch_alter_table('progress_entries') as batch_op:
        batch_op.drop_index(batch_op.f('ix_progress_entries_user_id'))
        batch_op.drop_index(batch_op.f('ix_progress_entries_status'))
        batch_op.drop_index(batch_op.f('ix_progress_entries_id'))
        batch_op.drop_index(batch_op.f('ix_progress_entries_activity_name'))
    op.drop_table('progress_entries')

    with op.batch_alter_table('drive_files') as batch_op:
        batch_op.drop_index(batch_op.f('ix_drive_files_user_id'))
        batch_op.drop_index(batch_op.f('ix_drive_files_unique_filename'))
        batch_op.drop_index(batch_op.f('ix_drive_files_id'))
        batch_op.drop_index(batch_op.f('ix_drive_files_filename'))
    op.drop_table('drive_files')

    # Suppression du type ENUM documentstatus
    documentstatus = postgresql.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', name='documentstatus')
    documentstatus.drop(op.get_bind(), checkfirst=True)
