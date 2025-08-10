# /home/manik/skinlensr/SkinLensR/backend/app/routers/legal.py

import logging
from typing import List, Optional, Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Importez vos schémas Pydantic pour les documents légaux
# Assurez-vous qu'ils sont bien définis dans app/schemas/legal_document.py
from app.schemas.legal_document import (
    LegalDocumentCreate, LegalDocumentResponse, LegalDocumentUpdate
)

# Importez votre service pour les documents légaux
# Assurez-vous que LegalDocumentService est implémenté dans app/services/legal_documents.py
from app.services.legal_documents import LegalDocumentService

# Importez vos fonctions de dépendance
from app.database import get_db # Dépendance pour la session DB
# Dépendance pour l'authentification et les permissions (ex: admin)
from app.core.dependencies import get_current_user, get_current_admin_user

router = APIRouter(
    prefix="/legal", # Préfixe pour toutes les routes liées aux documents légaux
    tags=["Legal Documents"],
    # Sécurisation des routes : ici, nous dépendons de l'utilisateur courant.
    # Si la gestion des documents légaux est réservée aux admins, utilisez Depends(get_current_admin_user)
    dependencies=[Depends(get_current_user)] 
)

logger = logging.getLogger(__name__)

# --- Dépendance pour le Service de Documents Légaux ---
# Cette fonction doit être définie dans app/core/dependencies.py
def get_legal_document_service(db: Session = Depends(get_db)) -> LegalDocumentService:
    """
    Fournit une instance du service de documents légaux.
    """
    # Le service a besoin de la session DB pour interagir avec la base de données.
    return LegalDocumentService(db_session=db)

# --- Routes CRUD pour les Documents Légaux ---

