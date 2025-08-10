# /home/manik/skinlensr/SkinLensR/backend/app/api/endpoints/rag.py
# Endpoints FastAPI pour interagir avec l'agent RAG (Retrieval-Augmented Generation).

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db_session, get_current_active_user
from app.crud.rag import query_rag_agent

router = APIRouter()

@router.post("/query", summary="Interroger l'agent RAG avec un prompt")
def query_agent(
    prompt: str,
    db: Session = Depends(get_db_session),
    current_user = Depends(get_current_active_user)
):
    """
    Envoie un prompt à l'agent RAG et retourne la réponse.
    """
    result = query_rag_agent(db, prompt, current_user.id)
    return {"response": result}
