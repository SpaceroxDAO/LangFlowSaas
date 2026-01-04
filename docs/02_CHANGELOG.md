# Changelog: Teach Charlie AI

**Purpose**: This changelog documents major decisions, rationale, and design choices made during discovery and development.

---

## 2026-01-03 - MVP Implementation Complete

### Summary
Full MVP implementation completed with working end-to-end functionality. Users can now sign in, create AI agents through a 3-step Q&A wizard, and chat with their agents in a playground interface.

### Implementation Completed

#### Phase 1: Backend Foundation
- **FastAPI Backend**: Async Python API with SQLAlchemy 2.0
- **Database Models**: Users, Agents, Conversations, Messages with proper relationships
- **Clerk JWT Auth**: Middleware for validating Clerk tokens via JWKS
- **Langflow Client**: Async client for flow CRUD and execution

#### Phase 2: Frontend Development
- **React + Vite + TypeScript**: Modern frontend stack
- **Tailwind CSS**: Utility-first styling
- **Clerk React**: Authentication UI components
- **3-Step Q&A Wizard**: Who is Charlie? → Rules → Capabilities
- **Chat Playground**: Real-time chat interface with message history
- **Dashboard**: Agent list with create/delete functionality

#### Phase 3: Integration & Testing
- **Docker Compose**: PostgreSQL + Langflow + Backend orchestration
- **Template Mapping**: Q&A answers injected into Langflow flow templates
- **E2E Testing**: Playwright browser automation for full flow verification

### Technical Fixes Applied

1. **Clerk JWT Validation**
   - Fixed `CLERK_ISSUER` and `CLERK_JWKS_URL` environment variables in docker-compose.yml
   - Updated user service to handle missing email from Clerk JWT (generates placeholder)

2. **Langflow Authentication**
   - Changed from `x-api-key` header to Bearer token authentication
   - Added `auto_login` token fetching for Langflow 1.7+ compatibility

3. **Langflow Flow Template**
   - Replaced simplified template with full Langflow component structure
   - Used "Memory Chatbot" starter project as base template
   - Fixed template_mapping.py to preserve `{memory}` placeholder for conversation history

4. **Fernet Key for Langflow**
   - Generated valid 32-byte base64-encoded Fernet key for API key encryption

### Files Modified
- `docker-compose.yml` - Added Clerk and Anthropic env vars to backend
- `src/backend/app/services/langflow_client.py` - Bearer token auth
- `src/backend/app/services/user_service.py` - Placeholder email handling
- `src/backend/app/services/template_mapping.py` - Memory placeholder preservation
- `src/backend/templates/support_bot.json` - Full Langflow component structure
- `.env` - Valid Fernet key for Langflow

### E2E Test Results
- ✅ User authentication (Clerk sign-in)
- ✅ Agent creation (3-step Q&A wizard)
- ✅ Chat functionality (message send/receive)
- ✅ Conversation memory (agent remembers context)
- ✅ Agent follows configured rules (correct pricing, personality)

---

## 2026-01-03 - Discovery Phase Complete

### Discovery Interview Summary
Conducted comprehensive 8-phase discovery interview (30+ questions) to define project scope, architecture, and success criteria.

### Major Decisions

#### Decision 1: Wrapper Over Deep Fork
**Decision**: Build Teach Charlie AI as a lightweight wrapper around Langflow, not a deep fork.

