# backend-flask/app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

# Importations pour les services Google Cloud et Gemini
import google.generativeai as genai
import os
from google.cloud import storage
from google.cloud import tasks_v2
from google.protobuf import timestamp_pb2 # Nécessaire si on utilise timestamp_pb2.Timestamp() pour les tâches
import datetime
import uuid
import json
from dotenv import load_dotenv

# Charge les variables d'environnement depuis le fichier .env
load_dotenv()

app = Flask(__name__)

# --- Configuration Flask Globale ---
app.config['SECRET_KEY'] = os.getenv("FLASK_SECRET_KEY", 'YOUR_SUPER_SECRET_KEY_REPLACE_ME_SAFELY_FLASK')
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", 'ANOTHER_SUPER_SECRET_JWT_KEY_REPLACE_ME_SAFELY_JWT')

# --- Configuration CORS ---
# ATTENTION: "*" est pour le développement. En production, remplacez par l'URL de votre frontend Cloud Run.
CORS(app, supports_credentials=True) # supports_credentials=True est important pour les cookies/headers d'authentification

# --- Initialisation des Extensions ---
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True) # Ajuste cors_allowed_origins en production

# --- Configuration Gemini ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
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
# Utilise gemini-pro-vision si l'IA doit analyser des images via le chat
# ou gemini-pro si c'est juste pour le texte.
gemini_model = genai.GenerativeModel(model_name="gemini-pro-vision",
                                   generation_config=generation_config,
                                   safety_settings=safety_settings)

# --- Configuration GCP ---
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT")
REGION = os.getenv("GOOGLE_CLOUD_REGION", "europe-west1")
GCS_UPLOAD_BUCKET = os.getenv("GCS_UPLOAD_BUCKET") # ex: skinlensr-uploads
GCS_3D_MODELS_BUCKET = os.getenv("GCS_3D_MODELS_BUCKET") # ex: skinlensr-3d-models
CLOUD_TASKS_QUEUE_NAME = os.getenv("CLOUD_TASKS_QUEUE") # ex: blender-queue
CLOUD_TASKS_BLENDER_PROCESSOR_URL = os.getenv("CLOUD_TASKS_BLENDER_PROCESSOR_URL") # URL du service Cloud Run Blender

storage_client = storage.Client()
tasks_client = tasks_v2.CloudTasksClient()

# --- Disclaimer (TRÈS IMPORTANT) ---
MEDICAL_DISCLAIMER = (
    "Rappel important : SkinLensr et son assistant IA sont des outils informationnels et ne fournissent PAS de diagnostic médical. "
    "Les informations générées sont à but éducatif général et ne remplacent en aucun cas l'avis, le diagnostic ou le traitement d'un professionnel de santé qualifié. "
    "Consultez toujours votre médecin ou un autre professionnel de la santé qualifié pour toute question que vous pourriez avoir concernant un problème de santé."
)

# --- Base de Données Simples (À REMPLACER PAR Cloud SQL + SQLAlchemy ou équivalent) ---
# Ceci est pour l'exemple uniquement. En production, utilisez une vraie DB.
users_db = {} # email: {password_hash, name, profile_picture_url}
# Pour l'historique de chat par utilisateur
user_chat_histories = {} # user_email: [{"role": "user", "parts": ["message"]}, {"role": "model", "parts": ["reply"]}]

# --- ROUTE D'INSCRIPTION (Register) ---
@app.route('/api/register', methods=['POST'])
def register():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    name = request.json.get('name', 'Utilisateur')

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    if email in users_db:
        return jsonify({"msg": "Email already registered"}), 409

    hashed_password = generate_password_hash(password)
    users_db[email] = {
        "password_hash": hashed_password,
        "name": name,
        "profile_picture_url": "/default-avatar.png"
    }
    user_chat_histories[email] = [] # Initialise l'historique du chat pour le nouvel utilisateur

    # En production, tu sauvegarderais ça dans Cloud SQL ici

    return jsonify({"msg": "User registered successfully", "email": email}), 201

