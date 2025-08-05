from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Boolean,
    UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base  # Assure-toi que ce chemin est correct


class LegalDocument(Base):
    __tablename__ = "legal_documents"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True)  # Ex: "CGU", "Privacy Policy"
    version = Column(String, index=True)  # Ex: "1.0", "2024-07-29"
    language = Column(String, index=True)  # Ex: "en", "fr", "af"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # ✅ Relation corrigée avec chemin complet
    agreements = relationship(
        "app.models.user_legal_agreement.UserLegalAgreement",
        back_populates="document",
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        UniqueConstraint('type', 'version', 'language', name='uq_legal_document_type_version_lang'),
    )

    def __repr__(self):
        return (
            f"<LegalDocument(id={self.id}, type='{self.type}', "
            f"version='{self.version}', lang='{self.language}')>"
        )
