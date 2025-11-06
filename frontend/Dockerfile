# --- Etapa 1: Build de React ---
FROM node:18 AS build

WORKDIR /app

# Copiamos archivos de dependencias primero (mejor cache)
COPY package*.json ./

RUN npm install

# Copiamos el resto del código
COPY . .

# Compilamos el proyecto
RUN npm run build

# --- Etapa 2: Servir con Nginx ---
FROM nginx:alpine

# Copiamos el build al servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html


COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-c", "/etc/nginx/conf.d/default.conf", "-g", "daemon off;"]
