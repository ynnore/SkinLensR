from flask import Flask, request, jsonify
from flask_cors import CORS
import vertexai
from vertexai.generative_models import Content, GenerativeModel, Part, HarmCategory, HarmBlockThreshold
import os
from dotenv import load_dotenv
import google.cloud.logging
import base64
import logging

# Chargement de l'environnement
load_dotenv()

# --- Configuration GCP ---
PROJECT_ID = os.environ.get('GCP_PROJECT_ID')
LOCATION = os.environ.get('GCP_REGION')

if not PROJECT_ID or not LOCATION:
    raise ValueError("Les variables GCP_PROJECT_ID et GCP_REGION doivent être définies dans .env")

# Logger standard
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)

# Tentative d'activation du logging GCP
try:
    log_client = google.cloud.logging.Client(project=PROJECT_ID)
    log_client.setup_logging()
    logger.info("Google Cloud Logging activé")
except Exception as e:
    logger.warning(f"Erreur lors de l'initialisation de Google Logging : {e}")

# Initialisation Vertex AI
try:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    logger.info("Vertex AI initialisé")
except Exception as e:
    logger.critical(f"Erreur critique Vertex AI : {e}", exc_info=True)
    raise

# Nom du modèle Gemini pour la vision
MODEL_NAME_VISION = os.environ.get("MODEL_NAME_VISION", "gemini-1.5-pro-vision")  # Prendre la variable d'environnement ou valeur par défaut

# Modèle Gemini
model = GenerativeModel("gemini-1.5-pro")
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
generative_model = None
try:
    generative_model = GenerativeModel(
        model_name=MODEL_NAME_VISION,
        generation_config=generation_config,
        safety_settings=safety_settings,
    )
    logger.info(f"Modèle Gemini '{MODEL_NAME_VISION}' initialisé.")
except Exception as e:
    logger.critical(f"Erreur lors de l'initialisation du modèle Gemini : {e}", exc_info=True)
    raise

# Disclaimer médical
MEDICAL_DISCLAIMER = (
    "Rappel : SkinLensr est un outil informatif. Il ne fournit pas de diagnostic médical. "
    "Consultez un professionnel de santé pour toute question médicale."
)

# Flask App
app = Flask(__name__)

# Configuration CORS
origins_allowed = [
    "http://localhost:3000",
    "http://192.168.1.23:3000",
    "http://localhost:3001",
    "http://192.168.1.23:3001",
    "http://localhost:3002",
    "http://192.168.1.23:3002",
]
CORS(app, resources={r"/api/*": {"origins": origins_allowed}})

# Session utilisateur (simple en mémoire)
user_chat_sessions = {}

def get_or_create_chat_session(user_id):
    if user_id not in user_chat_sessions:
        user_chat_sessions[user_id] = generative_model.start_chat(history=[])
    return user_chat_sessions[user_id]

# Routes
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
        user_id = request.remote_addr

        if not user_message and not image_data_b64:
            return jsonify({"error": "Veuillez fournir un message ou une image."}), 400

        chat = get_or_create_chat_session(user_id)
        prompt_parts = []

        # Ajout de l'instruction système au tout début
        if not chat.history:
            instruction = (
                f"Vous êtes SkinGPT, un assistant IA informatif pour les soins de la peau. "
                f"{MEDICAL_DISCLAIMER} "
                "Ne donnez jamais de diagnostic. Si une image est fournie, décrivez-la sans conclusion médicale."
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
                    mime_type = "image/jpeg"
                image_bytes = base64.b64decode(encoded)
                image_part = Part.from_data(data=image_bytes, mime_type=mime_type)
                prompt_parts.append(image_part)
            except Exception as e:
                logger.error(f"Erreur de traitement image : {e}", exc_info=True)
                prompt_parts.append(Part.from_text("(Erreur lors du traitement de l'image fournie)"))

        response = chat.send_message(prompt_parts)
        reply = response.text

        return jsonify({"reply": f"{reply}\n\n{MEDICAL_DISCLAIMER}"})

    except Exception as e:
        logger.error(f"Erreur serveur : {e}", exc_info=True)
        return jsonify({"error": "Erreur serveur. Merci de réessayer plus tard."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True)


