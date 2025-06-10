# Utiliser une image de base Python 3.9
FROM python:3.9-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement le fichier des dépendances pour profiter du cache Docker
COPY requirements.txt requirements.txt

# Installer les dépendances
# L'option --no-cache-dir est une bonne pratique pour des images plus légères
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le reste du code de l'application
COPY . .

# La ligne EXPOSE est une bonne pratique pour la documentation,
# mais n'est pas utilisée par Cloud Run.
EXPOSE 8080

# --- LA LIGNE CORRIGÉE ---
# Démarrer le serveur Gunicorn.
# Il écoutera sur le port fourni par Cloud Run via la variable $PORT.
# Le nom de votre application Flask/FastAPI est "app" dans le fichier "app.py".
CMD gunicorn --bind 0.0.0.0:$PORT app:app