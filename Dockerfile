# Multi-stage Hardened Dockerfile — ADuri
# Base Image: Minimal Alpine Linux (mengurangi Attack Surface & CVE)
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage 1: Install Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build Application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

# Stage 3: Hardened Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Buat non-root user khusus (UID 1000)
# Node image alpine sudah memiliki user 'node' dengan UID 1000
RUN mkdir -p .next && chown -R node:node /app

# Salin output build dari builder
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json

# Jalankan sebagai pengguna non-root (Least Privilege)
USER node

EXPOSE 3000

CMD ["npm", "run", "start"]
