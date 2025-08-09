# backend/app/schemas/__init__.py
"""
Ce package centralise tous les schémas Pydantic du projet.
Il importe les schémas définis dans les sous-modules (comme app.schemas.schemas)
et les expose pour une utilisation facile dans d'autres parties de l'application.
Cela évite d'avoir à importer directement depuis des fichiers spécifiques de schémas.
"""

from app.schemas.schemas import (
    UserBase,
    UserCreate,
    UserResponse,
    LegalDocumentBase,
    LegalDocumentCreate,
    LegalDocumentResponse,
    UserLegalAgreementBase,
    UserLegalAgreementCreate,
    UserLegalAgreementResponse,
    Token,
    AgentDocumentBase,
    AgentDocumentCreate,
    AgentDocumentResponse,
)

__all__ = [
    "UserBase",
    "UserCreate",
    "UserResponse",
    "LegalDocumentBase",
    "LegalDocumentCreate",
    "LegalDocumentResponse",
    "UserLegalAgreementBase",
    "UserLegalAgreementCreate",
    "UserLegalAgreementResponse",
    "Token",
    "AgentDocumentBase",
    "AgentDocumentCreate",
    "AgentDocumentResponse",
]