# backend/database.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Charge les variables d'environnement depuis un fichier .env
load_dotenv()

# Récupère l'URL de la base de données depuis la variable d'environnement
SQLALCHEMY_DATABASE_URL = os.getenv('DATABASE_URL')

# Vérifie que la variable est bien définie, sinon lève une erreur explicite
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError('La variable d\'env DATABASE_URL n\'est pas définie.')

# Crée le moteur SQLAlchemy pour la connexion à la base de données
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Configure une session SQLAlchemy liée au moteur, sans autocommit ni autoflush automatique
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    Dépendance FastAPI pour obtenir une session de base de données.
    Utiliser dans les routes par : db: Session = Depends(get_db)

    Cette fonction est un générateur qui ouvre une session,
    la fournit à la route, puis la ferme proprement après usage.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
