# Stage 1: Dependencies & Build
FROM node:18-alpine AS builder
WORKDIR /app

# Prisma benötigt OpenSSL in Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

COPY . .
# Prisma Client generieren
RUN npx prisma generate

# Next.js Build
RUN npm run build

# Stage 2: Production Image
FROM node:18-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/server.js ./server.js

EXPOSE 3000

# Führt vor Start die DB-Migrationen durch und startet den Custom Server
CMD npx prisma migrate deploy && node server.js