# --- ROUTE DE CONNEXION (Login) ---
@app.route('/api/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    user = users_db.get(email)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token, user_email=email, user_name=user["name"]), 200

# --- ROUTE DE PROFIL (Protégée) ---
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_email = get_jwt_identity()
    user_info = users_db.get(current_user_email)

    if not user_info:
        return jsonify({"msg": "User not found"}), 404

    profile_pic_url = user_info["profile_picture_url"]
    # Si le profil pic est un chemin relatif, le rendre absolu pour le frontend
    # En production, cela sera l'URL publique de Cloud Storage.
    if profile_pic_url.startswith('/'):
        # Ceci est un placeholder pour le développement local. En production, utilise l'URL GCS.
        # Exemple: profile_pic_url = f"https://storage.googleapis.com/{GCS_3D_MODELS_BUCKET}/{profile_pic_url.split('/')[-1]}"
        profile_pic_url = f"http://localhost:5000{profile_pic_url}" # Pour développement local

    return jsonify(
        email=current_user_email,
        name=user_info["name"],
        profile_picture_url=profile_pic_url
    ), 200

# --- ROUTE PROTÉGÉE GÉNÉRIQUE ---
@app.route('/api/protected_resource', methods=['GET'])
@jwt_required()
def protected_resource():
    current_user_email = get_jwt_identity()
    return jsonify(logged_in_as=current_user_email, message="Ceci est une ressource protégée."), 200

# --- ROUTE POUR DÉFINIR LA PHOTO DE PROFIL ---
@app.route('/api/user/set-profile-picture', methods=['POST'])
@jwt_required()
def set_profile_picture():
    current_user_email = get_jwt_identity()
    data = request.get_json()
    render_url = data.get('renderUrl')

    if not render_url:
        return jsonify({"error": "Render URL is required"}), 400

    # Valider l'URL pour la sécurité (ex: doit être une URL GCS de tes buckets)
    # Pour l'exemple, on suppose que l'URL est valide ou vient de nos rendus 3D
    # En production, vérifier si l'URL vient bien de GCS_3D_MODELS_BUCKET par exemple
    if not users_db.get(current_user_email):
        return jsonify({"error": "User not found"}), 404

    users_db[current_user_email]["profile_picture_url"] = render_url
    return jsonify({"status": "Profile picture updated successfully", "newProfilePicUrl": render_url}), 200

# --- ROUTE POUR L'UPLOAD ET LE DÉMARRAGE DU PROCESSUS 3D ---
@app.route('/api/render-skin', methods=['POST'])
@jwt_required() # Cette route est maintenant protégée
def render_skin():
    current_user_email = get_jwt_identity()
    if 'image' not in request.files:
        return jsonify({"error": "Aucun fichier image"}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "Aucun fichier sélectionné"}), 400

    try:
        # job_id devrait être lié à l'utilisateur pour le suivi de ses analyses
        job_id = f"{current_user_email}_{str(uuid.uuid4())}"
        filename = f"{job_id}_{file.filename}"

        # 1. Upload sur GCS
        bucket = storage_client.bucket(GCS_UPLOAD_BUCKET)
        blob = bucket.blob(filename)
        blob.upload_from_file(file.stream, content_type=file.content_type)
        gcs_uri = f"gs://{GCS_UPLOAD_BUCKET}/{filename}"

        # 2. Créer une tâche Cloud Tasks pour le processeur Blender
        task_parent = tasks_client.queue_path(PROJECT_ID, REGION, CLOUD_TASKS_QUEUE_NAME)
       
        task_payload = {
            "gcs_image_uri": gcs_uri,
            "job_id": job_id,
            "user_email": current_user_email # Pour que le processeur Blender puisse attribuer le résultat
        }

        task = {
            "http_request": {
                "http_method": tasks_v2.HttpMethod.POST,
                "url": CLOUD_TASKS_BLENDER_PROCESSOR_URL,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps(task_payload).encode()
            }
        }
       
        # Pour une exécution asynchrone, la réponse est rapide.
        created_task = tasks_client.create_task(parent=task_parent, task=task)
       
        return jsonify({
            "message": "Image uploadée, traitement 3D démarré.",
            "job_id": job_id,
            "gcs_image_uri": gcs_uri # Peut être utile pour l'affichage temporaire
        }), 202

    except Exception as e:
        app.logger.error(f"Erreur lors de l'upload ou du démarrage du job: {e}")
        return jsonify({"error": f"Une erreur est survenue lors de l'upload: {str(e)}"}), 500

