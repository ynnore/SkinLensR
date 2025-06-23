# main.py - Version finale et correcte

from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import chat_with_gemma
import logging

# Initialisation de l'application Flask
app = Flask(__name__)

# Activation de CORS pour permettre les requêtes depuis d'autres origines (votre frontend)
CORS(app)

# Configuration du logging pour voir les erreurs clairement dans le terminal
logging.basicConfig(level=logging.DEBUG)


@app.route("/", methods=["GET"])
def index():
    """Route de base pour vérifier que le serveur est en ligne."""
    return "✅ SkinLens backend is live and ready!"


@app.route("/agent", methods=["POST"])
def ask_agent():
    """Route principale qui reçoit un prompt et retourne la réponse de l'agent."""
    data = request.get_json()
    
    # Vérification que le corps de la requête contient bien un 'prompt'
    if not data or not data.get("prompt"):
        return jsonify({"error": "Missing 'prompt' in request body."}), 400
    
    prompt = data.get("prompt")
    
    try:
        # Appel de la fonction logique qui interroge le modèle
        result = chat_with_gemma(prompt)
        
        # Retourne la réponse au format JSON attendu par le frontend
        return jsonify({'answer': result}) 
    
    except Exception as e:
        # En cas d'erreur dans l'agent, on log l'erreur et on renvoie une réponse 500
        logging.error(f"Error in /agent route: {e}")
        return jsonify({"error": "An internal error occurred."}), 500


if __name__ == "__main__":
    # Lance le serveur en mode debug, accessible sur le réseau local (0.0.0.0) sur le port 8080
    app.run(debug=True, host="0.0.0.0", port=8080)


