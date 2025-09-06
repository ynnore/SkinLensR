# ===================================================================
# IMPORTS ET CONFIGURATION INITIALE
# ===================================================================
from dotenv import load_dotenv
load_dotenv()  # charge automatiquement le .env

import os
import logging
import traceback
from typing import AsyncGenerator, List, Optional, Dict, Any
from contextlib import asynccontextmanager

import uvicorn
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

# Google OAuth
from google_auth_oauthlib.flow import Flow

# Routers
from app.routers import google_auth, auth_router, users_router, legal_documents_router, progress_router, scan_router, chat_router, agent_router
from app.oauth import router as oauth_router
from app.api import protected
from app.api.endpoints import huggingface_api

# Variable globale pour stocker l'erreur de démarrage
STARTUP_ERROR_HTML = None

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("kiwi-ops")

# ===================================================================
# LIFESPAN MODIFIÉ POUR CAPTURER L'ERREUR SANS PLANTER
# ===================================================================
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    global STARTUP_ERROR_HTML
    logger.info("Application starting... Attempting initialization.")

    try:
        from app.database import engine
        from app.models.base import Base

        logger.info("Attempting database connection and table creation...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialization successful!")

        _init_chroma()
        STARTUP_ERROR_HTML = None
        yield

    except Exception as e:
        logger.error(f"FATAL STARTUP ERROR CAPTURED: {e}")
        error_html_content = traceback.format_exc()
        STARTUP_ERROR_HTML = f"""
        <html><head><title>Startup Error</title></head><body>
        <h1>Container failed to start!</h1>
        <h2>Here is the exact Python error:</h2>
        <pre><code>{error_html_content}</code></pre>
        </body></html>
        """
        yield

    logger.info("Application shutting down...")

# ===================================================================
# CRÉATION DE L'APPLICATION FASTAPI
# ===================================================================
app = FastAPI(
    title="Kiwi-ops Backend API (Debug Mode)",
    description="API pour la gestion stratégique, l'authentification, les documents légaux et les agents IA.",
    version="0.1.0",
    lifespan=lifespan,
)

# ===================================================================
# RAG / ChromaDB
# ===================================================================
CHROMA_URL = os.environ.get("CHROMA_URL", "").strip()
CHROMA_DB_DIR = os.environ.get("CHROMA_DB_DIR", "/tmp/chroma_db")
CHROMA_COLLECTION = os.environ.get("CHROMA_COLLECTION", "kiwi_docs")
EMBEDDING_MODEL = os.environ.get("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
RAG_TOP_K = int(os.environ.get("RAG_TOP_K", "5"))

_chroma_client = None
_chroma_collection = None
_embedding_fn = None

def _init_chroma() -> None:
    global _chroma_client, _chroma_collection, _embedding_fn
    try:
        from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
        _embedding_fn = SentenceTransformerEmbeddingFunction(model_name=EMBEDDING_MODEL)

        if CHROMA_URL:
            from chromadb import HttpClient
            host = CHROMA_URL.split("://")[-1].split(":")[0]
            port = int(CHROMA_URL.split(":")[-1]) if ":" in CHROMA_URL[6:] else 8000
            _chroma_client = HttpClient(host=host, port=port)
            logger.info(f"RAG: using Chroma HttpClient at {CHROMA_URL}")
        else:
            import chromadb
            _chroma_client = chromadb.PersistentClient(path=CHROMA_DB_DIR)
            logger.info(f"RAG: using local Chroma PersistentClient at {CHROMA_DB_DIR}")

        try:
            _chroma_collection = _chroma_client.get_collection(name=CHROMA_COLLECTION, embedding_function=_embedding_fn)
        except Exception:
            _chroma_collection = _chroma_client.create_collection(name=CHROMA_COLLECTION, embedding_function=_embedding_fn)
        logger.info(f"RAG: collection ready: {CHROMA_COLLECTION}")

    except Exception as e:
        logger.warning(f"RAG init failed (Chroma/embeddings not ready?): {e}")

# Fonctions RAG
def _rag_search(query: str, n_results: int = RAG_TOP_K) -> Dict[str, Any]:
    if not _chroma_collection:
        return {}
    results = _chroma_collection.query(query_texts=[query], n_results=n_results)
    return {
        "ids": results.get("ids", [[]])[0] if results.get("ids") else [],
        "documents": results.get("documents", [[]])[0] if results.get("documents") else [],
        "metadatas": results.get("metadatas", [[]])[0] if results.get("metadatas") else [],
        "distances": results.get("distances", [[]])[0] if results.get("distances") else [],
    }

def _format_context(docs: List[str], metas: List[Dict[str, Any]], max_chars: int = 1200) -> str:
    chunks = []
    for i, doc in enumerate(docs):
        src = metas[i].get("source") if i < len(metas) and metas[i] else None
        head = (doc or "")[:400]
        if src:
            chunks.append(f"[{i+1}] (source: {src})\n{head}\n")
        else:
            chunks.append(f"[{i+1}]\n{head}\n")
        if sum(len(c) for c in chunks) >= max_chars:
            break
    return "\n".join(chunks).strip()

# ===================================================================
# MIDDLEWARE CORS
# ===================================================================
CORS_ORIGINS = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:8000,https://www.kiwi-ops.com,https://kiwi-ops.com"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in CORS_ORIGINS if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================================================================
# INCLUSION DES ROUTERS
# ===================================================================
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(legal_documents_router, prefix="/legal-documents", tags=["legal-documents"])
app.include_router(progress_router, prefix="/progress", tags=["progress"])
app.include_router(scan_router, prefix="/scan", tags=["scan"])
app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(agent_router, prefix="/agent", tags=["agent"])
app.include_router(huggingface_api.router, prefix="/huggingface", tags=["huggingface"])
app.include_router(oauth_router, prefix="/auth/oauth", tags=["oauth"])
app.include_router(protected.router)
app.include_router(google_auth.router, prefix="/auth")

# ===================================================================
# ROUTES DE DÉBOGAGE / RACINE
# ===================================================================
@app.get("/", response_class=HTMLResponse, tags=["Root"])
async def read_root():
    if STARTUP_ERROR_HTML:
        return HTMLResponse(content=STARTUP_ERROR_HTML, status_code=500)
    return HTMLResponse(content='{"message": "Welcome to Kiwi-ops Backend! Mission Control Online."}')

@app.get("/health", tags=["Health Check"])
async def health_check():
    return {"status": "ok", "service": "Kiwi-ops Backend", "rag_ready": bool(_chroma_collection)}

# Hugging Face API
HF_API_TOKEN = os.environ.get("HF_API_TOKEN")
HF_MODEL = os.environ.get("HF_MODEL", "openai/gpt-oss-120b")

@app.post("/huggingface-chat", tags=["Hugging Face"])
async def huggingface_chat(prompt: str):
    if not HF_API_TOKEN:
        raise HTTPException(status_code=500, detail="HF_API_TOKEN non configuré.")
    url = f"https://api-inference.huggingface.co/models/{HF_MODEL}"
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    payload = {"inputs": prompt}
    resp = requests.post(url, headers=headers, json=payload, timeout=60)
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()

# ===================================================================
# DÉMARRAGE DU SERVEUR
# ===================================================================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on http://0.0.0.0:{port}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
