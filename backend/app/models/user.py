from sqlalchemy import Column, Integer, String, DateTime, Enum  # Import des types de colonnes SQLAlchemy
from sqlalchemy.orm import relationship  # Gestion des relations entre modèles
from sqlalchemy.sql import func  # Fonctions SQL, ici utilisé pour timestamps automatiques
from datetime import datetime
import enum  # Module Python pour créer des énumérations

from app.models.base import Base  # Base commune à tous les modèles SQLAlchemy

# --- Définition d'une énumération pour le rôle utilisateur ---
class UserRole(str, enum.Enum):
    """
    Définition des rôles possibles pour un utilisateur.
    Hérite de `str` et `enum.Enum` pour être stocké en tant que texte en DB.
    """
    USER = "user"   # Utilisateur standard
    ADMIN = "admin" # Administrateur

class User(Base):
    """
    Modèle SQLAlchemy représentant un utilisateur enregistré dans le système.
    """
    __tablename__ = "users"  # Nom de la table dans la base de données

    # --- Clé primaire ---
    id = Column(Integer, primary_key=True, index=True)  # Identifiant unique de l'utilisateur

    # --- Informations principales ---
    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
        comment="Adresse email de l'utilisateur"
    )  # Email unique obligatoire

    hashed_password = Column(
        String,
        nullable=False,
        comment="Mot de passe haché de l'utilisateur"
    )  # Mot de passe stocké sous forme de hash

    role = Column(
        Enum(UserRole),
        default=UserRole.USER,
        index=True,
        nullable=False,
        comment="Rôle de l'utilisateur"
    )  # Rôle : user ou admin

    # --- Dates de création et modification ---
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()  # Remplie automatiquement à l'insertion
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()  # Mise à jour automatique lors de la modification
    )

    # --- Relations ---
    memories = relationship(
        "Memory",  # Nom de la classe cible (doit exister dans app/models/memory.py)
        back_populates="user",  # L'autre côté de la relation (défini dans Memory)
        cascade="all, delete-orphan"  # Supprime les "Memory" si l'utilisateur est supprimé
    )

    def __repr__(self):
        """
        Représentation lisible de l'objet User (utile pour debug/logs).
        """
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"
