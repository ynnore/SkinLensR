from flask import render_template, jsonify, Flask, redirect, url_for, request, make_response
import os
import io
import numpy as np
from PIL import Image # Peut être utilisé par Keras ou pour des pré-traitements
import keras.utils as keras_image_utils # Nouveau nom à partir de TF 2.9+
from keras.models import model_from_json
import subprocess
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__)

# --- Configuration des Chemins et Constantes ---
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

# Le dossier 'static/generated_renders/' contiendra un sous-dossier 'output_renders'
# pour les fichiers PNG finaux.
RENDER_OUTPUT_PARENT_FOLDER_HOST = os.path.join(BASE_DIR, 'static', 'generated_renders')
RENDER_OUTPUT_SUBFOLDER_NAME = 'output_renders' # Nom du sous-dossier pour les .png
RENDER_SAVE_PATH_HOST = os.path.join(RENDER_OUTPUT_PARENT_FOLDER_HOST, RENDER_OUTPUT_SUBFOLDER_NAME)

DOCKER_IMAGE_NAME = "skinlensr-blender-worker:latest" # Assurez-vous que cette image existe
MODEL_JSON_PATH = os.path.join(BASE_DIR, 'model.json')
MODEL_H5_PATH = os.path.join(BASE_DIR, 'model.h5')
# Nom du script Python pour Blender tel qu'il sera dans /app/ à l'intérieur du conteneur
BLENDER_SCRIPT_IN_CONTAINER = "blender_script.py" # IMPORTANT: Doit correspondre au Dockerfile

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RENDER_SAVE_PATH_HOST'] = RENDER_SAVE_PATH_HOST # Ex: .../static/generated_renders/output_renders/
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # Limite de taille pour l'upload

# S'assurer que les dossiers existent
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RENDER_SAVE_PATH_HOST, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

SKIN_CLASSES = {
    0: 'Actinic Keratoses (Solar Keratoses) or intraepithelial Carcinoma (Bowen’s disease)',
    1: 'Basal Cell Carcinoma',
    2: 'Benign Keratosis', # Suppose que c'est la classe "saine" ou "pas de problème détecté"
    3: 'Dermatofibroma',
    4: 'Melanoma',
    5: 'Melanocytic Nevi',
    6: 'Vascular skin lesion'
}

# Chargement du modèle Keras
try:
    with open(MODEL_JSON_PATH, 'r') as j_file:
        loaded_json_model = j_file.read()
    keras_model = model_from_json(loaded_json_model)
    keras_model.load_weights(MODEL_H5_PATH)
    print("Modèle Keras chargé avec succès.")
except Exception as e:
    print(f"ERREUR FATALE lors du chargement du modèle Keras: {e}")
    keras_model = None # L'application ne pourra pas faire de prédictions

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def findMedicine(pred_class_index):
    medicines = {
        0: "Fluorouracil cream or Imiquimod cream", 1: "Surgical excision, Mohs surgery, Aldara (Imiquimod)",
        2: "Usually no treatment needed, cryotherapy if irritated",
        3: "Usually no treatment needed, surgical excision if symptomatic",
        4: "Surgical excision, immunotherapy, targeted therapy, chemotherapy, radiation",
        5: "Observation, surgical excision if suspicious changes",
        6: "Laser therapy, sclerotherapy, topical treatments"
    }
    return medicines.get(pred_class_index, "Aucun traitement spécifique listé, consultez un dermatologue.")

# --- Routes Flask ---
@app.route('/')
def index():
    return render_template('index.html') # Ou votre page d'accueil principale

@app.route('/signin')
def signin():
    return render_template('signin.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/dashboard') # Supprimez methods=['GET', 'POST'] si c'est juste pour afficher
def dashboard():
    return render_template('dashboard.html')

