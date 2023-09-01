FROM node:16-buster-slim

RUN apt-get update && \
    apt-get install -y chromium traceroute && \
    chmod 755 /usr/bin/chromium && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install && \
    rm -rf /app/node_modules/.cache

COPY . .

RUN yarn build

EXPOSE ${PORT:-3000}

ENV CHROME_PATH='/usr/bin/chromium'

CMD ["yarn", "serve"]