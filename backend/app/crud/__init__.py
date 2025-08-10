# /home/manik/skinlensr/SkinLensR/backend/app/crud/__init__.py
"""
Ce package centralise toutes les fonctions CRUD (Create, Read, Update, Delete)
du projet. Il importe les fonctions définies dans les sous-modules (comme user.py,
auth.py, etc.) et les expose pour une utilisation facile dans les services
et les routeurs.
"""

# --- Importation des Fonctions CRUD ---
# Il est crucial d'importer toutes les fonctions CRUD ici pour qu'elles soient
# accessibles via `from app.crud import ...`

# CRUD pour les utilisateurs
from .user import (
    get_user_by_email,
    get_user_by_id,
    get_all_users,
    create_user,
    update_user,
    delete_user,
)

# CRUD pour l'authentification (ex: si la logique de token ou de session y est)
# Si la plupart des fonctions auth sont dans user.py, ces imports peuvent être omis ici.
# from .auth import (
#     # get_user_from_token_payload, # Exemple si vous avez une telle fonction
# )

# CRUD pour les documents légaux
from .legal_documents import (
    create_legal_document,
    get_legal_document_by_id,
    get_latest_legal_document,
    get_all_legal_documents,
    update_legal_document,
    delete_legal_document,
)

# CRUD pour le suivi de progression
from .progress import (
    create_progress_entry,
    get_progress_entry_by_id,
    get_progress_for_user,
    update_progress,
    delete_progress,
)

# CRUD pour les fichiers du Drive
from .drive import (
    create_file_record,
    get_file_record_by_id,
    get_user_files,
    search_files_and_web,
)

# CRUD pour le Scan / Génération IA
# Si vous avez un CRUD pour enregistrer les requêtes de scan ou les résultats :
from .scan import (
    create_scan_request,
    get_scan_request_by_id,
    get_user_scan_requests,
    update_scan_request_status,
    delete_scan_request,
)

# CRUD pour le Chat (si persistance des conversations/messages)
# from .chat import (
#     create_conversation_record,
#     get_conversation_record,
#     add_message_to_conversation,
#     get_conversation_messages,
#     # ... autres fonctions CRUD pour le chat
# )

# CRUD pour les Agents et leurs données (si persistants)
# from .agent import ...
# from .agent_document import ... # Si AgentDocument est persistant

# --- Liste des Fonctions CRUD Publiques ---
# Définir __all__ pour indiquer quelles fonctions sont exportées par ce package.
__all__ = [
    # Utilisateurs
    "get_user_by_email",
    "get_user_by_id",
    "get_all_users",
    "create_user",
    "update_user",
    "delete_user",

    # Documents Légaux
    "create_legal_document",
    "get_legal_document_by_id",
    "get_latest_legal_document",
    "get_all_legal_documents",
    "update_legal_document",
    "delete_legal_document",

    # Progression
    "create_progress_entry",
    "get_progress_entry_by_id",
    "get_progress_for_user",
    "update_progress",
    "delete_progress",

    # Drive
    "create_file_record",
    "get_file_record_by_id",
    "get_user_files",
    "search_files_and_web",

    # Scan / Génération IA
    "create_scan_request",
    "get_scan_request_by_id",
    "get_user_scan_requests",
    "update_scan_request_status",
    "delete_scan_request",

    # Chat (si persistant)
    # "create_conversation_record", "get_conversation_record", "add_message_to_conversation", ...

    # Agents (si persistants)
    # "create_agent", "get_agent_by_id", "update_agent", "delete_agent", ...
]