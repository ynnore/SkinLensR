# backend/Dockerfile

# ====================================================================
# Étape 1: Builder - Installer les dépendances
# ====================================================================
FROM python:3.8-slim-buster AS builder

# Définir le répertoire de travail pour l'étape de build
WORKDIR /app/backend

# Copier le fichier requirements.txt depuis votre dossier backend local
# Le chemin source est la racine du contexte de build (.), puis le chemin du fichier (backend/requirements.txt)
COPY backend/requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ====================================================================
# Étape 2: Runtime - Copier les fichiers de l'application et configurer l'exécution
# ====================================================================
FROM python:3.8-slim-buster

# Définir le répertoire de travail dans le conteneur final
WORKDIR /app/backend

# Copier les dépendances installées de l'étape "builder"
COPY --from=builder /usr/local/lib/python3.8/site-packages /usr/local/lib/python3.8/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copier le code de votre application backend
# Les chemins sources sont relatifs à la racine du contexte de build (backend/)
# Les chemins de destination sont relatifs au WORKDIR actuel (/app/backend)
COPY backend/app/ ./app/
COPY backend/main.py .
COPY backend/alembic/ ./alembic/
# Correction cruciale: COPIER LE FICHIER .env AU BON ENDROIT
# Le .env doit être copié si main.py le cherche, et il est dans backend/
# Assurez-vous que .env est à la racine de backend/ sur votre machine locale
COPY backend/.env .

# Définir le PYTHONPATH pour que Python puisse trouver vos modules 'app'
# 'main.py' est à '/app/backend/main.py', et le dossier 'app' est à '/app/backend/app/'
ENV PYTHONPATH="/app/backend:${PYTHONPATH}"

# Exposer le port sur lequel l'application FastAPI écoute
EXPOSE 8000

# Commande pour démarrer l'application avec Gunicorn et Uvicorn workers
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "main:app"]