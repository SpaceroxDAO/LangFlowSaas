# Claude Code Instructions for Teach Charlie AI

**Project**: Teach Charlie AI - Educational AI Agent Builder
**Last Updated**: 2026-01-24
**Architecture**: Lightweight wrapper around Langflow (NOT a deep fork)
**Status**: MVP Complete (Phase 13) - Ready for Production Deploy

## 🎯 Project Philosophy

> "We're not innovating on Langflow - we're packaging it brilliantly for a market that's desperate to learn."

**Critical Context**:
- Solo, non-technical founder using AI-assisted development
- MVP COMPLETE as of 2026-01-14 (Phases 0-13 done)
- Platform is workshop-ready with 15+ E2E tests passing
- See `docs/03_STATUS.md` for detailed current status

**Core Strategy**: Build custom educational layer (3-step Q&A, playground) on top of unmodified Langflow. Minimize Langflow core modifications.

## 📁 Project Structure

```
LangflowSaaS/
├── docs/                          # Comprehensive documentation
│   ├── 00_PROJECT_SPEC.md         # Product requirements, personas, success criteria
│   ├── 01_ARCHITECTURE.md         # Technical architecture, DB schema, APIs
│   ├── 02_CHANGELOG.md            # Major decisions & rationale
│   ├── 03_STATUS.md               # Current status, next steps, risks
│   └── 07_BEST_PRACTICES_FIXES.md # Security audit & remediation
├── src/
│   ├── frontend/                  # React + Vite + TypeScript UI
│   │   ├── src/
│   │   │   ├── pages/             # Page components (Create, Edit, Playground, etc.)
│   │   │   ├── components/        # Reusable components
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   ├── providers/         # Context providers
│   │   │   └── lib/               # Utilities and API client
│   │   ├── e2e/tests/             # Playwright E2E tests (28 files)
│   │   └── package.json
│   └── backend/                   # FastAPI Python backend
│       ├── app/
│       │   ├── api/               # 21 API routers (140+ endpoints)
│       │   ├── models/            # 18 SQLAlchemy models
│       │   ├── services/          # 20 business logic services
│       │   ├── schemas/           # Pydantic request/response schemas
│       │   ├── middleware/        # Auth, rate limiting, security headers
│       │   └── config.py          # Centralized configuration
│       ├── alembic/versions/      # Database migrations (18 files)
│       ├── templates/             # Langflow flow templates
│       ├── tests/                 # Pytest unit tests
│       └── requirements.txt
├── nginx/                         # Reverse proxy configuration
│   ├── nginx.conf                 # Development config
│   ├── nginx.prod.conf            # Production config
│   └── overlay/                   # White-label CSS/JS injection
├── docker-compose.yml             # Development services
├── docker-compose.prod.yml        # Production services
├── docker-compose.dev.yml         # Local dev (minimal)
├── .env.example                   # Environment variables template
├── CLAUDE.md                      # This file
└── README.md                      # Project overview
```

## 🚀 Common Bash Commands

### Development Setup (Docker Compose - REQUIRED)

> ⛔ **CRITICAL WARNING - READ THIS FIRST**
>
> This project uses Docker Compose for Langflow and PostgreSQL. **NEVER USE:**
> - ❌ **Langflow Desktop App** (uses separate SQLite database, will break sync)
> - ❌ `langflow run` command directly
> - ❌ Any standalone Langflow installation
> - ❌ SQLite database for development
>
> **Why?** Langflow Desktop uses its own SQLite database at `~/.langflow/`. Our project uses
> PostgreSQL in Docker. Workflows created with Desktop won't sync with Docker Langflow,
> causing "flow not found" errors in the canvas.

```bash
# Start Docker services (PostgreSQL + Langflow + nginx)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f langflow

# Check status
docker-compose -f docker-compose.dev.yml ps

# Stop all services
docker-compose -f docker-compose.dev.yml down

# Verify Langflow is running
curl http://localhost:7860/health
# Should return: {"status":"ok"}
```

> **If you accidentally used Langflow Desktop**: Run the workflow repair endpoint
> to recreate missing flows: `POST /api/v1/workflows/{id}/repair`

### Frontend Development
```bash
cd src/frontend
npm install
npm run dev
# Frontend runs at http://localhost:3001
```

### Backend Development
```bash
cd src/backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# Backend runs at http://localhost:8000
```

### Testing
```bash
# Run E2E tests (Playwright) - from frontend directory
cd src/frontend
npx playwright test

# Run specific test file
npx playwright test e2e/tests/onboarding.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Generate Playwright test report
npx playwright show-report

# Run frontend unit tests (Vitest)
npm run test

# Run backend unit tests (Pytest) - from backend directory
cd src/backend
pytest tests/
```

### Database Migrations
```bash
# Create migration (Alembic)
alembic revision --autogenerate -m "Add agents table"

# Run migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1
```

### Git & Deployment
```bash
# Push to GitHub
git add .
git commit -m "feat: Add 3-step Q&A onboarding"
git push origin main

# Deploy to DataStax (future)
# Follow RAGStack AI Langflow deployment guide
# https://github.com/datastax/ragstack-ai-langflow
```

## 💻 Code Style Guidelines

### TypeScript/React (Frontend)
- Use **ES modules** (`import/export`), not CommonJS
- Use **functional components** with hooks, not class components
- Use **TypeScript** for new files (strongly typed)
- Component naming: PascalCase (e.g., `OnboardingWizard.tsx`)
- Use **Tailwind CSS** or Langflow's existing styling (don't add new CSS frameworks)
- State management: Consider **Zustand** or **Jotai** (lightweight, not Redux)

### Python (Backend)
- Use **FastAPI** async/await patterns
- Type hints required: `def create_agent(user_id: str) -> Agent:`
- Use **Pydantic** models for request/response validation
- Follow **PEP 8** style guide
- Use **black** for formatting (if available)
- Prefer **list comprehensions** over map/filter when readable

### Database Queries
- Use **SQLAlchemy ORM**, avoid raw SQL unless necessary
- Always add `.filter(user_id=current_user.id)` for user isolation
- Use database indexes on foreign keys (`user_id`, `agent_id`, `conversation_id`)
- Avoid `SELECT *`, specify needed columns

### API Design
- RESTful routes: `/api/v1/agents`, `/api/v1/agents/{agent_id}/chat`
- Use proper HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)
- Return friendly error messages, not technical jargon
- Example: `{"error": "Charlie couldn't understand that. Try again?"}` not `{"error": "ValidationError: field required"}`

## 🧪 Testing Instructions

### ⚠️ CRITICAL: Test URLs

**ALWAYS test on Teach Charlie URLs, NEVER on direct Langflow URLs:**

| ✅ CORRECT (Teach Charlie) | ❌ WRONG (Direct Langflow) |
|---------------------------|---------------------------|
| `http://localhost:3001/canvas/{workflow_id}` | `http://localhost:7860/flow/{flow_id}` |
| `http://localhost:3001/playground/{workflow_id}` | `http://localhost:7860/playground/{flow_id}` |
| `http://localhost:3001/workflows` | `http://localhost:7860/all` |

**Why this matters**: Langflow is embedded via iframe in Teach Charlie. Issues may appear in the iframe embedding that don't appear when testing Langflow directly. Always test the user's actual experience.

**Testing Flow for Templates/Workflows:**
1. Go to `http://localhost:3001/workflows` - see workflow list
2. Click a workflow to go to `/canvas/{id}` - verify edges render visually
3. Go to `/playground/{id}` - test if chat works (proves connections function)
4. If chat fails, edges are not properly connected even if they look connected

### E2E Test Coverage (28 Test Files)
- **Test files in**: `src/frontend/e2e/tests/`
- **Current tests** (organized by feature):
  - **Core MVP**: onboarding, persistence, error-handling, new-user-journey
  - **Chat**: chat-playground, playground, playground-enhanced, multi-turn-chat, chat-debug
  - **Agents**: agent-crud, agent-edit, avatar-generation, comprehensive
  - **RAG**: knowledge-search, rag-integration
  - **Advanced**: canvas-exploration, tool-execution, memory-context
  - **Integrations**: billing, embed-widget, composio-tools, composio-langflow-component
  - **Platform**: project-tabs, settings, sidebar-navigation, analytics-dashboard, missions
  - **Diagnostics**: diagnostic
- Run E2E tests **before** every deploy: `cd src/frontend && npx playwright test`

### Manual Testing Checklist
- Test on Chrome, Firefox, Safari (desktop only, no mobile)
- Test happy path (create agent, chat, unlock flow)
- Test edge cases (empty inputs, long messages, special characters)
- Test error states (network failure, LLM timeout, invalid API key)

### Playwright MCP Testing
When using Playwright MCP for automated testing:
```
1. Navigate to http://localhost:3001/workflows
2. Click on a workflow to open /canvas/{id}
3. Take snapshot to verify edges are visually rendered
4. Navigate to /playground/{id} and test chat
5. If chat fails with connection errors, edges are broken
```

## 📚 Core Files & Functions

### Documentation (START HERE)
- **docs/00_PROJECT_SPEC.md**: Read this first for product context
- **docs/01_ARCHITECTURE.md**: Read this for technical architecture
- **docs/02_CHANGELOG.md**: Major decisions & rationale
- **docs/03_STATUS.md**: Current status, risks, next steps

### Key Implementation Files (All Working)

**Backend API (21 routers in `src/backend/app/api/`):**
- **agent_components.py**: Agent CRUD, Q&A wizard, publish/unpublish
- **workflows.py**: Workflow management, chat streaming, Langflow sync
- **billing.py**: Stripe subscriptions, webhooks, usage tracking
- **missions.py**: Gamified learning, step completion
- **connections.py**: Composio OAuth, app integrations
- **embed.py**: Public embed widget API
- **knowledge_sources.py**: RAG text/file/URL sources
- **mcp_servers.py**: MCP server configuration, sync

**Backend Services (20 services in `src/backend/app/services/`):**
- **template_mapping.py**: Q&A → System Prompt generation
- **workflow_service.py**: Langflow flow creation and execution
- **billing_service.py**: Stripe integration logic
- **composio_connection_service.py**: OAuth flow management

**Frontend Pages (in `src/frontend/src/pages/`):**
- **CreateAgentPage.tsx**: 3-step Q&A wizard with presets and avatar inference
- **PlaygroundPage.tsx**: Multi-turn chat with streaming and tools
- **EditAgentPage.tsx**: Agent editing with knowledge sources
- **ProjectDetailPage.tsx**: Three-tab organization view

### Current Architecture (Phase 13 Complete)
- **Three-Tab UI**: Agents, Workflows, MCP Servers organization
- **Avatar System**: Auto-inference from 40+ job types
- **Custom Components**: Publish agent → Langflow sidebar
- **Knowledge Sources**: Text, files, URLs with keyword RAG
- **Agent Presets**: 8 default templates in wizard
- **Billing**: Stripe subscriptions with Free/Pro/Team plans
- **Missions**: Gamified learning with guided tours
- **Composio**: 500+ OAuth app integrations
- **Embed Widget**: Public chat embedding for external sites

## 🔄 Repository Conventions

### Branch Naming
- `main` - production-ready code
- `feature/<name>` - new features (e.g., `feature/onboarding-wizard`)
- `fix/<name>` - bug fixes (e.g., `fix/agent-persistence`)
- `docs/<name>` - documentation updates

### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- Examples:
  - `feat: Add 3-step Q&A onboarding modal`
  - `fix: Agent persistence not saving to database`
  - `docs: Update architecture with DataStax RAGStack`

### Merge Strategy
- **Squash and merge** for feature branches (keep main history clean)
- **Rebase** for small changes (avoid merge commits when possible)

## ⚙️ Development Environment

### Required Tools
- **Node.js**: v18+ (use `nvm use 18` or `fnm use 18`)
- **Python**: 3.9+ (use `pyenv install 3.9` or system Python)
- **uv**: Python package installer (faster than pip)
- **Docker**: For local PostgreSQL with pgvector
- **Git**: Version control

### Environment Variables
- Copy `.env.example` to `.env`: `cp .env.example .env`
- Fill in API keys (OpenAI, Anthropic, Clerk)
- **NEVER commit `.env`** to git (it's in .gitignore)

### Configuration Dependencies (CRITICAL)

**Single Source of Truth Pattern**: All configuration flows from `.env` → `config.py` → services.

These values MUST stay in sync across files:

| Variable | .env.example | config.py | docker-compose.yml |
|----------|-------------|-----------|-------------------|
| `LANGFLOW_CONTAINER_NAME` | Line 85 | `langflow_container_name` | Line 74 |
| `LANGFLOW_API_URL` | Line 81 | `langflow_api_url` | Line 132 |
| `DATABASE_URL` | Line 26 | `database_url` | Line 130 |

**Startup Validation**: The backend validates container configuration at startup. If `LANGFLOW_CONTAINER_NAME` doesn't match an actual Docker container, you'll see:
```
❌ CONFIGURATION ERROR: Langflow container 'xxx' not found!
```

**Adding New Shared Config**:
1. Add to `.env.example` with documentation
2. Add to `config.py` Settings class
3. Update `docker-compose.yml` if needed (use `${VAR:-default}` syntax)
4. Never hardcode defaults in service files - import from `config.py`

### IDE Setup
- Recommended: VS Code or Cursor
- Extensions: Python, ESLint, Prettier, Tailwind CSS IntelliSense
- Enable format on save

## ⚠️ Project-Specific Warnings

### DO NOT Do These Things
1. **DO NOT deeply fork Langflow** - Use as a wrapper, minimize core modifications
2. **DO NOT add multi-tenancy to MVP** - Deferred to Phase 2 (high risk, solo founder)
3. **DO NOT use AI to generate flows** - Use rule-based template mapping (simpler, more reliable)
4. **DO NOT add mobile support to MVP** - Desktop only (Chrome, Firefox, Safari, Edge)
5. **DO NOT build complex features** - MVP scope is minimal (3-step Q&A, playground, persistence)
6. **DO NOT skip E2E tests** - Required before deploy (catch regressions)
7. **DO NOT expose secrets** - Use environment variables, never hardcode API keys

### Expected Behaviors & Quirks
- **Langflow uses React Flow**: Familiar with node-based editing, but complex for beginners
- **Langflow's SQLite → PostgreSQL migration**: DataStax uses PostgreSQL, must migrate DB layer
- **Template mapping is critical path**: Q&A → Flow conversion is the core differentiator
- **Clerk JWT validation**: Every backend API call must validate Clerk JWT token

### Deployment to DataStax
- **Use RAGStack AI Langflow**: https://github.com/datastax/ragstack-ai-langflow
- **Docker Compose setup**: PostgreSQL + pgvector + Langflow containers
- **Environment variables**: Set via DataStax dashboard, not .env file
- **Test locally first**: Ensure Docker Compose works before deploying

## 🎓 Educational UX Guidelines

### "Dog Trainer" Metaphor - Critical to UX
- Rename "System Prompt" → "Charlie's Job Description"
- Rename "Temperature" → "Creativity"
- Use friendly, conversational language (not technical jargon)
- 3-step Q&A questions:
  1. "Who is Charlie? What kind of job does he have?"
  2. "What are the rules to his job? What does he need to know?"
  3. "What tricks does Charlie need to know? Does he need to fetch?"

### Progressive Complexity
- **Beginner Mode**: 3-step Q&A (no nodes, no technical terms)
- **Intermediate**: Playground (test agent, see it work)
- **Advanced**: Unlock Flow (show Langflow canvas, edit nodes)

### Error Handling (Friendly, Not Technical)
- Good: "Charlie needs a job! Tell us what Charlie should do."
- Bad: "ValidationError: field 'system_prompt' is required"
- Use encouraging language, assume user is non-technical

## 📊 Success Criteria (MVP Launch) - ALL ACHIEVED ✅

MVP was completed on **2026-01-14**. All criteria met:

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Platform stable for workshops | ✅ Done | 15+ E2E tests passing |
| 3-step Q&A onboarding | ✅ Done | Multi-type support, avatar auto-inference |
| Playground chat interface | ✅ Done | Multi-turn memory, streaming, tools |
| Agent persistence | ✅ Done | CRUD + export/import working |
| E2E tests pass | ✅ Done | chat, publish, multi-turn, RAG tests |

**Current Focus**: Production deployment + first workshops

## 🔗 External References

- [Langflow GitHub](https://github.com/logspace-ai/langflow)
- [RAGStack AI Langflow (DataStax)](https://github.com/datastax/ragstack-ai-langflow)
- [Langflow Docs](https://docs.langflow.org/)
- [React Flow Docs](https://reactflow.dev/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Clerk Docs](https://clerk.com/docs)
- [Playwright Docs](https://playwright.dev/)

## 🚨 Critical Risks & Mitigations

**#1 Risk**: Solo non-technical founder using AI-assisted development
- **Mitigation**: Simplify MVP aggressively, break tasks into tiny steps, hire contractor if blocked

**#2 Risk**: Forking Langflow is too complex
- **Mitigation**: Start with wrapper approach, test locally, fallback to using as dependency

**#3 Risk**: Template mapping doesn't work
- **Mitigation**: Use simple rule-based templates (not AI), test with beta users early

## 💡 Tips for Claude Code

- **Read docs/00_PROJECT_SPEC.md first** before making architectural decisions
- **Ask questions** if requirements are unclear (user is non-technical, needs guidance)
- **Break tasks into small steps** (1-2 hour chunks, not multi-day epics)
- **Test frequently** (run code after every change, don't accumulate technical debt)
- **Simplify ruthlessly** (MVP scope is minimal, cut features aggressively)
- **Explain tradeoffs** (user is learning, wants to understand "why" not just "what")
- **Use friendly language** when generating user-facing text (align with "Dog Trainer" metaphor)

---

**Remember**: This project is about **packaging, not innovation**. Focus on making Langflow accessible to non-technical users through great educational UX, not building a better Langflow.
