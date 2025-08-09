from typing import List
from sentence_transformers import SentenceTransformer
import numpy as np

# --- Configuration du modèle d'embedding ---
MODEL_NAME = 'all-MiniLM-L6-v2'  # Modèle léger et performant pour embeddings
VECTOR_DIMENSION = 384  # Dimension fixe pour ce modèle

# Chargement du modèle une fois au démarrage (singleton pattern)
try:
    print(f"Chargement du modèle d'embedding : {MODEL_NAME}...")
    model = SentenceTransformer(MODEL_NAME)
    print("Modèle d'embedding chargé avec succès.")
except Exception as e:
    print(f"Erreur lors du chargement du modèle d'embedding '{MODEL_NAME}': {e}")
    model = None  # Pour éviter les erreurs si utilisé avant chargement

def get_embedding(text: str) -> List[float]:
    """
    Génère l'embedding vectoriel d'un texte.
    Renvoie la liste des floats ou une liste vide si erreur.
    """
    if model is None:
        print("Erreur : modèle non chargé.")
        return []

    try:
        embedding_np = model.encode(text)
        return embedding_np.tolist()
    except Exception as e:
        print(f"Erreur lors de la génération de l'embedding : {e}")
        return []

def get_llm_response(prompt: str) -> str:
    """
    Fonction placeholder pour interroger un LLM.
    À remplacer par un appel réel (OpenAI, HuggingFace, etc.).
    """
    print(f"Requête LLM (extrait): {prompt[:100]}...")

    try:
        # Exemple d'intégration future avec OpenAI ou autre API LLM
        # from openai import OpenAI
        # client = OpenAI(api_key="votre_cle_api")
        # response = client.Completion.create(prompt=prompt, max_tokens=100)
        # return response.choices[0].text.strip()

        return "Fonction LLM non implémentée - utiliser le contexte."
    except Exception as e:
        print(f"Erreur lors de l'appel au LLM : {e}")
        return "Erreur lors de l'appel au modèle LLM."
