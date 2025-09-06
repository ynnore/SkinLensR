import requests
import json

BASE_URL = "http://localhost:8000"

# ----------------------------------------
# 1️⃣ Tester l'API Bitcoin - Infos blockchain
# ----------------------------------------
def test_btc_info():
    url = f"{BASE_URL}/api/btc/info"
    resp = requests.get(url)
    print("=== BTC Info ===")
    print(json.dumps(resp.json(), indent=2))

# ----------------------------------------
# 2️⃣ Tester l'API Bitcoin - Balance
# ----------------------------------------
def test_btc_balance():
    url = f"{BASE_URL}/api/btc/balance"
    resp = requests.get(url)
    print("=== BTC Balance ===")
    print(json.dumps(resp.json(), indent=2))

# ----------------------------------------
# 3️⃣ Tester l'API Bitcoin - Envoi BTC
# ----------------------------------------
def test_btc_send(address="mvexampleAddress123", amount=0.001):
    url = f"{BASE_URL}/api/btc/send"
    payload = {"address": address, "amount": amount}
    resp = requests.post(url, json=payload)
    print("=== BTC Send ===")
    print(json.dumps(resp.json(), indent=2))

# ----------------------------------------
# 4️⃣ Tester RAG / Chroma
# ----------------------------------------
def test_rag(query="What is Kiwi-Ops?"):
    url = f"{BASE_URL}/scan/generate"
    payload = {"query": query}
    resp = requests.post(url, json=payload)
    print("=== RAG Search ===")
    print(json.dumps(resp.json(), indent=2))

# ----------------------------------------
# 5️⃣ Tester Hugging Face Chat
# ----------------------------------------
def test_hf_chat(prompt="Hello, how are you?"):
    url = f"{BASE_URL}/huggingface-chat"
    payload = {"prompt": prompt}
    resp = requests.post(url, json=payload)
    print("=== Hugging Face Chat ===")
    print(json.dumps(resp.json(), indent=2))

# ----------------------------------------
# Lancer tous les tests
# ----------------------------------------
if __name__ == "__main__":
    print("Testing Kiwi-Ops Backend...\n")
    test_btc_info()
    test_btc_balance()
    # Attention : envoyer du vrai BTC uniquement si tu es sûr
    # test_btc_send()
    test_rag()
    test_hf_chat()
