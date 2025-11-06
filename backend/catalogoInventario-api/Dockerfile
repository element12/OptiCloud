FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 3002
ENV PORT=3002 SERVICE_NAME=catalogo_inventario_api
CMD ["node", "src/app.js"]