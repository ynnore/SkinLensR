# /home/manik/skinlensr/SkinLensR/backend/app/services/scan_service.py

import logging
from typing import List, Dict, Any, Optional, Union

# Importez vos services IA
from app.services.huggingface import HuggingFaceService
from app.services.openai_compatible_llm import OpenAICompatibleLLM
from app.services.rag import RAGService

# Importez vos schémas Pydantic (si le service retourne des schémas)
from app.schemas.scan import ScanQueryRequest, ScanResponse
# Potentiellement des schémas pour les résultats d'image/vidéo

logger = logging.getLogger(__name__)

class ScanService:
    def __init__(self,
                 llm_client: OpenAICompatibleLLM,
                 hf_service: HuggingFaceService,
                 rag_service: RAGService):
        """
        Initialise le service de scan/génération IA.
        Injecte les services nécessaires pour les différentes opérations.
        """
        self.llm_client = llm_client
        self.hf_service = hf_service
        self.rag_service = rag_service
        logger.info("ScanService initialized.")

    async def process_request(self, request_data: ScanQueryRequest, file_content: Optional[str] = None, file_id: Optional[int] = None) -> Dict[str, Any]:
        """
        Traite une requête de scan/génération et retourne le résultat.
        
        Args:
            request_data (ScanQueryRequest): Les données de la requête (prompt, mode).
            file_content (Optional[str]): Le contenu du fichier si uploadé et traité.
            file_id (Optional[int]): L'ID d'un fichier pré-existant pour contexte.

        Returns:
            Dict[str, Any]: Le résultat de la génération (texte, URL, etc.).
        """
        prompt = request_data.query
        mode = request_data.mode.lower()
        
        logger.info(f"Processing scan request: mode='{mode}', prompt='{prompt[:50]}...'")

        generated_content: Dict[str, Any] = {}

        try:
            final_prompt = prompt # Prompt de base

            # --- Traitement du Contexte basé sur le mode et le fichier ---
            if mode == "text":
                if file_content:
                    final_prompt = f"Context: {file_content}\n\nUser Query: {prompt}\n\nAnswer:"
            
            elif mode == "rag_text":
                # Si le mode est RAG, on utilise le RAG service pour obtenir le contexte
                # Le RAG service peut utiliser le prompt, ou le file_content si uploadé, ou chercher dans la DB RAG.
                search_results = await self.rag_service.search_documents(query=prompt, k=3) # Recherche simple pour RAG
                final_prompt = self.rag_service.build_rag_prompt(query=prompt, context_documents=search_results)
                logger.info(f"RAG context found for prompt. Building prompt for LLM.")

            elif mode == "image":
                # Pour la génération d'image, le prompt est directement passé au modèle d'image.
                # Le fichier uploadé (si présent) pourrait être utilisé pour une image-to-image ou une description.
                # Ici, on appelle le service Hugging Face pour la génération d'image.
                if file_content: # Si on upload une image pour la décrire/modifier
                    # image_info = await self.hf_service.process_image(file_content) # Exemple
                    # final_prompt = f"Based on this image description: {image_info}\nGenerate an image related to: {prompt}"
                    pass # On pourrait adapter le prompt ici
                
                image_url = await self.hf_service.generate_image(prompt=prompt) # Appelle le service HF pour générer une image
                generated_content["image_url"] = image_url
                logger.info(f"Image generation requested. URL placeholder: {image_url}")

            elif mode == "video":
                # Pour la génération vidéo
                # video_url = await self.hf_service.generate_video(prompt=prompt)
                # generated_content["video_url"] = video_url
                generated_content["video_url"] = "https://example.com/placeholder_video.mp4" # Placeholder
                logger.info("Video generation placeholder called.")

            # --- Exécution du LLM (si mode text ou rag_text) ---
            if mode == "text" or mode == "rag_text":
                if not self.llm_client: # Vérifier si le client LLM est disponible
                    raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="LLM client is not available.")
                
                response = await self.llm_client.generate_text_completion(
                    prompt=final_prompt,
                    stream=False # On attend une réponse complète
                )
                generated_content["response_text"] = response

            return generated_content

        except HTTPException as http_exc:
            raise http_exc
        except Exception as e:
            logger.error(f"Error processing scan request for user (mode: {mode}): {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to process scan request: {e}")

# --- Dépendance pour obtenir le service de scan ---
# Vous devrez créer cette fonction de dépendance dans app/core/dependencies.py
# def get_scan_service(
#     llm_client: OpenAICompatibleLLM = Depends(get_openai_compatible_llm),
#     hf_service: HuggingFaceService = Depends(get_huggingface_service),
#     rag_service: RAGService = Depends(get_rag_service)
# ) -> ScanService:
#     """
#     Fournit une instance du service de scan/génération IA.
#     """
#     return ScanService(llm_client=llm_client, hf_service=hf_service, rag_service=rag_service)