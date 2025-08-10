# /home/manik/skinlensr/SkinLensR/backend/app/api/progress.py

import logging
from typing import List, Optional, Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Importez vos schémas Pydantic pour le suivi de progression
# Assurez-vous que ces schémas existent, idéalement dans app/schemas/progress.py
from app.schemas.progress import (
    ProgressCreate, ProgressResponse, ProgressUpdate
)

# Importez votre service de suivi de progression
# Ce service doit être correctement implémenté dans app/services/progress.py
from app.services.progress import ProgressService

# Importez vos fonctions de dépendance
from app.database import get_db
# Assurez-vous que get_current_user est bien défini dans app/core/dependencies
from app.core.dependencies import get_current_user

# Création d'un APIRouter pour ce module API
router = APIRouter(
    prefix="/progress", # Préfixe pour toutes les routes de ce module
    tags=["User Progress"],
    dependencies=[Depends(get_current_user)] # Sécuriser toutes les routes du module avec authentification utilisateur
)

logger = logging.getLogger(__name__)

# --- Dépendance pour le Service de Progression ---
# Cette fonction doit être définie dans app/core/dependencies.py
# Elle retournera une instance de ProgressService, en injectant la session DB et potentiellement d'autres dépendances.
def get_progress_service(db: Session = Depends(get_db)) -> ProgressService:
    """
    Fournit une instance du service de suivi de progression.
    """
    # Instanciez votre ProgressService ici, en lui passant les dépendances nécessaires.
    # Par exemple, si ProgressService a besoin de la session DB :
    return ProgressService(db_session=db)

# --- Routes pour le Suivi de Progression ---

@router.post("/entries", response_model=ProgressResponse, status_code=status.HTTP_201_CREATED)
async def create_progress_entry_route(
    progress_data: ProgressCreate,
    db: Session = Depends(get_db),
    progress_service: ProgressService = Depends(get_progress_service),
    current_user: Any = Depends(get_current_user) # L'utilisateur authentifié
):
    """
    Crée une nouvelle entrée de progression pour l'utilisateur courant.
    """
    logger.info(f"Creating progress entry for user {current_user.id} - {progress_data.activity_name}")
    
    try:
        new_entry = progress_service.create_progress_entry(
            db=db,
            user_id=current_user.id, # Utiliser l'ID de l'utilisateur authentifié
            activity_name=progress_data.activity_name,
            current_value=progress_data.current_value,
            target_value=progress_data.target_value,
            status=progress_data.status
        )
        
        if not new_entry:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create progress entry.")
            
        logger.info(f"Progress entry created successfully for user {current_user.id}.")
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
        
    except HTTPException as http_exc:
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
    Assure que l'entrée appartient à l'utilisateur courant.
    """
    logger.info(f"Fetching progress entry ID {progress_id} for user {current_user.id}.")
    
    entry = progress_service.get_progress_entry_by_id(db, progress_id=progress_id)
    
    if not entry:
        logger.warning(f"Progress entry not found for ID: {progress_id}.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progress entry not found.")
        
    if entry.user_id != current_user.id:
        logger.warning(f"User {current_user.id} trying to access progress entry {progress_id} belonging to user {entry.user_id}.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this progress entry.")
        
    logger.info(f"Found progress entry ID {progress_id} for user {current_user.id}.")
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
    
    entries = progress_service.get_progress_for_user(db, user_id=current_user.id)
    
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
    progress_update_data: ProgressUpdate, # Utilisez une classe Update si les champs ne sont pas tous requis
    db: Session = Depends(get_db),
    progress_service: ProgressService = Depends(get_progress_service),
    current_user: Any = Depends(get_current_user)
):
    """
    Met à jour une entrée de progression existante pour l'utilisateur courant.
    """
    logger.info(f"Attempting to update progress entry ID {progress_id} for user {current_user.id}.")
    
    # Vérifier d'abord si l'entrée existe et appartient à l'utilisateur
    existing_entry = progress_service.get_progress_entry_by_id(db, progress_id=progress_id)
    
    if not existing_entry:
        logger.warning(f"Progress entry not found for update ID: {progress_id}.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progress entry not found.")
        
    if existing_entry.user_id != current_user.id:
        logger.warning(f"User {current_user.id} trying to update progress entry {progress_id} belonging to user {existing_entry.user_id}.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to update this progress entry.")
        
    updated_entry = progress_service.update_progress(
        db=db,
        progress_id=progress_id,
        current_value=progress_update_data.current_value,
        target_value=progress_update_data.target_value,
        status=progress_update_data.status
    )
    
    if not updated_entry:
        logger.error(f"Failed to update progress entry ID {progress_id} for user {current_user.id}.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update progress entry.")
        
    logger.info(f"Progress entry ID {progress_id} updated successfully for user {current_user.id}.")
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
        
    deleted_entry = progress_service.delete_progress(db, progress_id=progress_id)
    
    if not deleted_entry:
        logger.error(f"Failed to delete progress entry ID {progress_id} for user {current_user.id}.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete progress entry.")
        
    logger.info(f"Progress entry ID {progress_id} deleted successfully for user {current_user.id}.")
    # Retourner le document supprimé pour confirmation
    return ProgressResponse(
        id=deleted_entry.id,
        user_id=deleted_entry.user_id,
        activity_name=deleted_entry.activity_name,
        current_value=deleted_entry.current_value,
        target_value=deleted_entry.target_value,
        status=deleted_entry.status,
        timestamp=deleted_entry.timestamp
    )