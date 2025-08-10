from typing import Generator
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from app.database import get_db
from app.auth import get_current_active_user as _get_current_active_user
from app.models.user import User

def get_db_session() -> Generator[Session, None, None]:
    """
    Dépendance FastAPI pour récupérer une session de base de données.
    Usage typique : injecter get_db_session dans les endpoints pour avoir la session.
    """
    yield from get_db()

def get_current_active_user(
    current_user: User = Depends(_get_current_active_user)
) -> User:
    """
    Dépendance FastAPI pour récupérer l'utilisateur actif (connecté).
    Utilise la fonction définie dans app.auth.
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Utilisateur inactif",
        )
    return current_user
