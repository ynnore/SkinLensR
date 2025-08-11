import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_generate_text_scan():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/scan/generate",
            data={"prompt": "Hello world", "mode": "text"}
        )
    assert response.status_code == 200
    json_data = response.json()
    assert "response_text" in json_data
    assert isinstance(json_data["response_text"], str)
    assert len(json_data["response_text"]) > 0

@pytest.mark.asyncio
async def test_generate_with_file_upload():
    file_content = b"Sample text file content for testing."
    files = {"file": ("test.txt", file_content, "text/plain")}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/scan/generate",
            data={"prompt": "Analyse ce texte", "mode": "text"},
            files=files
        )
    assert response.status_code == 200
    json_data = response.json()
    assert "response_text" in json_data
    assert isinstance(json_data["response_text"], str)
    assert len(json_data["response_text"]) > 0
