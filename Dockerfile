FROM node:12-alpine AS base

WORKDIR /usr/src/app

COPY ./package* ./
COPY ./tsconfig.json ./

RUN npm i --only=prod

COPY ./src ./src

CMD ["npm","run","start"]