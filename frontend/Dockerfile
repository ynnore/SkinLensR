# Utilisez une image de base Node.js légère
FROM node:18-alpine AS base

# Installez les dépendances du projet en utilisant npm
FROM base AS deps
WORKDIR /app
# Copie les fichiers de dépendances de projet
COPY package.json package-lock.json ./ 
RUN npm ci 

# Générez les fichiers de production de Next.js
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build 

# Déploiement de production
FROM node:18-alpine AS runner
WORKDIR /app

# Définir l'environnement de production
ENV NODE_ENV production

# Copier seulement ce qui est nécessaire pour l'exécution
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exposer le port par défaut de Next.js
EXPOSE 3000

# Commande de démarrage de l'application Next.js
CMD ["npm", "start"]
