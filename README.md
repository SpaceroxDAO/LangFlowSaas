# Teach Charlie AI

**Educational AI Agent Builder for Non-Technical Teams**

> "We're not innovating on Langflow - we're packaging it brilliantly for a market that's desperate to learn."

## Overview

Teach Charlie AI is an educational platform that uses a "Dog Trainer" metaphor to demystify AI for non-technical users. Built on Langflow, it combines live workshops with a simplified SaaS platform that teaches users AI fundamentals while helping them build production-ready agents.

**Target Users**: Small business owners, marketing teams, workshop attendees, and anyone who wants to learn AI without coding.

**Core Differentiator**: Education-first approach with progressive complexity reveal (3-step Q&A → Playground → Flow Canvas).

## Project Status

**Phase**: MVP Complete (Phase 13) - Production Ready
**Stack**: React 19 + Vite + TypeScript + Tailwind CSS 4 + Clerk + FastAPI + Langflow + PostgreSQL + Redis

### What's Working

**Core Features:**
- **3-Step Q&A Onboarding**: Create AI agents with 8 preset templates and avatar auto-inference
- **Chat Playground**: Multi-turn conversations with streaming, memory, and tool execution
- **Progressive Canvas Unlock**: 4 disclosure levels from hidden to full Langflow editor
- **Knowledge Sources (RAG)**: Text, file upload (PDF/TXT/MD/DOCX/CSV), and URL fetching
- **Custom Components**: Publish agents to Langflow sidebar as reusable components

**Integrations:**
- **Composio OAuth**: 500+ app integrations (Gmail, Slack, Notion, etc.)
- **Billing/Stripe**: Subscription management with Free/Pro/Team plans
- **Embed Widget**: JavaScript snippet for embedding agents on external websites

**Platform:**
- **Three-Tab UI**: Agents, Workflows, MCP Servers organization
- **Missions System**: Gamified learning with guided tours
- **Analytics Dashboard**: Conversation metrics and usage tracking
- **Resources/Docs**: GitBook-style documentation with User Guides and Developer Docs
- **15+ E2E Tests**: Comprehensive test coverage with Playwright

## Quick Start

### Prerequisites
- Docker Desktop
- Node.js 18+
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SpaceroxDAO/LangFlowSaas.git
   cd LangFlowSaas
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your API keys:
   ```env
   # Required
   CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   CLERK_JWKS_URL=https://your-clerk-domain/.well-known/jwks.json
   CLERK_ISSUER=https://your-clerk-domain
   ANTHROPIC_API_KEY=sk-ant-...

   # Optional (defaults provided for local dev)
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   LANGFLOW_SECRET_KEY=<generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())">
   ```

3. **Start all services with Docker Compose**
   ```bash
   docker compose up -d
   ```

   This starts:
   - PostgreSQL (port 5432)
   - Langflow (port 7860)
   - FastAPI Backend (port 8000)

4. **Start the frontend**
   ```bash
   cd src/frontend
   npm install
   npm run dev
   ```

   Open http://localhost:3001

5. **Create your first agent!**
   - Sign in with Clerk
   - Click "Create Agent"
   - Answer the 3 questions
   - Chat with your agent in the Playground

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ Frontend (React + Vite + TypeScript)                │
│  • Clerk Authentication                             │
│  • 3-Step Q&A Wizard                                │
│  • Chat Playground with Memory                      │
│  • Dashboard (Agent Management)                     │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│ Backend (FastAPI + Python)                          │
│  • Clerk JWT Validation                             │
│  • Template Mapping Engine (Q&A → Langflow Flow)    │
│  • Agent CRUD API                                   │
│  • Chat API (Langflow Execution)                    │
└─────────────────────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
┌─────────────────────┐   ┌─────────────────────┐
│ Langflow            │   │ PostgreSQL          │
│  • Flow Execution   │   │  • Users            │
│  • Anthropic Claude │   │  • Agents           │
│  • Conversation     │   │  • Conversations    │
│    Memory           │   │  • Messages         │
└─────────────────────┘   └─────────────────────┘
```

## API Endpoints (140+ Total)

**Core Endpoints:**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/agent-components` | GET/POST | List/create agents |
| `/api/v1/agent-components/create-from-qa` | POST | Create from Q&A wizard |
| `/api/v1/agent-components/{id}/publish` | POST | Publish to Langflow |
| `/api/v1/workflows/{id}/chat` | POST | Chat with agent (streaming) |
| `/api/v1/knowledge-sources` | GET/POST | Manage RAG sources |
| `/api/v1/billing/subscription` | GET | Get subscription status |
| `/api/v1/missions` | GET | List learning missions |
| `/api/v1/connections` | GET | List OAuth connections |
| `/api/v1/embed/{token}/chat` | POST | Public embed chat |
| `/health` | GET | Health check |

