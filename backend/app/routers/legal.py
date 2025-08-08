from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.database import get_db

# Création du routeur FastAPI pour gérer les routes liées aux documents légaux
router = APIRouter()

# Route pour récupérer un document légal spécifique via son ID
@router.get("/legal_documents/{document_id}", response_model=schemas.LegalDocument)
def get_legal_document(document_id: int, db: Session = Depends(get_db)):
    # Appel à la fonction CRUD pour obtenir le document dans la base de données
    db_document = crud.get_legal_document_by_id(db, document_id)
    # Si le document n'existe pas, renvoyer une erreur 404
    if db_document is None:
        raise HTTPException(status_code=404, detail="Legal document not found")
    # Retourner le document légal trouvé
    return db_document

# Route pour récupérer la liste de tous les documents légaux
@router.get("/legal_documents/", response_model=list[schemas.LegalDocument])
def get_all_legal_documents(db: Session = Depends(get_db)):
    # Appel à la fonction CRUD pour obtenir tous les documents
    return crud.get_all_legal_documents(db)

# Route pour créer un nouveau document légal
@router.post("/legal_documents/", response_model=schemas.LegalDocument)
def create_legal_document(
    document: schemas.LegalDocumentCreate,  # Les données du document à créer, validées par Pydantic
    db: Session = Depends(get_db)           # Injection de la session de base de données
):
    # Appel à la fonction CRUD pour créer le document dans la base
    return crud.create_legal_document(
        db=db, 
        type=document.type, 
        version=document.version, 
        language=document.language, 
        content=document.content
    )

# Route pour mettre à jour un document légal existant via son ID
@router.put("/legal_documents/{document_id}", response_model=schemas.LegalDocument)
def update_legal_document(
    document_id: int,                      # ID du document à modifier
    document: schemas.LegalDocumentUpdate,  # Données mises à jour validées
    db: Session = Depends(get_db)            # Session DB injectée
):
    # Appel à la fonction CRUD pour mettre à jour le document
    db_document = crud.update_legal_document(
        db=db,
        document_id=document_id,
        type=document.type,
        version=document.version,
        language=document.language,
        content=document.content,
    )
    # Si le document à modifier n'existe pas, renvoyer une erreur 404
    if db_document is None:
        raise HTTPException(status_code=404, detail="Legal document not found")
    # Retourner le document mis à jour
    return db_document

# Route pour supprimer un document légal via son ID
@router.delete("/legal_documents/{document_id}", response_model=schemas.LegalDocument)
def delete_legal_document(document_id: int, db: Session = Depends(get_db)):
    # Appel à la fonction CRUD pour supprimer le document
    db_document = crud.delete_legal_document(db=db, document_id=document_id)
    # Si le document à supprimer n'existe pas, renvoyer une erreur 404
    if db_document is None:
        raise HTTPException(status_code=404, detail="Legal document not found")
    # Retourner le document supprimé (ou une confirmation)
    return db_document
