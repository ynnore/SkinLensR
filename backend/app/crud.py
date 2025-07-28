      
# backend/app/crud.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.legal_document import LegalDocument, UserLegalAgreement
from app.schemas import UserCreate, LegalDocumentCreate, UserLegalAgreementCreate
from typing import Optional
# --- Opérations CRUD pour les Utilisateurs ---
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate, hashed_password: str):
    db_user = User(email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Opérations CRUD pour les Documents Légaux ---
def get_legal_document(db: Session, doc_type: str, lang: str, version: Optional[str] = None):
    query = db.query(LegalDocument).filter(
        LegalDocument.type == doc_type,
        LegalDocument.language == lang
    )
    if version:
        return query.filter(LegalDocument.version == version).first()
    # Si aucune version n'est spécifiée, retourne la dernière version (par ordre de création)
    return query.order_by(LegalDocument.created_at.desc()).first()

def create_legal_document(db: Session, doc: LegalDocumentCreate):
    db_doc = LegalDocument(
        type=doc.type,
        version=doc.version,
        language=doc.language,
        content=doc.content
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

def record_user_agreement(db: Session, user_id: int, document_id: int):
    # Marquer les anciens accords pour ce type de document comme n'étant plus la dernière version acceptée
    # (Logique plus complexe nécessaire pour gérer l'historique et les nouvelles versions)
    # Pour l'instant, nous créons juste un nouvel enregistrement
    db_agreement = UserLegalAgreement(user_id=user_id, document_id=document_id, is_latest_version_agreed=True)
    db.add(db_agreement)
    db.commit()
    db.refresh(db_agreement)
    return db_agreement

def get_user_latest_agreement(db: Session, user_id: int, doc_type: str, lang: str):
    return db.query(UserLegalAgreement)\
        .join(LegalDocument)\
        .filter(
            UserLegalAgreement.user_id == user_id,
            LegalDocument.type == doc_type,
            LegalDocument.language == lang
        )\
        .order_by(UserLegalAgreement.agreed_at.desc())\
        .first()

    


