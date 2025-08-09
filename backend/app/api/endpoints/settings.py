from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db_session, get_current_active_user
from app.schemas.settings import SettingsRead, SettingsUpdate
from app.crud.settings import get_settings_for_user, update_settings_for_user

router = APIRouter()

@router.get("/me", response_model=SettingsRead)
def read_settings(db: Session = Depends(get_db_session), current_user = Depends(get_current_active_user)):
    return get_settings_for_user(db, current_user.id)

@router.put("/me")
def update_settings(settings_update: SettingsUpdate, db: Session = Depends(get_db_session), current_user = Depends(get_current_active_user)):
    updated = update_settings_for_user(db, current_user.id, settings_update)
    return {"updated": updated}