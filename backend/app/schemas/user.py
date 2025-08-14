# backend/app/schemas/user.py

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, field_validator, model_validator


# --- Schémas Pydantic pour les Utilisateurs ---

class UserBase(BaseModel):
    """Modèle de base pour les données utilisateur."""
    email: EmailStr = Field(..., example="test@example.com")
    role: str = Field(default="user", example="user", description="Rôle de l'utilisateur (user/admin)")


class UserCreate(UserBase):
    """Schéma pour la création d'un nouvel utilisateur."""
    password: str = Field(..., min_length=8, max_length=128, example="SecurePassword123!")
    password_confirm: str = Field(..., min_length=8, max_length=128, example="SecurePassword123!")
    full_name: Optional[str] = Field(None, example="Ronny Dupont")  # <-- ajouté

    @field_validator("password_confirm")
    def passwords_match(cls, v, info):
        if "password" in info.data and info.data["password"] != v:
            raise ValueError("Passwords do not match")
        return v



class UserUpdate(BaseModel):
    """Schéma pour mettre à jour un utilisateur."""
    password: Optional[str] = Field(None, min_length=8, max_length=128, description="Nouveau mot de passe.")
    password_confirm: Optional[str] = Field(None, min_length=8, max_length=128, description="Confirmation du mot de passe.")
    role: Optional[str] = Field(None, example="admin", description="Nouveau rôle (e.g., admin).")

    @field_validator("password_confirm")
    def passwords_match_on_update(cls, v, info):
        """Valide la correspondance des mots de passe lors de la mise à jour."""
        if v is not None and info.data.get("password") is not None and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v

    @model_validator(mode="before")
    def check_at_least_one_field(cls, data):
        """Vérifie qu'au moins un champ est fourni pour la mise à jour."""
        if all(data.get(f) is None for f in ['password', 'password_confirm', 'role']):
            raise ValueError("At least one field must be provided for update.")
        return data


class UserResponse(UserBase):
    """Schéma pour la réponse API décrivant un utilisateur."""
    id: int = Field(..., example=1)
    created_at: datetime = Field(...)
    updated_at: datetime = Field(...)

    model_config = {
        "from_attributes": True,
        "json_encoders": {datetime: lambda v: v.isoformat()}
    }


class UserRead(UserBase):
    """Schéma pour lecture publique d'un utilisateur."""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
        "json_encoders": {datetime: lambda v: v.isoformat()}
    }
