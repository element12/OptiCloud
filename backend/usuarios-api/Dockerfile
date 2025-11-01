FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 3001
ENV PORT=3001 SERVICE_NAME=usuarios_api
CMD ["node", "src/app.js"]