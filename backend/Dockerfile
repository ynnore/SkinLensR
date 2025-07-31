# backend/Dockerfile

# ====================================================================
# Étape 1: Builder - Installer les dépendances
# ====================================================================
# Utilisez la même version de Python que votre environnement local (3.8)
FROM python:3.8-slim-buster AS builder

# Définir le répertoire de travail pour l'étape de build
WORKDIR /app/backend

# Copier le fichier requirements.txt depuis votre dossier backend local
COPY backend/requirements.txt .

# Installer les dépendances
# Utilisez pip pour installer les dépendances (y compris gunicorn et uvicorn)
# Assurez-vous que gunicorn et uvicorn sont dans votre requirements.txt si ce n'est pas déjà le cas.
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ====================================================================
# Étape 2: Runtime - Copier les fichiers de l'application et configurer l'exécution
# ====================================================================
# Utilisez une image Python légère pour le runtime final
FROM python:3.8-slim-buster

# Définir le répertoire de travail dans le conteneur final
WORKDIR /app/backend

# Copier les dépendances installées de l'étape "builder"
# Ceci copie les paquets du site-packages de builder vers le runtime
COPY --from=builder /usr/local/lib/python3.8/site-packages /usr/local/lib/python3.8/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copier le code de votre application backend
# Le chemin source est 'backend/' car le docker build est exécuté depuis la racine de votre dépôt ('SkinLensR')
# Le chemin de destination est './' car WORKDIR est déjà /app/backend
COPY backend/app/ ./app/
COPY backend/main.py .
COPY backend/alembic/ ./alembic/
COPY backend/.env . # Copier le .env si nécessaire pour le build (il doit être ignoré par git)

# Définir le PYTHONPATH pour que Python puisse trouver vos modules 'app'
# main.py est à /app/backend/main.py, et le dossier 'app' est à /app/backend/app/
ENV PYTHONPATH="/app/backend:${PYTHONPATH}"

# Exposer le port sur lequel l'application FastAPI écoute
# Votre FastAPI écoute sur le port 8000, pas 8080
EXPOSE 8000

# Commande pour démarrer l'application avec Gunicorn et Uvicorn workers
# Gunicorn va manager les workers Uvicorn. $PORT est injecté par Cloud Run.
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "main:app"]
# Notez: main:app car main.py est maintenant à la racine de WORKDIR /app/backend
# Si vous préférez exécuter avec uvicorn directement (plus simple pour démarrer):
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
