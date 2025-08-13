# backend/app/core/security.py

from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from typing import Optional
from jwt import PyJWTError

# -------------------------
# Hashage et vérification
# -------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Hash le mot de passe utilisateur."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie que le mot de passe correspond au hash."""
    return pwd_context.verify(plain_password, hashed_password)

# -------------------------
# JWT Tokens
# -------------------------
SECRET_KEY = "ta_clef_secrete_a_changer"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
RESET_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_reset_password_token(email: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES))
    to_encode = {"sub": email, "scope": "reset_password", "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_reset_password_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("scope") != "reset_password":
            raise ValueError("Scope invalide pour ce token")
        email = payload.get("sub")
        if email is None:
            raise ValueError("Email manquant dans le token")
        return email
    except PyJWTError as e:
        raise ValueError("Token invalide ou expiré") from e
