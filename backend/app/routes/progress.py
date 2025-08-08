from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db
from pydantic import BaseModel

router = APIRouter()

# Modèles Pydantic pour validation des données
class ProgressCreate(BaseModel):
    user_id: int
    step: str
    completed: int

class ProgressUpdate(BaseModel):
    completed: int

# Route pour créer un suivi de progression
@router.post("/progress/", response_model=schemas.Progress)
def create_progress(progress: ProgressCreate, db: Session = Depends(get_db)):
    """
    Crée une nouvelle entrée de progression pour un utilisateur.
    """
    db_progress = crud.create_progress(db, progress.user_id, progress.step, progress.completed)
    if db_progress:
        return db_progress
    raise HTTPException(status_code=400, detail="Error creating progress.")

# Route pour obtenir la progression d'un utilisateur
@router.get("/progress/{user_id}", response_model=list[schemas.Progress])
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    """
    Récupère la liste des progrès pour un utilisateur donné.
    """
    progress = crud.get_progress_by_user_id(db, user_id)
    if progress:
        return progress
    raise HTTPException(status_code=404, detail="Progress not found.")

# Route pour mettre à jour un suivi de progression
@router.put("/progress/{progress_id}", response_model=schemas.Progress)
def update_user_progress(progress_id: int, progress_update: ProgressUpdate, db: Session = Depends(get_db)):
    """
    Met à jour l'état 'completed' d'un suivi de progression existant.
    """
    db_progress = crud.update_progress(db, progress_id, progress_update.completed)
    if db_progress:
        return db_progress
    raise HTTPException(status_code=404, detail="Progress not found.")

# Route pour supprimer un suivi de progression
@router.delete("/progress/{progress_id}", response_model=schemas.Progress)
def delete_user_progress(progress_id: int, db: Session = Depends(get_db)):
    """
    Supprime un suivi de progression par son ID.
    """
    db_progress = crud.delete_progress(db, progress_id)
    if db_progress:
        return db_progress
    raise HTTPException(status_code=404, detail="Progress not found.")
