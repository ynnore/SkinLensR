"""Ajout table profiles (safe mode)

Revision ID: c9d1a4f1b321
Revises: b6bfa21e4a41
Create Date: 2025-08-11 12:45:00
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# Révisions Alembic
revision: str = 'c9d1a4f1b321'
down_revision: Union[str, None] = 'b6bfa21e4a41'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    if "profiles" not in inspector.get_table_names():
        op.create_table(
            'profiles',
            sa.Column('id', sa.Integer, primary_key=True),
            sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
            sa.Column('first_name', sa.String(100)),
            sa.Column('last_name', sa.String(100)),
            sa.Column('email', sa.String(255)),
            sa.Column('phone', sa.String(20)),
            sa.Column('address', sa.Text),
            sa.Column('city', sa.String(100)),
            sa.Column('country', sa.String(100)),
            sa.Column('avatar_url', sa.Text),
            sa.Column('bio', sa.Text),
            sa.Column('language_preference', sa.String(10), server_default='fr'),
            sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now()),
            sa.Column('updated_at', sa.TIMESTAMP, server_default=sa.func.now()),
        )
        op.create_index('ix_profiles_user_id', 'profiles', ['user_id'])

def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    if "profiles" in inspector.get_table_names():
        op.drop_index('ix_profiles_user_id', table_name='profiles')
        op.drop_table('profiles')
