# app/embeddings.py

import logging
import uuid
from typing import List, Dict, Any, Optional

import chromadb
from chromadb.config import Settings
from chromadb.api.models.Collection import Collection

from app.services.huggingface import HuggingFaceService  # Service d'embeddings

logger = logging.getLogger(__name__)

class EmbeddingsService:
    def __init__(
        self,
        embedding_model_service: HuggingFaceService,
        embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
        chroma_client: Optional[chromadb.Client] = None,
        collection_name: str = "my_documents_collection"
    ):
        self.embedding_model_service = embedding_model_service
        self.embedding_model_name = embedding_model_name

        # Initialiser ou réutiliser le client ChromaDB
        if chroma_client is None:
            self.chroma_client = chromadb.Client(Settings(
                # Config ChromaDB selon ton environnement, par ex:
                # persist_directory=".chromadb",
                # ou host & port pour service distant
            ))
        else:
            self.chroma_client = chroma_client

        # Récupérer ou créer la collection
        try:
            self.collection: Collection = self.chroma_client.get_collection(collection_name)
            logger.info(f"ChromaDB collection '{collection_name}' found.")
        except Exception:
            self.collection: Collection = self.chroma_client.create_collection(name=collection_name)
            logger.info(f"ChromaDB collection '{collection_name}' created.")

    async def get_embedding(self, text: str) -> Optional[List[float]]:
        if not text or not text.strip():
            return None
        try:
            embeddings = await self.embedding_model_service.get_embeddings(
                [text], model_name_or_path=self.embedding_model_name
            )
            return embeddings[0] if embeddings else None
        except Exception as e:
            logger.error(f"Failed to generate embedding for text: {e}")
            return None

    async def add_embedding(
        self,
        text: str,
        metadata: Optional[Dict[str, Any]] = None,
        document_id: Optional[str] = None
    ) -> Optional[str]:
        embedding_vector = await self.get_embedding(text)
        if not embedding_vector:
            logger.warning("No embedding generated for text, skipping add to vector DB.")
            return None

        if not document_id:
            document_id = str(uuid.uuid4())

        try:
            self.collection.add(
                documents=[text],
                embeddings=[embedding_vector],
                metadatas=[metadata or {}],
                ids=[document_id]
            )
            logger.info(f"Embedding added to ChromaDB for document ID: {document_id}")
            return document_id
        except Exception as e:
            logger.error(f"Failed to add embedding to ChromaDB for doc ID {document_id}: {e}")
            return None

    async def search_embeddings(
        self,
        query: str,
        k: int = 5,
        filter: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        query_embedding = await self.get_embedding(query)
        if not query_embedding:
            logger.warning("Failed to get embedding for query, cannot perform search.")
            return []

        try:
            # Chroma utilise `where` pour filtrer les métadonnées
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=k,
                where=filter or {}
            )
            # Transformer le résultat brut en liste structurée
            hits = []
            for i in range(len(results['ids'][0])):
                hits.append({
                    "id": results['ids'][0][i],
                    "content": results['documents'][0][i],
                    "score": results['distances'][0][i],  # plus petit = plus proche (distance)
                    "metadata": results['metadatas'][0][i]
                })
            logger.info(f"Found {len(hits)} results from ChromaDB.")
            return hits
        except Exception as e:
            logger.error(f"Failed to search ChromaDB: {e}")
            return []
