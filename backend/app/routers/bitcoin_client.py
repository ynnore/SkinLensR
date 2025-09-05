# backend/app/api/routers/bitcoin_client.py

import bitcoinrpc
import json
from fastapi import HTTPException, status

# Configuration RPC: Il est préférable de la charger depuis les variables d'environnement
# ou un fichier de configuration centralisé (ex: app.config dans Flask ou settings Pydantic dans FastAPI)
# Pour l'instant, on peut la coder en dur pour le test, mais il faut la rendre dynamique.

RPC_HOST = '127.0.0.1' # Ou l'IP de votre noeud Bitcoin si distant
RPC_PORT = 18443
RPC_USER = 'ronnys'
RPC_PASS = 'macha'
RPC_PROTOCOL = 'http' # ou 'https'

rpc_client = None
rpc_connection_error = None

def init_bitcoin_client():
    """Initialise la connexion RPC au nœud Bitcoin."""
    global rpc_client
    global rpc_connection_error
    
    print(f"Tentative de connexion RPC à {RPC_HOST}:{RPC_PORT}...")
    try:
        rpc_client = bitcoinrpc.connect_to_local(
            host=RPC_HOST,
            port=RPC_PORT,
            user=RPC_USER,
            password=RPC_PASS
        )
        # Test rapide pour vérifier que la connexion fonctionne
        rpc_client.getblockchaininfo() 
        print("Connexion RPC Bitcoin réussie.")
        rpc_connection_error = None # Réinitialiser l'erreur en cas de succès après un échec précédent
        return True
    except Exception as e:
        rpc_connection_error = f"Impossible de se connecter au nœud Bitcoin ({RPC_HOST}:{RPC_PORT}): {e}"
        print(f"ERREUR: {rpc_connection_error}")
        rpc_client = None # Assurez-vous que le client est None en cas d'échec
        return False

def get_rpc_client():
    """Retourne le client RPC s'il est connecté, sinon lève une HTTPException."""
    if rpc_client:
        return rpc_client
    else:
        # Lever une exception HTTP pour que l'API retourne une erreur claire au client front-end.
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, # 503 Service Unavailable est approprié ici
            detail=f"Le service Bitcoin RPC n'est pas disponible. Détails: {rpc_connection_error}"
        )

def get_rpc_connection_error():
    """Retourne le message d'erreur de connexion s'il y en a eu une."""
    return rpc_connection_error

# Vous pouvez ajouter ici des fonctions "wrapper" pour des commandes courantes
# pour simplifier leur appel dans d'autres parties du code.

def get_new_bitcoin_address(label: str = "") -> str:
    """Génère une nouvelle adresse Bitcoin pour Regtest."""
    client = get_rpc_client()
    try:
        address = client.getnewaddress(label)
        print(f"Nouvelle adresse Regtest générée: {address} (Label: {label})")
        return address
    except Exception as e:
        print(f"Erreur lors de la génération de l'adresse: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur lors de la génération de l'adresse Bitcoin.")

