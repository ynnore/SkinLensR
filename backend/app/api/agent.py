from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.dependencies import get_db_session, get_current_active_user

router = APIRouter()

@router.get("/")
def read_agents(db: Session = Depends(get_db_session)):
    # Retourner la liste des agents (placeholder)
    return {"agents": []}

