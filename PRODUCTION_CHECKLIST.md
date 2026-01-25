# Production Deployment Checklist

Use this checklist before deploying Teach Charlie AI to production.

## Pre-Deployment

### Security Configuration

- [ ] `DEV_MODE=false` - Authentication is REQUIRED
- [ ] `ENVIRONMENT=production`
- [ ] `DEBUG=false`
- [ ] Clerk keys are production (`pk_live_`, `sk_live_`)
- [ ] `ENCRYPTION_KEY` is set (Fernet format, 44 chars)
- [ ] All passwords are strong (20+ chars, random)
- [ ] `.env.production` is NOT committed to git
- [ ] No hardcoded secrets in code

### Database

- [ ] PostgreSQL running and accessible
- [ ] Database user has limited privileges (not superuser)
- [ ] Migrations applied: `alembic upgrade head`
- [ ] Backup strategy in place

### SSL/TLS

- [ ] SSL certificate installed
- [ ] Certificate is valid (not expired)
- [ ] HTTPS redirect enabled in nginx
- [ ] HSTS header enabled

### Infrastructure

- [ ] Docker images pinned to specific versions
- [ ] Health checks configured for all services
- [ ] Internal services not exposed (postgres, redis)
- [ ] Redis password set (if using external)

## Deployment

### Services

- [ ] All containers started: `docker-compose ps`
- [ ] No restart loops: `docker-compose logs`
- [ ] Backend health: `curl https://domain.com/health`
- [ ] Frontend loads without errors
- [ ] Langflow accessible via iframe

### External Service Connectivity (CRITICAL)

Verify backend can reach external services. Run from the server:

```bash
# Test Clerk JWKS access (REQUIRED for authentication)
docker exec teachcharlie-backend curl -s https://clerk.teachcharlie.ai/.well-known/jwks.json | head -1
# Should return: {"keys":[...

# Test OpenAI API access (needed for LLM features)
docker exec teachcharlie-backend curl -s -I https://api.openai.com/v1/models | head -1
# Should return: HTTP/2 401 (API reachable, key needed)

# Test from Langflow (needed for LLM features)
docker exec teachcharlie-langflow curl -s -I https://api.openai.com/v1/models | head -1
# Should return: HTTP/2 401 (API reachable, key needed)
```

**If these fail with "Temporary failure in name resolution":**
The container is missing from the `teachcharlie-public` network. Check `docker-compose.prod.yml` and ensure the service has:
```yaml
networks:
  - teachcharlie-internal
  - teachcharlie-public  # <-- Add this for external API access
```

**Startup logs should show:**
```
✅ Clerk JWKS reachable
✅ OpenAI API reachable
✅ Anthropic API reachable
```

### Functional Testing

- [ ] User can sign in via Clerk
- [ ] User can create agent via 3-step wizard
- [ ] Chat works in playground
- [ ] Langflow canvas loads and is interactive
- [ ] File upload works for knowledge sources

### Security Headers

Verify with: `curl -I https://domain.com/health`

- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Strict-Transport-Security` present
- [ ] `Content-Security-Policy` present

## Post-Deployment

### Monitoring

- [ ] Sentry configured and receiving events
- [ ] Log aggregation set up (optional)
- [ ] Uptime monitoring configured

### Documentation

- [ ] DEPLOYMENT.md reviewed
- [ ] Team knows how to restart services
- [ ] Rollback procedure documented

### Backup

- [ ] Database backup tested
- [ ] Backup schedule configured
- [ ] Recovery procedure tested

---

## Emergency Contacts

| Role | Contact |
|------|---------|
| DevOps | |
| Backend | |
| Security | |

## Rollback Procedure

```bash
# Quick rollback to previous version
docker-compose -f docker-compose.prod.yml down
git checkout <previous-commit>
docker-compose -f docker-compose.prod.yml up -d --build

# Rollback database (if needed)
docker-compose exec postgres psql -U teachcharlie -d teachcharlie < backup.sql
```
