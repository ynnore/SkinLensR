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
    class Config:
        from_attributes = True

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

class UserLegalAgreementCreate(BaseModel):
    document_id: int
    agreed: bool = True

class UserLegalAgreementResponse(BaseModel):
    id: int
    user_id: int
    document_id: int
    agreed_at: datetime
    is_latest_version_agreed: bool

    class Config:
        from_attributes = True


# ==============================================================================
# NOUVEAUX SCHÉMAS POUR LES DOCUMENTS DE L'AGENT
# ==============================================================================

class AgentDocumentBase(BaseModel):
    title: str
    content: str
    source: Optional[str] = None

class AgentDocumentCreate(AgentDocumentBase):
    pass

class AgentDocumentResponse(AgentDocumentBase):
    id: int
    embedding: List[float]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True