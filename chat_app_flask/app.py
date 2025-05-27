from flask import Flask, render_template, request, jsonify
import vertexai
from vertexai.generative_models import Content, GenerativeModel, Part, Image, HarmCategory, HarmBlockThreshold # Ajout de HarmCategory, HarmBlockThreshold
import os
from dotenv import load_dotenv # Pour charger les variables d'environnement depuis .env
import google.cloud.logging
import base64 # Pour décoder les images base64
import io     # Pour manipuler les bytes des images

# Charger les variables d'environnement du fichier .env (si présent)
# Ceci est utile pour le développement local. Sur Cloud Run, vous définirez les variables d'environnement directement.
load_dotenv()

# --- Configuration GCP ---
PROJECT_ID = os.environ.get('GCP_PROJECT_ID')
LOCATION = os.environ.get('GCP_REGION') # GCP_REGION est plus standard que GOOGLE_CLOUD_REGION

if not PROJECT_ID:
    raise ValueError("La variable d'environnement GCP_PROJECT_ID doit être définie.")
if not LOCATION:
    raise ValueError("La variable d'environnement GCP_REGION doit être définie.")

# Initialisation de Vertex AI (UNE SEULE FOIS)
try:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    print(f"Vertex AI initialisé avec succès pour projet {PROJECT_ID} et région {LOCATION}.") # Log de confirmation
except Exception as e:
    print(f"Erreur CRITIQUE lors de l'initialisation de Vertex AI: {e}")
    # Si Vertex AI ne s'initialise pas, l'application ne peut probablement pas fonctionner.
    raise # Re-lever l'exception pour arrêter l'application si c'est critique.

# Configuration du Logging Google Cloud (UNE SEULE FOIS)
logger = None # Initialiser logger à None
try:
    log_client = google.cloud.logging.Client(project=PROJECT_ID)
    log_client.setup_logging() 
    import logging
    logger = logging.getLogger(__name__) 
    logger.setLevel(logging.INFO) 
    logger.info("Logging Google Cloud configuré avec succès.")
except Exception as e:
    print(f"Erreur lors de la configuration du Logging Google Cloud: {e}")
    import logging # Assurer que logging est importé même en cas d'échec
    logger = logging.getLogger(__name__)
    logger.warning("Logging Google Cloud non configuré, utilisation du logger Python standard.")


# --- Configuration du Modèle Gemini ---
MODEL_NAME_VISION = "gemini-1.0-pro-vision-001" # Nom de modèle Vertex AI pour vision
# MODEL_NAME_TEXT = "gemini-1.5-flash-latest" # Pour texte seulement

generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 2048,
}

# === CORRECTION IMPORTANTE POUR safety_settings AVEC SDK VERTEX AI ===
correct_safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}
# =======================================================================

generative_model = None # Initialiser à None
try:
    generative_model = GenerativeModel(
        MODEL_NAME_VISION,
        generation_config=generation_config,
        safety_settings=correct_safety_settings # Utiliser la variable corrigée
    )
    logger.info(f"Modèle Gemini '{MODEL_NAME_VISION}' initialisé via Vertex AI.")
except Exception as e:
    logger.error(f"Impossible d'initialiser le modèle Gemini '{MODEL_NAME_VISION}' via Vertex AI: {e}", exc_info=True)
    # Si le modèle ne s'initialise pas, c'est une erreur critique.
    raise


# --- Disclaimer Médical ---
MEDICAL_DISCLAIMER = (
    "Rappel important : SkinLensr et son assistant IA sont des outils informationnels et ne fournissent PAS de diagnostic médical. "
    "Les informations générées sont à but éducatif général et ne remplacent en aucun cas l'avis, le diagnostic ou le traitement d'un professionnel de santé qualifié. "
    "Consultez toujours votre médecin ou un autre professionnel de la santé qualifié pour toute question que vous pourriez avoir concernant un problème de santé."
)

app = Flask(__name__)

# --- Gestion des Sessions de Chat (Simplifié, en mémoire) ---
user_chat_sessions = {} 

def get_or_create_chat_session(user_id):
    if generative_model is None: # Vérifier si le modèle a été initialisé
        logger.error("Tentative d'accès à une session de chat alors que le modèle génératif n'est pas initialisé.")
        raise RuntimeError("Le modèle génératif n'est pas disponible.")

    if user_id not in user_chat_sessions:
        logger.info(f"Création d'une nouvelle session de chat pour l'utilisateur {user_id}")
        # L'historique initial est une liste d'objets Content pour le SDK Vertex AI
        # Chaque Content a un rôle et une liste de Parts.
        # Pour le premier tour avec un modèle vision, on envoie le contexte avec la première requête utilisateur.
        user_chat_sessions[user_id] = generative_model.start_chat(history=[])
    return user_chat_sessions[user_id]

# --- Routes ---
@app.route('/')
def index():
    logger.info(f"Requête reçue pour la page d'index depuis {request.remote_addr}")
    return render_template('index.html', disclaimer=MEDICAL_DISCLAIMER)

