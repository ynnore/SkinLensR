from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class FileBase(BaseModel):
    name: str = Field(..., example="document.pdf")
    size: int = Field(..., example=123456)  # taille en octets

class FileCreate(FileBase):
    path: str = Field(..., example="/uploads/document.pdf")

class FileResponse(FileBase):
    id: int
    path: str
    uploaded_at: datetime

    class Config:
        orm_mode = True

class FileListResponse(BaseModel):
    files: list[FileResponse]
