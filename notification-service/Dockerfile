FROM node:20-alpine

WORKDIR /app

COPY notification-service/package*.json ./
RUN npm install

COPY notification-service/src ./src

RUN mkdir -p /app/logs

EXPOSE 3004

CMD ["npm", "start"]

