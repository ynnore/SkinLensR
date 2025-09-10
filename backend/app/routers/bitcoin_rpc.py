# backend/app/routers/bitcoin_rpc.py

import os
import hashlib
import logging
from typing import Any, Dict, List
from contextlib import asynccontextmanager

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool # Pour les appels RPC synchrones

# Configure le logger pour ce module
logger = logging.getLogger("kiwi-ops.bitcoin_rpc")

router = APIRouter(tags=["bitcoin"])

# --- Configuration RPC (utiliser les variables d'environnement déjà définies) ---
# Note: J'ai renommé les variables pour être plus cohérent avec mes exemples précédents (BITCOIN_ au lieu de BTC_)
# Assurez-vous que votre fichier .env utilise BITCOIN_RPC_USER, BITCOIN_RPC_PASSWORD, etc.
# Si vous préférez garder BTC_RPC_USER, ajustez ici.
RPC_USER = os.environ.get("BITCOIN_RPC_USER", "ronnys")
RPC_PASSWORD = os.environ.get("BITCOIN_RPC_PASSWORD", "macha")
# Pour Regtest, il est fortement recommandé d'utiliser localhost (127.0.0.1)
RPC_HOST = os.environ.get("BITCOIN_RPC_HOST", "127.0.0.1")
RPC_PORT = os.environ.get("BITCOIN_REGTEST_PORT", "18443") # Port par défaut Regtest

RPC_URL = f"http://{RPC_USER}:{RPC_PASSWORD}@{RPC_HOST}:{RPC_PORT}"

# --- Fonctions d'interaction RPC (déplacées ici ou importées de app.regtest_client) ---
# Si vous avez un fichier `app/regtest_client.py`, importez ces fonctions de là.
# Sinon, placez-les directement ici. Pour cet exemple, je les inclurai ici.

from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException

def get_rpc_connection():
    """Retourne un objet de connexion RPC à Bitcoin Core Regtest."""
    try:
        return AuthServiceProxy(RPC_URL)
    except Exception as e:
        logger.error(f"Erreur lors de l'établissement de la connexion RPC vers {RPC_URL}: {e}")
        raise

def _mine_blocks_sync(rpc_connection, num_blocks):
    """Fonction synchrone pour miner des blocs."""
    address = rpc_connection.getnewaddress()
    block_hashes = rpc_connection.generatetoaddress(num_blocks, address)
    return block_hashes

async def mine_blocks(rpc_connection, num_blocks):
    """Fonction asynchrone pour miner des blocs, exécutée dans un threadpool."""
    return await run_in_threadpool(_mine_blocks_sync, rpc_connection, num_blocks)

def _ensure_funds_sync(rpc_connection, min_balance_btc):
    """Fonction synchrone pour s'assurer que le wallet Regtest a des fonds."""
    info = rpc_connection.getblockchaininfo()
    if info['blocks'] < 101:
        logger.info(f"Moins de 101 blocs sur Regtest ({info['blocks']}). Minage de blocs initiaux...")
        _mine_blocks_sync(rpc_connection, 101 - info['blocks'] + 1)
        logger.info("Nœud Regtest prêt avec suffisamment de blocs.")
    else:
        logger.info("Nœud Regtest déjà prêt avec suffisamment de blocs.")

    balance = rpc_connection.getbalance()
    if balance < min_balance_btc:
        logger.info(f"Balance insuffisante ({balance} BTC). Minage de blocs supplémentaires pour atteindre {min_balance_btc} BTC...")
        _mine_blocks_sync(rpc_connection, 10) # Miner 10 blocs
        _mine_blocks_sync(rpc_connection, 100) # Attendre que les coinbase mûrissent
        new_balance = rpc_connection.getbalance()
        logger.info(f"Nouvelle balance après minage supplémentaire : {new_balance} BTC")
        if new_balance < min_balance_btc:
            logger.warning("Attention: La balance reste insuffisante même après minage supplémentaire.")
            return False
    return True

async def ensure_funds(rpc_connection, min_balance_btc=0.00001):
    """Fonction asynchrone pour s'assurer que le wallet Regtest a des fonds, exécutée dans un threadpool."""
    return await run_in_threadpool(_ensure_funds_sync, rpc_connection, min_balance_btc)


def _create_and_send_accreditation_transaction_sync(rpc_connection, memo_data):
    """Fonction synchrone pour créer et envoyer une transaction OP_RETURN."""
    # Récupérer une adresse du wallet pour l'output de la transaction
    wallet_address = rpc_connection.getnewaddress()

    # Convertir la chaîne en hexadécimal pour OP_RETURN
    hex_data = memo_data.encode('utf-8').hex()

    # Créer les outputs : un petit montant à une adresse du wallet, et l'OP_RETURN
    outputs = {
        wallet_address: 0.00001,  # 1000 satoshis envoyés à nous-mêmes
        "data": hex_data
    }

    raw_transaction = rpc_connection.createrawtransaction([], outputs)
    funded_transaction = rpc_connection.fundrawtransaction(raw_transaction, {'feeRate': 100})
    signed_transaction = rpc_connection.signrawtransactionwithwallet(funded_transaction['hex'])

    if not signed_transaction['complete']:
        raise Exception("La transaction n'a pas pu être signée complètement.")

    txid = rpc_connection.sendrawtransaction(signed_transaction['hex'])
    _mine_blocks_sync(rpc_connection, 1) # Miner un bloc pour confirmer la transaction
    return txid

