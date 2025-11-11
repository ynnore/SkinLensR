# /home/manik/skinlensr/SkinLensR/backend/app/services/chat_service.py

import uuid
import base64
from typing import List, Dict, Any, Optional
from datetime import datetime

# ### MODIFIÉ ### - Import de OpenAI et configuration du client pour le NIM
from openai import OpenAI

# Configuration du client OpenAI pour parler à notre NIM via le tunnel
# Il sera utilisé directement dans la fonction send_message
nim_client = OpenAI(
  base_url = "http://localhost:8000/v1",
  api_key = "dummy_key" # Clé factice requise par la librairie
)
# ### FIN DE LA MODIFICATION ###

# On garde vos modèles Pydantic car ils sont bien définis
from pydantic import BaseModel, Field

# --- Classes de Modèles pour les Requêtes et Réponses (Pydantic) ---
class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    sender_id: str 
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    media_type: Optional[str] = None
    media_data: Optional[str] = None

class ConversationCreate(BaseModel):
    user_id: str
    initial_message: Optional[str] = None
    agent_id: Optional[str] = None

class ConversationResponse(BaseModel):
    id: str
    user_id: str
    agent_id: Optional[str]
    created_at: datetime
    messages: List[ChatMessage] = []

class MessageSendRequest(BaseModel):
    conversation_id: str
    sender_id: str
    content: Optional[str] = None

class MessageResponse(BaseModel):
    message: ChatMessage
    bot_response: ChatMessage

# --- Service Principal ---

class ChatService:
    # ### MODIFIÉ ###
    # J'ai simplifié le constructeur. Nous n'avons plus besoin de passer un llm_client
    # car nous allons utiliser le nim_client défini ci-dessus.
    # Vous devrez adapter l'initialisation du service là où il est créé.
    def __init__(self, db_session: Any, vector_store: Any = None):
        self.db_session = db_session
        self.vector_store = vector_store 
        print("ChatService initialized.")
    # ### FIN DE LA MODIFICATION ###

    async def create_conversation(self, conversation_data: ConversationCreate) -> ConversationResponse:
        # Votre logique de création de conversation est bonne, on la garde.
        # ... (votre code existant)
        print(f"Création de la conversation pour l'utilisateur {conversation_data.user_id}")
        # Pour la démo, on simule une réponse sans base de données
        conv_id = str(uuid.uuid4())
        return ConversationResponse(
            id=conv_id,
            user_id=conversation_data.user_id,
            agent_id=conversation_data.agent_id,
            created_at=datetime.utcnow(),
            messages=[]
        )

    async def get_conversation(self, conversation_id: str) -> Optional[ConversationResponse]:
        # Votre logique est bonne, on la garde.
        # Pour la démo, on simule une conversation existante.
        print(f"Récupération de la conversation {conversation_id}")
        return ConversationResponse(
            id=conversation_id,
            user_id="simulated_user",
            agent_id="default_agent",
            created_at=datetime.utcnow(),
            messages=[] # On suppose qu'on ne charge pas l'historique ici
        )

    async def send_message(self, message_request: MessageSendRequest) -> MessageResponse:
        """
        Traite un message utilisateur, génère une réponse du bot via le NIM et la retourne.
        """
        print(f"Message reçu pour la conversation {message_request.conversation_id}")
        
        # 1. Valider la conversation
        conversation = await self.get_conversation(message_request.conversation_id)
        if not conversation:
            raise ValueError(f"Conversation with ID {message_request.conversation_id} not found.")

        # 2. Créer l'objet message de l'utilisateur
        user_message = ChatMessage(
            conversation_id=message_request.conversation_id,
            sender_id=message_request.sender_id,
            content=message_request.content or "",
            timestamp=datetime.utcnow()
        )
        # Idéalement, ici vous sauvegarderiez user_message dans votre base de données.

        # 3. Préparer et appeler le NIM Llama 3
        bot_response_content = ""
        try:
            print(f"Envoi de la requête au NIM Llama 3...")
            # ### MODIFIÉ ### - C'est ici qu'on remplace l'ancien appel LLM
            completion = nim_client.chat.completions.create(
              model="meta/llama3-8b-instruct",
              messages=[
                  {"role": "system", "content": "You are a helpful assistant for the kiwi-ops project."},
                  {"role": "user", "content": user_message.content}
              ],
              max_tokens=150
            )
            bot_response_content = completion.choices[0].message.content.strip()
            print(f"Réponse reçue du NIM: {bot_response_content[:80]}...")
            # ### FIN DE LA MODIFICATION ###

        except Exception as e:
            print(f"Erreur de connexion au NIM: {e}")
            bot_response_content = f"Désolé, je n'ai pas pu me connecter au service d'IA. Erreur: {e}"

        # 4. Créer l'objet message du bot
        bot_message = ChatMessage(
            conversation_id=message_request.conversation_id,
            sender_id="bot",
            content=bot_response_content,
            timestamp=datetime.utcnow()
        )
        # Idéalement, ici vous sauvegarderiez bot_message dans votre base de données.

        # 5. Retourner la réponse complète
        return MessageResponse(message=user_message, bot_response=bot_message)