# ====================================================================
# Étape 1: Builder - Compiler les dépendances
# ====================================================================
FROM python:3.11-slim-bookworm AS builder

# Définir le répertoire de travail
WORKDIR /app/backend

# Copier le fichier des dépendances
COPY requirements.txt .

# Installer les dépendances système nécessaires pour la compilation
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq-dev \
        gcc \
    && rm -rf /var/lib/apt/lists/*

# Installer les dépendances Python
# L'option --prefer-binary est une bonne optimisation
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --prefer-binary -r requirements.txt

# Copier le code source de l'application
COPY app/ ./app/

# ====================================================================
# Étape 2: Runtime - Créer l'image finale légère
# ====================================================================
FROM python:3.11-slim-bookworm AS runtime

# Définir le répertoire de travail
WORKDIR /app/backend

# Copier les packages Python installés depuis l'étape de build
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
# Copier les exécutables (comme uvicorn)
COPY --from=builder /usr/local/bin /usr/local/bin

# Copier le code source de l'application
COPY --from=builder /app/backend/app/ ./app/

# Définir PYTHONPATH pour que Python puisse trouver vos modules (ex: 'from app import ...')
ENV PYTHONPATH="/app/backend"

# Exposer le port sur lequel l'application va écouter.
# Cloud Run injectera la variable $PORT qui correspondra généralement à 8080.
EXPOSE 8080

# ====================================================================
# COMMANDE DE DÉMARRAGE CORRIGÉE
# ====================================================================
# Utilise la variable d'environnement $PORT fournie par Cloud Run
# et utilise la syntaxe shell-exec pour être plus robuste.
CMD ["/bin/sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]