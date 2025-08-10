# /home/manik/skinlensr/SkinLensR/backend/app/schemas/progress.py

import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, validator

# --- Schémas pour le Suivi de Progression ---

class ProgressBase(BaseModel):
    """Modèle de base pour les données de progression."""
    activity_name: str = Field(..., example="Completing Module 1") # Nom de l'activité suivie
    current_value: float = Field(..., example=50.5) # Valeur actuelle (ex: pourcentage, points)
    target_value: Optional[float] = Field(None, example=100.0) # Valeur cible optionnelle
    status: str = Field(..., example="in_progress") # Statut de l'activité (ex: "in_progress", "completed", "paused")

class ProgressCreate(ProgressBase):
    """Schéma pour la création d'une nouvelle entrée de progression."""
    # user_id est injecté via le contexte de l'utilisateur authentifié,
    # donc il n'a pas besoin d'être dans le schéma de création s'il n'est pas fourni par le client.
    pass

class ProgressUpdate(BaseModel):
    """Schéma pour la mise à jour d'une entrée de progression existante."""
    current_value: Optional[float] = Field(None, example=75.0)
    target_value: Optional[float] = Field(None, example=100.0)
    status: Optional[str] = Field(None, example="completed")

    # Validateur pour s'assurer qu'au moins un champ est fourni pour la mise à jour
    @validator('current_value', 'target_value', 'status', pre=True, always=True)
    def check_at_least_one_field(cls, v, values, **kwargs):
        if not any(values.values()): # Vérifie si tous les champs sont None
            raise ValueError("At least one field must be provided for update.")
        return v

class ProgressResponse(ProgressBase):
    """Schéma pour la réponse API décrivant une entrée de progression."""
    id: int = Field(..., example=1) # ID unique de l'entrée dans la base de données
    user_id: int = Field(..., example=1) # L'ID de l'utilisateur associé à cette progression
    timestamp: datetime = Field(default_factory=datetime.utcnow) # Quand l'entrée a été enregistrée ou mise à jour

    class Config:
        orm_mode = True # Permet le mappage depuis des modèles SQLAlchemy si nécessaire
        json_encoders = {
            datetime: lambda v: v.isoformat() # Pour convertir datetime en string ISO pour JSON
        }