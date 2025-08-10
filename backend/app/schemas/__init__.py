# /home/manik/skinlensr/SkinLensR/backend/app/schemas/__init__.py
"""
Ce package centralise tous les schémas Pydantic du projet.
Il importe les schémas définis dans les sous-modules (comme agent.py, chat.py, user.py, etc.)
et les expose pour une utilisation facile dans d'autres parties de l'application.
Cela évite d'avoir à importer directement depuis des fichiers spécifiques de schémas.
"""

# --- Imports des schémas par sous-module ---

# Schémas Généraux / Utilitaires / Authentification
# Si vous avez des schémas vraiment généraux dans app/schemas/schemas.py, importez-les ici.
# Par exemple, le schéma Token pourrait être là.
from .schemas import (
    Token,
)

# Schémas pour les Utilisateurs
from .user import (
    UserBase,
    UserCreate,
    UserResponse,
    UserUpdate,
)

# Schémas pour les Documents Légaux
from .legal_document import (
    LegalDocumentBase,
    LegalDocumentCreate,
    LegalDocumentResponse,
    LegalDocumentUpdate,
)

# Schémas pour les Documents d'Agent (utilisés dans RAG/Scan)
from .agent_document import (
    AgentDocumentBase,
    AgentDocumentCreate,
    AgentDocumentResponse,
)

# Schémas pour le Chat
from .chat import (
    ChatMessage,
    ConversationCreate,
    ConversationResponse,
    MessageSendRequest,
    MessageResponse,
)

# Schémas pour les Agents IA
from .agent import (
    AgentBase,
    AgentCreate,
    AgentResponse,
    AgentUpdate,
    AgentTaskBase,
    AgentTaskCreate,
    AgentTaskResponse,
)

# Schémas pour le Suivi de Progression
from .progress import (
    ProgressCreate,
    ProgressResponse,
    ProgressUpdate,
)

# Schémas pour le Drive (gestion des fichiers)
from .drive import (
    FileBase,
    FileCreate,
    FileResponse,
    SearchRequest,
    SearchResult,
)

# Schémas pour la fonctionnalité de Scan / Génération IA
# Assurez-vous que ces schémas existent dans app/schemas/scan.py
from .scan import (
    ScanQueryRequest,
    ScanResponse,
)

# --- Liste des Entités Publiques du Package ---
# Définir __all__ pour indiquer quelles sont les entités exportées par ce package.
__all__ = [
    # Utilitaires / Authentification
    "Token",

    # Utilisateurs
    "UserBase",
    "UserCreate",
    "UserResponse",
    "UserUpdate",

    # Documents Légaux
    "LegalDocumentBase",
    "LegalDocumentCreate",
    "LegalDocumentResponse",
    "LegalDocumentUpdate",

    # Documents d'Agent (RAG)
    "AgentDocumentBase",
    "AgentDocumentCreate",
    "AgentDocumentResponse",

    # Chat
    "ChatMessage",
    "ConversationCreate",
    "ConversationResponse",
    "MessageSendRequest",
    "MessageResponse",

    # Agents IA
    "AgentBase",
    "AgentCreate",
    "AgentResponse",
    "AgentUpdate",
    "AgentTaskBase",
    "AgentTaskCreate",
    "AgentTaskResponse",

    # Progression
    "ProgressCreate",
    "ProgressResponse",
    "ProgressUpdate",

    # Drive
    "FileBase",
    "FileCreate",
    "FileResponse",
    "SearchRequest",
    "SearchResult",

    # Scan / Génération IA
    "ScanQueryRequest",
    "ScanResponse",
]