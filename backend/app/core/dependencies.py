"""
Ce module centralise toutes les fonctions de dépendance FastAPI.
Il fournit des instances des services et autres ressources nécessaires aux routeurs et à l'application.
"""

import logging
from typing import Optional, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

# --- Imports Clés ---
from app.database import get_db
from app.schemas.user import UserResponse

# Services
from app.services.chat_service import ChatService
from app.services.huggingface import HuggingFaceService
from app.services.openai_compatible_llm import OpenAICompatibleLLM
from app.services.rag import RAGService
from app.services.memory_manager import MemoryManager
from app.services.progress import ProgressService
from app.services.legal_documents import LegalDocumentService
from app.text_splitter import DocumentSplitter
from app.config import settings

# CRUD
from app.crud.user import get_user_by_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
logger = logging.getLogger(__name__)

# -------------------
# Dépendances générales
# -------------------

def get_db_dependency() -> Session:
    """Dépendance FastAPI pour obtenir une session de base de données."""
    db_session = next(get_db())
    try:
        yield db_session
    finally:
        db_session.close()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db_dependency)
) -> Optional[UserResponse]:
    """Récupère l'utilisateur courant à partir du token JWT."""
    from app.auth.auth_main import auth_main as auth

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = auth.decode_access_token(token)
    if not payload or payload.get("sub") is None:
        raise credentials_exception

    email: str = payload["sub"]
    user_model = get_user_by_email(db, email=email)

    if user_model is None:
        raise credentials_exception

    # Supposons que UserResponse est compatible avec votre modèle User
    return UserResponse.from_orm(user_model)

async def get_current_active_user(
    current_user: UserResponse = Depends(get_current_user)
):
    """Vérifie si l'utilisateur courant est actif."""
    # Note: Assurez-vous que votre schéma UserResponse contient un champ 'status' ou adaptez la logique
    # if getattr(current_user, "status", "active") == "inactive":
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user

def get_current_admin_user(
    current_user: UserResponse = Depends(get_current_active_user)
) -> UserResponse:
    """Vérifie si l'utilisateur courant est un administrateur."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions (Admin required)",
        )
    return current_user

def get_current_user_dependency(
    current_user: UserResponse = Depends(get_current_active_user)
) -> UserResponse:
    """Alias pour get_current_active_user, utilisé dans les routeurs."""
    logger.debug("Providing get_current_user_dependency alias.")
    return current_user

# -------------------
# Dépendances Services
# -------------------

def get_document_splitter() -> DocumentSplitter:
    return DocumentSplitter(
        chunk_size=getattr(settings, 'DOCUMENT_CHUNK_SIZE', 1000),
        chunk_overlap=getattr(settings, 'DOCUMENT_CHUNK_OVERLAP', 200)
    )

def get_huggingface_service() -> HuggingFaceService:
    return HuggingFaceService()

def get_openai_compatible_llm() -> OpenAICompatibleLLM:
    # Cette fonction reste utile si d'autres parties de votre code utilisent un LLM générique
    return OpenAICompatibleLLM(
        api_key=settings.OPENAI_API_KEY,
        base_url=settings.LOCAL_LLM_BASE_URL,
        model_name=settings.LLM_MODEL_NAME
    )

def get_memory_manager(db_session: Session = Depends(get_db_dependency)) -> MemoryManager:
    raise NotImplementedError("MemoryManager dependency setup is needed.")

def get_rag_service(
    vector_store: Any = Depends(lambda: "your_vector_store_instance"), # Placeholder
    embedding_service: HuggingFaceService = Depends(get_huggingface_service),
    text_splitter: DocumentSplitter = Depends(get_document_splitter)
) -> RAGService:
    raise NotImplementedError("RAGService dependency setup is needed (VectorStore missing).")

# ##################################################################
# ###                MODIFICATION PRINCIPALE ICI                 ###
# ##################################################################

def get_chat_service(
    db_session: Session = Depends(get_db_dependency),
    # Pour la démo, on passe un placeholder pour le vector_store. Vous devrez le remplacer
    # par une vraie dépendance quand votre Vector Store sera prêt.
    vector_store: Any = Depends(lambda: None) 
) -> ChatService:
    """
    Fournit une instance de ChatService.
    Le client LLM est maintenant configuré directement à l'intérieur de ChatService
    pour communiquer avec le NIM déployé.
    """
    # On initialise le service sans le llm_client, comme nous l'avons corrigé.
    return ChatService(db_session=db_session, vector_store=vector_store)

# ##################################################################
# ###                   FIN DE LA MODIFICATION                   ###
# ##################################################################


def get_legal_document_service(db_session: Session = Depends(get_db_dependency)) -> LegalDocumentService:
    return LegalDocumentService(db_session=db_session)

def get_progress_service(db_session: Session = Depends(get_db_dependency)) -> ProgressService:
    return ProgressService(db_session=db_session)

def get_file_storage_path() -> str:
    """Retourne le chemin où stocker les fichiers uploadés."""
    return "/tmp/uploads"

# -------------------
# Aliases pour routeurs
# -------------------

# Cet alias va maintenant utiliser la fonction get_chat_service corrigée
def get_chat_service_for_router(chat_service: ChatService = Depends(get_chat_service)):
    return chat_service

def get_rag_service_for_router(rag_service: RAGService = Depends(get_rag_service)):
    return rag_service