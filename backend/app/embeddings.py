# backend/app/embeddings.py
from typing import List
from sentence_transformers import SentenceTransformer
import numpy as np

# --- Configuration du Modèle d'Embedding ---
# 'all-MiniLM-L6-v2' est un modèle SentenceTransformer populaire, léger et performant.
# Il sera téléchargé automatiquement la première fois que le modèle sera chargé.
# Sa dimension d'embedding est de 384.
# Vous pouvez choisir d'autres modèles si nécessaire, mais ajustez VECTOR_DIMENSION en conséquence.
MODEL_NAME = 'all-MiniLM-L6-v2'
VECTOR_DIMENSION = 384 # Dimension pour 'all-MiniLM-L6-v2'

# Initialise le modèle SentenceTransformer une seule fois au démarrage du module.
# Cela évite de recharger le modèle à chaque appel de fonction, ce qui serait très inefficace.
try:
    print(f"Chargement du modèle d'embedding : {MODEL_NAME}...")
    model = SentenceTransformer(MODEL_NAME)
    print("Modèle d'embedding chargé avec succès.")
except Exception as e:
    print(f"Erreur lors du chargement du modèle d'embedding '{MODEL_NAME}': {e}")
    # Dans un environnement de production, vous pourriez vouloir gérer cette erreur
    # plus rigoureusement (ex: lever une exception fatale, fallback sur un modèle par défaut)
    model = None # Assure que 'model' est défini, même en cas d'erreur

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
        # encode() retourne un array numpy
        embedding_np = model.encode(text)
        # Convertit l'array numpy en liste de floats, comme spécifié par le type hint List[float]
        return embedding_np.tolist()
    except Exception as e:
        print(f"Erreur lors de la génération de l'embedding (local): {e}")
        return [] # Retourne une liste vide en cas d'erreur

def get_llm_response(prompt: str) -> str:
    """
    Placeholder pour la fonction qui interroge un LLM.
    Actuellement, elle retourne simplement un message indiquant que la fonctionnalité est à implémenter.
    Vous devrez remplacer ceci par un appel à une API LLM (comme OpenAI, Hugging Face, etc.)
    ou à un modèle local si vous en utilisez un.
    """
    print(f"Appel à get_llm_response avec le prompt : {prompt[:100]}...") # Affiche le début du prompt pour le débogage
    # --- IMPLÉMENTATION À FAIRE ICI ---
    # Exemple : si vous utilisiez OpenAI, ce serait quelque chose comme :
    # from openai import OpenAI
    # client = OpenAI()
    # response = client.chat.completions.create(...)
    # return response.choices[0].message.content

    # Pour l'instant, retournons un message indiquant que la fonctionnalité doit être implémentée.
    return "La fonctionnalité de réponse du LLM n'est pas encore implémentée. Utilisez le contexte pour votre réponse."