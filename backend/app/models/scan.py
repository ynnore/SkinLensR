# /home/manik/skinlensr/SkinLensR/backend/app/models/scan.py

import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum as SQLAlchemyEnum # Renommé Enum pour éviter conflit
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum # Assurez-vous que enum est importé

# Assurez-vous que Base est correctement importé depuis app.models.base
from app.models.base import Base

# --- Définitions d'Enums ---
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
    """
    __tablename__ = "scan_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)

    prompt = Column(Text, nullable=False, comment="Le prompt utilisateur pour la génération")
    # Utilisation de l'Enum SQLAlchemy pour le mode
    mode = Column(SQLAlchemyEnum(GenerationMode), default=GenerationMode.TEXT, index=True)
    
    file_id = Column(Integer, ForeignKey("drive_files.id"), index=True, nullable=True)

    result_text = Column(Text, nullable=True, comment="Texte généré par l'IA")
    result_url = Column(String, nullable=True, comment="URL du contenu généré (image/vidéo)")
    # Utilisation de l'Enum SQLAlchemy pour le statut
    result_status = Column(SQLAlchemyEnum(GenerationStatus), default=GenerationStatus.PENDING, index=True)
    
    requested_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True, comment="Quand la génération a été complétée")

    def __repr__(self):
        return f"<ScanRequest(id={self.id}, user_id={self.user_id}, mode='{self.mode.value}', prompt='{self.prompt[:50]}...', status='{self.result_status.value}')>"