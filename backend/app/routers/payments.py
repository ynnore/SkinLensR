"""
Routeur API pour la gestion des paiements Bitcoin.

Ce module gère la création de factures de paiement et la vérification de leur statut.
Le flux est conçu pour être automatisé : le backend détecte les paiements sur la blockchain
sans nécessiter d'action de confirmation de la part de l'utilisateur.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
import uuid

# --- Import des modules de l'application ---

# Utiliser les fonctions corrigées et robustes de notre client Bitcoin
from app.api.routers import bitcoin_client

# Dépendances de l'application
from app.database import get_db
from app.core.dependencies import get_current_user_dependency
from app.core.config import settings # Pour la simulation en dev

# Schémas Pydantic pour la validation des données
from app.schemas.user import UserResponse
from app.schemas.payments import PaymentCreateRequest, PaymentCreateResponse, PaymentStatusResponse

# Logique métier et accès à la base de données
# NOTE : Vous devrez implémenter ces modules (crud_payment, payment_service)
from app.crud import payment as crud_payment
from app.services import payment_service

# --- Configuration ---
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
    # Protéger toutes les routes de ce routeur par une authentification
    dependencies=[Depends(get_current_user_dependency)]
)

# ==============================================================================
# Endpoints (Routes) de Paiement
# ==============================================================================

@router.post("/create-invoice", response_model=PaymentCreateResponse, status_code=status.HTTP_201_CREATED)
def create_invoice(
    request_data: PaymentCreateRequest,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user_dependency)
):
    """
    Crée une nouvelle facture de paiement pour un plan tarifaire.
    
    Cette route génère une adresse Bitcoin unique pour cette transaction,
    l'enregistre dans la base de données avec un statut "pending", et renvoie
    les informations nécessaires au frontend pour afficher les instructions de paiement.
    """
    logger.info(f"Création d'une facture pour l'utilisateur {current_user.email} (plan: {request_data.plan_id}).")
    try:
        # La logique métier est déléguée au service de paiement
        new_payment = payment_service.create_payment_invoice(
            db=db, user_id=current_user.id, plan_id=request_data.plan_id
        )

        # Créer un URI de paiement standard (BIP-21) pour les QR codes
        payment_uri = f"bitcoin:{new_payment.address}?amount={new_payment.expected_amount}&label=PaiementKiwiOps"

        return PaymentCreateResponse(
            payment_id=new_payment.id,
            address_to_pay=new_payment.address,
            amount_to_pay=new_payment.expected_amount,
            uri=payment_uri,
            status=new_payment.status,
            expires_at=new_payment.expires_at # Inclure la date d'expiration
        )
    except HTTPException as e:
        # Propage les exceptions HTTP levées par le service (ex: plan non trouvé)
        raise e
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la création de la facture pour {current_user.email}: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur interne lors de la création de la facture.")


@router.get("/{payment_id}/status", response_model=PaymentStatusResponse)
def get_payment_status(
    payment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user_dependency)
):
    """
    Vérifie et renvoie l'état actuel d'un paiement.
    
    Le frontend doit appeler cette route périodiquement (polling) après avoir affiché
    les instructions de paiement pour savoir quand la transaction est confirmée.
    """
    logger.debug(f"Vérification du statut du paiement {payment_id} pour l'utilisateur {current_user.email}.")
    
    # Récupère le paiement depuis la DB en s'assurant qu'il appartient bien à l'utilisateur courant
    db_payment = crud_payment.get_payment_by_id_and_user(db=db, payment_id=payment_id, user_id=current_user.id)

    if not db_payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paiement non trouvé ou non autorisé.")

    return PaymentStatusResponse(
        payment_id=db_payment.id,
        status=db_payment.status,
        transaction_id=db_payment.transaction_id,
        confirmations=db_payment.confirmations
    )


# --- Route de Développement Uniquement ---

@router.post("/simulate-payment/{payment_id}", 
             tags=["Development"],
             include_in_schema=settings.ENVIRONMENT != "production",
             status_code=status.HTTP_200_OK)
def simulate_payment(
    payment_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """
    [ROUTE DE DÉVELOPPEMENT] Simule un paiement complet pour une facture existante.
    
    Cette route utilise `sendtoaddress` pour envoyer le montant attendu à l'adresse de la facture,
    puis `generatetoaddress` pour miner un bloc et confirmer la transaction.
    Ceci est extrêmement utile pour tester le cycle de vie complet du paiement sans
    utiliser manuellement `bitcoin-cli`.
    """
    if settings.ENVIRONMENT == "production":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Non disponible en production.")

    logger.warning(f"--- SIMULATION DE PAIEMENT DÉCLENCHÉE pour {payment_id} ---")
    
    # La logique de simulation est aussi dans le service pour la garder propre
    try:
        result = payment_service.simulate_payment_reception(db=db, payment_id=payment_id)
        return {"message": "Simulation de paiement et de confirmation réussie!", "details": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Erreur lors de la simulation du paiement {payment_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))