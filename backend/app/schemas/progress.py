# /home/manik/skinlensr/SkinLensR/backend/app/schemas/progress.py

from pydantic import BaseModel

# Schéma pour la création d'une progression
class ProgressCreate(BaseModel):
    user_id: int
    step: str
    completed: int

# Schéma pour la récupération d'une progression
class Progress(ProgressCreate):
    id: int

    class Config:
        orm_mode = True
