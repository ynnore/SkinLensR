# /home/manik/skinlensr/SkinLensR/backend/app/main.py
import os
import logging
import uvicorn
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv  # Pour charger .env

# --- Charger .env ---
load_dotenv()

# --- Configuration de la Base de Données ---
from app.database import engine
from app.models.base import Base

# --- Importation des Routeurs ---
from app.routers import (
    auth_router,
    users_router,
    legal_documents_router,
    progress_router,
    scan_router,
    chat_router,
    agent_router,
)
from app.api.endpoints import huggingface_api

# --- Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Lifespan ---
async def create_db_tables():
    logger.info("Initializing database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully.")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")
        raise

async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await create_db_tables()
    yield
    logger.info("Shutting down...")

# --- App FastAPI ---
app = FastAPI(
    title="Kiwi-ops Backend API",
    description="API pour la gestion stratégique, l'authentification, les documents légaux et les agents IA.",
    version="0.1.0",
    lifespan=lifespan
)

# --- CORS ---
CORS_ORIGINS = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:8000,https://api.kiwi-ops.com"
).split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Inclusion des Routers ---
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(legal_documents_router)
app.include_router(progress_router)
app.include_router(scan_router)
app.include_router(chat_router)
app.include_router(agent_router)
app.include_router(huggingface_api.router)  # Nouveau endpoint Hugging Face

# --- Routes Générales ---
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to Kiwi-ops Backend! Mission Control Online."}

@app.get("/health", tags=["Health Check"])
async def health_check():
    return {"status": "ok", "service": "Kiwi-ops Backend"}

# --- Exécution ---
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on http://0.0.0.0:{port}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
