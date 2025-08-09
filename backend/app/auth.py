"""
backend/auth.py
---------------
Gère l'authentification et l'autorisation via JWT.
Inclut la gestion du mot de passe, la création/validation de token
et la récupération sécurisée de l'utilisateur connecté.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional
import os

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.core.dependencies import get_db
from app.models.user import User

router = APIRouter()

# ------------------------------
# Config sécurité et JWT
# ------------------------------

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-insecure-key")  # ⚠️ À changer en production !
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ------------------------------
# Gestion mots de passe
# ------------------------------

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie qu'un mot de passe en clair correspond à son hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Retourne le hash d'un mot de passe."""
    return pwd_context.hash(password)

# ------------------------------
# Gestion des tokens JWT
# ------------------------------

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Crée un token JWT signé contenant les données de `data`."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    """Décode un token JWT et retourne son payload si valide, sinon None."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

# ------------------------------
# Dépendances pour récupérer l'utilisateur
# ------------------------------

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Récupère l'utilisateur connecté à partir du token JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Vérifie que l'utilisateur est actif avant de lui permettre l'accès.
    Suppose que le modèle User a un champ booléen `is_active`.
    """
    if not getattr(current_user, "is_active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Utilisateur inactif",
        )
    return current_user

# ------------------------------
# Route API : login et création de token
# ------------------------------

@router.post("/token", summary="Login et obtention d'un token d'accès")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Authentifie l'utilisateur avec email et mot de passe."""
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.email, "role": user.role})

    return {"access_token": access_token, "token_type": "bearer"}
