FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY document-service/package*.json ./document-service/
WORKDIR /app/document-service
RUN npm install

COPY document-service/src ./src

EXPOSE 3003

CMD ["npm", "start"]

