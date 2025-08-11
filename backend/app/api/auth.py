# /home/manik/skinlensr/SkinLensR/backend/app/api/auth.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.crud.legal import get_current_user_legal_status
from app.database import get_db
from app.models.user import User
from app.auth import get_current_active_user

# -------------------------
# Schéma Pydantic pour la réponse
# -------------------------
class LegalStatusResponse(BaseModel):
    legal_status: str

    class Config:
        from_attributes = True  # équivalent de orm_mode=True en Pydantic v2


# -------------------------
# Router API
# -------------------------
router = APIRouter(
    prefix="/legal",
    tags=["legal"],
)


@router.get(
    "/status",
    response_model=LegalStatusResponse,
    summary="Obtenir le statut légal de l'utilisateur",
    description=(
        "Retourne le statut légal des documents signés par l'utilisateur connecté. "
        "Cette route nécessite une authentification (token JWT)."
    ),
)
def legal_status(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    ### Description interne
    - Vérifie l'utilisateur connecté grâce au `current_user`.
    - Utilise `get_current_user_legal_status` pour récupérer le statut dans la BDD.
    - Retourne un objet contenant le statut légal.

    **Note :**
    Cette fonction est protégée par JWT, l'utilisateur doit donc être authentifié.
    """
    status = get_current_user_legal_status(db, current_user)
    return {"legal_status": status}
