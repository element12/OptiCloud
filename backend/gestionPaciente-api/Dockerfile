FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 3004
ENV PORT=3004 SERVICE_NAME=gestion_paciente_api
CMD ["node", "src/app.js"]