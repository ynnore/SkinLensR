# /home/manik/skinlensr/SkinLensR/backend/app/api/legal.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.crud.legal import get_current_user_legal_status
from app.database import get_db
from app.models.user import User
from app.auth import get_current_active_user

router = APIRouter(
    prefix="/legal",
    tags=["legal"],
)

# --- Pydantic Response Model ---
class LegalStatusResponse(BaseModel):
    legal_status: str  # Exemple: "signed", "pending", "not_signed"

    class Config:
        from_attributes = True  # Pydantic v2

@router.get(
    "/status",
    response_model=LegalStatusResponse,
    summary="Obtenir le statut légal de l'utilisateur",
    description="""
    Cette route retourne le **statut légal** des documents signés par l'utilisateur connecté.  
    Les valeurs possibles peuvent inclure :
    - `"signed"` → Tous les documents sont signés
    - `"pending"` → Des documents restent à signer
    - `"not_signed"` → Aucun document signé
    """
)
def legal_status(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Retourne le statut légal des documents signés par l'utilisateur connecté.
    """
    status = get_current_user_legal_status(db, current_user)
    return {"legal_status": status}
