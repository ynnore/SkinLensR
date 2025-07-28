      
# backend/app/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# --- Schémas pour les utilisateurs ---
class UserBase(BaseModel):
    email: EmailStr # S'assure que le champ est un format d'email valide
    role: Optional[str] = "user" # Rôle par défaut, peut être écrasé

class UserCreate(UserBase):
    password: str # Le mot de passe en texte brut lors de l'inscription

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    # hashed_password: str # Ne pas exposer le mot de passe hashé dans les réponses publiques

    class Config:
        from_attributes = True # Ancien 'orm_mode = True' pour la compatibilité avec SQLAlchemy

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None


# --- Schémas pour les documents légaux ---
class LegalDocumentBase(BaseModel):
    type: str # Ex: "CGU", "Privacy Policy"
    version: str # Ex: "1.0", "2024-07-29"
    language: str # Ex: "en", "fr", "af"
    content: str # Le contenu du document (texte brut ou Markdown)

class LegalDocumentCreate(LegalDocumentBase):
    pass # Pas de champs supplémentaires pour la création

class LegalDocumentResponse(LegalDocumentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserLegalAgreementCreate(BaseModel):
    document_id: int
    agreed: bool = True # Devrait toujours être True pour un accord

class UserLegalAgreementResponse(BaseModel):
    id: int
    user_id: int
    document_id: int
    agreed_at: datetime
    is_latest_version_agreed: bool

    class Config:
        from_attributes = True

    