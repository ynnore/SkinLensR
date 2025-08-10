# /home/manik/skinlensr/SkinLensR/backend/app/services/progress.py

import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Importez votre modèle SQLAlchemy pour la progression
# Assurez-vous que ce modèle est défini dans app/models/progress.py
from app.models.progress import Progress as ProgressModel # Renommez pour éviter conflit avec le schéma

# Importez votre schéma Pydantic pour les réponses
# Assurez-vous que ce schéma est défini dans app/schemas/progress.py
from app.schemas.progress import ProgressCreate, ProgressResponse, ProgressUpdate

logger = logging.getLogger(__name__)

class ProgressService:
    def __init__(self, db_session: Session):
        """
        Initialise le service avec une session de base de données.
        """
        self.db_session = db_session

    def create_progress_entry(
        self,
        user_id: int,
        activity_name: str,
        current_value: float,
        target_value: Optional[float] = None,
        status: str = "in_progress" # Statut par défaut
    ) -> Optional[ProgressModel]:
        """
        Crée une nouvelle entrée de suivi de progression dans la base de données.
        """
        logger.info(f"Creating progress entry for user {user_id}, activity: {activity_name}")
        try:
            progress_entry = ProgressModel(
                user_id=user_id,
                activity_name=activity_name,
                current_value=current_value,
                target_value=target_value,
                status=status
            )
            self.db_session.add(progress_entry)
            self.db_session.commit()
            self.db_session.refresh(progress_entry)
            logger.info(f"Progress entry created successfully: ID={progress_entry.id}, UserID={user_id}")
            return progress_entry
        except SQLAlchemyError as e:
            self.db_session.rollback()
            logger.error(f"Error creating progress entry for user {user_id}, activity '{activity_name}': {e}")
            return None
        except Exception as e: # Capture d'autres erreurs potentielles
            self.db_session.rollback()
            logger.error(f"Unexpected error creating progress entry for user {user_id}, activity '{activity_name}': {e}")
            return None

    def get_progress_entry_by_id(self, progress_id: int) -> Optional[ProgressModel]:
        """
        Récupère une entrée de progression spécifique par son ID.
        """
        logger.debug(f"Fetching progress entry by ID: {progress_id}")
        try:
            # Utilisation de query().get() pour une récupération directe par PK
            entry = self.db_session.query(ProgressModel).get(progress_id)
            if entry:
                logger.debug(f"Found progress entry ID {progress_id}.")
            else:
                logger.warning(f"Progress entry not found for ID: {progress_id}.")
            return entry
        except SQLAlchemyError as e:
            logger.error(f"Error fetching progress entry ID {progress_id}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching progress entry ID {progress_id}: {e}")
            return None

    def get_progress_for_user(self, user_id: int) -> List[ProgressModel]:
        """
        Récupère toutes les entrées de progression pour un utilisateur donné.
        """
        logger.debug(f"Fetching all progress entries for user ID: {user_id}")
        try:
            entries = self.db_session.query(ProgressModel).filter(ProgressModel.user_id == user_id).all()
            logger.debug(f"Found {len(entries)} progress entries for user ID {user_id}.")
            return entries
        except SQLAlchemyError as e:
            logger.error(f"Error fetching progress entries for user ID {user_id}: {e}")
            return [] # Retourner une liste vide en cas d'erreur
        except Exception as e:
            logger.error(f"Unexpected error fetching progress entries for user ID {user_id}: {e}")
            return []

    def update_progress(
        self,
        progress_id: int,
        current_value: Optional[float] = None,
        target_value: Optional[float] = None,
        status: Optional[str] = None
    ) -> Optional[ProgressModel]:
        """
        Met à jour une entrée de progression existante.
        Seuls les champs fournis (non-None) seront mis à jour.
        """
        logger.debug(f"Attempting to update progress entry ID: {progress_id}")
        try:
            entry = self.get_progress_entry_by_id(progress_id) # Utiliser la méthode interne pour vérifier l'existence
            if not entry:
                logger.warning(f"Progress entry not found for update ID: {progress_id}.")
                return None # Retourner None si l'entrée n'existe pas

            # Mettre à jour les champs si fournis
            if current_value is not None:
                entry.current_value = current_value
            if target_value is not None:
                entry.target_value = target_value
            if status is not None:
                entry.status = status

            self.db_session.commit()
            self.db_session.refresh(entry) # Rafraîchir pour avoir les dernières données si nécessaire
            logger.info(f"Progress entry ID {progress_id} updated successfully.")
            return entry
            
        except SQLAlchemyError as e:
            self.db_session.rollback()
            logger.error(f"Error updating progress entry ID {progress_id}: {e}")
            return None
        except Exception as e:
            self.db_session.rollback()
            logger.error(f"Unexpected error updating progress entry ID {progress_id}: {e}")
            return None

    def delete_progress(self, progress_id: int) -> Optional[ProgressModel]:
        """
        Supprime une entrée de progression par son ID.
        """
        logger.debug(f"Attempting to delete progress entry ID: {progress_id}")
        try:
            entry = self.get_progress_entry_by_id(progress_id) # Vérifier si l'entrée existe
            if not entry:
                logger.warning(f"Progress entry not found for deletion ID: {progress_id}.")
                return None # Retourner None si l'entrée n'existe pas

            self.db_session.delete(entry)
            self.db_session.commit()
            logger.info(f"Progress entry ID {progress_id} deleted successfully.")
            return entry # Retourner l'entrée supprimée pour confirmation
            
        except SQLAlchemyError as e:
            self.db_session.rollback()
            logger.error(f"Error deleting progress entry ID {progress_id}: {e}")
            return None
        except Exception as e:
            self.db_session.rollback()
            logger.error(f"Unexpected error deleting progress entry ID {progress_id}: {e}")
            return None