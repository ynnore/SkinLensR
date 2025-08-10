# /home/manik/skinlensr/SkinLensR/backend/app/config.py
"""
Ce module centralise la configuration de l'application.
Il charge les variables depuis l'environnement et fournit des valeurs par défaut.
"""

import os
from pydantic_settings import BaseSettings, SettingsConfigDict # Importez SettingsConfigDict
from typing import List, Optional 
# import json # Peut-être nécessaire si vous deviez parser du JSON, mais ici, on évite cela.

# --- Configuration Générale ---
APP_NAME: str = "Kiwi-ops Backend API"
APP_VERSION: str = "0.1.0"

# --- Configuration de la Base de Données ---
DB_USER: str = os.environ.get("DB_USER", "default_user")
DB_PASSWORD: str = os.environ.get("DB_PASSWORD", "default_password")
DB_HOST: str = os.environ.get("DB_HOST", "localhost") 
DB_PORT: str = os.environ.get("DB_PORT", "5432") 
DB_NAME: str = os.environ.get("DB_NAME", "default_db")
# Assurez-vous que la DATABASE_URL est construite correctement à partir de ces variables.
DATABASE_URL: str = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# --- Configuration de la Sécurité et JWT ---
SECRET_KEY: str = os.environ.get("SECRET_KEY", "dev-insecure-key-please-change-me-in-production") 
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

# --- Configuration CORS ---
# Gérer CORS_ORIGINS pour éviter les erreurs de parsing JSON.
# Pydantic-settings lit normalement les variables d'environnement.
# Si CORS_ORIGINS est présent et n'est PAS du JSON, il faut s'assurer que Pydantic
# ne tente pas de le parser comme tel.
# L'approche la plus sûre est de le définir comme une chaîne et de splitter,
# en s'assurant que le type est bien List[str].

# Lire la variable d'environnement pour CORS_ORIGINS
cors_origins_env = os.environ.get("CORS_ORIGINS")

# Définir la valeur par défaut
DEFAULT_CORS_ORIGINS_STR = "http://localhost:3000,http://127.0.0.1:8000,https://api.kiwi-ops.com"

# Utiliser la valeur de l'environnement si elle existe, sinon utiliser la valeur par défaut,
# et ensuite splitter la chaîne en une liste.
CORS_ORIGINS: List[str] = cors_origins_env.split(',') if cors_origins_env else DEFAULT_CORS_ORIGINS_STR.split(',')

CORS_ALLOW_CREDENTIALS: bool = True
CORS_ALLOW_METHODS: List[str] = ["*"]
CORS_ALLOW_HEADERS: List[str] = ["*"]

# --- Configuration IA / Hugging Face ---
LLM_MODEL_NAME: str = "gpt-3.5-turbo" 
EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
HF_CACHE_DIR: str = "./hf_models_cache"

# --- Configuration des Services Locaux ---
LOCAL_LLM_BASE_URL: Optional[str] = os.environ.get("LOCAL_LLM_BASE_URL") 
LOCAL_LLM_API_KEY: Optional[str] = os.environ.get("LOCAL_LLM_API_KEY", "ollama")

# --- Autres Configurations ---
# EXTERNAL_API_KEY: Optional[str] = os.environ.get("EXTERNAL_API_KEY")

class Settings(BaseSettings):
    # La classe Settings hérite de BaseSettings et charge les variables d'environnement.
    # Les champs définis ici seront recherchés dans l'environnement.
    # Si une variable d'environnement n'est pas trouvée, la valeur par défaut est utilisée.

    # Assurez-vous que vos variables d'environnement sont correctement nommées :
    # DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
    # SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, etc.
    # CORS_ORIGINS (si défini dans l'env, doit être une chaîne séparée par des virgules)

    # Pour les listes comme CORS_ORIGINS, pydantic-settings s'attend à ce que la variable d'env
    # soit une chaîne de caractères séparée par des virgules. L'approche ci-dessus avec
    # os.environ.get() et .split(',') devrait fonctionner.

    # Si vous utilisez un fichier .env, assurez-vous qu'il est à la racine du projet
    # et que pydantic-settings le charge. Dans pydantic v2, cela se fait via `model_config`.
    model_config = SettingsConfigDict(
        env_file='.env',            # Chemin vers le fichier .env
        env_file_encoding='utf-8',
        extra='ignore'               # Ignorer les variables d'environnement inconnues
    )

    # Ré-déclarer les champs ici si vous avez besoin d'une logique plus complexe,
    # mais pour ce cas, la gestion directe dans le script devrait suffire.

    # Si CORS_ORIGINS doit absolument être une liste JSON dans l'env,
    # il faudrait faire quelque chose comme :
    # CORS_ORIGINS: List[str] = Field(default=["http://localhost:3000", "http://127.0.0.1:8000", "https://api.kiwi-ops.com"])
    # ET s'assurer que la variable d'env est une chaîne JSON comme '["url1", "url2"]'

    # Mais l'approche avec .split(',') est plus courante pour les chaînes séparées par des virgules.

# Instancier les paramètres une fois pour qu'ils soient disponibles globalement
settings = Settings()