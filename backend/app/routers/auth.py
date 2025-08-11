import logging
from datetime import timedelta, datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import Token
from app import crud
from app import auth
from app.database import get_db
from app.core.dependencies import get_current_user_dependency
from app.core.security import create_reset_password_token, verify_reset_password_token
# from app.utils.email import send_email  # à implémenter

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

logger = logging.getLogger(__name__)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Attempting to register user with email: {user_data.email}")
    existing_user = crud.get_user_by_email(db, email=user_data.email)
    if existing_user:
        logger.warning(f"Attempt to register with already registered email: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    hashed_password = auth.get_password_hash(user_data.password)
    try:
        new_user = crud.create_user(db=db, user_data=user_data, hashed_password=hashed_password)
        logger.info(f"User registered successfully: {new_user.email}")
        return UserResponse(id=new_user.id, email=new_user.email, role=new_user.role)
    except Exception as e:
        logger.error(f"Error creating user {user_data.email}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create user.")

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    logger.info(f"Attempting to log in user: {form_data.username}")
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Login failed for user: {form_data.username} - Invalid credentials.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    logger.info(f"Login successful for user: {user.email}. Token generated.")
    return Token(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserResponse)
async def read_current_user(current_user: UserResponse = Depends(get_current_user_dependency)):
    logger.info(f"Fetching current user details for: {current_user.email}")
    return current_user

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, request.email)
    # Ne pas révéler si l'email existe
    if user:
        token = create_reset_password_token(user.email)
        reset_link = f"https://ton-domaine.com/reset-password?token={token}"
        logger.info(f"Password reset link generated for user: {user.email}")
        # TODO: envoyer l'email avec reset_link
        # send_email(user.email, "Réinitialisation du mot de passe", f"Cliquez ici: {reset_link}")
    return {"message": "Si cet email est enregistré, un lien de réinitialisation vous sera envoyé."}

@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_reset_password_token(request.token)
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token invalide ou expiré")
    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable")
    hashed_password = auth.get_password_hash(request.new_password)
    crud.update_user_password(db, user.id, hashed_password)
    logger.info(f"Password reset successfully for: {email}")
    return {"message": "Mot de passe réinitialisé avec succès"}
