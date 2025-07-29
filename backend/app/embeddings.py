import os
from openai import OpenAI
from dotenv import load_dotenv
from typing import List # Ajoutez cette ligne

# Charge les variables d'environnement du fichier .env
load_dotenv()

# Initialise le client OpenAI avec votre clé API
# Assurez-vous que votre OPENAI_API_KEY est bien dans le fichier .env
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_embedding(text: str) -> List[float]: # Utilisez List majuscule de typing
    """
    Génère l'embedding d'un texte donné en utilisant le modèle text-embedding-ada-002 d'OpenAI.
    La dimension de ce modèle est 1536.
    """
    text = text.replace("\n", " ") # Les embeddings fonctionnent mieux avec du texte plat
    try:
        response = client.embeddings.create(
            input=[text],
            model="text-embedding-ada-002"
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Erreur lors de la génération de l'embedding: {e}")
        # Retourne une liste vide en cas d'erreur, à gérer côté appelant
        return []
