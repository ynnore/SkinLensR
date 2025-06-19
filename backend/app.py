import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS # << AJOUTÉ : Pour gérer les requêtes Cross-Origin
from google.cloud import aiplatform_v1
from dotenv import load_dotenv # Utile pour le développement local

# Configure logging
logging.basicConfig(level=logging.INFO) # Mettre INFO pour la prod, DEBUG pour le dev détaillé
logger = logging.getLogger(__name__)

# Load environment variables from the .env file FOR LOCAL DEVELOPMENT.
# In Cloud Run, environment variables are set in the service configuration.
if os.path.exists(".env"):
    load_dotenv()
    logger.info(".env file loaded for local development.")
else:
    logger.info(".env file not found, relying on OS environment variables (expected in Cloud Run).")

# Log the path for GOOGLE_APPLICATION_CREDENTIALS to check if the environment variable is set (mostly for local)
# In Cloud Run, the runtime service account's credentials are used automatically.
gac_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
if gac_path:
    logger.debug(f"DEBUG_CREDENTIALS_PATH: GOOGLE_APPLICATION_CREDENTIALS='{gac_path}'")
else:
    logger.debug("DEBUG_CREDENTIALS_PATH: GOOGLE_APPLICATION_CREDENTIALS is not set (expected in Cloud Run to use runtime SA).")


app = Flask(__name__)
# --- Configuration de CORS ---
# Autoriser toutes les origines pour le moment.
# Pour la production, vous devriez spécifier les origines autorisées :
# CORS(app, resources={r"/agent/*": {"origins": ["http://localhost:3000", "https://votre-domaine-frontend.com"]}})
CORS(app)
logger.info("CORS initialized to allow all origins (for now).")

# --- Configuration for Google Cloud AI Platform (Vertex AI) ---
# GCP_PROJECT_ID: Cloud Run l'injecte souvent si le compte de service a accès au projet.
# Sinon, définissez-le dans les variables d'environnement de Cloud Run.
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "skinlens-new-test")
LOCATION = os.getenv("GCP_LOCATION", "us-central1") # Assurez-vous que c'est la bonne région pour votre modèle
MODEL_ID = os.getenv("MODEL_ID", "gemini-1.5-flash-001") # Vérifiez le nom exact du modèle, gemini-1.5-flash-001 est plus courant que -002 actuellement

# Construct the full API endpoint based on the resolved LOCATION.
API_ENDPOINT = f"{LOCATION}-aiplatform.googleapis.com"

# The model endpoint path for prediction for publisher models
MODEL_ENDPOINT_PATH = f"projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL_ID}"

# Initialize the AI Platform client.
try:
    client_options = {"api_endpoint": API_ENDPOINT}
    prediction_client = aiplatform_v1.PredictionServiceClient(client_options=client_options)
    logger.info(f"Prediction client initialized for API_ENDPOINT: {API_ENDPOINT}")
    logger.info(f"Using PROJECT_ID: {PROJECT_ID}")
    logger.info(f"Using LOCATION: {LOCATION}")
    logger.info(f"Using MODEL_ID: {MODEL_ID}")
    logger.info(f"Constructed model_endpoint_path for prediction: {MODEL_ENDPOINT_PATH}")
except Exception as e:
    logger.error(f"Failed to initialize AI Platform client: {e}")
    prediction_client = None

@app.route("/")
def home():
    """Simple home endpoint for health check."""
    return "Agent is running!", 200 # Il est bon d'inclure un code de statut HTTP

