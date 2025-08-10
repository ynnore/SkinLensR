# /home/manik/skinlensr/SkinLensR/backend/app/routers/progress.py

import logging
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Importez vos schémas Pydantic pour le suivi de progression
# Assurez-vous qu'ils sont bien définis dans app/schemas/progress.py et exposés par app/schemas/__init__.py
from app.schemas.progress import (
    ProgressCreate, ProgressResponse, ProgressUpdate
)

# Importez votre service de suivi de progression
# Assurez-vous que ProgressService est implémenté dans app/services/progress.py
from app.services.progress import ProgressService

# Importez vos fonctions de dépendance
from app.database import get_db
# Dépendance pour obtenir l'utilisateur courant (pour la sécurité et pour associer la progression)
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/progress", # Préfixe pour toutes les routes liées au suivi de progression
    tags=["User Progress"],
    dependencies=[Depends(get_current_user)] # Sécurise toutes les routes de ce routeur
)

logger = logging.getLogger(__name__)

# --- Dépendance pour le Service de Progression ---
# Cette fonction doit être définie dans app/core/dependencies.py pour fournir une instance du service.
def get_progress_service(db: Session = Depends(get_db)) -> ProgressService:
    """
    Fournit une instance du service de suivi de progression, injectant la session DB.
    """
    # Si votre ProgressService a d'autres dépendances (ex: VectorStore pour des analyses complexes),
    # elles seraient injectées ici aussi.
    return ProgressService(db_session=db)

# --- Routes pour le Suivi de Progression ---

@router.post("/entries", response_model=ProgressResponse, status_code=status.HTTP_201_CREATED)
async def create_progress_entry_route(
    progress_data: ProgressCreate,
    db: Session = Depends(get_db),
    progress_service: ProgressService = Depends(get_progress_service),
    current_user: Any = Depends(get_current_user) # L'utilisateur authentifié dont on enregistre la progression
):
    """
    Crée une nouvelle entrée de suivi de progression pour l'utilisateur courant.
    """
    logger.info(f"Creating progress entry for user {current_user.id} - Activity: '{progress_data.activity_name}'")
    
    try:
        # Créer l'entrée de progression en utilisant le service
        new_entry = progress_service.create_progress_entry(
            db=db,
            user_id=current_user.id, # Associer la progression à l'utilisateur authentifié
            activity_name=progress_data.activity_name,
            current_value=progress_data.current_value,
            target_value=progress_data.target_value,
            status=progress_data.status
        )
        
        if not new_entry: # Si le service a retourné None (probablement une erreur DB)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create progress entry.")
            
        logger.info(f"Progress entry created successfully: ID={new_entry.id}, UserID={current_user.id}.")
        # Retourner le schéma Pydantic de la réponse
        return ProgressResponse(
            id=new_entry.id,
            user_id=new_entry.user_id,
            activity_name=new_entry.activity_name,
            current_value=new_entry.current_value,
            target_value=new_entry.target_value,
            status=new_entry.status,
            timestamp=new_entry.timestamp
        )
        
    except HTTPException as http_exc: # Relayer les erreurs HTTP levées par le service ou les dépendances
        raise http_exc
    except Exception as e:
        logger.error(f"Unexpected error creating progress entry for user {current_user.id}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {e}")


@router.get("/entries/{progress_id}", response_model=ProgressResponse)
async def get_progress_entry_by_id_route(
    progress_id: int,
    db: Session = Depends(get_db),
    progress_service: ProgressService = Depends(get_progress_service),
    current_user: Any = Depends(get_current_user)
):
    """
    Récupère une entrée de progression spécifique par son ID.
    Vérifie que l'entrée appartient à l'utilisateur courant.
    """
    logger.info(f"Fetching progress entry ID {progress_id} for user {current_user.id}.")
    
    entry = progress_service.get_progress_entry_by_id(db, progress_id=progress_id)
    
    if not entry:
        logger.warning(f"Progress entry not found for ID: {progress_id}.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progress entry not found.")
        
    # Sécurité : Vérifier que l'entrée appartient bien à l'utilisateur courant
    if entry.user_id != current_user.id:
        logger.warning(f"User {current_user.id} trying to access progress entry {progress_id} belonging to user {entry.user_id}.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this progress entry.")
        
    logger.info(f"Found progress entry ID {progress_id} for user {current_user.id}.")
    # Mapper le modèle SQLAlchemy à la réponse Pydantic
    return ProgressResponse(
        id=entry.id,
        user_id=entry.user_id,
        activity_name=entry.activity_name,
        current_value=entry.current_value,
        target_value=entry.target_value,
        status=entry.status,
        timestamp=entry.timestamp
    )

