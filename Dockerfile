FROM node:16-buster-slim AS base
WORKDIR /app
FROM base AS builder
COPY . .
RUN apt-get update && \
    apt-get install -y chromium traceroute && \
    chmod 755 /usr/bin/chromium && \
    rm -rf /var/lib/apt/lists/*
RUN npm install --force
EXPOSE 8888
ENV CHROME_PATH='/usr/bin/chromium'
CMD ["npm", "run", "serve"]
