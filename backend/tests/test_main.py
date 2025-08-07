import pytest
from fastapi.testclient import TestClient
from app.main import app  # Assurez-vous que vous avez l'objet 'app' dans main.py

# Initialisation du client pour tester l'API
client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_get_user_status():
