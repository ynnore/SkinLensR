# main.py (version corrigée)

from flask import Flask, request, jsonify
from flask_cors import CORS # N'oubliez pas CORS !
from agent import chat_with_gemma # On importe notre fonction propre
import logging

app = Flask(__name__)
CORS(app) # Très important pour que votre frontend puisse parler au backend
logging.basicConfig(level=logging.DEBUG)

@app.route("/", methods=["GET"])
def index():
    return "✅ SkinLens backend is live and ready!"

@app.route("/agent", methods=["POST"])
def ask_agent():
    data = request.get_json()
    prompt = data.get("prompt")
    
    if not prompt:
        return jsonify({"error": "Missing 'prompt' in request."}), 400
    
    try:
        # On appelle directement notre fonction
        result = chat_with_gemma(prompt)
        # On retourne le résultat dans le format attendu par le frontend
        return jsonify({'answer': result}) 
    except Exception as e:
        logging.error(f"Erreur dans la route /agent: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # On lance le serveur sur le port 8080
    app.run(debug=True, host="0.0.0.0", port=8080)
