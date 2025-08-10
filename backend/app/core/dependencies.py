# /home/manik/skinlensr/SkinLensR/backend/app/core/dependencies.py
"""
Ce module centralise toutes les fonctions de dépendance FastAPI.
Il fournit des instances des services et autres ressources nécessaires aux routeurs et à l'application.
"""

import logging
import os # Nécessaire si vous chargez des configurations depuis l'env ici

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

# --- Imports Clés ---

# Base de Données
from app.database import SessionLocal # Si SessionLocal est défini ici
# Si SessionLocal est dans app/database.py, alors get_db est la seule dépendance nécessaire ici.
# from app.database import get_db 

# Modèles (pour les dépendances de sécurité, ex: User)
from app.models.user import User # Nécessaire pour la décode d'access token

# Schémas Pydantic (pour les réponses des dépendances)
from app.schemas.user import UserResponse # Pour get_current_user
from app.schemas.auth import TokenData # Pour les données du token

# Services
from app.services.chat_service import ChatService
from app.services.huggingface import HuggingFaceService
from app.services.openai_compatible_llm import OpenAICompatibleLLM
from app.services.rag import RAGService
from app.services.memory_manager import MemoryManager
from app.services.progress import ProgressService
from app.services.legal_documents import LegalDocumentService
from app.services.agent_manager_service import AgentManagerService
# from app.services.scan_service import ScanService # Si vous avez un ScanService dédié

# Utilitaires (ex: pour le texte splitter, embeddings)
from app.text_splitter import DocumentSplitter
# from app.embeddings import EmbeddingsService # Si vous l'avez

# Configuration globale (très utile pour les paramètres)
from app.config import settings # Assurez-vous que app/config.py est bien créé et chargé

# Authentification (pour le schéma OAuth2)
# Il est préférable de définir oauth2_scheme une seule fois et de le réutiliser.
# Si vous l'avez déjà défini dans auth.py, vous pouvez l'importer d'ici.
# Sinon, définissez-le ici ou dans auth.py et importez-le.
# Par souci de clarté, je le mets ici :
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token") # L'URL doit correspondre à votre endpoint de token

logger = logging.getLogger(__name__)

# --- Fonctions de Dépendance Principales ---

