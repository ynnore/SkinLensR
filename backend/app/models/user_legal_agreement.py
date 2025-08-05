from sqlalchemy import Column, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base

class UserLegalAgreement(Base):
    __tablename__ = "user_legal_agreements"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    document_id = Column(Integer, ForeignKey("legal_documents.id"), index=True, nullable=False)
    agreed_at = Column(DateTime(timezone=True), server_default=func.now())
    is_latest_version_agreed = Column(Boolean, default=True)

    # ✅ Relations corrigées avec chemins complets
    user = relationship("app.models.user.User", back_populates="legal_agreements")
    document = relationship("app.models.legal_document.LegalDocument", back_populates="agreements")

    def __repr__(self):
        return (
            f"<UserLegalAgreement(user_id={self.user_id}, "
            f"doc_id={self.document_id}, agreed_at='{self.agreed_at}')>"
        )
