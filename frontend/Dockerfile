# --- Etapa 1: Build ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Etapa 2: Nginx ---
FROM nginx:alpine

# Copiamos la compilación
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiamos el script de arranque
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Puerto para Azure
EXPOSE 80

# Usamos nuestro script como punto de entrada
ENTRYPOINT ["/entrypoint.sh"]