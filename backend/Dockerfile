# backend/Dockerfile
FROM node:18-bullseye

WORKDIR /app
COPY package*.json ./
# use npm install because repo has no package-lock.json
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
