# /home/manik/skinlensr/SkinLensR/backend/app/routers/scan.py

import os
import shutil
import uuid
import logging
from typing import Optional, List

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.schemas.scan import ScanResponse
from app.services.rag import RAGService
from app.services.huggingface import HuggingFaceService
from app.services.openai_compatible_llm import OpenAICompatibleLLM
from app.database import get_db
from app.core.dependencies import (
    get_current_user,
    get_rag_service,
    get_huggingface_service,
    get_openai_compatible_llm,
    get_file_storage_path
)

router = APIRouter(
    prefix="/scan",
    tags=["Scan & AI Generation"],
    dependencies=[Depends(get_current_user)]
)

logger = logging.getLogger(__name__)

@router.post(
    "/generate",
    response_model=ScanResponse,
    summary="Générer du contenu IA avec ou sans fichier",
    description=(
        "Déclenche une génération IA selon un prompt, un fichier uploadé ou référencé, "
        "et un mode parmi: 'text', 'rag_text', 'image', 'video'."
    ),
)
async def generate_content_route(
    prompt: str = Query(..., description="Texte de la requête utilisateur pour la génération IA"),
    mode: str = Query("text", description="Mode de génération: text, rag_text, image, video"),
    file: Optional[UploadFile] = File(None, description="Fichier optionnel pour contexte additionnel"),
    file_id: Optional[int] = Query(None, description="ID d'un fichier référencé dans la base"),
    db: Session = Depends(get_db),
    rag_service: RAGService = Depends(get_rag_service),
    hf_service: HuggingFaceService = Depends(get_huggingface_service),
    llm_client: OpenAICompatibleLLM = Depends(get_openai_compatible_llm),
    file_storage_path: str = Depends(get_file_storage_path),
    current_user = Depends(get_current_user),
):
    generated_content = {}
    file_location = None

    try:
        file_content_for_ia: Optional[str] = None

        if file:
            logger.info(f"Processing uploaded file: {file.filename}")
            file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_location = os.path.join(file_storage_path, unique_filename)

            try:
                with open(file_location, "wb+") as file_object:
                    shutil.copyfileobj(file.file, file_object)
            except Exception as e:
                logger.error(f"Failed to save uploaded file {file.filename}: {e}")
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to save uploaded file.")

            if mode == "image":
                try:
                    image_description = await hf_service.describe_image(file_location)
                    file_content_for_ia = image_description
                    logger.info(f"Image described: {image_description}")
                except Exception as e:
                    logger.error(f"HuggingFace image description error: {e}")
                    raise HTTPException(status_code=500, detail="Image processing failed.")

            elif mode == "video":
                try:
                    video_summary = await hf_service.analyze_video(file_location)
                    file_content_for_ia = video_summary
                    logger.info(f"Video analyzed: {video_summary}")
                except Exception as e:
                    logger.error(f"HuggingFace video processing error: {e}")
                    raise HTTPException(status_code=500, detail="Video processing failed.")

            elif mode == "text":
                try:
                    if file.content_type == "text/plain":
                        file_content_for_ia = (await file.read()).decode("utf-8")
                    else:
                        file_content_for_ia = f"Text extraction placeholder for {file.filename}."
                    logger.info("Text file processed for LLM context.")
                except Exception as e:
                    logger.error(f"Reading text file error: {e}")
                    raise HTTPException(status_code=400, detail="Could not read text from file.")

            elif mode == "rag_text":
                try:
                    file_text = (await file.read()).decode("utf-8") if file.content_type == "text/plain" else f"RAG placeholder for {file.filename}"
                    await rag_service.index_document(
                        document_content=file_text,
                        source_name=file.filename or "uploaded_document",
                        metadata={"user_id": current_user.id}
                    )
                    file_content_for_ia = "Document indexed for RAG search."
                    logger.info("Document indexed in vector store for RAG.")
                except Exception as e:
                    logger.error(f"RAG indexing error: {e}")
                    raise HTTPException(status_code=500, detail="RAG document indexing failed.")

        elif file_id:
            logger.info(f"Using file with ID {file_id} for processing (not implemented).")

        final_prompt = prompt
        if mode == "text":
            if file_content_for_ia:
                final_prompt = f"Context: {file_content_for_ia}\n\nUser Query: {prompt}\n\nAnswer:"
            generated_text = await llm_client.generate_text_completion(prompt=final_prompt, stream=False)
            generated_content["response_text"] = generated_text

        elif mode == "rag_text":
            search_results = await rag_service.search_documents(query=prompt, k=3)
            final_prompt = rag_service.build_rag_prompt(query=prompt, context_documents=search_results)
            generated_text = await llm_client.generate_text_completion(prompt=final_prompt, stream=False)
            generated_content["response_text"] = generated_text
            generated_content["retrieved_context"] = search_results

        elif mode == "image":
            image_url = await hf_service.generate_image(prompt=prompt)
            generated_content["image_url"] = image_url

        elif mode == "video":
            video_url = await hf_service.generate_video(prompt=prompt)
            generated_content["video_url"] = video_url

        else:
            raise HTTPException(status_code=400, detail=f"Unsupported generation mode: {mode}")

        return generated_content

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during generation for user {current_user.id} (mode: {mode}): {e}")
        if file_location and os.path.exists(file_location):
            try:
                os.remove(file_location)
                logger.info(f"Removed temporary file {file_location}")
            except OSError as oe:
                logger.error(f"Error removing temp file {file_location}: {oe}")
        raise HTTPException(status_code=500, detail="Content generation failed.")
