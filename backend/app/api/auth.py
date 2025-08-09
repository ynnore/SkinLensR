from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.crud.legal import get_current_user_legal_status
from app.database import get_db
from app.models.user import User
from app.auth import get_current_active_user

router = APIRouter(prefix="/legal", tags=["legal"])

@router.get("/status")
def legal_status(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Retourne le statut légal des documents signés par l'utilisateur.
    """
    status = get_current_user_legal_status(db, current_user)
    return {"legal_status": status}

