# /home/manik/skinlensr/SkinLensR/backend/app/crud/legal_documents.py

import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Importez votre modèle SQLAlchemy pour les documents légaux
# Assurez-vous que ce modèle est défini dans app/models/legal_document.py
from app.models.legal_document import LegalDocument, LegalDocumentType # Si vous utilisez un Enum pour le type

logger = logging.getLogger(__name__)

# --- Fonctions CRUD pour les Documents Légaux ---

def create_legal_document(
    db: Session,
    type: str,
    version: str,
    language: str,
    content: str,
    status: Optional[str] = None # Optionnel : si vous avez un champ statut dans le modèle
) -> Optional[LegalDocument]:
    """
    Crée une nouvelle entrée de document légal dans la base de données.
    """
    logger.info(f"Creating legal document: type='{type}', version='{version}', lang='{language}'")
    try:
        db_document = LegalDocument(
            type=type,
            version=version,
            language=language,
            content=content,
            status=status # Assigner le statut s'il existe
            # Le titre peut être généré à partir du type/version ou fourni
        )
        db.add(db_document)
        db.commit()
        db.refresh(db_document) # Rafraîchir pour obtenir l'ID et les timestamps
        logger.info(f"Legal document created successfully: ID={db_document.id}, Version='{db_document.version}'")
        return db_document
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating legal document ({type}, {version}, {language}): {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error creating legal document ({type}, {version}, {language}): {e}")
        return None

def get_legal_document_by_id(db: Session, document_id: int) -> Optional[LegalDocument]:
    """
    Récupère un document légal spécifique par son ID.
    """
    logger.debug(f"Fetching legal document by ID: {document_id}")
    try:
        # Utilisation de query().get() pour une récupération directe par PK
        document = db.query(LegalDocument).get(document_id)
        if document:
            logger.debug(f"Found legal document ID {document_id}: Type='{document.type}'")
        else:
            logger.warning(f"Legal document not found for ID: {document_id}")
        return document
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching legal document ID {document_id}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching legal document ID {document_id}: {e}")
        return None

def get_latest_legal_document(db: Session, doc_type: str, language: str) -> Optional[LegalDocument]:
    """
    Récupère la dernière version publiée d'un document légal pour un type et une langue donnés.
    Ceci est très utile pour afficher la version la plus récente à l'utilisateur.
    """
    logger.debug(f"Fetching latest legal document for type='{doc_type}', lang='{language}'")
    try:
        # Requête pour trouver le document avec le type et la langue spécifiés,
        # trié par version dans l'ordre décroissant, et on prend le premier.
        # Assurez-vous que votre champ 'version' peut être trié correctement (par ex. format x.y.z).
        # Si ce n'est pas le cas, une logique de tri plus complexe sera nécessaire.
        document = db.query(LegalDocument).filter(
            LegalDocument.type == doc_type,
            LegalDocument.language == language
            # Ajoutez ici un filtre sur le statut si vous l'utilisez (ex: LegalDocument.status == 'published')
        ).order_by(LegalDocument.version.desc()).first() # Tri par version décroissante
        
        if document:
            logger.debug(f"Found latest legal document for {doc_type} ({language}): ID={document.id}, Version='{document.version}'")
        else:
            logger.warning(f"Latest legal document not found for type='{doc_type}', lang='{language}'")
        return document
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching latest legal document for {doc_type} ({language}): {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching latest legal document for {doc_type} ({language}): {e}")
        return None

def get_all_legal_documents(db: Session, skip: int = 0, limit: int = 100) -> List[LegalDocument]:
    """
    Récupère la liste de tous les documents légaux, avec pagination.
    """
    logger.debug(f"Fetching all legal documents (skip={skip}, limit={limit})")
    try:
        documents = db.query(LegalDocument).offset(skip).limit(limit).all()
        logger.debug(f"Found {len(documents)} legal documents.")
        return documents
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching all legal documents: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching all legal documents: {e}")
        return []

def update_legal_document(
    db: Session,
    document_id: int,
    type: Optional[str] = None,
    version: Optional[str] = None,
    language: Optional[str] = None,
    content: Optional[str] = None,
    status: Optional[str] = None # Si vous avez un champ statut
) -> Optional[LegalDocument]:
    """
    Met à jour un document légal existant. Ne met à jour que les champs fournis.
    """
    logger.debug(f"Attempting to update legal document ID: {document_id}")
    try:
        document = db.query(LegalDocument).get(document_id)
        if not document:
            logger.warning(f"Legal document not found for update ID: {document_id}")
            return None

        # Mettre à jour les champs s'ils sont fournis
        if type is not None:
            document.type = type
        if version is not None:
            document.version = version
        if language is not None:
            document.language = language
        if content is not None:
            document.content = content
        if status is not None:
            document.status = status
            
        db.commit()
        db.refresh(document) # Rafraîchir pour obtenir les dernières données (comme updated_at)
        logger.info(f"Legal document ID {document_id} updated successfully.")
        return document

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error updating legal document ID {document_id}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error updating legal document ID {document_id}: {e}")
        return None

def delete_legal_document(db: Session, document_id: int) -> Optional[LegalDocument]:
    """
    Supprime un document légal par son ID.
    """
    logger.info(f"Attempting to delete legal document ID: {document_id}")
    try:
        document = db.query(LegalDocument).get(document_id)
        if not document:
            logger.warning(f"Legal document not found for deletion ID: {document_id}")
            return None

        db.delete(document)
        db.commit()
        logger.info(f"Legal document ID {document_id} deleted successfully.")
        return document # Retourner le document supprimé pour confirmation

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error deleting legal document ID {document_id}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error deleting legal document ID {document_id}: {e}")
        return None