# app/services/legal_documents.py
import logging
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.models.legal_document import LegalDocument

logger = logging.getLogger(__name__)

class LegalDocumentService:
    @staticmethod
    def create_legal_document(db: Session, type: str, version: str, language: str, content: str) -> Optional[LegalDocument]:
        try:
            doc = LegalDocument(
                type=type,
                version=version,
                language=language,
                content=content
            )
            db.add(doc)
            db.commit()
            db.refresh(doc)
            return doc
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Error while creating legal document: {e}")
            return None

    @staticmethod
    def get_legal_document_by_id(db: Session, document_id: int) -> Optional[LegalDocument]:
        return db.query(LegalDocument).filter(LegalDocument.id == document_id).first()

    @staticmethod
    def get_all_legal_documents(db: Session) -> List[LegalDocument]:
        return db.query(LegalDocument).all()

    @staticmethod
    def update_legal_document(db: Session, document_id: int, type: str, version: str, language: str, content: str) -> Optional[LegalDocument]:
        doc = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
        if not doc:
            return None
        try:
            doc.type = type
            doc.version = version
            doc.language = language
            doc.content = content
            db.commit()
            db.refresh(doc)
            return doc
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Error while updating legal document id={document_id}: {e}")
            return None

    @staticmethod
    def delete_legal_document(db: Session, document_id: int) -> Optional[LegalDocument]:
        doc = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
        if not doc:
            return None
        try:
            db.delete(doc)
            db.commit()
            return doc
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Error while deleting legal document id={document_id}: {e}")
            return None
