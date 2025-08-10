# /home/manik/skinlensr/SkinLensR/backend/app/routers/__init__.py
"""
Ce package contient tous les routeurs API de l'application FastAPI.
Il centralise les points d'entrée pour les différentes fonctionnalités.
"""

# --- Importation des Routeurs ---
# Importez chaque objet router défini dans vos fichiers de routeurs.
# Ceci est utile si vous voulez importer des routeurs directement depuis `app.routers`
# ou si vous avez une logique d'initialisation ici.

from .auth import router as auth_router
from .users import router as users_router
from .legal_documents import router as legal_documents_router # Assurez-vous que le routeur est bien nommé legal_documents_router
from .progress import router as progress_router
from .scan import router as scan_router
from .chat import router as chat_router
from .agent import router as agent_router # Assurez-vous que le routeur est bien nommé agent_router

# Si vous avez créé un router pour l'interface agent spécifique (voix/signes)
# from .agent_interface import router as agent_interface_router

# --- Liste des Routeurs Publics ---
# Définir __all__ pour indiquer quelles sont les entités exportées par ce package.
# C'est utile pour l'importation dans main.py (ex: `from app.routers import auth_router, users_router`)
__all__ = [
    "auth_router",
    "users_router",
    "legal_documents_router",
    "progress_router",
    "scan_router",
    "chat_router",
    "agent_router",
    # "agent_interface_router", # Si vous l'avez créé
]