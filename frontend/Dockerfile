# stage 1: build
FROM node:18-bullseye AS build
WORKDIR /app

# copy only package files first for reproducible installs
COPY package*.json ./

# use npm ci for CI reproducible install
RUN npm ci

# copy rest of project (node_modules ignored via .dockerignore)
COPY . .

# ensure .bin executables are executable
RUN chmod -R 755 node_modules/.bin || true

# build production assets
RUN npm run build

# stage 2: serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
