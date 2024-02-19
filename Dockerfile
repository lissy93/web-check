# Build stage
FROM node:16-buster-slim AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN apt-get update && \
    yarn install --production && \
    rm -rf /app/node_modules/.cache

COPY . .

RUN yarn build --production

# Final stage
FROM node:16-buster-slim AS final

WORKDIR /app

COPY package.json yarn.lock ./
COPY --from=build /app .

RUN apt-get update && \
    apt-get install -y --no-install-recommends chromium traceroute && \
    chmod 755 /usr/bin/chromium && \
    rm -rf /var/lib/apt/lists/* /app/node_modules/.cache

EXPOSE ${PORT:-3000}

ENV CHROME_PATH='/usr/bin/chromium'

CMD ["yarn", "serve"]
