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

    agreements = relationship(
        "UserLegalAgreement",
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


class UserLegalAgreement(Base):
    __tablename__ = "user_legal_agreements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    document_id = Column(Integer, ForeignKey("legal_documents.id", ondelete="CASCADE"), index=True, nullable=False)
    agreed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    is_latest_version_agreed = Column(Boolean, default=True, nullable=False)

    user = relationship("User", back_populates="legal_agreements")
    document = relationship("LegalDocument", back_populates="agreements")

    def __repr__(self):
        return (
            f"<UserLegalAgreement(user_id={self.user_id}, "
            f"document_id={self.document_id}, agreed_at='{self.agreed_at}')>"
        )
