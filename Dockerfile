FROM node:22 AS build

COPY --chown=node:node . /tonga/

WORKDIR /tonga

ENV NODE_ENV=production

USER node

RUN npm ci --include=dev && \
    npm run build


FROM node:22-alpine AS main

RUN mkdir /tonga && chown node: /tonga
WORKDIR /tonga

ENV NODE_ENV=production

COPY --chown=node:node ./package*.json ./

RUN apk add --no-cache tzdata && \
    apk add --no-cache --virtual .gyp python3 make g++ && \
    npm ci && \
    apk del .gyp

USER node

COPY --chown=node:node --from=build /tonga/dist ./

EXPOSE 8676

CMD [ "npm", "start" ]