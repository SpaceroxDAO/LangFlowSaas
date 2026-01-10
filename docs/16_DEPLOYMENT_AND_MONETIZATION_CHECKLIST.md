# Deployment & Monetization Checklist

**Created**: 2026-01-09
**Status**: Pre-Production Planning
**Owner**: Adam (Product) + Claude Code (Technical)

This document outlines everything needed to take Teach Charlie AI from MVP to a production-ready, monetized platform.

---

## Table of Contents

1. [Infrastructure Requirements](#part-1-infrastructure-requirements)
2. [Monetization Requirements](#part-2-monetization-requirements)
3. [Services to Sign Up For](#part-3-services-to-sign-up-for)
4. [Credentials & API Keys Needed](#part-4-credentials--api-keys-needed)
5. [Implementation Roadmap](#part-5-implementation-roadmap)

---

## Part 1: Infrastructure Requirements

### 1.1 Critical Blockers (Must Have Before Launch)

| Item | Current State | What's Needed | Priority | Effort |
|------|---------------|---------------|----------|--------|
| **CI/CD Pipeline** | Not implemented | GitHub Actions for automated testing and deployment | CRITICAL | 4-6 hrs |
| **SSL/TLS Certificates** | Not configured | HTTPS via Let's Encrypt or cloud provider | CRITICAL | 1-2 hrs |
| **Production Environment Variables** | Dev values only | Create `.env.production` with real credentials | CRITICAL | 1 hr |
| **Redis for Rate Limiting** | In-memory (won't scale) | Redis instance for distributed rate limiting | CRITICAL | 2-4 hrs |
| **Database Backups** | Not configured | Automated pg_dump + cloud storage | HIGH | 2-3 hrs |
| **Monitoring & Alerting** | Not configured | Sentry for errors, uptime monitoring | HIGH | 2-3 hrs |
| **Production Docker Config** | Dev config only | `docker-compose.prod.yml` with production settings | HIGH | 2-3 hrs |

### 1.2 CI/CD Pipeline Details

**What needs to be created:** `.github/workflows/`

```yaml
# Files to create:
.github/
├── workflows/
│   ├── test.yml           # Run E2E tests on every PR
│   ├── build.yml          # Build and push Docker images
│   ├── deploy.yml         # Deploy to production on main branch merge
│   └── security.yml       # Run security scans (optional)
```

**Test workflow should:**
- Install dependencies
- Run Playwright E2E tests
- Fail the PR if tests don't pass

**Deploy workflow should:**
- Build Docker images
- Push to container registry
- SSH to production server and pull/restart containers

### 1.3 SSL/TLS Configuration

**Options:**
1. **Let's Encrypt (Free)** - Use Certbot with nginx
2. **Cloud Provider** - AWS Certificate Manager, Cloudflare, etc.
3. **DataStax** - May provide SSL as part of hosting

**Nginx SSL config needed:**
```nginx
server {
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    # ... rest of config
}
```

### 1.4 Redis Setup

**Current problem:** Rate limiter uses in-memory storage, resets on restart, doesn't work with multiple backend instances.

**Solution:** Add Redis service to docker-compose:

```yaml
redis:
  image: redis:7-alpine
  volumes:
    - redis_data:/data
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
```

**Backend changes needed:**
- Install `redis` Python package
- Update rate limiter to use Redis
- Add `REDIS_URL` environment variable

### 1.5 Database Backups

**Strategy:**
1. Daily automated backups via cron
2. Store in S3/cloud storage
3. 30-day retention
4. Test restore procedure monthly

**Backup script:**
```bash
#!/bin/bash
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz
# Upload to S3/cloud storage
```

### 1.6 Monitoring Setup

**Error Tracking (Sentry):**
- Capture all unhandled exceptions
- Track API errors
- Alert on error rate spikes

**Uptime Monitoring:**
- Ping `/health` endpoint every minute
- Alert if down for 5+ minutes
- Options: UptimeRobot (free), Pingdom, Better Uptime

**Application Performance (Optional for MVP):**
- Response time tracking
- Database query performance
- Options: Datadog, New Relic

### 1.7 Production Docker Configuration

**Create `docker-compose.prod.yml`:**

Key differences from development:
- No hot reload
- Production environment variables
- Redis service included
- Proper resource limits
- Health checks on all services
- SSL termination at nginx

---

## Part 2: Monetization Requirements

### 2.1 Recommended Pricing Model

Based on competitor analysis (MindStudio, Botpress, Relevance AI, Voiceflow, Gumloop, Dify):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PRICING TIERS                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FREE                       PRO ($29/mo)          TEAM ($79/mo)            │
│  ────                       ────────────          ─────────────            │
│  • 3 agents                 • 10 agents           • Unlimited agents       │
│  • 100 messages/day         • 1,000 messages/day  • 5,000 messages/day     │
│  • 1 project                • 5 projects          • Unlimited projects     │
│  • Community support        • Email support       • Priority support       │
│  • Playground only          • Custom components   • Team collaboration     │
│                             • Canvas unlock       • API access             │
│                             • Export/embed        • White-label            │
│                                                                             │
│  AI USAGE: Pass-through at cost (no markup) OR BYO API keys                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Database Schema Additions

**New tables needed:**

```sql
-- 1. Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255) UNIQUE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    plan VARCHAR(50) NOT NULL DEFAULT 'free',  -- 'free', 'pro', 'team'
    status VARCHAR(50) NOT NULL DEFAULT 'active',  -- 'active', 'canceled', 'past_due', 'trialing'
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Usage metrics table (for metering)
CREATE TABLE usage_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,  -- 'messages', 'tokens', 'agents_created'
    value INTEGER NOT NULL DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, metric_type, period_start)
);

-- 3. Billing events (audit log)
CREATE TABLE billing_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    event_type VARCHAR(100) NOT NULL,  -- 'subscription.created', 'payment.succeeded', etc.
    stripe_event_id VARCHAR(255),
    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Add plan field to users table
ALTER TABLE users ADD COLUMN plan VARCHAR(50) DEFAULT 'free';
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);
```

### 2.3 Backend API Endpoints Needed

**New billing router (`/api/v1/billing/`):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/checkout` | Create Stripe checkout session for upgrade |
| `POST` | `/portal` | Create Stripe customer portal session |
| `GET` | `/subscription` | Get current subscription status |
| `POST` | `/webhook` | Handle Stripe webhook events |
| `GET` | `/invoices` | List past invoices |

**New usage router (`/api/v1/usage/`):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/current` | Get current billing period usage |
| `GET` | `/history` | Get usage history by period |
| `GET` | `/limits` | Get plan limits and current usage |

### 2.4 Backend Services Needed

**1. SubscriptionService (`subscription_service.py`):**
- Create/update/cancel subscriptions
- Sync with Stripe
- Check plan status

**2. UsageService (`usage_service.py`):**
- Track message usage
- Track agent creation
- Check quota limits
- Report usage to Stripe

**3. BillingService (`billing_service.py`):**
- Handle Stripe webhooks
- Process subscription events
- Manage customer portal

### 2.5 Quota Enforcement Middleware

**What needs to happen:**
- Check user's plan before allowing actions
- Enforce daily message limits
- Enforce agent creation limits
- Return friendly error messages when limits hit

**Example implementation:**

```python
# middleware/quota_enforcement.py
async def check_message_quota(user: User) -> bool:
    """Check if user can send more messages today."""
    usage = await usage_service.get_today_usage(user.id, 'messages')
    limit = PLAN_LIMITS[user.plan]['messages_per_day']
    return usage < limit
```

### 2.6 Frontend Components Needed

| Component | Description |
|-----------|-------------|
| **PricingPage** | Public pricing page with tier comparison |
| **BillingPage** | User's subscription management (in settings) |
| **UsageDashboard** | Show current usage vs limits |
| **UpgradeModal** | Prompt to upgrade when hitting limits |
| **PaymentSuccessPage** | After successful checkout |

### 2.7 Stripe Integration Points

**1. Checkout Flow:**
- User clicks "Upgrade to Pro"
- Backend creates Stripe Checkout Session
- User redirected to Stripe-hosted payment page
- On success, redirected back to app
- Webhook updates subscription in database

**2. Customer Portal:**
- User clicks "Manage Subscription"
- Backend creates Portal Session
- User can update payment method, cancel, view invoices

**3. Webhook Events to Handle:**
- `checkout.session.completed` - New subscription
- `customer.subscription.updated` - Plan change
- `customer.subscription.deleted` - Cancellation
- `invoice.payment_failed` - Failed payment
- `invoice.paid` - Successful payment

---

## Part 3: Services to Sign Up For

### 3.1 Required Services (Must Have)

| Service | Purpose | Free Tier | Paid Tier | Sign Up URL |
|---------|---------|-----------|-----------|-------------|
| **Stripe** | Payment processing | Free (2.9% + $0.30 per transaction) | Same | https://dashboard.stripe.com/register |
| **Sentry** | Error tracking | 5K errors/month free | $26/mo | https://sentry.io/signup/ |
| **Redis Cloud** | Rate limiting & caching | 30MB free | $5/mo | https://redis.com/try-free/ |
| **Domain Registrar** | Custom domain | N/A | $10-15/year | Namecheap, Cloudflare, Google Domains |

### 3.2 Recommended Services (Should Have)

| Service | Purpose | Free Tier | Paid Tier | Sign Up URL |
|---------|---------|-----------|-----------|-------------|
| **UptimeRobot** | Uptime monitoring | 50 monitors free | $7/mo | https://uptimerobot.com/ |
| **Resend** | Transactional email | 100 emails/day free | $20/mo | https://resend.com/signup |
| **Cloudflare** | CDN + SSL + DDoS | Free tier available | $20/mo | https://dash.cloudflare.com/sign-up |

### 3.3 Optional Services (Nice to Have)

| Service | Purpose | Free Tier | Paid Tier | Sign Up URL |
|---------|---------|-----------|-----------|-------------|
| **PostHog** | Product analytics | 1M events/month free | $0+ | https://app.posthog.com/signup |
| **Datadog** | APM & monitoring | 14-day trial | $15/host/mo | https://www.datadoghq.com/ |
| **GitHub Actions** | CI/CD | 2000 min/month free | $4/mo | Already have with GitHub |

### 3.4 Services You Already Have

| Service | Status | Notes |
|---------|--------|-------|
| **Clerk** | Configured | Authentication |
| **OpenAI** | Configured | Avatar generation + LLM |
| **Anthropic** | Configured (optional) | Alternative LLM |
| **DataStax** | Planned | Langflow hosting |
| **PostgreSQL** | Configured | Database |

---

## Part 4: Credentials & API Keys Needed

### 4.1 What to Provide (After Signing Up)

Once you sign up for the services above, you'll need to provide the following:

#### Stripe (Required for Monetization)
```bash
# From Stripe Dashboard > Developers > API Keys
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx  # or pk_test_ for testing
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx       # or sk_test_ for testing

# From Stripe Dashboard > Developers > Webhooks
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Stripe Product/Price IDs (you'll create these in Stripe Dashboard)
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx       # Pro monthly price
STRIPE_TEAM_PRICE_ID=price_xxxxxxxxxxxxx      # Team monthly price
```

#### Sentry (Required for Monitoring)
```bash
# From Sentry > Settings > Projects > Client Keys (DSN)
SENTRY_DSN=https://xxxxxxxxxxxxx@sentry.io/xxxxx
```

#### Redis (Required for Rate Limiting)
```bash
# From Redis Cloud > Database > Connect
REDIS_URL=redis://default:password@redis-xxxxx.cloud.redislabs.com:12345
```

#### Domain & SSL
```bash
# Your domain name
DOMAIN=teachcharlie.ai  # or whatever domain you register

# SSL will be auto-configured via Let's Encrypt or Cloudflare
```

#### Email (Optional but Recommended)
```bash
# From Resend Dashboard > API Keys
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=noreply@teachcharlie.ai
```

### 4.2 Credentials You Already Have (Verify These)

```bash
# Clerk (Authentication)
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx

# OpenAI (Avatars + LLM)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# Database
DATABASE_URL=postgresql://user:password@host:5432/teachcharlie

# Encryption (generate if not set)
ENCRYPTION_KEY=xxxxxxxxxxxxx  # Generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### 4.3 Stripe Setup Steps

After signing up for Stripe:

1. **Create Products in Stripe Dashboard:**
   - Product 1: "Teach Charlie Pro" - $29/month
   - Product 2: "Teach Charlie Team" - $79/month

2. **Get Price IDs:**
   - Go to Products > Click product > Copy Price ID

3. **Set Up Webhook:**
   - Go to Developers > Webhooks > Add endpoint
   - URL: `https://yourdomain.com/api/v1/billing/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`

4. **Enable Customer Portal:**
   - Go to Settings > Customer portal
   - Enable and configure options

---

## Part 5: Implementation Roadmap

### Phase 1: Infrastructure (Week 1)

| Day | Task | Deliverable |
|-----|------|-------------|
| 1 | Set up CI/CD pipeline | `.github/workflows/` files |
| 2 | Add Redis to stack | `docker-compose.yml` updated |
| 2 | Update rate limiter to use Redis | `rate_limit.py` updated |
| 3 | Configure SSL/domain | HTTPS working |
| 4 | Set up Sentry monitoring | Error tracking live |
| 5 | Create production docker-compose | `docker-compose.prod.yml` |
| 5 | Set up database backups | Backup script + cron |

### Phase 2: Billing Foundation (Week 2)

| Day | Task | Deliverable |
|-----|------|-------------|
| 1 | Create database migrations | Subscription/usage tables |
| 2 | Implement Stripe checkout | `/api/v1/billing/checkout` |
| 3 | Implement webhook handler | `/api/v1/billing/webhook` |
| 4 | Implement customer portal | `/api/v1/billing/portal` |
| 5 | Test end-to-end checkout flow | Working payment flow |

### Phase 3: Usage Metering (Week 3)

| Day | Task | Deliverable |
|-----|------|-------------|
| 1 | Create usage tracking middleware | Message counting |
| 2 | Implement quota enforcement | Limits enforced |
| 3 | Create usage API endpoints | `/api/v1/usage/*` |
| 4 | Build usage dashboard UI | Frontend component |
| 5 | Build upgrade modal | Upsell when limits hit |

### Phase 4: Polish & Launch (Week 4)

| Day | Task | Deliverable |
|-----|------|-------------|
| 1 | Create pricing page | Public pricing page |
| 2 | Create billing settings page | User billing management |
| 3 | End-to-end testing | All flows working |
| 4 | Load testing | Performance verified |
| 5 | Production deployment | Live! |

---

## Quick Start: What To Do Now

### Step 1: Sign Up for Services (Do Today)

1. **Stripe** - https://dashboard.stripe.com/register
   - Sign up and verify your business
   - Get API keys from Developers section

2. **Sentry** - https://sentry.io/signup/
   - Create project for Python/FastAPI
   - Get DSN

3. **Redis Cloud** - https://redis.com/try-free/
   - Create free 30MB database
   - Get connection URL

4. **Domain** (if you don't have one)
   - Register `teachcharlie.ai` or similar
   - Point DNS to your server

### Step 2: Provide Credentials

After signing up, create a secure note or message with:

```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (after creating webhook)
SENTRY_DSN=https://...@sentry.io/...
REDIS_URL=redis://...
DOMAIN=yourdomain.com
```

### Step 3: We Build It

Once you provide the credentials, I can:
1. Set up CI/CD pipeline
2. Add Redis and update rate limiting
3. Configure Sentry integration
4. Create all billing infrastructure
5. Build usage tracking and quotas
6. Create frontend billing UI

---

## Cost Summary

### Monthly Operating Costs (Estimated)

| Service | Cost | Notes |
|---------|------|-------|
| DataStax/Hosting | $0-100 | Depends on usage |
| Clerk Auth | $0-25 | Free up to 10K MAU |
| OpenAI | $5-50 | Avatar generation + user LLM usage |
| Stripe | 2.9% + $0.30 | Per transaction |
| Redis Cloud | $0-5 | Free tier likely sufficient |
| Sentry | $0 | Free tier |
| Domain | $1-2 | Annualized |
| UptimeRobot | $0 | Free tier |
| **Total** | **$10-185/month** | Well within $100-500 budget |

### Revenue Potential

| Scenario | Users | Pro (30%) | Team (5%) | MRR |
|----------|-------|-----------|-----------|-----|
| Conservative | 100 | 30 | 5 | $1,265 |
| Target | 300 | 90 | 15 | $3,795 |
| Optimistic | 500 | 150 | 25 | $6,325 |

---

## Document History

| Date | Change |
|------|--------|
| 2026-01-09 | Initial creation |

