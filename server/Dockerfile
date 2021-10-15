FROM node:14

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --production

COPY . .

EXPOSE 8080

CMD node . &&\
  yarn knex migrate:latest
