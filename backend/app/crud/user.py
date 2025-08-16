import logging
from typing import Optional, List

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.user import User  # Le modèle de table SQLAlchemy
from app.schemas.user import UserCreate, UserUpdate  # Les schémas Pydantic pour la validation
from app.core.security import get_password_hash, verify_password  # Fonctions de sécurité pour les mots de passe

# Configuration du logger pour suivre les actions CRUD et les erreurs.
# C'est une bonne pratique pour le débogage et la surveillance de l'application.
logger = logging.getLogger(__name__)

# ==============================================================================
# SECTION: Fonctions de lecture (Read)
# ==============================================================================

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Récupère un utilisateur unique depuis la base de données via son adresse email.
    
    :param db: La session de base de données SQLAlchemy.
    :param email: L'adresse email de l'utilisateur à rechercher.
    :return: L'objet User s'il est trouvé, sinon None.
    """
    try:
        # Exécute une requête pour trouver le premier utilisateur correspondant à l'email.
        return db.query(User).filter(User.email == email).first()
    except SQLAlchemyError as e:
        # En cas d'erreur de la base de données, on log l'erreur et on retourne None.
        logger.error(f"Erreur SQL lors de la récupération de l'utilisateur par email ({email}): {e}")
        return None

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """
    Récupère un utilisateur unique par son identifiant (clé primaire).
    
    :param db: La session de base de données SQLAlchemy.
    :param user_id: L'ID de l'utilisateur.
    :return: L'objet User s'il est trouvé, sinon None.
    """
    try:
        # db.get() est la manière la plus efficace de récupérer un objet par sa clé primaire.
        return db.get(User, user_id)
    except SQLAlchemyError as e:
        logger.error(f"Erreur SQL lors de la récupération de l'utilisateur par ID ({user_id}): {e}")
        return None

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """
    Récupère une liste d'utilisateurs avec pagination.
    
    :param db: La session de base de données SQLAlchemy.
    :param skip: Le nombre d'enregistrements à sauter (pour la pagination).
    :param limit: Le nombre maximum d'enregistrements à retourner.
    :return: Une liste d'objets User.
    """
    return db.query(User).offset(skip).limit(limit).all()

# ==============================================================================
# SECTION: Fonction de création (Create)
# ==============================================================================

def create_user(db: Session, user_data: UserCreate) -> Optional[User]:
    """
    Crée un nouvel utilisateur dans la base de données.
    Le mot de passe est automatiquement hashé avant d'être sauvegardé.
    
    :param db: La session de base de données SQLAlchemy.
    :param user_data: Les données de l'utilisateur validées par le schéma Pydantic UserCreate.
    :return: Le nouvel objet User créé, ou None en cas d'échec.
    """
    try:
        # On vérifie d'abord si un utilisateur avec cet email n'existe pas déjà.
        if get_user_by_email(db, user_data.email):
            logger.warning(f"Tentative de création d'un utilisateur déjà existant: {user_data.email}")
            return None

        # Le mot de passe en clair (user_data.password) ne doit JAMAIS être stocké.
        # On le hashe en utilisant notre fonction de sécurité.
        hashed_password = get_password_hash(user_data.password)

        # Création de l'instance du modèle SQLAlchemy avec les données validées.
        # Note : On utilise user_data.full_name directement. S'il est optionnel dans le schéma,
        # Pydantic lui assignera la valeur `None` s'il n'est pas fourni, ce qui est correct pour la DB.
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,  # Correction : accès direct au champ
            role=user_data.role,
            is_active=True
        )

        # Ajout du nouvel utilisateur à la session et commit des changements dans la base de données.
        db.add(db_user)
        db.commit()
        # Rafraîchit l'objet db_user pour qu'il contienne les valeurs générées par la DB (comme l'ID).
        db.refresh(db_user)

        logger.info(f"Nouvel utilisateur créé avec succès: {db_user.email} (ID: {db_user.id})")
        return db_user
    except SQLAlchemyError as e:
        # En cas d'erreur (ex: contrainte de base de données violée), on annule la transaction.
        db.rollback()
        logger.error(f"Erreur SQL lors de la création de l'utilisateur: {e}")
        return None

# ==============================================================================
# SECTION: Fonctions de mise à jour (Update)
# ==============================================================================

def update_user(db: Session, user: User, updates: UserUpdate) -> Optional[User]:
    """
    Met à jour les informations d'un utilisateur existant.
    
    :param db: La session de base de données SQLAlchemy.
    :param user: L'objet User à mettre à jour (déjà récupéré de la DB).
    :param updates: Les données de mise à jour validées par le schéma Pydantic UserUpdate.
    :return: L'objet User mis à jour, ou None en cas d'échec.
    """
    try:
        # Convertit le schéma Pydantic en dictionnaire, en excluant les champs non définis.
        update_data = updates.model_dump(exclude_unset=True)

        # Si un nouveau mot de passe est fourni, on le hashe avant de le mettre à jour.
        if "password" in update_data:
            hashed_password = get_password_hash(update_data["password"])
            update_data["password"] = hashed_password

        # Met à jour les attributs de l'objet utilisateur avec les nouvelles valeurs.
        for field, value in update_data.items():
            setattr(user, field, value)

        # Ajout, commit et rafraîchissement pour sauvegarder les changements.
        db.add(user)
        db.commit()
        db.refresh(user)

        logger.info(f"Utilisateur {user.id} mis à jour avec succès.")
        return user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Erreur SQL lors de la mise à jour de l'utilisateur {user.id}: {e}")
        return None

# ==============================================================================
# SECTION: Fonction de suppression (Delete)
# ==============================================================================

def delete_user(db: Session, user_id: int) -> bool:
    """
    Supprime un utilisateur de la base de données.
    
    :param db: La session de base de données SQLAlchemy.
    :param user_id: L'ID de l'utilisateur à supprimer.
    :return: True si la suppression a réussi, False sinon.
    """
    try:
        user = get_user_by_id(db, user_id)
        if not user:
            logger.warning(f"Suppression échouée: utilisateur {user_id} introuvable.")
            return False

        db.delete(user)
        db.commit()

        logger.info(f"Utilisateur {user.id} ({user.email}) supprimé avec succès.")
        return True
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Erreur SQL lors de la suppression de l'utilisateur {user_id}: {e}")
        return False

# ==============================================================================
# SECTION: Logique d'authentification
# ==============================================================================

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """
    Authentifie un utilisateur en vérifiant son email et son mot de passe.
    
    :param db: La session de base de données SQLAlchemy.
    :param email: L'email fourni pour la connexion.
    :param password: Le mot de passe en clair fourni pour la connexion.
    :return: L'objet User si l'authentification réussit, sinon None.
    """
    # Récupère l'utilisateur par son email.
    user = get_user_by_email(db, email)
    
    # Vérifie si l'utilisateur existe ET si le mot de passe fourni correspond au hash stocké.
    # La fonction `verify_password` est cruciale pour la sécurité.
    if not user or not verify_password(password, user.hashed_password):
        logger.warning(f"Tentative de connexion échouée pour l'email: {email}")
        return None
        
    # Si tout est correct, retourne l'objet utilisateur.
    return user