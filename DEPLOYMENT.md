# Deployment Guide - Teach Charlie AI

This guide covers deploying Teach Charlie AI to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [SSL/TLS Configuration](#ssltls-configuration)
5. [Deployment Steps](#deployment-steps)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Services

- **Docker & Docker Compose** v24+
- **PostgreSQL** 16+ (or use Docker container)
- **Redis** 7+ (or use Docker container)
- **Domain name** with DNS configured
- **SSL certificate** (Let's Encrypt recommended)

### Required Accounts

- **Clerk** - Authentication (production keys)
- **OpenAI/Anthropic** - LLM API keys
- **Sentry** - Error monitoring (recommended)

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8+ GB |
| Storage | 20 GB SSD | 50+ GB SSD |

---

## Environment Setup

### 1. Create Production Environment File

```bash
# Copy template
cp .env.example .env.production

# Edit with production values
nano .env.production
```

### 2. Required Environment Variables

```bash
# ===========================================
# CRITICAL - Must be set for production
# ===========================================

# Environment
ENVIRONMENT=production
DEV_MODE=false
DEBUG=false

# Database (use strong password)
POSTGRES_USER=teachcharlie
POSTGRES_PASSWORD=<generate-strong-password>
DATABASE_URL=postgresql+asyncpg://teachcharlie:<password>@postgres:5432/teachcharlie

# Clerk Authentication (PRODUCTION KEYS)
CLERK_SECRET_KEY=sk_live_...
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_ISSUER=https://clerk.your-domain.com
CLERK_JWKS_URL=https://clerk.your-domain.com/.well-known/jwks.json
CLERK_AUTHORIZED_PARTIES=https://teachcharlie.ai,https://www.teachcharlie.ai

# Encryption (generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
ENCRYPTION_KEY=<fernet-key>

# Langflow
LANGFLOW_API_KEY=<generate-random-key>
LANGFLOW_SECRET_KEY=<generate-32-char-key>

# Redis (optional but recommended)
REDIS_PASSWORD=<generate-password>

# CORS (your domain)
CORS_ORIGINS=https://teachcharlie.ai,https://www.teachcharlie.ai

# ===========================================
# RECOMMENDED - For monitoring
# ===========================================
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
```

### 3. Generate Secure Keys

```bash
# Generate Fernet encryption key
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

# Generate random API keys
openssl rand -base64 32

# Generate strong passwords
openssl rand -base64 24
```

---

## Database Setup

### Using Docker (Recommended for Single-Server)

The production docker-compose includes PostgreSQL. Data is persisted in Docker volumes.

### Using External Database

1. Create database and user:
```sql
CREATE DATABASE teachcharlie;
CREATE USER teachcharlie WITH ENCRYPTED PASSWORD 'your-strong-password';
GRANT ALL PRIVILEGES ON DATABASE teachcharlie TO teachcharlie;

-- Also create Langflow database
CREATE DATABASE langflow;
GRANT ALL PRIVILEGES ON DATABASE langflow TO teachcharlie;
```

2. Update `DATABASE_URL` in `.env.production`:
```bash
DATABASE_URL=postgresql+asyncpg://teachcharlie:password@your-db-host:5432/teachcharlie
```

### Database Migrations

```bash
# Run migrations (first deployment)
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head

# Check migration status
docker-compose -f docker-compose.prod.yml exec backend alembic current
```

---

## SSL/TLS Configuration

### Option 1: Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d teachcharlie.ai -d www.teachcharlie.ai

# Copy certs to nginx directory
sudo cp /etc/letsencrypt/live/teachcharlie.ai/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/teachcharlie.ai/privkey.pem nginx/ssl/
```

### Option 2: Commercial Certificate

1. Place certificate files in `nginx/ssl/`:
   - `fullchain.pem` - Certificate + intermediates
   - `privkey.pem` - Private key

### Enable SSL in nginx

Edit `nginx/nginx.prod.conf` and uncomment the SSL section:

```nginx
# Uncomment these lines:
listen 443 ssl http2;
ssl_certificate /etc/nginx/ssl/fullchain.pem;
ssl_certificate_key /etc/nginx/ssl/privkey.pem;
```

---

## Deployment Steps

### 1. Clone and Configure

```bash
# Clone repository
git clone https://github.com/your-org/teachcharlie.git
cd teachcharlie

# Set up environment
cp .env.example .env.production
# Edit .env.production with your values
```

### 2. Build Images

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build
```

### 3. Start Services

```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. Run Database Migrations

```bash
# Apply migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

### 5. Verify Health

```bash
# Check backend health
curl https://teachcharlie.ai/health

# Check all services
docker-compose -f docker-compose.prod.yml ps
```

---

## Post-Deployment Verification

### Health Checks

```bash
# Backend API
curl -s https://teachcharlie.ai/health | jq

# Expected response:
# {"status": "healthy", "version": "0.1.0"}
```

### Functional Tests

1. **Authentication**: Visit site and try to sign in via Clerk
2. **Create Agent**: Complete 3-step Q&A wizard
3. **Chat**: Test playground chat with created agent
4. **Canvas**: Open Langflow canvas and verify it loads

### Security Verification

```bash
# Check security headers
curl -I https://teachcharlie.ai/health

# Expected headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## Troubleshooting

### Common Issues

#### "Langflow container not found"

```bash
# Verify container name matches .env
docker ps -a | grep langflow

# Check LANGFLOW_CONTAINER_NAME in .env matches actual container
```

#### "Database connection failed"

```bash
# Check PostgreSQL is running
docker-compose -f docker-compose.prod.yml logs postgres

# Test connection
docker-compose -f docker-compose.prod.yml exec postgres pg_isready
```

#### "Authentication not working"

1. Verify `DEV_MODE=false` in production
2. Check Clerk keys are production keys (`pk_live_`, `sk_live_`)
3. Verify `CLERK_AUTHORIZED_PARTIES` includes your domain

#### "SSL certificate errors"

```bash
# Check certificate validity
openssl x509 -in nginx/ssl/fullchain.pem -text -noout | grep -A2 "Validity"

# Renew Let's Encrypt certificate
sudo certbot renew
```

### Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f langflow
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Restart Services

```bash
# Restart single service
docker-compose -f docker-compose.prod.yml restart backend

# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Full rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Backup & Recovery

### Database Backup

```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U teachcharlie teachcharlie > backup_$(date +%Y%m%d).sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres \
  psql -U teachcharlie teachcharlie < backup_20240115.sql
```

### Volume Backup

```bash
# List volumes
docker volume ls | grep teachcharlie

# Backup volume
docker run --rm -v teachcharlie_postgres_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres_data.tar.gz /data
```

---

## Monitoring

### Sentry (Recommended)

1. Create project at sentry.io
2. Add `SENTRY_DSN` to `.env.production`
3. Errors will be automatically captured

### Log Aggregation

For production, consider:
- **Datadog** - Full observability
- **Papertrail** - Log aggregation
- **CloudWatch** - If on AWS

---

## Updates

### Updating Application

```bash
# Pull latest code
git pull origin main

# Rebuild images
docker-compose -f docker-compose.prod.yml build

# Restart with new images
docker-compose -f docker-compose.prod.yml up -d

# Run any new migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

### Updating Langflow Version

1. Check for new versions: https://hub.docker.com/r/langflowai/langflow/tags
2. Update version in `docker-compose.prod.yml`:
   ```yaml
   langflow:
     image: langflowai/langflow:1.7.4  # New version
   ```
3. Test in staging before production
4. Restart: `docker-compose -f docker-compose.prod.yml up -d langflow`

---

## Production Checklist

Before going live, verify:

- [ ] `DEV_MODE=false`
- [ ] `ENVIRONMENT=production`
- [ ] `DEBUG=false`
- [ ] Strong `POSTGRES_PASSWORD` set
- [ ] Strong `ENCRYPTION_KEY` set (Fernet format)
- [ ] Clerk production keys (`pk_live_`, `sk_live_`)
- [ ] SSL certificates installed and valid
- [ ] CORS origins restricted to your domain
- [ ] Sentry DSN configured for error monitoring
- [ ] Database backups scheduled
- [ ] All health checks passing
- [ ] Security headers present in responses
