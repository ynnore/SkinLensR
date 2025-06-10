# Fichier : backend-api/Dockerfile (VERSION DE PRODUCTION FINALE)

# Étape 1: Utiliser une image Python officielle
FROM python:3.10-slim

# Étape 2: Définir les variables d'environnement
ENV PYTHONUNBUFFERED=1
ENV APP_HOME=/app
ENV BLENDER_VERSION=4.1.1
ENV BLENDER_MAJOR_VERSION=4.1
WORKDIR $APP_HOME

# Étape 3: Installer les dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    xvfb \
    libgl1 \
    libxi6 \
    libxrender1 \
    xz-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Étape 4: Télécharger et installer Blender
RUN wget -qO blender.tar.xz https://download.blender.org/release/Blender${BLENDER_MAJOR_VERSION}/blender-${BLENDER_VERSION}-linux-x64.tar.xz \
    && mkdir -p /opt/blender \
    && tar -xf blender.tar.xz -C /opt/blender --strip-components=1 \
    && rm blender.tar.xz
ENV PATH="/opt/blender:${PATH}"

# Étape 5: Installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Étape 6: Copier tout le code de notre API dans l'image
COPY . .

# Étape 7: Commande pour lancer le serveur de production Gunicorn
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app