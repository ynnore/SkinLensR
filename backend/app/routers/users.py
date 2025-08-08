from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.database import get_db

# Création d'un router FastAPI pour gérer les routes utilisateurs
router = APIRouter()

# Route pour récupérer un utilisateur par son ID
@router.get("/users/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    # Appel à la fonction CRUD pour récupérer l'utilisateur
    db_user = crud.get_user(db, user_id)
    # Si l'utilisateur n'existe pas, renvoyer une erreur 404
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    # Sinon, retourner l'utilisateur
    return db_user

# Route pour créer un nouvel utilisateur
@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Vérifier si un utilisateur avec cet email existe déjà
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        # Si oui, renvoyer une erreur 400 (mauvaise requête)
        raise HTTPException(status_code=400, detail="Email already registered")
    # Sinon, créer l'utilisateur avec la fonction CRUD et retourner le nouvel utilisateur
    return crud.create_user(db=db, user=user)

# Route pour mettre à jour un utilisateur existant
@router.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    # Vérifier que l'utilisateur existe avant la mise à jour
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    # Appeler la fonction CRUD pour mettre à jour les infos utilisateur
    return crud.update_user(db=db, user_id=user_id, user=user)

# Route pour supprimer un utilisateur par son ID
@router.delete("/users/{user_id}", response_model=schemas.User)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    # Vérifier que l'utilisateur existe avant suppression
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    # Supprimer l'utilisateur via la fonction CRUD et retourner l'utilisateur supprimé
    return crud.delete_user(db=db, user_id=user_id)
