# Development Plan: Teach Charlie AI

**Created**: 2026-01-03
**Status**: Approved - Ready for Execution
**Timeline**: 6 weeks (35 working days)
**Owner**: Adam (Product) + Claude Code (Technical)

---

## Executive Summary

This plan outlines a 6-week development roadmap for building Teach Charlie AI - an educational AI agent builder on top of Langflow. The plan is designed for a **solo, non-technical founder using AI-assisted development**, with aggressive scope cuts and clear decision points.

---

## Strategic Architecture Decision

### Recommended Architecture: Separate Frontend + Langflow Backend

```
┌─────────────────────────────────────────────────────────────────┐
│                    Custom Frontend (React/Next.js)               │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────────┐ │
│  │ Landing Page│→ │ 3-Step Q&A  │→ │ Playground (Chat UI)     │ │
│  └─────────────┘  └─────────────┘  └──────────────────────────┘ │
│                                              │                    │
│                                    [Unlock Flow Canvas Button]   │
│                                              ↓                    │
│                         ┌──────────────────────────────────────┐ │
│                         │ Langflow Canvas (iframe or redirect) │ │
│                         └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Custom Backend (FastAPI)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Clerk Auth  │  │ Template    │  │ Agent CRUD              │  │
│  │ Middleware  │  │ Mapping     │  │ (create, list, delete)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                          │                                       │
│                          ▼                                       │
│           ┌─────────────────────────────────────────┐            │
│           │ Langflow API (flow CRUD, chat execution)│            │
│           └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Langflow (Backend Service)                    │
│  • Runs with LANGFLOW_AUTO_LOGIN=true (no auth, trusted mode)   │
│  • Exposes API on internal port (not public)                    │
│  • Handles flow execution, LLM calls                            │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL + pgvector                         │
│  • Langflow tables (flows, etc.)                                │
│  • Custom tables (users, agents, conversations, messages)       │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Architecture?

1. **Langflow stays untouched** - No fork maintenance, easy upgrades
2. **Clear separation** - Custom app handles education UX, Langflow handles agent execution
3. **Clerk handles auth** - Langflow runs in trusted mode, custom backend validates JWT
4. **Single database** - Share PostgreSQL instance, simpler ops
5. **Flexible integration** - Langflow canvas via iframe/redirect, can change later

---

## Phase Overview

| Phase | Duration | Days | Key Deliverable |
|-------|----------|------|-----------------|
| **Phase 0** | 3 days | 1-3 | Research validated, assumptions confirmed |
| **Phase 1** | 7 days | 4-10 | Backend API working with template mapping |
| **Phase 2** | 8 days | 11-18 | Frontend with Q&A and playground |
| **Phase 3** | 6 days | 19-24 | Polish, integration, bug fixes |
| **Phase 4** | 11 days | 25-35 | E2E tests, deployment, beta testing |

---

## Phase 0: Research & Validation (Days 1-3)

**Goal**: Validate technical assumptions before writing production code.

### Critical Questions to Answer

| Question | Why It Matters | How to Validate |
|----------|----------------|-----------------|
| Can we create flows via Langflow API? | Core feature depends on this | Try it locally |
| What's the flow JSON format? | Need to create templates | Export a flow, study JSON |
| Can we run Langflow with external PostgreSQL? | Production requirement | Test with LANGFLOW_DATABASE_URL |
| Can we call Langflow's chat API from external app? | Playground depends on this | Try it with curl |
| How does RAGStack AI Langflow deployment work? | DataStax is our target platform | Clone and study the repo |

### Day 1: Langflow Deep Dive
- [ ] Clone Langflow repository
- [ ] Run Langflow locally (`pip install langflow && langflow run`)
- [ ] Create a simple flow (Input → LLM → Output) in UI
- [ ] Test the flow in Langflow's built-in playground
- [ ] Export the flow as JSON, document the structure

### Day 2: API Integration Testing
- [ ] Study Langflow API at http://localhost:7860/docs
- [ ] Test creating a flow via API (POST /api/v1/flows)
- [ ] Test executing a flow via API (POST /api/v1/run/{flow_id})
- [ ] Test PostgreSQL integration with LANGFLOW_DATABASE_URL
- [ ] Document all relevant API endpoints

### Day 3: RAGStack & Documentation
- [ ] Clone RAGStack AI Langflow repo
- [ ] Study Docker Compose structure
- [ ] Understand deployment process
- [ ] Create `docs/RESEARCH_NOTES.md` with findings
- [ ] **GO/NO-GO decision** on architecture

### Deliverables
- `docs/RESEARCH_NOTES.md` with API documentation
- Sample flow JSON template (annotated)
- Local dev environment working (Langflow + PostgreSQL)
- Confirmed: API supports our use case

---

## Phase 1: Backend Foundation (Days 4-10)

**Goal**: Build custom FastAPI backend with template mapping engine.

### Project Structure
```
src/backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Environment variables
│   ├── database.py          # SQLAlchemy setup
│   ├── models/              # Database models (user, agent, conversation, message)
│   ├── schemas/             # Pydantic schemas
│   ├── api/                 # API routes (agents, chat, auth)
│   ├── services/            # Business logic (template_mapping, langflow_client)
│   └── middleware/          # Clerk auth middleware
├── templates/               # Flow templates (support_bot.json)
├── requirements.txt
└── Dockerfile
```

### Days 4-5: Project Setup
- [ ] Create backend project structure
- [ ] Set up FastAPI with health check endpoint
- [ ] Configure PostgreSQL with SQLAlchemy
- [ ] Create database models (User, Agent, Conversation, Message)
- [ ] Set up Alembic migrations
- [ ] Run initial migration

### Days 6-7: Authentication
- [ ] Set up Clerk account (https://clerk.com)
- [ ] Create Clerk JWT validation middleware
- [ ] Test auth with curl
- [ ] User creation/update on first login

### Days 8-9: Template Mapping Engine
- [ ] Create `support_bot.json` flow template
- [ ] Build template mapping service (Q&A → system prompt → flow)
- [ ] Build Langflow API client (create_flow, run_flow)
- [ ] Test end-to-end: Q&A → Flow creation → Chat

### Day 10: API Endpoints
- [ ] `POST /api/v1/agents/create-from-qa` - Create agent from Q&A
- [ ] `GET /api/v1/agents` - List user's agents
- [ ] `GET /api/v1/agents/{id}` - Get specific agent
- [ ] `DELETE /api/v1/agents/{id}` - Delete agent
- [ ] `POST /api/v1/agents/{id}/chat` - Chat with agent
- [ ] Test all endpoints with Postman/curl

### Success Criteria
```bash
# Create agent
curl -X POST http://localhost:8000/api/v1/agents/create-from-qa \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"who": "bakery assistant", "rules": "be friendly", "tricks": "answer questions"}'
# Returns: { "agent_id": "uuid" }

