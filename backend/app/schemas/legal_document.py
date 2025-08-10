# /home/manik/skinlensr/SkinLensR/backend/app/schemas/legal_document.py

import uuid # Si vous utilisez des UUIDs pour les documents, bien que souvent un ID entier soit utilisé pour les documents légaux.
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from pydantic import BaseModel, Field, EmailStr, validator

# --- Schémas Pydantic pour les Documents Légaux ---

class LegalDocumentBase(BaseModel):
    """Modèle de base pour les données d'un document légal."""
    type: str = Field(..., example="CGU") # Type de document (ex: CGU, CGV, Politique de confidentialité)
    version: str = Field(..., example="1.0.0") # Version du document
    language: str = Field(..., example="fr") # Code langue ISO 639-1 (ex: 'fr', 'en')
    title: str = Field(..., example="Conditions Générales d'Utilisation") # Titre lisible du document

class LegalDocumentCreate(LegalDocumentBase):
    """Schéma pour la création d'un nouveau document légal."""
    content: str = Field(..., example="Le présent document détaille nos conditions...") # Le contenu complet du document

class LegalDocumentUpdate(BaseModel):
    """Schéma pour la mise à jour d'un document légal existant."""
    # Tous les champs sont optionnels car on peut vouloir ne mettre à jour que certains aspects
    type: Optional[str] = Field(None, example="CGU")
    version: Optional[str] = Field(None, example="1.1.0")
    language: Optional[str] = Field(None, example="en")
    title: Optional[str] = Field(None, example="General Terms of Use")
    content: Optional[str] = Field(None, example="Updated terms and conditions...")

    # Validateur pour s'assurer qu'au moins un champ est fourni pour la mise à jour
    @validator('type', 'version', 'language', 'title', 'content', pre=True, always=True)
    def check_at_least_one_field(cls, v, values, **kwargs):
        if not any(values.values()): # Vérifie si tous les champs sont None
            raise ValueError("At least one field must be provided for update.")
        return v

class LegalDocumentResponse(LegalDocumentBase):
    """Schéma pour la réponse API décrivant un document légal."""
    id: int = Field(..., example=1) # ID unique du document dans la base de données
    content_preview: str = Field(..., example="Le présent document détaille nos conditions...") # Un extrait du contenu pour la réponse API
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        # orm_mode = True # Utile si vous mappez directement depuis des modèles SQLAlchemy
        json_encoders = {
            datetime: lambda v: v.isoformat() # Pour convertir datetime en string ISO pour JSON
        }

# --- Schémas pour les Accords Utilisateur (si vous les gérez séparément) ---
# Si vous avez une table qui enregistre quel utilisateur a accepté quel document légal,
# vous aurez besoin de schémas pour cela.

class UserLegalAgreementBase(BaseModel):
    """Modèle de base pour un accord utilisateur sur un document légal."""
    user_id: int = Field(..., example=1)
    legal_document_id: int = Field(..., example=101)
    accepted_at: datetime = Field(default_factory=datetime.utcnow)

class UserLegalAgreementCreate(UserLegalAgreementBase):
    """Schéma pour enregistrer qu'un utilisateur a accepté un document."""
    # Pas de champs supplémentaires requis par défaut, mais vous pourriez en avoir
    pass

class UserLegalAgreementResponse(UserLegalAgreementBase):
    """Schéma pour la réponse API décrivant un accord utilisateur."""
    id: int # ID de l'enregistrement de l'accord
    user_id: int
    legal_document_id: int
    accepted_at: datetime
    document_version: str = Field(..., example="1.0.0") # Version du document accepté
    document_type: str = Field(..., example="CGU") # Type du document accepté

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }