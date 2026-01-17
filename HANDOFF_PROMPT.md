# Teach Charlie AI - Continue Building Phases B, C, D

## Project Context
Teach Charlie AI is an educational wrapper around Langflow for building AI agents. It's being built by a solo, non-technical founder using AI-assisted development.

## Current State (as of 2026-01-14)
- **Git**: Branch `main`, commit `9675d4b` - Phase A complete
- **Working directory**: `/Users/adamcognigy/LangflowSaaS`
- **Docker**: 5 containers running (nginx, frontend, backend, langflow, postgres)

## Just Completed: Phase A - Core Features
1. **Agent Presets** ✅
   - 8 default templates (Customer Support, Document Q&A, Sales, etc.)
   - Model: `src/backend/app/models/agent_preset.py`
   - API: `src/backend/app/api/agent_presets.py`
   - Frontend: Preset selection in CreateAgentPage Step 1
   - Auto-seeds on startup via `main.py`

2. **MCP Server Auto-Sync** ✅
   - Auto-syncs to `.mcp.json` after all CRUD operations
   - Startup sync in `main.py` lifespan handler
   - Service: `src/backend/app/services/mcp_server_service.py`

3. **Vector RAG** - Deferred
   - Keyword-based fallback works reliably
   - Vector ingestion needs manual Langflow UI export to fix

## Your Task: Implement Phases B, C, D

### Phase B: Production Safety
1. **Multi-tenancy & User Isolation**
   - Currently single-user agents only
   - Need: Strict user_id filtering on all queries
   - Add organization/team support (optional)

2. **Rate Limiting**
   - No limits on API calls or LLM usage currently
   - Add: Per-user request limits, LLM token tracking
   - Prevent runaway costs

3. **Error Monitoring**
   - Add Sentry integration for production visibility
   - Configure error tracking in `main.py`

### Phase C: Monetization
1. **Stripe Integration**
   - Add subscription billing
   - Create pricing tiers (Free, Pro, Enterprise)

2. **Usage Tracking**
   - Track LLM tokens per user
   - Conversation limits per tier

3. **Feature Gating**
   - Gate advanced features by subscription tier
   - Enforce limits in API endpoints

### Phase D: Growth Features
1. **Analytics Dashboard**
   - User engagement metrics
   - Agent usage statistics

2. **Mission System**
   - Already documented in `docs/06_MISSION_BASED_LEARNING_SYSTEM.md`
   - 40-mission gamified curriculum

3. **Embeddable Widget**
   - JavaScript snippet for external sites
   - Deploy agents outside the platform

## Key Files & Architecture

```
src/backend/
├── app/
│   ├── api/           # FastAPI routers (104 endpoints)
│   ├── models/        # SQLAlchemy models (11 tables)
│   ├── services/      # Business logic (20 service classes)
│   ├── config.py      # Environment configuration
│   └── main.py        # App entry point with lifespan
├── alembic/           # Database migrations
└── templates/         # Flow templates

src/frontend/
├── src/
│   ├── pages/         # React pages (13 components)
│   ├── components/    # Shared components
│   ├── lib/api.ts     # API client
│   └── types/         # TypeScript interfaces
└── e2e/tests/         # Playwright tests (21 files, 580+ cases)
```

## Commands
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Run E2E tests
cd src/frontend && npm run test:e2e

# Database migration
cd src/backend && python3 -m alembic upgrade head
```

## Important Notes
- Read `CLAUDE.md` for full project context and coding guidelines
- Read `docs/03_STATUS.md` for current project status
- MVP is feature-complete, now building toward full SaaS
- Use Docker Compose (not standalone Langflow)
- Clerk for auth (DEV_MODE bypasses in development)

Please start by reading the status docs, then plan and implement Phases B, C, and D to complete the full SaaS product.