# --- ROUTE CHAT AVEC GEMINI ---
@app.route('/api/chat', methods=['POST'])
@jwt_required() # La route chat est maintenant protégée
def chat_with_gemini():
    current_user_email = get_jwt_identity()
    user_message_text = request.json.get('message')
    image_data_b64 = request.json.get('image_b64') # Image 2D si envoyée pour analyse Gemini Vision

    # Récupérer l'historique de chat de l'utilisateur
    current_history = user_chat_histories.get(current_user_email, [])

    prompt_parts = []
    if user_message_text:
        prompt_parts.append(user_message_text)
   
    if image_data_b64:
        try:
            import base64
            from PIL import Image
            import io
            image_bytes = base64.b64decode(image_data_b64)
            img = Image.open(io.BytesIO(image_bytes))
            prompt_parts.append(img)
        except Exception as e:
            app.logger.warning(f"Impossible de traiter l'image b64 pour le chat: {e}")
            # L'erreur de l'image ne doit pas bloquer le chat si c'est juste du texte
            if not user_message_text:
                return jsonify({"error": "Erreur de traitement de l'image. Veuillez réessayer ou envoyer du texte."}), 400


    if not prompt_parts:
        return jsonify({"error": "Aucun message ou image fourni pour le chat"}), 400

    try:
        # Inclure le disclaimer dans la première instruction si l'historique est vide,
        # ou l'ajouter systématiquement à la réponse de Gemini.
        # La stratégie la plus robuste est de l'ajouter à chaque réponse de Gemini.
       
        # Pour la vision, le modèle Gemini est optimisé pour les prompts directs.
        # On peut préfixer le message utilisateur avec une instruction générale.
       
        # Construire la session de chat avec l'historique pour l'utilisateur actuel
        # Note: gemini_model.start_chat() prend un historique.
        # Chaque appel à send_message met à jour cet historique *dans l'objet chat_session*.
        # Si on gère l'historique manuellement, il faut le passer à chaque fois.
       
        # Pour cet exemple simplifié avec `user_chat_histories`:
        # On va créer un nouvel objet chat_session pour chaque requête avec l'historique complet
        # Ceci est inefficace pour la production (recrée le modèle à chaque fois),
        # mais démontre la logique de gestion de l'historique.
       
        # Meilleure approche pour la production : utiliser une DB pour l'historique et le passer.
        # Ou si Gemini supporte la persistance de session par ID.
       
        # Pour l'exemple, on va juste envoyer le message avec l'historique récupéré
        # et s'assurer que le disclaimer est appliqué à la réponse.
       
        # Ajouter le message utilisateur à l'historique avant d'envoyer (pour la prochaine itération)
        current_history.append({"role": "user", "parts": prompt_parts})

        # Utiliser le modèle et l'historique pour générer la réponse
        # Note: L'API Gemini `send_message` gère l'historique interne.
        # Si tu utilises `gemini_model.generate_content`, tu dois passer l'historique manuellement.
        # Ici, on simule une session par utilisateur pour l'exemple.
       
        # Pour une gestion correcte de l'historique, il faut que `model.start_chat` soit appelé
        # avec l'historique de l'utilisateur, et que `send_message` mette à jour cet historique
        # avant de le sauvegarder.
       
        # Simplifié pour l'exemple: pas de session persistante via start_chat ici
        # L'historique n'est pas utilisé directement par `gemini_model.send_message`
        # si on ne recrée pas une session pour chaque utilisateur.
        # Pour un vrai historique, il faudrait :
        # chat_session_per_user = gemini_model.start_chat(history=current_history)
        # response = chat_session_per_user.send_message(prompt_parts)
        # user_chat_histories[current_user_email] = chat_session_per_user.history

        # Pour une inférence directe sans gérer la session Gemini interne (pour l'exemple):
        response = gemini_model.generate_content(current_history)
        gemini_reply = response.text
       
        # Ajouter la réponse de Gemini à l'historique
        current_history.append({"role": "model", "parts": [gemini_reply]})
        user_chat_histories[current_user_email] = current_history # Sauvegarde l'historique mis à jour

        # S'assurer que le disclaimer est présent dans la réponse finale
        final_reply = f"{gemini_reply}\n\n{MEDICAL_DISCLAIMER}"

        return jsonify({"reply": final_reply})

    except Exception as e:
        app.logger.error(f"Erreur lors de l'appel à l'API Gemini: {e}")
        return jsonify({"error": "Une erreur est survenue lors du traitement de votre demande avec l'assistant IA."}), 500

