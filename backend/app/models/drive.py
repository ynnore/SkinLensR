# /home/manik/skinlensr/SkinLensR/backend/app/models/drive.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID # Si vous utilisez PostgreSQL pour les UUIDs
import uuid

# Assurez-vous que Base est correctement importé depuis app.models.base
from app.models.base import Base 

class DriveFile(Base):
    """
    Modèle SQLAlchemy représentant un fichier géré par le système de Drive.
    """
    __tablename__ = "drive_files" # Nom de la table dans la base de données

    # Clé primaire. Un entier auto-généré est courant ici.
    id = Column(Integer, primary_key=True, index=True) 

    # Liens avec l'utilisateur
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    # Si vous avez une relation bidirectionnelle définie dans le modèle User :
    # user = relationship("User", back_populates="drive_files")

    # Informations sur le fichier
    filename = Column(String, index=True, nullable=False, comment="Nom original du fichier")
    unique_filename = Column(String, index=True, nullable=False, unique=True, comment="Nom de fichier unique stocké sur le serveur")
    filepath = Column(String, nullable=False, comment="Chemin d'accès au fichier sur le serveur")
    content_type = Column(String, nullable=True, comment="Type MIME du fichier (ex: application/pdf)")
    size = Column(Integer, nullable=False, comment="Taille du fichier en octets")

    # Timestamps
    uploaded_at = Column(DateTime, server_default=func.now(), comment="Date et heure d'upload")
    created_at = Column(DateTime, default=datetime.utcnow) # Utiliser utcnow si vous n'avez pas func.now() partout
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) # Peut utiliser server_default et onupdate

    # Pour stocker le contenu du fichier directement en base de données (moins courant pour les gros fichiers)
    # Si vous stockez les fichiers EN BASE de données (pas sur le système de fichiers) :
    # file_content = Column(LargeBinary, nullable=True) # Pour stocker le contenu binaire

    def __repr__(self):
        return f"<DriveFile(id={self.id}, filename='{self.filename}', user_id={self.user_id}, uploaded_at='{self.uploaded_at}')>"