# /home/manik/skinlensr/SkinLensR/backend/app/services/memory_manager.py

import uuid
from typing import List, Dict, Any, Optional, Union
from datetime import datetime
from pydantic import BaseModel, Field

# Supposons que vous ayez :
# - Une classe pour interagir avec votre base de données vectorielle (ex: Chroma, Pinecone, FAISS)
# - Des modèles SQLAlchemy pour stocker des informations persistantes (si nécessaire)

# Importations hypothétiques (à remplacer par vos imports réels)
# from app.vector_stores import VectorStore # Votre interface pour le stockage vectoriel
# from app.crud.memory_crud import MemoryPersistence # Pour interagir avec la DB relationnelle pour la mémoire à long terme
# from app.models.memory import MemoryEntry # Modèle SQLAlchemy pour les entrées de mémoire persistance

# --- Modèles Pydantic pour la Gestion de la Mémoire ---

class Message(BaseModel):
    """Structure simple d'un message pour la mémoire."""
    sender: str # 'user', 'bot', 'system', 'agent_X'
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None # Ex: {conversation_id: '...', tool_used: 'search'}

class ShortTermMemory(BaseModel):
    """Mémoire à court terme : historique récent et résumé."""
    messages: List[Message] = []
    summary: Optional[str] = None
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class LongTermMemoryEntry(BaseModel):
    """Entrée pour la mémoire à long terme (souvent associée à une entrée vectorielle)."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str # Associé à quel utilisateur cette mémoire est pertinente
    type: str # Ex: 'fact', 'preference', 'event_summary'
    content: str # Le texte de l'entrée
    embedding: Optional[List[float]] = None # Le vecteur d'embedding associé à ce contenu
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None # Ex: {source: 'conversation_X', importance: 'high'}

# --- Service Principal de Gestion de la Mémoire ---

class MemoryManager:
    def __init__(self,
                 vector_store: Any, # Instance de votre VectorStore (ex: ChromaDB instance)
                 db_session: Any, # Session SQLAlchemy pour la mémoire persistance
                 max_recent_messages: int = 10,
                 summary_model: Any = None): # LLM pour résumer (peut être passé ici)
        """
        Initialise le MemoryManager.

        Args:
            vector_store: L'instance de votre système de stockage vectoriel.
            db_session: La session SQLAlchemy pour la mémoire relationnelle.
            max_recent_messages: Nombre maximum de messages récents à conserver dans la mémoire courte.
            summary_model: L'instance d'un modèle LLM capable de générer des résumés.
        """
        self.vector_store = vector_store
        self.db_session = db_session
        self.max_recent_messages = max_recent_messages
        self.summary_model = summary_model # LLM pour résumer l'historique

        # Stockage de la mémoire pour chaque conversation/utilisateur actif
        # Cela pourrait être géré plus dynamiquement si vous avez beaucoup d'utilisateurs actifs
        self.short_term_memories: Dict[str, ShortTermMemory] = {} # {conversation_id: ShortTermMemory}
        
        # Placeholder pour les modèles SQLAlchemy de mémoire
        self.MemoryEntryModel = None # Remplacez par votre modèle SQLAlchemy MemoryEntry

    def _get_short_term_memory(self, conversation_id: str) -> ShortTermMemory:
        """Récupère ou crée la mémoire courte pour une conversation donnée."""
        if conversation_id not in self.short_term_memories:
            self.short_term_memories[conversation_id] = ShortTermMemory(messages=[])
        return self.short_term_memories[conversation_id]

    def add_message(self, conversation_id: str, sender: str, content: str, metadata: Optional[Dict[str, Any]] = None):
        """Ajoute un message à la mémoire courte de la conversation."""
        memory = self._get_short_term_memory(conversation_id)
        message = Message(sender=sender, content=content, timestamp=datetime.utcnow(), metadata=metadata)
        memory.messages.append(message)
        # Tronquer si la mémoire dépasse la limite de messages récents
        if len(memory.messages) > self.max_recent_messages:
            memory.messages = memory.messages[-self.max_recent_messages:]
        memory.last_updated = datetime.utcnow()
        print(f"Memory: Added message from {sender} to conversation {conversation_id}.")

    def get_recent_messages(self, conversation_id: str, limit: int = 5) -> List[Message]:
        """Récupère les N derniers messages de la mémoire courte."""
        memory = self.short_term_memories.get(conversation_id)
        if not memory:
            return []
        return memory.messages[-limit:] # Retourne les limit derniers messages

    def get_conversation_history(self, conversation_id: str) -> List[Message]:
        """Récupère tous les messages de la mémoire courte d'une conversation."""
        memory = self.short_term_memories.get(conversation_id)
        if not memory:
            return []
        return memory.messages

    async def summarize_conversation(self, conversation_id: str) -> str:
        """
        Génère un résumé de la conversation si un modèle LLM est disponible.
        Stockerait ce résumé pour une utilisation future (mémoire courte/longue).
        """
        memory = self.short_term_memories.get(conversation_id)
        if not memory or not self.summary_model:
            print("Memory: Cannot summarize conversation - no memory or no summary model available.")
            return "No summary available."

        if memory.summary: # Si un résumé existe déjà
            return memory.summary

        # Préparer le prompt pour le résumé
        conversation_text = "\n".join([f"{msg.sender}: {msg.content}" for msg in memory.messages])
        prompt = f"Summarize the following conversation:\n\n{conversation_text}\n\nSummary:"

        try:
            # Assurez-vous que votre modèle LLM peut être appelé ici
            # Exemple d'appel LLM :
            # summary = await self.summary_model.generate_text(prompt, max_length=100)
            
            # Simulation de réponse LLM pour l'exemple
            summary = f"This is a simulated summary of recent messages, focusing on key points discussed."
            print(f"Memory: Generated summary for conversation {conversation_id}: {summary}")

            memory.summary = summary # Mettre à jour le résumé dans la mémoire courte
            memory.last_updated = datetime.utcnow()
            
            # Optionnel: Ajouter ce résumé à la mémoire à long terme aussi
            await self.add_to_long_term_memory(
                user_id="unknown_user_for_summary", # Vous devrez associer un user_id ici
                type="conversation_summary",
                content=summary,
                metadata={"conversation_id": conversation_id, "source": "auto-summary"}
            )
            
            return summary
        except Exception as e:
            print(f"Memory: Error generating summary for conversation {conversation_id}: {e}")
            return "Failed to generate summary."

    async def add_to_long_term_memory(self, user_id: str, type: str, content: str, embedding: Optional[List[float]] = None, metadata: Optional[Dict[str, Any]] = None):
        """
        Ajoute une entrée d'information pertinente à la mémoire à long terme.
        Si l'embedding n'est pas fourni, il sera généré.
        """
        if not content:
            print("Memory: Cannot add empty content to long-term memory.")
            return

        entry_id = str(uuid.uuid4())
        entry = LongTermMemoryEntry(
            id=entry_id,
            user_id=user_id,
            type=type,
            content=content,
            embedding=embedding, # Peut être None si généré plus tard
            timestamp=datetime.utcnow(),
            metadata=metadata
        )

        # 1. Stocker dans la base de données vectorielle (pour recherche sémantique)
        if self.vector_store:
            if entry.embedding is None:
                # Générer l'embedding si non fourni (nécessite un modèle d'embedding)
                # Vous devrez passer votre service d'embedding ici, ou l'avoir initialisé avec.
                # Exemple : embeddings = await self.embedding_service.get_embeddings([entry.content])
                # entry.embedding = embeddings[0] if embeddings else None
                print("Memory: Embedding generation needed for LTM. (Not implemented in this example)")
                # Pour l'exemple, on va juste ajouter sans embedding si non fourni.
                # Dans une vraie application, c'est une étape CRUCIALE.

            if entry.embedding: # Seulement si on a un embedding valide
                await self.vector_store.add_item(
                    id=entry.id,
                    content=entry.content,
                    embedding=entry.embedding,
                    metadata={"user_id": user_id, "type": type, **(metadata or {})}
                )
                print(f"Memory: Added entry '{entry.id}' to vector store (type: {type}, user: {user_id}).")
            else:
                print(f"Memory: Skipping vector store add for entry '{entry.id}' due to missing embedding (type: {type}, user: {user_id}).")

        # 2. Stocker dans la base de données relationnelle (pour persistance et requêtes structurées)
        if self.db_session and self.MemoryEntryModel:
            try:
                # Créer une instance du modèle SQLAlchemy
                db_entry = self.MemoryEntryModel(
                    id=entry.id,
                    user_id=user_id,
                    type=type,
                    content=entry.content,
                    # Le stockage de l'embedding en base de données relationnelle est plus complexe,
                    # souvent géré par des extensions comme pgvector ou stocké séparément.
                    # Pour l'instant, on ne le met pas dans le modèle relationnel par défaut.
                    metadata=str(entry.metadata) if entry.metadata else None, # Stocker en string si nécessaire
                    timestamp=entry.timestamp
                )
                self.db_session.add(db_entry)
                # await self.db_session.commit() # Commit plus tard si vous groupez les opérations
                print(f"Memory: Added entry '{entry.id}' to relational DB (type: {type}, user: {user_id}).")
            except Exception as e:
                print(f"Memory: Error adding entry '{entry.id}' to relational DB: {e}")
                # Rollback if commit is done here and fails
                # await self.db_session.rollback()

    async def retrieve_from_long_term_memory(self, user_id: str, query: str, k: int = 5, type_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Récupère les entrées les plus pertinentes de la mémoire à long terme via recherche vectorielle.
        """
        if not self.vector_store:
            print("Memory: Cannot retrieve from long-term memory - vector store not initialized.")
            return []

        print(f"Memory: Retrieving from long-term memory for user '{user_id}' with query: '{query}' (k={k}, type_filter={type_filter})")

        # Générer l'embedding pour la requête
        # Vous devrez avoir accès à un service d'embedding ici.
        # Exemple :
        # embeddings = await self.embedding_service.get_embeddings([query])
        # query_embedding = embeddings[0] if embeddings else None

        # Simulation de génération d'embedding pour l'exemple:
        query_embedding = [0.1] * 10 # Placeholder, à remplacer par une vraie génération d'embedding

        if not query_embedding:
            print("Memory: Failed to generate embedding for query.")
            return []
            
        # Effectuer la recherche dans le Vector Store
        search_results = await self.vector_store.search(
            query_embedding=query_embedding,
            k=k,
            filter={"user_id": user_id, "type": type_filter} if type_filter else {"user_id": user_id} # Appliquer les filtres
        )

        print(f"Memory: Found {len(search_results)} relevant items in long-term memory.")
        return search_results # Chaque résultat devrait contenir l'id, le contenu, le score de similarité, et les métadonnées

    async def clear_short_term_memory(self, conversation_id: str):
        """Supprime toute la mémoire courte pour une conversation donnée."""
        if conversation_id in self.short_term_memories:
            del self.short_term_memories[conversation_id]
            print(f"Memory: Cleared short-term memory for conversation {conversation_id}.")
        else:
            print(f"Memory: No short-term memory found for conversation {conversation_id} to clear.")

    async def clear_all_short_term_memory(self):
        """Supprime toute la mémoire courte active."""
        self.short_term_memories.clear()
        print("Memory: Cleared all active short-term memories.")

# --- Classes Simulées pour l'Exemple ---
# Ces classes devraient être remplacées par vos implémentations réelles.

class MockVectorStore:
    """Simule un Vector Store pour les tests."""
    def __init__(self):
        self._data = {} # {id: {"content": ..., "embedding": ..., "metadata": ...}}

    async def add_item(self, id: str, content: str, embedding: List[float], metadata: Dict[str, Any]):
        print(f"MockVectorStore: Adding item {id}")
        self._data[id] = {"content": content, "embedding": embedding, "metadata": metadata}

    async def search(self, query_embedding: List[float], k: int, filter: Dict[str, Any] = {}) -> List[Dict[str, Any]]:
        print(f"MockVectorStore: Searching with query_embedding (length {len(query_embedding)}), k={k}, filter={filter}")
        
        results = []
        for item_id, item_data in self._data.items():
            # Appliquer le filtre
            match = True
            for key, value in filter.items():
                if key not in item_data.get("metadata", {}) or item_data["metadata"][key] != value:
                    match = False
                    break
            
            if match:
                # Calculer une similarité factice (ex: distance cosinus simulée)
                # Dans un vrai store, la similarité est calculée efficacement.
                # Ici, on simule une similarité basée sur la présence de certains mots dans le contenu
                # ou une valeur aléatoire pour l'exemple.
                # Pour une simulation plus réaliste, on pourrait calculer une distance entre query_embedding et item_data["embedding"]
                # Ici, on simule simplement des résultats sans calculer la similarité.
                simulated_similarity = 1.0 - (uuid.uuid4().int % 1000) / 1000.0 # Valeur entre 0 et 1
                results.append({
                    "id": item_id,
                    "content": item_data["content"],
                    "score": simulated_similarity, # Score de similarité factice
                    "metadata": item_data["metadata"]
                })
        
        # Trier par score et prendre les k premiers
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:k]

class MockLLMForSummary:
    """Simule un LLM pour générer des résumés."""
    async def generate_text(self, prompt: str, max_length: int = 100) -> str:
        print(f"MockLLMForSummary: Received prompt (first 100 chars): {prompt[:100]}...")
        await asyncio.sleep(0.5) # Simuler un appel API
        return f"This is a generated summary based on the provided text, approximately {max_length} tokens long."

class MockDbSession:
    """Simule une session de base de données relationnelle."""
    def __init__(self):
        self._data = {} # {id: instance_of_MemoryEntryModel}

    def add(self, instance):
        print(f"MockDbSession: Adding instance {instance.id} to session.")
        self._data[instance.id] = instance

    async def commit(self):
        print(f"MockDbSession: Committing {len(self._data)} items.")
        await asyncio.sleep(0.1) # Simuler une opération DB

    def rollback(self):
        print("MockDbSession: Rolling back session.")
        self._data = {} # Reset

    def get(self, model_class, item_id):
        return self._data.get(item_id)

# --- Exemple d'Utilisation ---

if __name__ == "__main__":
    import asyncio

    # Configuration de la simulation
    mock_vector_store = MockVectorStore()
    mock_db_session = MockDbSession()
    mock_llm = MockLLMForSummary()

    # Modèle SQLAlchemy simulé (dans une vraie application, ce serait votre objet modèle)
    class MockMemoryEntryModel:
        def __init__(self, id, user_id, type, content, metadata, timestamp):
            self.id = id
            self.user_id = user_id
            self.type = type
            self.content = content
            self.metadata = metadata
            self.timestamp = timestamp

    async def test_memory_manager():
        # Instancier le MemoryManager
        memory_manager = MemoryManager(
            vector_store=mock_vector_store,
            db_session=mock_db_session,
            summary_model=mock_llm
        )
        # Lier le modèle SQLAlchemy simulé
        memory_manager.MemoryEntryModel = MockMemoryEntryModel

        conv_id_1 = "conv-123"
        conv_id_2 = "conv-456"
        user_id_1 = "user-abc"

        # --- Test Mémoire Courte ---
        print("\n--- Testing Short-Term Memory ---")
        memory_manager.add_message(conv_id_1, "user", "Hello, how are you?")
        memory_manager.add_message(conv_id_1, "bot", "I'm doing great, thanks for asking!")
        memory_manager.add_message(conv_id_1, "user", "Tell me about the weather today.")
        memory_manager.add_message(conv_id_1, "bot", "The weather is sunny with a slight breeze.")

        recent_messages = memory_manager.get_recent_messages(conv_id_1, limit=2)
        print(f"Recent messages for {conv_id_1} (limit 2):")
        for msg in recent_messages:
            print(f"- {msg.sender}: {msg.content}")

        # Test du résumé (nécessite le LLM simulé)
        print("\n--- Testing Conversation Summary ---")
        summary = await memory_manager.summarize_conversation(conv_id_1)
        print(f"Summary for {conv_id_1}: {summary}")
        
        # Ajouter un autre message pour voir si le résumé est mis à jour
        memory_manager.add_message(conv_id_1, "user", "That's good to know.")
        # Le résumé n'est pas automatiquement mis à jour ici. Il faudrait appeler summarize_conversation à nouveau si l'historique change significativement.
        # Ou, le LLM pourrait être appelé à chaque fois si la mémoire est trop courte.


        # --- Test Mémoire Long Terme ---
        print("\n--- Testing Long-Term Memory ---")

        # Ajouter une information à la mémoire à long terme
        await memory_manager.add_to_long_term_memory(
            user_id=user_id_1,
            type="user_preference",
            content="User prefers dark mode for the UI.",
            metadata={"source": conv_id_1, "importance": "high"}
        )
        await memory_manager.add_to_long_term_memory(
            user_id=user_id_1,
            type="fact",
            content="User's favorite color is blue.",
            metadata={"source": "onboarding"}
        )
        await memory_manager.add_to_long_term_memory(
            user_id=user_id_1,
            type="event_summary",
            content="User discussed their recent vacation to Italy.",
            metadata={"conversation_id": conv_id_2}
        )
        
        # Simuler un commit de la base de données relationnelle
        await mock_db_session.commit()

        # Récupérer des informations de la mémoire à long terme
        print("\n--- Retrieving from Long-Term Memory ---")
        # Recherche d'informations sur les préférences utilisateur
        retrieved_prefs = await memory_manager.retrieve_from_long_term_memory(user_id=user_id_1, query="what does the user like", k=2, type_filter="user_preference")
        print(f"Retrieved preferences: {retrieved_prefs}")

        # Recherche de faits généraux pour l'utilisateur
        retrieved_facts = await memory_manager.retrieve_from_long_term_memory(user_id=user_id_1, query="tell me about the user", k=5, type_filter="fact")
        print(f"Retrieved facts: {retrieved_facts}")
        
        # Recherche de résumés d'événements
        retrieved_events = await memory_manager.retrieve_from_long_term_memory(user_id=user_id_1, query="what did the user do recently", k=1, type_filter="event_summary")
        print(f"Retrieved events: {retrieved_events}")

        # --- Test de nettoyage de mémoire courte ---
        print("\n--- Testing Memory Clearing ---")
        await memory_manager.clear_short_term_memory(conv_id_1)
        print(f"Short-term memory for {conv_id_1} after clearing: {memory_manager.get_conversation_history(conv_id_1)}")
        
        # Ajouter des messages pour un autre utilisateur pour tester le nettoyage global
        memory_manager.add_message(conv_id_2, "user", "Hi there!")
        await memory_manager.clear_all_short_term_memory()
        print(f"Short-term memory for {conv_id_2} after global clearing: {memory_manager.get_conversation_history(conv_id_2)}")


    asyncio.run(test_memory_manager())