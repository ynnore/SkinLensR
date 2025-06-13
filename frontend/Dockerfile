# Étape 1: Construire l'application React/Next.js
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2: Servir les fichiers construits avec un serveur léger
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# Si vous utilisez Next.js, la ligne ci-dessus est différente.
# Pour Next.js, utilisez les lignes suivantes à la place de celles de Nginx :
# FROM node:18-alpine
# WORKDIR /app
# COPY --from=build /app/package*.json ./
# RUN npm install --omit=dev
# COPY --from=build /app/.next ./.next
# COPY --from=build /app/public ./public
# EXPOSE 3000
# CMD ["npm", "start"]