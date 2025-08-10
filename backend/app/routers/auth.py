# /home/manik/skinlensr/SkinLensR/backend/app/routers/auth.py

import logging
from datetime import timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

# Importez vos schémas Pydantic pour l'authentification et les utilisateurs
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import Token # Token vient bien de auth.py

# Importez vos fonctions CRUD pour les utilisateurs
from app import crud
# Importez vos utilitaires d'authentification
from app import auth

# Importez les dépendances
from app.database import get_db
from app.core.dependencies import get_current_user_dependency # Ceci sera votre fonction get_current_user réutilisable

router = APIRouter(
    prefix="/auth", # Préfixe pour toutes les routes de ce routeur
    tags=["Authentication"]
)

logger = logging.getLogger(__name__)

# --- Schéma OAuth2 ---
# Ce schéma est utilisé pour extraire le token de l'en-tête Authorization
# Il est souvent mieux défini dans app/core/dependencies.py pour être réutilisé,
# mais on peut aussi le définir ici si c'est le seul endroit qui l'utilise.
# Si vous avez déjà oauth2_scheme dans main.py ou dependencies.py, utilisez cette instance.
# Pour cet exemple, on le définit ici pour que le routeur soit autonome.
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token") # Assurez-vous que l'URL correspond

# --- Routes ---

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Enregistre un nouvel utilisateur.
    Vérifie si l'email est déjà enregistré.
    """
    logger.info(f"Attempting to register user with email: {user_data.email}")
    
    # Vérifier si l'utilisateur existe déjà
    existing_user = crud.get_user_by_email(db, email=user_data.email)
    if existing_user:
        logger.warning(f"Attempt to register with already registered email: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    # Hacher le mot de passe avant de le sauvegarder
    hashed_password = auth.get_password_hash(user_data.password)
    
    # Créer l'utilisateur via le CRUD
    try:
        new_user = crud.create_user(db=db, user_data=user_data, hashed_password=hashed_password)
        logger.info(f"User registered successfully: {new_user.email}")
        # Retourner le schéma de réponse utilisateur, sans le mot de passe haché
        return UserResponse(id=new_user.id, email=new_user.email, role=new_user.role)
        
    except Exception as e: # Capturer toute autre exception lors de la création
        logger.error(f"Error creating user {user_data.email}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create user.")


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Génère un token d'accès pour un utilisateur authentifié.
    """
    logger.info(f"Attempting to log in user: {form_data.username}")
    
    # Vérifier si l'utilisateur existe et si le mot de passe est correct
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Login failed for user: {form_data.username} - Invalid credentials.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    # Créer le token d'accès
    # Assurez-vous que ACCESS_TOKEN_EXPIRE_MINUTES est bien défini dans votre module auth
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role}, # Inclure le rôle pour les futures vérifications
        expires_delta=access_token_expires
    )
    
    logger.info(f"Login successful for user: {user.email}. Token generated.")
    return Token(access_token=access_token, token_type="bearer")

# --- Route pour obtenir les informations de l'utilisateur courant ---
# Si vous préférez /auth/me plutôt que /users/me, placez-le ici.
# Sinon, cette route doit être dans app/routers/users.py.
# Pour l'exemple, je la laisse ici en tant que route /auth/me.
@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user: UserResponse = Depends(get_current_user_dependency) # Utilise la dépendance globale que nous avons définie
):
    """
    Retourne les informations de l'utilisateur actuellement authentifié.
    """
    # LA LIGNE QUI POSAIT PROBLEME EST MAINTENANT CORRECTEMENT INDENTEE ET COMPLETE
    logger.info(f"Fetching current user details for: {current_user.email}")
    return current_user

# Si vous avez d'autres routes d'authentification (ex: refresh token, logout), elles iraient ici.