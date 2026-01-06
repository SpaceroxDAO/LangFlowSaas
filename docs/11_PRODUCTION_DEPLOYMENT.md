# Production Deployment Guide: Teach Charlie AI

**Last Updated**: 2026-01-05
**Status**: Ready for Implementation
**Owner**: Adam (Product) + Claude Code (Technical)

## Overview

This guide covers deploying Teach Charlie AI to production, with special focus on:
1. Same-origin deployment for CSS injection (Progressive Canvas)
2. Nginx reverse proxy configuration
3. DataStax/Cloud deployment options
4. Security hardening

## Architecture for Production

```
                    ┌─────────────────────────────────────┐
                    │         Nginx Reverse Proxy         │
                    │         (teach-charlie.ai)          │
                    └─────────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
    ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
    │    Frontend     │   │     Backend     │   │    Langflow     │
    │  (React/Vite)   │   │    (FastAPI)    │   │  (iframe embed) │
    │    :3001        │   │     :8000       │   │     :7860       │
    └─────────────────┘   └─────────────────┘   └─────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │   PostgreSQL    │
                          │     :5432       │
                          └─────────────────┘
```

## Critical: Same-Origin Deployment

### The Problem

The Progressive Canvas feature uses CSS injection to hide/show Langflow UI elements at different disclosure levels. This **requires same-origin deployment** because:

- Cross-origin iframes cannot be modified via JavaScript
- CORS restrictions prevent accessing iframe content from different origins
- CSS injection into Langflow iframe fails with `SecurityError: Blocked a frame with origin`

### The Solution: Nginx Reverse Proxy

Configure Nginx to serve all services from the same origin:

```
https://teach-charlie.ai/           → Frontend (React)
https://teach-charlie.ai/api/       → Backend (FastAPI)
https://teach-charlie.ai/langflow/  → Langflow UI
```

## Nginx Configuration

### Production nginx.conf

```nginx
upstream frontend {
    server frontend:3001;
}

upstream backend {
    server backend:8000;
}

upstream langflow {
    server langflow:7860;
}

server {
    listen 80;
    server_name teach-charlie.ai www.teach-charlie.ai;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name teach-charlie.ai www.teach-charlie.ai;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/teach-charlie.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/teach-charlie.ai/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Frontend (default)
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts for LLM responses
        proxy_read_timeout 120s;
        proxy_connect_timeout 60s;
    }

    # Langflow (for iframe embedding)
    location /langflow/ {
        proxy_pass http://langflow/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Allow iframe embedding from same origin
        proxy_hide_header X-Frame-Options;
        add_header X-Frame-Options "SAMEORIGIN" always;

        # WebSocket support for Langflow
        proxy_read_timeout 86400;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://backend/health;
    }
}
```

### Update LangflowCanvasViewer

After deploying with Nginx, update the iframe src to use the proxied path:

```tsx
// Before (cross-origin, CSS injection blocked)
const langflowUrl = `http://localhost:7860/flow/${flowId}`

// After (same-origin via proxy, CSS injection works)
const langflowUrl = `/langflow/flow/${flowId}`
```

## Production docker-compose.yml

```yaml
version: "3.8"

services:
  nginx:
    image: nginx:alpine
    container_name: teachcharlie-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - backend
      - langflow
    networks:
      - teachcharlie-network
    restart: unless-stopped

  postgres:
    image: postgres:16
    container_name: teachcharlie-postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - teachcharlie-network
    restart: unless-stopped
    # No external port exposure in production

  langflow:
    image: langflowai/langflow:latest
    container_name: teachcharlie-langflow
    user: "1000:1000"
    environment:
      LANGFLOW_DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/langflow
      LANGFLOW_HOST: 0.0.0.0
      LANGFLOW_PORT: 7860
      LANGFLOW_AUTO_LOGIN: "true"
      LANGFLOW_SECRET_KEY: ${LANGFLOW_SECRET_KEY}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
    depends_on:
      - postgres
    networks:
      - teachcharlie-network
    restart: unless-stopped
    # No external port exposure - accessed via nginx proxy

  backend:
    build:
      context: ./src/backend
      dockerfile: Dockerfile
    container_name: teachcharlie-backend
    environment:
      DATABASE_URL: postgresql+asyncpg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/teachcharlie
      LANGFLOW_API_URL: http://langflow:7860
      CLERK_SECRET_KEY: ${CLERK_SECRET_KEY}
      CLERK_JWKS_URL: ${CLERK_JWKS_URL}
      CLERK_ISSUER: ${CLERK_ISSUER}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      DEBUG: "false"
      DEV_MODE: "false"
    depends_on:
      - postgres
      - langflow
    networks:
      - teachcharlie-network
    restart: unless-stopped

  frontend:
    build:
      context: ./src/frontend
      dockerfile: Dockerfile
    container_name: teachcharlie-frontend
    environment:
      VITE_API_URL: /api
      VITE_CLERK_PUBLISHABLE_KEY: ${CLERK_PUBLISHABLE_KEY}
    networks:
      - teachcharlie-network
    restart: unless-stopped

