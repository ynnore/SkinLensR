# /home/manik/skinlensr/SkinLensR/backend/app/models/agent_document.py
# Modèle SQLAlchemy représentant les documents liés aux agents,
# incluant un champ d'embedding vectoriel pour les recherches sémantiques.

from sqlalchemy import Column, Integer, String, Text, DateTime, func, ForeignKey  # Assurez-vous que 'func' est bien importé
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector  # Utilisez le type Vector de pgvector
from app.models.base import Base  # Assurez-vous que le chemin est correct

VECTOR_DIMENSION = 384  # Remplacez 1536 par 384 (exemple pour OpenAI text-embedding-ada-002)

class AgentDocument(Base):
    __tablename__ = "agent_documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)  # Le texte brut du document
    source = Column(String, index=True, nullable=True)  # Ex : URL, nom de fichier
    embedding = Column(Vector(VECTOR_DIMENSION), nullable=False)  # Utilisez Vector(dimension) directement
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # 'func' doit être bien importé ici
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())  # Et ici également

    # Définition de la clé étrangère pour lier le document à un agent
    agent_id = Column(Integer, ForeignKey('agents.id'), nullable=False)

    # Relation avec le modèle Agent
    agent = relationship("Agent", back_populates="documents")

    def __repr__(self):
        return f"<AgentDocument(id={self.id}, title='{self.title[:30]}...')>"
