from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.memory_manager import MemoryManager
from app.database import get_db
from app import models, schemas
from app.utils.security import get_current_user

router = APIRouter()

@router.post("/chat", response_model=schemas.ChatResponse)
async def chat_with_agent(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    memory = MemoryManager(db, current_user.id)
    memory.save_message("user", request.message)

    prompt = memory.build_prompt_with_context(request.message)
    reply = await memory.query_model(prompt, provider="huggingface")

    memory.save_message("assistant", reply)
    return schemas.ChatResponse(reply=reply)
