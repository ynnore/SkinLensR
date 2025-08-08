# /home/manik/skinlensr/SkinLensR/backend/app/schemas/__init__.py

"""
Package de schémas Pydantic pour la validation des données d'entrée et de sortie.
Ce fichier init importe les schémas de chaque module et les expose pour simplifier les imports ailleurs.
"""

from app.schemas.user import User, UserCreate, UserUpdate
from app.schemas.legal_document import LegalDocument, LegalDocumentCreate, LegalDocumentUpdate
from app.schemas.progress import Progress, ProgressCreate, ProgressUpdate

# Exports pour simplifier l'import dans d'autres fichiers :
__all__ = [
    "User",
    "UserCreate",
    "UserUpdate",
    "LegalDocument",
    "LegalDocumentCreate",
    "LegalDocumentUpdate",
    "Progress",
    "
