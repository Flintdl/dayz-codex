# syntax=docker/dockerfile:1.6
# ============================================================================
# DayZ Codex — multi-stage build
# Output: imagem slim com Next.js standalone (~150MB)
# ============================================================================

# ─── Stage 1: deps ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Apenas package.json + lock pra cache eficiente
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts

# ─── Stage 2: builder ──────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Bash necessário pra scripts/update-icons.sh
RUN apk add --no-cache bash curl

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build (predev/prebuild scripts geram ícones e manifest)
RUN npm run build

# ─── Stage 3: runner ───────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Usuário não-root (boa prática Alpine)
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copia apenas o output standalone — máxima slim
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
