# backend/app/models/__init__.py

from .base import Base
from .user import User
from .legal_document import LegalDocument
from .agent_document import AgentDocument  # Doit être présent
from .user_legal_agreement import UserLegalAgreement  # ✅ Import explicit pour éviter les conflits
