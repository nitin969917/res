# ── Stage 1: Build the React app ──────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# In production, API calls use /api (relative path, proxied by Nginx)
ENV VITE_API_URL=/api

RUN npm run build

# ── Stage 2: Serve with Nginx ──────────────────────────────────
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