**Rationale**:
- User's final insight: *"We're not innovating on Langflow - we're packaging it brilliantly for a market that's desperate to learn."*
- Minimizes technical complexity for solo, non-technical founder
- Reduces maintenance burden (don't have to track upstream Langflow changes)
- Faster to MVP (1-2 months is aggressive, simplicity is critical)

**Implications**:
- Focus on custom onboarding layer (3-step Q&A, playground, template mapping)
- Minimal modifications to Langflow core
- Can upgrade to deeper fork in Phase 2 if needed

**Alternatives Considered**:
- Deep fork of Langflow (rejected: too complex, high maintenance)
- Use Langflow as dependency (rejected: limited customization)

---

#### Decision 2: Defer Multi-Tenancy to Phase 2
**Decision**: MVP will have single-user agents only. Multi-tenancy (org management, team features) deferred to Phase 2.

**Rationale**:
- Multi-tenancy is **high-risk** for non-technical founder (data isolation, security)
- Not a launch blocker - users can still create/test agents individually
- Reduces MVP scope significantly (simpler DB schema, no org logic)
- Can validate product-market fit before investing in complex architecture

**Implications**:
- User auth only (Clerk for signup/login)
- No org isolation in MVP
- Agents belong to individual users, not organizations
- Phase 2 will add orgs/teams when there's traction

**Alternatives Considered**:
- Build multi-tenancy from day 1 (rejected: too risky, slows MVP)
- Skip multi-tenancy entirely (rejected: needed for business model)

---

#### Decision 3: Template Mapping (Rule-Based, Not AI-Generated)
**Decision**: Use predefined templates + string substitution to map Q&A answers to flows. Do NOT use AI to generate flows.

**Rationale**:
- AI generation is unpredictable, hard to debug, adds complexity
- Rule-based mapping is simpler, faster, more reliable
- Users' Q&A answers are text-only inputs - easy to inject into templates
- Can upgrade to AI generation later if needed (Phase 3+)

**Implications**:
- Create 3 starter templates (support bot, sales agent, knowledge assistant)
- Backend logic is straightforward Python string manipulation
- Easier to test and validate (deterministic output)

**Alternatives Considered**:
- AI-generated flows (rejected: complexity, unreliable for MVP)
- Manual flow creation (rejected: defeats educational UX goal)

---

#### Decision 4: Clerk Over Supabase Auth
**Decision**: Use Clerk for authentication and future org management.

**Rationale**:
- Better developer experience (easy integration, great docs)
- Built-in org/team management (needed for Phase 2)
- Generous free tier (up to 10K MAUs)
- User asked for recommendation - Clerk is the safer choice

**Implications**:
- Clerk handles signup, login, password reset, JWT tokens
- Backend validates Clerk JWT on every request
- Clerk org features ready when we need them (Phase 2)

**Alternatives Considered**:
- Supabase Auth (viable, but Clerk has better org management)
- Custom auth (rejected: reinventing the wheel, security risk)

---

#### Decision 5: 3-Step Q&A Before Flow Canvas
**Decision**: Users complete 3-step Q&A → Playground → Unlock Flow (not flow canvas first).

**Rationale**:
- Aligns with "Dog Trainer" educational metaphor
- Reduces intimidation factor (no nodes/wires upfront)
- Users see success quickly (working agent in playground)
- Flow canvas is "unlockable" for advanced users (gradual complexity)

**Implications**:
- 3-step Q&A is first-run experience (modal or full-page wizard)
- Playground is intermediate step (test before unlocking canvas)
- Flow canvas is "advanced mode" (for users who want to edit nodes)

**Alternatives Considered**:
- Flow canvas first (rejected: too intimidating for non-technical users)
- Skip playground, go straight to canvas (rejected: no validation step)

---

#### Decision 6: Desktop-Only for MVP
**Decision**: No mobile optimization for MVP. Desktop-only (Chrome, Firefox, Safari, Edge).

**Rationale**:
- Flow canvas is inherently desktop-optimized (drag/drop, node editing)
- Mobile support is nice-to-have, not critical for workshops
- Reduces scope, faster to MVP

**Implications**:
- Responsive design not required
- Test on desktop browsers only
- Mobile support can be added in Phase 2

**Alternatives Considered**:
- Mobile-first (rejected: flow canvas doesn't work well on mobile)
- Mobile-responsive (rejected: adds complexity without value for MVP)

---

#### Decision 7: Freemium Business Model
**Decision**: Free tier + paid Pro plan. Free tier for individuals, Pro for teams/advanced features.

**Rationale**:
- Reduces barrier to entry (free tier lets users try before buying)
- Workshop attendees can start free, upgrade later
- Industry standard for SaaS products
- User has 10 years of experience selling no-code tools with this model

**Implications**:
- Need to define free vs. paid features (Phase 2 decision)
- Stripe integration for billing (Phase 2)
- Free tier limits (e.g., 3 agents, 100 messages/day)

**Alternatives Considered**:
- Free during beta, charge later (rejected: easier to start with freemium)
- Paid-only (rejected: high friction, hard to acquire users)

---

#### Decision 8: E2E Testing Priority (Playwright)
**Decision**: Focus on E2E tests (Playwright) for MVP. Defer unit/integration tests to Phase 2.

**Rationale**:
- E2E tests validate entire user journey (signup → create agent → chat → unlock flow)
- Higher ROI than unit tests for solo founder
- Easier to write/maintain with AI assistance
- User explicitly requested E2E testing

**Implications**:
- Write 3 critical E2E tests (happy path, persistence, error handling)
- Manual testing for edge cases
- Add unit/integration tests later as codebase grows

**Alternatives Considered**:
- Unit tests first (rejected: lower ROI for MVP)
- Manual testing only (rejected: too error-prone, no CI/CD)

---

#### Decision 9: DataStax Hosting (Non-Negotiable)
**Decision**: Deploy to DataStax using Langflow hosting blueprint.

**Rationale**:
- User's requirement (must use DataStax)
- DataStax is Langflow-optimized, reduces ops overhead
- Proven deployment path (Docker Compose blueprint exists)

**Implications**:
- Leverage DataStax's PostgreSQL + pgvector setup
- Use Docker Compose for local development (mirrors production)
- Fallback plan: AWS/GCP if DataStax doesn't work

**Alternatives Considered**:
- AWS/GCP/Azure (considered as fallback only)
- Platform-as-a-Service (Render, Railway) (rejected: user wants DataStax)

---

### Key Insights from Discovery

#### Insight 1: Education > Innovation
> "The platform doesn't need to be anything special or do anything new, it just needs to be reliable. We're just packaging [Langflow] up differently and selling it leveraging my personal strengths."

**Impact**: Shifted architecture from "deep fork" to "lightweight wrapper." Focus on packaging, not technical innovation.

---

#### Insight 2: Non-Technical Founder Risk
User is **solo, non-technical founder** with "some experience" using AI tools to prototype. **This is the #1 risk.**

**Mitigations**:
- Simplify MVP aggressively (ruthless scope cutting)
- Use AI-assisted development (Claude Code) with clear documentation
- Hire technical contractor if blocked
- Extend timeline if needed (1-2 months is aspirational, not hard deadline)

---

#### Insight 3: Workshop-First GTM Strategy
User's 10-year track record selling no-code automation to non-technical users is the **moat**.

**Impact**:
- Platform must be "workshop-ready" (definition of done: "when I can run a workshop with it")
- Educational UX is critical (3-step Q&A, friendly language, progressive complexity)
- Beta testers: 5-10 people already lined up

---

#### Insight 4: Year 1 Is Validation, Not Scale
Target: 100-500 users in Year 1. This is **MVP validation**, not scale mode.

**Impact**:
- Infrastructure can start simple (small-scale hosting, minimal monitoring)
- Freemium pricing can be refined post-launch (test with beta users)
- Growth strategy: workshops, content marketing, viral loops (not paid ads yet)

---

### Open Questions / TBD

1. **Pricing Details**: Free tier limits? Pro plan pricing ($X/month)?
   - Decision: Defer to Phase 2 (after beta testing with 5-10 users)

2. **Langflow Fork vs. Wrapper**: Exactly how deep do we customize?
   - Decision: Start with wrapper (Phase 1), evaluate fork depth in Phase 2

3. **Template Library**: How many templates for MVP? 3 or more?
   - Decision: Start with 3 (support bot, sales agent, knowledge assistant)

4. **Data Backup Strategy**: Automated backups? Point-in-time recovery?
   - Decision: Rely on DataStax/cloud provider for MVP (revisit in Phase 2)

---

## Next Major Milestones

### Milestone 1: Local Development Environment
- Fork Langflow repository
- Set up local dev environment (npm install, uv run langflow)
- Verify Langflow runs locally

**Target Date**: Week 1

---

### Milestone 2: Custom Onboarding Layer
- Build 3-step Q&A modal (React component)
- Build template mapping API (FastAPI endpoint)
- Build playground chat UI (React component)

**Target Date**: Week 2-3

---

### Milestone 3: Auth + Database
- Integrate Clerk authentication
- Set up PostgreSQL locally (Docker Compose)
- Implement database schema (users, agents, conversations, messages)

**Target Date**: Week 3-4

---

### Milestone 4: E2E Testing + Deployment
- Write 3 critical E2E tests (Playwright)
- Deploy to DataStax
- Invite 5-10 beta testers

**Target Date**: Week 5-6 (MVP Launch)

---

## Decisions Log

| Date | Decision | Owner | Status |
|------|----------|-------|--------|
| 2026-01-03 | Wrapper over deep fork | Adam + Claude | ✅ Approved |
| 2026-01-03 | Defer multi-tenancy to Phase 2 | Adam + Claude | ✅ Approved |
| 2026-01-03 | Template mapping (rule-based) | Adam + Claude | ✅ Approved |
| 2026-01-03 | Clerk for auth | Adam + Claude | ✅ Approved |
| 2026-01-03 | 3-step Q&A before canvas | Adam + Claude | ✅ Approved |
| 2026-01-03 | Desktop-only MVP | Adam + Claude | ✅ Approved |
| 2026-01-03 | Freemium business model | Adam + Claude | ✅ Approved |
| 2026-01-03 | E2E testing priority | Adam + Claude | ✅ Approved |
| 2026-01-03 | DataStax hosting | Adam + Claude | ✅ Approved |

---

## References
- [00_PROJECT_SPEC.md](./00_PROJECT_SPEC.md) - Full project specification
- [01_ARCHITECTURE.md](./01_ARCHITECTURE.md) - Technical architecture
- [03_STATUS.md](./03_STATUS.md) - Current status and next steps
