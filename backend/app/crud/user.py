import logging
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

logger = logging.getLogger(__name__)

# -----------------------
# CRUD UTILISATEUR
# -----------------------

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    try:
        return db.query(User).filter(User.email == email).first()
    except SQLAlchemyError as e:
        logger.error(f"Erreur SQL lors de la récupération utilisateur: {e}")
        return None


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    try:
        return db.get(User, user_id)
    except SQLAlchemyError as e:
        logger.error(f"Erreur SQL lors de la récupération utilisateur par ID: {e}")
        return None


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user_data: UserCreate) -> Optional[User]:
    """Crée un nouvel utilisateur (hashage du mot de passe inclus)."""
    try:
        existing_user = get_user_by_email(db, user_data.email)
        if existing_user:
            logger.warning(f"Tentative de création d'un utilisateur déjà existant: {user_data.email}")
            return None

        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,  # <-- utilisé ici
            role=user_data.role,
            is_active=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"Nouvel utilisateur créé: {db_user.email}")
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Erreur SQL lors de la création utilisateur: {e}")
        return None



def update_user(db: Session, user_id: int, updates: UserUpdate) -> Optional[User]:
    try:
        user = get_user_by_id(db, user_id)
        if not user:
            logger.warning(f"Mise à jour échouée: utilisateur {user_id} introuvable.")
            return None

        if updates.email:
            user.email = updates.email
        if updates.full_name:
            user.full_name = updates.full_name
        if updates.password:
            user.hashed_password = get_password_hash(updates.password)

        db.commit()
        db.refresh(user)
        logger.info(f"Utilisateur {user.id} mis à jour.")
        return user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Erreur SQL lors de la mise à jour utilisateur: {e}")
        return None


def update_user_password(db: Session, user_id: int, hashed_password: str) -> Optional[User]:
    try:
        user = get_user_by_id(db, user_id)
        if not user:
            logger.warning(f"Utilisateur {user_id} introuvable pour mise à jour du mot de passe.")
            return None
        user.hashed_password = hashed_password
        db.commit()
        db.refresh(user)
        logger.info(f"Mot de passe mis à jour pour l'utilisateur {user.id}.")
        return user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Erreur SQL lors de la mise à jour du mot de passe: {e}")
        return None


def delete_user(db: Session, user_id: int) -> bool:
    try:
        user = get_user_by_id(db, user_id)
        if not user:
            logger.warning(f"Suppression échouée: utilisateur {user_id} introuvable.")
            return False
        db.delete(user)
        db.commit()
        logger.info(f"Utilisateur {user.id} supprimé.")
        return True
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Erreur SQL lors de la suppression utilisateur: {e}")
        return False


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    try:
        user = get_user_by_email(db, email)
        if not user:
            logger.warning(f"Tentative de connexion échouée: email {email} introuvable.")
            return None
        if not verify_password(password, user.hashed_password):
            logger.warning(f"Tentative de connexion échouée: mot de passe invalide pour {email}.")
            return None
        return user
    except SQLAlchemyError as e:
        logger.error(f"Erreur SQL lors de l'authentification: {e}")
        return None
