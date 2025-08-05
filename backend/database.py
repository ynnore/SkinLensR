      
# backend/app/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# L'URL de connexion à ta base de données PostgreSQL
# C'est la même que dans alembic.ini, mais ici tu peux aussi la gérer via .env (plus tard)
SQLALCHEMY_DATABASE_URL = "postgresql://kiwiops_user:M%40chasoop@localhost/kiwiops_db"
# Note : Le %40 est nécessaire ici aussi si ton mot de passe contient @

# Crée un moteur de base de données SQLAlchemy
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

# Crée une classe SessionLocal. Chaque instance de SessionLocal sera une session de base de données.
# Le 'autocommit=False' signifie que tu devras faire un '.commit()' explicite pour sauvegarder les changements.
# Le 'autoflush=False' signifie que les objets ne seront pas flushés (écrits dans la DB) avant un commit.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dépendance pour FastAPI : Obtenir une session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db # Le code s'exécutera jusqu'à ce que le générateur soit suspendu (yield)
    finally:
        db.close() # S'assure que la session est fermée après la requête

    