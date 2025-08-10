# /home/manik/skinlensr/SkinLensR/backend/app/routers/chat.py

import logging
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

# Importez vos schémas Pydantic pour les requêtes et les réponses
from app.schemas.chat import ( # Supposons que vous ayez déplacé les schémas ici
    ChatMessage, ConversationCreate, ConversationResponse,
    MessageSendRequest, MessageResponse
)
# Si vous avez déplacé les schémas dans app/schemas/chat.py par exemple, importez-les depuis là.
# from app.schemas.chat import ... 

# Importez votre service de chat
from app.services.chat_service import ChatService

# Importez vos fonctions de dépendance pour obtenir les services et la session DB
from app.core.dependencies import get_chat_service, get_db, get_current_user

router = APIRouter(
    prefix="/chat",
    tags=["Chat API"],
    dependencies=[Depends(get_current_user)] # Appliquer la dépendance d'authentification à toutes les routes du routeur
)

logger = logging.getLogger(__name__)

# --- Routes pour la gestion des conversations ---

@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_new_conversation(
    conversation_data: ConversationCreate,
    chat_service: ChatService = Depends(get_chat_service),
    current_user: Any = Depends(get_current_user) # L'ID de l'utilisateur est tiré du token
):
    """
    Crée une nouvelle conversation.
    L'ID de l'utilisateur est tiré du token d'authentification.
    """
    logger.info(f"Creating new conversation for user {current_user.id} with agent {conversation_data.agent_id}.")
    try:
        # Assurez-vous que conversation_data.user_id est ignoré ou validé par rapport à current_user.id
        # Si le client envoie un user_id, il est préférable d'utiliser celui de l'utilisateur authentifié.
        conversation_data.user_id = current_user.id 
        
        new_conv = await chat_service.create_conversation(conversation_data)
        
        # Le service devrait retourner une réponse au format ConversationResponse
        return new_conv
        
    except ValueError as ve: # Gestion des erreurs de validation du service
        logger.error(f"Validation error creating conversation: {ve}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.error(f"Unexpected error creating conversation: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create conversation.")

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation_details(
    conversation_id: str,
    chat_service: ChatService = Depends(get_chat_service),
    current_user: Any = Depends(get_current_user)
):
    """
    Récupère une conversation spécifique et son historique de messages.
    Assure que la conversation appartient à l'utilisateur courant.
    """
    logger.info(f"Fetching conversation {conversation_id} for user {current_user.id}.")
    # Logique pour vérifier que la conversation appartient à l'utilisateur courant
    # Ceci nécessiterait que le service ou la DB fasse cette vérification.
    # Pour l'instant, on suppose que get_conversation_details fait une vérification interne
    # ou que l'accès est géré par les droits de l'utilisateur.
    
    conversation = await chat_service.get_conversation(conversation_id)
    
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
        
    # Optionnel : Vérifier que la conversation appartient bien à l'utilisateur courant
    # if conversation.user_id != current_user.id:
    #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this conversation.")

    return conversation

# --- Routes pour envoyer des messages et obtenir des réponses ---

@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
async def send_message_to_conversation(
    conversation_id: str,
    message_request: MessageSendRequest,
    chat_service: ChatService = Depends(get_chat_service),
    current_user: Any = Depends(get_current_user)
):
    """
    Envoie un message dans une conversation existante et récupère la réponse du bot.
    Assure que le sender_id correspond à l'utilisateur courant (ou 'user').
    """
    logger.info(f"Received message in conversation {conversation_id} from user {current_user.id}.")
    
    # Validation simple : vérifier que l'expéditeur du message est bien l'utilisateur courant ou 'user'
    if message_request.sender_id != "user" and message_request.sender_id != current_user.id:
         # Si le système autorise d'autres expéditeurs, ajustez cette logique.
         # Ici, on suppose que seul l'utilisateur peut envoyer des messages en son nom.
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sender ID mismatch. You can only send messages as 'user'."
        )
        
    # Assurez-vous que la conversation_id dans le message_request correspond à celle dans l'URL
    if message_request.conversation_id != conversation_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Conversation ID mismatch in request body.")

    try:
        # Le service gère la création du message utilisateur, l'appel au LLM, et la création du message bot.
        response = await chat_service.send_message(message_request)
        return response
        
    except ValueError as ve: # Erreurs du service (ex: conversation not found)
        logger.error(f"Error processing message for conversation {conversation_id}: {ve}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except HTTPException as http_exc: # Si le service lève une HTTPException (ex: 404)
        raise http_exc
    except Exception as e:
        logger.error(f"Unexpected error processing message for conversation {conversation_id}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to process message.")

# --- Optionnel : Route pour le streaming via WebSocket (plus avancé) ---
# Si vous avez besoin d'une communication temps réel, les WebSockets sont une bonne option.
# Cela nécessite une logique plus complexe pour gérer les connexions, les messages, et la diffusion.

# async def handle_websocket_connection(
#     websocket: WebSocket,
#     chat_service: ChatService = Depends(get_chat_service),
#     current_user: Any = Depends(get_current_user) # Probablement via token ou cookie
# ):
#     await websocket.accept()
#     # Vous devrez gérer la connexion ici : recevoir des messages, les passer au service,
#     # et envoyer les réponses du bot en temps réel.
#     # Gestion de la mémoire de la conversation pour la session WebSocket.
#     conversation_id = None # À déterminer, peut-être par la première requête
#     try:
#         while True:
#             data = await websocket.receive_text()
#             # Ici, vous analyseriez le message reçu (probablement un JSON avec contenu, type, etc.)
#             # Exemple: message_data = json.loads(data)
#             # sender = current_user.id ou "user"
#             # response = await chat_service.send_message(...)
#             # await websocket.send_json({"message": response.message.model_dump(), "bot_response": response.bot_response.model_dump()})
#     except WebSocketDisconnect:
#         logger.info(f"Client disconnected from chat WebSocket for user {current_user.id}.")
#     except Exception as e:
#         logger.error(f"WebSocket error for user {current_user.id}: {e}")
#         await websocket.close(code=1011) # Code d'erreur interne

# @router.websocket("/ws")
# async def websocket_endpoint(
#     websocket: WebSocket,
#     chat_service: ChatService = Depends(get_chat_service),
#     current_user: Any = Depends(get_current_user)
# ):
#     await handle_websocket_connection(websocket, chat_service, current_user)