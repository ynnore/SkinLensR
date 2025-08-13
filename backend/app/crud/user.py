import logging
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

# -----------------------
# Logger pour le module
# -----------------------
# Permet de suivre toutes les erreurs et actions importantes
logger = logging.getLogger(__name__)


# -----------------------
# CRUD UTILISATEUR
# -----------------------

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Récupère un utilisateur par son email.
    
    Args:
        db (Session): session SQLAlchemy
        email (str): email de l'utilisateur

    Returns:
        User | None: retourne l'utilisateur ou None si introuvable
    """
    try:
        return db.query(User).filter(User.email == email).first()
    except SQLAlchemyError as e:
        logger.error(f"Erreur SQL lors de la récupération utilisateur: {e}")
        return None


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """
    Récupère un utilisateur par son ID.
    
    Args:
        db (Session): session SQLAlchemy
        user_id (int): ID de l'utilisateur

    Returns:
        User | None: retourne l'utilisateur ou None si introuvable
    """
    try:
        return db.get(User, user_id)
    except SQLAlchemyError as e:
        logger.error(f"Erreur SQL lors de la récupération utilisateur par ID: {e}")
        return None


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """
    Liste des utilisateurs avec pagination.
    
    Args:
        db (Session): session SQLAlchemy
        skip (int): nombre d'utilisateurs à ignorer
        limit (int): nombre maximal d'utilisateurs à retourner

    Returns:
        List[User]: liste des utilisateurs
    """
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user_data: UserCreate) -> Optional[User]:
    """
    Crée un nouvel utilisateur avec hashage du mot de passe.
    
    Args:
        db (Session): session SQLAlchemy
        user_data (UserCreate): données de l'utilisateur à créer

    Returns:
        User | None: retourne l'utilisateur créé ou None si échec
    """
    try:
        # Vérification si l'utilisateur existe déjà
        existing_user = get_user_by_email(db, user_data.email)
        if existing_user:
            logger.warning(f"Tentative de création d'un utilisateur déjà existant: {user_data.email}")
            return None

        # Hashage du mot de passe
        hashed_password = get_password_hash(user_data.password)

        # Création de l'objet User
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,  # Assurez-vous que full_name est dans UserCreate
            is_active=True
        )

        # Ajout à la session et commit
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
    """
    Met à jour les informations d'un utilisateur existant.
    
    Args:
        db (Session): session SQLAlchemy
        user_id (int): ID de l'utilisateur à mettre à jour
        updates (UserUpdate): données à mettre à jour

    Returns:
        User | None: retourne l'utilisateur mis à jour ou None si introuvable
    """
    try:
        user = get_user_by_id(db, user_id)
        if not user:
            logger.warning(f"Mise à jour échouée: utilisateur {user_id} introuvable.")
            return None

        # Mise à jour des champs si fournis
        if updates.email:
            user.email = updates.email
        if updates.full_name:
            user.full_name = updates.full_name
        if updates.password:
            user.hashed_password = get_password_hash(updates.password)
        if updates.role:
            user.role = updates.role

        db.commit()
        db.refresh(user)
        logger.info(f"Utilisateur {user.id} mis à jour.")
        return user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Erreur SQL lors de la mise à jour utilisateur: {e}")
        return None


def delete_user(db: Session, user_id: int) -> bool:
    """
    Supprime un utilisateur.
    
    Args:
        db (Session): session SQLAlchemy
        user_id (int): ID de l'utilisateur à supprimer

    Returns:
        bool: True si succès, False sinon
    """
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
    """
    Authentifie un utilisateur par email et mot de passe.
    
    Args:
        db (Session): session SQLAlchemy
        email (str): email de l'utilisateur
        password (str): mot de passe à vérifier

    Returns:
        User | None: retourne l'utilisateur si authentifié, None sinon
    """
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
