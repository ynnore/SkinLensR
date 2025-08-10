"""Alembic environment and setup script."""
import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv
from urllib.parse import quote_plus
from pgvector.sqlalchemy import Vector  # Garder ceci si vous utilisez pgvector
import sqlalchemy as sa

# --- Configuration des chemins et chargement des variables ---
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, project_root)  # Ajoute le dossier backend/ dans PYTHONPATH

dotenv_path = os.path.join(project_root, '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path)
    print(f"DEBUG: .env file loaded successfully from {dotenv_path}")
else:
    print(f"DEBUG: .env file not found at {dotenv_path}. Using environment variables.")

# Variables critiques
DB_USER = os.getenv("DB_USER")
DB_PASSWORD_RAW = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")  # Prendre DB_HOST sinon localhost
USE_LOCAL_PROXY = os.getenv("USE_LOCAL_PROXY", "false").lower() == "true"

if not all([DB_USER, DB_PASSWORD_RAW, DB_NAME]):
    print("ERROR: Missing critical database environment variables (DB_USER, DB_PASSWORD, DB_NAME).")
    print(f"DB_USER: {DB_USER}, DB_PASSWORD: {'***' if DB_PASSWORD_RAW else None}, DB_NAME: {DB_NAME}")
    sys.exit(1)

password_encoded = quote_plus(DB_PASSWORD_RAW)

if USE_LOCAL_PROXY:
    db_url = f"postgresql+psycopg2://{DB_USER}:{password_encoded}@127.0.0.1:5432/{DB_NAME}"
else:
    # Connexion via IP publique et port classique 5432
    db_url = f"postgresql+psycopg2://{DB_USER}:{password_encoded}@{DB_HOST}:5432/{DB_NAME}"

print("--- DEBUG Alembic Configuration ---")
print(f"DEBUG: Current directory for Alembic: {os.getcwd()}")
print(f"DEBUG: PYTHONPATH={os.environ.get('PYTHONPATH')}")
print(f"DEBUG: DATABASE_URL (from export, if any): {os.environ.get('DATABASE_URL')}")
print(f"DEBUG: DB_USER={DB_USER}")
print(f"DEBUG: DB_PASSWORD={'***'}")
print(f"DEBUG: DB_NAME={DB_NAME}")
print(f"DEBUG: DB_HOST={DB_HOST}")
print(f"DEBUG: USE_LOCAL_PROXY={USE_LOCAL_PROXY}")
print(f"DEBUG: db_url={db_url}")
print("--- End DEBUG Alembic Configuration ---")

# --- Configuration Alembic ---
config = context.config
if config.config_file_name:
    fileConfig(config.config_file_name)

def load_models_metadata():
    try:
        from app.models import base, user, progress, legal_document, drive
        from app.models.base import Base
        print("DEBUG: Successfully imported models and found Base.metadata")
        return Base.metadata
    except ModuleNotFoundError as e:
        print(f"ERROR: Could not import your models. Details: {e}")
        print(f"sys.path: {sys.path}")
        sys.exit(1)
    except AttributeError as e:
        print(f"ERROR: Could not access Base.metadata. Details: {e}")
        print(f"sys.path: {sys.path}")
        sys.exit(1)

target_metadata = load_models_metadata()

def run_migrations_offline():
    context.configure(
        url=db_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        render_as_batch=True,
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        {},
        prefix="sqlalchemy.",
        url=db_url,
        poolclass=pool.NullPool,
    )
    print("DEBUG: Connected to database successfully for online migration.")
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            render_as_batch=True,
            dialect_opts={"paramstyle": "named"},
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
