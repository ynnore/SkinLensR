from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.base import Base  # Vérifie que ce chemin est correct

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)  # Ajouté
    email = Column(String, unique=True, index=True)
    password = Column(String)  # ⚠️ renommé depuis hashed_password
    role = Column(String, default="user")

    legal_agreements = relationship("UserLegalAgreement", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"
