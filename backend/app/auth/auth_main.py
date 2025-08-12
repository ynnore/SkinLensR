import logging
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

# Logger pour tracer les actions dans ce module
logger = logging.getLogger(__name__)

# Création du routeur FastAPI
router = APIRouter()

# --- Configuration cryptographie ---

# Contexte de hachage des mots de passe (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Clé secrète et algorithme JWT
# ⚠️ En production, SECRET_KEY doit venir d'une variable d'environnement
SECRET_KEY = os.getenv("SECRET_KEY", "dev-insecure-key")
ALGORITHM = "HS256"

# Durée de validité du token d'accès (en minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configuration OAuth2 : indique l'URL où récupérer un token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# --- Fonctions de gestion des mots de passe ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Vérifie qu'un mot de passe en clair correspond bien à son hash bcrypt.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hache un mot de passe en clair avec bcrypt.
    """
    return pwd_context.hash(password)


# --- Fonctions JWT ---

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Génère un JWT signé contenant les données `data` avec une date d'expiration.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.debug(f"Created JWT token with exp {expire.isoformat()}")
    return encoded

def decode_access_token(token: str) -> Optional[dict]:
    """
    Décode et vérifie un JWT.
    Retourne le payload si valide, sinon None.
    """
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as e:
        logger.warning(f"Invalid JWT token: {e}")
        return None


# --- Gestion de l'utilisateur courant ---

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """
    Récupère l'utilisateur courant à partir du token JWT.
    Lève une erreur HTTP 401 si le token est invalide ou si l'utilisateur n'existe pas.
    """
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

    # Rechercher l'utilisateur dans la base
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Vérifie que l'utilisateur est actif (champ `is_active` dans le modèle User).
    Lève une erreur HTTP 400 si inactif.
    """
    if not getattr(current_user, "is_active", True):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Utilisateur inactif")
    return current_user


# --- Routes d'authentification ---

@router.post("/token", summary="Login et obtention d'un token d'accès")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Authentifie un utilisateur avec email (username) et mot de passe.
    Retourne un JWT si les identifiants sont corrects.
    """
    logger.info(f"Tentative de connexion pour l'utilisateur {form_data.username}")
    
    # Recherche de l'utilisateur par email
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user:
        logger.warning(f"Utilisateur non trouvé pour {form_data.username}")
    elif not verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Mot de passe incorrect pour {form_data.username}")
    else:
        logger.info(f"Authentification réussie pour {form_data.username}")
        access_token = create_access_token(data={"sub": user.email, "role": user.role})
        return {"access_token": access_token, "token_type": "bearer"}

    # Erreur en cas d'échec
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Email ou mot de passe incorrect",
        headers={"WWW-Authenticate": "Bearer"},
    )


# --- Gestion du token de réinitialisation de mot de passe ---

def create_password_reset_token(email: str, expires_minutes: int = 60) -> str:
    """
    Crée un JWT spécifique pour la réinitialisation de mot de passe.
    Contient :
      - sub : l'email de l'utilisateur
      - exp : expiration
      - scope : 'reset_password'
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode = {"sub": email, "exp": expire, "scope": "reset_password"}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.debug(f"Created password reset token for {email} with exp {expire.isoformat()}")
    return encoded_jwt

def verify_password_reset_token(token: str) -> Optional[str]:
    """
    Vérifie le token de réinitialisation.
    Retourne l'email si valide, sinon None.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("scope") == "reset_password":
            return payload.get("sub")
        else:
            logger.warning("Token de réinitialisation avec scope incorrect")
            return None
    except JWTError as e:
        logger.warning(f"Token de réinitialisation invalide: {e}")
        return None
