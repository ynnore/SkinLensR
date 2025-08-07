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

    # Définir la relation many-to-many avec les agents via la table d'association
    agents = relationship("Agent", secondary="agent_legal_documents", back_populates="legal_documents")

    def __repr__(self):
        return f"<LegalDocument(id={self.id}, type='{self.type}', version='{self.version}', language='{self.language}')>"

# Table d'association pour la relation many-to-many entre Agents et LegalDocuments
class AgentLegalDocument(Base):
    __tablename__ = "agent_legal_documents"

    agent_id = Column(Integer, ForeignKey("agents.id"), primary_key=True)
    legal_document_id = Column(Integer, ForeignKey("legal_documents.id"), primary_key=True)

    # Définition des relations inverses pour la table d'association
    agent = relationship("Agent", back_populates="legal_documents")
    legal_document = relationship("LegalDocument", back_populates="agents")
