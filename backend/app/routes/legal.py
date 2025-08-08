from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud import legal_documents as crud
from app.models.legal_document import LegalDocument
from app.database import get_db
from pydantic import BaseModel

# Création du routeur FastAPI dédié aux documents légaux
router = APIRouter()

# Modèles Pydantic pour validation des données reçues à la création et à la mise à jour
class LegalDocumentCreate(BaseModel):
    type: str
    version: str
    language: str
    content: str

class LegalDocumentUpdate(LegalDocumentCreate):
    pass  # Pour l'instant identique à LegalDocumentCreate

# Route POST pour créer un nouveau document légal
@router.post("/legal_documents/", response_model=LegalDocument)
def create_legal_document(doc: LegalDocumentCreate, db: Session = Depends(get_db)):
    """
    Crée un nouveau document légal dans la base.
    """
    return crud.create_legal_document(db=db, **doc.dict())

# Route GET pour récupérer un document légal par son ID
@router.get("/legal_documents/{document_id}", response_model=LegalDocument)
def read_legal_document(document_id: int, db: Session = Depends(get_db)):
    """
    Récupère un document légal par son ID.
    """
    db_document = crud.get_legal_document_by_id(db=db, document_id=document_id)
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return db_document

# Route GET pour récupérer tous les documents légaux
@router.get("/legal_documents/", response_model=list[LegalDocument])
def read_all_legal_documents(db: Session = Depends(get_db)):
    """
    Récupère tous les documents légaux existants.
    """
    return crud.get_all_legal_documents(db=db)

# Route PUT pour mettre à jour un document légal existant
@router.put("/legal_documents/{document_id}", response_model=LegalDocument)
def update_legal_document(document_id: int, doc: LegalDocumentUpdate, db: Session = Depends(get_db)):
    """
    Met à jour un document légal par son ID.
    """
    db_document = crud.update_legal_document(db=db, document_id=document_id, **doc.dict())
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return db_document

# Route DELETE pour supprimer un document légal
@router.delete("/legal_documents/{document_id}", response_model=LegalDocument)
def delete_legal_document(document_id: int, db: Session = Depends(get_db)):
    """
    Supprime un document légal par son ID.
    """
    db_document = crud.delete_legal_document(db=db, document_id=document_id)
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return db_document
