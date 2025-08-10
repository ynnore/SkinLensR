# /home/manik/skinlensr/SkinLensR/backend/app/api/endpoints/settings.py
# Endpoints FastAPI pour gérer les paramètres utilisateur

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.api.dependencies import get_db_session, get_current_active_user
from app.schemas.settings import UserSettings, UserSettingsUpdate
from app.crud.settings import get_user_settings, update_user_settings

router = APIRouter()

@router.get("/", response_model=UserSettings, summary="Récupérer les paramètres de l'utilisateur connecté")
def read_user_settings(
    db: Session = Depends(get_db_session),
    current_user = Depends(get_current_active_user)
):
    settings = get_user_settings(db, current_user.id)
    if not settings:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Settings not found")
    return settings

@router.put("/", response_model=UserSettings, summary="Mettre à jour les paramètres de l'utilisateur")
def update_settings(
    settings_update: UserSettingsUpdate,
    db: Session = Depends(get_db_session),
    current_user = Depends(get_current_active_user)
):
    updated_settings = update_user_settings(db, current_user.id, settings_update)
    if not updated_settings:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to update settings")
    return updated_settings
