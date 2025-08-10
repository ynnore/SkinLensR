# /home/manik/skinlensr/SkinLensR/backend/app/api/drive.py

import logging
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import shutil
import os
import uuid

# Imports de vos utilitaires et services
from app.database import get_db
from app.schemas.drive import FileResponse, SearchRequest, SearchResult, ScanQueryRequest, ScanResponse
# Importez vos fonctions CRUD pour la gestion des fichiers
from app.crud.drive import (
    create_file_record,
    get_user_files,
    search_files_and_web # Si cette fonction est toujours pertinente pour le drive
)
# Importez vos utilitaires d'authentification
from app.auth import get_current_user

# Importez les services nécessaires pour la génération IA
from app.services.huggingface import HuggingFaceService
# Si vous avez un service spécifique pour le scan multimodal, importez-le
# from app.services.scan_service import ScanService
from app.services.rag import RAGService # Pour le mode "text" via RAG si applicable
from app.services.openai_compatible_llm import OpenAICompatibleLLM# Si le LLM pour le scan est géré ici

# Importez vos fonctions de dépendance pour les services
from app.core.dependencies import (
    get_huggingface_service,
    get_rag_service,
    get_openai_compatible_llm
)

router = APIRouter(
    prefix="/api/drive",
    tags=["Drive & AI Generation"],
    dependencies=[Depends(get_current_user)] # Toutes les routes nécessitent une authentification utilisateur
)

logger = logging.getLogger(__name__)

UPLOAD_DIR = "uploaded_files"  # Assurez-vous que ce chemin est géré correctement (ex: par un Volume Docker si en conteneur)

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR, exist_ok=True) # exist_ok=True est une bonne pratique

# --- Dépendances pour les Services ---
# Assurez-vous que ces fonctions sont définies dans app/core/dependencies.py

def get_file_storage_path() -> str:
    """Retourne le chemin où les fichiers sont stockés."""
    return UPLOAD_DIR

# Ici, on suppose que HuggingFaceService est utilisé pour la génération,
# donc on injecte son instance via la dépendance.
# Si la génération est gérée par un autre service, injectez celui-ci.

# --- Routes ---

@router.post("/upload", response_model=FileResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    user_id: Optional[int] = Depends(get_current_user), # Ou utilisez directement current_user.id
    db: Session = Depends(get_db),
    file_storage_path: str = Depends(get_file_storage_path)
):
    """
    Télécharge un fichier et l'enregistre sur le serveur.
    Crée un enregistrement dans la base de données pour suivre le fichier.
    """
    if not user_id: # Devrait être géré par Depends(get_current_user)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated")
        
    user_id = user_id.id # Assumant que get_current_user retourne un objet avec un attribut id

    logger.info(f"Uploading file '{file.filename}' for user {user_id}.")

    # Générer un nom de fichier unique pour éviter les collisions
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_location = os.path.join(file_storage_path, unique_filename)

    try:
        # Sauvegarder le fichier sur le serveur
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
            
        # Créer un enregistrement dans la base de données
        # Assurez-vous que crud.create_file_record existe et prend les bons arguments
        file_record = create_file_record(
            db=db,
            user_id=user_id,
            filename=file.filename,
            unique_filename=unique_filename,
            file_path=file_location,
            content_type=file.content_type
        )
        
        if not file_record:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create file record in database.")

        logger.info(f"File '{file.filename}' uploaded successfully as '{unique_filename}' for user {user_id}.")
        
        # Retourner les détails du fichier sauvegardé
        return FileResponse(
            id=file_record.id,
            filename=file.filename,
            filepath=file_location, # Le chemin complet pour accéder au fichier
            user_id=user_id,
            content_type=file.content_type
        )

    except HTTPException: # Relayer les HTTPErrors (ex: 500 de create_file_record)
        raise
    except Exception as e:
        logger.error(f"Error during file upload for user {user_id}: {e}")
        # Supprimer le fichier s'il a été partiellement uploadé et que la création du record a échoué
        if os.path.exists(file_location):
            os.remove(file_location)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"File upload failed: {e}")

