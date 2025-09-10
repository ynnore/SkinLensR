"""
Module client pour l'interaction avec le nœud Bitcoin Core via JSON-RPC.
Cette version est basée sur la librairie `python-bitcoinrpc` et conserve la structure
originale avec une initialisation globale, tout en corrigeant les implémentations
des appels RPC et en améliorant la gestion des erreurs et le logging.
"""

import bitcoinrpc
import logging
from fastapi import HTTPException, status

# --- Configuration du logger ---
# Il est préférable de configurer le logger au niveau de l'application (ex: dans main.py)
# mais on peut le récupérer ici.
logger = logging.getLogger(__name__)

# --- Configuration RPC ---
# ATTENTION : Il est fortement déconseillé de laisser ces informations en dur.
# Utilisez un système de configuration (ex: Pydantic Settings avec des variables d'environnement)
# pour charger ces valeurs de manière sécurisée.
RPC_HOST = '127.0.0.1'
RPC_PORT = 18443
RPC_USER = 'ronnys'
RPC_PASS = 'macha'

# --- Variables globales pour la connexion ---
# Note : L'utilisation de variables globales peut poser des problèmes dans des environnements
# complexes (multi-threading/processing). Pour une API FastAPI simple, c'est fonctionnel.
rpc_client = None
rpc_connection_error = None

def init_bitcoin_client():
    """
    Initialise la connexion RPC globale au nœud Bitcoin.
    Doit être appelée au démarrage de l'application FastAPI.
    """
    global rpc_client
    global rpc_connection_error
    
    logger.info(f"Tentative de connexion RPC à {RPC_HOST}:{RPC_PORT}...")
    try:
        # La librairie bitcoinrpc utilise `connect_to_remote` ou `connect_to_local`
        rpc_client = bitcoinrpc.connect_to_remote(
            user=RPC_USER,
            password=RPC_PASS,
            host=RPC_HOST,
            port=RPC_PORT
        )
        # Test rapide pour vérifier que la connexion est bien fonctionnelle
        rpc_client.getblockchaininfo() 
        logger.info("Connexion RPC Bitcoin établie avec succès.")
        rpc_connection_error = None # Réinitialiser l'erreur en cas de succès
        return True
    except Exception as e:
        rpc_connection_error = f"Impossible de se connecter au nœud Bitcoin ({RPC_HOST}:{RPC_PORT}): {e}"
        logger.critical(f"ÉCHEC DE LA CONNEXION RPC BITCOIN: {rpc_connection_error}")
        rpc_client = None # S'assurer que le client est None en cas d'échec
        return False

def get_rpc_client():
    """
    Retourne l'instance du client RPC si la connexion est active.
    Sinon, lève une HTTPException claire pour le frontend.
    """
    if rpc_client:
        return rpc_client
    else:
        # L'erreur est stockée dans la variable globale pour donner plus de contexte.
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Le service Bitcoin RPC n'est pas disponible. Détails: {rpc_connection_error}"
        )

def get_rpc_connection_error():
    """Retourne le dernier message d'erreur de connexion."""
    return rpc_connection_error

# ==============================================================================
# Fonctions Wrapper pour les commandes RPC
# ==============================================================================

def get_new_bitcoin_address(label: str = "") -> str:
    """Génère une nouvelle adresse Bitcoin (format bech32 par défaut)."""
    client = get_rpc_client()
    try:
        # Le 3ème argument "bech32" demande explicitement une adresse SegWit moderne.
        address = client.getnewaddress(label, "bech32")
        logger.info(f"Nouvelle adresse Regtest générée: {address} (Label: '{label}')")
        return address
    except Exception as e:
        logger.error(f"Erreur lors de la génération de l'adresse: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur interne lors de la génération de l'adresse Bitcoin.")

def get_received_by_address(address: str, min_confirmations: int = 1) -> float:
    """
    CORRIGÉ : Retourne le montant total reçu par une adresse gérée par le portefeuille.
    C'est la méthode correcte pour vérifier si un paiement a été crédité.
    """
    client = get_rpc_client()
    try:
        # L'appel RPC `getreceivedbyaddress` est fait pour ça.
        amount_received = client.getreceivedbyaddress(address, min_confirmations)
        logger.debug(f"Montant reçu sur {address} (minconf={min_confirmations}): {amount_received} BTC")
        return float(amount_received)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération du montant reçu pour {address}: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur lors de la vérification du paiement.")

def generate_blocks(num_blocks: int, address_to_mine_to: str):
    """
    Génère un nombre spécifié de blocs, minant la récompense vers une adresse fournie.
    Essentiel pour confirmer les transactions en mode Regtest.
    """
    client = get_rpc_client()
    if not address_to_mine_to:
        raise ValueError("Une adresse est nécessaire pour miner des blocs et recevoir la récompense.")
    try:
        # `generatetoaddress` est la commande RPC moderne pour cette tâche.
        block_hashes = client.generatetoaddress(num_blocks, address_to_mine_to)
        logger.info(f"{num_blocks} bloc(s) miné(s) avec succès vers {address_to_mine_to}.")
        return block_hashes
    except Exception as e:
        logger.error(f"Erreur lors de la génération de blocs: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur interne lors de la génération de blocs.")

def send_to_address(to_address: str, amount: float) -> str:
    """
    CORRIGÉ : Envoie une transaction depuis le portefeuille du nœud vers une adresse.
    Utile pour simuler des paiements. Le paramètre `from_address` a été retiré car il était incorrect.
    """
    client = get_rpc_client()
    try:
        # `sendtoaddress` puise dans le solde total du portefeuille.
        txid = client.sendtoaddress(to_address, amount)
        logger.info(f"Transaction envoyée à {to_address} ({amount} BTC). TXID: {txid}")
        return txid
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de la transaction: {e}", exc_info=True)
        # Tenter de fournir une erreur plus spécifique si possible.
        if "Insufficient funds" in str(e):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Fonds insuffisants dans le portefeuille du nœud pour effectuer l'envoi.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erreur interne lors de l'envoi de la transaction Bitcoin: {e}")