# /home/manik/skinlensr/SkinLensR/backend/app/schemas/auth.py

from pydantic import BaseModel
from typing import Optional # <-- Ajoutez cette importation

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    # Remplacez la ligne suivante par celle ci-dessous
    # username: str | None = None # Ou le champ pertinent pour vos données de token
    username: Optional[str] = None # <-- Syntax correcte pour Python 3.8