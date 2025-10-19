# 1️⃣ Etapa de construcción
FROM node:20-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copia e instala dependencias (todas, incluyendo dev)
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

ENV NODE_ENV=production

# Expone el puerto del servidor Next.js
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]


#docker build -t next-library-dashboard .
#docker run -d --name dasboard-uc-library -p 3001:3000 --env-file .env next-library-dashboard