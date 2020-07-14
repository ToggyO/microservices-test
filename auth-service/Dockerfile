FROM node:13.12.0 as build-stage
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --silent --production
COPY . .
EXPOSE 3010
CMD npm run db-migrate && npm start
