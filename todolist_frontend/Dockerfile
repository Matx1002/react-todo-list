# base
FROM node:20.15.0 AS base

WORKDIR /app

COPY package*.json ./
    
RUN npm install

COPY . .

# for lint

# FROM base as linter

# WORKDIR /app

# RUN npm run lint

# for build
FROM base as builder
# FROM linter as builder

WORKDIR /app

RUN npm run build


# for production

FROM node:20.15.0-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY --from=builder /app/dist ./

RUN npm install -g serve

CMD ["serve", "-s", "/app/", "-l", "5173"]

# ENTRYPOINT ["npm","run","dev"]