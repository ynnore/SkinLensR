# /home/manik/skinlensr/SkinLensR/backend/app/services/rag.py

import uuid
from typing import List, Dict, Any, Optional, Tuple
from pydantic import BaseModel, Field

# Supposons que vous avez déjà des classes pour :
# - Votre Vector Store (ex: ChromaDB, FAISS, Pinecone)
# - Votre service d'embedding (ex: HuggingFaceService)
# - Un utilitaire pour découper les documents en chunks (ex: LangChain's TextSplitter)

# Importations hypothétiques (à remplacer par vos imports réels)
# from app.vector_stores import VectorStore # Votre interface pour le stockage vectoriel
# from app.services.huggingface import HuggingFaceService # Votre service pour les embeddings
# from app.utils.text_splitter import RecursiveCharacterTextSplitter # Ou une autre bibliothèque de découpage

# --- Modèles Pydantic ---

class DocumentChunk(BaseModel):
    """Représente un morceau de document indexé."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str # Le texte du chunk
    metadata: Dict[str, Any] # Ex: {'source_document': '...', 'page_number': ...}
    embedding: Optional[List[float]] = None # L'embedding généré pour ce chunk

# --- Service RAG ---

class RAGService:
    def __init__(self,
                 vector_store: Any, # Instance de votre VectorStore
                 embedding_service: Any, # Instance de votre service d'embedding (ex: HuggingFaceService)
                 text_splitter: Any, # Instance de votre TextSplitter (ex: RecursiveCharacterTextSplitter)
                 embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2"): # Modèle pour les embeddings
        """
        Initialise le service RAG.

        Args:
            vector_store: L'instance de votre système de stockage vectoriel.
            embedding_service: L'instance de votre service pour générer des embeddings.
            text_splitter: L'outil pour découper les documents en chunks.
            embedding_model_name (str): Le nom du modèle d'embedding à utiliser.
        """
        self.vector_store = vector_store
        self.embedding_service = embedding_service
        self.text_splitter = text_splitter
        self.embedding_model_name = embedding_model_name

        # Si votre VectorStore a besoin d'une collection ou d'un index spécifique, initialisez-le ici.
        # Exemple: self.index = vector_store.create_index("my_rag_index")
        # Ou si le VectorStore gère les collections, vous pourriez passer le nom de la collection au service.

    async def index_document(self, document_content: str, source_name: str, metadata: Optional[Dict[str, Any]] = None):
        """
        Découpe un document en chunks, génère des embeddings et les indexe dans le Vector Store.

        Args:
            document_content (str): Le contenu texte complet du document.
            source_name (str): Le nom de la source du document (ex: nom de fichier, URL).
            metadata (Optional[Dict[str, Any]]): Métadonnées supplémentaires à associer aux chunks.
        """
        if not document_content:
            print("RAG: Document content is empty, skipping indexing.")
            return

        print(f"RAG: Indexing document from source: '{source_name}'...")

        # 1. Découper le document en chunks
        chunks = self.text_splitter.split_text(document_content)
        
        indexed_count = 0
        for i, chunk_text in enumerate(chunks):
            if not chunk_text.strip(): # Ignorer les chunks vides
                continue

            chunk_id = str(uuid.uuid4())
            chunk_metadata = metadata if metadata is not None else {}
            chunk_metadata['source_document'] = source_name
            # Vous pourriez ajouter le numéro de chunk ou un identifiant basé sur la position
            # chunk_metadata['chunk_index'] = i

            try:
                # 2. Générer l'embedding pour le chunk
                # Assurez-vous que votre service d'embedding peut gérer une liste de textes (même si c'est une liste de 1)
                embeddings = await self.embedding_service.get_embeddings(
                    [chunk_text],
                    model_name_or_path=self.embedding_model_name
                )
                
                if not embeddings or not embeddings[0]:
                    print(f"RAG: Failed to generate embedding for chunk {i} of '{source_name}'. Skipping.")
                    continue
                
                chunk_embedding = embeddings[0]

                # 3. Indexer le chunk et son embedding dans le Vector Store
                await self.vector_store.add_item(
                    id=chunk_id,
                    content=chunk_text,
                    embedding=chunk_embedding,
                    metadata=chunk_metadata
                )
                indexed_count += 1

            except Exception as e:
                print(f"RAG: Error indexing chunk {i} for '{source_name}': {e}")
                # Gérer l'erreur : continuer avec le chunk suivant, loguer, etc.

        print(f"RAG: Indexed {indexed_count}/{len(chunks)} chunks from '{source_name}'.")

    async def search_documents(self, query: str, k: int = 5, filter: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Recherche des chunks de documents pertinents pour une requête donnée.

        Args:
            query (str): La requête textuelle de l'utilisateur.
            k (int): Le nombre de résultats les plus pertinents à retourner.
            filter (Optional[Dict[str, Any]]): Filtres à appliquer à la recherche (ex: par source, par métadonnée).

        Returns:
            List[Dict[str, Any]]: Une liste de chunks pertinents trouvés, incluant leur contenu et leur score.
        """
        if not query.strip():
            print("RAG: Query is empty, returning no results.")
            return []

        print(f"RAG: Searching for '{query}' (k={k}, filter={filter})...")

        try:
            # 1. Générer l'embedding pour la requête
            query_embedding = await self.embedding_service.get_embeddings(
                [query],
                model_name_or_path=self.embedding_model_name
            )
            
            if not query_embedding or not query_embedding[0]:
                print("RAG: Failed to generate embedding for the query.")
                return []
            
            query_vector = query_embedding[0]

            # 2. Effectuer la recherche dans le Vector Store
            search_results = await self.vector_store.search(
                query_embedding=query_vector,
                k=k,
                filter=filter # Passer les filtres si fournis
            )

            print(f"RAG: Found {len(search_results)} relevant results.")
            return search_results # Les résultats devraient inclure 'content', 'score', 'metadata'

        except Exception as e:
            print(f"RAG: Error during document search: {e}")
            return [] # Retourner une liste vide en cas d'erreur

    def build_rag_prompt(self, query: str, context_documents: List[Dict[str, Any]], prompt_template: str = None) -> str:
        """
        Construit un prompt enrichi pour le LLM en combinant la requête et les documents récupérés.

        Args:
            query (str): La requête originale de l'utilisateur.
            context_documents (List[Dict[str, Any]]): Les chunks de documents récupérés par la recherche.
            prompt_template (str): Un template de prompt personnalisé. Si None, utilise un template par défaut.

        Returns:
            str: Le prompt enrichi prêt à être envoyé au LLM.
        """
        if prompt_template is None:
            # Template par défaut si aucun n'est fourni
            prompt_template = """Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Be concise and direct.

Context:
{context}

Question: {question}

Answer:"""

        context_str = ""
        if context_documents:
            for i, doc in enumerate(context_documents):
                # Construire une chaîne de contexte à partir des résultats de la recherche
                # Inclure le contenu et éventuellement des métadonnées pour plus de clarté
                source_info = f" (Source: {doc.get('metadata', {}).get('source_document', 'Unknown')})" if doc.get('metadata') else ""
                context_str += f"--- Chunk {i+1}{source_info} ---\n{doc.get('content', '')}\n\n"
        else:
            context_str = "No relevant context found.\n"

        # Remplir le template avec la requête et le contexte
        rag_prompt = prompt_template.format(context=context_str.strip(), question=query)
        return rag_prompt

    async def answer_query_with_rag(self, query: str, llm_client: Any, k: int = 5, filter: Optional[Dict[str, Any]] = None, prompt_template: Optional[str] = None) -> str:
        """
        Réalise le processus RAG complet : recherche de documents puis génération de réponse par le LLM.

        Args:
            query (str): La requête utilisateur.
            llm_client: L'instance de votre client LLM (ex: OpenAICompatibleLLM).
            k (int): Nombre de documents à récupérer.
            filter (Optional[Dict[str, Any]]): Filtres pour la recherche.
            prompt_template (Optional[str]): Template de prompt personnalisé.

        Returns:
            str: La réponse générée par le LLM basée sur le contexte RAG.
        """
        # 1. Rechercher des documents pertinents
        context_docs = await self.search_documents(query, k=k, filter=filter)

        # 2. Construire le prompt enrichi
        rag_prompt = self.build_rag_prompt(query, context_docs, prompt_template)
        print(f"\n--- RAG Prompt for LLM ---\n{rag_prompt[:500]}...\n--------------------------")

        # 3. Envoyer le prompt enrichi au LLM pour obtenir la réponse
        try:
            # Assurez-vous que votre client LLM peut recevoir ce format de prompt
            # et que le modèle utilisé est adapté à la tâche (ex: un modèle de chat ou de complétion)
            if hasattr(llm_client, 'generate_text_completion'):
                llm_response = await llm_client.generate_text_completion(
                    prompt=rag_prompt, # Ici, on passe le prompt RAG complet
                    stream=False # On attend une réponse complète pour l'instant
                    # Vous pourriez vouloir passer des paramètres spécifiques à votre LLM client ici
                )
                return llm_response
            else:
                return "LLM client does not support 'generate_text_completion' method."
        except Exception as e:
            print(f"RAG: Error getting response from LLM after RAG: {e}")
            return "An error occurred while generating the answer with RAG."

