from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.dependencies import get_db_session, get_current_active_user
from app.schemas.agent_document import AgentDocumentRead, AgentDocumentCreate
from app.crud.agent_document import get_agent_documents, create_agent_document

router = APIRouter()

@router.get("/", response_model=List[AgentDocumentRead])
def list_agent_documents(db: Session = Depends(get_db_session), current_user = Depends(get_current_active_user)):
    return get_agent_documents(db, current_user.id)

@router.post("/", response_model=AgentDocumentRead)
def add_agent_document(doc_create: AgentDocumentCreate, db: Session = Depends(get_db_session), current_user = Depends(get_current_active_user)):
    return create_agent_document(db, current_user.id, doc_create)