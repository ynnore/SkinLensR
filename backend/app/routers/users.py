# /home/manik/skinlensr/SkinLensR/backend/app/routers/users.py

import logging
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Importez vos schémas Pydantic pour les utilisateurs
# Assurez-vous qu'ils sont bien définis dans app/schemas/user.py et exposés par app/schemas/__init__.py
from app.schemas.user import (
    UserCreate, UserResponse, UserUpdate, # UserCreate peut être utilisé pour les admins qui créent des utilisateurs
)

# Importez vos fonctions CRUD pour les utilisateurs
from app import crud
# Importez vos utilitaires d'authentification si nécessaire (pour vérifier les permissions par exemple)
# from app import auth

# Importez vos fonctions de dépendance
from app.database import get_db
from app.core.dependencies import (
    get_current_user, # Pour obtenir l'utilisateur authentifié
    get_current_admin_user # Pour restreindre certaines routes aux admins
)

router = APIRouter(
    prefix="/users", # Préfixe pour toutes les routes de ce routeur
    tags=["Users"],
    dependencies=[Depends(get_current_user)] # Toutes les routes ici nécessitent un utilisateur authentifié
)

logger = logging.getLogger(__name__)

# --- Routes ---

@router.get("/me", response_model=UserResponse)
async def read_current_user_profile(
    current_user: UserResponse = Depends(get_current_user) # Utilise la dépendance qui retourne déjà un UserResponse
):
    """
    Retourne les informations du profil de l'utilisateur actuellement authentifié.
    Cette route est souvent placée ici, bien que /auth/me soit aussi une convention.
    """
    logger.info(f"Fetching profile for current user: {current_user.email}")
    # La dépendance get_current_user retourne déjà un UserResponse, donc on peut le retourner directement.
    return current_user

# --- Routes CRUD pour les Utilisateurs (typiquement réservées aux Admins) ---
# Ces routes ne devraient être accessibles qu'aux utilisateurs ayant le rôle d'administrateur.
# Pour cela, il faut ajuster les dépendances.

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user_by_admin_route(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_admin: Any = Depends(get_current_admin_user) # Nécessite un utilisateur administrateur
):
    """
    Crée un nouvel utilisateur (opération réservée aux administrateurs).
    """
    logger.info(f"Admin {current_admin.email} creating new user with email: {user_data.email}")
    
    # Vérifier si l'email est déjà enregistré
    existing_user = crud.get_user_by_email(db, email=user_data.email)
    if existing_user:
        logger.warning(f"Admin attempt to create user with already registered email: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    # Hacher le mot de passe avant de le sauvegarder
    hashed_password = auth.get_password_hash(user_data.password)
    
    # Créer l'utilisateur via le CRUD
    try:
        new_user = crud.create_user(db=db, user_data=user_data, hashed_password=hashed_password)
        if not new_user: # Si le CRUD retourne None suite à une erreur DB
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create user due to an internal error.")
            
        logger.info(f"User created by admin successfully: {new_user.email}")
        return UserResponse(
            id=new_user.id,
            email=new_user.email,
            role=new_user.role,
            created_at=new_user.created_at,
            updated_at=new_user.updated_at
        )
        
    except HTTPException: # Relayer les HTTPErrors
        raise
    except Exception as e:
        logger.error(f"Unexpected error during admin user creation for {user_data.email}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred during user creation.")

@router.get("/", response_model=List[UserResponse])
async def get_all_users_route(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: Any = Depends(get_current_admin_user) # Nécessite un utilisateur administrateur
):
    """
    Liste tous les utilisateurs (opération réservée aux administrateurs).
    """
    logger.info(f"Admin {current_admin.email} fetching all users (skip={skip}, limit={limit}).")
    
    # Assurez-vous que crud.get_all_users existe et fonctionne
    # users = crud.get_all_users(db, skip=skip, limit=limit)
    
    # Placeholder si crud.get_all_users n'est pas encore implémenté
    users = [] # Remplacez par la vraie récupération

    if not users and skip == 0 and limit == 100: # Si la DB est vide ou aucun utilisateur trouvé
        logger.warning("No users found in the database.")
        # Retourner une liste vide est correct, pas besoin de 404 ici.

    # Mapper les modèles SQLAlchemy aux schémas Pydantic UserResponse
    response_users = [
        UserResponse(
            id=u.id,
            email=u.email,
            role=u.role,
            created_at=u.created_at,
            updated_at=u.updated_at
        )
        for u in users # Assurez-vous que les objets 'u' ont les attributs attendus
    ]
    
    logger.info(f"Returned {len(response_users)} users.")
  