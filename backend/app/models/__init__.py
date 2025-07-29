# backend/app/models/__init__.py
from .base import Base # CORRECT : Base est dans le même dossier que ce __init__.py
from .user import User
from .legal_document import LegalDocument
from .agent_document import AgentDocument