"""Mise à jour tunnel conversion + gestion fichiers/imports/médias (safe mode)

Revision ID: b6bfa21e4a41
Revises: 505f26c94b34
Create Date: 2025-08-10 23:38:15.365794
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector


# Identifiants Alembic
revision: str = 'b6bfa21e4a41'
down_revision: Union[str, None] = '505f26c94b34'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def table_exists(conn, table_name):
    inspector = Inspector.from_engine(conn)
    return table_name in inspector.get_table_names()


def upgrade() -> None:
    conn = op.get_bind()

    # Table des étapes
    if not table_exists(conn, 'steps'):
        op.create_table(
            'steps',
            sa.Column('id', sa.Integer, primary_key=True),
            sa.Column('step_name', sa.String, nullable=False, unique=True),
            sa.Column('label', sa.String, nullable=False),
            sa.Column('position', sa.Integer, nullable=False)
        )
        op.execute("""
            INSERT INTO steps (step_name, label, position) VALUES
            ('register', 'Inscription', 1),
            ('privacy_policy', 'Politique de Confidentialité', 2),
            ('terms', 'Conditions d’Utilisation', 3),
            ('settings', 'Paramètres', 4),
            ('pricing', 'Tarifs', 5),
            ('payment', 'Paiement', 6),
            ('profile', 'Profil', 7)
        """)

    # Table progression utilisateur
    if not table_exists(conn, 'user_progress'):
        op.create_table(
            'user_progress',
            sa.Column('id', sa.Integer, primary_key=True),
            sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
            sa.Column('step_name', sa.String, sa.ForeignKey('steps.step_name', ondelete='CASCADE'), nullable=False),
            sa.Column('is_completed', sa.Boolean, nullable=False, server_default=sa.text('FALSE')),
            sa.Column('completed_at', sa.DateTime),
            sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
            sa.Column('updated_at', sa.DateTime, server_default=sa.text('now()')),
            sa.UniqueConstraint('user_id', 'step_name', name='uq_user_step')
        )
        op.create_index('ix_user_progress_user_id', 'user_progress', ['user_id'])
        op.create_index('ix_user_progress_step_name', 'user_progress', ['step_name'])

    # Table fichiers importés
    if not table_exists(conn, 'imported_files'):
        op.create_table(
            'imported_files',
            sa.Column('id', sa.Integer, primary_key=True),
            sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
            sa.Column('filename', sa.String, nullable=False),
            sa.Column('uploaded_at', sa.DateTime, server_default=sa.text('now()')),
            sa.Column('row_count', sa.Integer, server_default='0'),
            sa.Column('status', sa.String, server_default='PENDING'),
            sa.Column('error_message', sa.Text)
        )
        op.create_index('ix_imported_files_user_id', 'imported_files', ['user_id'])

    # Table données importées
    if not table_exists(conn, 'imported_data'):
        op.create_table(
            'imported_data',
            sa.Column('id', sa.Integer, primary_key=True),
            sa.Column('imported_file_id', sa.Integer, sa.ForeignKey('imported_files.id', ondelete='CASCADE'), nullable=False),
            sa.Column('data', sa.JSON, nullable=False),
            sa.Column('created_at', sa.DateTime, server_default=sa.text('now()'))
        )
        op.create_index('ix_imported_data_imported_file_id', 'imported_data', ['imported_file_id'])

    # Table fichiers médias
    if not table_exists(conn, 'media_files'):
        op.create_table(
            'media_files',
            sa.Column('id', sa.Integer, primary_key=True),
            sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
            sa.Column('filename', sa.String, nullable=False),
            sa.Column('file_type', sa.String, nullable=False),  # image, video, audio, document
            sa.Column('mime_type', sa.String),
            sa.Column('size', sa.Integer),
            sa.Column('uploaded_at', sa.DateTime, server_default=sa.text('now()')),
            sa.Column('description', sa.Text)
        )
        op.create_index('ix_media_files_user_id', 'media_files', ['user_id'])


def downgrade() -> None:
    conn = op.get_bind()

    if table_exists(conn, 'media_files'):
        op.drop_index('ix_media_files_user_id', table_name='media_files')
        op.drop_table('media_files')

    if table_exists(conn, 'imported_data'):
        op.drop_index('ix_imported_data_imported_file_id', table_name='imported_data')
        op.drop_table('imported_data')

    if table_exists(conn, 'imported_files'):
        op.drop_index('ix_imported_files_user_id', table_name='imported_files')
        op.drop_table('imported_files')

    if table_exists(conn, 'user_progress'):
        op.drop_index('ix_user_progress_step_name', table_name='user_progress')
        op.drop_index('ix_user_progress_user_id', table_name='user_progress')
        op.drop_table('user_progress')

    if table_exists(conn, 'steps'):
        op.drop_table('steps')
