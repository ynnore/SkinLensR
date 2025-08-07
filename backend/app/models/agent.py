from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.agent_document import AgentDocument  # Assurez-vous que le chemin est correct

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)

    # Relation avec AgentDocument (assurez-vous que la relation est correcte)
    documents = relationship("AgentDocument", back_populates="agent")  


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    
    # L'agent auquel ce document est lié
    agent_id = Column(Integer, ForeignKey('agents.id'))
    
    # Définition du back_populates pour la relation bidirectionnelle
    agent = relationship("Agent", back_populates="documents")
