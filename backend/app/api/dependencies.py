from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user  # suppose déjà existant

def get_db_session():
    return Depends(get_db)

def get_current_active_user(user=Depends(get_current_user)):
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return user
