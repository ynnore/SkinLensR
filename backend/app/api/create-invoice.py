# C:\Users\Ronny\kiwi-ops\SkinLensR\backend\app\api\create-invoice.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware # Important pour la communication inter-domaines
from pydantic import BaseModel
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
from datetime import datetime

# --- CONFIGURATION ---
app = FastAPI()

# IMPORTANT: Ajoutez ce middleware pour permettre à votre frontend (ex: localhost:3000)
# de communiquer avec votre backend (ex: localhost:8000)
origins = [
    "http://localhost",
    "http://localhost:3000", # L'adresse de votre frontend Next.js
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MODIFIEZ CECI avec vos propres identifiants de bitcoin.conf
RPC_USER = "your_rpc_user"       # <--- REMPLACEZ
RPC_PASSWORD = "your_rpc_password" # <--- REMPLACEZ
RPC_HOST = "127.0.0.1"
RPC_PORT = 18443

PLAN_PRICES = {
    "team_ops": 0.005,
    "hq_ops": 0.012,
}

class InvoiceRequest(BaseModel):
    plan: str

# --- ENDPOINT 1 : Obtenir les détails du plan (Pro Forma) ---
@app.get("/api/plan-details/{plan_name}")
async def get_plan_details(plan_name: str):
    if plan_name not in PLAN_PRICES:
        raise HTTPException(status_code=404, detail="Plan non trouvé.")
    
    amount_btc = PLAN_PRICES[plan_name]
    
    return {
        "plan": plan_name,
        "amount_btc": amount_btc,
        "description": f"Accreditation Protocol: {plan_name.replace('_', ' ').upper()}"
    }

# --- ENDPOINT 2 : Créer la facture Bitcoin ---
@app.post("/api/create-invoice")
async def create_invoice(request: InvoiceRequest):
    plan = request.plan
    if plan not in PLAN_PRICES:
        raise HTTPException(status_code=400, detail=f"Plan '{plan}' invalide.")
    
    try:
        rpc_url = f"http://{RPC_USER}:{RPC_PASSWORD}@{RPC_HOST}:{RPC_PORT}"
        rpc_connection = AuthServiceProxy(rpc_url)
        rpc_connection.getblockchaininfo() # Vérifie la connexion
        
        amount = PLAN_PRICES[plan]
        label = f"invoice_{plan}_user_{datetime.utcnow().timestamp()}"
        
        # Génère une adresse au format moderne bech32
        address = rpc_connection.getnewaddress(label, "bech32")

        print(f"Facture créée pour le plan '{plan}': montant={amount} BTC, adresse={address}")

        payment_uri = f"bitcoin:{address}?amount={amount}&label={label}"

        return {
            "address": address,
            "amount": amount,
            "paymentUri": payment_uri
        }
    except JSONRPCException as e:
        print(f"Erreur JSON-RPC de Bitcoin Core: {e}")
        raise HTTPException(status_code=500, detail="Erreur de communication avec le noeud Bitcoin.")
    except Exception as e:
        print(f"Erreur générale de connexion: {e}")
        raise HTTPException(status_code=500, detail="Impossible de se connecter au service de paiement.")

# Permet de lancer le serveur directement pour le développement
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("create-invoice:app", host="127.0.0.1", port=8000, reload=True)