# ── Stage 1: Build React ──────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production: API goes to /api (proxied by Caddy to backend)
ENV VITE_API_URL=/api

RUN npm run build

# ── Stage 2: Serve with Caddy (auto HTTPS) ────────────────────
FROM caddy:alpine

# Copy built React app
COPY --from=builder /app/dist /srv

# Copy Caddy config
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443