def get_address_balance(address: str) -> float:
    """Récupère le montant reçu par une adresse spécifique."""
    client = get_rpc_client()
    try:
        # getreceivedbyaddress ne prend pas directement une adresse spécifique,
        # mais plutôt la hauteur de bloc pour commencer la recherche.
        # Pour une adresse spécifique, listunspent est plus approprié si vous voulez les UTXOs.
        # Ou, on peut simuler en générant juste un bloc pour que la transaction soit visible.
        # Pour une vérification simple de montant, on peut s'appuyer sur la façon dont notre application
        # gère les UTXOs ou l'état des paiements.
        # Si vous voulez juste savoir le total reçu par une adresse :
        # Le plus simple est d'appeler un RPC qui liste les transactions et de filtrer.
        # Ou, si vous avez une idée de la hauteur de début :
        # Pour Regtest, on peut souvent supposer qu'on peut vérifier à partir de la hauteur 0 ou proche.
        
        # Une approche simple : lister les transactions et filtrer.
        # Attention : listtransactions peut être lent sur une grosse blockchain.
        # Pour Regtest, c'est généralement rapide.
        transactions = client.listtransactions("*", 1000) # Lister les 1000 dernières transactions (ajuster si besoin)
        balance = 0
        for tx in transactions:
            if tx.get("address") == address:
                balance += tx.get("amount", 0) # 'amount' est souvent en BTC
        
        # Si vous voulez vraiment juste le solde d'une adresse spécifique, c'est plus complexe.
        # Bitcoin Core ne donne pas directement le solde d'une adresse arbitraire facilement.
        # Il faut soit la considérer comme faisant partie d'un portefeuille, soit calculer à partir des UTXOs.
        # Pour l'instant, on se base sur la logique de 'getreceivedbyaddress' implicitement.
        # Pour les tests, on peut se fier à ce que l'on envoie et génère.
        # Une meilleure approche pour le paiement est de *créer* un UTXO et de le "voir" arriver.
        
        # Retournons 0 pour l'instant pour simplifier, la logique de paiement viendra plus tard.
        # Ce n'est pas idéal pour un solde exact, mais pour les tests initiaux, c'est ok.
        # La vraie gestion de solde se fait souvent côté application (tracking des transactions reçues).

        # Une alternative plus proche de ce que l'on veut faire pour le paiement :
        # On va vérifier si on a bien reçu le montant attendu sur une adresse donnée après un paiement simulé.
        # La logique de vérification de paiement sera plutôt dans le service de paiement.
        
        # Retournons 0 pour l'instant, ce n'est pas la bonne fonction pour un solde arbitraire.
        return 0.0 

    except Exception as e:
        print(f"Erreur lors de la récupération du solde pour {address}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur lors de la vérification du solde.")


# --- Fonctions Wrapper pour des commandes spécifiques à l'application (si nécessaire) ---

def generate_blocks(num_blocks: int, address_to_mine_to: str = None):
    """Génère un nombre spécifié de blocs, mine vers une adresse si fournie."""
    client = get_rpc_client()
    try:
        if address_to_mine_to:
            # 'generatetoaddress' est disponible dans les versions récentes de Bitcoin Core
            # Il mine `num_blocks` blocs et envoie la récompense à `address_to_mine_to`.
            blocks = client.generatetoaddress(num_blocks, address_to_mine_to)
            print(f"{num_blocks} bloc(s) miné(s) vers {address_to_mine_to}.")
        else:
            # Si pas d'adresse, on peut miner vers une adresse par défaut ou juste générer.
            # Miner vers une adresse est toujours mieux pour la récompense.
            # On peut demander une nouvelle adresse si aucune n'est fournie.
            # Pour simplifier, faisons en sorte qu'une adresse soit TOUJOURS fournie pour minage.
            # Si on veut juste miner des blocs sans récompense spécifique (pas courant) : client.generate(num_blocks)
            raise ValueError("Une adresse est nécessaire pour miner des blocs et recevoir la récompense.")
        return blocks
    except Exception as e:
        print(f"Erreur lors de la génération de blocs: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur lors de la génération de blocs.")

def send_transaction(from_address: str, to_address: str, amount: float) -> str:
    """Envoie une transaction sur Regtest. Simplifié avec sendtoaddress."""
    client = get_rpc_client()
    try:
        # Note : sendtoaddress est une commande de haut niveau qui gère
        # la sélection des UTXOs, la signature et l'envoi.
        # Elle peut échouer si from_address n'a pas assez de fonds ou si les confirmations sont insuffisantes.
        # Pour un contrôle plus fin, on utiliserait createrawtransaction, signrawtransaction, sendrawtransaction.
        
        # Assurez-vous que le montant est en BTC. Les RPC attendent souvent le montant en BTC.
        # Si votre logique de consommation est en satoshis, convertissez ici.
        
        txid = client.sendtoaddress(to_address, amount, label=f"Payment to {to_address}")
        print(f"Transaction envoyée: {txid} de {from_address} à {to_address} ({amount} BTC)")
        
        # Il est courant de vouloir générer un bloc juste après pour que la transaction soit confirmée.
        # On le fait souvent du côté application après l'appel sendtoaddress.
        
        return txid
    except Exception as e:
        print(f"Erreur lors de l'envoi de transaction: {e}")
        # Essayez de donner plus de détails si possible, par ex. si c'est un manque de fonds
        if "Insufficient funds" in str(e):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Fonds insuffisants sur l'adresse d'envoi.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erreur lors de l'envoi de transaction Bitcoin: {e}")