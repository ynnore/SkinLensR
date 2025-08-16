# On s'assure d'importer Boolean pour le champ `is_active`
from sqlalchemy import Column, Integer, String, DateTime, Enum, Boolean 
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.models.base import Base

# --- Définition d'une énumération pour le rôle utilisateur ---
class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"

class User(Base):
    """
    Modèle SQLAlchemy représentant un utilisateur enregistré dans le système.
    Cette version est synchronisée avec la logique du fichier CRUD.
    """
    __tablename__ = "users"

    # --- Clé primaire ---
    id = Column(Integer, primary_key=True, index=True)

    # --- Informations principales ---
    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
        comment="Adresse email de l'utilisateur"
    )
    hashed_password = Column(
        String,
        nullable=False,
        comment="Mot de passe haché de l'utilisateur"
    )

    # --- CHAMP AJOUTÉ POUR CORRIGER L'ERREUR ---
    # Ce champ est utilisé dans `crud/user.py` mais n'était pas défini ici.
    full_name = Column(String, index=True, nullable=True)

    # --- CHAMP ÉGALEMENT AJOUTÉ ---
    # Ce champ est aussi utilisé dans `crud/user.py` (`is_active=True`).
    is_active = Column(Boolean, default=True)

    # --- Rôle de l'utilisateur ---
    role = Column(
        Enum(UserRole),
        default=UserRole.USER,
        index=True,
        nullable=False,
        comment="Rôle de l'utilisateur"
    )

    # --- Dates de création et modification ---
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )

    # --- Relations ---
    memories = relationship(
        "Memory",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        """
        Représentation lisible de l'objet User (utile pour debug/logs).
        """
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"