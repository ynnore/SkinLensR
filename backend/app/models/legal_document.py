# /home/manik/skinlensr/SkinLensR/backend/app/models/legal_document.py

from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum # Pour définir les types d'énumération si nécessaire

# Assurez-vous que Base est correctement importé depuis app.models.base
from app.models.base import Base

# --- Définition d'un Enum pour le statut ou le type, si nécessaire ---
# Par exemple, pour le statut :
class DocumentStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

# Par exemple, pour les types de documents :
# class DocumentType(str, enum.Enum):
#     TERMS_OF_USE = "CGU"
#     PRIVACY_POLICY = "PrivacyPolicy"
#     TERMS_AND_CONDITIONS = "CGV"


class LegalDocument(Base):
    """
    Modèle SQLAlchemy représentant un document légal.
    Stocke différentes versions des documents légaux.
    """
    __tablename__ = "legal_documents" # Nom de la table dans la base de données

    # Clé primaire pour le document
    id = Column(Integer, primary_key=True, index=True) 

    # Informations sur le document
    type = Column(String, index=True, nullable=False, comment="Type de document légal (ex: CGU, Politique de confidentialité)")
    version = Column(String, index=True, nullable=False, comment="Version du document (ex: 1.0.0)")
    language = Column(String(length=5), index=True, nullable=False, comment="Code langue ISO 639-1 (ex: fr, en)")
    title = Column(String, nullable=False, comment="Titre lisible du document")
    content = Column(Text, nullable=False, comment="Contenu complet du document") # Pour le texte du document

    # Statut du document (optionnel, peut être utile pour le workflow)
    # status = Column(Enum(DocumentStatus), default=DocumentStatus.DRAFT)

    # Timestamps
    created_at = Column(DateTime, server_default=func.now()) # Ou default=datetime.utcnow si func.now() n'est pas dispo ou souhaité
    updated_at = Column(DateTime, server_default=func.now(), onupdate=datetime.utcnow) # Ou onupdate=func.now()

    # Relations (si un utilisateur accepte un document légal spécifique)
    # Par exemple, si vous avez une table UserLegalAgreement qui lie les utilisateurs aux documents :
    # user_agreements = relationship("UserLegalAgreement", back_populates="legal_document")

    def __repr__(self):
        return f"<LegalDocument(id={self.id}, type='{self.type}', version='{self.version}', lang='{self.language}')>"