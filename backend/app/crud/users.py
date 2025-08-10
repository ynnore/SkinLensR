# /home/manik/skinlensr/SkinLensR/backend/app/crud/users.py

import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Importez votre modèle User et vos schémas Pydantic
# Assurez-vous que le modèle User a bien '__tablename__ = "users"'
from app.models.user import User, UserRole # Si vous utilisez l'Enum UserRole
# Assurez-vous que les schémas UserCreate, UserResponse, UserUpdate sont bien définis
from app.schemas.user import UserCreate, UserResponse, UserUpdate 

logger = logging.getLogger(__name__)

# --- Fonctions CRUD pour les Utilisateurs ---

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Récupère un utilisateur par son adresse email.
    C'est une fonction clé pour l'authentification et la vérification d'existence.
    """
    logger.debug(f"Fetching user by email: {email}")
    try:
        # Utilisez .first() car l'email est unique
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
    Récupère un utilisateur par son ID.
    """
    logger.debug(f"Fetching user by ID: {user_id}")
    try:
        # Utilisation de .get() est plus efficace pour récupérer par clé primaire
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
    Récupère une liste d'utilisateurs avec pagination.
    """
    logger.debug(f"Fetching all users (skip={skip}, limit={limit})")
    try:
        # Assurez-vous que le modèle User est importé et que la table est bien 'users'
        users = db.query(User).offset(skip).limit(limit).all()
        logger.debug(f"Found {len(users)} users.")
        return users
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching all users: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching all users: {e}")
        return []

def create_user(db: Session, user_data: UserCreate, hashed_password: str) -> Optional[User]:
    """
    Crée un nouvel utilisateur dans la base de données.
    Prend un schéma UserCreate et le mot de passe déjà haché.
    """
    logger.info(f"Creating user with email: {user_data.email}")
    try:
        # Instancier le modèle SQLAlchemy avec les données
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            role=user_data.role, # Utiliser le rôle fourni, ou un rôle par défaut si absent
            # Les timestamps created_at/updated_at sont gérés par server_default dans le modèle
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user) # Rafraîchir pour obtenir l'ID et les timestamps générés
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

def update_user(db: Session, user_id: int, user_update_data: UserUpdate, hashed_new_password: Optional[str] = None) -> Optional[User]:
    """
    Met à jour un utilisateur existant.
    Prend les données de mise à jour et le nouveau mot de passe haché s'il est modifié.
    """
    logger.info(f"Attempting to update user ID: {user_id}")
    try:
        # Récupérer l'utilisateur par son ID
        user = db.query(User).get(user_id)
        if not user:
            logger.warning(f"User not found for update ID: {user_id}")
            return None

        # Mettre à jour les champs s'ils sont fournis dans user_update_data
        if user_update_data.role:
            user.role = user_update_data.role
        if hashed_new_password: # Si le mot de passe est fourni et haché
            user.hashed_password = hashed_new_password
        # D'autres champs modifiables comme 'email' ou 'username' iraient ici si permis

        db.commit()
        db.refresh(user) # Rafraîchir pour obtenir les données mises à jour
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
        return user # Retourner l'utilisateur supprimé pour confirmation

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error deleting user ID {user_id}: {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error deleting user ID {user_id}: {e}")
        return None