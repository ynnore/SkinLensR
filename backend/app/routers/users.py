import logging
from typing import List, Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app import crud, auth
from app.database import get_db
from app.core.dependencies import get_current_user, get_current_admin_user

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(get_current_user)],  # Par défaut, toutes les routes demandent un user connecté
)

logger = logging.getLogger(__name__)

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Récupérer le profil de l'utilisateur connecté",
    description="Retourne les informations détaillées du profil de l'utilisateur authentifié via JWT.",
)
async def read_current_user_profile(
    current_user: UserResponse = Depends(get_current_user),
):
    logger.info(f"Fetching profile for user: {current_user.email}")
    return current_user


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un utilisateur (admin uniquement)",
    description="Route réservée aux administrateurs pour créer un nouvel utilisateur.",
)
async def create_user_by_admin_route(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_admin: Any = Depends(get_current_admin_user),
):
    logger.info(f"Admin {current_admin.email} creating user with email: {user_data.email}")

    existing_user = crud.get_user_by_email(db, email=user_data.email)
    if existing_user:
        logger.warning(f"Email déjà utilisé: {user_data.email}")
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = auth.get_password_hash(user_data.password)

    try:
        new_user = crud.create_user(db=db, user_data=user_data, hashed_password=hashed_password)
        if not new_user:
            raise HTTPException(status_code=500, detail="Internal error creating user")

        logger.info(f"User created successfully: {new_user.email}")
        return UserResponse.from_orm(new_user)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la création utilisateur: {e}")
        raise HTTPException(status_code=500, detail="Unexpected error during user creation")


@router.get(
    "/",
    response_model=List[UserResponse],
    summary="Lister tous les utilisateurs (admin uniquement)",
    description="Récupère la liste paginée de tous les utilisateurs, accessible uniquement aux administrateurs.",
)
async def get_all_users_route(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: Any = Depends(get_current_admin_user),
):
    logger.info(f"Admin {current_admin.email} fetching users (skip={skip}, limit={limit})")
    users = crud.get_all_users(db, skip=skip, limit=limit)
    return [UserResponse.from_orm(user) for user in users]
