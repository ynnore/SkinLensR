      
# backend/app/auth.py
from datetime import datetime, timedelta, timezone
from typing import Optional

from passlib.context import CryptContext
from jose import JWTError, jwt

# Configuration pour le hachage des mots de passe
# 'bcrypt' est recommandé pour sa sécurité
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Clé secrète pour signer les JWT (À CHANGER EN PRODUCTION ! Utilisez une variable d'environnement)
SECRET_KEY = "YOUR_SUPER_SECRET_KEY" # REMPLACEZ CECI PAR UNE VRAIE CLÉ SECRÈTE !
ALGORITHM = "HS256" # Algorithme de signature pour JWT
ACCESS_TOKEN_EXPIRE_MINUTES = 30 # Durée de validité du token d'accès

# --- Fonctions de hachage des mots de passe ---
def verify_password(plain_password, hashed_password):
    """Vérifie si un mot de passe en texte brut correspond à un mot de passe haché."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Hache un mot de passe en texte brut."""
    return pwd_context.hash(password)

# --- Fonctions JWT ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Crée un jeton d'accès JWT."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """Décode et valide un jeton d'accès JWT."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None # Le token est invalide ou expiré

    