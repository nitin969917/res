FROM node:20-alpine

WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Ensure upload and data dirs exist
RUN mkdir -p uploads data

EXPOSE 5001

CMD ["node", "server.js"]
