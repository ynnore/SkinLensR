# /home/manik/skinlensr/SkinLensR/backend/app/models/progress.py

from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.user import User  # Assurez-vous que ce modèle est bien importé

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Relation avec le modèle User
    step = Column(String, nullable=False)  # Par exemple : "signed_terms", "completed_profile"
    completed = Column(Integer, default=0)  # 0 = non terminé, 1 = terminé

    user = relationship("User", back_populates="progress")  # Définir la relation avec l'utilisateur

    def __repr__(self):
        return f"<Progress(user_id={self.user_id}, step='{self.step}', completed={self.completed})>"
