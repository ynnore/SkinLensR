import re
import os
from datetime import datetime, timedelta
from typing import Optional

import bcrypt
import jwt
from jwt import PyJWTError

# Validation email simple
def validate_email(email: str) -> bool:
    email_regex = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
    return bool(re.match(email_regex, email))


# Hashage mot de passe avec bcrypt
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


# Vérification mot de passe
def verify_password(stored_password: str, provided_password: str) -> bool:
    try:
        return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password.encode('utf-8'))
    except ValueError:
        return False


# Génération token JWT
def generate_token(payload: dict, expires_in_hours: int = 1) -> str:
    secret_key = os.getenv("JWT_SECRET_KEY", "change_me")  # À configurer dans .env
    expiration = datetime.utcnow() + timedelta(hours=expires_in_hours)
    token = jwt.encode({**payload, "exp": expiration}, secret_key, algorithm="HS256")
    return token


# Vérification token JWT
def verify_token(token: str) -> Optional[dict]:
    secret_key = os.getenv("JWT_SECRET_KEY", "change_me")
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload
    except PyJWTError:
        return None
