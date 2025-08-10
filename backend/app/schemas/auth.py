# /home/manik/skinlensr/SkinLensR/backend/app/schemas/auth.py

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
# ...
# Schémas pour les Utilitaires / Authentification
from .auth import ( # Importez Token depuis auth.py
    Token,
)
# ...
# --- Schémas pour l'Authentification ---

class Token(BaseModel):
    """Schéma pour la réponse du token d'accès."""
    access_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsIn...")
    token_type: str = Field("bearer", example="bearer")
    # Vous pourriez ajouter ici la date d'expiration du token, ou des informations sur l'utilisateur
    # token_expires_at: Optional[datetime] = None
    # user_id: Optional[int] = None
    # user_role: Optional[str] = None

class TokenData(BaseModel):
    """Schéma pour les données décodées du token (payload)."""
    email: str = Field(..., example="test@example.com")
    scopes: List[str] = Field([], example=["read", "write"]) # Si vous utilisez des scopes

# Si vous implémentez une fonctionnalité de déconnexion ou de refresh token :
# class LogoutRequest(BaseModel):
#     refresh_token: str = Field(..., description="The refresh token to revoke.")

# class RefreshTokenRequest(BaseModel):
#     refresh_token: str = Field(..., description="The refresh token to exchange for a new access token.")

# class RefreshTokenResponse(Token): # Hérite du schéma Token pour la nouvelle paire
#     refresh_token: Optional[str] = Field(None, description="A new refresh token if issued.")