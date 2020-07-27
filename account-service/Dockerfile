FROM node:13.12.0 as build-stage
ENV NODE_ENV production
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --silent --production
COPY . .
CMD npm run db-migrate && npm start
