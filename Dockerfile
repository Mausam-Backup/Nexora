# ============================================================
# Nexora ERP — Root Dockerfile (Monorepo)
# Multi-stage build: builds frontend, then runs both services
# ============================================================

# ─── Stage 1: Build Frontend ────────────────────────────────
FROM node:20-alpine AS frontend-builder

LABEL maintainer="Nexora Team"
LABEL description="CampusSync ERP Platform – Frontend Builder"

WORKDIR /app/frontend

# Copy frontend dependencies first (layer cache optimisation)
COPY frontend/package*.json ./
RUN npm install --frozen-lockfile

# Copy source and build the Vite/React app
COPY frontend/ ./
RUN npm run build

# ─── Stage 2: Backend Runtime ───────────────────────────────
FROM node:20-alpine AS backend

WORKDIR /app

# Install backend production dependencies only
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend into backend's static serving directory
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# Copy backend data (JSON ERP state)
COPY backend/data/ ./backend/data/

# ─── Runtime Configuration ──────────────────────────────────
WORKDIR /app/backend

# Environment defaults (override via docker-compose or -e flags)
ENV NODE_ENV=production \
    PORT=5000 \
    HOST=0.0.0.0

EXPOSE 5000

# Health check — ensures the API is responding before routing traffic
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]
