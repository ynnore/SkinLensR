# backend/app/schemas/payments.py

from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class PaymentCreateRequest(BaseModel):
    """Schéma pour la requête de création d'une facture de paiement."""
    plan_id: str = Field(..., description="L'identifiant du plan tarifaire (ex: 'standard' ou 'premium').")

class PaymentCreateResponse(BaseModel):
    """Schéma de la réponse après la création d'une facture."""
    payment_id: uuid.UUID
    address_to_pay: str
    amount_to_pay: float
    uri: str = Field(..., description="URI de paiement standard (BIP-21) pour les QR codes.")
    status: str
    expires_at: datetime

class PaymentStatusResponse(BaseModel):
    """Schéma pour la réponse de statut d'un paiement."""
    payment_id: uuid.UUID
    status: str
    transaction_id: str | None = None
    confirmations: int = 0