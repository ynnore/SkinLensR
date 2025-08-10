# /home/manik/skinlensr/SkinLensR/backend/app/services/chat_service.py
# /home/manik/skinlensr/SkinLensR/backend/app/services/chat_service.py

from pydantic import BaseModel, Field # Vous utilisez aussi Field, assurez-vous qu'il soit importé aussi
# ... le reste de vos imports ...
import uuid
import base64
from typing import List, Dict, Any, Optional, Union, Tuple
from datetime import datetime

# Supposons que vous ayez déjà des classes pour :
# - Votre LLM (pour la génération de texte)
# - Votre système de Vector Store (pour les embeddings et la recherche RAG)
# - Votre système de gestion de mémoire conversationnelle (si différent du Vector Store)
# - Vos modèles SQLAlchemy (pour stocker les conversations dans la DB)

# Importations hypothétiques (à remplacer par vos imports réels)
# from app.llm_clients import LlmClient # Pour les appels LLM
# from app.vector_stores import VectorStore # Pour les embeddings et la recherche RAG
# from app.memory import ConversationMemory # Pour gérer l'historique
# from app.models.chat import Conversation, Message # Modèles SQLAlchemy pour les chats

# --- Classes de Modèles pour les Requêtes et Réponses (Pydantic) ---
# Assurez-vous que ces modèles correspondent à vos schémas dans app/schemas/

class ChatMessage(BaseModel):
    """Représente un message dans une conversation."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    sender_id: str # Peut être un user_id ou un agent_id (ex: 'user', 'bot', 'agent_X')
    content: str # Le contenu textuel du message
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    # Pour le multimodal, vous pourriez ajouter :
    media_type: Optional[str] = Field(None, description="Type de média: 'image', 'video', etc.")
    media_data: Optional[str] = Field(None, description="Données du média encodées (ex: base64 pour images).")

class ConversationCreate(BaseModel):
    """Requête pour créer une nouvelle conversation."""
    user_id: str
    initial_message: Optional[str] = None
    initial_media_type: Optional[str] = None
    initial_media_data: Optional[str] = None
    # Vous pourriez vouloir associer un agent spécifique à cette conversation
    agent_id: Optional[str] = None

class ConversationResponse(BaseModel):
    """Réponse lors de la création ou récupération d'une conversation."""
    id: str
    user_id: str
    agent_id: Optional[str]
    created_at: datetime
    messages: List[ChatMessage] = []

class MessageSendRequest(BaseModel):
    """Requête pour envoyer un nouveau message dans une conversation existante."""
    conversation_id: str
    sender_id: str # 'user' ou l'ID de l'utilisateur
    content: Optional[str] = None
    media_type: Optional[str] = None
    media_data: Optional[str] = None # Base64 encoded for images/videos

class MessageResponse(BaseModel):
    """Réponse après l'envoi d'un message (incluant la réponse du bot)."""
    message: ChatMessage # Le message envoyé par l'utilisateur
    bot_response: ChatMessage # La réponse générée par le bot/agent

# --- Service Principal ---

