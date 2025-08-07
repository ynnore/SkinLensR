from pydantic import BaseModel
from typing import Optional

# Schéma de base pour l'utilisateur
class UserBase(BaseModel):
    username: str
    email: str

# Schéma utilisé lors de la création d'un utilisateur (avec le mot de passe)
class UserCreate(UserBase):
    password: str

# Schéma utilisé lors de la mise à jour d'un utilisateur (tous les champs sont optionnels)
class UserUpdate(UserBase):
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

# Schéma représentant l'utilisateur dans la base de données
class User(UserBase):
    id: int

    class Config:
        orm_mode = True  # Permet de lire les données directement depuis les objets SQLAlchemy
