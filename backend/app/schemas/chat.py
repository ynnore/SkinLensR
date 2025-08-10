# /home/manik/skinlensr/SkinLensR/backend/app/schemas/chat.py

import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field

# --- Schémas pour le Chat ---

class ChatMessage(BaseModel):
    """Représente un message individuel dans une conversation."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str = Field(..., example="conv-12345")
    sender_id: str = Field(..., example="user-abc") # Peut être un user_id, 'bot', 'agent_X', etc.
    content: str = Field(..., example="Hello, can you help me with my progress?") # Le contenu textuel
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    media_type: Optional[str] = Field(None, example="image") # Type de média: 'image', 'video', 'audio' etc.
    media_data: Optional[str] = Field(None, example="base64_encoded_image_data_here") # Données du média, souvent encodées en base64 pour les requêtes API

    class Config:
        orm_mode = True # Permet le mappage depuis des modèles SQLAlchemy si nécessaire
        json_encoders = {
            datetime: lambda v: v.isoformat() # Pour convertir datetime en string ISO pour JSON
        }

class ConversationBase(BaseModel):
    """Modèle de base pour les données de conversation."""
    user_id: str # L'utilisateur principal de la conversation
    agent_id: Optional[str] = None # L'agent spécifique avec lequel l'utilisateur converse
    # Vous pourriez ajouter ici un titre ou un sujet de conversation

class ConversationCreate(ConversationBase):
    """Schéma pour créer une nouvelle conversation."""
    initial_message: Optional[str] = Field(None, example="What is the weather like today?")
    initial_media_type: Optional[str] = Field(None, example="image")
    initial_media_data: Optional[str] = Field(None, example="base64_image_data")

class ConversationResponse(ConversationBase):
    """Schéma pour la réponse API lors de la création ou de la récupération d'une conversation."""
    id: str = Field(..., example="conv-12345")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    messages: List[ChatMessage] = [] # Liste des messages dans la conversation

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class MessageSendRequest(BaseModel):
    """Requête pour envoyer un nouveau message dans une conversation existante."""
    conversation_id: str = Field(..., example="conv-12345")
    sender_id: str = Field(..., example="user") # Doit correspondre à l'utilisateur authentifié ou à un ID d'agent
    content: Optional[str] = Field(None, example="Hello Agent!") # Le message texte
    media_type: Optional[str] = Field(None, example="image") # Type de média pour le message
    media_data: Optional[str] = Field(None, example="base64_image_data") # Données du média

class MessageResponse(BaseModel):
    """Réponse à l'envoi d'un message, incluant le message de l'utilisateur et la réponse du bot."""
    message: ChatMessage # Le message envoyé par l'utilisateur
    bot_response: ChatMessage # La réponse générée par le bot/agent

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }