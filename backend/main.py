# main.py
from flask import Flask, request, jsonify
from agent import chat_agent
import logging

app = Flask(__name__)

# Logger Flask (utile si tu veux voir les requêtes HTTP aussi)
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
    
    if not chat_agent:
        return jsonify({"error": "Agent not available"}), 500

    try:
        result = chat_agent.run(prompt)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)
