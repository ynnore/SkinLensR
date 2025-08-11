import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from passlib.context import CryptContext

from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserResponse, UserUpdate 

logger = logging.getLogger(__name__)

# Setup du contexte de hashage (bcrypt recommandé)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """
    Hash un mot de passe clair en utilisant bcrypt.
    Retourne la chaîne de caractères du hash.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Vérifie qu'un mot de passe clair correspond à un hash donné.
    Retourne True si le mot de passe correspond, False sinon.
    """
    return pwd_context.verify(plain_password, hashed_password)

# --- Fonctions CRUD pour les Utilisateurs ---

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Recherche un utilisateur par son email.
    Retourne l'objet User si trouvé, sinon None.
    Utilise des logs pour tracer le processus et gérer les erreurs.
    """
    logger.debug(f"Fetching user by email: {email}")
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            logger.debug(f"User found: ID={user.id}, Email='{user.email}'")
        else:
            logger.warning(f"User not found for email: {email}")
        return user
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching user by email {email}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching user by email {email}: {e}")
        return None

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """
    Recherche un utilisateur par son identifiant unique.
    Retourne l'objet User si trouvé, sinon None.
    """
    logger.debug(f"Fetching user by ID: {user_id}")
    try:
        user = db.query(User).get(user_id)
        if user:
            logger.debug(f"User found: ID={user.id}, Email='{user.email}'")
        else:
            logger.warning(f"User not found for ID: {user_id}")
        return user
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching user by ID {user_id}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching user by ID {user_id}: {e}")
        return None

def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """
    Récupère une liste paginée d'utilisateurs.
    skip: nombre d'enregistrements à ignorer (offset)
    limit: nombre maximal d'enregistrements à retourner
    Retourne une liste d'objets User.
    """
    logger.debug(f"Fetching all users (skip={skip}, limit={limit})")
    try:
        users = db.query(User).offset(skip).limit(limit).all()
        logger.debug(f"Found {len(users)} users.")
        return users
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching all users: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching all users: {e}")
        return []

def create_user(db: Session, user_data: UserCreate) -> Optional[User]:
    """
    Crée un nouvel utilisateur dans la base de données.
    Hash le mot de passe avant sauvegarde.
    Retourne l'utilisateur créé ou None en cas d'erreur.
    """
    logger.info(f"Creating user with email: {user_data.email}")
    try:
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            role=user_data.role,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"User created successfully: ID={db_user.id}, Email='{db_user.email}'")
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating user {user_data.email}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error creating user {user_data.email}: {e}")
        return None

def update_user(db: Session, user_id: int, user_update_data: UserUpdate, new_password: Optional[str] = None) -> Optional[User]:
    """
    Met à jour un utilisateur existant.
    Peut modifier le rôle et/ou le mot de passe (si new_password fourni).
    Retourne l'utilisateur mis à jour ou None si utilisateur non trouvé ou erreur.
    """
    logger.info(f"Attempting to update user ID: {user_id}")
    try:
        user = db.query(User).get(user_id)
        if not user:
            logger.warning(f"User not found for update ID: {user_id}")
            return None

        # Mise à jour du rôle si fourni
        if user_update_data.role:
            user.role = user_update_data.role
        # Mise à jour du mot de passe si nouveau mot de passe fourni
        if new_password:
            user.hashed_password = get_password_hash(new_password)

        db.commit()
        db.refresh(user)
        logger.info(f"User ID {user_id} updated successfully.")
        return user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error updating user ID {user_id}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error updating user ID {user_id}: {e}")
        return None

def delete_user(db: Session, user_id: int) -> Optional[User]:
    """
    Supprime un utilisateur par son ID.
    Retourne l'utilisateur supprimé ou None si non trouvé ou erreur.
    """
    logger.info(f"Attempting to delete user ID: {user_id}")
    try:
        user = db.query(User).get(user_id)
        if not user:
            logger.warning(f"User not found for deletion ID: {user_id}")
            return None

        db.delete(user)
        db.commit()
        logger.info(f"User ID {user_id} deleted successfully.")
        return user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error deleting user ID {user_id}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error deleting user ID {user_id}: {e}")
        return None

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """
    Authentifie un utilisateur via email et mot de passe clair.
    Retourne l'utilisateur si les identifiants sont valides, sinon None.
    """
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
