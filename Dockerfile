FROM node:22 AS build

COPY --chown=node:node . /tonga/

WORKDIR /tonga

ENV NODE_ENV=production

USER node

RUN npm ci --include=dev && \
    npm run build


FROM node:22-alpine AS main

RUN mkdir /tonga && chown node: /tonga

ENV NODE_ENV=production
ENV LANG=C.UTF-8

COPY --chown=node:node ./package*.json /tonga/
COPY --chown=node:node --from=build /tonga/dist /tonga/
COPY --chown=node:node ./GeoLite2-City/GeoLite2-City.mmdb /tonga/GeoLite2-City/

WORKDIR /tonga

RUN apk add --no-cache tzdata && \
    apk add --no-cache --virtual .gyp python3 make g++ && \
    npm ci && \
    apk del .gyp

USER node

EXPOSE 8676

CMD [ "npm", "start" ]