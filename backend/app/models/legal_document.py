      
# backend/app/models/legal_document.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base # Assure-toi que ce chemin est correct

class LegalDocument(Base):
    __tablename__ = "legal_documents"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True) # Ex: "CGU", "Privacy Policy"
    version = Column(String, unique=True, index=True) # Ex: "1.0", "1.1", "2024-07-29"
    language = Column(String, index=True) # Ex: "en", "fr", "af"
    content = Column(Text, nullable=False) # Le contenu du document (Markdown, HTML, ou texte brut)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relation pour retrouver les accords spécifiques à ce document
    agreements = relationship("UserLegalAgreement", back_populates="document")

    def __repr__(self):
        return f"<LegalDocument(id={self.id}, type='{self.type}', version='{self.version}', lang='{self.language}')>"

class UserLegalAgreement(Base):
    __tablename__ = "user_legal_agreements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    document_id = Column(Integer, ForeignKey("legal_documents.id"), index=True)
    agreed_at = Column(DateTime(timezone=True), server_default=func.now())
    # Peut-être un champ pour stocker l'adresse IP ou d'autres infos de l'accord
    is_latest_version_agreed = Column(Boolean, default=True) # Indique si c'est la dernière version acceptée par l'utilisateur (utile pour les mises à jour)

    # Relations avec les autres modèles
    user = relationship("User", back_populates="legal_agreements")
    document = relationship("LegalDocument", back_populates="agreements")

    def __repr__(self):
        return f"<UserLegalAgreement(user_id={self.user_id}, doc_id={self.document_id}, agreed_at='{self.agreed_at}')>"

    