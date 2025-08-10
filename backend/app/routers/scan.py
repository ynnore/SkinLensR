# /home/manik/skinlensr/SkinLensR/backend/app/routers/scan.py

import logging
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse

# Importez les schémas Pydantic pour le scan/génération
# Assurez-vous qu'ils sont bien définis dans app/schemas/scan.py
from app.schemas.scan import (
    ScanQueryRequest, ScanResponse
)
# Si vous avez besoin de schémas du drive pour référencer des fichiers :
# from app.schemas.drive import FileResponse # pour les détails de fichiers

# Importez les services nécessaires
from app.services.rag import RAGService
from app.services.huggingface import HuggingFaceService
from app.services.openai_compatible_llm import OpenAICompatibleLLM

# Importez vos fonctions de dépendance
from app.database import get_db # Si les routes scan interagissent avec la DB
from app.core.dependencies import (
    get_current_user,
    get_rag_service,
    get_huggingface_service,
    get_openai_compatible_llm,
    get_file_storage_path # Pour savoir où sauvegarder les fichiers uploadés
)
# Si vous avez besoin de la dépendance admin pour certaines actions
# from app.core.dependencies import get_current_admin_user

# Importez les fonctions CRUD du drive si nécessaire pour gérer les fichiers uploadés
# from app.crud.drive import create_file_record, get_file_record_by_id # Exemple

router = APIRouter(
    prefix="/scan", # Préfixe pour toutes les routes de scan
    tags=["Scan & AI Generation"],
    dependencies=[Depends(get_current_user)] # Sécuriser toutes les routes avec authentification utilisateur
)

logger = logging.getLogger(__name__)

# --- Routes ---

