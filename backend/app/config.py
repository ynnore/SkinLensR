# /home/manik/skinlensr/SkinLensR/backend/app/config.py
"""
Ce module centralise la configuration de l'application.
Il charge les variables depuis l'environnement et fournit des valeurs par défaut.
"""

import os
from pydantic_settings import BaseSettings # Utilise pydantic-settings pour une gestion facile

# Pour lire les variables d'environnement de manière plus structurée
# Assurez-vous que 'pydantic-settings' est installé : pip install pydantic-settings

class Settings(BaseSettings):
    """
    Classe de configuration principale qui charge les paramètres depuis les variables d'environnement.
    """
    # --- Configuration Générale ---
    APP_NAME: str = "Kiwi-ops Backend API"
    APP_VERSION: str = "0.1.0"

    # --- Configuration de la Base de Données ---
    # Doit correspondre à DATABASE_URL dans app/database.py et potentiellement aux variables d'env.
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "sqlite:///./sql_app.db")

    # --- Configuration de la Sécurité et JWT ---
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "dev-insecure-key-please-change-me-in-production") # ⚠️ TRÈS IMPORTANT pour la prod
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # --- Configuration CORS ---
    # Les origines CORS doivent être lues depuis les variables d'environnement pour la flexibilité.
    # Séparées par des virgules dans la variable d'environnement.
    CORS_ORIGINS: List[str] = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:8000,https://api.kiwi-ops.com").split(',')
    # Vous pourriez aussi vouloir définir allow_methods, allow_headers, allow_credentials ici
    # pour qu'ils soient facilement accessibles par le middleware CORS.
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]

    # --- Configuration IA / Hugging Face ---
    # Nom du modèle LLM par défaut pour les agents ou le chat
    LLM_MODEL_NAME: str = "gpt-3.5-turbo" # Ou "meta-llama/Llama-2-7b-chat-hf", ou un modèle local
    # Nom du modèle d'embedding pour RAG
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    # Répertoire de cache pour les modèles Hugging Face
    HF_CACHE_DIR: str = "./hf_models_cache"

    # --- Configuration des Services Locaux ---
    # URL de base pour les LLM locaux compatibles OpenAI (ex: Ollama)
    LOCAL_LLM_BASE_URL: Optional[str] = os.environ.get("LOCAL_LLM_BASE_URL") # Ex: "http://localhost:11434/v1"
    LOCAL_LLM_API_KEY: Optional[str] = os.environ.get("LOCAL_LLM_API_KEY", "ollama") # Clé arbitraire pour Ollama

    # --- Configuration pour le Vector Store ---
    # Connexion à ChromaDB, PostgreSQL avec pgvector, etc.
    # CHROMA_DB_PATH: str = "./chroma_db" # Exemple pour ChromaDB persistante

    # --- Autres Configurations ---
    # Par exemple, des clés API pour des services externes (SerpAPI, etc.)
    # EXTERNAL_API_KEY: Optional[str] = os.environ.get("EXTERNAL_API_KEY")

    class Config:
        # Pydantic v1 compatibility (si besoin)
        # env_file = ".env" # Charger les variables depuis un fichier .env si présent
        # env_file_encoding = "utf-8"
        # Si vous chargez des listes depuis des variables d'environnement séparées par des virgules,
        # pydantic-settings peut le gérer automatiquement pour les champs List[str].
        # Si le champ est `CORS_ORIGINS: List[str]`, et la variable est "http://url1,http://url2",
        # pydantic-settings le transforme en ['http://url1', 'http://url2'].
        pass

# Instancier les paramètres une fois pour qu'ils soient disponibles globalement
# (ou les obtenir via Depends() si vous préférez injecter les paramètres)
settings = Settings()