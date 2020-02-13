FROM node:13.8.0-alpine3.11 as dev

WORKDIR /usr/app

EXPOSE 3000
EXPOSE 5001

CMD yarn watch

FROM dev as builder

WORKDIR /usr/build

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN yarn install --non-interactive --frozen-lockfile

COPY tsconfig.json ./tsconfig.json
COPY static ./static
COPY templates ./templates
COPY src ./src

RUN yarn build

FROM dev as production

WORKDIR /usr/app

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
COPY --from=builder /usr/build/lib ./lib

RUN yarn install --non-interactive --frozen-lockfile --production && yarn cache clean

WORKDIR /usr/app/lib

ENTRYPOINT ["node", "./index.js"]