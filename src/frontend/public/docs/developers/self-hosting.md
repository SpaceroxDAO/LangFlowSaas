# Self-Hosting Guide

Deploy Teach Charlie AI on your own infrastructure. This guide covers Docker-based deployment for production environments.

## Prerequisites

- Docker and Docker Compose
- Linux server (Ubuntu 22.04 recommended)
- 4GB+ RAM, 2+ CPU cores
- Domain name with SSL certificate
- API keys for: Anthropic, Clerk

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/SpaceroxDAO/LangFlowSaas.git
cd LangFlowSaas
```

### 2. Configure Environment

```bash
cp .env.example .env
nano .env
```

**Required variables:**

```env
# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_JWKS_URL=https://your-domain.clerk.accounts.dev/.well-known/jwks.json
CLERK_ISSUER=https://your-domain.clerk.accounts.dev

# LLM Provider
ANTHROPIC_API_KEY=sk-ant-...

# Database
POSTGRES_USER=teachcharlie
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=teachcharlie
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}

# Langflow
LANGFLOW_SECRET_KEY=<generate-secret>
LANGFLOW_DATABASE_URL=${DATABASE_URL}

# Redis
REDIS_URL=redis://redis:6379

# Application
APP_URL=https://your-domain.com
API_URL=https://api.your-domain.com
CORS_ORIGINS=https://your-domain.com
```

### 3. Generate Secrets

```bash
# Generate Langflow secret
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

# Generate other secrets
openssl rand -hex 32
```

### 4. Start Services

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 5. Run Migrations

```bash
docker compose exec backend alembic upgrade head
```

### 6. Verify Deployment

```bash
# Check services
docker compose ps

# Check health
curl https://api.your-domain.com/health
```

## Architecture

```
                    ┌──────────────────┐
                    │    Nginx/SSL     │
                    │    (Reverse      │
                    │     Proxy)       │
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    Frontend     │ │    Backend      │ │    Langflow     │
│   (Static/CDN)  │ │   (FastAPI)     │ │   (Engine)      │
└─────────────────┘ └────────┬────────┘ └────────┬────────┘
                             │                   │
         ┌───────────────────┴───────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│               PostgreSQL           Redis                │
│               (Database)          (Cache)               │
└─────────────────────────────────────────────────────────┘
```

## Docker Compose Configuration

### Production Compose File

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  langflow:
    image: langflowai/langflow:latest
    restart: always
    environment:
      LANGFLOW_DATABASE_URL: ${DATABASE_URL}
      LANGFLOW_SECRET_KEY: ${LANGFLOW_SECRET_KEY}
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7860/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./src/backend
      dockerfile: Dockerfile
    restart: always
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      LANGFLOW_API_URL: http://langflow:7860
      CLERK_SECRET_KEY: ${CLERK_SECRET_KEY}
      CLERK_JWKS_URL: ${CLERK_JWKS_URL}
      CLERK_ISSUER: ${CLERK_ISSUER}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      langflow:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  frontend:
    build:
      context: ./src/frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${API_URL}
        VITE_CLERK_PUBLISHABLE_KEY: ${CLERK_PUBLISHABLE_KEY}
    restart: always

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:
  redis_data:
```

## Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:3000;
    }

    upstream langflow {
        server langflow:7860;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name your-domain.com api.your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    # Frontend
    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }

    # API
    server {
        listen 443 ssl http2;
        server_name api.your-domain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

## SSL Certificates

### Using Let's Encrypt

```bash
# Install certbot
apt install certbot python3-certbot-nginx

# Generate certificates
certbot certonly --nginx -d your-domain.com -d api.your-domain.com

# Certificates stored at:
# /etc/letsencrypt/live/your-domain.com/fullchain.pem
# /etc/letsencrypt/live/your-domain.com/privkey.pem

# Copy to project
cp /etc/letsencrypt/live/your-domain.com/*.pem ./ssl/

# Auto-renewal
certbot renew --dry-run
```

## Database Management

### Backup

```bash
# Create backup
docker compose exec postgres pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > backup.sql

# Automated daily backups
0 2 * * * docker compose exec -T postgres pg_dump -U teachcharlie teachcharlie | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

### Restore

```bash
# Restore from backup
docker compose exec -T postgres psql -U ${POSTGRES_USER} ${POSTGRES_DB} < backup.sql
```

### Migrations

```bash
# Run pending migrations
docker compose exec backend alembic upgrade head

# Create new migration
docker compose exec backend alembic revision --autogenerate -m "Description"

# Rollback
docker compose exec backend alembic downgrade -1
```

## Monitoring

### Health Checks

```bash
# All services health
curl https://api.your-domain.com/health

# Expected response:
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "langflow": "connected",
    "redis": "connected"
  }
}
```

### Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend

# Last 100 lines
docker compose logs --tail=100 backend
```

### Metrics (Optional)

Add Prometheus and Grafana:

```yaml
# Add to docker-compose.prod.yml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml

grafana:
  image: grafana/grafana
  ports:
    - "3000:3000"
```

## Scaling

### Horizontal Scaling

```yaml
# Scale backend
docker compose up -d --scale backend=3
```

Update nginx for load balancing:

```nginx
upstream backend {
    least_conn;
    server backend_1:8000;
    server backend_2:8000;
    server backend_3:8000;
}
```

### Database Scaling

For production with high load:

1. Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
2. Configure read replicas
3. Enable connection pooling (PgBouncer)

## Security Checklist

- [ ] HTTPS enabled with valid SSL
- [ ] Strong database passwords
- [ ] Environment variables not in git
- [ ] CORS restricted to your domain
- [ ] Rate limiting enabled
- [ ] Firewall configured (only 80, 443 exposed)
- [ ] Regular security updates
- [ ] Backup encryption enabled
- [ ] Monitoring alerts configured

## Updating

### Standard Update

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# Run migrations if needed
docker compose exec backend alembic upgrade head
```

### Zero-Downtime Update

```bash
# Build new images
docker compose -f docker-compose.prod.yml build

# Rolling restart
docker compose -f docker-compose.prod.yml up -d --no-deps backend
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker compose logs <service>

# Common issues:
# - Database connection: check DATABASE_URL
# - Port conflicts: check other services
# - Missing env vars: verify .env file
```

### Database Connection Errors

```bash
# Test connection
docker compose exec backend python -c "from app.database import engine; print(engine.connect())"

# Check PostgreSQL logs
docker compose logs postgres
```

### High Memory Usage

```bash
# Check container stats
docker stats

# Limit container memory
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
```

### SSL Certificate Issues

```bash
# Test SSL
openssl s_client -connect your-domain.com:443

# Renew certificates
certbot renew
docker compose restart nginx
```

## Support

For self-hosting support:

1. Check the [troubleshooting section](#troubleshooting)
2. Search [GitHub Issues](https://github.com/SpaceroxDAO/LangFlowSaas/issues)
3. Open a new issue with logs and environment details

---

Need managed hosting instead? [Contact us](https://teachcharlie.ai/contact) for enterprise options.
