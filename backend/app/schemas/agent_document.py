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
    content: str = Field(..., example="The strategy for Project Alpha involves...")  # Le contenu du document (ou un extrait)
    source: str = Field(..., example="Project_Alpha_Plan.pdf")  # Source du document (ex: nom de fichier, URL)
    # L'embedding n'est généralement pas inclus dans les schémas de réponse de base
    # car il est utilisé en interne par les services RAG/embeddings.

class AgentDocumentCreate(AgentDocumentBase):
    """Schéma pour la création d'un document d'agent."""
    # embedding optionnel à ajouter si nécessaire
    # embedding: Optional[List[float]] = None

class AgentDocumentRead(AgentDocumentBase):
    """Schéma pour la lecture d'un document d'agent, incluant les métadonnées."""
    id: int = Field(..., example=101)  # ID unique du document dans la DB (si persistant)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True  # Remplace orm_mode pour Pydantic v2
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class AgentDocumentResponse(AgentDocumentRead):
    """Alias éventuel pour la réponse API."""
    pass

# --- Schémas additionnels possibles ---
# class SearchResult(BaseModel):
#     id: str  # ID du chunk ou du document
#     content: str  # Le contenu du chunk/document
#     score: float  # Score de similarité
#     metadata: Optional[Dict[str, Any]] = None
