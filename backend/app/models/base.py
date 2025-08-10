# /home/manik/skinlensr/SkinLensR/backend/app/models/base.py

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

# --- Configuration de la Base de Données ---
# Il est conseillé de charger l'URL de la base de données à partir des variables d'environnement.
# Exemple : DATABASE_URL = "postgresql://user:password@host:port/database"
# Assurez-vous que ces variables sont configurées correctement.

# Pour un exemple simple, nous allons utiliser une base de données SQLite en mémoire.
# Adaptez ceci à votre configuration de base de données réelle (ex: PostgreSQL, MySQL).

# URL de la base de données (à charger depuis les variables d'environnement)
# DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./sql_app.db") # Exemple avec SQLite par défaut

# --- Création du Moteur de Base de Données ---
# Le moteur gère la connexion à la base de données.
# `connect_args={"check_same_thread": False}` est nécessaire pour SQLite si utilisé dans une application web multithreadée (comme FastAPI avec Uvicorn).
# Pour PostgreSQL/MySQL, ce paramètre n'est pas nécessaire.
# engine = create_engine(
#     DATABASE_URL, connect_args={"check_same_thread": False} # Si SQLite
# )
# Pour PostgreSQL, par exemple :
# DATABASE_URL = "postgresql://user:password@host:port/dbname"
# engine = create_engine(DATABASE_URL)

# --- Création de la Session Locale ---
# La SessionLocal fabrique des sessions DB. La dépendance `get_db` utilisera ceci.
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- Déclaration de la Base Déclarative ---
# C'est l'objet de base à partir duquel tous vos modèles hériteront.
# Il contient également l'instance MetaData pour la définition des tables.
Base = declarative_base()

# --- Fonction pour obtenir une session DB (si elle n'est pas gérée ailleurs) ---
# Cette fonction est souvent placée dans app/database.py, mais si vous voulez tout centraliser ici :
#
# def get_db_session():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# Note : Dans votre arborescence, vous avez déjà app/database.py. Il est plus probable
# que `get_db` et `engine` soient définis là-bas, et que ce fichier `base.py` ne contienne
# que la définition de `Base`.

# Par conséquent, le contenu le plus courant et attendu pour app/models/base.py est :

# from sqlalchemy.ext.declarative import declarative_base

# Base = declarative_base()