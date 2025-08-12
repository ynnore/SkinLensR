from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from app.models.base import Base

# --- Définition d'une Enum pour le rôle utilisateur ---
class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"

class User(Base):
    """
    Modèle SQLAlchemy représentant un utilisateur enregistré dans le système.
    """
    __tablename__ = "users"

    # Clé primaire
    id = Column(Integer, primary_key=True, index=True)

    # Informations de base
    email = Column(String, unique=True, index=True, nullable=False, comment="Adresse email de l'utilisateur")
    hashed_password = Column(String, nullable=False, comment="Mot de passe haché de l'utilisateur")
    role = Column(Enum(UserRole), default=UserRole.USER, index=True, nullable=False, comment="Rôle de l'utilisateur")

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relations
    memories = relationship("Memory", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"
