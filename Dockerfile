# Étape 0 : on récupère logic-qcm-plus tout prêt
FROM logic-qcm-plus AS logic

# Étape 1 : Build de client-qcm-plus
FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL


# 1️⃣ On copie les fichiers de configuration
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./tsconfig.json
COPY vite.config.ts ./vite.config.ts

# 2️⃣ On intègre logic-qcm-plus compilé dans vendor
COPY --from=logic /app/dist               ./vendor/logic-qcm-plus/dist
COPY --from=logic /app/package.json       ./vendor/logic-qcm-plus/package.json

# 3️⃣ On supprime "prepare" dans logic pour ne pas relancer tsc
RUN sed -i '/"prepare"/d' vendor/logic-qcm-plus/package.json

# 4️⃣ Installation des dépendances
RUN npm ci

# 5️⃣ Copie du code source React
COPY public/ ./public
COPY src/ ./src

COPY index.html ./index.html


# 6️⃣ Build final avec Vite
RUN VITE_API_URL=$VITE_API_URL npm run build


# Étape 2 : Image finale – serveur HTTP statique (nginx)
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# 7️⃣ Nettoyage éventuel (contenu défaut nginx)
RUN rm -rf ./*

# 8️⃣ Copie du build Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# 9️⃣ Copie de la config nginx custom
COPY nginx.conf /etc/nginx/nginx.conf
