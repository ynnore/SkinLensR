# /home/manik/skinlensr/SkinLensR/backend/app/models/__init__.py
"""
Ce fichier centralise l'importation de tous les modèles SQLAlchemy.

En important tous les modèles ici, nous nous assurons que SQLAlchemy les "découvre"
correctement avant que l'application ne tente de construire les relations ou de créer les tables.

Cela simplifie également les imports dans les autres parties de l'application,
vous pourrez faire : `from app.models import User, Memory`
"""

# 1. Importer la classe de base partagée par tous les modèles.
from .base import Base

# 2. Importer chaque classe de modèle pour l'enregistrer auprès de SQLAlchemy.
# C'est l'étape la plus importante.
from .user import User
from .memory import Memory  # Le modèle que nous avons discuté

# --- Décommentez et ajoutez vos autres modèles ici au fur et à mesure ---
# from .legal_document import LegalDocument
# from .user_legal_agreement import UserLegalAgreement
# from .agent import Agent
# from .progress import Progress
# from .drive import DriveFile


# 3. (Optionnel mais bonne pratique) Définir __all__ pour un import propre.
# Cela contrôle ce qui est importé quand un autre fichier fait `from app.models import *`.
# Listez ici les noms des classes (en tant que chaînes de caractères).
__all__ = [
    "Base",
    "User",
    "Memory",
    # "LegalDocument",
    # "UserLegalAgreement",
    # "Agent",
    # "Progress",
    # "DriveFile",
]