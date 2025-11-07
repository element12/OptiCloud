FROM node:20-alpine
ENV NODE_ENV=production

# Instalar tzdata
RUN apk add --no-cache tzdata

# Establecer la zona horaria a Bogotá
ENV TZ=America/Bogota
RUN cp /usr/share/zoneinfo/America/Bogota /etc/localtime && echo "America/Bogota" > /etc/timezone

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 3002
ENV PORT=3002 SERVICE_NAME=catalogo_inventario_api
CMD ["node", "src/app.js"]