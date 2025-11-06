# --- Etapa 1: Build ---
FROM node:18 AS build
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

# Puerto expuesto para Azure
EXPOSE 80

# Comando de inicio (obligatorio en Azure)
CMD ["nginx", "-g", "daemon off;"]
