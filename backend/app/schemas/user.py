# /home/manik/skinlensr/SkinLensR/backend/app/schemas/user.py
"""
Ce module définit les schémas Pydantic pour les utilisateurs.
Ils sont utilisés pour la validation des données entrantes (API requests)
et la sérialisation des données sortantes (API responses).
"""

import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, EmailStr, validator

# --- Schémas Pydantic pour les Utilisateurs ---

class UserBase(BaseModel):
    """Modèle de base pour les données utilisateur."""
    email: EmailStr = Field(..., example="test@example.com")
    # Le mot de passe n'est pas inclus ici car il est sensible et géré séparément (haché).
    role: str = Field("user", example="user", description="Rôle de l'utilisateur (ex: user, admin)") # Défaut 'user'

class UserCreate(UserBase):
    """Schéma pour la création d'un nouvel utilisateur."""
    password: str = Field(..., min_length=8, example="securepassword123")
    password_confirm: str = Field(..., example="securepassword123") # Pour la confirmation du mot de passe

    # Validateur pour s'assurer que les mots de passe correspondent lors de la création
    @validator("password_confirm")
    def passwords_match(cls, v, values):
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v

class UserUpdate(BaseModel):
    """Schéma pour la mise à jour des informations utilisateur."""
    # Les champs sont optionnels car un utilisateur peut vouloir ne mettre à jour qu'un seul champ.
    # L'email est généralement non modifiable pour des raisons de sécurité et d'unicité.
    
    password: Optional[str] = Field(None, min_length=8, description="Nouveau mot de passe.")
    password_confirm: Optional[str] = Field(None, description="Confirmation du nouveau mot de passe.")
    role: Optional[str] = Field(None, example="admin", description="Nouveau rôle pour l'utilisateur (ex: admin).")

    # Validateur pour s'assurer que les mots de passe correspondent si les deux sont fournis
    @validator("password_confirm")
    def passwords_match_on_update(cls, v, values):
        # Vérifie que si le nouveau mot de passe est fourni, sa confirmation est aussi là et correspond.
        if v is not None and "password" in values and values["password"] is not None and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v

    # Validateur pour s'assurer qu'au moins un champ modifiable est fourni
    # Ceci évite les requêtes PUT vides.
    @validator('password', 'password_confirm', 'role', pre=True, always=True)
    def check_at_least_one_field(cls, v, values, **kwargs):
        # Cette vérification doit s'appliquer aux champs qui peuvent effectivement être mis à jour.
        # On s'assure qu'au moins un champ modifiable est présent (non None).
        
        # Liste des champs qui peuvent être mis à jour
        updatable_fields = ['password', 'password_confirm', 'role']
        
        # Si la valeur courante 'v' est None (cela arrive pour le champ en cours de validation),
        # il faut vérifier si les AUTRES champs modifiables ont une valeur.
        # On s'assure qu'au moins un des champs modifiables a une valeur non-None.
        if not any(values.get(field) is not None for field in updatable_fields):
            raise ValueError("At least one field must be provided for update.")
        return v

class UserResponse(UserBase):
    """Schéma pour la réponse API décrivant un utilisateur."""
    id: int = Field(..., example=1) # ID unique de l'utilisateur dans la base de données
    # email et role sont hérités de UserBase
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        # orm_mode = True # Utile si vous mappez directement depuis des modèles SQLAlchemy
        json_encoders = {
            datetime: lambda v: v.isoformat() # Convertit datetime en string ISO pour JSON
        }

# --- Schéma pour le Token d'Authentification ---
# Il est souvent placé dans auth.py, mais si vous le centralisez ici, gardez-le.
# Si vous l'avez déplacé vers auth.py, supprimez-le d'ici.
# Supposons pour l'instant qu'il est déjà géré et importé correctement ailleurs (ex: auth.py, et exposé par __init__)

# Si vous l'aviez dans le fichier schemas.py et l'avez déplacé dans auth.py,
# assurez-vous qu'il est importé dans app/schemas/__init__.py depuis .auth.
# S'il était seulement dans user.py ou schemas.py, et que vous voulez qu'il soit ici :
# from .auth import Token # Si Token est dans auth.py et que vous voulez le centraliser ici
# __all__.append("Token") # L'ajouter à __all__