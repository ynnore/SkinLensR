import os
from dotenv import load_dotenv
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException

load_dotenv() # Charge les variables d'environnement du fichier .env

# Récupérer les informations RPC depuis les variables d'environnement
RPC_USER = os.getenv("BITCOIN_RPC_USER", "your_rpc_username")
RPC_PASSWORD = os.getenv("BITCOIN_RPC_PASSWORD", "your_rpc_password")
RPC_HOST = os.getenv("BITCOIN_RPC_HOST", "127.0.0.1")
RPC_PORT = os.getenv("BITCOIN_REGTEST_PORT", "18443")
RPC_CONNECTION_STRING = f"http://{RPC_USER}:{RPC_PASSWORD}@{RPC_HOST}:{RPC_PORT}"

def get_rpc_connection():
    """Retourne un objet de connexion RPC à Bitcoin Core Regtest."""
    try:
        return AuthServiceProxy(RPC_CONNECTION_STRING)
    except Exception as e:
        print(f"Erreur lors de l'établissement de la connexion RPC : {e}")
        raise

def mine_blocks(rpc_connection, num_blocks):
    """Mine des blocs sur le réseau Regtest."""
    try:
        address = rpc_connection.getnewaddress()
        block_hashes = rpc_connection.generatetoaddress(num_blocks, address)
        return block_hashes
    except JSONRPCException as e:
        print(f"Erreur RPC lors du minage : {e}")
        raise
    except Exception as e:
        print(f"Erreur inattendue lors du minage : {e}")
        raise

def ensure_funds(rpc_connection, min_balance_btc=0.0001):
    """S'assure que le wallet Regtest a des fonds suffisants."""
    try:
        info = rpc_connection.getblockchaininfo()
        if info['blocks'] < 101:
            print(f"Moins de 101 blocs sur Regtest ({info['blocks']}). Minage de blocs initiaux...")
            mine_blocks(rpc_connection, 101 - info['blocks'] + 1)
            print("Nœud Regtest prêt avec suffisamment de blocs.")
        else:
            print("Nœud Regtest déjà prêt avec suffisamment de blocs.")

        balance = rpc_connection.getbalance()
        if balance < min_balance_btc:
            print(f"Balance insuffisante ({balance} BTC). Minage de blocs supplémentaires pour atteindre {min_balance_btc} BTC...")
            # Mine 10 blocs supplémentaires pour accumuler des récompenses
            mine_blocks(rpc_connection, 10)
            # Attend que les nouvelles récompenses soient dépensables (pas auto-confirmé ici, besoin de 100 blocs après le minage pour le déblocage)
            # En Regtest, la transaction de coinbase est déblocable après 100 confirmations
            # Si vous minez 101 blocs, le premier est dépensable. Si vous minez 10 de plus, vous avez de nouveaux BTC.
            mine_blocks(rpc_connection, 100) # Pour que les nouvelles coinbase mûrissent
            new_balance = rpc_connection.getbalance()
            print(f"Nouvelle balance après minage supplémentaire : {new_balance} BTC")
            if new_balance < min_balance_btc:
                print("Attention: La balance reste insuffisante même après minage supplémentaire.")
                return False
        return True
    except JSONRPCException as e:
        print(f"Erreur RPC lors de la vérification des fonds : {e}")
        raise
    except Exception as e:
        print(f"Erreur inattendue lors de la vérification des fonds : {e}")
        raise


def create_and_send_accreditation_transaction(rpc_connection, memo_data):
    """
    Crée et envoie une transaction OP_RETURN avec les données d'accréditation.
    Envoie une petite quantité de BTC à une adresse du wallet pour rendre la transaction valide.
    """
    try:
        # Assurez-vous d'avoir des fonds
        if not ensure_funds(rpc_connection, min_balance_btc=0.00001):
            raise Exception("Fonds insuffisants dans le wallet Regtest pour créer une transaction.")

        # Récupérer une adresse du wallet pour l'output de la transaction
        # Ceci est nécessaire pour que la transaction soit valide (OP_RETURN seul n'est pas permis)
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
        mine_blocks(rpc_connection, 1) # Miner un bloc pour confirmer la transaction
        return txid

    except JSONRPCException as e:
        print(f"Erreur RPC lors de la création/envoi de transaction : {e}")
        raise
    except Exception as e:
        print(f"Erreur inattendue : {e}")
        raise

if __name__ == "__main__":
    # Ce bloc s'exécutera si vous lancez ce fichier directement
    print("Test du client Regtest...")
    try:
        rpc = get_rpc_connection()
        print("Connexion RPC établie.")

        # S'assurer que le wallet a des fonds au démarrage
        ensure_funds(rpc)

        # Exemple d'enregistrement d'une accréditation
        test_memo = "TestAccreditation-KiwiOps-DEMO-12345"
        txid = create_and_send_accreditation_transaction(rpc, test_memo)
        if txid:
            print(f"Accréditation de test envoyée avec succès. TXID: {txid}")
        else:
            print("Échec de l'envoi de l'accréditation de test.")

    except Exception as e:
        print(f"Échec du test du client Regtest : {e}")