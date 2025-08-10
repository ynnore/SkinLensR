# /home/manik/skinlensr/SkinLensR/backend/app/crud/drive.py

import logging
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Importez vos modèles SQLAlchemy
# Assurez-vous que ces modèles existent dans app/models/drive.py
from app.models.drive import DriveFile
# Vous aurez aussi besoin du modèle User pour la ForeignKey et potentiellement du modèle ScanRequest si le scan est lié à un fichier
from app.models.user import User
# from app.models.scan import ScanRequestModel # Si ScanRequest est persisté et lié ici

# Importez vos schémas Pydantic pour la validation et la réponse
from app.schemas.drive import FileCreate, FileResponse, SearchRequest, SearchResult

logger = logging.getLogger(__name__)

# --- Fonctions CRUD pour les Fichiers du Drive ---

def create_file_record(
    db: Session,
    user_id: int,
    filename: str,
    unique_filename: str,
    filepath: str,
    content_type: Optional[str] = None,
    size: Optional[int] = None
) -> Optional[DriveFile]:
    """
    Crée un enregistrement de fichier dans la base de données.
    """
    logger.info(f"Creating file record for user {user_id}, filename='{filename}', unique_name='{unique_filename}'")
    try:
        # Vérifier que l'utilisateur existe (bonne pratique)
        user = db.query(User).get(user_id)
        if not user:
            logger.error(f"User {user_id} not found when trying to create file record.")
            raise ValueError("User not found.")

        db_file = DriveFile(
            user_id=user_id,
            filename=filename,
            unique_filename=unique_filename,
            filepath=filepath,
            content_type=content_type,
            size=size if size is not None else 0 # Définir une taille par défaut si non fournie
        )
        db.add(db_file)
        db.commit()
        db.refresh(db_file) # Rafraîchir pour obtenir l'ID et les timestamps
        logger.info(f"File record created successfully: ID={db_file.id}, Filename='{filename}'")
        return db_file
        
    except ValueError as ve: # Gérer les erreurs de validation (ex: user non trouvé)
        db.rollback()
        logger.error(f"Validation error creating file record for user {user_id}: {ve}")
        return None
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating file record for user {user_id}, filename '{filename}': {e}")
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error creating file record for user {user_id}, filename '{filename}': {e}")
        return None

def get_file_record_by_id(db: Session, file_id: int) -> Optional[DriveFile]:
    """
    Récupère un enregistrement de fichier par son ID.
    """
    logger.debug(f"Fetching file record by ID: {file_id}")
    try:
        file_record = db.query(DriveFile).get(file_id)
        if file_record:
            logger.debug(f"File record found: ID={file_record.id}, Filename='{file_record.filename}'")
        else:
            logger.warning(f"File record not found for ID: {file_id}")
        return file_record
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching file record ID {file_id}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching file record ID {file_id}: {e}")
        return None

def get_user_files(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[DriveFile]:
    """
    Récupère la liste des fichiers uploadés par un utilisateur spécifique.
    """
    logger.debug(f"Fetching files for user ID: {user_id} (skip={skip}, limit={limit})")
    try:
        files = db.query(DriveFile).filter(DriveFile.user_id == user_id).offset(skip).limit(limit).all()
        logger.debug(f"Found {len(files)} files for user ID {user_id}.")
        return files
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching files for user ID {user_id}: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching files for user ID {user_id}: {e}")
        return []

def search_files_and_web(db: Session, user_id: int, query: str, search_web: bool = False) -> List[Dict[str, Any]]:
    """
    Recherche des fichiers de l'utilisateur et potentiellement sur le web.
    Cette fonction est plus complexe car elle peut impliquer des recherches textuelles dans le contenu des fichiers
    ou des appels à des API externes pour la recherche web.
    """
    logger.info(f"Searching for '{query}' (search_web={search_web}) for user {user_id}.")
    
    results = []
    try:
        # 1. Recherche dans les fichiers de l'utilisateur
        # Ceci peut impliquer une recherche plein texte sur le champ 'content' si vous le stockez en DB,
        # ou une recherche basée sur les métadonnées (nom, type).
        # Si vous utilisez une recherche vectorielle (RAG) pour les documents, c'est ici que vous l'appelleriez.
        
        # Exemple de recherche simple par nom ou type :
        user_files = db.query(DriveFile).filter(
            DriveFile.user_id == user_id,
            # Exemple de filtre basé sur la requête (doit être adapté pour une recherche plus intelligente)
            # DriveFile.filename.ilike(f"%{query}%") | DriveFile.content_type.ilike(f"%{query}%") # Nécessite de stocker le contenu ou de le lire
        ).all()
        
        for f in user_files:
            # Mapper les résultats au schéma SearchResult
            # Vous devrez potentiellement lire le contenu du fichier si la recherche s'applique au contenu
            results.append({
                "id": f.id,
                "title": f.filename,
                "description": f"File type: {f.content_type}, Size: {f.size} bytes",
                "source": "Drive",
                "url": f"/api/drive/files/{f.unique_filename}", # URL pour télécharger le fichier
                "score": 1.0, # Score factice pour l'exemple
                "timestamp": f.uploaded_at
            })
        
        # 2. Recherche sur le Web (si activée)
        if search_web:
            logger.info("Performing web search...")
            # Ici, vous feriez un appel à une API de recherche web (ex: Google Search API, DuckDuckGo)
            # Et ajouteriez les résultats à la liste 'results'
            # Exemple : web_results = search_web_api(query)
            # results.extend(web_results)
            pass # Placeholder

        logger.info(f"Found {len(results)} search results.")
        return results
        
    except SQLAlchemyError as e:
        logger.error(f"Database error during search for user {user_id}, query '{query}': {e}")
        return [] # Retourner une liste vide en cas d'erreur
    except Exception as e:
        logger.error(f"Unexpected error during search for user {user_id}, query '{query}': {e}")
        return []

# Vous pourriez avoir besoin de fonctions pour la suppression de fichiers physiques
# en plus de la suppression des enregistrements DB.