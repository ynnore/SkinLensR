# Dockerfile
# Étape 1: Construire l'application Next.js
# Utilise une image Node.js 18 légère basée sur Alpine Linux pour la construction
FROM node:18-alpine AS build
WORKDIR /app # Définit le répertoire de travail dans le conteneur

# Copie uniquement les fichiers package.json et package-lock.json (ou yarn.lock)
# C'est une bonne pratique pour profiter de la mise en cache de Docker
COPY package*.json ./
# Installe toutes les dépendances. 'npm ci' est préférable pour les builds CI/CD
# car il utilise package-lock.json pour des installations reproductibles.
RUN npm ci
# Copie tout le reste du code source
COPY . .
# Exécute le script de build défini dans votre package.json
# C'est la commande qui va générer les fichiers de production de Next.js
RUN npm run build # Cela va créer le dossier .next et d'autres assets

# Étape 2: Servir l'application Next.js avec un serveur Node.js léger
# Utilise une nouvelle image Node.js 18 légère pour l'exécution en production
# Cela garde l'image finale petite et propre, ne contenant que ce qui est nécessaire
FROM node:18-alpine
WORKDIR /app # Définit le répertoire de travail

# Copie les fichiers package.json/lock et installe UNIQUEMENT les dépendances de production
# (--omit=dev exclut les dépendances de développement qui ne sont pas nécessaires à l'exécution)
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev

# Copie les artefacts de build de Next.js et le dossier public depuis l'étape de build
COPY --from=build /app/.next ./.next # Le cœur de votre application Next.js construite
COPY --from=build /app/public ./public # Les assets statiques
# Si vous avez d'autres dossiers d'assets ou de fichiers statiques (ex: 'static', 'assets'), copiez-les aussi:
# COPY --from=build /app/static ./static

EXPOSE 3000 # Expose le port par défaut de Next.js

CMD ["npm", "start"] # Lance le serveur de production Next.js