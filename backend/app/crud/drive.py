import os
import shutil
from typing import List
from sqlalchemy.orm import Session
from app.models.drive import File as FileModel
from app.schemas.drive import SearchRequest, SearchResult

UPLOAD_DIR = "uploaded_files"  # Même dossier que dans api/drive.py

def create_file_record(db: Session, user_id: int, filename: str, filepath: str, filesize: int) -> FileModel:
    """
    Crée une entrée fichier en base liée à un utilisateur.
    """
    db_file = FileModel(
        user_id=user_id,
        name=filename,
        path=filepath,
        size=filesize
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

def get_user_files(db: Session, user_id: int) -> List[FileModel]:
    """
    Récupère la liste des fichiers d’un utilisateur.
    """
    return db.query(FileModel).filter(FileModel.user_id == user_id).all()

def save_uploaded_file(upload_file, dest_folder=UPLOAD_DIR) -> str:
    """
    Sauvegarde physiquement un fichier uploadé et retourne son chemin.
    """
    if not os.path.exists(dest_folder):
        os.makedirs(dest_folder)
    file
