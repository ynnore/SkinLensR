# /home/manik/skinlensr/SkinLensR/backend/app/routers/progress.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db

# Création d'un routeur FastAPI pour les routes de progression
router = APIRouter()

# Route pour créer un suivi de progression
@router.post("/progress/")
def create_progress(
    user_id: int, step: str, completed: int, db: Session = Depends(get_db)
):
    db_progress = crud.create_progress(db, user_id, step, completed)
    if db_progress:
        return db_progress
    raise HTTPException(status_code=400, detail="Error creating progress.")

# Route pour obtenir la progression d'un utilisateur
@router.get("/progress/{user_id}")
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    progress = crud.get_progress_by_user_id(db, user_id)
    if progress:
        return progress
    raise HTTPException(status_code=404, detail="Progress not found.")

# Route pour mettre à jour un suivi de progression
@router.put("/progress/{progress_id}")
def update_user_progress(progress_id: int, completed: int, db: Session = Depends(get_db)):
    db_progress = crud.update_progress(db, progress_id, completed)
    if db_progress:
        return db_progress
    raise HTTPException(status_code=404, detail="Progress not found.")

# Route pour supprimer un suivi de progression
@router.delete("/progress/{progress_id}")
def delete_user_progress(progress_id: int, db: Session = Depends(get_db)):
    db_progress = crud.delete_progress(db, progress_id)
    if db_progress:
        return db_progress
    raise HTTPException(status_code=404, detail="Progress not found.")
