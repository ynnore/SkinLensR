from app.models.legal_document import LegalDocument
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Service pour manipuler les documents légaux
class LegalDocumentService:
    @staticmethod
    def create_legal_document(db: Session, type: str, version: str, language: str, content: str):
        try:
            db_legal_document = LegalDocument(
                type=type,
                version=version,
                language=language,
                content=content
            )
            db.add(db_legal_document)
            db.commit()
            db.refresh(db_legal_document)
            return db_legal_document
        except SQLAlchemyError as e:
            db.rollback()
            print(f"Error while creating legal document: {str(e)}")
            return None

    @staticmethod
    def get_legal_document_by_id(db: Session, document_id: int):
        return db.query(LegalDocument).filter(LegalDocument.id == document_id).first()

    @staticmethod
    def get_all_legal_documents(db: Session):
        return db.query(LegalDocument).all()

    @staticmethod
    def update_legal_document(db: Session, document_id: int, type: str, version: str, language: str, content: str):
        db_legal_document = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
        if db_legal_document:
            db_legal_document.type = type
            db_legal_document.version = version
            db_legal_document.language = language
            db_legal_document.content = content
            db.commit()
            db.refresh(db_legal_document)
            return db_legal_document
        else:
            return None

    @staticmethod
    def delete_legal_document(db: Session, document_id: int):
        db_legal_document = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
        if db_legal_document:
            db.delete(db_legal_document)
            db.commit()
            return db_legal_document
        else:
            return None
