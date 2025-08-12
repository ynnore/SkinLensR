from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.dependencies import get_db_session, get_current_active_user
from app.schemas.user import UserRead, UserUpdate
from app.crud.user import update_user
from app.models.user import User
from app.auth.auth_main import get_password_hash

router = APIRouter()

@router.get("/me", response_model=UserRead, summary="Récupérer les informations de l'utilisateur connecté")
def read_current_user(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/me", response_model=UserRead, summary="Mettre à jour les informations de l'utilisateur connecté")
def update_current_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_active_user)
):
    hashed_password = None
    if getattr(user_update, "password", None):
        hashed_password = get_password_hash(user_update.password)

    updated_user = update_user(db, current_user.id, user_update, hashed_new_password=hashed_password)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user