# Chat
curl -X POST http://localhost:8000/api/v1/agents/{id}/chat \
  -d '{"message": "What are your hours?"}'
# Returns: { "response": "We are open 9-5!" }
```

---

## Phase 2: Frontend Foundation (Days 11-18)

**Goal**: Build custom React frontend with onboarding and playground.

### Project Structure
```
src/frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── api/                 # API client
│   ├── components/          # Reusable components
│   ├── pages/               # Landing, Dashboard, Onboarding, Playground
│   ├── hooks/
│   └── styles/
├── package.json
├── vite.config.ts
└── Dockerfile
```

### Days 11-12: Project Setup
- [ ] Create React project with Vite + TypeScript
- [ ] Install dependencies (Clerk, React Router, Axios, Tailwind)
- [ ] Configure Clerk provider
- [ ] Set up routing (/, /sign-in, /sign-up, /dashboard, /onboarding, /playground/:id)
- [ ] Create basic layout component

### Days 13-14: Dashboard & API Integration
- [ ] Build API client with Clerk token injection
- [ ] Build Dashboard page (list agents, create button, delete)
- [ ] Test API integration

### Days 15-16: 3-Step Q&A Onboarding
- [ ] Build Step 1: "Who is Charlie?" (text input)
- [ ] Build Step 2: "What are Charlie's rules?" (text area)
- [ ] Build Step 3: "What tricks does Charlie know?" (text area)
- [ ] Add progress indicator
- [ ] Submit to backend, redirect to playground
- [ ] Style with friendly, educational UX

### Days 17-18: Playground Chat Interface
- [ ] Build chat message list
- [ ] Build message input
- [ ] Send message, display response
- [ ] Add loading states
- [ ] Add "Unlock Flow" button (placeholder)
- [ ] Error handling

### Success Criteria
User can:
1. Sign up with email
2. Complete 3-step Q&A
3. Chat with agent in playground
4. See agent in dashboard

---

## Phase 3: Integration & Polish (Days 19-24)

**Goal**: Connect Langflow canvas, polish UX, fix bugs.

### Days 19-20: Langflow Canvas Integration
- [ ] Implement "Unlock Flow" button
- [ ] Option A: Iframe embed OR Option B: New tab redirect
- [ ] Test user can view/edit nodes
- [ ] Verify changes save correctly

### Days 21-22: UX Polish
- [ ] Align copy with "Dog Trainer" metaphor
- [ ] Add helpful tooltips and placeholder examples
- [ ] Add empty states ("Create your first Charlie!")
- [ ] Add success states ("Charlie is ready!")
- [ ] Polish error messages (friendly, not technical)

### Days 23-24: Bug Fixes & Testing
- [ ] Manual testing checklist (all flows)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Fix all bugs found
- [ ] Code cleanup

### Success Criteria
- Non-technical person can complete flow without help
- UI feels professional and approachable
- No errors in happy path

---

## Phase 4: Testing & Deployment (Days 25-35)

**Goal**: E2E tests, deploy to DataStax, beta testing.

### Days 25-27: E2E Testing with Playwright
- [ ] Set up Playwright
- [ ] Test 1: Happy path (signup → Q&A → playground → chat)
- [ ] Test 2: Persistence (create agent, reload, agent exists)
- [ ] Test 3: Error handling (empty input shows error)
- [ ] All tests passing

### Days 28-30: Docker & Deployment Setup
- [ ] Create Docker Compose (postgres, langflow, backend, frontend)
- [ ] Test Docker Compose locally
- [ ] Study DataStax deployment (RAGStack AI Langflow)
- [ ] Document deployment steps

### Days 31-33: Deploy to DataStax
- [ ] Set up DataStax account
- [ ] Configure production environment variables
- [ ] Deploy all services
- [ ] Configure domain (optional)
- [ ] Smoke testing on production

### Days 34-35: Beta Testing
- [ ] Create feedback form
- [ ] Write beta tester instructions
- [ ] Invite 5-10 beta testers
- [ ] Monitor for errors
- [ ] Collect feedback
- [ ] Prioritize fixes

### Success Criteria
- 3 E2E tests passing
- Deployed and accessible
- 5+ beta testers complete flow successfully
- Ready for first workshop

---

## Risk Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Langflow API doesn't support our use case | Low | High | Phase 0 validates first |
| Template mapping too complex | Medium | Medium | Start with 1 simple template |
| Clerk integration issues | Low | Medium | Great docs, fallback to Supabase |
| DataStax deployment fails | Medium | High | Backup: Render, Railway, AWS |

### Project Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Solo founder gets blocked | High | High | Hire contractor if stuck >2 days |
| Scope creep | High | Medium | Ruthlessly cut features |
| Timeline slips | High | Medium | 6 weeks target, 8 weeks acceptable |

---

## Scope Cuts (If Running Behind)

### Cut First (Nice-to-Have)
1. "Unlock Flow" feature - Just Q&A + playground
2. Multiple templates - Just support_bot
3. Cross-browser testing - Chrome only
4. Polish animations - Basic only

### Cut Second (Degraded Experience)
5. Error handling polish - Basic errors OK
6. Dashboard delete - List only
7. E2E tests - Manual testing backup
8. Docker Compose - Manual deploy OK

### Never Cut (Core Value)
- ❌ 3-step Q&A onboarding
- ❌ Playground chat
- ❌ Agent persistence
- ❌ Basic auth

---

## Decision Checkpoints

### End of Week 1 (Day 7)
- [ ] Langflow API confirmed working
- [ ] Template mapping approach validated
- [ ] Decision: Proceed or adjust

### End of Week 3 (Day 18)
- [ ] End-to-end flow works locally
- [ ] Decision: Proceed with polish or cut features

### End of Week 5 (Day 30)
- [ ] Deployment works
- [ ] Decision: Launch beta or fix critical issues

---

## Resource Requirements

### Accounts Needed
- [ ] GitHub (have)
- [ ] Clerk (free tier)
- [ ] DataStax
- [ ] OpenAI API key
- [ ] Domain (optional)

### Budget (Monthly)
| Service | Cost |
|---------|------|
| Clerk | $0 (free tier) |
| DataStax | $0-100 |
| OpenAI | $20-50 |
| Domain | $1/month |
| **Total** | **$20-150/month** |

---

## Definition of Done (MVP Launch)

- [ ] User can sign up
- [ ] User can complete 3-step Q&A
- [ ] User can chat with agent in playground
- [ ] Agent persists across sessions
- [ ] 5+ beta testers complete flow successfully
- [ ] Ready for first workshop

---

## Next Steps

1. **Begin Phase 0**: Research & Validation
2. **Day 1 Tasks**:
   - Clone Langflow repository
   - Run Langflow locally
   - Create test flow in UI
   - Export and study flow JSON

---

*Document created: 2026-01-03*
*Last updated: 2026-01-03*
