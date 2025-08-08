# /home/manik/skinlensr/SkinLensR/backend/app/models/legal_document.py
# Définit le modèle LegalDocument représentant les documents légaux stockés dans la base,
# ainsi que la table d'association AgentLegalDocument qui établit une relation many-to-many
# entre les agents (Agent) et les documents légaux (LegalDocument).

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.agent import Agent  # Assurez-vous que ce fichier existe et que le modèle Agent est bien défini


class LegalDocument(Base):
    __tablename__ = "legal_documents"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True, nullable=False)
    version = Column(String, index=True, nullable=False)
    language = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relation many-to-many avec les agents via la table d'association agent_legal_documents
    agents = relationship("Agent", secondary="agent_legal_documents", back_populates="legal_documents")

    def __repr__(self):
        return f"<LegalDocument(id={self.id}, type='{self.type}', version='{self.version}', language='{self.language}')>"


class AgentLegalDocument(Base):
    __tablename__ = "agent_legal_documents"

    agent_id = Column(Integer, ForeignKey("agents.id"), primary_key=True)
    legal_document_id = Column(Integer, ForeignKey("legal_documents.id"), primary_key=True)

    # Relations inverses pour la table d'association many-to-many
    agent = relationship("Agent", back_populates="legal_documents")
    legal_document = relationship("LegalDocument", back_populates="agents")
