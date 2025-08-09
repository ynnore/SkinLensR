from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db_session, get_current_active_user
from app.crud.rag import query_rag_agent

router = APIRouter()

@router.post("/query")
def query_agent(prompt: str, db: Session = Depends(get_db_session), current_user = Depends(get_current_active_user)):
    result = query_rag_agent(db, prompt, current_user.id)
    return {"response": result}