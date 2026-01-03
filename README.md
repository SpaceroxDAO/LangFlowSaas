# Teach Charlie AI

**Educational AI Agent Builder for Non-Technical Teams**

> "We're not innovating on Langflow - we're packaging it brilliantly for a market that's desperate to learn."

## Overview

Teach Charlie AI is an educational platform that uses a "Dog Trainer" metaphor to demystify AI for non-technical users. Built on Langflow, it combines live workshops with a simplified SaaS platform that teaches users AI fundamentals while helping them build production-ready agents.

**Target Users**: Small business owners, marketing teams, workshop attendees, and anyone who wants to learn AI without coding.

**Core Differentiator**: Education-first approach with progressive complexity reveal (3-step Q&A → Playground → Flow Canvas).

## Project Status

**Phase**: Discovery Complete → Ready to Build
**Target Launch**: 5-6 weeks (MVP with 5-10 beta testers)
**Stack**: React + Langflow + FastAPI + PostgreSQL + Clerk + DataStax

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker Desktop (for local PostgreSQL)
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
   # Edit .env and fill in your API keys (OpenAI, Clerk, etc.)
   ```

3. **Fork and setup Langflow** (Coming Soon)
   ```bash
   # Instructions for forking Langflow and setting up local dev environment
   # Will be added in Week 1 of development
   ```

## Documentation

Comprehensive documentation in `docs/`:

- **[00_PROJECT_SPEC.md](docs/00_PROJECT_SPEC.md)** - Product requirements, personas, user journeys, success criteria
- **[01_ARCHITECTURE.md](docs/01_ARCHITECTURE.md)** - Technical architecture, database schema, API design
- **[02_CHANGELOG.md](docs/02_CHANGELOG.md)** - Major decisions, rationale, alternatives considered
- **[03_STATUS.md](docs/03_STATUS.md)** - Current status, risks, next steps, weekly roadmap
- **[claude.md](claude.md)** - Instructions for Claude Code (coding guidelines, project conventions)

**Start here**: Read `docs/00_PROJECT_SPEC.md` for product context, then `docs/01_ARCHITECTURE.md` for technical details.

## Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────┐
│ Frontend (React + React Flow)                       │
│  • Landing Page                                     │
│  • 3-Step Q&A Onboarding (Who? Rules? Tricks?)     │
│  • Playground (Chat Interface)                      │
│  • Flow Canvas (Langflow UI - unlockable)          │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│ Backend (FastAPI + Python)                          │
│  • Template Mapping Engine (Q&A → Flow)            │
│  • Agent Runtime (Langflow)                         │
│  • Authentication (Clerk)                           │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│ Database (PostgreSQL + pgvector)                    │
│  • Users, Agents, Conversations, Messages           │
└─────────────────────────────────────────────────────┘
```

### Key Features (MVP)

- ✅ **3-Step Q&A Onboarding**: Simple questions to create an agent (no code, no technical jargon)
- ✅ **Playground**: Test agents in a ChatGPT-style interface
- ✅ **Agent Persistence**: Save and load agents
- ⏸️ **Flow Canvas Unlock**: See underlying Langflow nodes (Phase 2)
- ⏸️ **Multi-Tenancy**: Org management, team features (Phase 2)

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React + React Flow | Inherit from Langflow, proven for node-based UIs |
| Backend | FastAPI (Python) | Langflow's backend, great async support |
| Database | PostgreSQL + pgvector | Production-ready, vector support for future RAG |
| Auth | Clerk | Easy integration, org management for Phase 2 |
| Hosting | DataStax (RAGStack AI) | Langflow-optimized, low ops overhead |
| Testing | Playwright | E2E testing, reliable for critical flows |

## Development Roadmap

### Week 1: Local Setup
- Fork Langflow repository
- Install dependencies (Node, Python)
- Run Langflow locally
- Review DataStax RAGStack AI Langflow deployment

### Week 2-3: Custom Onboarding Layer
- Build 3-step Q&A React component
- Build template mapping FastAPI endpoint
- Build playground chat UI
- Test end-to-end locally

### Week 3-4: Auth + Database
- Integrate Clerk authentication
- Set up PostgreSQL locally (Docker)
- Implement database schema
- Test auth flow

### Week 5-6: Testing + Deployment
- Write 3 critical E2E tests (Playwright)
- Deploy to DataStax
- Manual smoke testing
- Invite 5-10 beta testers
- **Launch MVP** 🚀

## Success Criteria (Year 1)

**User Metrics**:
- Signups: 100-500 total users
- Activation Rate: >70% (create first agent)
- Retention: >30% (return 3+ times)

**Business Metrics**:
- Paying Customers: TBD (freemium conversion)
- MRR: $5K-$25K by end of Year 1
- Workshops: 5+ successful workshops

**Technical Metrics**:
- Page Load: < 2 seconds
- Agent Response: < 3 seconds (LLM)
- Uptime: Best effort (no SLA for MVP)

## Key Decisions

1. **Wrapper over Deep Fork** - Lightweight customization of Langflow, not a deep fork
2. **Defer Multi-Tenancy to Phase 2** - Single-user agents for MVP (reduce complexity)
3. **Template Mapping (Rule-Based)** - Use predefined templates, not AI-generated flows
4. **3-Step Q&A Before Canvas** - Educational onboarding flow (progressive complexity)
5. **E2E Testing Priority** - Playwright tests, defer unit tests to Phase 2

See [docs/02_CHANGELOG.md](docs/02_CHANGELOG.md) for full rationale.

## Contributing

This is currently a solo project by Adam (founder). If you're interested in contributing:

1. Read the documentation in `docs/`
2. Check `docs/03_STATUS.md` for current status and next steps
3. Open an issue or reach out

## References

- [Langflow GitHub](https://github.com/logspace-ai/langflow)
- [RAGStack AI Langflow (DataStax Deployment)](https://github.com/datastax/ragstack-ai-langflow)
- [Langflow Docs](https://docs.langflow.org/)
- [React Flow Docs](https://reactflow.dev/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Clerk Docs](https://clerk.com/docs)

## License

MIT License - See LICENSE file for details

---

**Built with**:
- Langflow (AI agent engine)
- React + React Flow (UI)
- FastAPI (backend)
- PostgreSQL + pgvector (database)
- Clerk (authentication)
- DataStax (hosting)

**Founder**: Adam Boyle
**Repository**: https://github.com/SpaceroxDAO/LangFlowSaas
