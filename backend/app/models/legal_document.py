# app/models/legal_document.py
# Modèle représentant un document légal (conditions d'utilisation, politique de confidentialité, etc.)

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.base import Base


class LegalDocument(Base):
    __tablename__ = "legal_documents"

    id = Column(Integer, primary_key=True, index=True)

    # Type du document : "terms_of_service", "privacy_policy", etc.
    type = Column(String, nullable=False)

    # Langue : "fr", "en", etc.
    language = Column(String, nullable=False)

    # Version du document (entier)
    version = Column(Integer, nullable=False)

    # Contenu texte (long)
    content = Column(String, nullable=False)

    # Relation vers les UserLegalAgreement liés à ce document
    agreements = relationship(
        "UserLegalAgreement",
        back_populates="document",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return (
            f"<LegalDocument(id={self.id}, type={self.type}, lang={self.language}, version={self.version})>"
        )
