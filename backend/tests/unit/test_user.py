# tests/unit/test_user.py

from app.crud import create_user
from app.models.user import User
from app.database import SessionLocal
from sqlalchemy.orm import Session

# Fonction pour créer une session de test en base de données
def get_test_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Test de la fonction create_user
def test_create_user():
    db = next(get_test_db())  # Récupérer la session DB
    user = create_user(db, email="test@example.com", password="password123")
    
    # Vérifier que l'utilisateur a bien été créé
    assert user.email == "test@example.com"
    assert user.hashed_password != "password123"  # Le mot de passe doit être haché
    assert user.role == "user"  # Vérifier le rôle par défaut
