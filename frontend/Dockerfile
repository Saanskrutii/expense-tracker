# stage 1: build
FROM node:18-bullseye AS build
WORKDIR /app

# copy only package files first (faster + reproducible)
COPY frontend/package*.json ./

# reproducible install for CI
RUN npm ci

# copy rest of frontend (node_modules ignored by .gitignore)
COPY frontend/ .

# defensive: ensure .bin executables are executable
RUN chmod -R 755 node_modules/.bin || true

# build production bundle
RUN npm run build

# stage 2: serve via nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
