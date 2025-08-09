from pydantic import BaseModel
from typing import Optional

class ProgressBase(BaseModel):
    user_id: int
    document_id: int
    signed: bool = False

class ProgressCreate(ProgressBase):
    pass

class ProgressUpdate(ProgressBase):
    signed: Optional[bool] = None  # Optionnel pour la mise à jour

class Progress(ProgressBase):
    id: int

    class Config:
        from_attributes = True  # remplace orm_mode en Pydantic v2