def get_db_dependency() -> Session:
    """Dépendance FastAPI pour obtenir une session de base de données."""
    db_session = SessionLocal() # Utilise SessionLocal de app.database
    try:
        yield db_session
    finally:
        db_session.close()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db_dependency) # Dépend de la session DB
) -> Optional[UserResponse]: # On retourne un schéma Pydantic pour les routes
    """
    Dépendance pour obtenir l'utilisateur courant authentifié à partir du token JWT.
    Elle décode le token, trouve l'utilisateur dans la DB, et retourne ses infos.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = auth.decode_access_token(token) # Utilise la fonction de décodage depuis app.auth
    if payload is None or payload.get("sub") is None: # 'sub' est généralement le sujet du token (l'email)
        raise credentials_exception

    email: str = payload["sub"]
    
    # Récupérer l'utilisateur de la DB
    user_model = get_user_by_email(db, email=email) # Utilise la fonction CRUD

    if user_model is None:
        raise credentials_exception

    # Mapper le modèle User à UserResponse pour la réponse API
    return UserResponse(
        id=user_model.id,
        email=user_model.email,
        role=user_model.role,
        created_at=user_model.created_at,
        updated_at=user_model.updated_at
    )

def get_current_admin_user(
    current_user: UserResponse = Depends(get_current_user) # Dépend de l'utilisateur courant authentifié
) -> UserResponse:
    """
    Dépendance pour s'assurer que l'utilisateur courant est un administrateur.
    """
    if current_user.role != "admin": # Assurez-vous que la valeur 'admin' correspond à votre rôle défini
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions (Admin required)",
        )
    return current_user

# --- Dépendances pour les Services ---
# Ces fonctions fournissent des instances des services que vos routeurs utiliseront.

def get_huggingface_service() -> HuggingFaceService:
    """Fournit une instance du service Hugging Face."""
    # Charger les configurations depuis les settings globaux si nécessaire
    # cache_dir = settings.HF_CACHE_DIR
    # hf_service = HuggingFaceService(cache_dir=cache_dir)
    # Pour l'exemple, on utilise des valeurs par défaut.
    return HuggingFaceService() # Assurez-vous que l'init de HFService ne nécessite pas trop de setup ici

def get_openai_compatible_llm() -> OpenAICompatibleLLM:
    """Fournit une instance du client LLM compatible (OpenAI, Ollama, etc.)."""
    # Charger les configurations depuis les settings globaux
    # api_key = settings.OPENAI_API_KEY
    # base_url = settings.LOCAL_LLM_BASE_URL
    # model_name = settings.LLM_MODEL_NAME
    # default_params = {"temperature": 0.7, "max_tokens": 150}
    
    # Pour l'exemple, on utilise les configurations par défaut ou celles chargées
    # llm_client = OpenAICompatibleLLM(
    #     api_key=api_key,
    #     base_url=base_url,
    #     model_name=model_name,
    #     default_params=default_params
    # )
    return OpenAICompatibleLLM() # Assurez-vous que l'init correspond à votre config

def get_memory_manager(db_session: Session = Depends(get_db_dependency)) -> MemoryManager:
    """Fournit une instance du Memory Manager."""
    # Injecter les dépendances nécessaires pour le MemoryManager
    # (Vector Store, LLM client pour le résumé, DB session pour la persistance)
    
    # Obtenir le Vector Store (il faudra une dépendance pour cela)
    # vector_store = get_vector_store_instance() # Hypothetique
    # Obtenir le LLM client pour les résumés
    # llm_for_summary = get_openai_compatible_llm()
    
    # memory_manager = MemoryManager(
    #     vector_store=vector_store,
    #     db_session=db_session,
    #     summary_model=llm_for_summary
    # )
    # return memory_manager
    raise NotImplementedError("MemoryManager dependency setup is needed.") # Placeholder

def get_rag_service(
    vector_store: Any = Depends(lambda: "your_vector_store_instance"), # Dépendance pour le Vector Store
    embedding_service: HuggingFaceService = Depends(get_huggingface_service), # Injecter le service d'embedding
    text_splitter: DocumentSplitter = Depends(get_document_splitter) # Injecter le splitter
) -> RAGService:
    """Fournit une instance du service RAG."""
    # Vous aurez besoin d'une dépendance pour le Vector Store.
    # Assurez-vous que les paramètres (ex: embedding_model_name) sont configurables.
    # rag_service = RAGService(
    #     vector_store=vector_store,
    #     embedding_service=embedding_service,
    #     text_splitter=text_splitter,
    #     embedding_model_name=settings.EMBEDDING_MODEL_NAME # Utiliser les settings
    # )
    # return rag_service
    raise NotImplementedError("RAGService dependency setup is needed (VectorStore missing).") # Placeholder

def get_chat_service(
    llm_client: OpenAICompatibleLLM = Depends(get_openai_compatible_llm),
    vector_store: Any = Depends(lambda: "your_vector_store_instance"), # Pour RAG dans le chat si besoin
    db_session: Session = Depends(get_db_dependency)
) -> ChatService:
    """Fournit une instance du Chat Service."""
    # Injecter les dépendances nécessaires : LLM client, Vector Store (pour RAG), DB session
    # chat_service = ChatService(
    #     llm_client=llm_client,
    #     vector_store=vector_store, # Si le chat utilise RAG
    #     db_session=db_session
    # )
    # return chat_service
    raise NotImplementedError("ChatService dependency setup is needed (VectorStore missing).") # Placeholder

def get_legal_document_service(db_session: Session = Depends(get_db_dependency)) -> LegalDocumentService:
    """Fournit une instance du service de documents légaux."""
    return LegalDocumentService(db_session=db_session)

def get_progress_service(db_session: Session = Depends(get_db_dependency)) -> ProgressService:
    """Fournit une instance du service de suivi de progression."""
    return ProgressService(db_session=db_session)

# Si vous avez un AgentManagerService, définissez sa dépendance ici :
# def get_agent_manager_service(
#     db: Session = Depends(get_db_dependency),
#     llm_client: OpenAICompatibleLLM = Depends(get_openai_compatible_llm),
#     memory_manager: MemoryManager = Depends(get_memory_manager)
# ) -> AgentManagerService:
#     """Fournit une instance du service de gestion des agents."""
#     # return AgentManagerService(db_session=db, llm_client=llm_client, memory_manager=memory_manager)
#     raise NotImplementedError("AgentManagerService dependency setup is needed.")

# Si vous avez un ScanService dédié :
# def get_scan_service(
#     llm_client: OpenAICompatibleLLM = Depends(get_openai_compatible_llm),
#     hf_service: HuggingFaceService = Depends(get_huggingface_service),
#     rag_service: RAGService = Depends(get_rag_service)
# ) -> ScanService:
#     """Fournit une instance du service de scan/génération IA."""
#     # return ScanService(llm_client=llm_client, hf_service=hf_service, rag_service=rag_service)
#     raise NotImplementedError("ScanService dependency setup is needed.")

# --- Dépendances pour les Routeurs Spécifiques ---
# Ces dépendances seront utilisées dans les routeurs pour injecter les services nécessaires.

# La dépendance pour le service de chat
def get_chat_service_for_router(
    chat_service: ChatService = Depends(get_chat_service)
):
    return chat_service

# La dépendance pour le service RAG
def get_rag_service_for_router(
    rag_service: RAGService = Depends(get_rag_service)
):
    return rag_service

# Etc. pour les autres services qui seront utilisés dans les routeurs.