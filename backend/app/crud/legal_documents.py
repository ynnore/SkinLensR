from sqlalchemy.orm import Session
from app.models.legal_document import LegalDocument
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional, List

def create_legal_document(db: Session, doc_type: str, version: str, language: str, content: str) -> Optional[LegalDocument]:
    try:
        db_legal_document = LegalDocument(
            type=doc_type,  # Assure-toi que dans ton modèle c'est bien "type"
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

def get_legal_document_by_id(db: Session, document_id: int) -> Optional[LegalDocument]:
    return db.query(LegalDocument).filter(LegalDocument.id == document_id).first()

def get_all_legal_documents(db: Session) -> List[LegalDocument]:
    return db.query(LegalDocument).all()

def get_latest_legal_document(db: Session, doc_type: str) -> Optional[LegalDocument]:
    return (
        db.query(LegalDocument)
        .filter(LegalDocument.type == doc_type)
        .order_by(LegalDocument.version.desc())  # Ou par created_at si tu as ce champ
        .first()
    )

def update_legal_document(db: Session, document_id: int, doc_type: str, version: str, language: str, content: str) -> Optional[LegalDocument]:
    db_legal_document = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
    if db_legal_document:
        db_legal_document.type = doc_type
        db_legal_document.version = version
        db_legal_document.language = language
        db_legal_document.content = content
        db.commit()
        db.refresh(db_legal_document)
        return db_legal_document
    return None

def delete_legal_document(db: Session, document_id: int) -> bool:
    db_legal_document = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
    if db_legal_document:
        db.delete(db_legal_document)
        db.commit()
        return True
    return False