# --- Classes Simulées pour l'Exemple ---
# Ces classes devraient être remplacées par vos implémentations réelles.

class MockTextSplitter:
    """Simule un découpeur de texte."""
    def __init__(self, chunk_size=1000, chunk_overlap=200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str) -> List[str]:
        print(f"MockTextSplitter: Splitting text (size: {len(text)}, chunk_size: {self.chunk_size})...")
        # Simule un découpage simple
        chunks = []
        start = 0
        while start < len(text):
            end = min(start + self.chunk_size, len(text))
            chunks.append(text[start:end])
            start += self.chunk_size - self.chunk_overlap # Avance pour créer le chevauchement
            if start < 0: start = 0 # Sécurité
        print(f"MockTextSplitter: Created {len(chunks)} chunks.")
        return chunks

class MockEmbeddingService:
    """Simule un service d'embedding."""
    async def get_embeddings(self, texts: List[str], model_name_or_path: str) -> List[List[float]]:
        print(f"MockEmbeddingService: Generating embeddings for {len(texts)} texts using {model_name_or_path}...")
        # Simule la génération d'embeddings : retourne un vecteur de taille fixe (ex: 10)
        # dont les valeurs dépendent du texte pour une recherche factice.
        embeddings = []
        for i, text in enumerate(texts):
            # Générer un embedding factice basé sur le contenu du texte (pour la démo)
            # Dans une vraie implémentation, ce serait l'output de HuggingFaceService.get_embeddings
            embedding_val = len(text) % 100 # Une valeur simple pour varier
            fake_embedding = [(ord(c) + embedding_val) % 256 / 256.0 for c in text[:10]] # Crée un vecteur de taille 10 avec des valeurs entre 0 et 1
            fake_embedding += [0.0] * (10 - len(fake_embedding)) # Compléter si le texte est trop court
            embeddings.append(fake_embedding)
        await asyncio.sleep(0.1) # Simuler un délai
        print(f"MockEmbeddingService: Generated {len(embeddings)} embeddings.")
        return embeddings

