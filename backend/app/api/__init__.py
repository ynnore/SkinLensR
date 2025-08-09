from fastapi import APIRouter

from app.api.endpoints import auth, users, legal, progress, agent_documents, rag, settings

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(legal.router, prefix="/legal", tags=["legal"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
api_router.include_router(agent_documents.router, prefix="/agent_documents", tags=["agent_documents"])
api_router.include_router(rag.router, prefix="/rag", tags=["rag"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
