import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# --- Requête pour Scan / Génération IA ---

class ScanQueryRequest(BaseModel):
    """
    Requête pour déclencher une analyse ou une génération IA.
    Utilisé pour le mode 'text' et potentiellement pour passer un prompt à un agent.
    """
    query: str = Field(..., example="Describe this image")  # Prompt principal pour l'IA
    mode: str = Field("text", example="text")  # Mode de génération : 'text', 'image', 'video', 'rag_text'

# --- Réponse de Scan / Génération IA ---

class ScanResponse(BaseModel):
    """
    Réponse générée par l'IA suite à une requête de scan/génération.
    Peut contenir du texte, une URL d'image, une URL de vidéo, ou un objet plus complexe.
    """
    response_text: Optional[str] = Field(None, example="This is a description of the image.")
    image_url: Optional[str] = Field(None, example="https://example.com/generated_image.png")
    video_url: Optional[str] = Field(None, example="https://example.com/generated_video.mp4")
    retrieved_context: Optional[List[Dict[str, Any]]] = Field(
        None, example=[{"source": "doc1.txt", "snippet": "Important extracted text"}]
    )

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# --- (Optionnel) Schéma pour indexation de documents dans RAG ---

class ScanIndexDocumentRequest(BaseModel):
    content: str = Field(..., example="This document contains important information...")
    source_name: str = Field(..., example="project_plan.pdf")
    metadata: Optional[Dict[str, Any]] = Field(None, example={"user_id": 1, "title": "Project Plan"})

class ScanIndexResponse(BaseModel):
    message: str = Field(..., example="Document indexed successfully.")
    document_id: Optional[str] = Field(None, example="chunk_xyz123")

