import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv
from urllib.parse import quote_plus
from pgvector.sqlalchemy import Vector
import sqlalchemy as sa

# --- Configuration des chemins et chargement des variables ---
project_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, project_root)

dotenv_path = os.path.join(project_root, '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path)
    print(f"DEBUG: .env file loaded successfully from {dotenv_path}")
else:
    print(f"DEBUG: .env file not found at {dotenv_path}. Relying on exported environment variables.")

# Récupération des variables d'environnement critiques
DB_USER = os.getenv("DB_USER")
DB_PASSWORD_RAW = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME")

if not all([DB_USER, DB_PASSWORD_RAW, DB_NAME]):
    print("ERROR: Missing critical database environment variables (DB_USER, DB_PASSWORD, DB_NAME).")
    print(f"DB_USER: {DB_USER}, DB_PASSWORD: {'***' if DB_PASSWORD_RAW else None}, DB_NAME: {DB_NAME}")
    sys.exit(1)

# Encodage sécurisé du mot de passe (prise en compte des caractères spéciaux)
password_encoded = quote_plus(DB_PASSWORD_RAW)

# Construction de l'URL selon mode (proxy local ou Cloud SQL socket)
USE_LOCAL_PROXY = os.getenv("USE_LOCAL_PROXY", "false").lower() == "true"

if USE_LOCAL_PROXY:
    db_url = f"postgresql+psycopg2://{DB_USER}:{password_encoded}@127.0.0.1:5432/{DB_NAME}"
else:
    instance_connection_name = "skinlens-new-test:europe-west1:skinlensr-db-prod-europe-west1"
    db_url = f"postgresql+psycopg2://{DB_USER}:{password_encoded}@/{DB_NAME}?host=/cloudsql/{instance_connection_name}"

print("--- DEBUG Alembic Configuration ---")
print(f"DEBUG: Current directory for Alembic: {os.getcwd()}")
print(f"DEBUG: PYTHONPATH={os.environ.get('PYTHONPATH')}")
print(f"DEBUG: DATABASE_URL (from export, if any): {os.environ.get('DATABASE_URL')}")
print(f"DEBUG: DB_USER={DB_USER}")
print(f"DEBUG: DB_PASSWORD={'***'}")  # Ne pas afficher le mot de passe en clair
print(f"DEBUG: DB_NAME={DB_NAME}")
print(f"DEBUG: USE_LOCAL_PROXY={USE_LOCAL_PROXY}")
print(f"DEBUG: db_url={db_url}")
print("--- End DEBUG Alembic Configuration ---")

# Configuration Alembic
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

def load_models_metadata():
    try:
        from app.models import user, progress, legal_document, base
        from app.models.base import Base
        return Base.metadata
    except ModuleNotFoundError as e:
        print(f"ERROR: Could not import your models, possibly due to PYTHONPATH or circular imports.")
        print(f"Error details: {e}")
        print(f"Current sys.path: {sys.path}")
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
        # Ajout pour gérer vector si besoin
        # Pas strictement nécessaire ici en offline
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
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            render_as_batch=True,
            # Custom type rendering pour pgvector
            dialect_opts={"paramstyle": "named"},
            # Callback pour que Alembic reconnaisse 'vector'
            user_module_prefix='sa.',
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
