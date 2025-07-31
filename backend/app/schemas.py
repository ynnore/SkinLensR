# backend/app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# --- Schémas pour les utilisateurs ---
class UserBase(BaseModel):
    email: EmailStr
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    # Utilisation correcte de Config pour la liaison avec SQLAlchemy
    class Config:
        from_attributes = True # ou `arbitrary_types_allowed = True` si nécessaire pour des types complexes


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None


# --- Schémas pour les documents légaux ---
class LegalDocumentBase(BaseModel):
    type: str
    version: str
    language: str
    content: str

class LegalDocumentCreate(LegalDocumentBase):
    pass

class LegalDocumentResponse(LegalDocumentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Schéma pour l'accord d'un utilisateur sur un document légal
class UserLegalAgreementBase(BaseModel):
    user_id: int
    document_id: int
    agreed_at: datetime
    is_latest_version_agreed: bool # Indicateur si l'accord concerne la dernière version

class UserLegalAgreementCreate(BaseModel):
    document_id: int
    agreed: bool = True # Par défaut, l'utilisateur est d'accord

class UserLegalAgreementResponse(UserLegalAgreementBase): # Hérite des champs de base
    id: int

    class Config:
        from_attributes = True


# ==============================================================================
# NOUVEAUX SCHÉMAS POUR LES DOCUMENTS DE L'AGENT (RAG)
# ==============================================================================

class AgentDocumentBase(BaseModel):
    title: str
    content: str
    source: Optional[str] = None

class AgentDocumentCreate(AgentDocumentBase):
    pass

class AgentDocumentResponse(AgentDocumentBase):
    id: int
    embedding: List[float] # Stocke l'embedding généré
    created_at: datetime
    updated_at: Optional[datetime] = None # Rendre updated_at optionnel et avec une valeur par défaut None

    class Config:
        from_attributes = True

# Schéma pour les requêtes de l'agent
class AgentQuery(BaseModel):
    query: str
    top_k: int = 3 # Nombre de documents similaires à récupérer (par défaut 3)

# Schéma pour la réponse de l'agent
class AgentResponse(BaseModel):
    response: str