FROM node:latest

WORKDIR /usr/app

COPY package*.json .

RUN npm install --quiet
RUN npm install -g knex
RUN npm install -g nodemon

COPY ./ ./

CMD ["npm", "start"]