from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
import os

RPC_USER = os.environ.get("BTC_RPC_USER", "monuser")
RPC_PASSWORD = os.environ.get("BTC_RPC_PASSWORD", "monmotdepasse")
RPC_HOST = os.environ.get("BTC_RPC_HOST", "127.0.0.1")
RPC_PORT = os.environ.get("BTC_RPC_PORT", "8332")

rpc_url = f"http://{RPC_USER}:{RPC_PASSWORD}@{RPC_HOST}:{RPC_PORT}"
bitcoin_client = AuthServiceProxy(rpc_url)

def get_blockchain_info():
    try:
        return bitcoin_client.getblockchaininfo()
    except JSONRPCException as e:
        return {"error": str(e)}
