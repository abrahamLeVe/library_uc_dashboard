# 1️⃣ Etapa de construcción
FROM node:20-alpine AS builder

# Configura directorio de trabajo
WORKDIR /app

# Copia dependencias e instala
COPY package*.json ./
RUN npm install

# Copia el resto del proyecto y compila
COPY . .
RUN npm run build

# 2️⃣ Etapa de ejecución
FROM node:20-alpine AS runner

WORKDIR /app

# Copia solo lo necesario del builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Variable de entorno para producción
ENV NODE_ENV=production
EXPOSE 3000

# Comando por defecto
CMD ["npm", "start"]
