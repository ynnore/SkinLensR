# /home/manik/skinlensr/SkinLensR/backend/app/models/agent.py

import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any

from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB # Si vous utilisez PostgreSQL
from sqlalchemy.orm import relationship, sessionmaker
# Assurez-vous que Base est correctement importé depuis app.models.base
from app.models.base import Base 

# Importez les types de données nécessaires pour les états ou configurations
# from app.schemas.agent import AgentStatus # Si vous avez une Enum pour les statuts

class Agent(Base):
    """
    Représente un agent IA dans la base de données.
    Stocke les informations de base, la configuration, et potentiellement un état.
    """
    __tablename__ = "agents" # Nom de la table dans la base de données

    # Clé primaire pour l'agent
    # Souvent, un UUID est utilisé pour les identifiants d'agents pour éviter la prévisibilité
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4) 
    # Si vous préférez un entier auto-généré :
    # id = Column(Integer, primary_key=True, index=True) 

    # Informations de base sur l'agent
    name = Column(String, index=True, nullable=False, unique=False, comment="Nom de l'agent (ex: KiwiAssistant)")
    role = Column(String, nullable=False, comment="Rôle ou objectif principal de l'agent")
    description = Column(Text, nullable=True, comment="Description détaillée de l'agent")

    # Configuration de l'agent
    llm_model_name = Column(String, nullable=True, comment="Nom du modèle LLM utilisé par cet agent")
    # Pour stocker des configurations plus complexes, JSON ou JSONB est utile
    tools_config = Column(JSON, nullable=True, comment="Configuration des outils disponibles pour cet agent")

    # Statut de l'agent et timestamps
    status = Column(String, default="active", index=True, comment="Statut actuel de l'agent (ex: active, inactive, training)")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations avec d'autres tables (si nécessaires)
    # Par exemple, si un agent peut avoir plusieurs documents associés :
    # agent_documents = relationship("AgentDocument", back_populates="agent")

    # Si vous avez une table pour les tâches d'agent ou l'historique :
    # agent_tasks = relationship("AgentTask", back_populates="agent")

    # Commentaire : les relations doivent être définies dans les modèles correspondants aussi
    # (ex: dans agent_document.py, définir `agent = relationship("Agent", back_populates="agent_documents")`)

    def __repr__(self):
        return f"<Agent(id={self.id}, name='{self.name}', role='{self.role}', status='{self.status}')>"