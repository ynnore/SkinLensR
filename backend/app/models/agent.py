# /home/manik/skinlensr/SkinLensR/backend/app/models/agent.py
# Modèle SQLAlchemy représentant les agents et leurs documents associés.

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.agent_document import AgentDocument  # Assurez-vous que le chemin est correct

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)

    # Relation avec AgentDocument
    documents = relationship("AgentDocument", back_populates="agent")  


# Ce modèle Document semble redondant avec AgentDocument,
# à moins que ce soit volontaire d'avoir deux tables différentes pour des documents.
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    
    # L'agent auquel ce document est lié
    agent_id = Column(Integer, ForeignKey('agents.id'))
    
    # Relation bidirectionnelle
    agent = relationship("Agent", back_populates="documents")
