# /home/manik/skinlensr/SkinLensR/backend/app/models/user_legal_agreement.py
# Modèle représentant l'accord d'un utilisateur sur une version d'un document légal.
# Permet de suivre quel utilisateur a accepté quel document, à quelle date,
# et si c'est la dernière version du document.

from sqlalchemy import Column, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base

class UserLegalAgreement(Base):
    __tablename__ = "user_legal_agreements"

    # Clé primaire auto-incrémentée
    id = Column(Integer, primary_key=True, index=True)

    # Clé étrangère vers l'utilisateur ayant signé l'accord
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)

    # Clé étrangère vers le document légal signé
    document_id = Column(Integer, ForeignKey("legal_documents.id"), index=True, nullable=False)

    # Date et heure à laquelle l'utilisateur a donné son accord (par défaut date actuelle)
    agreed_at = Column(DateTime(timezone=True), server_default=func.now())

    # Booléen indiquant si l'utilisateur a accepté la dernière version de ce document
    is_latest_version_agreed = Column(Boolean, default=True)

    # Relation vers le modèle User (utilisateur)
    user = relationship("app.models.user.User", back_populates="legal_agreements")

    # Relation vers le modèle LegalDocument (document légal)
    document = relationship("app.models.legal_document.LegalDocument", back_populates="agreements")

    def __repr__(self):
        # Représentation en chaîne utile pour debug et logs
        return (
            f"<UserLegalAgreement(user_id={self.user_id}, "
            f"document_id={self.document_id}, agreed_at='{self.agreed_at}')>"
        )
