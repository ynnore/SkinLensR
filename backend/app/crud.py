# backend/app/crud.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.legal_document import LegalDocument, UserLegalAgreement
from app.schemas import UserCreate, LegalDocumentCreate, UserLegalAgreementCreate
from typing import Optional, List # Importez List pour les retours de fonctions
from datetime import datetime # Importez datetime pour la gestion des dates

# --- Opérations CRUD pour les Utilisateurs ---
def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Récupère un utilisateur par son email."""
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate, hashed_password: str) -> User:
    """Crée un nouvel utilisateur dans la base de données."""
    db_user = User(email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Opérations CRUD pour les Documents Légaux ---
def get_legal_document_by_details(db: Session, doc_type: str, language: str, version: str) -> Optional[LegalDocument]:
    """Récupère un document légal spécifique par son type, langue et version."""
    return db.query(LegalDocument).filter(
        LegalDocument.type == doc_type,
        LegalDocument.language == language,
        LegalDocument.version == version
    ).first()

def get_latest_legal_document(db: Session, doc_type: str, language: str) -> Optional[LegalDocument]:
    """Récupère la dernière version d'un document légal pour un type et une langue donnés."""
    return db.query(LegalDocument).filter(
        LegalDocument.type == doc_type,
        LegalDocument.language == language
    ).order_by(LegalDocument.created_at.desc()).first() # Ou order_by(LegalDocument.version.desc()) si la version est un nombre ou format comparable

def create_legal_document(db: Session, doc: LegalDocumentCreate) -> LegalDocument:
    """Crée un nouveau document légal."""
    db_doc = LegalDocument(
        type=doc.type,
        version=doc.version,
        language=doc.language,
        content=doc.content
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

# --- Opérations CRUD pour les Accords Utilisateurs ---
def record_user_agreement(db: Session, user_id: int, document_id: int) -> UserLegalAgreement:
    """Enregistre l'accord d'un utilisateur pour un document."""
    # Récupérer le document pour obtenir son type et sa langue (nécessaire pour filtrer les anciens accords)
    document = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
    if not document:
        # Ceci ne devrait pas arriver si la vérification est faite dans la route, mais c'est une sécurité.
        raise ValueError("Document not found when recording agreement.")

    # Marquer tous les accords existants pour ce type/langue comme n'étant plus la dernière version acceptée
    # Note: Ceci suppose que vous voulez marquer tous les accords précédents pour CE TYPE/LANGUE comme non-derniers.
    # Si vous avez une logique plus fine (ex: accepter V2 invalide V1 mais pas V0.5), la requête devra être plus complexe.
    db.query(UserLegalAgreement).filter(
        UserLegalAgreement.user_id == user_id,
        UserLegalAgreement.document_id != document_id, # Exclure le document qu'on est en train d'ajouter
        # Joindre avec LegalDocument pour filtrer par type et langue
        UserLegalAgreement.document_id.in_(
            db.query(LegalDocument.id).filter(
                LegalDocument.type == document.type,
                LegalDocument.language == document.language
            ).subquery()
        )
    ).update({"is_latest_version_agreed": False}, synchronize_session=False) # synchronize_session=False pour ne pas affecter la session courante de manière inattendue

    # Créer le nouvel accord
    db_agreement = UserLegalAgreement(
        user_id=user_id,
        document_id=document_id,
        agreed_at=datetime.utcnow(), # Utiliser datetime.utcnow() pour la date actuelle
        is_latest_version_agreed=True # Ce nouvel accord est donc la dernière version acceptée
    )
    db.add(db_agreement)
    db.commit()
    db.refresh(db_agreement)
    return db_agreement

def get_user_agreements_for_document(db: Session, user_id: int, document_id: int) -> Optional[UserLegalAgreement]:
    """Récupère un accord spécifique d'un utilisateur pour un document donné."""
    return db.query(UserLegalAgreement).filter(
        UserLegalAgreement.user_id == user_id,
        UserLegalAgreement.document_id == document_id
    ).first()

def get_all_agreements_by_user(db: Session, user_id: int) -> List[UserLegalAgreement]:
    """Récupère tous les accords d'un utilisateur."""
    return db.query(UserLegalAgreement).filter(UserLegalAgreement.user_id == user_id).all()

# La fonction get_user_latest_agreement n'est plus nécessaire si record_user_agreement gère bien is_latest_version_agreed
# et que vous pouvez directement filtrer sur ce champ si besoin.
# Si vous avez besoin de trouver le document légal et le dernier accord en une seule requête, on pourrait la garder ou l'adapter.
# Cependant, avec la logique de mise à jour de record_user_agreement, un simple filtre sur UserLegalAgreement.is_latest_version_agreed
# devrait suffire pour obtenir la dernière version acceptée.

# Exemple si vous voulez une fonction pour obtenir le dernier document légal accepté par un utilisateur :
def get_latest_accepted_legal_document_for_user(db: Session, user_id: int, doc_type: str, lang: str) -> Optional[LegalDocument]:
    """
    Récupère le dernier document légal (par type et langue) que l'utilisateur a accepté.
    Retourne None si l'utilisateur n'a accepté aucune version ou si la dernière version acceptée est obsolète.
    """
    latest_agreement = db.query(UserLegalAgreement).join(LegalDocument).filter(
        UserLegalAgreement.user_id == user_id,
        LegalDocument.type == doc_type,
        LegalDocument.language == lang,
        UserLegalAgreement.is_latest_version_agreed == True # Ne prend que les accords marqués comme dernière version
    ).order_by(UserLegalAgreement.agreed_at.desc()).first() # S'assurer que c'est bien le plus récent accord marqué comme dernier

    if latest_agreement:
        return latest_agreement.document # Retourne l'objet LegalDocument associé à cet accord
    return None