class MockVectorStore:
    """Simule un Vector Store."""
    def __init__(self):
        self._data = {} # {id: {"content": ..., "embedding": ..., "metadata": ...}}

    async def add_item(self, id: str, content: str, embedding: List[float], metadata: Dict[str, Any]):
        print(f"MockVectorStore: Adding item {id}")
        self._data[id] = {"content": content, "embedding": embedding, "metadata": metadata}

    async def search(self, query_embedding: List[float], k: int, filter: Dict[str, Any] = {}) -> List[Dict[str, Any]]:
        print(f"MockVectorStore: Searching (k={k}, filter={filter})...")
        if not self._data:
            return []
        
        results = []
        for item_id, item_data in self._data.items():
            # Appliquer le filtre si présent
            match = True
            if filter:
                for key, value in filter.items():
                    if key not in item_data.get("metadata", {}) or item_data["metadata"][key] != value:
                        match = False
                        break
            
            if match:
                # Simuler le calcul d'une similarité basée sur les embeddings
                # Dans un vrai VectorStore, c'est une opération optimisée (cosine, dot-product, etc.)
                # Ici, on simule une similarité simple pour démonstration.
                # On utilise la longueur de l'embedding comme proxy de similarité.
                similarity_score = 1.0 - abs(len(query_embedding) - len(item_data.get("embedding", []))) / 10.0 # Très factice
                # Ou basé sur le contenu si l'embedding est le même (cas démo)
                if query_embedding == item_data.get("embedding", []):
                    similarity_score = 1.0
                elif item_data.get("content") == "This is a chunk from document A.":
                    similarity_score = 0.8
                elif item_data.get("content") == "This is another chunk from document B.":
                    similarity_score = 0.7
                else:
                    similarity_score = 0.5
                
                results.append({
                    "id": item_id,
                    "content": item_data["content"],
                    "score": similarity_score,
                    "metadata": item_data["metadata"]
                })
        
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:k]