async def create_and_send_accreditation_transaction(rpc_connection, memo_data):
    """Fonction asynchrone pour créer et envoyer une transaction OP_RETURN, exécutée dans un threadpool."""
    return await run_in_threadpool(_create_and_send_accreditation_transaction_sync, rpc_connection, memo_data)


# --- Startup Event pour le Routeur Bitcoin ---
@router.on_event("startup")
async def startup_bitcoin_rpc():
    """S'assure que le nœud Regtest a des fonds au démarrage du routeur."""
    logger.info("Bitcoin RPC router starting up. Checking Regtest node status.")
    try:
        rpc = get_rpc_connection()
        await ensure_funds(rpc)
        logger.info("Regtest node confirmed ready with sufficient funds.")
    except Exception as e:
        logger.error(f"FATAL: Could not connect to Regtest node or ensure funds: {e}")
        # En développement, on log l'erreur. En prod, on pourrait vouloir échouer le démarrage ou avoir un mécanisme de retry.


# -----------------------------
# Models
# -----------------------------
class SendBTCRequest(BaseModel):
    address: str
    amount: float

class AccreditationRequest(BaseModel):
    nomPorteur: str
    numeroCarte: str
    dateExpiration: str
    cvv: str

# -----------------------------
# Endpoints existants + nouveaux pour Regtest
# -----------------------------

@router.get("/btc/info", summary="Get blockchain info")
async def get_blockchain_info():
    try:
        rpc = get_rpc_connection()
        return await run_in_threadpool(rpc.getblockchaininfo)
    except JSONRPCException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne lors de la récupération des infos blockchain: {str(e)}")

@router.get("/btc/balance", summary="Get wallet balance")
async def get_balance():
    try:
        rpc = get_rpc_connection()
        balance = await run_in_threadpool(rpc.getbalance)
        return {"balance": balance}
    except JSONRPCException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne lors de la récupération du solde: {str(e)}")

@router.get("/btc/transactions", summary="List recent transactions")
async def list_transactions(count: int = 10):
    try:
        rpc = get_rpc_connection()
        transactions = await run_in_threadpool(rpc.listtransactions, "*", count)
        return transactions
    except JSONRPCException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne lors de la liste des transactions: {str(e)}")

@router.post("/btc/send", summary="Send BTC to an address")
async def send_btc(req: SendBTCRequest):
    try:
        rpc = get_rpc_connection()
        txid = await run_in_threadpool(rpc.sendtoaddress, req.address, req.amount)
        return {"txid": txid}
    except JSONRPCException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne lors de l'envoi de BTC: {str(e)}")


# --- NOUVEL ENDPOINT D'ACCRÉDITATION ---
@router.post("/accredit")
async def handle_accreditation_request(request_data: AccreditationRequest):
    """
    Gère la demande d'accréditation en l'enregistrant sur la blockchain Regtest.
    """
    logger.info("Received accreditation request.")

    accreditation_hash = hashlib.sha256(
        f"{request_data.nomPorteur}-{request_data.dateExpiration}-{request_data.numeroCarte[-4:]}"
        .encode()
    ).hexdigest()

    memo_data = f"KiwiOps-Accreditation-ID:{accreditation_hash}"
    logger.info(f"Generated accreditation hash: {accreditation_hash}. Memo data for blockchain: {memo_data}")

    try:
        rpc = get_rpc_connection()
        # S'assurer des fonds avant de tenter la transaction (peut déjà être fait au démarrage)
        await ensure_funds(rpc, min_balance_btc=0.00001) # Vérifie si on a au moins 1000 satoshis

        txid = await create_and_send_accreditation_transaction(rpc, memo_data)
        
        if txid:
            logger.info(f"Accreditation '{accreditation_hash}' successfully recorded on Regtest with TXID: {txid}")
            return {
                "message": "Transaction File Received. Processing in progress via Beta Protocol.",
                "accreditationId": accreditation_hash,
                "txid": txid
            }
        else:
            raise HTTPException(status_code=500, detail="Échec de l'enregistrement de l'accréditation sur la blockchain.")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing accreditation request for {accreditation_hash}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erreur de blockchain : {str(e)}")

# --- NOUVEL ENDPOINT POUR LE MINAGE MANUEL (utile pour le débogage Regtest) ---
@router.post("/regtest/mine/{num_blocks}", summary="Mine blocks on Regtest")
async def mine_regtest_blocks(num_blocks: int):
    """Mine un nombre spécifié de blocs sur le réseau Regtest."""
    if num_blocks <= 0:
        raise HTTPException(status_code=400, detail="Le nombre de blocs doit être positif.")
    try:
        rpc = get_rpc_connection()
        block_hashes = await mine_blocks(rpc, num_blocks)
        return {"message": f"Miné {len(block_hashes)} blocs sur Regtest.", "block_hashes": block_hashes}
    except Exception as e:
        logger.error(f"Error mining blocks: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erreur lors du minage de blocs : {str(e)}")

# --- NOUVEL ENDPOINT POUR LES INFORMATIONS REGTEST ---
@router.get("/regtest/info", summary="Get Regtest blockchain and wallet info")
async def get_regtest_info():
    """Retourne les informations de la blockchain Regtest et du portefeuille."""
    try:
        rpc = get_rpc_connection()
        blockchain_info = await run_in_threadpool(rpc.getblockchaininfo)
        wallet_balance = await run_in_threadpool(rpc.getbalance)
        return {"blockchain_info": blockchain_info, "wallet_balance_btc": wallet_balance}
    except Exception as e:
        logger.error(f"Error getting regtest info: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des infos Regtest : {str(e)}")