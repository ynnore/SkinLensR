# ====================================================================
# Étape 1: Builder - Installer les dépendances
# ====================================================================
FROM python:3.8-slim-bookworm AS builder

WORKDIR /app/backend

# Copier requirements.txt depuis la racine du contexte de build (backend/)
COPY requirements.txt .

# Installer les dépendances système nécessaires
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Installer les dépendances Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Installer python-multipart
RUN pip install python-multipart

# Copier le reste du code source de l'application
COPY app/ ./app/
COPY app/main.py ./main.py
COPY alembic/ ./alembic/

# ====================================================================
# Étape 2: Runtime - Copier les artefacts et configurer l'exécution
# ====================================================================
FROM python:3.8-slim-bookworm

WORKDIR /app/backend

# Copier les dépendances Python installées et les binaires de l'étape builder
COPY --from=builder /usr/local/lib/python3.8/site-packages /usr/local/lib/python3.8/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copier le code de l'application backend qui a été préparé dans l'étape builder
COPY --from=builder /app/backend/app/ ./app/
COPY --from=builder /app/backend/main.py .
COPY --from=builder /app/backend/alembic/ ./alembic/

# Définir PYTHONPATH pour que Python puisse trouver vos modules dans /app/backend/app/
ENV PYTHONPATH="/app/backend/app"

# Commande pour démarrer l'application FastAPI avec Uvicorn.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
