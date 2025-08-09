import logging
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.models.legal_document import LegalDocument

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

class LegalDocumentService:
    @staticmethod
    def create_legal_document(db: Session, type: str, version: str, language: str, content: str) -> Optional[LegalDocument]:
        try:
            doc = LegalDocument(type=type, version=version, language=language, content=content)
            db.add(doc)
            db.commit()
            db.refresh(doc)
            logger.debug(f"Created LegalDocument id={doc.id}")
            return doc
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Error creating LegalDocument: {e}")
            return None

    @staticmethod
    def get_legal_document_by_id(db: Session, document_id: int) -> Optional[LegalDocument]:
        doc = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
        if doc:
            logger.debug(f"Found LegalDocument id={document_id}")
        else:
            logger.debug(f"No LegalDocument found with id={document_id}")
        return doc

    @staticmethod
    def get_all_legal_documents(db: Session) -> List[LegalDocument]:
        docs = db.query(LegalDocument).all()
        logger.debug(f"Retrieved {len(docs)} legal documents")
        return docs

    @staticmethod
    def update_legal_document(db: Session, document_id: int, type: str, version: str, language: str, content: str) -> Optional[LegalDocument]:
        doc = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
        if not doc:
            logger.debug(f"No LegalDocument found to update with id={document_id}")
            return None
        try:
            doc.type = type
            doc.version = version
            doc.language = language
            doc.content = content
            db.commit()
            db.refresh(doc)
            logger.debug(f"Updated LegalDocument id={document_id}")
            return doc
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Error updating LegalDocument id={document_id}: {e}")
            return None

    @staticmethod
    def delete_legal_document(db: Session, document_id: int) -> Optional[LegalDocument]:
        doc = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
        if not doc:
            logger.debug(f"No LegalDocument found to delete with id={document_id}")
            return None
        try:
            db.delete(doc)
            db.commit()
            logger.debug(f"Deleted LegalDocument id={document_id}")
            return doc
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Error deleting LegalDocument id={document_id}: {e}")
            return None
