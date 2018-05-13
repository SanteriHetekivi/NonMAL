FROM node:6.11.1
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY package*.json ./
RUN npm install