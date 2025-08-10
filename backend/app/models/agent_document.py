from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.models.base import Base  # Assure-toi que Base est bien défini dans app/models/base.py

class AgentDocument(Base):
    __tablename__ = "agent_documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
