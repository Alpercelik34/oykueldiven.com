# Production (canlı) için optimize, çok aşamalı Docker imajı.
# Geliştirme için bunu DEĞİL, docker-compose.yml dosyasını kullanın.

# 1) Bağımlılıklar
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 2) Derleme
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3) Çalıştırma (minimal standalone çıktı)
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# node:22-slim hazır gelen "node" kullanıcısını kullanırız (uid 1000).
# Yüklenen görsellerin yazılabilmesi için uploads klasörünü hazırlarız.
RUN mkdir -p /app/public/uploads && chown -R node:node /app

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/data ./data

USER node
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Canlıda DATABASE_URL ve ADMIN_PASSWORD ortam değişkenleri verilmelidir.
CMD ["node", "server.js"]
