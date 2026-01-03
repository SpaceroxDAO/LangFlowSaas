# Claude Code Instructions for Teach Charlie AI

**Project**: Teach Charlie AI - Educational AI Agent Builder
**Last Updated**: 2026-01-03
**Architecture**: Lightweight wrapper around Langflow (NOT a deep fork)

## 🎯 Project Philosophy

> "We're not innovating on Langflow - we're packaging it brilliantly for a market that's desperate to learn."

**Critical Context**:
- Solo, non-technical founder using AI-assisted development
- 1-2 month MVP timeline (aggressive, can extend to 2-3 months)
- Budget: $100-$500/month
- Success = "workshop-ready" (can demo without embarrassing failures)

**Core Strategy**: Build custom educational layer (3-step Q&A, playground) on top of unmodified Langflow. Minimize Langflow core modifications.

## 📁 Project Structure

```
LangflowSaaS/
├── docs/                          # Comprehensive documentation
│   ├── 00_PROJECT_SPEC.md         # Product requirements, personas, success criteria
│   ├── 01_ARCHITECTURE.md         # Technical architecture, DB schema, APIs
│   ├── 02_CHANGELOG.md            # Major decisions & rationale
│   └── 03_STATUS.md               # Current status, next steps, risks
├── src/                           # (Future) Langflow fork will go here
│   ├── frontend/                  # React + React Flow UI
│   │   ├── onboarding/            # Custom 3-step Q&A component
│   │   └── playground/            # Custom chat interface
│   └── backend/                   # FastAPI Python backend
│       ├── api/                   # Custom endpoints
│       │   ├── agents.py          # Agent CRUD, template mapping
│       │   └── chat.py            # Playground chat API
│       └── templates/             # Flow templates (support, sales, knowledge)
├── .env.example                   # Environment variables template
├── claude.md                      # This file
└── README.md                      # Universal Starter docs
```

## 🚀 Common Bash Commands

### Development Setup
```bash
# Fork Langflow (first time setup)
git clone https://github.com/logspace-ai/langflow.git src/langflow
cd src/langflow

# Install frontend dependencies
cd src/frontend
npm install

# Install Python dependencies (using uv)
cd ../..
uv run langflow run

# Verify Langflow runs at http://localhost:7860
```

### Docker Development (PostgreSQL + Langflow)
```bash
# Start local PostgreSQL with pgvector
docker-compose up -d postgres

# Run Langflow with PostgreSQL
LANGFLOW_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/teachcharlie uv run langflow run

# Stop containers
docker-compose down
```

### Testing
```bash
# Run E2E tests (Playwright)
npm run test:e2e

# Run specific test file
npx playwright test tests/onboarding.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Generate Playwright test report
npx playwright show-report
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

### Prefer E2E Tests Over Unit Tests (MVP)
- Write **3 critical E2E tests** using Playwright:
  1. Signup → Q&A → Playground → Chat works
  2. Create agent → Save → Reload → Agent persists
  3. Error handling (invalid input, LLM timeout)
- Run E2E tests **before** every deploy
- Unit tests deferred to Phase 2 (focus on speed for MVP)

### Manual Testing Checklist
- Test on Chrome, Firefox, Safari (desktop only, no mobile)
- Test happy path (create agent, chat, unlock flow)
- Test edge cases (empty inputs, long messages, special characters)
- Test error states (network failure, LLM timeout, invalid API key)

## 📚 Core Files & Functions

### Documentation (START HERE)
- **docs/00_PROJECT_SPEC.md**: Read this first for product context
- **docs/01_ARCHITECTURE.md**: Read this for technical architecture
- **docs/02_CHANGELOG.md**: Major decisions & rationale
- **docs/03_STATUS.md**: Current status, risks, next steps

### Future Key Files (Not Yet Created)
- **src/backend/api/agents.py**: Template mapping logic (Q&A → Flow)
- **src/backend/templates/**: Predefined flow templates (support_bot.json, sales_agent.json)
- **src/frontend/onboarding/OnboardingWizard.tsx**: 3-step Q&A component
- **src/frontend/playground/ChatInterface.tsx**: Playground chat UI

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

## 📊 Success Criteria (MVP Launch)

MVP is **"done"** when ALL of these are true:
- ✅ Platform is stable enough to run a live workshop without failures
- ✅ 3-step Q&A onboarding works reliably
- ✅ Playground (chat interface) allows users to test agents
- ✅ Basic agent persistence (save/load)
- ✅ 5-10 beta testers successfully onboarded
- ✅ 3 critical E2E tests pass (happy path, persistence, error handling)

**Target Date**: Week 6 (with 1-week buffer = Week 7)

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
