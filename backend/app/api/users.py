from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.api.auth import get_current_user, get_current_active_user
from app.core.security import get_password_hash

router = APIRouter()

@router.get("/", response_model=List[UserRead])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """
    Retourne la liste de tous les utilisateurs.
    Accessible uniquement aux utilisateurs actifs.
    """
    return db.query(User).all()

@router.get("/me", response_model=UserRead)
def read_own_profile(current_user: User = Depends(get_current_active_user)):
    """
    Retourne le profil de l’utilisateur actuellement connecté.
    """
    return current_user

@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Crée un nouvel utilisateur.
    """
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email déjà utilisé")

    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/me", response_model=UserRead)
def update_own_profile(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Met à jour le profil de l’utilisateur connecté.
    """
    for key, value in user_in.dict(exclude_unset=True).items():
        if key == "password":
            setattr(current_user, "hashed_password", get_password_hash(value))
        else:
            setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_own_account(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """
    Supprime le compte de l’utilisateur connecté.
    """
    db.delete(current_user)
    db.commit()