# --- Route pour la recherche (si elle est liée au drive) ---
# Si cette recherche est distincte de la recherche RAG.
# Sinon, elle pourrait être dans le router RAG.
@router.post("/search", response_model=List[SearchResult])
async def search_drive_items(
    search_query: SearchRequest,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user) # Pour limiter la recherche aux fichiers de l'utilisateur
):
    """
    Recherche des fichiers (et potentiellement des informations web si la fonction crud le permet).
    """
    logger.info(f"Searching for '{search_query.query}' for user {current_user.id}.")
    
    try:
        # Assurez-vous que search_files_and_web prend les bons arguments
        # et retourne des objets compatibles avec SearchResult
        results = search_files_and_web(
            db=db,
            user_id=current_user.id, # Filtrer par utilisateur
            query=search_query.query,
            search_web=search_query.search_web # Paramètre pour savoir s'il faut aussi chercher sur le web
        )
        
        # Mapper les résultats si nécessaire pour correspondre à SearchResult
        # Si crud.search_files_and_web retourne déjà des SearchResult, c'est parfait.
        return results
        
    except Exception as e:
        logger.error(f"Error during search for user {current_user.id}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Search failed: {e}")

# --- Route pour la génération de contenu via IA (intégrant le bouton "+" de la page scan) ---
# Cette route va faire le lien entre le fichier uploadé et la génération IA.
# Elle utilisera potentiellement RAGService et HuggingFaceService.

# Assurez-vous d'avoir le schéma ScanQueryRequest et ScanResponse dans app/schemas/drive (ou chat/scan)
# Si ces schémas sont dans app/schemas/scan.py, importez-les depuis là.
# from app.schemas.scan import ScanQueryRequest, ScanResponse

