FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

COPY src ./src

EXPOSE 3003
ENV PORT=3003 SERVICE_NAME=historial_optometrico_api
CMD ["node", "src/app.js"]