# /home/manik/skinlensr/SkinLensR/backend/app/models/scan.py

import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

# Assurez-vous que Base est correctement importé depuis app.models.base
from app.models.base import Base

# --- Définitions d'Enums (Optionnel mais recommandé) ---
class GenerationMode(str, enum.Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    RAG_TEXT = "rag_text"

class GenerationStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class ScanRequest(Base):
    """
    Modèle SQLAlchemy pour représenter une requête de scan ou de génération IA.
    Cela permet de stocker l'historique des requêtes et leurs résultats.
    """
    __tablename__ = "scan_requests" # Nom de la table

    # Identifiant unique de la requête
    id = Column(Integer, primary_key=True, index=True) 
    # Si vous préférez un UUID :
    # id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Liens avec l'utilisateur et potentiellement avec des fichiers
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    # user = relationship("User", back_populates="scan_requests") # Relation inverse dans le modèle User

    # Informations sur la requête
    prompt = Column(Text, nullable=False, comment="Le prompt utilisateur pour la génération")
    mode = Column(String, default="text", index=True, comment="Mode de génération (text, image, video, rag_text)")
    # Si vous utilisez Enum:
    # mode = Column(Enum(GenerationMode), default=GenerationMode.TEXT, index=True)
    
    # Référence à un fichier existant si utilisé (ex: pour l'analyse d'image)
    file_id = Column(Integer, ForeignKey("drive_files.id"), index=True, nullable=True)
    # file = relationship("DriveFile", back_populates="scan_requests") # Relation inverse dans DriveFile

    # Informations sur le résultat
    result_text = Column(Text, nullable=True, comment="Texte généré par l'IA")
    result_url = Column(String, nullable=True, comment="URL du contenu généré (image/vidéo)")
    result_status = Column(String, default="pending", index=True, comment="Statut de la génération (pending, processing, completed, failed)")
    # Si vous utilisez Enum:
    # result_status = Column(Enum(GenerationStatus), default=GenerationStatus.PENDING, index=True)
    
    # Timestamps
    requested_at = Column(DateTime, server_default=func.now()) # Quand la requête a été faite
    completed_at = Column(DateTime, nullable=True, comment="Quand la génération a été complétée")

    def __repr__(self):
        return f"<ScanRequest(id={self.id}, user_id={self.user_id}, mode='{self.mode}', prompt='{self.prompt[:50]}...', status='{self.status}')>"