@router.post("/generate", response_model=Dict[str, Any]) # Peut retourner différents types de résultats (URL, texte)
async def generate_content_from_upload(
    file: Optional[UploadFile] = File(None, description="Optional file for context (image, document, etc.)"),
    prompt: str, # Le prompt textuel pour la génération
    mode: str = "text", # Mode de génération: 'text', 'image', 'video', 'rag_text'
    file_id: Optional[int] = None, # Permet de référencer un fichier déjà uploadé
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
    # Injecter les services nécessaires
    rag_service: RAGService = Depends(get_rag_service),
    hf_service: HuggingFaceService = Depends(get_huggingface_service),
    llm_client: OpenAICompatibleLLM = Depends(get_openai_compatible_llm), # Si le mode 'text' utilise le LLM directement
):
    """
    Génère du contenu basé sur un prompt, potentiellement en utilisant un fichier uploadé ou indexé comme contexte.
    Ce point d'entrée peut être celui appelé par le bouton "+" de la page scan.
    """
    logger.info(f"Generating content (mode: {mode}) for user {current_user.id} with prompt: '{prompt[:50]}...'")

    generated_content: Dict[str, Any] = {}

    try:
        # --- Traitement du fichier s'il est uploadé ---
        file_content_for_ia: Optional[str] = None # Sera le contenu du fichier pour l'IA (ex: texte OCR, description image)
        
        if file:
            logger.info(f"Processing uploaded file: {file.filename}")
            # Sauvegarder le fichier uploadé pour pouvoir l'utiliser
            # (ou utiliser le chemin du fichier si on le récupère via file_id)
            file_location = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}{os.path.splitext(file.filename)[1]}")
            with open(file_location, "wb+") as file_object:
                shutil.copyfileobj(file.file, file_object)
            
            # Ici, vous devez traiter le fichier pour l'IA :
            if mode == "image":
                # Appeler un modèle multimodal pour décrire l'image ou extraire du texte (OCR)
                # Par exemple, avec Hugging Face:
                # image_description = await hf_service.process_image(file_location) # Méthode à implémenter dans HF service
                # file_content_for_ia = image_description
                file_content_for_ia = f"This is a placeholder for the description of the uploaded image: {file.filename}" # Placeholder
                logger.info(f"Image file {file.filename} processed.")
                
            elif mode == "video":
                # Traiter une vidéo (ex: extraire des tags, un résumé)
                # file_content_for_ia = await process_video(file_location) # Méthode à implémenter
                file_content_for_ia = f"This is a placeholder for the processing of the uploaded video: {file.filename}" # Placeholder
                logger.info(f"Video file {file.filename} processed.")
                
            elif mode == "text":
                # Lire le contenu texte du fichier (ex: .txt, .pdf)
                if file.content_type == "text/plain":
                    file_content_for_ia = (await file.read()).decode("utf-8")
                else:
                    # Pour d'autres types de documents (PDF, DOCX), il faut des bibliothèques spécifiques (ex: pypdf, python-docx)
                    file_content_for_ia = f"Placeholder for text extraction from {file.filename}."
                logger.info(f"Text file {file.filename} processed.")
                
            elif mode == "rag_text":
                 # Si le mode est RAG, on indexe le document uploaded dans le Vector Store
                 await rag_service.index_document(
                     document_content=file_content_for_ia or (await file.read()).decode("utf-8"), # Utiliser le contenu lu
                     source_name=file.filename or "uploaded_file",
                     metadata={"user_id": current_user.id}
                 )
                 file_content_for_ia = "Document indexed for RAG search." # Indiquer que le document a été indexé
                 logger.info(f"Document {file.filename} indexed for RAG.")

        elif file_id:
            # Si un file_id est fourni, récupérer le fichier déjà uploadé depuis la DB
            # Vous aurez besoin d'une fonction crud pour obtenir le chemin du fichier par son ID
            # file_record = crud.get_file_record_by_id(db, file_id=file_id)
            # if not file_record:
            #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found.")
            # file_location = file_record.file_path # Chemin vers le fichier
            # logger.info(f"Using existing file from DB with ID {file_id}, path: {file_location}")
            # Le contenu du fichier sera lu plus tard si nécessaire pour le mode RAG ou si le LLM a besoin du texte.
            pass # Placeholder si file_id est utilisé sans upload immédiat

        # --- Génération de Contenu ---
        
        if mode == "text" or mode == "rag_text":
            # Génération de texte via LLM, potentiellement avec RAG
            if mode == "rag_text" and file_id:
                # Si on a référencé un fichier uploadé par ID pour RAG, on ne le télécharge pas à nouveau,
                # mais on utilise le RAG service pour rechercher des infos pertinentes à partir de ce fichier (ou de la DB RAG).
                # L'idéal est que le prompt soit construit avec les infos pertinentes.
                # Ici, on fait une recherche RAG simple basée sur le prompt.
                search_results = await rag_service.search_documents(query=prompt, k=3)
                final_prompt = rag_service.build_rag_prompt(query=prompt, context_documents=search_results)
            elif file_content_for_ia and mode == "text":
                # Si un fichier texte a été uploadé et traité, l'utiliser comme contexte ou prompt
                final_prompt = f"Context: {file_content_for_ia}\n\nUser Query: {prompt}\n\nAnswer:"
            else:
                # Si pas de fichier uploadé/référencé ou si c'est un simple prompt texte
                final_prompt = prompt

            # Appeler le LLM pour la réponse textuelle
            # Assurez-vous que votre LLM client peut gérer le prompt construit
            # Si vous utilisez votre propre LLM:
            # generated_text = await hf_service.generate_text(prompt=final_prompt, max_length=200)
            # Si vous utilisez OpenAICompatibleLLM:
            generated_text = await llm_client.generate_text_completion(
                prompt=final_prompt, # Utiliser le prompt RAG ou le prompt texte
                stream=False, # Pour une réponse complète
                # Ajoutez ici d'autres paramètres si nécessaire (temperature, etc.)
            )
            generated_content["response_text"] = generated_text
            
        elif mode == "image":
            # Appeler Hugging Face pour générer une image
            # Assurez-vous que votre HF service a une méthode pour cela
            # image_url = await hf_service.generate_image(prompt=prompt)
            # generated_content["image_url"] = image_url
            generated_content["image_url"] = "https://example.com/placeholder_image.png" # Placeholder
            logger.info("Image generation placeholder called.")

        elif mode == "video":
            # Appeler Hugging Face ou autre pour générer une vidéo
            # video_url = await hf_service.generate_video(prompt=prompt)
            # generated_content["video_url"] = video_url
            generated_content["video_url"] = "https://example.com/placeholder_video.mp4" # Placeholder
            logger.info("Video generation placeholder called.")

        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Unsupported generation mode: {mode}")

        return JSONResponse(content=generated_content)

    except HTTPException: # Relayer les HTTPErrors
        raise
    except Exception as e:
        logger.error(f"Error during content generation for user {current_user.id} (mode: {mode}): {e}")
        # Nettoyer les fichiers temporaires créés lors de l'upload si une erreur survient
        if file and 'file_location' in locals() and os.path.exists(file_location):
            os.remove(file_location)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Content generation failed: {e}")