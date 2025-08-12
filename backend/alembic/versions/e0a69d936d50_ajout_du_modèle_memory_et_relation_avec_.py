"""Ajout du modèle Memory et relation avec User

Revision ID: e0a69d936d50
Revises: b8c9d7f2a1e3
Create Date: 2025-08-12 23:15:36.954497
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'e0a69d936d50'
down_revision: Union[str, None] = 'b8c9d7f2a1e3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1️⃣ Création du type ENUM userrole en base
    userrole_enum = postgresql.ENUM('USER', 'ADMIN', name='userrole')
    userrole_enum.create(op.get_bind(), checkfirst=True)

    # Suppression des indexes et tables existantes avant modifications
    with op.batch_alter_table('profiles', schema=None) as batch_op:
        batch_op.drop_index('ix_profiles_user_id')
    op.drop_table('profiles')

    with op.batch_alter_table('user_progress', schema=None) as batch_op:
        batch_op.drop_index('ix_user_progress_step_name')
        batch_op.drop_index('ix_user_progress_user_id')
    op.drop_table('user_progress')

    with op.batch_alter_table('media_files', schema=None) as batch_op:
        batch_op.drop_index('ix_media_files_user_id')
    op.drop_table('media_files')

    with op.batch_alter_table('imported_data', schema=None) as batch_op:
        batch_op.drop_index('ix_imported_data_imported_file_id')
    op.drop_table('imported_data')

    with op.batch_alter_table('imported_files', schema=None) as batch_op:
        batch_op.drop_index('ix_imported_files_user_id')
    op.drop_table('imported_files')

    op.drop_table('steps')

    with op.batch_alter_table('agents', schema=None) as batch_op:
        batch_op.drop_index('ix_agents_email')
    op.drop_table('agents')

    # Modification des colonnes de la table users
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column(
            'email',
            existing_type=sa.VARCHAR(),
            comment="Adresse email de l'utilisateur",
            existing_comment="Adresse email de l'utilisateur (utilisée comme login)",
            existing_nullable=False
        )
        batch_op.alter_column(
    'role',
    existing_type=sa.VARCHAR(),
    type_=userrole_enum,
    postgresql_using="role::userrole",
    comment="Rôle de l'utilisateur",
    existing_comment="Rôle de l'utilisateur (ex: user, admin)",
    existing_nullable=False
)

        batch_op.alter_column(
            'created_at',
            existing_type=postgresql.TIMESTAMP(),
            type_=sa.DateTime(timezone=True),
            existing_nullable=True,
            existing_server_default=sa.text('now()')
        )
        batch_op.alter_column(
            'updated_at',
            existing_type=postgresql.TIMESTAMP(),
            type_=sa.DateTime(timezone=True),
            existing_nullable=True,
            existing_server_default=sa.text('now()')
        )

    # Création de la nouvelle table memory avec relation user_id
    op.create_table(
        'memory',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    )
    with op.batch_alter_table('memory', schema=None) as batch_op:
        batch_op.create_index('ix_memory_user_id', ['user_id'], unique=False)

    # Recréation des tables supprimées avec indexes

    op.create_table('agents',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('email', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
        sa.Column('hashed_password', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('is_active', sa.BOOLEAN(), server_default=sa.text('true'), autoincrement=False, nullable=False),
        sa.Column('email_verified', sa.BOOLEAN(), server_default=sa.text('false'), autoincrement=False, nullable=False),
        sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint('id', name='agents_pkey')
    )
    with op.batch_alter_table('agents', schema=None) as batch_op:
        batch_op.create_index('ix_agents_email', ['email'], unique=True)

    op.create_table('steps',
        sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('steps_id_seq'::regclass)"), autoincrement=True, nullable=False),
        sa.Column('step_name', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('label', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('position', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.PrimaryKeyConstraint('id', name='steps_pkey'),
        sa.UniqueConstraint('step_name', name='steps_step_name_key'),
    )
    op.create_table('imported_files',
        sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('imported_files_id_seq'::regclass)"), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('filename', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('uploaded_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.Column('row_count', sa.INTEGER(), server_default=sa.text('0'), autoincrement=False, nullable=True),
        sa.Column('status', sa.VARCHAR(), server_default=sa.text("'PENDING'::character varying"), autoincrement=False, nullable=True),
        sa.Column('error_message', sa.TEXT(), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='imported_files_user_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='imported_files_pkey'),
    )
    with op.batch_alter_table('imported_files', schema=None) as batch_op:
        batch_op.create_index('ix_imported_files_user_id', ['user_id'], unique=False)

    op.create_table('imported_data',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('imported_file_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('data', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=False),
        sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['imported_file_id'], ['imported_files.id'], name='imported_data_imported_file_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='imported_data_pkey')
    )
    with op.batch_alter_table('imported_data', schema=None) as batch_op:
        batch_op.create_index('ix_imported_data_imported_file_id', ['imported_file_id'], unique=False)

    op.create_table('media_files',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('filename', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('file_type', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('mime_type', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column('size', sa.INTEGER(), autoincrement=False, nullable=True),
        sa.Column('uploaded_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.Column('description', sa.TEXT(), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='media_files_user_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='media_files_pkey')
    )
    with op.batch_alter_table('media_files', schema=None) as batch_op:
        batch_op.create_index('ix_media_files_user_id', ['user_id'], unique=False)

    op.create_table('user_progress',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('step_name', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('is_completed', sa.BOOLEAN(), server_default=sa.text('false'), autoincrement=False, nullable=False),
        sa.Column('completed_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['step_name'], ['steps.step_name'], name='user_progress_step_name_fkey', ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='user_progress_user_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='user_progress_pkey'),
        sa.UniqueConstraint('user_id', 'step_name', name='uq_user_step')
    )
    with op.batch_alter_table('user_progress', schema=None) as batch_op:
        batch_op.create_index('ix_user_progress_user_id', ['user_id'], unique=False)
        batch_op.create_index('ix_user_progress_step_name', ['step_name'], unique=False)

    op.create_table('profiles',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('first_name', sa.VARCHAR(length=100), autoincrement=False, nullable=True),
        sa.Column('last_name', sa.VARCHAR(length=100), autoincrement=False, nullable=True),
        sa.Column('email', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
        sa.Column('phone', sa.VARCHAR(length=20), autoincrement=False, nullable=True),
        sa.Column('address', sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column('city', sa.VARCHAR(length=100), autoincrement=False, nullable=True),
        sa.Column('country', sa.VARCHAR(length=100), autoincrement=False, nullable=True),
        sa.Column('avatar_url', sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column('bio', sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column('language_preference', sa.VARCHAR(length=10), server_default=sa.text("'fr'::character varying"), autoincrement=False, nullable=True),
        sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='profiles_user_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='profiles_pkey')
    )
    with op.batch_alter_table('profiles', schema=None) as batch_op:
        batch_op.create_index('ix_profiles_user_id', ['user_id'], unique=False)


def downgrade() -> None:
    userrole_enum = postgresql.ENUM('USER', 'ADMIN', name='userrole')

    # Suppression de la table memory
    op.drop_index('ix_memory_user_id', table_name='memory')
    op.drop_table('memory')

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column(
            'updated_at',
            existing_type=sa.DateTime(timezone=True),
            type_=postgresql.TIMESTAMP(),
            existing_nullable=True,
            existing_server_default=sa.text('now()')
        )
        batch_op.alter_column(
            'created_at',
            existing_type=sa.DateTime(timezone=True),
            type_=postgresql.TIMESTAMP(),
            existing_nullable=True,
            existing_server_default=sa.text('now()')
        )
        batch_op.alter_column(
            'role',
            existing_type=userrole_enum,
            type_=sa.VARCHAR(),
            comment="Rôle de l'utilisateur (ex: user, admin)",
            existing_comment="Rôle de l'utilisateur",
            existing_nullable=False
        )
        batch_op.alter_column(
            'email',
            existing_type=sa.VARCHAR(),
            comment="Adresse email de l'utilisateur (utilisée comme login)",
            existing_comment="Adresse email de l'utilisateur",
            existing_nullable=False
        )

    userrole_enum.drop(op.get_bind(), checkfirst=True)

    # Puis la restauration des tables supprimées (voir la partie upgrade pour les détails)
    op.create_table('agents',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('email', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
        sa.Column('hashed_password', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('is_active', sa.BOOLEAN(), server_default=sa.text('true'), autoincrement=False, nullable=False),
        sa.Column('email_verified', sa.BOOLEAN(), server_default=sa.text('false'), autoincrement=False, nullable=False),
        sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint('id', name='agents_pkey')
    )
    with op.batch_alter_table('agents', schema=None) as batch_op:
        batch_op.create_index('ix_agents_email', ['email'], unique=True)

    op.create_table('steps',
        sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('steps_id_seq'::regclass)"), autoincrement=True, nullable=False),
        sa.Column('step_name', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('label', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('position', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.PrimaryKeyConstraint('id', name='steps_pkey'),
        sa.UniqueConstraint('step_name', name='steps_step_name_key'),
    )
    op.create_table('imported_files',
        sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('imported_files_id_seq'::regclass)"), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('filename', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('uploaded_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.Column('row_count', sa.INTEGER(), server_default=sa.text('0'), autoincrement=False, nullable=True),
        sa.Column('status', sa.VARCHAR(), server_default=sa.text("'PENDING'::character varying"), autoincrement=False, nullable=True),
        sa.Column('error_message', sa.TEXT(), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='imported_files_user_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='imported_files_pkey'),
    )
    with op.batch_alter_table('imported_files', schema=None) as batch_op:
        batch_op.create_index('ix_imported_files_user_id', ['user_id'], unique=False)

    op.create_table('imported_data',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('imported_file_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('data', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=False),
        sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['imported_file_id'], ['imported_files.id'], name='imported_data_imported_file_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='imported_data_pkey')
    )
    with op.batch_alter_table('imported_data', schema=None) as batch_op:
        batch_op.create_index('ix_imported_data_imported_file_id', ['imported_file_id'], unique=False)

    op.create_table('media_files',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('filename', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('file_type', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('mime_type', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column('size', sa.INTEGER(), autoincrement=False, nullable=True),
        sa.Column('uploaded_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.Column('description', sa.TEXT(), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='media_files_user_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='media_files_pkey')
    )
    with op.batch_alter_table('media_files', schema=None) as batch_op:
        batch_op.create_index('ix_media_files_user_id', ['user_id'], unique=False)

    op.create_table('user_progress',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('step_name', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('is_completed', sa.BOOLEAN(), server_default=sa.text('false'), autoincrement=False, nullable=False),
        sa.Column('completed_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['step_name'], ['steps.step_name'], name='user_progress_step_name_fkey', ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='user_progress_user_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='user_progress_pkey'),
        sa.UniqueConstraint('user_id', 'step_name', name='uq_user_step')
    )
    with op.batch_alter_table('user_progress', schema=None) as batch_op:
        batch_op.create_index('ix_user_progress_user_id', ['user_id'], unique=False)
        batch_op.create_index('ix_user_progress_step_name', ['step_name'], unique=False)

    op.create_table('profiles',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('first_name', sa.VARCHAR(length=100), autoincrement=False, nullable=True),
        sa.Column('last_name', sa.VARCHAR(length=100), autoincrement=False, nullable=True),
        sa.Column('email', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
        sa.Column('phone', sa.VARCHAR(length=20), autoincrement=False, nullable=True),
        sa.Column('address', sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column('city', sa.VARCHAR(length=100), autoincrement=False, nullable=True),
        sa.Column('country', sa.VARCHAR(length=100), autoincrement=False, nullable=True),
        sa.Column('avatar_url', sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column('bio', sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column('language_preference', sa.VARCHAR(length=10), server_default=sa.text("'fr'::character varying"), autoincrement=False, nullable=True),
        sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='profiles_user_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='profiles_pkey')
    )
    with op.batch_alter_table('profiles', schema=None) as batch_op:
        batch_op.create_index('ix_profiles_user_id', ['user_id'], unique=False)