class MockLLMClient:
    """Simule un client LLM pour le test du RAG prompt."""
    async def generate_text_completion(self, prompt: str, stream: bool = False, **kwargs) -> str:
        print(f"MockLLMClient: Received RAG prompt (first 150 chars): \n{prompt[:150]}...")
        await asyncio.sleep(0.5) # Simuler un appel API
        # Simulation de réponse LLM basée sur le prompt
        if "capital of France" in prompt:
            return "The capital of France is Paris."
        elif "cat" in prompt:
            return "A cat is a small domesticated carnivorous mammal with soft fur."
        else:
            return "Based on the provided context, the answer is [simulated answer]."

# --- Exemple d'Utilisation ---

if __name__ == "__main__":
    import asyncio

    async def test_rag_service():
        # Initialisation des composants simulés
        mock_vector_store = MockVectorStore()
        mock_embedding_service = MockEmbeddingService()
        mock_text_splitter = MockTextSplitter(chunk_size=100, chunk_overlap=20) # Plus petit pour tester le découpage
        mock_llm_client = MockLLMClient()

        # Instancier le service RAG
        rag_service = RAGService(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service,
            text_splitter=mock_text_splitter,
            embedding_model_name="test-embedding-model" # Un nom factice pour le modèle d'embedding
        )

        # --- Indexation de documents ---
        print("\n--- Testing Document Indexing ---")
        doc_content_a = "Document A contains information about AI. AI is transforming industries."
        doc_content_b = "Document B talks about cats. Cats are popular pets worldwide. They are known for their independence."
        doc_content_c = "Document C discusses programming languages. Python is a versatile language, often used for AI."

        await rag_service.index_document(doc_content_a, source_name="doc_a.txt", metadata={"type": "AI"})
        await rag_service.index_document(doc_content_b, source_name="doc_b.txt", metadata={"type": "Pets"})
        await rag_service.index_document(doc_content_c, source_name="doc_c.txt", metadata={"type": "Tech"})

        # Simuler l'attente de l'indexation si elle était asynchrone
        # await asyncio.sleep(1) # Pas nécessaire ici car add_item est awaitable

        # --- Recherche de documents ---
        print("\n--- Testing Document Search ---")
        search_query_1 = "What is AI?"
        results_1 = await rag_service.search_documents(search_query_1, k=1)
        print(f"Search for '{search_query_1}': Found {len(results_1)} results. First: {results_1[0]['content'] if results_1 else 'None'}")

        search_query_2 = "Tell me about pets."
        results_2 = await rag_service.search_documents(search_query_2, k=2, filter={"type": "Pets"}) # Filtre par type
        print(f"Search for '{search_query_2}' (filtered): Found {len(results_2)} results.")
        for res in results_2:
            print(f" - {res['content']} (Score: {res['score']:.2f}, Source: {res['metadata'].get('source_document')})")

        # --- Construction du prompt RAG ---
        print("\n--- Testing RAG Prompt Building ---")
        # Utiliser les résultats de la recherche pour construire un prompt
        retrieved_docs_for_prompt = await rag_service.search_documents("What is Python?", k=1)
        rag_prompt = rag_service.build_rag_prompt("What is Python used for?", retrieved_docs_for_prompt)
        print(f"Generated RAG Prompt:\n{rag_prompt}")

        # --- Réponse à une requête avec RAG ---
        print("\n--- Testing Answer Query with RAG ---")
        query_for_rag_answer = "What is the capital of France?" # Query sans contexte RAG direct dans notre index
        answer_from_rag = await rag_service.answer_query_with_rag(
            query=query_for_rag_answer,
            llm_client=mock_llm_client,
            k=1
        )
        print(f"Query: {query_for_rag_answer}")
        print(f"RAG Answer: {answer_from_rag}")

        query_for_rag_answer_2 = "Tell me about cats." # Query avec contexte dans notre index
        answer_from_rag_2 = await rag_service.answer_query_with_rag(
            query=query_for_rag_answer_2,
            llm_client=mock_llm_client,
            k=1
        )
        print(f"Query: {query_for_rag_answer_2}")
        print(f"RAG Answer: {answer_from_rag_2}")


    asyncio.run(test_rag_service())