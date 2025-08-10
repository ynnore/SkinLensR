# /home/manik/skinlensr/SkinLensR/backend/app/models/legal_document.py

from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SQLAlchemyEnum # Renommé Enum pour éviter conflit
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum # Importé pour utiliser enum.Enum

# Assurez-vous que Base est correctement importé depuis app.models.base
from app.models.base import Base

# --- Définition d'un Enum pour le statut ou le type, si nécessaire ---
# Par exemple, pour le statut :
class DocumentStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

# Par exemple, pour les types de documents :
# DÉCOMMENTEZ CETTE CLASSE POUR CORRIGER L'IMPORT ERROR
class LegalDocumentType(str, enum.Enum): # <-- DÉCOMMENTEZ CETTE LIGNE
    TERMS_OF_USE = "CGU"
    PRIVACY_POLICY = "PrivacyPolicy"
    TERMS_AND_CONDITIONS = "CGV"


class LegalDocument(Base):
    """
    Modèle SQLAlchemy représentant un document légal.
    Stocke différentes versions des documents légaux.
    """
    __tablename__ = "legal_documents" # Nom de la table dans la base de données

    id = Column(Integer, primary_key=True, index=True)

    # Informations sur le document
    # CORRECTION : Utilisation de LegalDocumentType pour le champ type
    # Assurez-vous que le nom du champ correspond bien à ce que vous importez et utilisez.
    # Si vous utilisez le type Enum de SQLAlchemy, ce serait Column(SQLAlchemyEnum(LegalDocumentType), ...)
    type = Column(String, index=True, nullable=False, default=LegalDocumentType.TERMS_OF_USE, comment="Type de document légal") # <-- Utilise maintenant LegalDocumentType
    version = Column(String, index=True, nullable=False, comment="Version du document (ex: 1.0.0)")
    language = Column(String(length=5), index=True, nullable=False, comment="Code langue ISO 639-1 (ex: fr, en)")
    title = Column(String, nullable=False, comment="Titre lisible du document")
    content = Column(Text, nullable=False, comment="Contenu complet du document")

    # Statut du document (optionnel, peut être utile pour le workflow)
    status = Column(SQLAlchemyEnum(DocumentStatus), default=DocumentStatus.DRAFT) # Exemple d'utilisation de l'autre Enum

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=datetime.utcnow)

    # Relations (si un utilisateur accepte un document légal spécifique)
    # ...

    def __repr__(self):
        return f"<LegalDocument(id={self.id}, type='{self.type}', version='{self.version}', lang='{self.language}')>"