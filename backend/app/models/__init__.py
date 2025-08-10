# /home/manik/skinlensr/SkinLensR/backend/app/models/__init__.py
"""
Ce package centralise tous les modèles SQLAlchemy du projet.
Il importe les modèles définis dans les sous-modules (comme agent.py, user.py, etc.)
et les expose pour une utilisation facile dans le reste de l'application (services, CRUD, migrations).
Cela permet à SQLAlchemy de connaître toutes les tables à créer ou gérer.
"""

# --- Importation des Modèles SQLAlchemy ---
# Il est crucial d'importer chaque modèle ici pour que SQLAlchemy les enregistre
# dans sa MetaData lors de l'importation du package 'models'.

# Importation de la Base Déclarative (essentielle pour tous les modèles)
# Assurez-vous que Base est bien défini dans app.models.base et importé ici.
from .base import Base

# Modèles pour les Utilitaires / Authentification (si persistant)
# Si vous avez des modèles pour la gestion des tokens, des sessions, etc.

# Modèles pour les Utilisateurs
from .user import User

# Modèles pour les Documents Légaux
from .legal_document import LegalDocument
# Modèles pour les Accords Utilisateur Légaux (si distincts)
from .user_legal_agreement import UserLegalAgreement

# Modèles pour la Progression
from .progress import Progress

# Modèles pour les Agents IA
from .agent import Agent
# from .agent_document import AgentDocument # Si AgentDocument est un modèle SQLAlchemy distinct

# Modèles pour le Chat (si persistance nécessaire)
# from .conversation import Conversation
# from .message import Message

# Modèles pour le Drive (gestion des fichiers)
# Si vous avez un modèle pour les enregistrements de fichiers
# from .drive import DriveFile

# --- Liste des Modèles Publics ---
# Définir __all__ pour indiquer quels sont les modèles exportés par ce package.
# C'est une bonne pratique pour indiquer l'API publique du package `models`.
__all__ = [
    # Base Déclarative
    "Base",

    # Utilisateurs
    "User",

    # Documents Légaux
    "LegalDocument",
    "UserLegalAgreement",

    # Progression
    "Progress",

    # Agents IA
    "Agent",
    # "AgentDocument", # Si c'est un modèle SQLAlchemy

    # Chat (si persistants)
    # "Conversation",
    # "Message",

    # Drive (si persistant)
    # "DriveFile",
]