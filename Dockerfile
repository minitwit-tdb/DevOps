FROM node:13.8.0-alpine3.11 as dev

ARG MYSQL_USER=root
ARG MYSQL_PASSWORD=secret
ARG MYSQL_HOST=db
ARG MYSQL_DB=minitwit
ENV MYSQL_USER=${MYSQL_USER}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}
ENV MYSQL_HOST=${MYSQL_HOST}
ENV MYSQL_DB=${MYSQL_DB}

WORKDIR /usr/app

EXPOSE 3000

CMD yarn watch

FROM dev as builder

WORKDIR /usr/build

COPY . .

RUN yarn install --non-interactive --frozen-lockfile
RUN yarn build

FROM dev as production

WORKDIR /usr/app

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
COPY --from=builder /usr/build/lib ./lib

RUN yarn install --non-interactive --frozen-lockfile --production && yarn cache clean

CMD ["cd", "lib", "&&", "node", "./index.js"]