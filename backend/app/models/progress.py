# /home/manik/skinlensr/SkinLensR/backend/app/models/progress.py
# Modèle Progress pour suivre l'état d'avancement des utilisateurs sur différentes étapes
# (ex. signature de documents, complétion du profil). Chaque progression est liée à un utilisateur (User).

from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from app.models.base import Base

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Relation vers User
    step = Column(String, nullable=False)  # Exemple : "signed_terms", "completed_profile"
    completed = Column(Integer, default=0)  # 0 = non terminé, 1 = terminé

    # Relation vers User par chaîne pour éviter import circulaire
    user = relationship("User", back_populates="progress")

    def __repr__(self):
        return f"<Progress(user_id={self.user_id}, step='{self.step}', completed={self.completed})>"
