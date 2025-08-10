# /home/manik/skinlensr/SkinLensR/backend/app/crud/scan.py

import logging
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

# Importez vos modèles SQLAlchemy
from app.models.base import Base
# CORRECTION : Assurez-vous que func est importé depuis sqlalchemy
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum, func 

# Importez le modèle ScanRequestModel (même si vous l'avez défini ici, c'est une bonne pratique si elle était dans un fichier séparé)
# from app.models.scan import ScanRequestModel # Si ScanRequestModel est dans un fichier séparé

# Assurez-vous que les schémas Pydantic sont importés (si nécessaires dans ce fichier)
# from app.schemas.scan import ScanQueryRequest, ScanResponse, ScanRequestCreate, ScanRequestUpdate

logger = logging.getLogger(__name__)

# --- Modèle SQLAlchemy pour les Requêtes de Scan/Génération ---
# (Ce modèle représente les données persistantes, distinctes des schémas Pydantic pour les API)

class ScanRequestModel(Base):
    """
    Modèle SQLAlchemy pour représenter une requête de scan/génération IA.
    """
    __tablename__ = "scan_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    
    prompt = Column(Text, nullable=False, comment="Le prompt utilisateur")
    mode = Column(String, index=True, nullable=False, comment="Mode de génération (text, image, video, rag_text)")
    file_id = Column(Integer, ForeignKey("drive_files.id"), index=True, nullable=True) 
    
    result_text = Column(Text, nullable=True, comment="Résultat texte de la génération")
    result_url = Column(String, nullable=True, comment="URL du résultat image/vidéo")
    result_status = Column(String, default="pending", index=True, comment="Statut de la génération (pending, processing, completed, failed)")

    requested_at = Column(DateTime, server_default=func.now()) # Utilisation de func.now()
    completed_at = Column(DateTime, nullable=True, comment="Quand la génération a été complétée")

    def __repr__(self):
        return f"<ScanRequest(id={self.id}, user_id={self.user_id}, mode='{self.mode}', prompt='{self.prompt[:50]}...', status='{self.result_status}')>"

# --- Fonctions CRUD pour les Requêtes de Scan/Génération ---

def create_scan_request(
    db: Session,
    user_id: int,
    prompt: str,
    mode: str,
    file_id: Optional[int] = None,
    result_status: str = "pending"
) -> Optional[ScanRequestModel]:
    """
    Crée une nouvelle entrée dans la table des requêtes de scan/génération.
    """
    logger.info(f"Creating scan request for user ID {user_id}, mode='{mode}', prompt='{prompt[:50]}...'")
    try:
        scan_req = ScanRequestModel(
            user_id=user_id,
            prompt=prompt,
            mode=mode,
            file_id=file_id,
            result_status=result_status
        )
        db.add(scan_req)
        db.commit()
        db.refresh(scan_req)
        logger.info(f"Scan request created successfully: ID={scan_req.id}, Status='{scan_req.result_status}'")
        return scan_req
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating scan request for user {user_id}: {e}")
        # raise e # Il peut être préférable de relancer l'exception pour qu'elle soit gérée plus haut
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error creating scan request for user {user_id}: {e}")
        # raise e
        return None

def get_scan_request_by_id(db: Session, request_id: int) -> Optional[ScanRequestModel]:
    """
    Récupère une requête de scan/génération par son ID.
    """
    logger.debug(f"Fetching scan request by ID: {request_id}")
    try:
        scan_request = db.query(ScanRequestModel).get(request_id)
        if scan_request:
            logger.debug(f"Scan request found: ID={scan_request.id}, Mode='{scan_request.mode}'")
        else:
            logger.warning(f"Scan request not found for ID: {request_id}")
        return scan_request
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching scan request ID {request_id}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching scan request ID {request_id}: {e}")
        return None

def get_user_scan_requests(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[ScanRequestModel]:
    """
    Récupère une liste des requêtes de scan/génération pour un utilisateur donné.
    """
    logger.debug(f"Fetching scan requests for user ID: {user_id} (skip={skip}, limit={limit})")
    try:
        requests = db.query(ScanRequestModel).filter(ScanRequestModel.user_id == user_id).offset(skip).limit(limit).all()
        logger.debug(f"Found {len(requests)} scan requests for user ID {user_id}.")
        return requests
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching scan requests for user ID {user_id}: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching scan requests for user ID {user_id}: {e}")
        return []

def update_scan_request_status(db: Session, request_id: int, new_status: str, result_text: Optional[str] = None, result_url: Optional[str] = None) -> Optional[ScanRequestModel]:
    """
    Met à jour le statut d'une requête de scan/génération et potentiellement son résultat.
    """
    logger.info(f"Updating scan request ID {request_id} to status '{new_status}'.")
    try:
        scan_request = db.query(ScanRequestModel).get(request_id)
        if not scan_request:
            logger.warning(f"Scan request not found for update ID: {request_id}")
            return None

        scan_request.result_status = new_status
        if result_text is not None:
            scan_request.result_text = result_text
        if result_url is not None:
            scan_request.result_url = result_url
        if new_status == "completed":
            scan_request.completed_at = datetime.utcnow() # Utilisation de datetime.utcnow

        db.commit()
        db.refresh(scan_request)
        logger.info(f"Scan request ID {request_id} updated successfully with status '{new_status}'.")
        return scan_request

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error updating scan request ID {request_id}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error updating scan request ID {request_id}: {e}")
        return None

def delete_scan_request(db: Session, request_id: int) -> Optional[ScanRequestModel]:
    """
    Supprime une requête de scan/génération par son ID.
    """
    logger.info(f"Attempting to delete scan request ID: {request_id}")
    try:
        scan_request = db.query(ScanRequestModel).get(request_id)
        if not scan_request:
            logger.warning(f"Scan request not found for deletion ID: {request_id}")
            return None

        db.delete(scan_request)
        db.commit()
        logger.info(f"Scan request ID {request_id} deleted successfully.")
        return scan_request

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error deleting scan request ID {request_id}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error deleting scan request ID {request_id}: {e}")
        return None