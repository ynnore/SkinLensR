# ~/skinlensr/SkinLensR/backend/app/crud/__init__.py

from .operations import (
    get_user_by_email,
    create_user,
    get_legal_document,
    create_legal_document,
    get_latest_legal_document,
    record_user_agreement,
    get_agent_document,
    create_agent_document # N'oubliez pas d'ajouter cette fonction aussi si vous l'utilisez
)