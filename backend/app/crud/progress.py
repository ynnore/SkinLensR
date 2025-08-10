import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.progress import Progress as ProgressModel
# J'enlève ProgressStatus ici car non utilisé dans ce code
from app.schemas.progress import ProgressCreate, ProgressResponse, ProgressUpdate

logger = logging.getLogger(__name__)

# --- Fonctions CRUD pour le Suivi de Progression ---

def create_progress_entry(
    db: Session,
    user_id: int,
    activity_name: str,
    current_value: float,
    target_value: Optional[float] = None,
    status: Optional[str] = None
) -> Optional[ProgressModel]:
    logger.info(f"Creating progress entry for user {user_id}, activity: '{activity_name}'")
    try:
        final_status = status if status is not None else "in_progress"
        progress_entry = ProgressModel(
            user_id=user_id,
            activity_name=activity_name,
            current_value=current_value,
            target_value=target_value,
            status=final_status
        )
        db.add(progress_entry)
        db.commit()
        db.refresh(progress_entry)
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
    logger.debug(f"Fetching progress entry by ID: {progress_id}")
    try:
        entry = db.get(ProgressModel, progress_id)  # Utiliser db.get au lieu de query.get déprécié
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
    logger.debug(f"Fetching all progress entries for user ID: {user_id}")
    try:
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
    logger.info(f"Attempting to update progress entry ID: {progress_id}")
    try:
        entry = db.get(ProgressModel, progress_id)
        if not entry:
            logger.warning(f"Progress entry not found for update ID: {progress_id}")
            return None

        if current_value is not None:
            entry.current_value = current_value
        if target_value is not None:
            entry.target_value = target_value
        if status is not None:
            entry.status = status

        db.commit()
        db.refresh(entry)
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
    logger.info(f"Attempting to delete progress entry ID: {progress_id}")
    try:
        entry = db.get(ProgressModel, progress_id)
        if not entry:
            logger.warning(f"Progress entry not found for deletion ID: {progress_id}")
            return None

        db.delete(entry)
        db.commit()
        logger.info(f"Progress entry ID {progress_id} deleted successfully.")
        return entry

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error deleting progress entry ID {progress_id}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error deleting progress entry ID {progress_id}: {e}")
        return None

def get_user_progress(db: Session, user_id: int) -> List[ProgressModel]:
    """
    Alias ou wrapper pour get_progress_for_user.
    """
    return get_progress_for_user(db, user_id)


__all__ = [
    "create_progress_entry",
    "get_progress_entry_by_id",
    "get_progress_for_user",
    "get_user_progress",
    "update_progress",
    "delete_progress",
]
