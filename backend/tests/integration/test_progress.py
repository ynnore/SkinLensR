import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Simule un header d’authentification — à adapter si tu as un vrai système de login
def get_auth_headers():
    return {
        "Authorization": "Bearer faketoken"
    }

def test_create_user_progress():
    # Simule un utilisateur déjà existant avec un ID (à adapter à ta DB)
    user_id = 1

    response = client.post(
        f"/user/{user_id}/progress",
        headers=get_auth_headers(),
        json={
            "has_accepted_terms": True,
            "has_signed_privacy": False,
            "has_completed_profile": False,
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user_id
    assert data["has_accepted_terms"] is True

def test_get_user_progress():
    user_id = 1
    response = client.get(
        f"/user/{user_id}/progress",
        headers=get_auth_headers(),
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user_id

def test_update_user_progress():
    user_id = 1
    response = client.put(
        f"/user/{user_id}/progress",
        headers=get_auth_headers(),
        json={
            "has_accepted_terms": True,
            "has_signed_privacy": True,
            "has_completed_profile": True,
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["has_signed_privacy"] is True
    assert data["has_completed_profile"] is True
