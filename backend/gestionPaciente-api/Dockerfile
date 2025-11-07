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

EXPOSE 3004
ENV PORT=3004 SERVICE_NAME=gestion_paciente_api
CMD ["node", "src/app.js"]