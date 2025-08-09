# app/models/user_legal_agreement.py
# Modèle représentant un accord juridique accepté par un utilisateur

from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base


class UserLegalAgreement(Base):
    __tablename__ = "user_legal_agreements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    document_id = Column(Integer, ForeignKey("legal_documents.id", ondelete="CASCADE"), nullable=False)

    # True si l'accord correspond à la dernière version du document
    is_latest_version_agreed = Column(Boolean, default=False, nullable=False)

    # Relations
    user = relationship("User", back_populates="legal_agreements")
    document = relationship("LegalDocument", back_populates="agreements")

    def __repr__(self):
        return (
            f"<UserLegalAgreement(user_id={self.user_id}, "
            f"document_id={self.document_id}, latest={self.is_latest_version_agreed})>"
        )
