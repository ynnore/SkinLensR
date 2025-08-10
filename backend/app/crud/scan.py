# /home/manik/skinlensr/SkinLensR/backend/app/crud/scan.py

import logging
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

# Importez vos modèles SQLAlchemy
# Assurez-vous que les modèles nécessaires existent (ex: ScanRequest, GeneratedContent)
# Si vous n'avez pas de modèle dédié pour les scans, vous pourriez utiliser le modèle File si le scan est lié à un fichier.
# Sinon, créons un modèle simple pour l'historique des requêtes IA.

from app.models.base import Base # Pour la définition de la Base
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey

# --- Modèle SQLAlchemy pour les Requêtes de Scan/Génération ---
# Il est important de persister ces informations pour l'historique et le suivi.
# Si vous n'avez pas encore défini ce modèle, voici une proposition :

class ScanRequestModel(Base):
    """
    Modèle SQLAlchemy pour enregistrer les requêtes de scan/génération IA.
    """
    __tablename__ = "scan_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    # Assurez-vous que la table 'users' existe et que ForeignKey est correct.
    # user = relationship("User", back_populates="scan_requests") # Relation inverse dans User model

    prompt = Column(Text, nullable=False, comment="Le prompt utilisateur")
    mode = Column(String, index=True, nullable=False, comment="Mode de génération (text, image, video, rag_text)")
    file_id = Column(Integer, ForeignKey("drive_files.id"), index=True, nullable=True) # Si un fichier est lié
    # file = relationship("DriveFile", back_populates="scan_requests") # Relation inverse dans DriveFile model

    result_text = Column(Text, nullable=True, comment="Résultat texte de la génération")
    result_url = Column(String, nullable=True, comment="URL du résultat image/vidéo")
    result_status = Column(String, default="pending", index=True, comment="Statut de la génération (pending, processing, completed, failed)")

    requested_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)

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
    logger.info(f"Creating scan request for user {user_id}, mode='{mode}', prompt='{prompt[:50]}...'")
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
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error creating scan request for user {user_id}: {e}")
        return None

def get_scan_request_by_id(db: Session, request_id: int) -> Optional[ScanRequestModel]:
    """
    Récupère une requête de scan/génération par son ID.
    """
    logger.debug(f"Fetching scan request by ID: {request_id}")
    try:
        request = db.query(ScanRequestModel).get(request_id)
        if request:
            logger.debug(f"Scan request found: ID={request.id}, Mode='{request.mode}'")
        else:
            logger.warning(f"Scan request not found for ID: {request_id}")
        return request
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
        request = db.query(ScanRequestModel).get(request_id)
        if not request:
            logger.warning(f"Scan request not found for update ID: {request_id}")
            return None

        request.result_status = new_status
        if result_text is not None:
            request.result_text = result_text
        if result_url is not None:
            request.result_url = result_url
        if new_status == "completed":
            request.completed_at = datetime.utcnow()

        db.commit()
        db.refresh(request)
        logger.info(f"Scan request ID {request_id} updated successfully with status '{new_status}'.")
        return request

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
        request = db.query(ScanRequestModel).get(request_id)
        if not request:
            logger.warning(f"Scan request not found for deletion ID: {request_id}")
            return None

        db.delete(request)
        db.commit()
        logger.info(f"Scan request ID {request_id} deleted successfully.")
        return request

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error deleting scan request ID {request_id}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error deleting scan request ID {request_id}: {e}")
        return None