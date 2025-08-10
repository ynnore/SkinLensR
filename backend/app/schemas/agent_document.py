# /home/manik/skinlensr/SkinLensR/backend/app/schemas/agent_document.py
"""
Ce module contient les schémas Pydantic pour les documents liés aux agents IA.
Ces schémas sont utilisés pour la validation des données et la sérialisation des réponses API.
"""

import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# --- Schémas pour les Documents d'Agent ---

class AgentDocumentBase(BaseModel):
    """Modèle de base pour les informations d'un document d'agent."""
    title: str = Field(..., example="Project Alpha Strategy Document")
    content: str = Field(..., example="The strategy for Project Alpha involves...") # Le contenu du document (ou un extrait)
    source: str = Field(..., example="Project_Alpha_Plan.pdf") # Source du document (ex: nom de fichier, URL)
    # L'embedding n'est généralement pas inclus dans les schémas de réponse de base
    # car il est utilisé en interne par les services RAG/embeddings.

class AgentDocumentCreate(AgentDocumentBase):
    """Schéma pour la création d'un document d'agent."""
    # Si vous avez besoin de fournir l'embedding lors de la création, ajoutez-le ici.
    # embedding: Optional[List[float]] = None # Peut être généré côté backend
    pass

class AgentDocumentResponse(AgentDocumentBase):
    """Schéma pour la réponse API décrivant un document d'agent."""
    id: int = Field(..., example=101) # ID unique du document dans la DB (si persistant)
    # Ou si vous utilisez des UUIDs pour les documents d'agent :
    # id: str = Field(..., example="a1b2c3d4-e5f6-7890-abcd-ef1234567890")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Vous pourriez vouloir inclure ici un aperçu du contenu si vous ne retournez pas tout.
    # content_preview: str = Field(..., example="The strategy for Project Alpha involves...")

    class Config:
        # orm_mode = True # Utile si vous mappez directement depuis des modèles SQLAlchemy
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# --- Si vous avez besoin de schémas pour les résultats de recherche d'embeddings ---
# class SearchResult(BaseModel):
#     id: str # ID du chunk ou du document
#     content: str # Le contenu du chunk/document
#     score: float # Score de similarité
#     metadata: Optional[Dict[str, Any]] = None