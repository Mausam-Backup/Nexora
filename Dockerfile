# ============================================================
# Nexora ERP — Root Dockerfile
#
# Each service has its own Dockerfile:
#   frontend/Dockerfile  →  React + Nginx
#   backend/Dockerfile   →  Express.js API
#
# This root Dockerfile is the combined production image that
# serves the full stack from a single container (alternative
# to docker-compose for single-server deployments).
# ============================================================

# ─── Stage 1: Build Frontend ────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --frozen-lockfile
COPY frontend/ ./
RUN npm run build

# ─── Stage 2: Backend + Bundled Frontend ────────────────────
FROM node:20-alpine AS production

LABEL maintainer="Nexora Team"
LABEL description="CampusSync ERP – Full Stack (single container)"

RUN addgroup -S nexora && adduser -S nexora -G nexora

WORKDIR /app

# Backend dependencies
COPY backend/package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Backend source and data
COPY backend/src/ ./src/
COPY backend/data/ ./data/

# Frontend built assets — served as static files by Express
COPY --from=frontend-builder /app/frontend/dist ./public

RUN chown -R nexora:nexora /app
USER nexora

ENV NODE_ENV=production \
    PORT=5000 \
    HOST=0.0.0.0

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]

# ─── Preferred for multi-service deployments: ───────────────
# Use docker-compose.yml which builds frontend/ and backend/
# as independent containers (better scalability + separation).
