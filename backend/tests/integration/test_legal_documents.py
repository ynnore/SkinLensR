import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Simuler un utilisateur authentifié (à adapter selon ton système d'auth)
def get_auth_headers():
    # Cette fonction devra générer un vrai token JWT après login (à implémenter plus tard)
    return {
        "Authorization": "Bearer faketoken"
    }

def test_create_legal_document():
    response = client.post(
        "/legal/",
        headers=get_auth_headers(),
        json={
            "title": "Confidentialité",
            "content": "Ceci est notre politique de confidentialité.",
            "language": "fr"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Confidentialité"
    assert "id" in data

def test_get_legal_documents():
    response = client.get("/legal/", headers=get_auth_headers())
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_legal_document_by_id():
    # Création d'un document pour le test
    create_response = client.post(
        "/legal/",
        headers=get_auth_headers(),
        json={
            "title": "Conditions Générales",
            "content": "Conditions d'utilisation de Kiwi-Ops.",
            "language": "fr"
        }
    )
    doc_id = create_response.json()["id"]

    response = client.get(f"/legal/{doc_id}", headers=get_auth_headers())
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == doc_id
    assert data["title"] == "Conditions Générales"
