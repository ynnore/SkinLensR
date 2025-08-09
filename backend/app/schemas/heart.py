from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class HeartBase(BaseModel):
    name: str = Field(..., max_length=255, description="Nom unique du bouquet cœur")
    description: Optional[str] = Field(None, description="Description détaillée du bouquet cœur")
    category: Optional[str] = Field(None, max_length=100, description="Catégorie ou type")
    image_url: Optional[str] = Field(None, description="URL de l'image associée")

class HeartCreate(HeartBase):
    pass  # Hérite simplement des champs de HeartBase pour la création

class HeartUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    image_url: Optional[str] = None

class HeartInDBBase(HeartBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class HeartResponse(HeartInDBBase):
    pass  # Pour la réponse API, même que HeartInDBBase
