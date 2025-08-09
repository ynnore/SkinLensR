# app/models/progress.py
# Modèle représentant l'avancement ("progress") d'un utilisateur dans l'application

from sqlalchemy import Column, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.models.base import Base


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Exemple : pourcentage d'avancement (0 à 100)
    completion = Column(Float, default=0.0, nullable=False)

    # Relation vers l'utilisateur
    user = relationship("User", back_populates="progress")

    def __repr__(self):
        return f"<Progress(user_id={self.user_id}, completion={self.completion}%)>"
