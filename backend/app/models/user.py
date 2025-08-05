from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.base import Base  # Assure-toi que ce chemin est correct

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")

    # ✅ Utilise le chemin complet vers le modèle lié
    legal_agreements = relationship(
        "app.models.user_legal_agreement.UserLegalAgreement",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"
