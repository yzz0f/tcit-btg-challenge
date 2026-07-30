# --- build ---
FROM node:22-alpine AS builder
WORKDIR /workspace

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN npm ci

COPY . .

# Ruta relativa: nginx proxea /api hacia el contenedor de la API, así el bundle no
# queda atado a un host y el navegador no necesita CORS.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npx nx build web

# --- runtime ---
FROM nginx:1.27-alpine AS runtime

COPY infra/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/dist/apps/web /usr/share/nginx/html

EXPOSE 80
