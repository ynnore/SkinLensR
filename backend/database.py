# backend/app/database.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Charge les variables d'environnement depuis un fichier .env si présent (utile pour le dev local)
# Assurez-vous que le chemin vers .env est correct, souvent à la racine du projet.
# Si votre .env est à la racine du backend, cela devrait fonctionner.
load_dotenv()

# Récupère l'URL de la base de données depuis une variable d'environnement
# Le nom de la variable d'environnement est important (ici DATABASE_URL)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Vérification pour s'assurer que la variable d'environnement est bien définie
if not SQLALCHEMY_DATABASE_URL:
    # Si vous déployez sur Cloud Run, il faudra passer cette variable via gcloud
    # Si vous ne la trouvez pas, le programme va planter ici, ce qui est une bonne chose pour signaler le problème.
    raise ValueError("La variable d'environnement DATABASE_URL n'est pas définie.")

# Le reste du code reste le même
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()