# app/crud/record_user_agreement.py

from sqlalchemy.orm import Session
from app.models.user_legal_agreement import UserLegalAgreement
from app.models.user import User
from app.models.legal_document import LegalDocument

def record_user_agreement(
    db: Session, user_id: int, document_id: int, is_latest_version_agreed: bool = True
) -> UserLegalAgreement:
    """
    Enregistre l'accord d'un utilisateur pour un document juridique spécifique.
    """
    # Récupérer l'utilisateur et le document
    user = db.query(User).filter(User.id == user_id).first()
    document = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()

    if not user or not document:
        raise ValueError("Utilisateur ou document introuvable.")

    # Créer l'accord
    agreement = UserLegalAgreement(
        user_id=user.id,
        document_id=document.id,
        is_latest_version_agreed=is_latest_version_agreed,
    )

    # Ajouter à la base de données et commettre les changements
    db.add(agreement)
    db.commit()
    db.refresh(agreement)
    return agreement
