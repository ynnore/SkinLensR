from sqlalchemy.orm import Session
from app.models.user import User
from app.models.legal_document import LegalDocument
from app.models.user_legal_agreement import UserLegalAgreement
from sqlalchemy import func

def get_current_user_legal_status(db: Session, user: User) -> dict:
    """
    Retourne un dictionnaire indiquant si l'utilisateur a accepté
    la dernière version de chaque document légal (par type et langue).
    """
    subquery = (
        db.query(
            LegalDocument.type,
            LegalDocument.language,
            func.max(LegalDocument.version).label("latest_version")
        )
        .group_by(LegalDocument.type, LegalDocument.language)
        .subquery()
    )

    latest_docs = (
        db.query(LegalDocument)
        .join(subquery, (LegalDocument.type == subquery.c.type) &
                        (LegalDocument.language == subquery.c.language) &
                        (LegalDocument.version == subquery.c.latest_version))
        .all()
    )

    status = {}

    for doc in latest_docs:
        agreement = (
            db.query(UserLegalAgreement)
            .filter_by(user_id=user.id, document_id=doc.id)
            .first()
        )
        status_key = f"{doc.type}_{doc.language}"
        status[status_key] = agreement is not None and agreement.is_latest_version_agreed

    return status /home/manik/skinlensr/SkinLensR/backend/backend/app/crud/legal.py 