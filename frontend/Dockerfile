# frontend/Dockerfile
# stage 1: build
FROM node:18-bullseye AS build
WORKDIR /app

# copy only package files first for deterministic install
COPY package*.json ./

# use npm ci for clean, reproducible install
RUN npm ci

# copy rest of the app (node_modules is ignored via .dockerignore)
COPY . .

# make sure bin scripts are executable (defensive)
RUN chmod -R 755 node_modules/.bin || true

# build production bundle
RUN npm run build

# stage 2: serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
