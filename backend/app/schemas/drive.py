# /home/manik/skinlensr/SkinLensR/backend/app/schemas/drive.py

import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- Schémas pour la gestion des fichiers dans le Drive ---

class FileBase(BaseModel):
    """Modèle de base pour les informations de fichier."""
    filename: str = Field(..., example="document.pdf") # Nom original du fichier
    unique_filename: str = Field(..., example="a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf") # Nom unique stocké sur le serveur
    size: int = Field(..., example=123456)  # Taille en octets
    content_type: str = Field(..., example="application/pdf") # Type MIME du fichier

class FileCreate(FileBase):
    """Schéma pour créer un enregistrement de fichier (lors de l'upload)."""
    # Le path est généralement dérivé de unique_filename et de UPLOAD_DIR,
    # donc il n'est pas toujours nécessaire de le demander explicitement ici.
    # Si vous le gardez, assurez-vous de sa gestion.
    path: str = Field(..., example="/uploaded_files/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf")
    user_id: int = Field(..., example=1) # L'ID de l'utilisateur qui a uploadé le fichier

class FileResponse(FileBase):
    """Schéma pour la réponse API décrivant un fichier."""
    id: int = Field(..., example=101) # ID unique du fichier dans la base de données
    user_id: int = Field(..., example=1)
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    filepath: str = Field(..., example="/uploaded_files/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf")

    class Config:
        # orm_mode = True # Utile si vous mappez directement depuis des modèles SQLAlchemy
        json_encoders = {
            datetime: lambda v: v.isoformat() # Pour convertir datetime en string ISO pour JSON
        }

# --- Schémas pour la Recherche ---

class SearchRequest(BaseModel):
    """Schéma pour les requêtes de recherche."""
    query: str = Field(..., example="Find my document about project X")
    search_web: bool = Field(False, description="Indicates if the search should include web results.")
    # Vous pourriez ajouter des filtres ici, par exemple :
    # file_type: Optional[str] = None # Ex: 'pdf', 'image'
    # date_from: Optional[datetime] = None
    # date_to: Optional[datetime] = None

class SearchResult(BaseModel):
    """Schéma pour un résultat de recherche (fichier ou info web)."""
    id: Optional[int] = None # ID du fichier si c'est un fichier du drive
    title: str = Field(..., example="My Important Document.pdf")
    description: str = Field(..., example="This document contains the project plan for Project X.")
    source: str = Field(..., example="My Documents") # Source du résultat (ex: 'My Files', 'Web Search')
    url: Optional[str] = Field(None, example="/api/drive/files/download/...") # URL pour télécharger le fichier ou lien web
    score: Optional[float] = Field(None, example=0.95) # Score de pertinence du résultat
    timestamp: Optional[datetime] = Field(None) # Date de l'upload du fichier ou de l'info web

# --- Schéma pour la génération de contenu (utilisé dans drive.py) ---
# Si ces schémas ne sont pas dans drive.py, il faudrait les déplacer là ou les importer ici.

class ScanQueryRequest(BaseModel):
    """Requête pour la fonctionnalité de scan/génération IA."""
    query: str = Field(..., example="Describe this image")
    mode: Optional[str] = Field("text", example="text") # 'text', 'image', 'video', 'rag_text'
    file_id: Optional[int] = None # Si on référence un fichier déjà uploadé

class ScanResponse(BaseModel):
    """Réponse générée par l'IA (texte, URL d'image/vidéo)."""
    response_text: Optional[str] = Field(None, example="This is a description of the image.")
    image_url: Optional[str] = Field(None, example="https://example.com/generated_image.png")
    video_url: Optional[str] = Field(None, example="https://example.com/generated_video.mp4")