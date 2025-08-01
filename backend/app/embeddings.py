from typing import List
from sentence_transformers import SentenceTransformer
import numpy as np

# --- Configuration du Modèle d'Embedding ---
MODEL_NAME = 'all-MiniLM-L6-v2'  # Modèle SentenceTransformer
VECTOR_DIMENSION = 384  # Dimension d'embedding pour 'all-MiniLM-L6-v2'

# Initialise le modèle SentenceTransformer une seule fois au démarrage du module.
# Cela évite de recharger le modèle à chaque appel de fonction.
try:
    print(f"Chargement du modèle d'embedding : {MODEL_NAME}...")
    model = SentenceTransformer(MODEL_NAME)
    print("Modèle d'embedding chargé avec succès.")
except Exception as e:
    print(f"Erreur lors du chargement du modèle d'embedding '{MODEL_NAME}': {e}")
    model = None  # Assure que 'model' est défini même en cas d'erreur.

# --- Fonctions pour les Embeddings et les Réponses LLM ---

def get_embedding(text: str) -> List[float]:
    """
    Génère l'embedding d'un texte donné en utilisant le modèle SentenceTransformer chargé.
    Retourne une liste de floats représentant l'embedding, ou une liste vide en cas d'erreur.
    """
    if model is None:
        print("Erreur: Le modèle d'embedding n'a pas pu être chargé. Impossible de générer l'embedding.")
        return []

    try:
        # Encode retourne un array numpy
        embedding_np = model.encode(text)
        # Convertit l'array numpy en liste de floats
        return embedding_np.tolist()  # Assure une conversion en liste Python standard
    except Exception as e:
        print(f"Erreur lors de la génération de l'embedding (local): {e}")
        return []  # Retourne une liste vide en cas d'erreur

def get_llm_response(prompt: str) -> str:
    """
    Placeholder pour la fonction qui interroge un LLM.
    Remplacez cela par un appel à une API LLM (comme OpenAI, Hugging Face, etc.)
    """
    print(f"Appel à get_llm_response avec le prompt : {prompt[:100]}...")  # Affiche le début du prompt pour le débogage

    # Exemple d'intégration future avec un LLM (comme OpenAI)
    try:
        # Exemple avec OpenAI (vous devrez avoir installé le client OpenAI et une clé API)
        # from openai import OpenAI
        # client = OpenAI(api_key="votre_clé_api")
        # response = client.Completion.create(prompt=prompt, max_tokens=100)
        # return response.choices[0].text.strip()

        # Pour l'instant, on retourne une réponse par défaut.
        return "La fonctionnalité de réponse du LLM n'est pas encore implémentée. Utilisez le contexte pour votre réponse."
    except Exception as e:
        print(f"Erreur lors de l'appel au LLM : {e}")
        return "Erreur lors de l'appel au modèle LLM."

