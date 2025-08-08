# /home/manik/skinlensr/SkinLensR/backend/app/database.py
# Configuration SQLAlchemy pour la connexion à la base de données PostgreSQL.
# Charge les variables d'environnement, crée l'engine SQLAlchemy,
# configure la session et fournit un générateur pour obtenir une session DB.

from sqlalchemy.ext.declarative import declarative_base  # Import pour créer la classe de base des modèles
from sqlalchemy import create_engine                      # Import pour créer la connexion (engine) à la base
from sqlalchemy.orm import sessionmaker                    # Import pour configurer la session (connexion à la DB)
from dotenv import load_dotenv                             # Import pour charger les variables d'environnement depuis un fichier .env
import os                                                  # Import du module os pour accéder aux variables d'environnement

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Définition de la base pour les modèles SQLAlchemy
Base = declarative_base()

# Récupérer l'URL de la base de données depuis les variables d'environnement
DATABASE_URL = os.getenv("DATABASE_URL")

# Vérification que la variable d'environnement DATABASE_URL est bien définie
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the .env file")

# Création de l'engine SQLAlchemy pour se connecter à la base de données
# echo=True active le logging SQL pour afficher les requêtes dans la console
engine = create_engine(DATABASE_URL, echo=True)

# Configuration du sessionmaker : factory pour créer des sessions DB
# autocommit=False : on doit commit explicitement
# autoflush=False : flush manuel (envoi des modifications avant commit)
# bind=engine : lie la session à l'engine créé
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Fonction génératrice pour obtenir une session de base de données
def get_db():
    db = SessionLocal()  # Création d'une nouvelle session DB
    try:
        yield db        # Yield pour utiliser la session dans une dépendance FastAPI (avec context manager)
    finally:
        db.close()      # Ferme la session après usage, évite les fuites de connexion
