from pydantic import BaseModel
from datetime import datetime

class MemoryBase(BaseModel):
    role: str
    content: str

class MemoryCreate(MemoryBase):
    pass

class MemoryResponse(MemoryBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
