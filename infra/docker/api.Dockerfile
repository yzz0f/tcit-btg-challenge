# --- build ---
FROM node:22-alpine AS builder
WORKDIR /workspace

# Capa de dependencias: solo se invalida cuando cambian los manifiestos.
# Se copian todos los del workspace para que npm ci instale las deps de cada paquete.
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN npm ci

COPY . .

# `prune` produce dist/apps/api con el bundle, un package.json con solo las
# dependencias usadas, su lockfile y los paquetes del workspace (@tcit/shared).
RUN npx nx run api:prune

# --- runtime ---
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /workspace/dist/apps/api ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Usuario sin privilegios (ya existe en la imagen base).
USER node

EXPOSE 3000
CMD ["node", "main.js"]
