from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import relationship
from .base import Base

class Memory(Base):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(Text, nullable=False)  # "user" ou "assistant"
    content = Column(Text, nullable=False)  # Message complet
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relation avec utilisateur
    user = relationship("User", back_populates="memories")
