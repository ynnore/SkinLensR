import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Charger les variables d'environnement depuis un fichier .env (pour le développement local)
load_dotenv()

def get_database_url():
    """
    Construit l'URL de connexion à la base de données de manière intelligente,
    en s'adaptant à l'environnement (Cloud Run ou développement local).
    """
    
    # La variable "K_SERVICE" est automatiquement définie par Cloud Run.
    # Sa présence est le moyen le plus fiable de détecter que l'on tourne sur Cloud Run.
    if os.getenv("K_SERVICE"):
        # ===============================================
        # Logique pour l'environnement de Production (Cloud Run)
        # ===============================================
        
        # Récupère les variables d'environnement injectées par gcloud run deploy
        db_user = os.environ.get("DB_USER")
        db_pass = os.environ.get("DB_PASSWORD")  # Vient des secrets
        db_name = os.environ.get("DB_NAME")
        instance_connection_name = os.environ.get("CLOUD_SQL_CONNECTION_NAME")
        
        # Vérification que toutes les variables nécessaires sont présentes
        if not all([db_user, db_pass, db_name, instance_connection_name]):
            raise ValueError("Une ou plusieurs variables d'environnement pour la BDD sont manquantes en production.")
            
        # Format de l'URL de connexion pour un socket Unix Cloud SQL.
        # C'est la méthode la plus sécurisée et performante sur Cloud Run.
        # Notez le format spécial avec ?host=...
        return (
            f"postgresql+psycopg2://{db_user}:{db_pass}@"
            f"?host=/cloudsql/{instance_connection_name}"
        )
    else:
        # ====================================================
        # Logique pour l'environnement de Développement Local
        # ====================================================
        
        # Récupère l'URL complète depuis le fichier .env ou les variables système
        db_url_local = os.getenv('DATABASE_URL')
        if not db_url_local:
            raise ValueError("La variable d'environnement DATABASE_URL est requise pour le développement local.")
        
        return db_url_local

# Crée le moteur SQLAlchemy avec l'URL appropriée
engine = create_engine(get_database_url())

# Configure la session SQLAlchemy
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    Dépendance FastAPI pour obtenir une session de base de données.
    Utiliser dans les routes par : db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()