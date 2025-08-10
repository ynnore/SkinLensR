# /home/manik/skinlensr/SkinLensR/backend/app/models/user.py

import uuid # Si vous utilisez UUIDs pour les utilisateurs (moins courant, mais possible)
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum # Pour les énumérations

# Assurez-vous que Base est correctement importé depuis app.models.base
from app.models.base import Base

# --- Définition d'une Enum pour le Rôle Utilisateur (recommandé) ---
class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"
    # Ajoutez d'autres rôles si nécessaire (ex: guest, moderator)

class User(Base):
    """
    Modèle SQLAlchemy représentant un utilisateur enregistré dans le système.
    """
    __tablename__ = "users" # Nom de la table dans la base de données

    # Clé primaire. Un entier auto-généré est courant pour les utilisateurs.
    id = Column(Integer, primary_key=True, index=True) 

    # Informations de base
    email = Column(String, unique=True, index=True, nullable=False, comment="Adresse email de l'utilisateur (utilisée comme login)")
    hashed_password = Column(String, nullable=False, comment="Mot de passe haché de l'utilisateur")
    role = Column(String, default=UserRole.USER, index=True, nullable=False, comment="Rôle de l'utilisateur (ex: user, admin)")
    # Si vous utilisez Enum, le type serait Enum(UserRole)

    # Timestamps
    created_at = Column(DateTime, server_default=func.now()) # Ou default=datetime.utcnow
    updated_at = Column(DateTime, server_default=func.now(), onupdate=datetime.utcnow) # Ou onupdate=func.now()

    # Relations (si définies)
    # Par exemple, si un utilisateur a plusieurs entrées de progression :
    # progress_entries = relationship("Progress", back_populates="user")
    # Si un utilisateur a plusieurs accords légaux :
    # legal_agreements = relationship("UserLegalAgreement", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"