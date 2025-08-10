# /home/manik/skinlensr/SkinLensR/backend/app/services/user_agreement_service.py

import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Importez vos modèles et schémas
from app.models.user_legal_agreement import UserLegalAgreement
from app.models.legal_document import LegalDocument # Pour vérifier la validité du document
from app.models.user import User # Pour vérifier la validité de l'utilisateur
from app.schemas.user_legal_agreement import ( # Assurez-vous que ces schémas existent
    UserLegalAgreementCreate, UserLegalAgreementResponse
)

logger = logging.getLogger(__name__)

class UserAgreementService:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def record_user_agreement(
        self,
        user_id: int,
        legal_document_id: int,
        document_version_accepted: str,
        document_type_accepted: str
    ) -> Optional[UserLegalAgreement]:
        """
        Enregistre qu'un utilisateur a accepté un document légal.
        """
        logger.info(f"Recording agreement for user {user_id}, document ID {legal_document_id}.")
        
        # Vérifier que l'utilisateur et le document existent (éventuellement via leurs propres services)
        # Ici, on utilise directement la session pour vérifier pour l'exemple.
        user_exists = self.db_session.query(User).filter(User.id == user_id).first()
        document_exists = self.db_session.query(LegalDocument).filter(LegalDocument.id == legal_document_id).first()

        if not user_exists:
            logger.error(f"User {user_id} not found when recording agreement.")
            raise ValueError("User not found.")
        if not document_exists:
            logger.error(f"Legal document {legal_document_id} not found when recording agreement.")
            raise ValueError("Legal document not found.")
            
        # Créer l'enregistrement d'accord
        try:
            agreement = UserLegalAgreement(
                user_id=user_id,
                legal_document_id=legal_document_id,
                document_version_accepted=document_version_accepted,
                document_type_accepted=document_type_accepted,
                # accepted_at est géré par server_default
            )
            self.db_session.add(agreement)
            self.db_session.commit()
            self.db_session.refresh(agreement)
            logger.info(f"Agreement recorded successfully: ID={agreement.id}, User={user_id}, Doc={legal_document_id}.")
            return agreement
        except SQLAlchemyError as e:
            self.db_session.rollback()
            logger.error(f"Error recording agreement for user {user_id}, doc {legal_document_id}: {e}")
            return None
        except Exception as e:
            self.db_session.rollback()
            logger.error(f"Unexpected error recording agreement for user {user_id}, doc {legal_document_id}: {e}")
            return None

    def get_user_agreement(self, user_id: int, legal_document_id: int) -> Optional[UserLegalAgreement]:
        """Récupère un accord spécifique pour un utilisateur et un document."""
        logger.debug(f"Fetching agreement for user {user_id}, document ID {legal_document_id}.")
        try:
            agreement = self.db_session.query(UserLegalAgreement).filter(
                UserLegalAgreement.user_id == user_id,
                UserLegalAgreement.legal_document_id == legal_document_id
            ).first()
            return agreement
        except SQLAlchemyError as e:
            logger.error(f"Error fetching agreement for user {user_id}, doc {legal_document_id}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching agreement for user {user_id}, doc {legal_document_id}: {e}")
            return None

    # Vous pourriez ajouter des méthodes pour vérifier si l'utilisateur a accepté le dernier document d'un type donné, etc.
    # def has_accepted_latest_document(self, user_id: int, document_type: str) -> bool: ...