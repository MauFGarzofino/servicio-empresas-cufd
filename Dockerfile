FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos base
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Etapa 2: Ejecución
FROM node:20-alpine

WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa anterior
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/proto ./proto

# Variables de entorno por defecto
ENV PORT=3000
ENV NODE_ENV=production

# Puerto interno
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main.js"]