@router.get("/entries", response_model=List[ProgressResponse])
async def get_user_progress_route(
    db: Session = Depends(get_db),
    progress_service: ProgressService = Depends(get_progress_service),
    current_user: Any = Depends(get_current_user)
):
    """
    Récupère toutes les entrées de progression pour l'utilisateur courant.
    """
    logger.info(f"Fetching all progress entries for user {current_user.id}.")
    
    # Obtenir les entrées de progression pour l'utilisateur courant via le service
    entries = progress_service.get_progress_for_user(db, user_id=current_user.id)
    
    # Mapper les modèles SQLAlchemy à vos schémas Pydantic ProgressResponse
    response_entries = [
        ProgressResponse(
            id=entry.id,
            user_id=entry.user_id,
            activity_name=entry.activity_name,
            current_value=entry.current_value,
            target_value=entry.target_value,
            status=entry.status,
            timestamp=entry.timestamp
        )
        for entry in entries
    ]
    
    logger.info(f"Found {len(response_entries)} progress entries for user {current_user.id}.")
    return response_entries

@router.put("/entries/{progress_id}", response_model=ProgressResponse)
async def update_progress_entry_route(
    progress_id: int,
    progress_update_data: ProgressUpdate, # Utiliser le schéma pour les données de mise à jour
    db: Session = Depends(get_db),
    progress_service: ProgressService = Depends(get_progress_service),
    current_user: Any = Depends(get_current_user)
):
    """
    Met à jour une entrée de progression existante pour l'utilisateur courant.
    """
    logger.info(f"Attempting to update progress entry ID {progress_id} for user {current_user.id}.")
    
    # Récupérer d'abord l'entrée pour vérifier l'existence et l'appartenance à l'utilisateur
    existing_entry = progress_service.get_progress_entry_by_id(db, progress_id=progress_id)
    
    if not existing_entry:
        logger.warning(f"Progress entry not found for update ID: {progress_id}.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progress entry not found.")
        
    if existing_entry.user_id != current_user.id:
        logger.warning(f"User {current_user.id} trying to update progress entry {progress_id} belonging to user {existing_entry.user_id}.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to update this progress entry.")
        
    # Appeler le service pour effectuer la mise à jour
    updated_entry = progress_service.update_progress(
        db=db,
        progress_id=progress_id,
        current_value=progress_update_data.current_value,
        target_value=progress_update_data.target_value,
        status=progress_update_data.status
    )
    
    if not updated_entry: # Si la mise à jour a échoué (ex: erreur DB)
        logger.error(f"Failed to update progress entry ID {progress_id} for user {current_user.id}.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update progress entry.")
        
    logger.info(f"Progress entry ID {progress_id} updated successfully for user {current_user.id}.")
    # Retourner le schéma de réponse de l'entrée mise à jour
    return ProgressResponse(
        id=updated_entry.id,
        user_id=updated_entry.user_id,
        activity_name=updated_entry.activity_name,
        current_value=updated_entry.current_value,
        target_value=updated_entry.target_value,
        status=updated_entry.status,
        timestamp=updated_entry.timestamp
    )

@router.delete("/entries/{progress_id}", response_model=ProgressResponse)
async def delete_progress_entry_route(
    progress_id: int,
    db: Session = Depends(get_db),
    progress_service: ProgressService = Depends(get_progress_service),
    current_user: Any = Depends(get_current_user)
):
    """
    Supprime une entrée de progression par son ID.
    Assure que l'entrée appartient à l'utilisateur courant.
    """
    logger.info(f"Attempting to delete progress entry ID {progress_id} for user {current_user.id}.")
    
    # Vérifier d'abord si l'entrée existe et appartient à l'utilisateur
    existing_entry = progress_service.get_progress_entry_by_id(db, progress_id=progress_id)
    
    if not existing_entry:
        logger.warning(f"Progress entry not found for deletion ID: {progress_id}.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progress entry not found.")
        
    if existing_entry.user_id != current_user.id:
        logger.warning(f"User {current_user.id} trying to delete progress entry {progress_id} belonging to user {existing_entry.user_id}.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to delete this progress entry.")
        
    # Appeler le service pour supprimer l'entrée
    deleted_entry = progress_service.delete_progress(db, progress_id=progress_id)
    
    if not deleted_entry: # Si la suppression a échoué (ex: erreur DB)
        logger.error(f"Failed to delete progress entry ID {progress_id} for user {current_user.id}.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete progress entry.")
        
    logger.info(f"Progress entry ID {deleted_entry.id} deleted successfully for user {current_user.id}.")
    # Retourner le document supprimé peut être utile pour confirmation
    return ProgressResponse(
        id=deleted_entry.id,
        user_id=deleted_entry.user_id,
        activity_name=deleted_entry.activity_name,
        current_value=deleted_entry.current_value,
        target_value=deleted_entry.target_value,
        status=deleted_entry.status,
        timestamp=deleted_entry.timestamp
    )