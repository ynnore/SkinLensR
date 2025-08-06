from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.crud.legal import get_current_user_legal_status

router = APIRouter()

@router.get("/user/status", summary="Get current user's legal status")
def get_user_legal_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        status = get_current_user_legal_status(db, current_user)
        return {"status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
