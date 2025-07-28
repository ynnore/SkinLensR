from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# ADDED IMPORTS START
import sys
import os
# ... (autres imports existants) ...
from app.models.base import Base
from app.models.user import User
from app.models.legal_document import LegalDocument, UserLegalAgreement # <-- AJOUTE CET IMPORT
# Ajoute le dossier parent (backend) au PYTHONPATH pour que Python puisse trouver 'app.models'
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Importe la classe Base et tes modèles pour qu'Alembic les découvre
from app.models.base import Base
from app.models.user import User # Importe ton premier modèle User
# ADDED IMPORTS END


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata

# MODIFIED: Link target_metadata to Base.metadata from your models
target_metadata = Base.metadata


# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # connectable = engine_from_config(
    #     config.get_section(config.config_ini_section, {}),
    #     prefix="sqlalchemy.",
    #     poolclass=pool.NullPool,
    # )
    # MODIFIED: Use the URL from the config directly, it's simpler for single DB
    connectable = create_engine(config.get_main_option("sqlalchemy.url")) # <-- Import create_engine

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

# ADDED import create_engine
from sqlalchemy import create_engine # <-- Ajoute cet import en fin de fichier ou en haut
                                    # (ici en bas pour minimiser les conflits avec le template original)


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
