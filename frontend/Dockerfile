# Etapa 1: Compilar la app
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine

# Copiar los archivos compilados al servidor web
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto
EXPOSE 3000

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
