from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.schemas import heart as heart_schemas
from app.crud import heart as heart_crud
from app.database import get_db

router = APIRouter(prefix="/api/heart", tags=["heart"])

@router.post("/", response_model=heart_schemas.HeartCreateResponse)
def create_heart(item: heart_schemas.HeartCreate, db: Session = Depends(get_db)):
    db_item = heart_crud.create_heart(db, item)
    return db_item

@router.get("/{heart_id}", response_model=heart_schemas.Heart)
def read_heart(heart_id: int, db: Session = Depends(get_db)):
    db_item = heart_crud.get_heart(db, heart_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Heart item not found")
    return db_item

@router.get("/", response_model=List[heart_schemas.Heart])
def list_hearts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    hearts = heart_crud.get_hearts(db, skip=skip, limit=limit)
    return hearts

@router.put("/{heart_id}", response_model=heart_schemas.Heart)
def update_heart(heart_id: int, item: heart_schemas.HeartUpdate, db: Session = Depends(get_db)):
    db_item = heart_crud.update_heart(db, heart_id, item)
    if not db_item:
        raise HTTPException(status_code=404, detail="Heart item not found")
    return db_item

@router.delete("/{heart_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_heart(heart_id: int, db: Session = Depends(get_db)):
    success = heart_crud.delete_heart(db, heart_id)
    if not success:
        raise HTTPException(status_code=404, detail="Heart item not found")
    return None
