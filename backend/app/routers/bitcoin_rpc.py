# backend/app/routers/bitcoin_rpc.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
import os

router = APIRouter(tags=["bitcoin"])

# Configuration RPC via variables d'environnement
RPC_USER = os.environ.get("BTC_RPC_USER", "ronnys")
RPC_PASSWORD = os.environ.get("BTC_RPC_PASSWORD", "macha")
RPC_HOST = os.environ.get("BTC_RPC_HOST", "192.168.0.Y")
RPC_PORT = os.environ.get("BTC_RPC_PORT", "18443")

RPC_URL = f"http://{RPC_USER}:{RPC_PASSWORD}@{RPC_HOST}:{RPC_PORT}"
client = AuthServiceProxy(RPC_URL)

# -----------------------------
# Models
# -----------------------------
class SendBTCRequest(BaseModel):
    address: str
    amount: float

# -----------------------------
# Endpoints
# -----------------------------
@router.get("/btc/info", summary="Get blockchain info")
async def get_blockchain_info():
    try:
        return client.getblockchaininfo()
    except JSONRPCException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/btc/balance", summary="Get wallet balance")
async def get_balance():
    try:
        return {"balance": client.getbalance()}
    except JSONRPCException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/btc/transactions", summary="List recent transactions")
async def list_transactions(count: int = 10):
    try:
        return client.listtransactions("*", count)
    except JSONRPCException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/btc/send", summary="Send BTC to an address")
async def send_btc(req: SendBTCRequest):
    try:
        txid = client.sendtoaddress(req.address, req.amount)
        return {"txid": txid}
    except JSONRPCException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
