# /home/manik/skinlensr/SkinLensR/backend/app/schemas/__init__.py

"""
Point d'entrée pour tous les schémas Pydantic.
Importe et expose les schémas de chaque module pour simplifier les imports dans le reste du projet.
"""

from app.schemas.user import User, UserCreate, UserUpdate
from app.schemas.legal_document import LegalDocument, LegalDocumentCreate, LegalDocumentUpdate
from app.schemas.progress import Progress, ProgressCreate

__all__ = [
    "User",
    "UserCreate",
    "UserUpdate",
    "LegalDocument",
    "LegalDocumentCreate",
    "LegalDocumentUpdate",
    "Progress",
    "ProgressCreate",
]
