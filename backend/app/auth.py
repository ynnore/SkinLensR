# backend/auth.py

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import os

from app.dependencies import get_db
from app.models.user import User

router = APIRouter()

# --- Configuration mot de passe et JWT ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Utilise une variable d'environnement pour plus de sécurité
SECRET_KEY = os.getenv("SECRET_KEY", "dev-insecure-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Le tokenUrl doit correspondre au chemin de la route POST qui génère le token.
# Comme votre route dans main.py est POST /token, c'est correct.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Fonctions mot de passe ---
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# --- Fonctions JWT ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

# --- Route /token (renommée de /login pour correspondre à main.py et à la norme) ---
@router.post("/token", summary="Login For Access Token") # Renommé et ajouté un résumé
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # L'utilisateur se connecte avec son email (qui est utilisé comme 'username' dans le modèle User)
    # Donc, on récupère l'utilisateur par son email.
    user = db.query(User).filter(User.email == form_data.username).first() # Filtre par email si c'est le username

    # Vérifier si l'utilisateur existe et si le mot de passe haché correspond
    if not user or not verify_password(form_data.password, user.hashed_password): # <-- CORRECTION ICI : utiliser hashed_password
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password", # Message plus précis
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Le 'sub' dans le token doit correspondre à l'identifiant unique de l'utilisateur, ici l'email.
    # Le rôle est aussi inclus dans le token.
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}