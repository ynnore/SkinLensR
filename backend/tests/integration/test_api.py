# tests/integration/test_api.py

from fastapi.testclient import TestClient
from app.main import app  # Assure-toi que l'app FastAPI est bien importée
from app.database import SessionLocal, engine
from app.models.base import Base

# Fonction pour initialiser la base de données pour les tests
def init_db():
    Base.metadata.create_all(bind=engine)

def get_test_client():
    # Crée un client de test pour interagir avec l'API
    client = TestClient(app)
    return client

# Test de la route POST /users pour la création d'un utilisateur
def test_create_user_api():
    init_db()  # Crée les tables pour les tests
    
    client = get_test_client()
    
    response = client.post("/users/", json={
        "email": "test@example.com",
        "password": "password123",
        "role": "user"
    })
    
    assert response.status_code == 201  # Vérifie que la réponse est 201 (création réussie)
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "hashed_password" in data  # Vérifie que le mot de passe est bien haché
    assert data["role"] == "user"  # Vérifie que le rôle est correct
