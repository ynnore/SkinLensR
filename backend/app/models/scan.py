from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.database import get_async_db
from app.models.scan import ScanRequest, GenerationStatus, GenerationMode

router = APIRouter()

class ScanIn(BaseModel):
    query: str

class ScanOut(BaseModel):
    response: str

@router.post("/scan", response_model=ScanOut)
async def create_scan(request: ScanIn, db: AsyncSession = Depends(get_async_db)):
    # Créer la requête ScanRequest
    scan = ScanRequest(
        user_id=1,  # A remplacer par user connecté via auth
        prompt=request.query,
        mode=GenerationMode.RAG_TEXT,
        result_status=GenerationStatus.PENDING
    )
    db.add(scan)
    await db.commit()
    await db.refresh(scan)

    # Ici tu pourrais déclencher ton traitement async
    # Par exemple, appeler un agent RAG, puis mettre à jour scan.result_text + result_status

    # Pour l’exemple on simule juste une réponse fixe
    fake_response = f"Réponse simulée pour la requête : {request.query}"

    # Mise à jour en base (optionnel, ici synchro)
    scan.result_text = fake_response
    scan.result_status = GenerationStatus.COMPLETED
    await db.commit()
    await db.refresh(scan)

    return ScanOut(response=scan.result_text)