class ChatService:
    def __init__(self,
                 llm_client: Any, # Instance de votre client LLM
                 vector_store: Any, # Instance de votre VectorStore
                 db_session: Any, # Session SQLAlchemy pour interagir avec la DB
                 max_history_items: int = 10): # Nombre max de messages à garder dans le prompt
        self.llm_client = llm_client
        self.vector_store = vector_store
        self.db_session = db_session
        self.max_history_items = max_history_items

        # Placeholder pour les modèles SQLAlchemy (à importer correctement)
        self.ConversationModel = None # Remplacez par votre modèle SQLAlchemy Conversation
        self.MessageModel = None # Remplacez par votre modèle SQLAlchemy Message

        # Assurez-vous que les modèles sont bien chargés ou mappés
        if not self.ConversationModel or not self.MessageModel:
             # Si vous utilisez un ORM comme SQLAlchemy, vous devrez peut-être lier vos modèles ici
             # ou vous assurer qu'ils sont importés correctement et accessibles.
             # Pour l'exemple, on va simuler que ce sont des classes Pydantic qui servent aussi de ORM.
             # Dans une vraie application, ce serait différent.
             print("WARNING: SQLAlchemy models for Conversation and Message are not properly loaded. Using Pydantic models as placeholders.")
             self.ConversationModel = ConversationResponse # Utilisation des Pydantic pour l'exemple
             self.MessageModel = ChatMessage # Utilisation des Pydantic pour l'exemple


    async def create_conversation(self, conversation_data: ConversationCreate) -> ConversationResponse:
        """Crée une nouvelle conversation."""
        conversation_id = str(uuid.uuid4())
        new_conversation = self.ConversationModel(
            id=conversation_id,
            user_id=conversation_data.user_id,
            agent_id=conversation_data.agent_id,
            created_at=datetime.utcnow(),
            messages=[]
        )

        # Stocker la conversation dans la base de données
        # Exemple : await self.db_session.add(new_conversation); await self.db_session.commit()
        # Pour l'exemple, on se contente de la retourner.

        if conversation_data.initial_message or conversation_data.initial_media_data:
            # Créer le premier message si fourni
            first_message = ChatMessage(
                conversation_id=conversation_id,
                sender_id=conversation_data.user_id, # Le premier message vient de l'utilisateur
                content=conversation_data.initial_message,
                media_type=conversation_data.initial_media_type,
                media_data=conversation_data.initial_media_data
            )
            new_conversation.messages.append(first_message)
            # Stocker le message dans la DB si vous avez un MessageModel SQLAlchemy

        return new_conversation

    async def get_conversation(self, conversation_id: str) -> Optional[ConversationResponse]:
        """Récupère une conversation spécifique et ses messages."""
        # Exemple : conversation = await self.db_session.get(self.ConversationModel, conversation_id)
        # Pour l'exemple, on simule ici la récupération.
        # Dans une vraie implémentation, vous feriez une requête à votre base de données.
        print(f"Fetching conversation {conversation_id}...")
        # Simuler la récupération d'une conversation qui n'existe pas encore
        return None # Renvoyer None si la conversation n'est pas trouvée.

    async def _process_media_for_llm(self, media_type: Optional[str], media_data: Optional[str]) -> str:
        """
        Prépare les données multimédias pour le LLM.
        Pour les images, cela peut impliquer une description ou un OCR.
        Pour les vidéos, cela pourrait être un résumé ou des métadonnées.
        """
        if not media_type or not media_data:
            return ""

        if media_type == "image":
            # Exemple : Décodage base64 et éventuellement OCR ou description via un autre modèle
            try:
                image_bytes = base64.b64decode(media_data)
                # Ici, vous pourriez appeler un modèle multimodal pour décrire l'image
                # ou utiliser une librairie pour l'OCR si c'est du texte dans l'image.
                # Pour l'instant, on retourne juste une indication que c'est une image.
                return f"[Image: {len(image_bytes)} bytes received, description pending]"
            except Exception as e:
                print(f"Error decoding image data: {e}")
                return "[Error processing image]"
        # Ajoutez ici la logique pour d'autres types de médias (vidéo, audio, etc.)
        else:
            return f"[{media_type} data received, processing not implemented]"

    async def _get_context_for_llm(self, conversation_id: str, current_message_id: str) -> str:
        """
        Récupère l'historique de la conversation et potentiellement des documents RAG.
        Pour simplifier, on récupère juste les N derniers messages.
        """
        # Récupérer les N derniers messages de la conversation (ex: 10 derniers)
        # Ceci nécessiterait une logique de récupération depuis la DB ou un cache.
        # Pour l'exemple, on va simuler un historique.

        # Placeholder pour les messages :
        recent_messages = [
            ChatMessage(conversation_id=conversation_id, sender_id="user", content="Salut!", timestamp=datetime.utcnow()),
            ChatMessage(conversation_id=conversation_id, sender_id="bot", content="Bonjour! Comment puis-je vous aider aujourd'hui?", timestamp=datetime.utcnow()),
        ]
        # Simuler la récupération des messages depuis la DB
        print(f"Retrieving context for conversation {conversation_id}...")
        # Dans une vraie application :
        # messages_db = await self.db_session.query(self.MessageModel) \
        #                               .filter(self.MessageModel.conversation_id == conversation_id) \
        #                               .order_by(self.MessageModel.timestamp.desc()) \
        #                               .limit(self.max_history_items) \
        #                               .all()
        # recent_messages = [ChatMessage.from_orm(msg) for msg in messages_db] # Adapter si vos modèles sont différents
        
        context = ""
        # Ajouter l'historique des messages au contexte
        for i, msg in enumerate(reversed(recent_messages)): # Reversed pour avoir du plus ancien au plus récent
            if i >= self.max_history_items:
                break
            sender_prefix = "User" if msg.sender_id == "user" else "Bot" # Adapter si sender_id est différent
            context += f"{sender_prefix}: {msg.content}\n"
        
        # Si vous utilisez RAG, vous pourriez aussi faire une recherche ici
        # et ajouter les documents pertinents au contexte.
        # e.g., related_docs = await self.vector_store.search(query=current_message_content)
        # context += "\nRelevant Documents:\n" + "\n".join([doc['content'] for doc in related_docs])

        return context

    async def send_message(self, message_request: MessageSendRequest) -> MessageResponse:
        """
        Traite un message utilisateur, génère une réponse du bot et la retourne.
        """
        # 1. Valider le message et récupérer la conversation
        conversation = await self.get_conversation(message_request.conversation_id)
        if not conversation:
            # Si la conversation n'existe pas, la créer (cela dépend de votre logique métier)
            # Dans cet exemple, on va supposer que la conversation est créée avant le premier message.
            # Si ce n'est pas le cas, vous pourriez avoir besoin de créer ici.
            raise ValueError(f"Conversation with ID {message_request.conversation_id} not found.")

        # 2. Créer le message utilisateur (et le stocker dans la DB)
        user_message_content = message_request.content
        user_media_type = message_request.media_type
        user_media_data = message_request.media_data
        
        # Préparer le contenu textuel pour l'LLM, en incluant le média si présent
        llm_input_content = user_message_content if user_message_content else ""
        if user_media_type and user_media_data:
            processed_media_info = await self._process_media_for_llm(user_media_type, user_media_data)
            llm_input_content += " " + processed_media_info

        if not llm_input_content:
             raise ValueError("Message content cannot be empty if no media is provided.")

        user_message = ChatMessage(
            conversation_id=message_request.conversation_id,
            sender_id=message_request.sender_id, # Assurez-vous que le sender_id est correct (ex: 'user')
            content=user_message_content if user_message_content else f"[{user_media_type} message]", # Stocker le texte original
            media_type=user_media_type,
            media_data=user_media_data,
            timestamp=datetime.utcnow()
        )
        # Exemple de sauvegarde du message utilisateur : await self.db_session.add(user_message); await self.db_session.commit()

        # 3. Préparer le contexte pour le LLM
        # Il faut passer l'historique et les infos du message courant
        context = await self._get_context_for_llm(message_request.conversation_id, user_message.id)

        # Construire le prompt final pour le LLM
        # Vous pouvez adapter le format du prompt selon votre LLM
        prompt_for_llm = f"{context}\nUser: {llm_input_content}\nBot:"

        # 4. Générer la réponse du LLM
        try:
            # Appel au LLM
            # Assurez-vous que votre client LLM gère le texte et potentiellement des informations multimédias interprétées.
            llm_response_text = await self.llm_client.generate_response(prompt=prompt_for_llm)
            bot_response_content = llm_response_text.strip()

            # Créer le message de réponse du bot
            bot_message = ChatMessage(
                conversation_id=message_request.conversation_id,
                sender_id="bot", # Ou l'ID de l'agent spécifique si géré
                content=bot_response_content,
                timestamp=datetime.utcnow()
            )
            # Exemple de sauvegarde du message du bot : await self.db_session.add(bot_message); await self.db_session.commit()

            # 5. Préparer la réponse
            return MessageResponse(message=user_message, bot_response=bot_message)

        except Exception as e:
            print(f"Error during LLM response generation: {e}")
            # Retourner une erreur générique à l'utilisateur
            error_message = ChatMessage(
                conversation_id=message_request.conversation_id,
                sender_id="bot",
                content="I'm sorry, I encountered an error. Please try again later.",
                timestamp=datetime.utcnow()
            )
            return MessageResponse(message=user_message, bot_response=error_message)

    # Vous pourriez ajouter d'autres méthodes ici :
    # async def get_conversation_history(self, conversation_id: str, limit: int = 20) -> List[ChatMessage]: ...
    # async def delete_conversation(self, conversation_id: str) -> bool: ...
    # async def process_image_for_rag(self, image_data: str) -> str: ... # Pour extraire du texte d'une image et l'indexer