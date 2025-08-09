from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db_session, get_current_active_user
from app.schemas.progress import ProgressRead, ProgressUpdate
from app.crud.progress import get_progress_by_user, update_progress_for_user

router = APIRouter()

@router.get("/me", response_model=ProgressRead)
def read_progress(db: Session = Depends(get_db_session), current_user = Depends(get_current_active_user)):
    return get_progress_by_user(db, current_user.id)

@router.put("/me")
def update_progress(progress_update: ProgressUpdate, db: Session = Depends(get_db_session), current_user = Depends(get_current_active_user)):
    updated = update_progress_for_user(db, current_user.id, progress_update)
    return {"updated": updated}
