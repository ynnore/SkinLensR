# Étape 1 : build de l'app
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

# Étape 2 : image de production
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