See `docs/01_ARCHITECTURE.md` for complete API reference (21 routers, 140+ endpoints).

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Vite + TypeScript | Fast, type-safe UI |
| Styling | Tailwind CSS | Utility-first CSS |
| Auth | Clerk | Authentication + user management |
| Backend | FastAPI | Async Python API |
| Database | PostgreSQL | Relational data storage |
| AI Engine | Langflow | Flow-based agent execution |
| LLM | Anthropic Claude | AI model provider |
| Containerization | Docker Compose | Local development |

## Project Structure

```
LangflowSaaS/
├── src/
│   ├── frontend/              # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── pages/         # Page components
│   │   │   ├── services/      # API client
│   │   │   └── App.tsx        # Main app
│   │   └── package.json
│   │
│   └── backend/               # FastAPI backend
│       ├── app/
│       │   ├── api/           # API routes
│       │   ├── models/        # SQLAlchemy models
│       │   ├── schemas/       # Pydantic schemas
│       │   ├── services/      # Business logic
│       │   └── middleware/    # Auth middleware
│       ├── templates/         # Langflow flow templates
│       └── requirements.txt
│
├── docker-compose.yml         # Docker services config
├── .env                       # Environment variables
└── docs/                      # Documentation
```

## Development

### Running Tests

```bash
# Backend tests
cd src/backend
pytest

# E2E tests with Playwright (coming soon)
```

### Useful Commands

```bash
# View logs
docker compose logs -f backend
docker compose logs -f langflow

# Restart a service
docker compose restart backend

# Rebuild after code changes
docker compose up -d --build backend

# Stop all services
docker compose down

# Clean restart (including volumes)
docker compose down -v && docker compose up -d
```

## Documentation

**Public Documentation (for users):**
- **[/resources](/resources)** - User Guides, Developer Docs, and Changelog (GitBook-style)

**Internal Documentation (for developers):**
- **[docs/00_PROJECT_SPEC.md](docs/00_PROJECT_SPEC.md)** - Product requirements, personas, user journeys
- **[docs/01_ARCHITECTURE.md](docs/01_ARCHITECTURE.md)** - Technical architecture, database schema
- **[docs/02_CHANGELOG.md](docs/02_CHANGELOG.md)** - Development history, decisions made
- **[docs/04_DEVELOPMENT_PLAN.md](docs/04_DEVELOPMENT_PLAN.md)** - Roadmap and milestones

## Key Decisions

1. **Wrapper over Deep Fork** - Lightweight customization of Langflow, not a deep fork
2. **Template Mapping** - Use predefined templates + Q&A injection, not AI-generated flows
3. **3-Step Q&A First** - Educational onboarding before exposing flow complexity
4. **Clerk for Auth** - Easy integration with org management for Phase 2
5. **Docker Compose** - Consistent local development environment

## Roadmap

### Phase 1-4: MVP Foundation ✅ Complete
- [x] 3-Step Q&A onboarding
- [x] Chat playground with memory
- [x] Clerk authentication
- [x] Langflow integration
- [x] Docker Compose setup

### Phase 5-9: Core Features ✅ Complete
- [x] Progressive canvas unlock (4 levels)
- [x] Multi-turn conversation memory
- [x] Three-tab UI (Agents, Workflows, MCP Servers)
- [x] Avatar auto-inference (40+ job types)
- [x] Custom Langflow components

### Phase 10-13: Advanced Features ✅ Complete
- [x] E2E test suite (15+ Playwright tests)
- [x] Knowledge sources / RAG
- [x] Agent presets (8 templates)
- [x] Billing integration (Stripe)
- [x] Analytics dashboard

### Phase 14+: Post-MVP (In Progress)
- [x] Mission-based learning system
- [x] Composio integrations (500+ apps)
- [x] Embed widget system
- [x] Resources/Documentation (GitBook-style public docs)
- [ ] Production deployment
- [ ] Multi-tenant organizations
- [ ] Mobile optimization

## Contributing

1. Read the documentation in `docs/`
2. Check current status in `docs/02_CHANGELOG.md`
3. Open an issue or reach out

## License

MIT License - See LICENSE file for details

---

**Built with**: Langflow + React + FastAPI + PostgreSQL + Clerk + Anthropic Claude

**Founder**: Adam Boyle
**Repository**: https://github.com/SpaceroxDAO/LangFlowSaas
