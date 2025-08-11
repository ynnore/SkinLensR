"""create profiles table force with updated_at trigger

Revision ID: 68d182a94fa7
Revises: c9d1a4f1b321
Create Date: 2025-08-11 07:11:38.177951
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '68d182a94fa7'
down_revision: Union[str, None] = 'c9d1a4f1b321'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
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
        sa.Column('created_at', sa.TIMESTAMP(timezone=False), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=False), server_default=sa.text('now()'))
    )
    op.execute("""
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    """)

    op.execute("""
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
    """)

def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;")
    op.execute("DROP FUNCTION IF EXISTS update_updated_at_column;")
    op.drop_table('profiles')
