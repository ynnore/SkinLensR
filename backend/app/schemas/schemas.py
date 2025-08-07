from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# --- Schémas pour les utilisateurs ---
class UserBase(BaseModel):
    email: str
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: Optional[bool] = True

    class Config:
        from_attributes = True  # Utilisation de 'Config' pour Pydantic v2

# --- Schémas pour les documents légaux ---
class LegalDocumentBase(BaseModel):
    title: str
    content: str
    source: str

class LegalDocumentCreate(LegalDocumentBase):
    pass

class LegalDocumentResponse(LegalDocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Utilisation de 'Config' pour Pydantic v2

# --- Schémas pour les accords utilisateur-document légal ---
class UserLegalAgreementBase(BaseModel):
    user_id: int
    document_id: int
    accepted: bool = False

class UserLegalAgreementCreate(UserLegalAgreementBase):
    pass

class UserLegalAgreementResponse(UserLegalAgreementBase):
    id: int
    agreed_at: datetime

    class Config:
        from_attributes = True  # Utilisation de 'Config' pour Pydantic v2

# --- Schéma pour le token d'authentification ---
class Token(BaseModel):
    access_token: str
    token_type: str

# --- Schémas pour les documents d'agents ---
class AgentDocumentBase(BaseModel):
    title: str
    content: str
    source: str

class AgentDocumentCreate(AgentDocumentBase):
    pass

class AgentDocumentResponse(AgentDocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Utilisation de 'Config' pour Pydantic v2
class AgentResponse(AgentDocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
