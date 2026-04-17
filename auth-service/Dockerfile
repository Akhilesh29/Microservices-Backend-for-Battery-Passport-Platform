FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY auth-service/package*.json ./auth-service/
WORKDIR /app/auth-service
RUN npm install

COPY auth-service/src ./src

EXPOSE 3001

CMD ["npm", "start"]

