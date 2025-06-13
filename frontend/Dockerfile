# Étape 1: Construire l'application Next.js
FROM node:18-alpine AS build
WORKDIR /app

# Copie package.json et package-lock.json du répertoire courant.
COPY package*.json ./

RUN npm ci

# Copie tout le code source du répertoire courant.
COPY . .

RUN npm run build

# Étape 2: Servir l'application Next.js avec un serveur Node.js léger
FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]