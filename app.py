# app.py (extraits pertinents)
from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import os
from google.cloud import storage
from google.cloud import tasks_v2
from google.protobuf import timestamp_pb2
import datetime
import uuid
import json # Ajout de l'import manquant

app = Flask(__name__)

# --- Configuration Gemini (comme avant) ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") # Charger la clé API depuis les variables d'environnement
if not GEMINI_API_KEY:
    raise ValueError("La variable d'environnement GEMINI_API_KEY doit être définie.")
genai.configure(api_key=GEMINI_API_KEY)

# Configuration du modèle Gemini
generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,

    "max_output_tokens": 2048,
}
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]
model = genai.GenerativeModel(model_name="gemini-1.0-pro-vision", # ou gemini-pro-vision si vous utilisez des images
                              generation_config=generation_config,
                              safety_settings=safety_settings)

# Initialisation de la session de chat (sera spécifique à chaque utilisateur dans une application réelle)
# Pour cet exemple, nous utilisons une session globale.
chat_session = model.start_chat(history=[])

# --- Configuration GCP ---
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT")
REGION = os.getenv("GOOGLE_CLOUD_REGION", "europe-west1") # ou ta région
GCS_UPLOAD_BUCKET = os.getenv("GCS_UPLOAD_BUCKET") # ex: skinlensr-uploads
GCS_3D_MODELS_BUCKET = os.getenv("GCS_3D_MODELS_BUCKET") # ex: skinlensr-3d-models
CLOUD_TASKS_QUEUE = os.getenv("CLOUD_TASKS_QUEUE") # ex: blender-queue
CLOUD_TASKS_BLENDER_PROCESSOR_URL = os.getenv("CLOUD_TASKS_BLENDER_PROCESSOR_URL") # URL du service Cloud Run Blender

storage_client = storage.Client()
tasks_client = tasks_v2.CloudTasksClient()

# --- Disclaimer (TRÈS IMPORTANT) ---
MEDICAL_DISCLAIMER = (
    " Rappel important : SkinLensr et son assistant IA sont des outils informationnels et ne fournissent PAS de diagnostic médical. "
    "Les informations générées sont à but éducatif général et ne remplacent en aucun cas l'avis, le diagnostic ou le traitement d'un professionnel de santé qualifié. "
    "Consultez toujours votre médecin ou un autre professionnel de la santé qualifié pour toute question que vous pourriez avoir concernant un problème de santé."
)

@app.route('/')
def index():
    # Tu auras besoin d'un template HTML plus élaboré ici
    # Assurez-vous que 'skinlensr_interface.html' existe ou remplacez par 'index.html' si c'est le cas
    template_name = 'skinlensr_interface.html' # ou 'index.html'
    # Crée le dossier static et renders s'ils n'existent pas (utile pour le développement local)
    return render_template(template_name, disclaimer=MEDICAL_DISCLAIMER)

