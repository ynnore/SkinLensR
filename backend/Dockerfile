# backend/Dockerfile

# ====================================================================
# Étape 1: Builder - Installer les dépendances
# ====================================================================
FROM python:3.8-slim-buster AS builder

# Définir le répertoire de travail pour l'étape de build
WORKDIR /app/backend

# Copier le fichier requirements.txt depuis la racine du contexte de build (backend/)
COPY requirements.txt .

# Installer les dépendances. Assurez-vous que gunicorn et pgvector sont bien dans requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copier le reste du code source de l'application.
# Comme le WORKDIR est /app/backend, les chemins COPY sont relatifs à la racine du contexte de build (backend/)
COPY app/ ./app/
COPY main.py .
COPY alembic/ ./alembic/
# Le fichier .env n'est PAS copié ici. Les secrets et variables d'environnement critiques
# doivent être gérés via les variables d'environnement ou les secrets de Cloud Run lors du déploiement.

# ====================================================================
# Étape 2: Runtime - Copier les artefacts et configurer l'exécution
# ====================================================================
FROM python:3.8-slim-buster

# Définir le répertoire de travail dans le conteneur final
WORKDIR /app/backend

# Copier les dépendances installées de l'étape "builder"
COPY --from=builder /usr/local/lib/python3.8/site-packages /usr/local/lib/python3.8/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin 
# Copier le code de l'application backend préparé dans l'étape builder
# Ces chemins sont corrects car le WORKDIR est /app/backend et le contexte de build est backend/
COPY --from=builder /app/backend/app/ ./app/
COPY --from=builder /app/backend/main.py .
COPY --from=builder /app/backend/alembic/ ./alembic/
# Pas besoin de copier .env ici.

# Définir PYTHONPATH pour que Python puisse trouver vos modules dans /app/backend/app/
# Il est préférable de définir PYTHONPATH explicitement pour le dossier app.
ENV PYTHONPATH="/app/backend/app" 

# Exposer le port sur lequel l'application FastAPI écoute.
# Cloud Run injecte la variable d'environnement PORT, donc Gunicorn doit l'utiliser.
# L'instruction EXPOSE est informative.
# EXPOSE 8000

# Commande pour démarrer l'application avec Gunicorn et Uvicorn workers
# --bind 0.0.0.0:$PORT : Lie Gunicorn à toutes les interfaces sur le port fourni par Cloud Run.
# C'est essentiel pour que Cloud Run puisse communiquer avec votre conteneur.
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:$PORT", "main:app"]