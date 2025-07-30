# backend/app/chroma_setup.py

import chromadb
from chromadb.config import Settings
import os
from typing import Optional

# --- Configuration pour ChromaDB ---
# Nous allons utiliser Google Cloud Storage pour la persistance.
# Assurez-vous que la variable d'environnement CHROMA_GCS_BUCKET est définie.
# L'ID du projet et les identifiants de compte de service seront gérés par l'environnement Cloud Run.

# Nom de votre bucket GCS que vous venez de créer
# Pour le déploiement, ceci doit être une variable d'environnement !
# Pour les tests locaux, décommentez et définissez la ligne os.environ["CHROMA_GCS_BUCKET"] = "..."
GCS_BUCKET_NAME = os.environ.get("CHROMA_GCS_BUCKET") 

CHROMA_PERSIST_PATH = f"gs://{GCS_BUCKET_NAME}" if GCS_BUCKET_NAME else None

def get_chroma_client() -> Optional[chromadb.PersistentClient]:
    """
    Initialise et retourne un client ChromaDB persistant utilisant Google Cloud Storage.
    Retourne None si la configuration GCS n'est pas valide.
    """
    if not CHROMA_PERSIST_PATH:
        print("Erreur : La variable d'environnement CHROMA_GCS_BUCKET n'est pas définie.")
        print("ChromaDB ne pourra pas persister ses données.")
        return None

    try:
        print(f"Initialisation de ChromaDB avec le backend GCS : {CHROMA_PERSIST_PATH}")
        client = chromadb.PersistentClient(
            path=CHROMA_PERSIST_PATH,
            settings=Settings(
                is_persistent=True,
                allow_reset=False, # Mettez True si vous voulez permettre de réinitialiser la collection
            )
        )
        print("Client ChromaDB initialisé avec succès.")
        return client
    except Exception as e:
        print(f"Erreur lors de l'initialisation du client ChromaDB : {e}")
        return None

# --- Bloc pour tester localement ---
if __name__ == "__main__":
    # POUR LES TESTS LOCAUX UNIQUEMENT :
    # 1. Assurez-vous d'avoir défini la variable d'environnement :
    #    export CHROMA_GCS_BUCKET="skinlens-new-test-chroma-data-20240731" # Remplacez par votre nom de bucket
    # 2. Assurez-vous d'être authentifié auprès de Google Cloud pour accéder au bucket :
    #    gcloud auth application-default login
    
    # Décommenter la ligne ci-dessous et remplacer par votre nom de bucket pour tester :
    # os.environ["CHROMA_GCS_BUCKET"] = "skinlens-new-test-chroma-data-20240731" 

    chroma_client = get_chroma_client()
    if chroma_client:
        print("ChromaDB client prêt pour le test.")
        try:
            # Test: créer une collection, ajouter un document, puis le rechercher
            collection_name = "test_document_collection"
            print(f"Utilisation de la collection : {collection_name}")
            collection = chroma_client.get_or_create_collection(collection_name)
            print(f"Collection '{collection_name}' prête.")

            # Ajouter un document pour tester la persistance
            test_id = "test_doc_1"
            test_embedding = [0.1, 0.2, 0.3] # Exemple d'embedding, votre fonction get_embedding sera utilisée plus tard
            test_document = "Ceci est un document de test pour ChromaDB."
            test_metadata = {"source": "test_script"}

            print(f"Ajout du document avec ID: {test_id}")
            collection.add(
                embeddings=[test_embedding],
                documents=[test_document],
                metadatas=[test_metadata],
                ids=[test_id]
            )
            print("Document ajouté.")

            # Vérifier si le document existe
            count = collection.count()
            print(f"Nombre d'éléments dans la collection : {count}")
            retrieved_doc = collection.get(ids=[test_id])
            print(f"Document récupéré : {retrieved_doc}")

            # Nettoyer : supprimer la collection de test si vous le souhaitez (attention si ce n'est pas un test)
            # chroma_client.delete_collection(collection_name)
            # print(f"Collection '{collection_name}' supprimée.")

        except Exception as e:
            print(f"Erreur lors des tests avec ChromaDB : {e}")
    else:
        print("Impossible d'obtenir le client ChromaDB pour le test.")