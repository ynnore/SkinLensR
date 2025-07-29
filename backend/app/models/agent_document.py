      
# backend/app/models/agent_document.py
from sqlalchemy import Column, Integer, String, Text, DateTime, func
from pgvector.sqlalchemy import Vector # ✅ Utilisez le Vector type de pgvector
from app.models.base import Base # Assurez-vous que le chemin est correct

# Définissez la dimension de votre vecteur d'embedding ici.
# Les modèles d'embeddings ont des dimensions fixes (ex: OpenAI text-embedding-ada-002 a 1536)
VECTOR_DIMENSION = 384 # ✅ REMPLACEZ 1536 par 384 # Exemple: dimension pour OpenAI text-embedding-ada-002

class AgentDocument(Base):
    __tablename__ = "agent_documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False) # Le texte brut du document
    source = Column(String, index=True, nullable=True) # Ex: URL, nom de fichier
    embedding = Column(Vector(VECTOR_DIMENSION), nullable=False) # ✅ Utilisez Vector(dimension) directement
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<AgentDocument(id={self.id}, title='{self.title[:30]}...')>"

    