import pytest
from app.models import User, LegalDocument, Progress
from app.database import SessionLocal, engine
from sqlalchemy.orm import Session
from app.models import Base

# Crée la base de données avant chaque test et la détruit après
@pytest.fixture(scope="module")
def db_session():
    # Crée les tables
    Base.metadata.create_all(bind=engine)
    # Crée une session DB
