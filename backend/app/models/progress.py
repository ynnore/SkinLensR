# /home/manik/skinlensr/SkinLensR/backend/app/models/progress.py

import uuid # Si vous utilisez UUIDs pour les IDs de progression, bien que souvent un entier suffise
from datetime import datetime
from typing import Optional, Dict, Any

from sqlalchemy import Column, Integer, String, DateTime, Float, Enum, ForeignKey
from sqlalchemy.orm import relationship # Si vous avez des relations, par ex. avec User
from sqlalchemy.sql import func

# Assurez-vous que Base est correctement importé depuis app.models.base
from app.models.base import Base

# --- Définition d'un Enum pour le Statut (optionnel mais recommandé) ---
class ProgressStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"

class Progress(Base):
    """
    Modèle SQLAlchemy représentant une entrée de suivi de progression pour un utilisateur.
    """
    __tablename__ = "progress_entries" # Nom de la table dans la base de données

    # Clé primaire pour l'entrée de progression
    id = Column(Integer, primary_key=True, index=True) 

    # Clé étrangère vers l'utilisateur
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False, comment="ID de l'utilisateur associé à cette progression")
    # Si vous avez une relation bidirectionnelle définie dans le modèle User :
    # user = relationship("User", back_populates="progress_entries") # Assurez-vous que User a une liste 'progress_entries'

    # Informations sur la progression
    activity_name = Column(String, index=True, nullable=False, comment="Nom de l'activité suivie (ex: 'Completing Module 1')")
    current_value = Column(Float, nullable=False, default=0.0, comment="Valeur actuelle de la progression (ex: pourcentage, points)")
    target_value = Column(Float, nullable=True, comment="Valeur cible optionnelle (ex: 100 pour un pourcentage)")
    status = Column(String, default="in_progress", index=True, comment="Statut de l'activité (ex: in_progress, completed, paused)")
    # Si vous utilisez Enum:
    # status = Column(Enum(ProgressStatus), default=ProgressStatus.IN_PROGRESS, index=True)

    # Timestamp de l'enregistrement
    timestamp = Column(DateTime, server_default=func.now(), comment="Timestamp de l'enregistrement de la progression")
    # Si vous voulez un timestamp de mise à jour spécifique :
    # created_at = Column(DateTime, default=datetime.utcnow)
    # updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Progress(id={self.id}, user_id={self.user_id}, activity='{self.activity_name}', current={self.current_value}, status='{self.status}')>"