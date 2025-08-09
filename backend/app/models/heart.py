from sqlalchemy import Column, Integer, String, DateTime, Text, func
from app.models.base import Base  # importe Base depuis ton fichier base.py

class Heart(Base):
    __tablename__ = "hearts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    image_url = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Heart(id={self.id}, name={self.name})>"
