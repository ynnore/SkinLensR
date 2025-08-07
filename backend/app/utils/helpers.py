import re

# Fonction pour valider un email
def validate_email(email: str) -> bool:
    email_regex = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
    return bool(re.match(email_regex, email))

# Fonction pour hasher un mot de passe (utilise hashlib ou un autre module de sécurité)
def hash_password(password: str) -> str:
    from hashlib import sha256
    return sha256(password.encode('utf-8')).hexdigest()

# Fonction pour vérifier un mot de passe
def verify_password(stored_password: str, provided_password: str) -> bool:
    return stored_password == hash_password(provided_password)

# Fonction pour générer un token (par exemple, pour JWT)
def generate_token(payload: dict) -> str:
    import jwt
    from datetime import datetime, timedelta

    secret_key = "your_secret_key"
    expiration = timedelta(hours=1)
    expiration_time = datetime.utcnow() + expiration

    token = jwt.encode(
        {"exp": expiration_time, **payload},
        secret_key,
        algorithm="HS256"
    )
    return token
