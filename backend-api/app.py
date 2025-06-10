from flask import Flask, request, jsonify
from flask_cors import CORS
import vertexai
from vertexai.generative_models import GenerativeModel, Part, HarmCategory, HarmBlockThreshold
import os
import base64
import logging

# --- Configuration du Logging (Simplifié) ---
# Dans Cloud Run, un simple print() ou logging.info() est automatiquement
# capturé et envoyé à Google Cloud Logging. C'est plus simple et robuste.
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Initialisation Vertex AI (Simplifié) ---
# Quand le code tourne sur Google Cloud (comme Cloud Run), il n'est pas nécessaire
# de spécifier le projet et la location. La librairie les trouve automatiquement.
try:
    vertexai.init()
    logging.info("Vertex AI initialisé avec succès.")
except Exception as e:
    logging.critical(f"Erreur critique lors de l'initialisation de Vertex AI : {e}", exc_info=True)
    # Si Vertex AI ne peut pas démarrer, l'application ne peut pas fonctionner.
    raise

# --- Configuration du Modèle Gemini ---
# Prendre la variable d'environnement ou une valeur par défaut
MODEL_NAME_VISION = os.environ.get("MODEL_NAME_VISION", "gemini-1.5-pro-vision")

generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 2048,
}
safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}

# Initialisation du modèle avec paramètres
try:
    generative_model = GenerativeModel(
        model_name=MODEL_NAME_VISION,
        generation_config=generation_config,
        safety_settings=safety_settings,
    )
    logging.info(f"Modèle Gemini '{MODEL_NAME_VISION}' initialisé.")
except Exception as e:
    logging.critical(f"Erreur lors de l'initialisation du modèle Gemini : {e}", exc_info=True)
    raise

# --- Disclaimer Médical ---
MEDICAL_DISCLAIMER = (
    "Rappel : SkinLensr est un outil informatif. Il ne fournit pas de diagnostic médical. "
    "Consultez un professionnel de santé pour toute question médicale."
)

# --- Application Flask ---
app = Flask(__name__)

# --- Configuration CORS (Simplifié) ---
# Active CORS pour toutes les routes et toutes les origines.
# C'est plus simple pour le développement. On peut le restreindre plus tard si besoin.
CORS(app)

# Session utilisateur (simple en mémoire - Attention: ne fonctionne qu'avec 1 instance)
user_chat_sessions = {}

def get_or_create_chat_session(user_id):
    if user_id not in user_chat_sessions:
        # On ne stocke que les 100 dernières sessions pour éviter les fuites de mémoire
        if len(user_chat_sessions) > 100:
            user_chat_sessions.pop(next(iter(user_chat_sessions)))
        user_chat_sessions[user_id] = generative_model.start_chat(history=[])
    return user_chat_sessions[user_id]

# --- Routes de l'API ---
@app.route('/')
def index():
    return jsonify({
        "status": "API is running",
        "disclaimer": MEDICAL_DISCLAIMER
    })

@app.route('/api/chat', methods=['POST'])
def chat_with_gemini():
    try:
        data = request.get_json(force=True)
        user_message = data.get("message", "").strip()
        image_data_b64 = data.get("image_b64")
        # Utiliser un header pour un ID utilisateur ou l'IP comme fallback
        user_id = request.headers.get('X-User-ID', request.remote_addr)

        if not user_message and not image_data_b64:
            return jsonify({"error": "Veuillez fournir un message ou une image."}), 400

        chat = get_or_create_chat_session(user_id)
        prompt_parts = []

        # Ajouter l'instruction système au tout début d'une nouvelle conversation
        if not chat.history:
            instruction = (
                f"Vous êtes SkinGPT, un assistant IA informatif pour les soins de la peau. "
                f"Votre but est de fournir des informations générales et éducatives. "
                f"{MEDICAL_DISCLAIMER} "
                "Vous ne devez JAMAIS fournir de diagnostic, de probabilité de maladie, ou de conseil de traitement. "
                "Si une image est fournie, décrivez-la de manière neutre et objective (ex: 'rougeur', 'tache brune', 'texture inégale') sans utiliser de terminologie médicale. "
                "Répondez toujours en rappelant de consulter un professionnel de santé."
            )
            prompt_parts.append(Part.from_text(instruction))

        if user_message:
            prompt_parts.append(Part.from_text(user_message))

        if image_data_b64:
            try:
                if ',' in image_data_b64:
                    header, encoded = image_data_b64.split(",", 1)
                    mime_type = header.split(';')[0].split(':')[1]
                else:
                    encoded = image_data_b64
                    mime_type = "image/jpeg" # On suppose JPEG par défaut
                
                image_bytes = base64.b64decode(encoded)
                image_part = Part.from_data(data=image_bytes, mime_type=mime_type)
                prompt_parts.append(image_part)
            except Exception as e:
                logging.error(f"Erreur de traitement de l'image : {e}", exc_info=True)
                # Informer l'utilisateur que l'image n'a pas pu être traitée
                return jsonify({"error": "L'image fournie est invalide ou corrompue."}), 400

        response = chat.send_message(prompt_parts)
        reply = response.text

        return jsonify({"reply": f"{reply}\n\n{MEDICAL_DISCLAIMER}"})

    except Exception as e:
        logging.error(f"Erreur serveur inattendue : {e}", exc_info=True)
        return jsonify({"error": "Une erreur interne est survenue. Notre équipe a été notifiée."}), 500

# La condition if __name__ == '__main__': n'est pas utilisée par Gunicorn,
# mais est une bonne pratique pour les tests locaux.


