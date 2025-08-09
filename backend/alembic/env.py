"""Alembic environment and setup script."""
import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv
from urllib.parse import quote_plus
from pgvector.sqlalchemy import Vector # Garder ceci si vous utilisez pgvector
import sqlalchemy as sa

# --- Configuration des chemins et chargement des variables ---
# Ce chemin est calculé par rapport à l'emplacement actuel de env.py
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, project_root) # Assure que le répertoire backend/ est dans le PYTHONPATH

# Charge les variables du fichier .env
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
    # Assurez-vous que le port est correct pour votre configuration locale PostgreSQL
    db_url = f"postgresql+psycopg2://{DB_USER}:{password_encoded}@127.0.0.1:5432/{DB_NAME}"
else:
    instance_connection_name = "skinlens-new-test:europe-west1:skinlensr-db-prod-europe-west1" # Vérifiez cette valeur
    db_url = f"postgresql+psycopg2://{DB_USER}:{password_encoded}/?host=/cloudsql/{instance_connection_name}&dbname={DB_NAME}" # Ajustement pour le dbname via params

print("--- DEBUG Alembic Configuration ---")
print(f"DEBUG: Current directory for Alembic: {os.getcwd()}")
print(f"DEBUG: PYTHONPATH={os.environ.get('PYTHONPATH')}") # Utile si vous devez définir PYTHONPATH manuellement
print(f"DEBUG: DATABASE_URL (from export, if any): {os.environ.get('DATABASE_URL')}")
print(f"DEBUG: DB_USER={DB_USER}")
print(f"DEBUG: DB_PASSWORD={'***'}")
print(f"DEBUG: DB_NAME={DB_NAME}")
print(f"DEBUG: USE_LOCAL_PROXY={USE_LOCAL_PROXY}")
print(f"DEBUG: db_url={db_url}")
print("--- End DEBUG Alembic Configuration ---")

# --- Configuration Alembic ---
config = context.config
# Assurez-vous que le chemin vers alembic.ini est correct s'il n'est pas chargé automatiquement
# config.config_file_name = os.path.join(project_root, "alembic/alembic.ini") # Peut être utile si la config n'est pas trouvée

if config.config_file_name:
    fileConfig(config.config_file_name)

# Fonction pour charger les métadonnées SQLAlchemy de manière plus sûre
def load_models_metadata():
    try:
        # Ceci est la partie cruciale : assurez-vous que les imports ici sont corrects
        # et qu'ils ne causent pas de circularité entre eux ou avec env.py
        from app.models import base, user, progress, legal_document, drive, heart # Importez TOUS les modules de modèles qui ont des métadonnées
        from app.models.base import Base # Importe l'objet Base SQLAlchemy
        
        print("DEBUG: Successfully imported models and found Base.metadata")
        return Base.metadata
    except ModuleNotFoundError as e:
        print(f"ERROR: Could not import your models, possibly due to PYTHONPATH or circular imports within app.models.")
        print(f"Error details: {e}")
        print(f"Current sys.path: {sys.path}")
        print(f"Current project_root used: {project_root}")
        sys.exit(1)
    except AttributeError as e:
        print(f"ERROR: Could not access Base.metadata, likely Base object is not properly defined or imported.")
        print(f"Error details: {e}")
        print(f"Current sys.path: {sys.path}")
        print(f"Current project_root used: {project_root}")
        sys.exit(1)

# Définir target_metadata en appelant la fonction
target_metadata = load_models_metadata()

# --- Fonctions pour exécuter les migrations ---

def run_migrations_offline():
    """Exécute les migrations en mode hors ligne.

    Ce script peut être exécuté depuis la ligne de commande avec :
    alembic -c alembic/alembic.ini upgrade head
    """
    context.configure(
        url=db_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        render_as_batch=True, # Utile pour les schémas complexes ou certains dialectes DB
        # Pas strictement nécessaire ici en offline, mais peut être utile
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Exécute les migrations en mode en ligne.

    Ce script peut être exécuté depuis la ligne de commande avec :
    alembic -c alembic/alembic.ini upgrade head
    """
    connectable = engine_from_config(
        {},
        prefix="sqlalchemy.",
        url=db_url,
        poolclass=pool.NullPool, # Utiliser NullPool pour éviter les problèmes potentiels
    )
    print("DEBUG: Connected to database successfully for online migration.")
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            render_as_batch=True,
            dialect_opts={"paramstyle": "named"},
            # Pas besoin de user_module_prefix si vos modèles sont bien importés
        )
        with context.begin_transaction():
            context.run_migrations()

# --- Exécution principale ---
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()