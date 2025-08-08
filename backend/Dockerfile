# ====================================================================
# Étape 1: Builder - Installer les dépendances
# ====================================================================
FROM python:3.8-slim-bookworm AS builder

# Définir le répertoire de travail pour l'étape de construction
WORKDIR /app/backend

# Copier le fichier des dépendances Python
COPY requirements.txt .

# Installer les dépendances système nécessaires pour la compilation de certains paquets Python
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Mettre à jour pip et installer les dépendances Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Si vous utilisez python-multipart, assurez-vous qu'il est dans requirements.txt
# RUN pip install python-multipart # Optionnel, à mettre dans requirements.txt si nécessaire

# Copier le reste du code source de l'application
# Cela copie le répertoire 'app/' entier, qui inclut maintenant main.py et models/base.py
COPY app/ ./app/

# Le fichier main.py est maintenant copié comme partie de app/, donc plus besoin de le copier séparément.
# COPY main.py .  <-- Supprimez cette ligne

# Copie le dossier alembic/ si nécessaire pour le runtime (pas toujours nécessaire)
# COPY alembic/ ./alembic/

# ====================================================================
# Étape 2: Runtime - Copier les artefacts et configurer l'exécution
# ====================================================================
FROM python:3.8-slim-bookworm AS runtime

# Définir le répertoire de travail pour l'exécution
WORKDIR /app/backend

# Copier les dépendances Python installées depuis l'étape builder
# C'est la bonne pratique pour garder l'image finale plus légère
COPY --from=builder /usr/local/lib/python3.8/site-packages /usr/local/lib/python3.8/site-packages
# Copier les exécutables installés par pip (comme uvicorn)
COPY --from=builder /usr/local/bin /usr/local/bin

# Copier le code de l'application backend depuis l'étape builder
# Copie le répertoire 'app/' qui contient maintenant main.py et les modèles
COPY --from=builder /app/backend/app/ ./app/
# Si main.py est bien dans app/, vous n'avez pas besoin de le copier séparément ici.
# La copie de 'app/' l'inclut déjà.

# Définir PYTHONPATH pour que Python puisse trouver le package 'app'
# Le répertoire qui contient le package 'app' est /app/backend.
ENV PYTHONPATH="/app/backend"

# Définir les variables d'environnement pour la connexion à Cloud SQL
# Ces variables sont nécessaires pour que votre application Python puisse se connecter
# à la base de données, en utilisant les informations fournies par Cloud Run.

# Il est FORTEMENT RECOMMANDÉ d'utiliser Secret Manager pour le mot de passe.
# Si vous devez le mettre ici pour un test rapide, assurez-vous d'utiliser le mot de passe correct
# et potentiellement encodé si le système d'environnement l'exige (mais Cloud Run peut gérer cela).
ENV DB_USER=kiwiops_user
ENV DB_NAME=kiwiops_db
# ENV DB_PASSWORD=M@cha15soop  # À REMPLACER PAR UNE GESTION SÉCURISÉE (SECRET MANAGER)

# Pour l'intégration Cloud Run avec Cloud SQL, il faut utiliser CLOUD_SQL_CONNECTION_NAME.
# C'est ce qui permet à Cloud Run de savoir quelle instance Cloud SQL utiliser.
# Votre application Python devra lire cette variable pour se connecter.
ENV CLOUD_SQL_CONNECTION_NAME=skinlens-new-test:europe-west1:skinlensr-db-prod-europe-west1

# Ouvrir le port sur lequel l'application écoutera. Cloud Run définit $PORT dynamiquement.
EXPOSE 8080

# Commande pour démarrer l'application FastAPI avec Uvicorn.
# Uvicorn doit trouver main.py à la racine du répertoire de travail du conteneur (/app/backend/).
# Grâce au PYTHONPATH, il pourra trouver le module 'app'.
# Assurez-vous que votre application FastAPI s'appelle 'app' et se trouve dans app/main.py.
# L'argument --port $PORT permet à Uvicorn d'écouter sur le port que Cloud Run alloue.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "$PORT"]