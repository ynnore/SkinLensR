# app/models/__init__.py

# Import des modèles principaux — attention aux cycles d'import !
from .base import Base
from .user import User
from .progress import Progress
from .legal_document import LegalDocument
from .agent import Agent
from .agent_document import AgentDocument
from .user_legal_agreement import UserLegalAgreement