@app.route("/agent", methods=["POST"])
def agent():
    """
    Handles POST requests to the /agent endpoint.
    Expects a JSON body with a 'prompt' key.
    Calls the Google Cloud AI Platform Gemini model for a prediction.
    """
    if not request.is_json:
        logger.warning("Request content type was not JSON.")
        return jsonify({"error": "Request must be JSON"}), 415 # Unsupported Media Type

    data = request.get_json()
    prompt_content = data.get("prompt") # Renommé pour plus de clarté

    if not prompt_content:
        logger.warning("Missing 'prompt' in request body.")
        return jsonify({"error": "Missing 'prompt' in request body"}), 400 # Bad Request

    if not prediction_client:
        logger.error("AI Platform client not initialized. Cannot make prediction.")
        return jsonify({"error": "Server error: AI Platform client not ready"}), 503 # Service Unavailable

    try:
        # Construct the prediction request instances
        # Pour les modèles Gemini via PredictionServiceClient, l'input est souvent une liste d'objets JSON.
        # Le format exact peut dépendre du modèle, mais pour du texte simple, c'est souvent:
        instances = [{"content": prompt_content}]
        # Ou, si votre modèle a une signature qui attend "prompt":
        # instances = [{"prompt": prompt_content}]
        # Puisque vous avez MODEL_ID = "gemini-1.5-flash-001", [{"content": ...}] est plus standard pour l'API predict.

        # The parameters field controls the generation behavior
        parameters = {
            "candidate_count": 1,
            "max_output_tokens": 800, # Peut être 1024 ou plus selon le modèle
            "temperature": 0.7, # 0.0 pour plus déterministe, jusqu'à 1.0 pour plus créatif
            "top_p": 0.9,
            "top_k": 40
        }
        logger.debug(f"Sending prediction request to model: {MODEL_ENDPOINT_PATH} with prompt: '{prompt_content[:50]}...'")

        # Make the prediction call
        response = prediction_client.predict(
            endpoint=MODEL_ENDPOINT_PATH, # C'est le chemin complet du modèle
            instances=instances,
            parameters=parameters,
        )
        logger.debug("Received response from prediction service.")

        # Parse the prediction response
        # La réponse des modèles Gemini via predict est généralement une liste de prédictions,
        # chacune contenant un champ "content".
        if response.predictions and len(response.predictions) > 0:
            prediction_result = response.predictions[0] # C'est un struct_pb2.Value

            # Tenter d'extraire le contenu. Il est souvent dans un champ "content".
            # La structure exacte peut varier, donc un peu de robustesse est nécessaire.
            if isinstance(prediction_result, dict) and "content" in prediction_result:
                generated_text = prediction_result["content"]
            elif hasattr(prediction_result, 'string_value') and prediction_result.string_value: # Si c'est directement une string_value
                 generated_text = prediction_result.string_value
            elif hasattr(prediction_result, 'struct_value') and "content" in prediction_result.struct_value: # Si c'est un struct avec 'content'
                 generated_text = prediction_result.struct_value["content"]
            else:
                # Fallback ou log plus détaillé si la structure n'est pas celle attendue
                logger.warning(f"Unexpected prediction result structure: {type(prediction_result)} - {prediction_result}")
                generated_text = str(prediction_result) # Fallback
            
            logger.info(f"Successfully received and parsed response from Gemini.")
            return jsonify({"response": generated_text}), 200
        else:
            logger.warning(f"No predictions received from the model. Full response: {response}")
            return jsonify({"error": "No prediction available from model"}), 500

    except Exception as e:
        logger.error(f"An exception occurred during prediction: {e}", exc_info=True) # exc_info=True ajoute le traceback
        # import traceback
        # logger.error(traceback.format_exc()) # Est redondant si exc_info=True est utilisé
        return jsonify({"error": f"An error occurred during prediction: {str(e)}"}), 500

if __name__ == "__main__":
    # Ce bloc est pour le développement local. Gunicorn sera utilisé en production sur Cloud Run.
    # Cloud Run injecte la variable d'environnement PORT.
    port = int(os.environ.get("PORT", 8080))
    
    if not os.path.exists(".env") and not (os.getenv("GCP_PROJECT_ID") and os.getenv("MODEL_ID")):
        logger.warning(
            "Running locally: .env file not found and essential GCP variables (GCP_PROJECT_ID, MODEL_ID) "
            "are not set in the environment. AI Platform calls may fail."
        )
        logger.warning("Please create a .env file or set environment variables with GCP_PROJECT_ID, GCP_LOCATION, and MODEL_ID.")

    app.run(host="0.0.0.0", port=port, debug=True)