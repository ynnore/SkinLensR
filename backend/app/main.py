import os
import logging
import uvicorn
from typing import AsyncGenerator
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests

# --- Configuration de la Base de Données ---
from app.database import get_db, engine
from app.models.base import Base

# --- Importation des Schémas ---
from app.schemas import (
    UserCreate, UserResponse, UserUpdate, Token, TokenData,
    LegalDocumentCreate, LegalDocumentResponse, LegalDocumentUpdate,
    ProgressCreate, ProgressResponse, ProgressUpdate,
    FileResponse, SearchRequest, SearchResult, ScanQueryRequest, ScanResponse,
    ChatMessage, ConversationCreate, ConversationResponse, MessageSendRequest, MessageResponse,
    AgentCreate, AgentResponse, AgentUpdate, AgentTaskCreate, AgentTaskResponse,
)

# --- Importation des Services ---
from app.services.chat_service import ChatService
from app.services.rag import RAGService
from app.services.memory_manager import MemoryManager
from app.services.progress import ProgressService
from app.services.legal_documents import LegalDocumentService
from app.services.agent_manager_service import AgentManagerService

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
from app.oauth import router as oauth_router
from app.api.endpoints import huggingface_api

# --- Configuration du Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Lifespan pour création des tables ---
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Application starting... Initializing database tables.")
    try:
        Base.metadata.create_all(bind=engine)  # create_all est sync donc pas d'await
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
        raise
    yield
    logger.info("Application shutting down...")

# --- Initialisation FastAPI ---
app = FastAPI(
    title="Kiwi-ops Backend API",
    description="API pour la gestion stratégique, l'authentification, les documents légaux et les agents IA.",
    version="0.1.0",
    lifespan=lifespan,
)

# --- Middleware CORS ---
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

# --- Inclusion des routeurs ---
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(legal_documents_router, prefix="/legal-documents", tags=["legal-documents"])
app.include_router(progress_router, prefix="/progress", tags=["progress"])
app.include_router(scan_router, prefix="/scan", tags=["scan"])
app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(agent_router, prefix="/agent", tags=["agent"])
app.include_router(huggingface_api.router, prefix="/huggingface", tags=["huggingface"])
app.include_router(oauth_router, prefix="/auth/oauth", tags=["oauth"])  # <-- OAuth routeur sous ce prefix

# --- Routes générales ---
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to Kiwi-ops Backend! Mission Control Online."}

@app.get("/health", tags=["Health Check"])
async def health_check():
    return {"status": "ok", "service": "Kiwi-ops Backend"}

# --- Hugging Face Test Endpoint ---
HF_API_TOKEN = os.environ.get("HF_API_TOKEN")  # À définir dans .env ou variables d'environnement
HF_MODEL = "openai/gpt-oss-120b"

@app.post("/huggingface-chat", tags=["Hugging Face"])
async def huggingface_chat(prompt: str):
    if not HF_API_TOKEN:
        raise HTTPException(status_code=500, detail="HF_API_TOKEN non configuré dans les variables d'environnement.")

    url = f"https://api-inference.huggingface.co/models/{HF_MODEL}"
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    payload = {"inputs": prompt}

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()

# --- Exécution directe ---
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on http://0.0.0.0:{port}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
