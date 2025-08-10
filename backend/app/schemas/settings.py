# app/schemas/settings.py
from typing import Optional
from pydantic import BaseModel

class UserSettings(BaseModel):
    # Ajoute ici les champs que tu souhaites pour les paramètres utilisateur
    theme: str = "light"
    notifications_enabled: bool = True

    class Config:
        from_attributes = True  # équivalent orm_mode en Pydantic v2

class UserSettingsUpdate(BaseModel):
    theme: Optional[str] = None
    notifications_enabled: Optional[bool] = None
