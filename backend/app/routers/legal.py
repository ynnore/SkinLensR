from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.database import get_db

# Création du router pour les documents légaux
router = APIRouter()

# Route pour récupérer un document légal par son ID
@router.get("/legal_documents/{document_id}", response_model=schemas.LegalDocument)
def get_legal_document(document_id: int, db: Session = Depends(get_db)):
    db_document = crud.get_legal_document_by_id(db, document_id)
    if db_document is None:
        raise HTTPException(status_code=404, detail="Legal document not found")
    return db_document

# Route pour récupérer tous les documents légaux
@router.get("/legal_documents/", response_model=list[schemas.LegalDocument])
def get_all_legal_documents(db: Session = Depends(get_db)):
    return crud.get_all_legal_documents(db)

# Route pour créer un nouveau document légal
@router.post("/legal_documents/", response_model=schemas.LegalDocument)
def create_legal_document(
    document: schemas.LegalDocumentCreate, db: Session = Depends(get_db)
):
    return crud.create_legal_document(
        db=db, type=document.type, version=document.version, language=document.language, content=document.content
    )

# Route pour mettre à jour un document légal
@router.put("/legal_documents/{document_id}", response_model=schemas.LegalDocument)
def update_legal_document(
    document_id: int, document: schemas.LegalDocumentUpdate, db: Session = Depends(get_db)
):
    db_document = crud.update_legal_document(
        db=db,
        document_id=document_id,
        type=document.type,
        version=document.version,
        language=document.language,
        content=document.content,
    )
    if db_document is None:
        raise HTTPException(status_code=404, detail="Legal document not found")
    return db_document

# Route pour supprimer un document légal
@router.delete("/legal_documents/{document_id}", response_model=schemas.LegalDocument)
def delete_legal_document(document_id: int, db: Session = Depends(get_db)):
    db_document = crud.delete_legal_document(db=db, document_id=document_id)
    if db_document is None:
        raise HTTPException(status_code=404, detail="Legal document not found")
    return db_document
