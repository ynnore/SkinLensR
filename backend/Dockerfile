# ====================================================================
# Étape 1: Builder - Installer les dépendances
# ====================================================================
FROM python:3.8-slim-bookworm AS builder

# Définir le répertoire de travail pour l'étape de construction
WORKDIR /app/backend

# Copier le fichier des dépendances Python
COPY requirements.txt .

# Installer les dépendances système nécessaires pour la compilation de certains paquets Python (comme psycopg2 et Pillow)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Mettre à jour pip et installer les dépendances Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Installer python-multipart si nécessaire (par exemple, pour les formulaires dans FastAPI)
RUN pip install python-multipart

# Copier le reste du code source de l'application
# Cela copie le dossier app/ (qui contient database.py et potentiellement models/)
COPY app/ ./app/
# Copie main.py qui est à la racine du répertoire backend/
COPY main.py .
# Copie le dossier alembic/
COPY alembic/ ./alembic/

# ====================================================================
# Étape 2: Runtime - Copier les artefacts et configurer l'exécution
# ====================================================================
FROM python:3.8-slim-bookworm

# Définir le répertoire de travail pour l'exécution
WORKDIR /app/backend

# Copier les dépendances Python installées depuis l'étape builder
COPY --from=builder /usr/local/lib/python3.8/site-packages /usr/local/lib/python3.8/site-packages
# Copier les exécutables installés par pip (comme uvicorn)
COPY --from=builder /usr/local/bin /usr/local/bin

# Copier le code de l'application backend depuis l'étape builder
# Copie le dossier app/ (qui contient database.py et models/base.py) à la racine du WORKDIR runtime
COPY --from=builder /app/backend/app/ ./app/
# Copie main.py à la racine du WORKDIR runtime
COPY --from=builder /app/backend/main.py .
# Copie le dossier alembic/
COPY --from=builder /app/backend/alembic/ ./alembic/

# Définir PYTHONPATH pour que Python puisse trouver le package 'app'
# Comme main.py est à la racine (/app/backend/) et qu'il importe 'app.database' et 'app.models.base',
# le PYTHONPATH doit inclure le répertoire qui contient le package 'app', qui est /app/backend.
ENV PYTHONPATH="/app/backend"

# Commande pour démarrer l'application FastAPI avec Uvicorn.
# Uvicorn doit trouver main.py à la racine, et grâce au PYTHONPATH, il pourra trouver le module 'app'.
# Le port est dynamique et défini par Cloud Run via la variable d'environnement $PORT.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]