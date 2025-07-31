# backend/Dockerfile

# ====================================================================
# Étape 1: Builder - Installer les dépendances
# ====================================================================
FROM python:3.8-slim-bookworm AS builder 

WORKDIR /app/backend

COPY requirements.txt .

# Installer les dépendances système nécessaires. build-essential est généralement inclus dans les images slim,
# mais on s'assure qu'il est là au cas où, et on nettoie après l'installation.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    # Si pgvector a besoin d'autres paquets système (libpq-dev, etc.), ajoutez-les ici
    && rm -rf /var/lib/apt/lists/*

# Installer les dépendances Python. Assurez-vous que gunicorn et pgvector sont bien dans requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copier le reste du code source de l'application
COPY app/ ./app/
COPY main.py .
COPY alembic/ ./alembic/
# Ne pas copier .env

# ====================================================================
# Étape 2: Runtime - Copier les artefacts et configurer l'exécution
# ====================================================================
FROM python:3.8-slim-bookworm 
WORKDIR /app/backend

# Copier les dépendances installées de l'étape "builder"
COPY --from=builder /usr/local/lib/python3.8/site-packages /usr/local/lib/python3.8/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copier le code de l'application backend
COPY --from=builder /app/backend/app/ ./app/
COPY --from=builder /app/backend/main.py .
COPY --from=builder /app/backend/alembic/ ./alembic/

# Définir PYTHONPATH
ENV PYTHONPATH="/app/backend/app"

# Commande pour démarrer l'application avec Gunicorn et Uvicorn workers
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:$PORT", "main:app"]

