# /home/manik/skinlensr/SkinLensR/backend/app/models/agent.py

import uuid
import enum # <-- IMPORTEZ 'enum'
from datetime import datetime
from typing import Optional, List, Dict, Any

from sqlalchemy import Column, Integer, String, DateTime, Text, Enum as SQLAlchemyEnum, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB # Si vous utilisez PostgreSQL
from sqlalchemy.orm import relationship, sessionmaker
from app.models.base import Base

# --- Définition d'un Enum pour le Statut de l'Agent ---
class AgentStatus(str, enum.Enum): # Utilisation de str pour le mapping avec SQLAlchemy String Column
    ACTIVE = "active"
    INACTIVE = "inactive"
    BUSY = "busy"
    OFFLINE = "offline"
    TRAINING = "training"

class Agent(Base):
    """
    Représente un agent IA dans la base de données.
    """
    __tablename__ = "agents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # id = Column(Integer, primary_key=True, index=True) # Laissez seulement une des deux options pour l'ID

    name = Column(String, index=True, nullable=False, unique=False, comment="Nom de l'agent (ex: KiwiAssistant)")
    role = Column(String, nullable=False, comment="Rôle ou objectif principal de l'agent")
    description = Column(Text, nullable=True, comment="Description détaillée de l'agent")

    llm_model_name = Column(String, nullable=True, comment="Nom du modèle LLM utilisé par cet agent")
    tools_config = Column(JSON, nullable=True, comment="Configuration des outils disponibles pour cet agent")

    # Utilisation de l'Enum Python mappé à une colonne String pour le statut
    status = Column(String, default=AgentStatus.INACTIVE, index=True, comment="Statut actuel de l'agent")
    # Ou, si vous préférez le type Enum natif de SQLAlchemy :
    # status = Column(SQLAlchemyEnum(AgentStatus), default=AgentStatus.INACTIVE, index=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Agent(id={self.id}, name='{self.name}', role='{self.role}', status='{self.status}')>"