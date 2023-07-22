FROM node:16-buster-slim AS base
WORKDIR /app
FROM base AS builder
COPY . .
RUN apt-get update && \
    apt-get install -y chromium traceroute && \
    rm -rf /var/lib/apt/lists/*
RUN npm install --force
EXPOSE 8888
CMD ["npm", "start"]
