# Deployment Checklist: Teach Charlie AI to DataStax RAGStack

**Last Updated**: 2026-01-14
**Status**: Pre-Deployment Planning
**Owner**: Adam (Product) + Claude Code (Technical)

This checklist covers deploying Teach Charlie AI to production. The application uses a multi-service Docker architecture with nginx as the reverse proxy.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [DataStax RAGStack Setup](#datastax-ragstack-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup & Migrations](#database-setup--migrations)
5. [Docker Container Deployment](#docker-container-deployment)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring Setup](#monitoring-setup)
8. [Security Checklist](#security-checklist)
9. [Rollback Plan](#rollback-plan)
10. [Cost Estimation](#cost-estimation)

---

## Pre-Deployment Checklist

### Code Quality

- [ ] All E2E tests passing locally (`npm run test:e2e` in `src/frontend`)
- [ ] No TypeScript errors (`npm run build` succeeds in `src/frontend`)
- [ ] Backend imports cleanly (`cd src/backend && python3 -c "from app.main import app"`)
- [ ] Docker Compose runs locally without errors (`docker-compose up -d`)
- [ ] All services healthy (`docker-compose ps` shows all containers running)

### Code Cleanup

- [ ] Remove all `console.log` debug statements from frontend
- [ ] Remove all `print()` debug statements from backend (keep logging)
- [ ] Set `DEBUG=false` in production environment
- [ ] Set `DEV_MODE=false` in production environment
- [ ] Ensure no hardcoded API keys in code (use environment variables)

### Testing Verification

Run these tests before deploying:

```bash
# Start all services
docker-compose up -d

# Wait for services to be healthy (about 60 seconds)
docker-compose ps

# Run E2E tests
cd src/frontend && npx playwright test

# Expected: All tests pass
```

**Critical E2E Tests** (must pass):
- [ ] User signup/login flow
- [ ] Create agent via 3-step wizard
- [ ] Chat with agent in playground
- [ ] Multi-turn conversation works
- [ ] Knowledge source (RAG) queries work
- [ ] Publish agent to Langflow sidebar

### Documentation Review

- [ ] `.env.example` is up to date with all required variables
- [ ] `docker-compose.yml` matches production requirements
- [ ] `nginx/nginx.conf` has production-ready settings

---

## DataStax RAGStack Setup

### Account Setup

- [ ] Create DataStax account at https://www.datastax.com/
- [ ] Create a new organization (if needed)
- [ ] Set up billing information

### Astra DB (Managed PostgreSQL Alternative)

DataStax primarily uses Astra DB (Cassandra-based). For PostgreSQL with pgvector:

**Option A: Use Astra DB (Cassandra)**
- [ ] Create Astra DB database
- [ ] Generate application token
- [ ] Modify backend to use Cassandra driver (significant code changes)

**Option B: Use External PostgreSQL (Recommended)**
- [ ] Provision PostgreSQL from cloud provider (AWS RDS, Google Cloud SQL, Supabase, Neon)
- [ ] Enable pgvector extension: `CREATE EXTENSION IF NOT EXISTS vector;`
- [ ] Create application database: `CREATE DATABASE teachcharlie;`
- [ ] Create Langflow database: `CREATE DATABASE langflow;`

### Alternative: Railway/Render Deployment

If DataStax doesn't fit, consider these alternatives:

**Railway** (Recommended for simplicity):
- [ ] Create account at https://railway.app
- [ ] Import GitHub repository
- [ ] Configure services (PostgreSQL, Redis, Backend, Frontend, Langflow)
- [ ] Set environment variables
- [ ] Deploy

**Render**:
- [ ] Create account at https://render.com
- [ ] Create Blueprint from `render.yaml` (you'll need to create this)
- [ ] Configure PostgreSQL database
- [ ] Deploy services

---

## Environment Configuration

### Required Environment Variables

Create `.env.production` with these values:

```bash
# ============================================================================
# CRITICAL - Must Be Set
# ============================================================================

# Database (PostgreSQL - your production database)
DATABASE_URL=postgresql://user:password@host:5432/teachcharlie
LANGFLOW_DATABASE_URL=postgresql://user:password@host:5432/langflow

# Langflow Configuration
LANGFLOW_SECRET_KEY=<generate-32-byte-key>
LANGFLOW_API_KEY=<generate-api-key>
LANGFLOW_CONTAINER_NAME=teachcharlie-langflow
LANGFLOW_API_URL=http://langflow:7860

# Clerk Authentication (PRODUCTION keys)
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxx
CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
CLERK_JWKS_URL=https://<your-clerk-domain>/.well-known/jwks.json
CLERK_ISSUER=https://<your-clerk-domain>
CLERK_AUTHORIZED_PARTIES=https://yourdomain.com

# LLM API Keys
OPENAI_API_KEY=sk-xxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx

# Encryption (for storing user API keys)
ENCRYPTION_KEY=<generate-with-fernet>

# ============================================================================
# PRODUCTION SETTINGS - Override Defaults
# ============================================================================

# Disable development features
DEBUG=false
DEV_MODE=false
NODE_ENV=production

# PostgreSQL credentials
POSTGRES_USER=teachcharlie_prod
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=teachcharlie
```

### Generate Secure Keys

```bash
# Generate LANGFLOW_SECRET_KEY (32 bytes)
openssl rand -base64 32

# Generate ENCRYPTION_KEY (Fernet key)
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

# Generate LANGFLOW_API_KEY
openssl rand -hex 16
```

### Clerk Configuration

1. Go to https://dashboard.clerk.com
2. Select your application
3. Switch to "Production" instance
4. Copy production keys (pk_live_*, sk_live_*)
5. Configure allowed domains in Settings > Domains

---

## Database Setup & Migrations

### PostgreSQL Setup

```bash
# Connect to production database
psql $DATABASE_URL

# Create extension (if not exists)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

# Verify extensions
\dx
```

### Run Alembic Migrations

```bash
# From backend directory
cd src/backend

# Set DATABASE_URL to production
export DATABASE_URL="postgresql+asyncpg://user:password@host:5432/teachcharlie"

# Run migrations
alembic upgrade head

# Verify migrations
alembic current
```

### Verify Tables Created

```sql
-- Check all tables exist
\dt

-- Expected tables:
-- users, agents, projects, conversations, messages
-- agent_components, workflows, mcp_servers
-- user_settings, knowledge_sources
-- subscriptions, usage_metrics (if billing enabled)
```

---

## Docker Container Deployment

### Service Architecture

```
                    ┌─────────────────────────────────┐
                    │     nginx (ports 80, 7861)      │
                    │   - Frontend proxy (/)          │
                    │   - Backend proxy (/api/)       │
                    │   - Langflow proxy (:7861)      │
                    └─────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
    ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
    │    Frontend     │   │     Backend     │   │    Langflow     │
    │  (React/Vite)   │   │    (FastAPI)    │   │   :7860         │
    │    :3001        │   │     :8000       │   │                 │
    └─────────────────┘   └─────────────────┘   └─────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │   PostgreSQL    │
                          │     :5432       │
                          └─────────────────┘
```

### Build Production Images

```bash
# Build all images
docker-compose -f docker-compose.yml build

# Or build individually
docker build -t teachcharlie-backend ./src/backend
docker build -t teachcharlie-frontend --target production ./src/frontend
```

### Deploy to Cloud

**Option 1: Docker Compose on VM**

```bash
# Copy files to production server
scp -r . user@server:/opt/teachcharlie

# SSH to server
ssh user@server

# Navigate to project
cd /opt/teachcharlie

# Pull latest images
docker-compose pull langflow

# Build custom images
docker-compose build

# Start services
docker-compose up -d

# Verify
docker-compose ps
docker-compose logs -f
```

**Option 2: Container Registry + Kubernetes**

```bash
# Tag and push to registry (e.g., Docker Hub, ECR, GCR)
docker tag teachcharlie-backend registry.example.com/teachcharlie-backend:v1
docker push registry.example.com/teachcharlie-backend:v1

docker tag teachcharlie-frontend registry.example.com/teachcharlie-frontend:v1
docker push registry.example.com/teachcharlie-frontend:v1

# Deploy via Kubernetes (create deployment manifests)
kubectl apply -f k8s/
```

### SSL/TLS Configuration

**Option 1: Let's Encrypt with Certbot**

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

**Option 2: Cloudflare (Recommended)**

1. Add domain to Cloudflare
2. Update nameservers
3. Enable "Full (strict)" SSL mode
4. Cloudflare handles SSL termination

### Production nginx.conf Updates

Update `nginx/nginx.conf` for production:

```nginx
# Change server_name
server_name yourdomain.com www.yourdomain.com;

# Add SSL (if not using Cloudflare)
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Post-Deployment Verification

### Health Check Endpoints

```bash
# Backend health
curl https://yourdomain.com/api/health
# Expected: {"status":"healthy","database":"connected"}

# Langflow health (via proxy)
curl https://yourdomain.com:7861/health_check
# Expected: {"status":"ok","chat":"ok","db":"ok"}

# nginx health
curl https://yourdomain.com/health
# Expected: "healthy"
```

### Functional Testing

- [ ] **Homepage loads**: Visit https://yourdomain.com
- [ ] **Sign up works**: Create a new account via Clerk
- [ ] **Sign in works**: Log in with existing account
- [ ] **Dashboard loads**: Access /dashboard after login
- [ ] **Create agent**: Complete 3-step wizard successfully
- [ ] **Playground chat**: Send message, receive response
- [ ] **Multi-turn chat**: Continue conversation, context retained
- [ ] **Knowledge source**: Add text, verify RAG search works
- [ ] **Publish agent**: Publish to Langflow sidebar
- [ ] **Langflow canvas**: View agent flow in canvas viewer
- [ ] **Settings page**: Update user settings

### Performance Testing

```bash
# Basic load test with curl
for i in {1..10}; do
  curl -w "%{time_total}\n" -o /dev/null -s https://yourdomain.com/api/health
done

# Expected: Response times < 200ms
```

---

## Monitoring Setup

### Error Tracking (Sentry)

1. Create account at https://sentry.io
2. Create new project (Python/FastAPI)
3. Get DSN from project settings
4. Add to environment variables:

```bash
SENTRY_DSN=https://xxxx@sentry.io/xxxxx
```

5. Install Sentry SDK (already in requirements.txt):

```python
# In backend main.py
import sentry_sdk
sentry_sdk.init(dsn=os.getenv("SENTRY_DSN"), environment="production")
```

### Uptime Monitoring

**UptimeRobot (Free)**:
1. Create account at https://uptimerobot.com
2. Add monitors:
   - https://yourdomain.com/api/health (HTTP 200)
   - https://yourdomain.com/health (HTTP 200)
3. Configure email/Slack alerts

**Better Uptime (Alternative)**:
1. Create account at https://betteruptime.com
2. Add status page
3. Configure incident alerts

### Application Logging

Configure structured logging in production:

```python
# backend/app/main.py
import logging
import json

class JSONFormatter(logging.Formatter):
    def format(self, record):
        return json.dumps({
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module
        })

# Use with cloud logging (CloudWatch, Datadog, etc.)
```

### Database Backup Schedule

**Automated Daily Backups**:

```bash
#!/bin/bash
# backup.sh - Run via cron daily

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="teachcharlie_backup_${DATE}.sql.gz"

pg_dump $DATABASE_URL | gzip > /backups/$BACKUP_FILE

# Upload to S3/cloud storage
aws s3 cp /backups/$BACKUP_FILE s3://your-bucket/backups/

# Cleanup local backups older than 7 days
find /backups -name "*.sql.gz" -mtime +7 -delete
```

**Cron Schedule**:
```bash
# Daily at 2 AM
0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
```

### Resource Monitoring

Monitor these metrics:
- [ ] CPU usage per container
- [ ] Memory usage per container
- [ ] Database connection pool
- [ ] Response time (P50, P95, P99)
- [ ] Error rate
- [ ] LLM API costs

---

## Security Checklist

### Authentication & Authorization

- [ ] DEV_MODE=false (Clerk auth enabled)
- [ ] CLERK_SECRET_KEY is production key (sk_live_*)
- [ ] JWT validation enabled on all API routes
- [ ] CORS origins restricted to production domain only
- [ ] Rate limiting enabled (100 requests/minute)

### Secrets Management

- [ ] No secrets in git repository
- [ ] `.env` file not committed (in .gitignore)
- [ ] Production secrets stored securely (cloud provider secrets manager)
- [ ] ENCRYPTION_KEY backed up securely (required for decrypting user API keys)

### Network Security

- [ ] PostgreSQL not exposed externally (internal only)
- [ ] Langflow not exposed externally (via nginx proxy only)
- [ ] HTTPS enforced (redirect HTTP to HTTPS)
- [ ] Security headers configured in nginx:
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection: 1; mode=block
  - X-Frame-Options: SAMEORIGIN (except for Langflow iframe)

### Container Security

- [ ] Containers run as non-root user (where possible)
- [ ] Docker socket access limited to backend only
- [ ] Base images updated regularly
- [ ] No unnecessary packages installed

### Data Protection

- [ ] User API keys encrypted at rest (ENCRYPTION_KEY)
- [ ] Database connections use SSL
- [ ] Backups encrypted
- [ ] PII handling compliant with regulations

---

## Rollback Plan

### Preparation

Before deploying:
1. Tag current production version: `git tag v1.0.0-pre-deploy`
2. Create database backup: `pg_dump > backup_before_deploy.sql`
3. Document current container image tags

### Rollback Procedure

**Step 1: Stop Current Deployment**
```bash
docker-compose down
```

**Step 2: Restore Previous Version**
```bash
# Checkout previous tag
git checkout v1.0.0-pre-deploy

# Rebuild containers
docker-compose build

# Start services
docker-compose up -d
```

**Step 3: Restore Database (if needed)**
```bash
# Only if schema changes caused issues
psql $DATABASE_URL < backup_before_deploy.sql
```

**Step 4: Verify Rollback**
```bash
# Check health
curl https://yourdomain.com/api/health

# Test critical flows
# - Login
# - Create agent
# - Chat
```

### Rollback Triggers

Initiate rollback if:
- Error rate > 5% for 5 minutes
- Health endpoints returning errors
- Database connection failures
- Authentication completely broken
- Data corruption detected

### Contact Information

- **On-Call**: [Your contact info]
- **Escalation**: [Backup contact]
- **Hosting Provider Support**: [Support URL/email]

---

## Cost Estimation

### Monthly Operating Costs

| Service | Provider | Monthly Cost | Notes |
|---------|----------|-------------|-------|
| **Hosting** | Railway / Render | $20-100 | Depends on usage |
| **PostgreSQL** | Supabase / Neon | $0-25 | Free tier available |
| **Redis** | Redis Cloud | $0-5 | Free 30MB tier |
| **Clerk Auth** | Clerk | $0-25 | Free up to 10K MAU |
| **Domain** | Namecheap | $1-2 | Annualized |
| **SSL** | Cloudflare | $0 | Free tier |
| **Monitoring** | Sentry | $0 | Free 5K errors/month |
| **Uptime** | UptimeRobot | $0 | Free 50 monitors |
| **LLM APIs** | OpenAI/Anthropic | $10-100 | Usage-based |
| **TOTAL** | | **$30-260/month** | Within $100-500 budget |

### LLM Cost Control

- Default to gpt-3.5-turbo ($0.002/1K tokens)
- Allow users to bring their own API keys
- Set token limits per request
- Track usage per user

---

## Quick Reference Commands

```bash
# ============================================================================
# Development
# ============================================================================
docker-compose up -d                    # Start all services
docker-compose logs -f langflow         # View Langflow logs
docker-compose exec backend bash        # Shell into backend container

# ============================================================================
# Deployment
# ============================================================================
docker-compose -f docker-compose.yml build  # Build images
docker-compose up -d --force-recreate       # Deploy with fresh containers
docker-compose ps                           # Check service status

# ============================================================================
# Database
# ============================================================================
cd src/backend && alembic upgrade head      # Run migrations
cd src/backend && alembic current           # Check migration status
pg_dump $DATABASE_URL > backup.sql          # Backup database

# ============================================================================
# Troubleshooting
# ============================================================================
docker-compose logs --tail=100 backend      # Recent backend logs
docker exec -it teachcharlie-langflow bash  # Shell into Langflow
curl http://localhost:8000/health           # Check backend health
curl http://localhost:7860/health_check     # Check Langflow health

# ============================================================================
# Rollback
# ============================================================================
docker-compose down                         # Stop services
git checkout <previous-tag>                 # Restore code
docker-compose build && docker-compose up -d  # Redeploy
```

---

## Document History

| Date | Change |
|------|--------|
| 2026-01-14 | Initial creation - comprehensive deployment checklist |

---

**Next Steps After Deploy**:
1. Monitor for 24-48 hours
2. Fix any issues found
3. Invite 5-10 beta testers
4. Collect feedback
5. Iterate on MVP
