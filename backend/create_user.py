# create_user.py
from database import SessionLocal
from app.models.user import User
from app.auth import get_password_hash

# Connexion à la base de données
db = SessionLocal()

# Création de l'utilisateur de test
user = User(
    email="alice@example.com",
    hashed_password=get_password_hash("1234secure"),
    role="user"  # ou "admin" selon ta configuration
)

# Insertion en base
db.add(user)
db.commit()
db.refresh(user)

print("✅ Utilisateur créé :", user.email)

