from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db

# Création d'un routeur FastAPI pour gérer les routes liées à la progression des utilisateurs
router = APIRouter()

# Route pour créer un nouvel enregistrement de progression
@router.post("/progress/")
def create_progress(
    user_id: int,         # ID de l'utilisateur pour lequel on crée la progression
    step: str,            # Étape de progression (ex : "signed_terms")
    completed: int,       # Statut de complétion (0 = non, 1 = oui)
    db: Session = Depends(get_db)  # Injection de la session DB
):
    # Appel à la fonction CRUD pour créer une progression en base
    db_progress = crud.create_progress(db, user_id, step, completed)
    # Si la création réussit, retourner l'objet Progress
    if db_progress:
        return db_progress
    # Sinon, retourner une erreur 400 Bad Request
    raise HTTPException(status_code=400, detail="Error creating progress.")

# Route pour récupérer toutes les progressions d'un utilisateur donné
@router.get("/progress/{user_id}")
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    # Récupérer la liste des progressions liées à l'utilisateur
    progress = crud.get_progress_by_user_id(db, user_id)
    # Si on trouve des progressions, les retourner
    if progress:
        return progress
    # Sinon, erreur 404 Not Found
    raise HTTPException(status_code=404, detail="Progress not found.")

# Route pour mettre à jour une progression spécifique via son ID
@router.put("/progress/{progress_id}")
def update_user_progress(progress_id: int, completed: int, db: Session = Depends(get_db)):
    # Mettre à jour le champ completed de la progression
    db_progress = crud.update_progress(db, progress_id, completed)
    # Si mise à jour réussie, retourner la progression mise à jour
    if db_progress:
        return db_progress
    # Sinon, erreur 404
    raise HTTPException(status_code=404, detail="Progress not found.")

# Route pour supprimer une progression spécifique via son ID
@router.delete("/progress/{progress_id}")
def delete_user_progress(progress_id: int, db: Session = Depends(get_db)):
    # Supprimer la progression en base
    db_progress = crud.delete_progress(db, progress_id)
    # Si suppression réussie, retourner la progression supprimée (ou confirmation)
    if db_progress:
        return db_progress
    # Sinon, erreur 404
    raise HTTPException(status_code=404, detail="Progress not found.")
