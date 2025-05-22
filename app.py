from flask import render_template, jsonify, Flask, redirect, url_for, request, make_response
import os
import io # Keras peut l'utiliser implicitement, gardons-le.
import numpy as np
from PIL import Image # Keras peut l'utiliser implicitement, gardons-le.
import keras.utils as keras_image_utils
from keras.models import model_from_json
import subprocess
import uuid
from werkzeug.utils import secure_filename
# from datetime import datetime # Non utilisé directement

app = Flask(__name__)

# --- Configuration des Chemins et Constantes ---
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
# Les rendus seront stockés dans static/generated_renders/output pour être servis par Flask
RENDER_OUTPUT_SUBFOLDER = 'output' # Sous-dossier pour les rendus dans static/generated_renders
RENDER_OUTPUT_FOLDER_HOST = os.path.join(BASE_DIR, 'static', 'generated_renders') # Dossier parent
DOCKER_IMAGE_NAME = "skinlensr-blender-worker:latest"
MODEL_JSON_PATH = os.path.join(BASE_DIR, 'model.json')
MODEL_H5_PATH = os.path.join(BASE_DIR, 'model.h5')
BLENDER_SCRIPT_NAME_IN_CONTAINER = "blender_script.py" # Nom du script Python pour Blender dans le conteneur

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Chemin complet où les rendus seront sauvegardés sur l'hôte (incluant le sous-dossier 'output')
app.config['RENDER_SAVE_PATH_HOST'] = os.path.join(RENDER_OUTPUT_FOLDER_HOST, RENDER_OUTPUT_SUBFOLDER)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# S'assurer que les dossiers existent
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(app.config['RENDER_SAVE_PATH_HOST'], exist_ok=True) # Crée .../static/generated_renders/output/

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

SKIN_CLASSES = {
    0: 'Actinic Keratoses (Solar Keratoses) or intraepithelial Carcinoma (Bowen’s disease)',
    1: 'Basal Cell Carcinoma',
    2: 'Benign Keratosis',
    3: 'Dermatofibroma',
    4: 'Melanoma',
    5: 'Melanocytic Nevi',
    6: 'Vascular skin lesion'
}

try:
    with open(MODEL_JSON_PATH, 'r') as j_file:
        loaded_json_model = j_file.read()
    keras_model = model_from_json(loaded_json_model)
    keras_model.load_weights(MODEL_H5_PATH)
    print("Modèle Keras chargé avec succès.")
