# /home/manik/skinlensr/SkinLensR/backend/app/crud/progress.py

import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Importez votre modèle SQLAlchemy pour la progression
# Assurez-vous que ce modèle est défini dans app/models/progress.py
from app.models.progress import Progress as ProgressModel, ProgressStatus # Si vous utilisez l'Enum ProgressStatus
# Importez vos schémas Pydantic pour la validation et la réponse
from app.schemas.progress import ProgressCreate, ProgressResponse, ProgressUpdate

logger = logging.getLogger(__name__)

# --- Fonctions CRUD pour le Suivi de Progression ---

def create_progress_entry(
    db: Session,
    user_id: int,
    activity_name: str,
    current_value: float,
    target_value: Optional[float] = None,
    status: Optional[str] = None # Peut accepter le statut directement ou utiliser une valeur par défaut
) -> Optional[ProgressModel]:
    """
    Crée une nouvelle entrée de suivi de progression dans la base de données.
    """
    logger.info(f"Creating progress entry for user {user_id}, activity: '{activity_name}'")
    try:
        # Déterminer le statut par défaut s'il n'est pas fourni
        final_status = status if status is not None else "in_progress" # Utiliser une valeur par défaut si le statut n'est pas spécifié
        # Si vous utilisez Enum : final_status = status if status is not None else ProgressStatus.IN_PROGRESS

        progress_entry = ProgressModel(
            user_id=user_id,
            activity_name=activity_name,
            current_value=current_value,
            target_value=target_value,
            status=final_status # Utiliser le statut final
        )
        db.add(progress_entry)
        db.commit()
        db.refresh(progress_entry) # Rafraîchir pour obtenir l'ID et les timestamps générés
        logger.info(f"Progress entry created successfully: ID={progress_entry.id}, UserID={user_id}")
        return progress_entry
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating progress entry for user {user_id}, activity '{activity_name}': {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error creating progress entry for user {user_id}, activity '{activity_name}': {e}")
        return None

def get_progress_entry_by_id(db: Session, progress_id: int) -> Optional[ProgressModel]:
    """
    Récupère une entrée de progression spécifique par son ID.
    """
    logger.debug(f"Fetching progress entry by ID: {progress_id}")
    try:
        # Utilisation de .get() est plus efficace pour récupérer par clé primaire
        entry = db.query(ProgressModel).get(progress_id)
        if entry:
            logger.debug(f"Progress entry found: ID={entry.id}")
        else:
            logger.warning(f"Progress entry not found for ID: {progress_id}")
        return entry
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching progress entry ID {progress_id}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching progress entry ID {progress_id}: {e}")
        return None

def get_progress_for_user(db: Session, user_id: int) -> List[ProgressModel]:
    """
    Récupère toutes les entrées de progression pour un utilisateur donné.
    """
    logger.debug(f"Fetching all progress entries for user ID: {user_id}")
    try:
        # Filtrer par user_id et récupérer tous les enregistrements correspondants
        entries = db.query(ProgressModel).filter(ProgressModel.user_id == user_id).all()
        logger.debug(f"Found {len(entries)} progress entries for user ID {user_id}.")
        return entries
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching progress entries for user ID {user_id}: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching progress entries for user ID {user_id}: {e}")
        return []

def update_progress(
    db: Session,
    progress_id: int,
    current_value: Optional[float] = None,
    target_value: Optional[float] = None,
    status: Optional[str] = None
) -> Optional[ProgressModel]:
    """
    Met à jour une entrée de progression existante.
    Seuls les champs fournis (non-None) seront mis à jour.
    """
    logger.info(f"Attempting to update progress entry ID: {progress_id}")
    try:
        # Récupérer l'entrée à mettre à jour
        entry = db.query(ProgressModel).get(progress_id)
        if not entry:
            logger.warning(f"Progress entry not found for update ID: {progress_id}")
            return None # Retourner None si l'entrée n'existe pas

        # Mettre à jour les champs s'ils sont fournis
        if current_value is not None:
            entry.current_value = current_value
        if target_value is not None:
            entry.target_value = target_value
        if status is not None:
            entry.status = status
            # Si vous utilisez Enum et que le statut est un Enum, assurez-vous de la conversion si nécessaire

        db.commit()
        db.refresh(entry) # Rafraîchir pour obtenir les dernières données (comme updated_at)
        logger.info(f"Progress entry ID {progress_id} updated successfully.")
        return entry
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error updating progress entry ID {progress_id}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error updating progress entry ID {progress_id}: {e}")
        return None

def delete_progress(db: Session, progress_id: int) -> Optional[ProgressModel]:
    """
    Supprime une entrée de progression par son ID.
    """
    logger.info(f"Attempting to delete progress entry ID: {progress_id}")
    try:
        # Récupérer l'entrée à supprimer
        entry = db.query(ProgressModel).get(progress_id)
        if not entry:
            logger.warning(f"Progress entry not found for deletion ID: {progress_id}")
            return None # Retourner None si l'entrée n'existe pas

        db.delete(entry)
        db.commit()
        logger.info(f"Progress entry ID {progress_id} deleted successfully.")
        return entry # Retourner l'entrée supprimée pour confirmation

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error deleting progress entry ID {progress_id}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error deleting progress entry ID {progress_id}: {e}")
        return None