networks:
  teachcharlie-network:
    driver: bridge

volumes:
  postgres_data:
```

## Frontend Dockerfile (Production)

Create `src/frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
```

Create `src/frontend/nginx.conf`:

```nginx
server {
    listen 3001;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Environment Variables (Production)

Create `.env.production`:

```bash
# Database
POSTGRES_USER=teachcharlie_prod
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=teachcharlie

# Langflow
LANGFLOW_SECRET_KEY=<32-byte-fernet-key>

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_JWKS_URL=https://<your-clerk-domain>/.well-known/jwks.json
CLERK_ISSUER=https://<your-clerk-domain>

# LLM API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

## Deployment Options

### Option 1: DataStax (Recommended per CLAUDE.md)

DataStax provides Langflow hosting with managed PostgreSQL:

1. Create DataStax account
2. Deploy Langflow via their blueprint
3. Add custom frontend/backend containers
4. Configure Nginx proxy layer

**Pros**: Managed Langflow, PostgreSQL included
**Cons**: May require additional configuration for custom services

### Option 2: Railway

Single-click deployment with Docker:

```bash
railway up
```

**Pros**: Simple, auto-SSL, good free tier
**Cons**: May be more expensive at scale

### Option 3: DigitalOcean App Platform

Docker-based deployment:

1. Connect GitHub repo
2. Configure services in App Spec
3. Add managed PostgreSQL database

### Option 4: AWS/GCP (Self-Managed)

For full control:

1. EC2/GCE instance with Docker
2. RDS/Cloud SQL for PostgreSQL
3. CloudFront/Cloud CDN for caching
4. ACM/Cloud SSL for certificates

## Security Checklist

- [ ] SSL/TLS certificates configured (Let's Encrypt)
- [ ] Environment variables secured (not in git)
- [ ] Database password is strong and unique
- [ ] Langflow runs as non-root user
- [ ] DEV_MODE=false in production
- [ ] CORS origins restricted to production domain
- [ ] Rate limiting enabled
- [ ] Security headers configured in Nginx
- [ ] Database not exposed externally
- [ ] Langflow not exposed externally (via proxy only)

## Monitoring & Logging

### Recommended Setup

1. **Logging**: Structured JSON logs to stdout
   - Forward to CloudWatch, Datadog, or similar

2. **Metrics**: Basic uptime and response time
   - Use Railway/DataStax built-in monitoring initially

3. **Alerts**: Email alerts for downtime
   - UptimeRobot (free tier) or Better Uptime

### Health Endpoints

- `/health` - Backend health check
- `/langflow/health` - Langflow health check (via proxy)

## Rollback Plan

1. Keep previous Docker images tagged
2. Database backups before migrations
3. Rollback procedure:
   ```bash
   docker-compose down
   docker-compose -f docker-compose.rollback.yml up -d
   ```

## Cost Estimation

| Service | Monthly Cost |
|---------|-------------|
| Hosting (Railway/DO) | $20-50 |
| PostgreSQL (Managed) | $15-25 |
| Domain + SSL | $0-15 |
| **Total** | **$35-90** |

Within the $100-$500/month budget specified in CLAUDE.md.

## Next Steps

1. [ ] Choose deployment platform (DataStax recommended)
2. [ ] Purchase domain name
3. [ ] Set up Clerk production app
4. [ ] Create production environment variables
5. [ ] Configure Nginx reverse proxy
6. [ ] Deploy and test CSS injection
7. [ ] Set up monitoring and alerts
8. [ ] Run E2E tests against production
9. [ ] Invite beta testers

---

**Note**: The CSS injection for Progressive Canvas ONLY works with same-origin deployment. Without the Nginx proxy setup, the canvas viewer will show Langflow but without the progressive disclosure styling.
