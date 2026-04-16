# ── Build stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /build
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY frontend .
RUN pnpm build

# ── Runtime stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app
RUN addgroup --system appgroup && adduser --system -G appgroup appuser
COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/public ./public
USER appuser
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]
