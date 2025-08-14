"""
Ce package centralise toutes les fonctions CRUD (Create, Read, Update, Delete)
du projet. Il importe les fonctions définies dans les sous-modules (comme user.py,
legal_documents.py, progress.py, etc.) et les expose pour une utilisation facile
dans les services et les routeurs.
"""

# -------------------------
# Importation des Fonctions CRUD
# -------------------------
# Il est crucial d'importer toutes les fonctions CRUD ici pour qu'elles soient
# accessibles via `from app.crud import ...`

# --- CRUD Utilisateurs ---
try:
    from .user import (
        get_user_by_email,
    get_user_by_id,
    get_users,
    create_user,
    update_user,
    update_user_password,
    delete_user,
    authenticate_user
    )
except ImportError:
    # Si certaines fonctions ne sont pas encore définies
    get_user_by_email = get_user_by_id = get_all_users = None
    create_user = update_user = delete_user = None

# --- CRUD Documents Légaux ---
try:
    from .legal_documents import (
        create_legal_document,
        get_legal_document_by_id,
        get_latest_legal_document,
        get_all_legal_documents,
        update_legal_document,
        delete_legal_document,
    )
except ImportError:
    create_legal_document = get_legal_document_by_id = get_latest_legal_document = None
    get_all_legal_documents = update_legal_document = delete_legal_document = None

# --- CRUD Progression ---
try:
    from .progress import (
        create_progress_entry,
        get_progress_entry_by_id,
        get_progress_for_user,
        update_progress,
        delete_progress,
    )
except ImportError:
    create_progress_entry = get_progress_entry_by_id = get_progress_for_user = None
    update_progress = delete_progress = None

# --- CRUD Fichiers Drive ---
try:
    from .drive import (
        create_file_record,
        get_file_record_by_id,
        get_user_files,
        search_files_and_web,
    )
except ImportError:
    create_file_record = get_file_record_by_id = get_user_files = search_files_and_web = None

# --- CRUD Scan / Génération IA ---
try:
    from .scan import (
        create_scan_request,
        get_scan_request_by_id,
        get_user_scan_requests,
        update_scan_request_status,
        delete_scan_request,
    )
except ImportError:
    create_scan_request = get_scan_request_by_id = get_user_scan_requests = None
    update_scan_request_status = delete_scan_request = None

# --- Liste des Fonctions CRUD Publiques ---
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
]
