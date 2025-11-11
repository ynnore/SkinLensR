import os
import logging
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from google import genai 
from google.genai.errors import APIError 

from app.schemas.chat import ConversationCreate, ConversationResponse, MessageSendRequest, MessageResponse
from app.services.chat_service import ChatService
from app.core.dependencies import get_chat_service, get_current_user

router = APIRouter(tags=["Chat API"])
logger = logging.getLogger(__name__)

# ===================================================================
# CONFIGURATION GEMINI/VERTEX AI AVEC FALLBACK
# ===================================================================
PROJECT_ID = "kiwi-ops-platform"
REGION = "us-central1"

MODEL_PRIMARY = "gemini-2.5-flash"
MODEL_FALLBACK = "gemini-1.5-pro"

gemini_client = None
try:
    gemini_client = genai.Client(
        vertexai=True,      # <-- Correction ici
        project=PROJECT_ID,
        location=REGION
    )
    logger.info("Gemini Client initialized successfully for Vertex AI.")
except Exception as e:
    logger.critical(f"FATAL: Failed to initialize Gemini Client. Call to /chat/nim will fail. Error: {e}")

# ===================================================================
# ENDPOINT DE DÉMO /chat/nim
# ===================================================================
class NimChatRequest(BaseModel):
    question: str

def get_gemini_response(question: str) -> str:
    if gemini_client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Le service Gemini LLM n'a pas pu être initialisé. Vérifiez l'authentification gcloud et les permissions de Vertex AI."
        )

    for model_name in [MODEL_PRIMARY, MODEL_FALLBACK]:
        try:
            logger.info(f"Trying Gemini model: {model_name}")
            response = gemini_client.models.generate_content(
                model=model_name,
                contents=question,
                config=genai.types.GenerateContentConfig(temperature=0.5)
            )
            logger.info(f"Gemini model {model_name} returned a response.")
            return response.text
        except APIError as e:
            logger.warning(f"Model {model_name} unavailable: {e}. Trying fallback...")
        except Exception as e:
            logger.error(f"Unexpected error with model {model_name}: {e}")

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail=f"Service LLM indisponible pour tous les modèles ({MODEL_PRIMARY}, {MODEL_FALLBACK})."
    )

@router.post("/nim", tags=["Chat GEMINI (Démo)"], dependencies=[])
def chat_with_nim(request: NimChatRequest):
    logger.info(f"Received request for GEMINI chat: {request.question}")
    llm_response = get_gemini_response(request.question)
    return {"response": llm_response}

# ===================================================================
# ROUTES EXISTANTES (PROTÉGÉES)
# ===================================================================
@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_new_conversation(
    conversation_data: ConversationCreate,
    chat_service: ChatService = Depends(get_chat_service),
    current_user: Any = Depends(get_current_user)
):
    conversation_data.user_id = current_user.id 
    return await chat_service.create_conversation(conversation_data)

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation_details(
    conversation_id: str,
    chat_service: ChatService = Depends(get_chat_service),
    current_user: Any = Depends(get_current_user)
):
    conversation = await chat_service.get_conversation(conversation_id)
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    return conversation

@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
async def send_message_to_conversation(
    conversation_id: str,
    message_request: MessageSendRequest,
    chat_service: ChatService = Depends(get_chat_service),
    current_user: Any = Depends(get_current_user)
):
    message_request.conversation_id = conversation_id
    return await chat_service.send_message(message_request)
