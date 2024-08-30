FROM node:22 AS build

COPY --chown=node:node . /tonga/

WORKDIR /tonga

ENV NODE_ENV=production

USER node

RUN npm ci --include=dev && \
    npm run build


FROM node:22 AS main

# RUN apk add --no-cache tzdata

RUN mkdir /tonga && chown node: /tonga
WORKDIR /tonga

ENV NODE_ENV=production

COPY --chown=node:node ./package*.json ./

USER node

RUN npm ci

COPY --chown=node:node --from=build /tonga/dist ./

EXPOSE 3000

CMD [ "npm", "start" ]