# --- ROUTE POUR RÉCUPÉRER LES DÉTAILS DU MODÈLE 3D ---
@app.route('/api/render-details/<job_id>', methods=['GET'])
@jwt_required() # La route est maintenant protégée
def get_3d_model_details(job_id):
    current_user_email = get_jwt_identity()
    # En production, tu devrais vérifier que ce job_id appartient bien à current_user_email
    # via ta base de données qui mappe les jobs aux utilisateurs.

    try:
        model_filename_3d = f"{job_id}.glb" # Convention pour le nom du fichier 3D
        bucket_3d = storage_client.bucket(GCS_3D_MODELS_BUCKET)
        blob_3d = bucket_3d.blob(model_filename_3d)

        if blob_3d.exists():
            signed_url = blob_3d.generate_signed_url(
                version="v4",
                expiration=datetime.timedelta(minutes=15),
                method="GET",
            )
            return jsonify({
                "status": "completed",
                "model_url": signed_url,
                "filename": model_filename_3d,
                "job_id": job_id
            })
        else:
            # Pour l'exemple, si le fichier 3D n'existe pas, on considère qu'il est en cours de traitement
            # Une base de données de suivi des jobs serait plus précise.
            return jsonify({"status": "processing", "job_id": job_id}), 202

    except Exception as e:
        app.logger.error(f"Erreur lors de la vérification du statut du modèle 3D pour {job_id}: {e}")
        return jsonify({"error": f"Erreur lors de la récupération des détails du modèle 3D: {str(e)}"}), 500

# --- ÉVÉNEMENTS SOCKET.IO (CHAT EN TEMPS RÉEL) ---
# Note: L'authentification pour les WebSockets est plus complexe que les requêtes HTTP.
# Pour un usage en production, il faudrait intégrer l'authentification JWT directement dans la connexion Socket.IO.
# Pour l'exemple, on s'appuie sur le fait que l'utilisateur est déjà authentifié via HTTP.

@socketio.on('connect')
def test_connect():
    # Vous pouvez ajouter une vérification d'authentification ici si le token JWT est envoyé lors de la connexion Socket.IO
    # Par exemple, via un header ou un query param.
    print(f"Client connecté: {request.sid}")
    emit('my response', {'data': 'Connecté'})

@socketio.on('disconnect')
def test_disconnect():
    print(f"Client déconnecté: {request.sid}")

@socketio.on('message')
def handle_message(data):
    # 'data' devrait inclure l'email de l'utilisateur (envoyé par le frontend après authentification)
    user_email = data.get('user_email')
    message_text = data.get('text')

    if not user_email or not message_text:
        print("Message invalide: user_email ou text manquant.")
        return

    # Optionnel: Tu peux aussi appeler l'API Gemini ici pour la réponse en temps réel
    # Assure-toi que Gemini_model.send_message() est non bloquant si tu as beaucoup de trafic
    # Ou délègue à une tâche en arrière-plan.

    # Mise à jour de l'historique du chat pour cet utilisateur (simplifié)
    if user_email not in user_chat_histories:
        user_chat_histories[user_email] = []
    user_chat_histories[user_email].append({"role": "user", "parts": [message_text]})

    # Diffuse le message à tous les clients connectés (ou à ceux dans une "room" spécifique à l'utilisateur)
    emit('message', {'user_email': user_email, 'text': message_text, 'timestamp': datetime.datetime.now().isoformat()}, broadcast=True)
    print(f"Message de {user_email}: {message_text}")


# --- Point d'entrée de l'Application ---
if __name__ == '__main__':
    # Flask-SocketIO doit être lancé via socketio.run()
    # Cela inclut le serveur Flask standard.
    # Assurez-vous que le port 5000 est ouvert sur votre Jetson/VM.
    socketio.run(app, debug=True, port=5000)
