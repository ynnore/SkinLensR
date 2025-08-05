# ~/skinlensr/SkinLensR/backend/app/crud/operations.py

from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas import UserCreate, LegalDocumentCreate, UserLegalAgreementCreate, AgentDocumentCreate
from app.auth import get_password_hash, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import datetime, timedelta
from app.models.legal_document import LegalDocument
from app.models.user_legal_agreement import UserLegalAgreement
from app.models.agent_document import AgentDocument # Assurez-vous que ce modèle est importé correctement

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate, hashed_password: str):
    db_user = User(email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ... Ajoutez ici toutes vos autres fonctions CRUD ...
# Par exemple :
def get_legal_document(db: Session, type: str, language: str, version: str):
    return db.query(LegalDocument).filter(LegalDocument.type == type, LegalDocument.language == language, LegalDocument.version == version).first()

def create_legal_document(db: Session, doc: LegalDocumentCreate, hashed_password: str = None): # Si hashed_password n'est pas utilisé ici, retirez-le ou mettez une valeur par défaut appropriée
    db_doc = LegalDocument(type=doc.type, content=doc.content, language=doc.language, version=doc.version)
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

def get_latest_legal_document(db: Session, doc_type: str, lang: str):
    return db.query(LegalDocument).filter(LegalDocument.type == doc_type, LegalDocument.language == lang).order_by(LegalDocument.version.desc()).first()

def record_user_agreement(db: Session, user_id: int, document_id: int):
    # Assurez-vous que le schéma et le modèle correspondent
    agreement = UserLegalAgreement(user_id=user_id, document_id=document_id, agreed_at=datetime.utcnow())
    db.add(agreement)
    db.commit()
    db.refresh(agreement)
    return agreement

def get_agent_document(db: Session, document_id: int):
    return db.query(AgentDocument).filter(AgentDocument.id == document_id).first()

# Si vous avez une fonction pour créer un document agent :
def create_agent_document(db: Session, doc_data, embedding): # Adaptez les paramètres si nécessaire
    db_document = AgentDocument(
        title=doc_data.title,
        content=doc_data.content,
        source=doc_data.source,
        embedding=embedding
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document