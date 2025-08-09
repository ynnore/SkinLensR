from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.dependencies import get_db_session, get_current_active_user
from app.schemas.legal import LegalDocumentRead, UserLegalAgreementCreate
from app.crud.legal import get_latest_legal_documents, record_user_agreement, get_user_legal_status

router = APIRouter()

@router.get("/documents", response_model=List[LegalDocumentRead])
def list_latest_legal_documents(db: Session = Depends(get_db_session)):
    return get_latest_legal_documents(db)

@router.post("/agreement")
def user_agree_to_document(agreement_data: UserLegalAgreementCreate, db: Session = Depends(get_db_session), current_user = Depends(get_current_active_user)):
    record_user_agreement(db, current_user.id, agreement_data.document_id)
    return {"msg": "Agreement recorded"}

@router.get("/status")
def legal_status(db: Session = Depends(get_db_session), current_user = Depends(get_current_active_user)):
    status = get_user_legal_status(db, current_user)
    return status
