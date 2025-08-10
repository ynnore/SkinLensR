# /home/manik/skinlensr/SkinLensR/backend/app/schemas/scan.py

import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# --- Schémas pour la Fonctionnalité de Scan / Génération IA ---

class ScanQueryRequest(BaseModel):
    """
    Requête pour déclencher une analyse ou une génération IA.
    Utilisé pour le mode 'text' et potentiellement pour passer un prompt à un agent.
    """
    query: str = Field(..., example="Describe this image") # Le prompt principal pour l'IA
    mode: str = Field("text", example="text") # Le mode de génération : 'text', 'image', 'video', 'rag_text'
    # Si on utilise un fichier uploadé directement avec la requête de génération (plutôt que file_id)
    # Ce champ peut être géré dans le routeur, mais parfois on le met dans le schéma si c'est une partie intégrale de la requête.
    # file_upload: Optional[bytes] = Field(None) # Attention: les fichiers volumineux sont mieux gérés avec UploadFile dans les routeurs FastAPI.

class ScanResponse(BaseModel):
    """
    Réponse générée par l'IA suite à une requête de scan/génération.
    Peut contenir du texte, une URL d'image, une URL de vidéo, ou un objet plus complexe.
    """
    response_text: Optional[str] = Field(None, example="This is a description of the image.")
    image_url: Optional[str] = Field(None, example="https://example.com/generated_image.png")
    video_url: Optional[str] = Field(None, example="https://example.com/generated_video.mp4")
    # Si vous avez des résultats plus structurés, ajoutez-les ici.
    # Par exemple, pour RAG, vous pourriez retourner les sources ou des extraits.
    # retrieved_context: Optional[List[Dict[str, Any]]] = None

    class Config:
        # orm_mode = True # Si vous maprez depuis un modèle SQLAlchemy
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# --- Schémas pour l'indexation de documents dans le RAG ---
# Si la fonctionnalité de scan inclut l'indexation de documents pour RAG,
# vous pourriez réutiliser ou adapter ceux de drive.py, ou en avoir de spécifiques ici.
# Dans notre exemple, nous avons utilisé `index_document` de RAGService,
# qui attendait `document_content`, `source_name`, `metadata`.
# Si vous voulez que le routeur Scan expose cette fonctionnalité :

# class ScanIndexDocumentRequest(BaseModel):
#     content: str = Field(..., example="This document contains important information...")
#     source_name: str = Field(..., example="project_plan.pdf")
#     metadata: Optional[Dict[str, Any]] = Field(None, example={"user_id": 1, "title": "Project Plan"})

# class ScanIndexResponse(BaseModel):
#     """Réponse après l'indexation d'un document."""
#     message: str = Field(..., example="Document indexed successfully.")
#     document_id: Optional[str] = Field(None, example="chunk_xyz123") # ID du chunk indexé