@app.route('/detect', methods=['GET', 'POST'])
def detect_route():
    if request.method == 'GET':
        return render_template('detect.html') # Page avec le formulaire d'upload

    # Traitement POST
    if 'file' not in request.files:
        return make_response(jsonify({'error': 'No file part in the request'}), 400)
    
    file = request.files['file']
    if file.filename == '':
        return make_response(jsonify({'error': 'No selected file'}), 400)

    if not (file and allowed_file(file.filename)):
        return make_response(jsonify({'error': 'File type not allowed'}), 400)

    if not keras_model:
        print("Tentative de détection mais le modèle Keras n'est pas chargé.")
        return make_response(jsonify({'error': 'Keras model is not loaded, cannot process request'}), 500)
    
    original_filename_secure = secure_filename(file.filename)
    original_filename_base, original_extension = os.path.splitext(original_filename_secure)
    
    unique_id = uuid.uuid4().hex # ID unique pour cette requête
    
    # Nom du fichier uploadé sauvegardé sur l'hôte
    uploaded_filename_on_host = f"{unique_id}_{original_filename_base}{original_extension}"
    uploaded_image_path_on_host = os.path.join(app.config['UPLOAD_FOLDER'], uploaded_filename_on_host)
    
    try:
        file.save(uploaded_image_path_on_host) # Utiliser file.save() est plus simple que read/write
        print(f"Image sauvegardée sur l'hôte: {uploaded_image_path_on_host}")
    except Exception as e:
        print(f"Erreur lors de la sauvegarde de l'image: {e}")
        return make_response(jsonify({'error': 'Failed to save uploaded image'}), 500)

    # --- Prédiction Keras ---
    try:
        # Charger l'image pour Keras (depuis le fichier sauvegardé)
        img_for_keras = keras_image_utils.load_img(uploaded_image_path_on_host, target_size=(224, 224))
        img_array = keras_image_utils.img_to_array(img_for_keras)
        img_array = np.expand_dims(img_array, axis=0) # Créer un batch de 1 image
        img_array = img_array / 255.0 # Normaliser si votre modèle a été entraîné ainsi
        
        prediction = keras_model.predict(img_array)
        pred_class_index = np.argmax(prediction[0]) # Index de la classe avec la plus haute probabilité
        disease = SKIN_CLASSES.get(pred_class_index, "Condition inconnue")
        accuracy = round(float(prediction[0][pred_class_index]) * 100, 2)
        medicine = findMedicine(pred_class_index)

        # Supposons que la classe 2 ("Benign Keratosis") signifie "pas de problème majeur détecté"
        detected_issue_bool = (disease != "Benign Keratosis") 

        detection_results = {
            "detected_issue": detected_issue_bool,
            "disease": disease,
            "accuracy": accuracy,
            "medicine": medicine,
            "uploaded_image_filename": original_filename_secure
        }
        print(f"Résultats de détection: {detection_results}")

    except Exception as e:
        print(f"Erreur pendant la prédiction Keras: {e}")
        return make_response(jsonify({'error': f'Keras prediction failed: {str(e)}'}), 500)

    # --- Lancement du rendu Docker Blender ---
    # Nom du fichier de rendu PNG final (sans chemin)
    render_output_filename_png = f"render_{unique_id}.png" 
    
    # Chemin où le script Blender doit sauvegarder DANS LE CONTENEUR
    # (relatif à /app, et dans le sous-dossier mappé)
    render_path_in_container_for_script = f"{RENDER_OUTPUT_SUBFOLDER_NAME}/{render_output_filename_png}" 

    # Chemin de l'image uploadée DANS LE CONTENEUR (relativement à /app)
    texture_path_in_container_for_script = f"input_texture/{uploaded_filename_on_host}" 

    # Chemins absolus sur l'HÔTE pour les volumes Docker
    host_uploads_dir_abs = app.config['UPLOAD_FOLDER'] # Déjà absolu grâce à BASE_DIR
    # Volume de sortie: le dossier parent static/generated_renders/
    # Le script Blender écrira dans RENDER_OUTPUT_SUBFOLDER_NAME à l'intérieur de ce volume.
    host_render_parent_dir_abs = RENDER_OUTPUT_PARENT_FOLDER_HOST 

    docker_command = [
        "docker", "run", "--rm",
        "-v", f"{host_uploads_dir_abs}:/app/input_texture:ro",
        "-v", f"{host_render_parent_dir_abs}:/app/{RENDER_OUTPUT_SUBFOLDER_NAME}", # Map vers /app/output_renders
        DOCKER_IMAGE_NAME,
        "blender", "--background", "--python", f"/app/{BLENDER_SCRIPT_IN_CONTAINER}", "--",
        "--input_image_path", texture_path_in_container_for_script,
        "--output_path", render_path_in_container_for_script 
    ]
    
    final_response_data = detection_results.copy() # Commencer avec les résultats de détection
    docker_did_run_successfully = False

    try:
        print(f"Exécution de Docker: {' '.join(docker_command)}")
        timeout_seconds = 300 # 5 minutes timeout
        completed_process = subprocess.run(
            docker_command, 
            capture_output=True, 
            text=True, 
            timeout=timeout_seconds
        )
        
        print(f"--- Docker STDOUT (Code Retour: {completed_process.returncode}) ---")
        print(completed_process.stdout if completed_process.stdout else "[Vide]")
        print(f"--- Fin Docker STDOUT ---")

        if completed_process.stderr:
            print(f"--- Docker STDERR ---")
            print(completed_process.stderr)
            print(f"--- Fin Docker STDERR ---")

        if completed_process.returncode == 0:
            # Vérifier si le script Blender a indiqué un succès dans son stdout
            # LA CORRECTION EST ICI :
            if "SUCCÈS (après sleep) : Le fichier de sortie existe !" in completed_process.stdout:
                # Double-vérification: le fichier existe-t-il réellement sur l'hôte ?
                expected_render_path_on_host = os.path.join(RENDER_SAVE_PATH_HOST, render_output_filename_png)
                if os.path.exists(expected_render_path_on_host):
                    print(f"CONFIRMATION HÔTE: Fichier de rendu trouvé à {expected_render_path_on_host}")
                    docker_did_run_successfully = True
                else:
                    print(f"ÉCHEC HÔTE: Fichier de rendu NON trouvé à {expected_render_path_on_host} APRÈS un retour Docker 0 et succès dans stdout.")
                    final_response_data["render_error"] = "Le rendu Docker a semblé réussir, mais le fichier de sortie est introuvable sur l'hôte."
            else:
                print("ÉCHEC DOCKER: Le script Blender n'a pas confirmé la création du fichier dans son stdout (message de succès attendu non trouvé), même si Docker a retourné 0.")
                final_response_data["render_error"] = "Problème interne lors du rendu (script Blender n'a pas confirmé le succès)."
        else:
            print(f"Erreur Docker (code de retour non nul: {completed_process.returncode}). Voir stderr et stdout ci-dessus.")
            error_message_from_docker = completed_process.stderr.strip().splitlines()[-1] if completed_process.stderr.strip() else "Erreur Docker inconnue."
            final_response_data["render_error"] = f"Le rendu 3D a échoué ({error_message_from_docker[:100]}...)"


    except subprocess.TimeoutExpired:
        print("Timeout Docker: Le processus de rendu a pris trop de temps.")
        final_response_data["render_error"] = "Le rendu du jumeau numérique a expiré."
    except FileNotFoundError:
        print("Erreur: La commande 'docker' n'a pas été trouvée. Docker est-il installé et dans le PATH ?")
        final_response_data["render_error"] = "Erreur de configuration serveur (Docker introuvable)."
    except Exception as e:
        print(f"Autre erreur inattendue pendant l'exécution de Docker: {type(e).__name__} - {e}")
        final_response_data["render_error"] = f"Erreur serveur inattendue ({type(e).__name__})."

    if docker_did_run_successfully:
        static_path_for_render_img = os.path.join('generated_renders', RENDER_OUTPUT_SUBFOLDER_NAME, render_output_filename_png)
        direct_image_url = url_for('static', filename=static_path_for_render_img, _external=True)
        render_page_display_url = url_for('render_skin_display_page', 
                                          image_to_display_url=direct_image_url, 
                                          disease=detection_results.get('disease'),
                                          accuracy=detection_results.get('accuracy'),
                                          medicine=detection_results.get('medicine'),
                                          _external=True)
        final_response_data["render_page_url"] = render_page_display_url
        print(f"URL de la page de rendu pour le frontend: {render_page_display_url}")
        print(f"URL directe de l'image rendue: {direct_image_url}")

    return make_response(jsonify(final_response_data), 200)


@app.route('/render_skin_display') 
def render_skin_display_page():
    image_url = request.args.get('image_to_display_url')
    disease = request.args.get('disease')
    accuracy = request.args.get('accuracy')
    medicine = request.args.get('medicine')

    if not image_url:
        return "Erreur: URL de l'image de rendu manquante.", 400
    
    detection_info_for_template = {
        "disease": disease,
        "accuracy": accuracy,
        "medicine": medicine
    }
    return render_template('render_skin.html', 
                           rendered_image_url=image_url, 
                           detection_results=detection_info_for_template)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)