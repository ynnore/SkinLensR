# backend/app/models/user.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.models.base import Base # Assure-toi que ce chemin est correct

class User(Base):
    __tablename__ = "users" # Nom de la table dans la base de données

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user") # 'user', 'partner', 'investor', 'admin'

    # Relation inverse vers UserLegalAgreement
    # Assurez-vous que 'UserLegalAgreement' est bien le nom de la classe de votre modèle
    legal_agreements = relationship("UserLegalAgreement", back_populates="user")

    # Une représentation pour l'affichage (optionnel, mais utile)
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"