except Exception as e:
    print(f"Erreur lors du chargement du modèle Keras: {e}")
    keras_model = None

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signin')
def signin():
    return render_template('signin.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    return render_template('dashboard.html')

def findMedicine(pred_class_index):
    medicines = {
        0: "fluorouracil", 1: "Aldara", 2: "Prescription Hydrogen Peroxide",
        3: "fluorouracil", 4: "fluorouracil (5-FU):", 5: "fluorouracil",
        6: "fluorouracil"
    }
    return medicines.get(pred_class_index, "Aucun médicament spécifique listé")

@app.route('/detect', methods=['GET', 'POST'])
def detect_route():
    if request.method == 'POST':
        if 'file' not in request.files:
            return make_response(jsonify({'error': 'No file part in the request'}), 400)
        
        file = request.files['file']
        if file.filename == '':
            return make_response(jsonify({'error': 'No selected file'}), 400)

        if file and allowed_file(file.filename):
            original_filename_ext = os.path.splitext(secure_filename(file.filename))
            original_filename_base = original_filename_ext[0]
            original_extension = original_filename_ext[1]
            
            unique_suffix = uuid.uuid4().hex
            
            uploaded_filename_on_host = f"{unique_suffix}_{original_filename_base}{original_extension}"
            uploaded_image_path_on_host = os.path.join(app.config['UPLOAD_FOLDER'], uploaded_filename_on_host)
            
            file_bytes = file.read() # Lire une fois
            try:
                with open(uploaded_image_path_on_host, 'wb') as f:
                    f.write(file_bytes)
                print(f"Image sauvegardée sur l'hôte: {uploaded_image_path_on_host}")
            except Exception as e:
                print(f"Erreur lors de la sauvegarde de l'image: {e}")
                return make_response(jsonify({'error': 'Failed to save uploaded image'}), 500)

            if not keras_model:
                return make_response(jsonify({'error': 'Keras model not loaded'}), 500)
            
            try:
                img_for_keras = keras_image_utils.load_img(uploaded_image_path_on_host, target_size=(224, 224))
                img_array = keras_image_utils.img_to_array(img_for_keras)
                img_array = np.expand_dims(img_array, axis=0)
                img_array = img_array / 255.0
                
                prediction = keras_model.predict(img_array)
                pred_class_index = np.argmax(prediction)
                disease = SKIN_CLASSES.get(pred_class_index, "Unknown")
                accuracy = round(float(prediction[0][pred_class_index]) * 100, 2)
                medicine = findMedicine(pred_class_index)

                detection_results = {
                    "detected_issue": pred_class_index != 2,
                    "disease": disease,
                    "accuracy": accuracy,
                    "medicine": medicine,
                    "uploaded_image_filename": f"{original_filename_base}{original_extension}"
                }
                print(f"Résultats de détection: {detection_results}")

            except Exception as e:
                print(f"Erreur pendant la prédiction Keras: {e}")
                return make_response(jsonify({'error': f'Keras prediction failed: {str(e)}'}), 500)

            # --- Lancement du rendu Docker Blender ---
            # Chemin de l'image uploadée DANS LE CONTENEUR (relativement à /app)
            texture_path_in_container = f"input_texture/{uploaded_filename_on_host}" 
            
            render_output_filename_base = f"render_{unique_suffix}.png"
            # Chemin de l'image de rendu DANS LE CONTENEUR (relativement à /app)
            render_output_path_in_container = f"{RENDER_OUTPUT_SUBFOLDER}/{render_output_filename_base}" # Ex: "output/render_uuid.png"

            docker_input_volume_host = os.path.abspath(app.config['UPLOAD_FOLDER'])
            # Le volume de sortie est le dossier parent `static/generated_renders`
            # Le script Blender écrira dans `output/` à l'intérieur de ce volume mappé.
            docker_output_volume_host = os.path.abspath(RENDER_OUTPUT_FOLDER_HOST)


            # Assurez-vous que BLENDER_SCRIPT_NAME_IN_CONTAINER est le bon nom
            # et qu'il se trouve dans /app (WORKDIR) de votre image Docker.
            # Adaptez --input_image_path si votre script Blender utilise un autre nom d'argument.
            docker_command = [
                "docker", "run", "--rm",
                "-v", f"{docker_input_volume_host}:/app/input_texture:ro",
                "-v", f"{docker_output_volume_host}:/app/{RENDER_OUTPUT_SUBFOLDER}", # Map vers /app/output
                DOCKER_IMAGE_NAME,
                "blender", "--background", "--python", f"/app/{BLENDER_SCRIPT_NAME_IN_CONTAINER}", "--",
                "--input_image_path", texture_path_in_container, # Passé au script Blender
                "--output_path", render_output_path_in_container  # Passé au script Blender, relatif à /app
            ]
            
            render_url_for_frontend = None
            docker_success = False
            try:
                print(f"Exécution de Docker: {' '.join(docker_command)}")
                timeout_seconds = 300 
                completed_process = subprocess.run(
                    docker_command, capture_output=True, text=True, 
                    timeout=timeout_seconds # check=False (par défaut) pour gérer nous-mêmes le code de retour
                )
                
                if completed_process.returncode == 0:
                    print("Docker STDOUT:", completed_process.stdout)
                    if completed_process.stderr: print("Docker STDERR (peut contenir des warnings normaux de Blender):", completed_process.stderr)
                    docker_success = True
                else:
                    print(f"Erreur Docker (code {completed_process.returncode}):")
                    print("Docker STDOUT:", completed_process.stdout)
                    print("Docker STDERR:", completed_process.stderr)

            except subprocess.TimeoutExpired:
                print("Timeout Docker.")
            except FileNotFoundError:
                 print("Erreur: La commande 'docker' n'a pas été trouvée.")
            except Exception as e:
                print(f"Autre erreur pendant l'exécution de Docker: {e}")

            final_response = detection_results.copy()
            if docker_success:
                # Chemin de l'image rendue relatif à 'static' pour url_for
                # ex: 'generated_renders/output/render_uuid.png'
                static_path_for_render = os.path.join('generated_renders', RENDER_OUTPUT_SUBFOLDER, render_output_filename_base)
                render_url_for_frontend = url_for('static', filename=static_path_for_render, _external=True)
                
                final_response["render_page_url"] = url_for('render_skin_page', image_render_url=render_url_for_frontend, _external=True)
                final_response["rendered_image_direct_url"] = render_url_for_frontend
                print(f"URL du rendu pour le frontend: {render_url_for_frontend}")
            else:
                final_response["render_error"] = "Le rendu du jumeau numérique a échoué ou a expiré."

            return make_response(jsonify(final_response), 200)
        else:
            return make_response(jsonify({'error': 'File type not allowed'}), 400)
    else:
        return render_template('detect.html')

@app.route('/render_result') 
def render_skin_page():
    image_url_param = request.args.get('image_render_url')
    if not image_url_param:
        return "Erreur: URL de l'image de rendu manquante.", 400
    return render_template('render_skin.html', rendered_image_url=image_url_param)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)