@app.route('/chat', methods=['POST'])
def chat_with_gemini():
    if generative_model is None:
        logger.error("La route /chat a été appelée mais le modèle génératif n'est pas initialisé.")
        return jsonify({"error": "Le service IA est temporairement indisponible."}), 503

    try:
        data = request.json
        user_message_text = data.get('message')
        image_data_b64 = data.get('image_b64') 

        user_id = request.remote_addr 
        chat = get_or_create_chat_session(user_id)

        logger.info(f"Requête de chat reçue de {user_id}. Message: '{user_message_text}', Image fournie: {'Oui' if image_data_b64 else 'Non'}")

        prompt_parts_for_api = [] # Sera une liste d'objets Part ou une chaîne de caractères

        system_instruction_and_disclaimer = (
            f"Vous êtes SkinGPT, un assistant IA pour des informations générales sur les soins de la peau. "
            f"{MEDICAL_DISCLAIMER} "
            "Répondez à la question de l'utilisateur ou analysez l'image fournie de manière générale. "
            "Ne donnez jamais de diagnostic. Soyez utile et informatif dans les limites de cet avertissement. "
            "Si vous analysez une image de peau, décrivez les caractéristiques visibles (texture, couleur, etc.) sans faire de suppositions médicales."
        )
        
        current_message_content = ""
        if user_message_text:
            current_message_content = user_message_text
        
        # Pour les modèles Vertex AI, l'historique est géré par l'objet `chat`.
        # On construit le contenu du message actuel.
        # Si c'est le premier message de la session, on préfixe avec les instructions.
        if not chat.history: 
            if current_message_content:
                current_message_content = f"{system_instruction_and_disclaimer}\n\nQuestion de l'utilisateur : {current_message_content}"
            elif image_data_b64: # Image seule au début
                current_message_content = f"{system_instruction_and_disclaimer}\n\nDécrivez cette image s'il vous plaît."
        
        if current_message_content: # S'il y a du texte à envoyer
             prompt_parts_for_api.append(Part.from_text(current_message_content))

        if image_data_b64:
            try:
                if ',' in image_data_b64:
                    header, encoded = image_data_b64.split(",", 1)
                    # Extraire le mime_type du header, ex: "data:image/jpeg;base64" -> "image/jpeg"
                    mime_type_from_header = header.split(';')[0].split(':')[1] if header.startswith('data:') else "image/jpeg"
                else:
                    encoded = image_data_b64
                    mime_type_from_header = "image/jpeg" # Supposition par défaut si pas de header
                
                image_bytes = base64.b64decode(encoded)
                img_part = Part.from_data(data=image_bytes, mime_type=mime_type_from_header)
                prompt_parts_for_api.append(img_part)
                logger.info(f"Image traitée (mime-type: {mime_type_from_header}) et ajoutée au prompt.")
            except Exception as e:
                logger.error(f"Erreur lors du décodage ou de la préparation de l'image : {e}")
                prompt_parts_for_api.append(Part.from_text("(Une erreur est survenue lors du traitement de l'image jointe.)"))

        if not prompt_parts_for_api:
            logger.warning("Requête de chat vide (aucun texte ou image valide).")
            return jsonify({"error": "Aucun message ou image valide fourni."}), 400

        # Envoyer le message à Gemini
        # `prompt_parts_for_api` est maintenant une liste d'objets Part
        logger.info(f"Envoi du message à Gemini pour {user_id}...")
        response = chat.send_message(prompt_parts_for_api)
        gemini_reply = response.text
        logger.info(f"Réponse de Gemini reçue pour {user_id}: {gemini_reply[:100]}...")

        final_reply = f"{gemini_reply}\n\n{MEDICAL_DISCLAIMER}"

        return jsonify({"reply": final_reply})

    except Exception as e:
        logger.error(f"Erreur interne dans la route /chat: {e}", exc_info=True)
        return jsonify({"error": "Une erreur interne est survenue lors du traitement de votre demande."}), 500

# --- Routes pour la gestion 3D (placeholders) ---
# @app.route('/upload_and_start_3d_process', methods=['POST'])
# def upload_and_start_3d():
#     logger.info("Route /upload_and_start_3d_process appelée")
#     # ... Votre logique ...
#     return jsonify({"message": "Placeholder pour le traitement 3D"}), 202

# @app.route('/get_3d_model_details/<job_id>', methods=['GET'])
# def get_3d_model_details(job_id):
#     logger.info(f"Route /get_3d_model_details appelée pour job_id: {job_id}")
#     # ... Votre logique ...
#     return jsonify({"status": "processing", "job_id": job_id}), 202


if __name__ == '__main__':
    if logger: # Vérifier si logger est initialisé
        logger.info(f"Démarrage du serveur Flask SkinLensr sur le port {os.environ.get('PORT', 8080)}...")
    else:
        print(f"Démarrage du serveur Flask SkinLensr sur le port {os.environ.get('PORT', 8080)} (logger non initialisé)...")
        
    app.run(debug=True, port=int(os.environ.get("PORT", 8080)), host='0.0.0.0')