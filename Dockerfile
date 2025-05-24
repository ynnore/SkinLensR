# Dockerfile (Corrigé et Simplifié)

# 1. Choisir une image de base Linux (x86_64 car votre laptop est x86_64)
FROM ubuntu:22.04

# Arguments pour les versions de Blender, pour faciliter les mises à jour.
ARG BLENDER_VERSION="4.1.1"
ARG BLENDER_MAJOR_VERSION="4.1" # Ex: "4.1" pour Blender 4.1.x, "3.6" pour Blender 3.6.x

# Variable d'environnement pour éviter les questions interactives lors des installations apt
ENV DEBIAN_FRONTEND=noninteractive

# 2. Mettre à jour les paquets, installer les dépendances système et les certificats CA
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    xz-utils \
    # Dépendances courantes pour Blender headless (EEVEE peut en avoir besoin même sans X server visible)
    libfontconfig1 \
    libxrender1 \
    libxi6 \
    libgl1 \
    libxkbcommon0 \
    libxfixes3 \
    libsm6 \
    libegl1-mesa \
    # xvfb n'est plus installé car nous avons supprimé l'ENTRYPOINT xvfb-run
    # Installer/Mettre à jour les certificats CA pour résoudre les problèmes SSL de wget
    ca-certificates \
    && update-ca-certificates \
    # Nettoyer le cache apt pour réduire la taille de l'image
    && rm -rf /var/lib/apt/lists/*

# 3. Télécharger et installer Blender
RUN echo "Téléchargement de Blender version ${BLENDER_VERSION} depuis la branche ${BLENDER_MAJOR_VERSION}" \
    && wget -qO blender.tar.xz https://download.blender.org/release/Blender${BLENDER_MAJOR_VERSION}/blender-${BLENDER_VERSION}-linux-x64.tar.xz \
    && echo "Extraction de Blender..." \
    && mkdir -p /opt/blender \
    && tar -xf blender.tar.xz -C /opt/blender --strip-components=1 \
    && rm blender.tar.xz \
    && echo "Blender installé dans /opt/blender"

# Ajouter l'exécutable de Blender au PATH système
ENV PATH="/opt/blender:${PATH}"

# 4. (Optionnel) Installer des bibliothèques Python pour L'ENVIRONNEMENT PYTHON DE BLENDER
# Si votre script Blender a besoin de paquets Python tiers (non inclus avec Blender),
# vous les installeriez ici en utilisant le pip de Blender.
# Exemple:
# RUN blender --python-expr "import subprocess, sys; subprocess.run([sys.executable, '-m', 'pip', 'install', '--no-cache-dir', 'numpy', 'pillow'], check=True)"
# Pour l'instant, notre script n'utilise que bpy et les modules standards.

# 5. Définir le répertoire de travail dans le conteneur
WORKDIR /app

# 6. Copier le script Blender dans le répertoire de travail de l'image.
# Le script 'blender_test_script.py' (de votre machine hôte, dans le contexte de build)
# sera copié en tant que 'blender_script.py' dans /app/ à l'intérieur du conteneur.
COPY blender_test_script.py /app/blender_script.py

# (La ligne pour base_scene.blend est omise car notre script actuel ne l'utilise pas)
# Si vous en avez besoin, décommentez et ajustez :
# COPY base_scene.blend /app/base_scene.blend

# 7. L'ENTRYPOINT avec xvfb-run a été supprimé car les tests ont montré
#    qu'il causait un timeout et que le rendu fonctionnait sans pour ce cas.
#    Si vous rencontrez des problèmes de rendu GL plus tard, vous pourriez avoir besoin de le réintroduire
#    ou de déboguer son interaction.

# 8. (Optionnel) Commande par défaut (CMD)
# Cette commande ne sera exécutée que si vous lancez `docker run skinlensr-blender-worker:latest`
# sans spécifier d'autre commande. Votre app.py spécifie la commande complète, donc ceci est
# surtout pour tester l'image elle-même.
CMD ["blender", "--version"]# 1. Choisir une image de base Linux (x86_64 car votre laptop est x86_64)
FROM ubuntu:22.04

# Arguments pour les versions de Blender, pour faciliter les mises à jour.
ARG BLENDER_VERSION="4.1.1"
ARG BLENDER_MAJOR_VERSION="4.1" # Ex: "4.1" pour Blender 4.1.x, "3.6" pour Blender 3.6.x

# Variable d'environnement pour éviter les questions interactives lors des installations apt
ENV DEBIAN_FRONTEND=noninteractive

# 2. Mettre à jour les paquets, installer les dépendances système et les certificats CA
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    xz-utils \
    # Dépendances courantes pour Blender headless
    libfontconfig1 \
    libxrender1 \
    libxi6 \
    libgl1 \
    libxkbcommon0 \
    libxfixes3 \
    libsm6 \
    libegl1-mesa \
    # Pour le serveur X virtuel (nécessaire pour le rendu headless avec certaines fonctionnalités GL)
    xvfb \
    # Installer/Mettre à jour les certificats CA pour résoudre les problèmes SSL de wget
    ca-certificates \
    && update-ca-certificates \
    # Nettoyer le cache apt pour réduire la taille de l'image
    && rm -rf /var/lib/apt/lists/*

# 3. Télécharger et installer Blender
# L'URL utilise les ARG définis ci-dessus.
RUN echo "Téléchargement de Blender version ${BLENDER_VERSION} depuis la branche ${BLENDER_MAJOR_VERSION}" \
    && wget -qO blender.tar.xz https://download.blender.org/release/Blender${BLENDER_MAJOR_VERSION}/blender-${BLENDER_VERSION}-linux-x64.tar.xz \
    && echo "Extraction de Blender..." \
    && mkdir -p /opt/blender \
    && tar -xf blender.tar.xz -C /opt/blender --strip-components=1 \
    && rm blender.tar.xz \
    && echo "Blender installé dans /opt/blender"

# Ajouter l'exécutable de Blender au PATH système
ENV PATH="/opt/blender:${PATH}"

# 4. (Optionnel) Installer des bibliothèques Python pour L'ENVIRONNEMENT PYTHON DE BLENDER
# (Laissé commenté comme avant, à adapter si besoin)
# RUN blender --python-expr "import subprocess, sys; subprocess.run([sys.executable, '-m', 'pip', 'install', '--no-cache-dir', 'google-cloud-storage'], check=True)"

# 5. Définir le répertoire de travail dans le conteneur
WORKDIR /app

# 6. Copier les fichiers nécessaires au projet dans le répertoire de travail de l'image
# Assurez-vous que ces fichiers sont dans le même répertoire que votre Dockerfile
# lors de l'exécution de 'docker build', ou ajustez les chemins sources.
COPY blender_test_script.py .   # <--- CORRIGÉ ICI
COPY base_scene.blend .    # Votre fichier .blend de base

# 7. Définir le point d'entrée (ENTRYPOINT) pour utiliser xvfb-run.
ENTRYPOINT ["xvfb-run", "--auto-servernum", "--server-args=-screen 0 1280x1024x24"]

# 8. (Optionnel) Commande par défaut (CMD)
CMD ["blender", "--version"]