# /home/manik/skinlensr/SkinLensR/backend/app/schemas/user.py

import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, EmailStr, validator

# --- Schémas Pydantic pour les Utilisateurs ---

class UserBase(BaseModel):
    """Modèle de base pour les données utilisateur."""
    email: EmailStr = Field(..., example="test@example.com")
    # Le mot de passe ne doit pas être inclus ici, car il est sensible et géré séparément
    # Le rôle est généralement défini à la création ou géré par le système
    role: str = Field("user", example="user") # Défaut 'user', peut être 'admin'

class UserCreate(UserBase):
    """Schéma pour la création d'un nouvel utilisateur."""
    password: str = Field(..., min_length=8, example="securepassword123")
    password_confirm: str = Field(..., example="securepassword123") # Pour la confirmation du mot de passe

    # Validateur pour s'assurer que les mots de passe correspondent
    @validator("password_confirm")
    def passwords_match(cls, v, values):
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v

class UserUpdate(BaseModel):
    """Schéma pour la mise à jour des informations utilisateur (ex: mot de passe, rôle)."""
    # L'email ne devrait normalement pas être modifiable facilement
    # current_password: Optional[str] = Field(None, description="Current password for verification.") # Si changement de mot de passe
    password: Optional[str] = Field(None, min_length=8, description="New password.")
    password_confirm: Optional[str] = Field(None, description="Confirm new password.")
    role: Optional[str] = Field(None, example="admin", description="New role for the user (e.g., admin).")

    # Validateur pour s'assurer que les mots de passe correspondent si les deux sont fournis
    @validator("password_confirm")
    def passwords_match_on_update(cls, v, values):
        if v is not None and "password" in values and values["password"] is not None and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v

    # Validateur pour s'assurer qu'au moins un champ est fourni pour la mise à jour
    @validator('password', 'password_confirm', 'role', pre=True, always=True)
    def check_at_least_one_field(cls, v, v