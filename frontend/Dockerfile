# ============================================================
# frontend/Dockerfile
# Nexora ERP — React / Vite Frontend
# Stage 1: Build  →  Stage 2: Serve via lightweight Nginx
# ============================================================

# ─── Stage 1: Build ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (separate layer — cached on re-builds)
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy source and build the production bundle
COPY . .
RUN npm run build


# ─── Stage 2: Serve ─────────────────────────────────────────
FROM nginx:1.25-alpine AS runner

LABEL maintainer="Nexora Team"
LABEL description="CampusSync ERP – React Frontend (Nginx)"

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Paste custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
