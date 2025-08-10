# /home/manik/skinlensr/SkinLensR/backend/app/main.py

import os
import logging
from datetime import timedelta
from typing import AsyncGenerator, Dict, Any

from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine # Nécessaire pour create_all si vous ne utilisez pas Alembic au démarrage
from sqlalchemy.orm import sessionmaker # Pour la fabrique de session

# --- Configuration de la Base de Données ---
# Ces éléments devraient idéalement être dans app/database.py
# Assurez-vous que app/database.py est bien configuré avec engine et get_db()
from app.database import get_db, engine 
from app.models.base import Base # La base déclarative SQLAlchemy

# --- Importation des Schémas ---
# Centralisez vos schémas pour une meilleure organisation
from app.schemas import (
    # Utilisateurs & Auth
    UserCreate, UserResponse, UserUpdate, Token, TokenData,
    # Documents Légaux
    LegalDocumentCreate, LegalDocumentResponse, LegalDocumentUpdate,
    # Progression
    ProgressCreate, ProgressResponse, ProgressUpdate,
    # Drive / Scan
    FileResponse, SearchRequest, SearchResult, ScanQueryRequest, ScanResponse,
    # Chat
    ChatMessage, ConversationCreate, ConversationResponse, MessageSendRequest, MessageResponse,
    # Agents
    AgentCreate, AgentResponse, AgentUpdate, AgentTaskCreate, AgentTaskResponse,
)

# --- Importation des Services ---
# Il est essentiel d'avoir vos services correctement implémentés
# et d'importer les dépendances pour les obtenir.
from app.services.chat_service import ChatService
from app.services.huggingface import HuggingFaceService
from app.services.openai_compatible_llm import OpenAICompatibleLLM
from app.services.rag import RAGService
from app.services.memory_manager import MemoryManager
from app.services.progress import ProgressService
from app.services.legal_documents import LegalDocumentService
# AgentManagerService est nécessaire pour les routes des agents
from app.services.agent_manager_service import AgentManagerService

# --- Importation des Routeurs ---
# Importez tous vos routeurs depuis le package app/routers (ou app/api si vous utilisez cette structure)
# Assurez-vous que ces routeurs sont bien définis et exportés par __init__.py
from app.routers import (
    auth_router,
    users_router,
    legal_documents_router,
    progress_router,
    scan_router,
    chat_router,
    agent_router,
    # agent_interface_router, # Si vous avez ce routeur spécifique
)

# --- Configuration du Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Lifespan (Gestion du cycle de vie de l'application) ---
async def create_db_tables():
    """Fonction utilitaire pour créer les tables de la base de données au démarrage."""
    logger.info("Application starting... Initializing database tables.")
    try:
        # Crée toutes les tables définies dans vos modèles SQLAlchemy.
        # Note : Pour la production, Alembic est la méthode recommandée pour les migrations.
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
        raise # Lève l'exception pour arrêter le démarrage si la DB n'est pas prête.

async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Fonction de lifespan pour gérer les tâches de démarrage et d'arrêt.
    Elle assure que la base de données est prête avant de lancer le serveur.
    """
    await create_db_tables()
    yield # L'application est prête à recevoir des requêtes
    logger.info("Application shutting down...")
    # Ici, vous pouvez ajouter du code pour le nettoyage à l'arrêt (ex: fermer des connexions poolées).

# --- Initialisation de l'Application FastAPI ---
app = FastAPI(
    title="Kiwi-ops Backend API",
    description="API pour la gestion stratégique, l'authentification, les documents légaux et les agents IA.",
    version="0.1.0",
    lifespan=lifespan # Associe la fonction lifespan à l'application
)

# --- Middleware CORS ---
# Permet à votre frontend de communiquer avec le backend depuis une origine différente.
# Il est conseillé de charger les origines autorisées depuis les variables d'environnement.
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:8000,https://api.kiwi-ops.com").split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"], # Autorise toutes les méthodes HTTP
    allow_headers=["*"], # Autorise tous les headers
)

# --- Inclusion des Routers ---
# Chaque routeur est inclus ici avec son préfixe défini lors de sa création.
# Cela centralise tous les points d'entrée de votre API.
app.include_router(auth_router)          # Préfixe: /auth
app.include_router(users_router)         # Préfixe: /users
app.include_router(legal_documents_router) # Préfixe: /legal (ou /api/legal selon votre choix)
app.include_router(progress_router)      # Préfixe: /progress
app.include_router(scan_router)          # Préfixe: /scan
app.include_router(chat_router)          # Préfixe: /chat
app.include_router(agent_router)         # Préfixe: /agents
# app.include_router(agent_interface_router) # Si vous l'avez créé

# --- Routes Générales de l'Application ---
# Ces routes ne sont pas dans des routeurs spécifiques et sont au niveau racine de l'API.

@app.get("/", tags=["Root"])
async def read_root():
    """
    Endpoint racine pour vérifier que l'API est opérationnelle.
    """
    return {"message": "Welcome to Kiwi-ops Backend! Mission Control Online."}

@app.get("/health", tags=["Health Check"])
async def health_check():
    """
    Endpoint de vérification de l'état de santé de l'API.
    Peut être étendu pour vérifier la connexion à la DB ou à d'autres services.
    """
    # Vous pouvez ajouter ici des vérifications de connexion aux services externes
    # (ex: base de données, LLM, Vector Store) pour un health check plus complet.
    return {"status": "ok", "service": "Kiwi-ops Backend"}

# --- Exécution de l'Application ---
# Ce bloc permet de lancer l'application directement depuis ce fichier si exécuté en tant que script principal.
if __name__ == "__main__":
    # Utilise le port défini dans la variable d'environnement PORT, ou 8000 par défaut.
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on http://0.0.0.0:{port}")
    # Uvicorn lance l'application FastAPI.
    # 'reload=True' est utile pour le développement mais doit être désactivé en production.
    # Le 'lifespan' est automatiquement géré par Uvicorn.
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)