@router.post("/documents", response_model=LegalDocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_legal_document_route(
    doc_data: LegalDocumentCreate,
    db: Session = Depends(get_db),
    legal_service: LegalDocumentService = Depends(get_legal_document_service),
    # current_admin: Any = Depends(get_current_admin_user) # Dépendance pour restreindre aux admins
):
    """
    Crée un nouveau document légal (ex: CGU, Politique de confidentialité).
    Cette route pourrait nécessiter des permissions d'admin.
    """
    logger.info(f"Creating new legal document: type='{doc_data.type}', lang='{doc_data.language}', version='{doc_data.version}'")
    
    try:
        # Appeler le service pour créer le document
        new_doc = legal_service.create_legal_document(
            db=db,
            type=doc_data.type,
            version=doc_data.version,
            language=doc_data.language,
            content=doc_data.content
        )
        
        if not new_doc: # Si le service a retourné None (ex: erreur DB)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create legal document.")
            
        logger.info(f"Legal document created successfully: ID={new_doc.id}")
        # Retourner le schéma Pydantic de la réponse
        return LegalDocumentResponse(
            id=new_doc.id,
            type=new_doc.type,
            version=new_doc.version,
            language=new_doc.language,
            content_preview=new_doc.content[:100] + "..." if new_doc.content else "", # Extrait du contenu
            created_at=new_doc.created_at,
            updated_at=new_doc.updated_at
        )
        
    except HTTPException as http_exc: # Relayer les HTTPErrors (ex: si la dépendance admin échoue)
        raise http_exc
    except Exception as e:
        logger.error(f"Unexpected error during create legal document: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {e}")

@router.get("/documents/{document_id}", response_model=LegalDocumentResponse)
async def get_legal_document_by_id_route(
    document_id: int,
    db: Session = Depends(get_db),
    legal_service: LegalDocumentService = Depends(get_legal_document_service),
    current_user: Any = Depends(get_current_user) # Nécessaire si l'accès aux documents est restreint par utilisateur
):
    """
    Récupère un document légal spécifique par son ID.
    (Potentiellement, vous voudriez vérifier que l'utilisateur courant a le droit d'accéder à ce document).
    """
    logger.info(f"Fetching legal document by ID: {document_id}.")
    
    doc = legal_service.get_legal_document_by_id(db, document_id=document_id)
    
    if not doc:
        logger.warning(f"Legal document not found for ID: {document_id}.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Legal document not found.")
        
    # Ajout d'une vérification d'autorisation si nécessaire (par exemple, seulement admins peuvent voir certains docs)
    # if current_user.role != "admin" and doc.type in ["internal_only", "admin_only"]: # Exemple de logique
    #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to access this document.")

    logger.info(f"Found legal document ID {document_id}: Type='{doc.type}', Version='{doc.version}'.")
    return LegalDocumentResponse(
        id=doc.id,
        type=doc.type,
        version=doc.version,
        language=doc.language,
        content_preview=doc.content[:100] + "..." if doc.content else "", # Extrait du contenu
        created_at=doc.created_at,
        updated_at=doc.updated_at
    )

@router.get("/documents", response_model=List[LegalDocumentResponse])
async def get_all_legal_documents_route(
    db: Session = Depends(get_db),
    legal_service: LegalDocumentService = Depends(get_legal_document_service),
    current_user: Any = Depends(get_current_user) # Nécessaire si l'accès aux documents est restreint par utilisateur
):
    """
    Récupère la liste de tous les documents légaux.
    (Potentiellement, l'accès à cette liste peut être restreint par rôle).
    """
    logger.info(f"Fetching all legal documents for user {current_user.id}.")
    
    docs = legal_service.get_all_legal_documents(db)
    
    # Mapper les modèles SQLAlchemy vers les schémas Pydantic pour la réponse
    response_docs = [
        LegalDocumentResponse(
            id=doc.id,
            type=doc.type,
            version=doc.version,
            language=doc.language,
            content_preview=doc.content[:100] + "..." if doc.content else "",
            created_at=doc.created_at,
            updated_at=doc.updated_at
        )
        for doc in docs
    ]
    
    logger.info(f"Found {len(response_docs)} legal documents.")
    return response_docs

@router.put("/documents/{document_id}", response_model=LegalDocumentResponse)
async def update_legal_document_route(
    document_id: int,
    doc_update_data: LegalDocumentUpdate, # Utilisez le schéma pour la mise à jour
    db: Session = Depends(get_db),
    legal_service: LegalDocumentService = Depends(get_legal_document_service),
    # current_admin: Any = Depends(get_current_admin_user) # Nécessite des permissions admin
):
    """
    Met à jour un document légal existant. Nécessite des permissions d'administrateur.
    """
    logger.info(f"Attempting to update legal document ID: {document_id}.")
    
    # La mise à jour doit passer tous les champs à jour, même si c'est par le schéma Update.
    # Le service doit gérer les champs optionnels.
    updated_doc = legal_service.update_legal_document(
        db=db,
        document_id=document_id,
        type=doc_update_data.type,
        version=doc_update_data.version,
        language=doc_update_data.language,
        content=doc_update_data.content
    )
    
    if not updated_doc:
        logger.warning(f"Legal document not found for update ID: {document_id}.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Legal document not found.")
        
    logger.info(f"Legal document ID {updated_doc.id} updated successfully.")
    return LegalDocumentResponse(
        id=updated_doc.id,
        type=updated_doc.type,
        version=updated_doc.version,
        language=updated_doc.language,
        content_preview=updated_doc.content[:100] + "..." if updated_doc.content else "",
        created_at=updated_doc.created_at, # Gardez les timestamps originaux ou mettez à jour updated_at
        updated_at=updated_doc.updated_at
    )

@router.delete("/documents/{document_id}", response_model=LegalDocumentResponse)
async def delete_legal_document_route(
    document_id: int,
    db: Session = Depends(get_db),
    legal_service: LegalDocumentService = Depends(get_legal_document_service),
    # current_admin: Any = Depends(get_current_admin_user) # Nécessite des permissions admin
):
    """
    Supprime un document légal par son ID. Nécessite des permissions d'administrateur.
    """
    logger.info(f"Attempting to delete legal document ID: {document_id}.")
    
    deleted_doc = legal_service.delete_legal_document(db, document_id=document_id)
    
    if not deleted_doc:
        logger.warning(f"Legal document not found for deletion ID: {document_id}.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Legal document not found.")
        
    logger.info(f"Legal document ID {deleted_doc.id} deleted successfully.")
    # Retourner le document supprimé peut être utile pour confirmation
    return LegalDocumentResponse(
        id=deleted_doc.id,
        type=deleted_doc.type,
        version=deleted_doc.version,
        language=deleted_doc.language,
        content_preview=deleted_doc.content[:100] + "..." if deleted_doc.content else "",
        created_at=deleted_doc.created_at, # Ces timestamps peuvent être utiles même après suppression
        updated_at=deleted_doc.updated_at
    )

# --- Routes pour les Accords Utilisateur (si vous les gérez ici) ---
# Si les routes pour enregistrer et lister les accords sont liées à /legal
# Vous auriez ici des routes comme POST /legal/agreements et GET /legal/agreements
# qui utiliseraient le LegalDocumentService ou un service dédié aux accords.

# Exemple:
# @router.post("/agreements", response_model=UserLegalAgreementResponse, status_code=status.HTTP_201_CREATED)
# async def record_user_agreement_route(...):
#     pass

# @router.get("/agreements", response_model=List[UserLegalAgreementResponse])
# async def list_user_agreements_route(...):
#     pass