@router.post("/generate", response_model=Dict[str, Any]) # La réponse peut varier selon le mode
async def generate_content_route(
    file: Optional[UploadFile] = File(None, description="Optional file for context (image, document, etc.)"),
    prompt: str, # Le prompt textuel pour la génération
    mode: str = "text", # Mode de génération: 'text', 'image', 'video', 'rag_text'
    file_id: Optional[int] = None, # Optionnel: ID d'un fichier déjà uploadé et indexé
    db: Session = Depends(get_db), # Injecter la DB si nécessaire (ex: pour indexer un fichier uploadé)
    rag_service: RAGService = Depends(get_rag_service), # Injecter le service RAG
    hf_service: HuggingFaceService = Depends(get_huggingface_service), # Injecter le service Hugging Face
    llm_client: OpenAICompatibleLLM = Depends(get_openai_compatible_llm), # Injecter le client LLM
    file_storage_path: str = Depends(get_file_storage_path) # Chemin pour sauvegarder les fichiers
):
    """
    Déclenche une analyse ou une génération de contenu IA.
    Ce point d'entrée peut être appelé par le bouton "+" de l'interface utilisateur.
    Il utilise le prompt et un mode (texte, image, vidéo, rag_text),
    ainsi qu'un fichier uploadé ou référencé par ID comme contexte.
    """
    logger.info(f"Generating content (mode: {mode}) for user {Depends(get_current_user).email} with prompt: '{prompt[:50]}...'")

    generated_content: Dict[str, Any] = {} # Stockera le résultat (texte, URL image/vidéo)
    file_location = None # Pour garder une trace du fichier uploadé si nécessaire

    try:
        # --- Traitement du fichier si uploadé ou référencé ---
        file_content_for_ia: Optional[str] = None # Contenu du fichier pour l'IA (ex: texte extrait, description)

        if file:
            logger.info(f"Processing uploaded file: {file.filename}")
            # Sauvegarder le fichier uploadé pour pouvoir l'utiliser.
            # Si vous avez une logique de gestion des fichiers uploadés, intégrez-la ici.
            # Par exemple, via le service Drive pour le stockage et l'enregistrement DB.
            # Ici, on sauvegarde temporairement pour traitement.
            file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_location = os.path.join(file_storage_path, unique_filename)

            try:
                with open(file_location, "wb+") as file_object:
                    shutil.copyfileobj(file.file, file_object)
            except Exception as e:
                logger.error(f"Failed to save uploaded file {file.filename}: {e}")
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to save uploaded file.")

            # Processer le fichier pour l'IA selon le mode
            if mode == "image":
                # Appeler Hugging Face pour obtenir une description de l'image ou effectuer une analyse
                # image_description = await hf_service.process_image_for_description(file_location)
                # file_content_for_ia = image_description
                file_content_for_ia = f"Description placeholder for {file.filename}"
                logger.info(f"Image file '{file.filename}' processed for description.")

            elif mode == "video":
                # Appeler Hugging Face ou un autre service pour traiter la vidéo (ex: extraire des tags, transcrire)
                # video_processing_result = await hf_service.process_video(file_location)
                # file_content_for_ia = video_processing_result
                file_content_for_ia = f"Processing placeholder for {file.filename}"
                logger.info(f"Video file '{file.filename}' processed.")
                
            elif mode == "text":
                # Lire le contenu texte du fichier
                try:
                    if file.content_type == "text/plain":
                        file_content_for_ia = (await file.read()).decode("utf-8")
                    else:
                        # Pour d'autres types (PDF, DOCX), utiliser des bibliothèques appropriées
                        file_content_for_ia = f"Placeholder for text extraction from {file.filename}."
                    logger.info(f"Text file '{file.filename}' processed.")
                except Exception as e:
                    logger.error(f"Error reading text file {file.filename}: {e}")
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Could not read text from file: {file.filename}")

            elif mode == "rag_text":
                 # Si le mode est RAG, on indexe le document uploadé dans le Vector Store
                 # Il faut lire le contenu du fichier d'abord
                 file_text_content = (await file.read()).decode("utf-8") if file.content_type == "text/plain" else f"Placeholder for RAG text from {file.filename}"
                 await rag_service.index_document(
                     document_content=file_text_content,
                     source_name=file.filename or "uploaded_document",
                     metadata={"user_id": current_user.id}
                 )
                 file_content_for_ia = "Document indexed for RAG search." # Indiquer que le document a été indexé
                 logger.info(f"Document '{file.filename}' indexed for RAG.")
            
        elif file_id:
            # Si un file_id est fourni, récupérer le chemin du fichier depuis la DB
            # Vous aurez besoin d'une fonction CRUD pour cela : crud.get_file_record_by_id(db, file_id)
            # file_record = crud.get_file_record_by_id(db, file_id=file_id)
            # if not file_record:
            #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File associated with file_id not found.")
            # file_location = file_record.filepath # Chemin vers le fichier
            # logger.info(f"Using existing file from DB with ID {file_id}, path: {file_location}")
            # Le contenu du fichier sera lu si nécessaire pour RAG ou pour le LLM.
            pass # Placeholder si le file_id est utilisé et le contenu traité plus tard.

        # --- Génération de Contenu IA ---
        
        final_prompt = prompt # Prompt initial
        
        if mode == "text":
            # Utiliser le prompt utilisateur directement ou le combiner avec le contexte du fichier
            if file_content_for_ia:
                final_prompt = f"Context: {file_content_for_ia}\n\nUser Query: {prompt}\n\nAnswer:"
            
            # Appeler le LLM client pour la génération de texte
            generated_text = await llm_client.generate_text_completion(
                prompt=final_prompt,
                stream=False # On attend une réponse complète ici
                # Autres paramètres : max_length, temperature etc.
            )
            generated_content["response_text"] = generated_text
            
        elif mode == "rag_text":
            # Utiliser RAG pour générer la réponse. Le RAG recherche le contexte et demande au LLM.
            # On utilise le prompt utilisateur, et RAG recherche le contexte (potentiellement lié au file_id ou au fichier uploadé)
            # Si le fichier uploadé est déjà indexé et qu'on utilise son contenu comme RAG context :
            if file_content_for_ia and "indexed for RAG" in file_content_for_ia: # Vérification simple
                 # Il faudrait que RAGService puisse rechercher en se basant sur un contenu déjà traité ou indexé
                 # Ou que le prompt soit construit avec le contenu du fichier uploadé pour le RAG
                 search_results = await rag_service.search_documents(query=prompt, k=3) # Recherche basée sur le prompt
                 final_prompt = rag_service.build_rag_prompt(query=prompt, context_documents=search_results)
            else:
                 # Si pas de fichier uploadé pour RAG, ou si RAG doit chercher dans la DB indépendamment du fichier
                 search_results = await rag_service.search_documents(query=prompt, k=3)
                 final_prompt = rag_service.build_rag_prompt(query=prompt, context_documents=search_results)
            
            # Envoyer le prompt RAG au LLM
            generated_text = await llm_client.generate_text_completion(prompt=final_prompt, stream=False)
            generated_content["response_text"] = generated_text
            # Vous pourriez vouloir inclure les sources de RAG dans la réponse
            # generated_content["retrieved_context"] = search_results # Si ScanResponse le supporte

        elif mode == "image":
            # Utiliser Hugging Face pour la génération d'image
            # Assurez-vous que hf_service a une méthode comme generate_image
            # image_url = await hf_service.generate_image(prompt=prompt)
            # generated_content["image_url"] = image_url
            generated_content["image_url"] = "https://example.com/placeholder_image.png" # Placeholder
            logger.info("Image generation placeholder called.")

        elif mode == "video":
            # Utiliser Hugging Face ou un autre service pour la génération vidéo
            # video_url = await hf_service.generate_video(prompt=prompt)
            # generated_content["video_url"] = video_url
            generated_content["video_url"] = "https://example.com/placeholder_video.mp4" # Placeholder
            logger.info("Video generation placeholder called.")

        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Unsupported generation mode: {mode}")

        return JSONResponse(content=generated_content)

    except HTTPException: # Relayer les HTTPErrors levées plus tôt
        raise
    except Exception as e:
        logger.error(f"Error during content generation for user {current_user.id} (mode: {mode}): {e}")
        # Nettoyer les fichiers temporaires si une erreur survient après upload
        if file_location and os.path.exists(file_location):
            try:
                os.remove(file_location)
                logger.info(f"Cleaned up temporary file: {file_location}")
            except OSError as oe:
                logger.error(f"Error cleaning up temporary file {file_location}: {oe}")
        
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Content generation failed: {e}")