@app.route('/upload_and_start_3d_process', methods=['POST'])
def upload_and_start_3d():
    if 'image' not in request.files:
        return jsonify({"error": "Aucun fichier image"}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "Aucun fichier sélectionné"}), 400

    try:
        job_id = str(uuid.uuid4())
        filename = f"{job_id}_{file.filename}" # Nom de fichier unique

        # 1. Upload sur GCS
        bucket = storage_client.bucket(GCS_UPLOAD_BUCKET)
        blob = bucket.blob(filename)
        blob.upload_from_file(file.stream, content_type=file.content_type)
        gcs_uri = f"gs://{GCS_UPLOAD_BUCKET}/{filename}"

        # 2. Créer une tâche Cloud Tasks pour le processeur Blender
        task_parent = tasks_client.queue_path(PROJECT_ID, REGION, CLOUD_TASKS_QUEUE)
        
        task = {
            "http_request": {
                "http_method": tasks_v2.HttpMethod.POST,
                "url": CLOUD_TASKS_BLENDER_PROCESSOR_URL, # URL de ton service Cloud Run Blender
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"gcs_image_uri": gcs_uri, "job_id": job_id}).encode()
            }
        }
        # Si ton service Blender a besoin de plus de temps que le timeout par défaut de la tâche:
        # task["dispatch_deadline"] = {"seconds": 1800} # exemple: 30 minutes

        created_task = tasks_client.create_task(parent=task_parent, task=task)
        
        return jsonify({
            "message": "Image uploadée, traitement 3D démarré.",
            "job_id": job_id,
            "gcs_image_uri_for_chat": gcs_uri # Pour que le chat puisse y faire référence si besoin
        }), 202

    except Exception as e:
        app.logger.error(f"Erreur lors de l'upload ou du démarrage du job: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat_with_gemini():
    try:
        user_message_text = request.json.get('message')
        image_data_b64 = request.json.get('image_b64') # Optionnel: si on renvoie une image pour analyse

        prompt_parts = []
        if user_message_text:
            prompt_parts.append(user_message_text)
        
        if image_data_b64:
            try:
                # Décoder l'image si elle est envoyée en base64 (par exemple, l'image 2D originale)
                # Ceci est un exemple, adaptez selon comment vous envoyez l'image depuis le frontend
                import base64
                from PIL import Image
                import io
                image_bytes = base64.b64decode(image_data_b64)
                img = Image.open(io.BytesIO(image_bytes))
                prompt_parts.append(img)
            except Exception as e:
                app.logger.warning(f"Impossible de traiter l'image b64 pour le chat: {e}")


        if not prompt_parts:
            return jsonify({"error": "Aucun message ou image fourni pour le chat"}), 400

        # Gestion de l'historique de la session de chat (chat_session)
        # IMPORTANT: Inclure le disclaimer dans la logique de Gemini ou l'ajouter systématiquement
        # On peut préfixer le message utilisateur avec des instructions pour Gemini
        # ou ajouter le disclaimer à la réponse.
        
        # Exemple de prompt pour guider Gemini et inclure le disclaimer (à affiner)
        system_instruction = (
            f"{MEDICAL_DISCLAIMER} "
            "Répondez à la question de l'utilisateur ou analysez l'image fournie. "
            "Si une image est fournie, décrivez ce que vous observez de manière générale. "
            "Ne donnez jamais de diagnostic. Soyez utile et informatif dans les limites de cet avertissement."
        )

        # Intégration du system_instruction et de l'historique
        # Si c'est le début de la session ou si vous voulez le réinjecter
        # Note: `chat_session.history` est modifié par `send_message`.
        # Pour une gestion plus fine, vous pourriez construire la liste de messages manuellement.
        current_prompt = []
        if not chat_session.history: # Ou une autre logique pour déterminer si c'est le début
            # Pour la vision, le rôle système n'est pas explicitement géré comme pour les modèles de texte pur.
            # L'instruction est généralement donnée avec la première requête utilisateur.
            # On peut préfixer le message utilisateur avec l'instruction système.
            if user_message_text:
                 prompt_parts[0] = f"{system_instruction}\n\nUtilisateur: {user_message_text}"

        # Simplifié : on envoie les prompt_parts. Le disclaimer doit être géré.
        # Une bonne pratique est de mettre le system_instruction dans l'historique initial de `start_chat`
        # ou de l'ajouter en post-traitement à la réponse.

        response = chat_session.send_message(prompt_parts)
        gemini_reply = response.text

        # S'assurer que le disclaimer est présent. Si Gemini ne l'inclut pas toujours, ajoutez-le :
        final_reply = f"{gemini_reply}\n\n{MEDICAL_DISCLAIMER}"

        return jsonify({"reply": final_reply})

    except Exception as e:
        app.logger.error(f"Erreur lors de l'appel à l'API Gemini: {e}")
        # Ne pas exposer les détails de l'erreur interne à l'utilisateur
        return jsonify({"error": "Une erreur est survenue lors du traitement de votre demande avec l'assistant IA."}), 500


@app.route('/get_3d_model_details/<job_id>', methods=['GET'])
def get_3d_model_details(job_id):
    try:
        # Vérifier si le modèle 3D existe dans GCS
        # Le nom du fichier 3D pourrait être conventionnel, ex: {job_id}.glb
        model_filename_3d = f"{job_id}.glb" # ou autre extension
        bucket_3d = storage_client.bucket(GCS_3D_MODELS_BUCKET)
        blob_3d = bucket_3d.blob(model_filename_3d)

        if blob_3d.exists():
            # Générer une URL signée pour un accès temporaire sécurisé au fichier
            signed_url = blob_3d.generate_signed_url(
                version="v4",
                expiration=datetime.timedelta(minutes=15), # L'URL expire après 15 minutes
                method="GET",
            )
            return jsonify({
                "status": "completed",
                "model_url": signed_url,
                "filename": model_filename_3d
            })
        else:
            # Vérifier si l'image originale existe toujours (pour confirmer que le job_id est valide)
            # On pourrait avoir une logique plus fine avec une base de données (Firestore) pour le statut des jobs
            original_image_blob_name_pattern = f"{job_id}_" # Les images originales ont été nommées job_id_nomoriginal.png
            
            # Cela suppose que vous connaissez ou pouvez déduire le nom complet du fichier original.
            # Il serait mieux de stocker le nom du fichier original ou d'utiliser une base de données de suivi des jobs.
            # Pour l'instant, on va juste dire "en cours" si le modèle n'est pas là.
            # Une meilleure solution serait d'avoir le service Blender qui met à jour un statut dans Firestore.
            
            return jsonify({"status": "processing"}), 202 # Ou 404 si le job_id est inconnu

    except Exception as e:
        app.logger.error(f"Erreur lors de la vérification du statut du modèle 3D: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Créer les dossiers static et renders s'ils n'existent pas (utile pour le développement local)
    # Cela peut être fait une seule fois au démarrage de l'application.
    static_dir = os.path.join(os.path.dirname(__file__), "static")
    renders_dir = os.path.join(static_dir, "renders")
    os.makedirs(static_dir, exist_ok=True)
    os.makedirs(renders_dir, exist_ok=True)

    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))