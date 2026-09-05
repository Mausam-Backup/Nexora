# ============================================================
# backend/Dockerfile
# Nexora ERP — Express.js API Server
# Single-stage production image (Node 20 Alpine)
# ============================================================

FROM node:20-alpine

LABEL maintainer="Nexora Team"
LABEL description="CampusSync ERP – Express.js Backend API"

# Create non-root user for security
RUN addgroup -S nexora && adduser -S nexora -G nexora

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy application source
COPY src/ ./src/

# Copy ERP state data
COPY data/ ./data/

# Ownership to non-root user
RUN chown -R nexora:nexora /app

USER nexora

# Runtime configuration
ENV NODE_ENV=production \
    PORT=5000 \
    HOST=0.0.0.0

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]
