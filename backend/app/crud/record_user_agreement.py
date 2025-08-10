# /home/manik/skinlensr/SkinLensR/backend/app/crud/record_user_agreement.py

import logging
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Importez vos modèles SQLAlchemy
# Assurez-vous que User et LegalDocument existent et sont importables
from app.models.user import User
from app.models.legal_document import LegalDocument
# Importez le modèle qui lie l'utilisateur au document légal
from app.models.user_legal_agreement import UserLegalAgreement

logger = logging.getLogger(__name__)

def record_user_agreement(
    db: Session,
    user_id: int,
    legal_document_id: int,
    # Il est très important de stocker la version acceptée !
    document_version_accepted: Optional[str] = None,
    document_type_accepted: Optional[str] = None
) -> Optional[UserLegalAgreement]:
    """
    Enregistre qu'un utilisateur a accepté un document juridique spécifique.
    Prend en entrée l'ID utilisateur, l'ID du document, et potentiellement sa version/type.
    """
    logger.info(f"Recording agreement for user_id={user_id}, legal_document_id={legal_document_id}")
    
    try:
        # Récupérer l'utilisateur et le document pour validation (optionnel mais recommandé)
        # Utilisez les fonctions get_user_by_id et get_legal_document_by_id de leurs CRUDS respectifs si vous les avez.
        # Si vous n'avez pas ces fonctions, vous pouvez interroger directement la DB ici.
        user = db.query(User).filter(User.id == user_id).first()
        document = db.query(LegalDocument).filter(LegalDocument.id == legal_document_id).first()

        if not user:
            logger.error(f"User ID {user_id} not found when trying to record agreement.")
            raise ValueError("User not found.")
        if not document:
            logger.error(f"Legal document ID {legal_document_id} not found when trying to record agreement.")
            raise ValueError("Legal document not found.")

        # Obtenir la version et le type du document accepté
        # Si le document est mis à jour plus tard, il faut savoir quelle version l'utilisateur a acceptée.
        # Vous pouvez soit récupérer cela depuis le modèle `document` ici, soit le faire passer en argument.
        # Si vous le passez en argument, assurez-vous que le routeur/service le récupère avant d'appeler ce CRUD.
        version_to_record = document_version_accepted if document_version_accepted is not None else document.version
        type_to_record = document_type_accepted if document_type_accepted is not None else document.type

        # Créer l'enregistrement de l'accord
        agreement = UserLegalAgreement(
            user_id=user.id,
            legal_document_id=document.id,
            document_version_accepted=version_to_record,
            document_type_accepted=type_to_record,
            # accepted_at est géré par server_default
        )

        # Ajouter à la base de données et commiter les changements
        db.add(agreement)
        db.commit()
        db.refresh(agreement) # Rafraîchir pour obtenir l'ID et les timestamps
        
        logger.info(f"Agreement recorded successfully: ID={agreement.id}, UserID={user_id}, DocID={legal_document_id}, Version='{version_to_record}'.")
        return agreement

    except ValueError as ve: # Erreurs de validation (utilisateur ou document non trouvés)
        db.rollback() # Toujours rollback en cas d'erreur
        logger.error(f"Validation error recording agreement for user {user_id}, doc {legal_document_id}: {ve}")
        # Il serait préférable de lever une HTTPException ici si cette fonction est appelée directement par un routeur.
        # Si elle est appelée par un service, le service gérera l' HTTPException.
        return None
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error recording agreement for user {user_id}, doc {legal_document_id}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error recording agreement for user {user_id}, doc {legal_document_id}: {e}")
        return None

# Vous pourriez avoir besoin d'autres fonctions ici, par exemple :
# def get_user_agreement_for_document(db: Session, user_id: int, legal_document_id: int) -> Optional[UserLegalAgreement]: ...
# def get_user_agreements_for_user(db: Session, user_id: int) -> List[UserLegalAgreement]: ...
# def delete_user_agreement(db: Session, agreement_id: int) -> Optional[UserLegalAgreement]: ...