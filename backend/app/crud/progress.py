# /home/manik/skinlensr/SkinLensR/backend/app/crud/progress.py

from sqlalchemy.orm import Session
from app.models.progress import Progress
from sqlalchemy.exc import SQLAlchemyError

# Créer un suivi de progression pour un utilisateur
def create_progress(db: Session, user_id: int, step: str, completed: int):
    try:
        db_progress = Progress(
            user_id=user_id,
            step=step,
            completed=completed
        )
        db.add(db_progress)
        db.commit()
        db.refresh(db_progress)
        return db_progress
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error while creating progress: {str(e)}")
        return None

# Récupérer la progression d'un utilisateur par l'ID
def get_progress_by_user_id(db: Session, user_id: int):
    return db.query(Progress).filter(Progress.user_id == user_id).all()

# Récupérer la progression par l'ID du suivi
def get_progress_by_id(db: Session, progress_id: int):
    return db.query(Progress).filter(Progress.id == progress_id).first()

# Mettre à jour la progression d'un utilisateur
def update_progress(db: Session, progress_id: int, completed: int):
    db_progress = db.query(Progress).filter(Progress.id == progress_id).first()
    if db_progress:
        db_progress.completed = completed
        db.commit()
        db.refresh(db_progress)
        return db_progress
    else:
        return None

# Supprimer un suivi de progression
def delete_progress(db: Session, progress_id: int):
    db_progress = db.query(Progress).filter(Progress.id == progress_id).first()
    if db_progress:
        db.delete(db_progress)
        db.commit()
        return db_progress
    else:
        return None
