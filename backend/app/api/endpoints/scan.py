from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.scan import ScanRequest, GenerationStatus, GenerationMode

router = APIRouter()

class ScanRequestIn(BaseModel):
    query: str

class ScanResponseOut(BaseModel):
    response: str

@router.post("/scan", response_model=ScanResponseOut)
def create_scan(request: ScanRequestIn, db: Session = Depends(get_db)):
    scan = ScanRequest(
        user_id=1,  # TODO: remplacer par l'ID utilisateur authentifié
        prompt=request.query,
        mode=GenerationMode.RAG_TEXT,
        result_status=GenerationStatus.PENDING,
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    # Simule traitement immédiat pour MVP
    fake_response = f"Réponse automatique pour : {request.query}"
    scan.result_text = fake_response
    scan.result_status = GenerationStatus.COMPLETED

    db.commit()
    db.refresh(scan)

    return ScanResponseOut(response=scan.result_text)
