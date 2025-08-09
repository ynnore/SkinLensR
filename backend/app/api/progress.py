from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.progress import Progress
from app.models.user import User
from app.schemas.progress import ProgressCreate, ProgressRead, ProgressUpdate
from app.api.auth import get_current_user  # dépendance pour récupérer l'utilisateur connecté

router = APIRouter()

@router.get("/", response_model=ProgressRead)
def read_progress(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    progress = db.query(Progress).filter(Progress.user_id == current_user.id).first()
    if not progress:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progression non trouvée")
    return progress

@router.post("/", response_model=ProgressRead, status_code=status.HTTP_201_CREATED)
def create_progress(progress_in: ProgressCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Progress).filter(Progress.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Progression déjà existante")
    new_progress = Progress(**progress_in.dict(), user_id=current_user.id)
    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)
    return new_progress

@router.put("/", response_model=ProgressRead)
def update_progress(progress_in: ProgressUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    progress = db.query(Progress).filter(Progress.user_id == current_user.id).first()
    if not progress:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progression non trouvée")
    for key, value in progress_in.dict(exclude_unset=True).items():
        setattr(progress, key, value)
    db.commit()
    db.refresh(progress)
    return progress

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def delete_progress(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    progress = db.query(Progress).filter(Progress.user_id == current_user.id).first()
    if not progress:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progression non trouvée")
    db.delete(progress)
    db.commit()
