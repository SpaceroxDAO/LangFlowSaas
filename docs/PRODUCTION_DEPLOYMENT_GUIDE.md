# Teach Charlie AI - Production Deployment Guide

This guide walks you through deploying Teach Charlie AI to production.

## Prerequisites

Before you begin, ensure you have:

- [ ] A server/VPS with Docker and Docker Compose installed
- [ ] A domain name pointed to your server
- [ ] SSL certificate (Let's Encrypt or commercial)
- [ ] Production Clerk account with `pk_live_` keys
- [ ] Sentry account for error monitoring
- [ ] (Optional) Managed PostgreSQL service

## Step 1: Prepare Environment Variables

### 1.1 Generate Secure Keys

Run these commands to generate secure keys:

```bash
# Generate ENCRYPTION_KEY (Fernet key for API key encryption)
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

# Generate LANGFLOW_SECRET_KEY
openssl rand -base64 32

# Generate LANGFLOW_API_KEY
openssl rand -hex 16

# Generate SESSION_SECRET
openssl rand -base64 32
```

### 1.2 Create Production Environment File

```bash
# Copy the production template
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

**Critical settings to configure:**

| Variable | What to Set |
|----------|-------------|
| `ENVIRONMENT` | `production` |
| `DEV_MODE` | `false` |
| `ENCRYPTION_KEY` | Generated Fernet key |
| `DATABASE_URL` | Your PostgreSQL connection string with `?sslmode=require` |
| `CLERK_*` | Production Clerk keys (`pk_live_`, `sk_live_`) |
| `SENTRY_DSN` | Your Sentry DSN |
| `CORS_ORIGINS` | Your domain(s) only |

### 1.3 Verify Configuration

The backend will validate your configuration on startup. These errors will prevent startup:

- `DEV_MODE=true` in production environment
- Missing `ENCRYPTION_KEY` in production

## Step 2: Set Up Sentry

### 2.1 Create Sentry Projects

1. Go to [sentry.io](https://sentry.io) and create a new organization (or use existing)
2. Create two projects:
   - **teachcharlie-backend** (Python/FastAPI)
   - **teachcharlie-frontend** (React)

### 2.2 Get Your DSNs

For each project, go to **Settings > Projects > [Project] > Client Keys (DSN)**

Copy the DSN values to your `.env.production`:

```bash
# Backend DSN
SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/backend-project-id

# Frontend DSN
VITE_SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/frontend-project-id
```

### 2.3 Configure Alerts (Recommended)

In Sentry, set up alerts for:

1. **New issues** - Get notified of new errors
2. **Spike in errors** - Alert when error rate increases
3. **Performance issues** - Slow API responses

Go to **Alerts > Create Alert Rule**

## Step 3: Configure SSL/HTTPS

### Option A: Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d teachcharlie.ai -d www.teachcharlie.ai

# Certificates will be at:
# /etc/letsencrypt/live/teachcharlie.ai/fullchain.pem
# /etc/letsencrypt/live/teachcharlie.ai/privkey.pem
```

### Option B: Cloudflare (Recommended)

1. Add your domain to Cloudflare
2. Enable "Full (strict)" SSL/TLS mode
3. Cloudflare handles SSL termination

### Update nginx Configuration

Edit `nginx/nginx.prod.conf` and uncomment the HTTPS server block:

```nginx
server {
    listen 443 ssl http2;
    server_name teachcharlie.ai www.teachcharlie.ai;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # ... rest of config
}
```

Mount certificates in `docker-compose.prod.yml`:

```yaml
nginx:
  volumes:
    - /etc/letsencrypt/live/teachcharlie.ai:/etc/nginx/ssl:ro
```

## Step 4: Deploy

### 4.1 Clone Repository

```bash
git clone https://github.com/your-repo/teachcharlie.git
cd teachcharlie
```

### 4.2 Build and Start Services

```bash
# Load production environment
export $(cat .env.production | xargs)

# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4.3 Run Database Migrations

```bash
# Enter backend container
docker-compose -f docker-compose.prod.yml exec backend bash

# Run Alembic migrations
alembic upgrade head

# Exit container
exit
```

### 4.4 Verify Deployment

```bash
# Check health endpoints
curl https://teachcharlie.ai/health
curl https://teachcharlie.ai/api/health

# Check Sentry is receiving events (trigger a test error in your app)
```

## Step 5: Configure DNS

Point your domain to your server:

| Type | Name | Value |
|------|------|-------|
| A | @ | Your server IP |
| A | www | Your server IP |
| A | app | Your server IP (if using subdomain) |

Wait for DNS propagation (up to 48 hours, usually faster).

## Step 6: Post-Deployment Checklist

### Security Verification

```bash
# 1. Verify DEV_MODE is disabled (should return authenticated response)
curl https://teachcharlie.ai/api/v1/agents
# Should return 401 Unauthorized (not mock data)

# 2. Verify CORS blocks unauthorized origins
curl -H "Origin: https://evil.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS https://teachcharlie.ai/api/v1/health
# Should NOT return Access-Control-Allow-Origin: *

# 3. Verify Langflow is not directly accessible
curl https://teachcharlie.ai:7860/health
# Should timeout or connection refused

# 4. Verify API keys are masked in responses
# (Create a workflow with API key, then fetch it - key should be masked)
```

### Monitoring Setup

1. **Sentry**: Verify errors are being captured
2. **UptimeRobot**: Add monitors for:
   - `https://teachcharlie.ai/health`
   - `https://teachcharlie.ai/api/health`
3. **Database backups**: Configure automated daily backups

## Step 7: Set Up Database Backups

### Option A: Managed PostgreSQL (Recommended)

Use Supabase, Neon, or AWS RDS - they handle backups automatically.

### Option B: Self-managed Backups

Create a backup script:

```bash
#!/bin/bash
# /opt/teachcharlie/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/opt/teachcharlie/backups

# Create backup
docker-compose -f /opt/teachcharlie/docker-compose.prod.yml exec -T postgres \
  pg_dump -U postgres teachcharlie | gzip > $BACKUP_DIR/teachcharlie_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

Add to crontab:

```bash
# Run daily at 3 AM
0 3 * * * /opt/teachcharlie/backup.sh
```

## Troubleshooting

### Backend won't start

Check logs:
```bash
docker-compose -f docker-compose.prod.yml logs backend
```

Common issues:
- `ENCRYPTION_KEY not set` - Add ENCRYPTION_KEY to .env.production
- `DEV_MODE enabled in production` - Set DEV_MODE=false
- Database connection failed - Check DATABASE_URL

### Sentry not receiving errors

1. Verify DSN is correct in .env.production
2. Check SENTRY_ENVIRONMENT is set
3. Errors in development are disabled by default - set `VITE_SENTRY_DEBUG=true` to test

### 502 Bad Gateway

Usually means a backend service is down:
```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml restart backend
```

### Langflow health check failing

```bash
# Check Langflow logs
docker-compose -f docker-compose.prod.yml logs langflow

# Restart Langflow
docker-compose -f docker-compose.prod.yml restart langflow
```

## Updating in Production

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Run any new migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

## Rollback Procedure

If something goes wrong:

```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Checkout previous version
git checkout <previous-commit-hash>

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## Security Contacts

If you discover a security vulnerability:
- Do NOT create a public GitHub issue
- Email: security@teachcharlie.ai
- We will respond within 24 hours

---

## Quick Reference

### Start/Stop Commands

```bash
# Start
docker-compose -f docker-compose.prod.yml up -d

# Stop
docker-compose -f docker-compose.prod.yml down

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend

# View logs
docker-compose -f docker-compose.prod.yml logs -f [service]

# Shell into container
docker-compose -f docker-compose.prod.yml exec backend bash
```

### Health Check URLs

| Service | URL |
|---------|-----|
| nginx | `https://teachcharlie.ai/health` |
| Backend | `https://teachcharlie.ai/api/health` |
| Langflow | Internal only (via nginx proxy) |

### Important Files

| File | Purpose |
|------|---------|
| `.env.production` | Production environment variables |
| `docker-compose.prod.yml` | Production Docker configuration |
| `nginx/nginx.prod.conf` | Production nginx configuration |
| `alembic/` | Database migrations |
