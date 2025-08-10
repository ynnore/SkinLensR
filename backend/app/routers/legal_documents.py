from fastapi import APIRouter

router = APIRouter()

@router.get("/legal-documents")
def get_legal_docs():
    return {"message": "Liste des documents légaux"}
