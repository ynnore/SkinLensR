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
    get_progress_for_user,
    create_progress_entry,
    update_progress,
    get_progress_for_user,  # si tu veux une fonction alias, sinon enlève le doublon
)

router = APIRouter()

@router.get("/", response_model=List[ProgressResponse], summary="Lister toutes les progressions de l'utilisateur")
def list_progress(db: Session = Depends(get_db_session), current_user=Depends(get_current_active_user)):
    progress_list = list_all_progress_for_user(db, current_user.id)
    return progress_list

@router.get("/{progress_id}", response_model=ProgressResponse, summary="Lire une progression spécifique")
def read_progress(progress_id: int, db: Session = Depends(get_db_session), current_user=Depends(get_current_active_user)):
    progress = get_user_progress(db, progress_id, current_user.id)
    if not progress:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progression non trouvée")
    return progress

@router.post("/", response_model=ProgressResponse, status_code=status.HTTP_201_CREATED, summary="Créer une nouvelle progression")
def create_progress(progress_data: ProgressCreate, db: Session = Depends(get_db_session), current_user=Depends(get_current_active_user)):
    new_progress = create_progress_entry(db, current_user.id, progress_data)
    return new_progress

@router.put("/{progress_id}", response_model=ProgressResponse, summary="Mettre à jour une progression existante")
def update_progress(progress_id: int, progress_data: ProgressUpdate, db: Session = Depends(get_db_session), current_user=Depends(get_current_active_user)):
    updated_progress = update_progress_entry(db, progress_id, current_user.id, progress_data)
    if not updated_progress:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progression non trouvée ou accès refusé")
    return updated_progress
