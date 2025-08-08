from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db

# Création du routeur FastAPI pour les opérations liées aux utilisateurs
router = APIRouter()

# Route pour créer un nouvel utilisateur
@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Crée un nouvel utilisateur si l'email n'est pas déjà enregistré.
    """
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# Route pour récupérer un utilisateur par son ID
@router.get("/users/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Retourne les détails d'un utilisateur donné par son ID.
    """
    db_user = crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Route pour récupérer la liste de tous les utilisateurs
@router.get("/users/", response_model=list[schemas.User])
def get_users(db: Session = Depends(get_db)):
    """
    Retourne la liste de tous les utilisateurs.
    """
    return crud.get_users(db)

# Route pour mettre à jour un utilisateur existant
@router.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    """
    Met à jour les informations d'un utilisateur existant.
    """
    db_user = crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.update_user(db=db, user_id=user_id, user=user)

# Route pour supprimer un utilisateur par son ID
@router.delete("/users/{user_id}", response_model=schemas.User)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Supprime un utilisateur existant.
    """
    db_user = crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.delete_user(db=db, user_id=user_id)
