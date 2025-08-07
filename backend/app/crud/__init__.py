from sqlalchemy.orm import Session
from app.models.user import User
from app.auth import get_password_hash
from app.crud.record_user_agreement import record_user_agreement 
from app.crud.agent_documents import get_agent_document
# app/crud/__init__.py
from app.crud.agent_documents import get_agent_document, create_agent_document

from .legal_documents import (
    get_legal_document,
    get_latest_legal_document,
    create_legal_document,
)

def create_user(db: Session, email: str, password: str, role: str = "user"):
    hashed_password = get_password_hash(password)
    new_user = User(email=email, hashed_password=hashed_password, role=role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()
