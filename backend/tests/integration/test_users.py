import pytest
from httpx import AsyncClient
from fastapi import status
from app.main import app

@pytest.mark.asyncio
async def test_register_user():
    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        response = await ac.post("/register", json={
            "email": "test@example.com",
            "password": "testpassword123"
        })
    assert response.status_code == status.HTTP_200_OK or response.status_code == status.HTTP_201_CREATED
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_login_user():
    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        response = await ac.post("/login", data={
            "username": "test@example.com",
            "password": "testpassword123"
        })
    assert response.status_code == status.HTTP_200_OK
    assert "access_token" in response.json()
