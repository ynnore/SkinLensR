# /home/manik/skinlensr/SkinLensR/backend/app/api/agent_interface.py

import logging
from typing import Dict, Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
import json # Pour les messages WebSocket potentiels

# Importez les schémas Pydantic nécessaires pour le chat et potentiellement pour la voix/vidéo
from app.schemas.chat import ( # Supposons que les schémas de chat sont ici
    MessageSendRequest, MessageResponse
)
# Si vous avez des schémas spécifiques pour l'agent vocal ou le langage des signes :
# from app.schemas.agent_interface import VoiceRequest, SignLanguageRequest, AgentResponseWithAudio

# Importez les services nécessaires
from app.services.chat_service import ChatService
from app.services.huggingface import HuggingFaceService
# Importez votre LLM client si le chat l'utilise directement
from app.services.openai_compatible_llm import OpenAICompatibleLLM

# Importez les dépendances
from app.database import get_db
from app.core.dependencies import (
    get_current_user,
    get_chat_service,
    get_huggingface_service, # Si HF est utilisé pour la voix ou les signes
    get_openai_compatible_llm # Si le LLM est utilisé pour générer la réponse textuelle avant la synthèse vocale
)

router = APIRouter(
    prefix="/agent-interface", # Préfixe pour les interactions spécifiques de l'agent
    tags=["Agent Interface"],
    dependencies=[Depends(get_current_user)] # Nécessite un utilisateur authentifié
)

logger = logging.getLogger(__name__)

# --- Dépendances ---
# Vous avez déjà get_chat_service et get_openai_compatible_llm.
# Si HuggingFaceService est utilisé pour la génération vocale ou le traitement de signes,
# vous aurez aussi besoin de get_huggingface_service.

# --- Routes pour la Synthèse Vocale ---
# Le bouton "Parler" dans l'interface "Synthèse Vocale"
@router.post("/speak", response_model=MessageResponse) # Peut retourner la réponse du bot
async def synthesize_speech_from_text(
    message_request: MessageSendRequest, # Le message utilisateur
    chat_service: ChatService = Depends(get_chat_service),
    current_user: Any = Depends(get_current_user)
):
    """
    Envoie un message texte à l'agent, récupère sa réponse textuelle,
    et potentiellement déclenche la synthèse vocale (si le service le gère).
    Ici, on retourne la réponse textuelle du bot. La synthèse vocale côté client
    utilisera ce texte.
    """
    logger.info(f"User {current_user.id} sending message for speech synthesis: '{message_request.content[:50]}...'")
    
    # On réutilise la logique de send_message du chat service
    try:
        response = await chat_service.send_message(message_request)
        logger.info(f"Received bot response for speech synthesis.")
        return response
        
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Error during speech synthesis request for user {current_user.id}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to process speech synthesis: {e}")

# --- Routes pour la Voix de l'Agent (Vocodeur) ---
# Ceci pourrait impliquer des WebSockets ou des requêtes audio plus complexes.
# Si le vocodeur prend l'audio de l'utilisateur et renvoie un texte traité :

# @router.websocket("/ws/voice")
# async def voice_transmission_websocket(
#     websocket: WebSocket,
#     chat_service: ChatService = Depends(get_chat_service), # Peut-être un service différent pour le vocodeur ?
#     current_user: Any = Depends(get_current_user)
# ):
#     await websocket.accept()
#     logger.info(f"Voice transmission WebSocket connected for user {current_user.id}.")
#     try:
#         while True:
#             audio_data = await websocket.receive_bytes() # Recevoir les données audio
#             # Traiter l'audio: transcrire (Speech-to-Text), envoyer à l'agent, recevoir réponse textuelle
#             # transcription = await speech_to_text_service.transcribe(audio_data) # Service STT
#             # response = await chat_service.send_message(
#             #     conversation_id="some_conv_id", sender_id=str(current_user.id), content=transcription
#             # )
#             # text_to_speak = response.bot_response.content
#             # Convertir le texte en audio et le renvoyer (Text-to-Speech)
#             # audio_response_bytes = await text_to_speech_service.synthesize(text_to_speak)
#             # await websocket.send_bytes(audio_response_bytes)
#     except WebSocketDisconnect:
#         logger.info(f"Voice transmission WebSocket disconnected for user {current_user.id}.")
#     except Exception as e:
#         logger.error(f"WebSocket voice error for user {current_user.id}: {e}")
#         await websocket.close(code=1011)

# --- Routes pour la Communication Silencieuse (Langage des Signes) ---
# Cela impliquerait probablement l'analyse vidéo via webcam.

# @router.post("/sign-language/process", response_model=Dict[str, Any]) # Ex: {'text_translation': 'Hello'}
# async def process_sign_language(
#     video_chunk: Optional[bytes] = File(None), # Ou un flux vidéo WebSocket
#     prompt: str = "", # Peut-être un prompt pour l'interprétation
#     agent_id: Optional[str] = None, # Si l'interprétation dépend d'un agent spécifique
#     # hf_service: HuggingFaceService = Depends(get_huggingface_service), # Si le modèle SignGemma est via HF
#     current_user: Any = Depends(get_current_user)
# ):
#     """
#     Traite des données vidéo (ou un flux) pour reconnaître le langage des signes et le traduire en texte.
#     Nécessite une intégration avec un modèle comme SignGemma ou similaire.
#     """
#     logger.info(f"Processing sign language for user {current_user.id} with agent {agent_id}.")
    
#     if not video_chunk:
#         # Gérer le cas où il n'y a pas de données vidéo (ex: via WebSocket, ou fichier manquant)
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No video data provided.")
        
#     try:
#         # Ici, vous appellerez votre modèle de langage des signes
#         # translation_result = await hf_service.process_sign_language_video(video_chunk, prompt=prompt, agent_id=agent_id)
#         # Placeholder:
#         translation_result = {"text_translation": "This is a placeholder translation for sign language."}
#         logger.info(f"Sign language processing result: {translation_result}")
#         return translation_result
        
#     except Exception as e:
#         logger.error(f"Error processing sign language for user {current_user.id}: {e}")
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to process sign language: {e}")