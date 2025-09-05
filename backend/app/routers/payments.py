# backend/app/api/routers/payments.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
import logging

# Importer la librairie Bitcoin pour les wrappers
from app.api.routers.bitcoin_client import (
    get_rpc_client, 
    get_new_bitcoin_address, 
    generate_blocks, 
    send_transaction,
    get_rpc_connection_error # Pour vérifier la connexion globale
)

# Importer les dépendances nécessaires (DB, sécurité, etc.)
from app.database import get_db
from app.core.dependencies import get_current_user_dependency # Si les routes paiements sont protégées
from app.core.security import ACCESS_TOKEN_EXPIRE_MINUTES # juste pour l'exemple

# Importer les schemas Pydantic
from app.schemas.user import UserResponse # Pour la dépendance current_user
from app.schemas.payments import PaymentRequest, PaymentResponse, PaymentStatusResponse # A créer

# Importation CRUD pour les utilisateurs (si nécessaire pour associer des adresses, etc.)
from app.crud import user as crud_user

# Module pour gérer la consommation et les paiements (logique métier)
from app.services import payment_service # A créer

# Configuration du logger
logger = logging.getLogger(__name__)

# Création du routeur pour les paiements
router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
    # Dépendance qui s'appliquera à TOUTES les routes de ce routeur
    # Si vous voulez protéger toutes les routes de paiements
    dependencies=[Depends(get_current_user_dependency)] 
)

# ==============================================================================
# Schémas Pydantic pour ce routeur (à créer dans app/schemas/payments.py)
# ==============================================================================
# Exemple de ce que vous auriez dans app/schemas/payments.py :
# class PaymentRequest(BaseModel):
#     amount: float = Field(..., gt=0, description="Montant à payer en BTC")
#     user_address: str = Field(..., description="Adresse Bitcoin de l'utilisateur")
#
# class PaymentResponse(BaseModel):
#     payment_id: str # Un identifiant interne pour suivre le paiement
#     address_to_pay: str
#     amount_to_pay: float
#     message: str
#     status: str # e.g., "pending_payment"
#
# class PaymentStatusResponse(BaseModel):
#     payment_id: str
#     status: str # e.g., "paid", "pending", "failed"
#     transaction_id: str | None = None # ID de la transaction Bitcoin si payé

# ==============================================================================
# Endpoints (Routes) de Paiement
# ==============================================================================

@router.get("/status", response_model=PaymentStatusResponse)
def get_payment_status(
    payment_id: str = Query(..., description="Identifiant unique du paiement à vérifier"),
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user_dependency)
):
    """
    Vérifie l'état d'un paiement spécifique.
    """
    logger.info(f"Vérification du statut du paiement {payment_id} pour l'utilisateur {current_user.email}.")
    
    # Ici, vous appellerez votre logique métier (dans payment_service)
    # qui ira interroger le back-end Bitcoin et/ou la base de données pour le statut.
    # exemple: payment_details = payment_service.get_payment_details(db, payment_id)
    
    # Simulation pour l'instant
    payment_details = payment_service.get_payment_status(db, payment_id) # Supposons que cette fonction existe

    if not payment_details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paiement introuvable.")
        
    return payment_details

@router.post("/request", response_model=PaymentResponse)
def request_payment(
    request_data: PaymentRequest, # Contient l'adresse de l'utilisateur et le montant désiré (ou calculé par le backend)
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user_dependency)
):
    """
    Demande un nouveau paiement. Le backend génère une nouvelle adresse pour ce paiement.
    """
    logger.info(f"Demande de paiement pour l'utilisateur {current_user.email}. Montant demandé: {request_data.amount}.")
    
    # 1. Vérifier la connexion Bitcoin globale avant de continuer
    if get_rpc_connection_error():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Le service Bitcoin RPC n'est pas disponible: {get_rpc_connection_error()}"
        )

    # 2. Valider le montant (doit être positif)
    if request_data.amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Le montant doit être positif.")
        
    # 3. Générer une nouvelle adresse Bitcoin pour ce paiement spécifique
    try:
        payment_address = get_new_bitcoin_address(label=f"payment_user_{current_user.id}")
    except HTTPException as e: # Si get_new_bitcoin_address lève une exception HTTP
        raise e
    except Exception as e: # Pour toute autre erreur
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Impossible de générer une nouvelle adresse Bitcoin: {e}")

    # 4. Enregistrer ce paiement en attente dans la base de données
    # (Vous devrez implémenter la logique de création dans crud/payment.py)
    try:
        new_payment = payment_service.create_pending_payment(
            db=db,
            user_id=current_user.id,
            address=payment_address,
            amount=request_data.amount,
            currency="BTC_REGTEST" # Spécifier la devise/réseau utilisé
        )
    except Exception as e:
        logger.error(f"Erreur lors de l'enregistrement du paiement en attente: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur lors de la création de la transaction de paiement.")

    logger.info(f"Paiement {new_payment.id} créé. Adresse: {payment_address}, Montant: {request_data.amount} BTC.")
    
    # 5. Retourner les détails pour que le front-end puisse les afficher
    return PaymentResponse(
        payment_id=str(new_payment.id), # Convertir l'ID SQLAlchemy en string
        address_to_pay=payment_address,
        amount_to_pay=request_data.amount,
        message=f"Veuillez envoyer {request_data.amount} BTC (Regtest) à cette adresse pour confirmer votre paiement.",
        status="pending_payment"
    )

@router.post("/confirm/{payment_id}", status_code=status.HTTP_200_OK)
def confirm_payment(
    payment_id: str,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user_dependency)
):
    """
    Endpoint appelé par le back-end (ou le front-end via une action utilisateur)
    pour déclencher la vérification d'un paiement après qu'un montant ait été envoyé.
    """
    logger.info(f"Demande de confirmation pour le paiement {payment_id} par l'utilisateur {current_user.email}.")
    
    # 1. Vérifier la connexion Bitcoin globale
    if get_rpc_connection_error():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Le service Bitcoin RPC n'est pas disponible: {get_rpc_connection_error()}"
        )

    try:
        # 2. Appeler la logique métier pour vérifier et confirmer le paiement
        # Cette fonction devra :
        #   - Récupérer les détails du paiement (adresse, montant attendu) depuis la DB.
        #   - Vérifier si le montant attendu a été reçu sur cette adresse (via getreceivedbyaddress, ou une logique plus avancée si besoin).
        #   - Si reçu :
        #     - Générer un bloc (generatetoaddress) pour confirmer la transaction rapidement sur Regtest.
        #     - Mettre à jour le statut du paiement en 'paid' dans la DB.
        #     - Retourner le txid de confirmation.
        #   - Si non reçu ou montant insuffisant : lever une HTTPException.
        
        confirmation_result = payment_service.process_and_confirm_payment(db, payment_id, current_user.id)
        
        logger.info(f"Paiement {payment_id} confirmé avec txid: {confirmation_result.get('transaction_id')}")
        return {"message": "Paiement confirmé avec succès.", "transaction_id": confirmation_result.get('transaction_id')}

    except HTTPException as e: # Si la logique métier lève une exception HTTP (ex: paiement non reçu)
        raise e
    except Exception as e:
        logger.error(f"Erreur lors de la confirmation du paiement {payment_id}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erreur lors de la confirmation du paiement: {e}")

# --- Autres routes possibles ---
# @router.post("/simulate-payment") # Pour déclencher la simulation de paiement depuis le front-end (utile pour les tests)
# ...