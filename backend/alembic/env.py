import os
import sys
from logging.config import fileConfig
from app.models import base, user, progress, legal_document
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# --- Configuration des chemins et chargement des variables ---
project_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, project_root)

# Charger les variables d'environnement depuis .env
dotenv_path = os.path.join(project_root, '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path)
    print(f"DEBUG: .env file loaded successfully from {dotenv_path}")
else:
    print(f"DEBUG: .env file not found at {dotenv_path}. Relying on exported environment variables.")

# --- Debug prints ---
print("--- DEBUG Alembic Configuration ---")
print(f"DEBUG: Current directory for Alembic: {os.getcwd()}")
print(f"DEBUG: DATABASE_URL (from export, if any): {os.environ.get('DATABASE_URL')}")
print(f"DEBUG: DB_USER={os.environ.get('DB_USER')}")
print(f"DEBUG: DB_PASSWORD={os.environ.get('DB_PASSWORD')}")
print(f"DEBUG: DB_NAME={os.environ.get('DB_NAME')}")
print("--- End DEBUG Alembic Configuration ---")

config = context.config

# Logging depuis alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Importer vos modèles (s'assurer que tout est importé correctement)
try:
    from app.models import base, user, progress, legal  # Exemple
except ModuleNotFoundError as e:
    print(f"ERROR: Could not import your models.\nDetails: {e}")
    sys.exit(1)


# Assure-toi que target_metadata contient bien la métadonnée de la base
target_metadata = Base.metadata

# Variables DB
DB_USER = os.getenv("DB_USER")
DB_PASSWORD_RAW = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME")

# Encodage du mot de passe pour les caractères spéciaux
DB_PASSWORD = DB_PASSWORD_RAW.replace("@", "%40")

# Vérification de la présence des variables critiques
if not all([DB_USER, DB_PASSWORD, DB_NAME]):
    print("ERROR: Missing critical database environment variables (DB_USER, DB_PASSWORD, DB_NAME).")
    sys.exit(1)

# Connexion Cloud SQL Proxy (URL)
db_url = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@/{DB_NAME}?host=/cloudsql/skinlens-new-test:europe-west1:skinlensr-db-prod-europe-west1"

def run_migrations_offline():
    """Exécuter les migrations en mode hors ligne."""
    context.configure(
        url=db_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Exécuter les migrations en mode en ligne."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section) or {},
        prefix="sqlalchemy.",
        url=db_url,
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()
