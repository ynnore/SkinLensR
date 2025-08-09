from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api.dependencies import get_db_session, get_current_active_user
from app.schemas.user import UserRead, UserUpdate  # suppose tu as schemas pydantic
from app.crud.user import get_user_by_id, update_user

router = APIRouter()

@router.get("/me", response_model=UserRead)
def read_current_user(current_user = Depends(get_current_active_user)):
    return current_user

@router.put("/me", response_model=UserRead)
def update_current_user(user_update: UserUpdate, db: Session = Depends(get_db_session), current_user = Depends(get_current_active_user)):
    updated_user = update_user(db, current_user.id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user
