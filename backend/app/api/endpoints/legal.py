# /home/manik/skinlensr/SkinLensR/backend/app/api/endpoints/progress.py
"""
Endpoints FastAPI pour gérer la progression utilisateur.
Peut inclure : lecture, mise à jour, liste des progrès, etc.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api.dependencies import get_db_session, get_current_active_user
from app.schemas.progress import ProgressResponse, ProgressUpdate, ProgressCreate
from app.crud.progress import (
    create_progress_entry,
    get_progress_entry_by_id,
    get_user_progress,
    update_progress,  # Correct import
    delete_progress,
)

router = APIRouter()

@router.get("/", response_model=List[ProgressResponse], summary="Lister toutes les progressions de l'utilisateur")
def list_progress(db: Session = Depends(get_db_session), current_user=Depends(get_current_active_user)):
    progress_list = get_user_progress(db, current_user.id)
    return progress_list

@router.get("/{progress_id}", response_model=ProgressResponse, summary="Lire une progression spécifique")
def read_progress(progress_id: int, db: Session = Depends(get_db_session), current_user=Depends(get_current_active_user)):
    progress = get_progress_entry_by_id(db, progress_id)
    if not progress or progress.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progression non trouvée")
    return progress

@router.post("/", response_model=ProgressResponse, status_code=status.HTTP_201_CREATED, summary="Créer une nouvelle progression")
def create_progress(progress_data: ProgressCreate, db: Session = Depends(get_db_session), current_user=Depends(get_current_active_user)):
    new_progress = create_progress_entry(
        db,
        user_id=current_user.id,
        activity_name=progress_data.activity_name,
        current_value=progress_data.current_value,
        target_value=progress_data.target_value,
        status=progress_data.status,
    )
    if not new_progress:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur lors de la création de la progression")
    return new_progress

@router.put("/{progress_id}", response_model=ProgressResponse, summary="Mettre à jour une progression existante")
def update_progress_endpoint(progress_id: int, progress_data: ProgressUpdate, db: Session = Depends(get_db_session), current_user=Depends(get_current_active_user)):
    existing_progress = get_progress_entry_by_id(db, progress_id)
    if not existing_progress or existing_progress.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progression non trouvée ou accès refusé")

    updated_progress = update_progress(
        db,
        progress_id,
        current_value=progress_data.current_value,
        target_value=progress_data.target_value,
        status=progress_data.status,
    )
    if not updated_progress:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur lors de la mise à jour de la progression")
    return updated_progress

@router.delete("/{progress_id}", response_model=ProgressResponse, summary="Supprimer une progression")
def delete_progress_endpoint(progress_id: int, db: Session = Depends(get_db_session), current_user=Depends(get_current_active_user)):
    existing_progress = get_progress_entry_by_id(db, progress_id)
    if not existing_progress or existing_progress.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progression non trouvée ou accès refusé")

    deleted_progress = delete_progress(db, progress_id)
    if not deleted_progress:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur lors de la suppression de la progression")
    return deleted_progress
