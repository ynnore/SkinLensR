      
# backend/app/embeddings.py
# Suppression des imports openai et dotenv car nous n'en avons plus besoin ici
from typing import List
# Importe SentenceTransformer pour les modèles locaux
from sentence_transformers import SentenceTransformer
# numpy est déjà installé et nécessaire pour la conversion de l'embedding en liste
import numpy as np


# Initialise le modèle de phrase-transformation.
# 'all-MiniLM-L6-v2' est un bon modèle léger et performant pour commencer.
# Il sera téléchargé la première fois que cette fonction sera appelée.
# La dimension de ce modèle est 384.
model = SentenceTransformer('all-MiniLM-L6-v2')


def get_embedding(text: str) -> List[float]:
    """
    Génère l'embedding d'un texte donné en utilisant un modèle local SentenceTransformer.
    """
    try:
        # Les modèles SentenceTransformer attendent du texte brut
        embedding_np = model.encode(text)
        return embedding_np.tolist() # Convertit l'array numpy en liste de floats
    except Exception as e:
        print(f"Erreur lors de la génération de l'embedding (local): {e}")
        return [] # Retourne une liste vide en cas d'erreur

    