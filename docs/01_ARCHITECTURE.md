# Technical Architecture: Teach Charlie AI

**Last Updated**: 2026-01-03
**Status**: Architecture Defined - Ready for Implementation
**Owner**: Claude Code (Technical) + Adam (Product)

## Executive Summary

Teach Charlie AI is built as a **lightweight wrapper around Langflow**, not a deep fork. The core strategy is:
- **Leverage Langflow as-is** for the agent execution engine
- **Build a custom onboarding layer** (3-step Q&A → template mapping → playground)
- **Minimize modifications to Langflow core** to reduce maintenance burden
- **Focus on packaging and presentation**, not technical innovation

This architecture is designed for a **solo, non-technical founder using AI-assisted development** with a **1-2 month MVP timeline** and **$100-$500/month budget**.

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User's Browser                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐   ┌────────────────┐   ┌────────────┐  │
│  │  Landing Page  │   │  3-Step Q&A    │   │ Playground │  │
│  │  (Marketing)   │──▶│  (Onboarding)  │──▶│  (Chat UI) │  │
│  └────────────────┘   └────────────────┘   └────────────┘  │
│                                │                            │
│                                ▼                            │
│                       ┌────────────────┐                    │
│                       │ Flow Canvas    │                    │
│                       │ (Langflow UI)  │                    │
│                       └────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐   ┌────────────────┐   ┌────────────┐  │
│  │ Template       │   │ Agent Runtime  │   │ Auth API   │  │
│  │ Mapping Engine │   │ (Langflow)     │   │ (Clerk)    │  │
│  └────────────────┘   └────────────────┘   └────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL)                      │
├─────────────────────────────────────────────────────────────┤
│  Users, Orgs, Agents, Flows, Conversations, Messages        │
│  + pgvector for future RAG/embeddings                        │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. Frontend Layer (React + React Flow)

**Technology**:
- React (Langflow's existing frontend)
- React Flow (canvas for node-based editing)
- Vite (build tool)

**Custom Components**:
1. **Landing Page** (new)
   - Marketing site with clear value prop
   - Signup CTA, workshop info
   - Static or simple React app

2. **3-Step Q&A Onboarding** (new)
   - Modal or full-page wizard
   - Three questions about Charlie (who, rules, tricks)
   - Form validation, helpful examples
   - Submits to backend template mapping API

3. **Playground (Chat Interface)** (new)
   - Simple chat UI (like ChatGPT interface)
   - User can test their agent
   - Shows agent responses in real-time
   - "Unlock Flow" button to reveal canvas

4. **Flow Canvas** (existing Langflow)
   - Langflow's React Flow canvas
   - Minimal modifications (maybe hide nodes, simplify sidebar)
   - "Lock" behind playground until user is ready

**State Management**:
- Consider adding **Zustand** or **Jotai** for:
  - User session state (who's logged in, which org)
  - Agent state (current agent being edited)
  - Onboarding progress (which step user is on)

#### 2. Backend Layer (FastAPI + Python)

**Technology**:
- FastAPI (Langflow's backend framework)
- Python 3.9+
- SQLAlchemy (ORM)
- Pydantic (data validation)

**Custom APIs** (new endpoints):

1. **Template Mapping API**
   ```python
   POST /api/v1/agents/create-from-qa
   Request Body:
   {
     "who": "Charlie is a customer support agent for a bakery",
     "rules": "Friendly, knows hours (9-5), menu (cookies, cakes)",
     "tricks": "Answer questions, take orders"
   }

   Response:
   {
     "agent_id": "uuid",
     "flow_id": "uuid",
     "status": "created"
   }
   ```

   **Logic**:
   - Parse Q&A answers
   - Select appropriate template (support bot, sales agent, etc.)
   - Populate template with user's text (system prompt, knowledge base)
   - Create Langflow flow programmatically
   - Return agent ID for playground

2. **Playground Chat API**
   ```python
   POST /api/v1/agents/{agent_id}/chat
   Request Body:
   {
     "message": "Hi Charlie, what are your hours?",
     "conversation_id": "uuid" (optional)
   }

   Response:
   {
     "response": "We're open 9am-5pm every day!",
     "conversation_id": "uuid"
   }
   ```

   **Logic**:
   - Load agent flow from database
   - Execute Langflow flow with user message
   - Return LLM response
   - Save conversation history

3. **Agent Management API**
   ```python
   GET /api/v1/agents (list user's agents)
   GET /api/v1/agents/{agent_id} (get specific agent)
   PUT /api/v1/agents/{agent_id} (update agent)
   DELETE /api/v1/agents/{agent_id} (delete agent)
   ```

**Existing Langflow APIs** (inherit as-is):
- Flow execution
- Node management
- LLM provider integration
- File uploads

#### 3. Authentication & Authorization (Clerk or Supabase)

**Recommendation**: **Clerk** (better DX, org management out of the box)

**Integration**:
- Clerk handles signup, login, password reset
- Clerk provides JWT tokens for API auth
- Backend validates JWT on every request
- Clerk manages orgs/teams (Phase 2)

**For MVP** (simplify):
- Single-user agents (no multi-tenancy)
- User auth only (no org isolation)
- Defer org/team features to Phase 2

#### 4. Database (PostgreSQL + pgvector)

**Schema Design**:

```sql
-- Users (managed by Clerk, mirror in our DB)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agents (user's Charlie agents)
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, -- e.g., "Bakery Support Bot"
  description TEXT, -- e.g., "Answers customer questions"

  -- Q&A answers (store for editing later)
  qa_who TEXT, -- "Charlie is a..."
  qa_rules TEXT, -- "Charlie should be..."
  qa_tricks TEXT, -- "Charlie can fetch..."

  -- Langflow flow reference
  flow_id UUID, -- points to Langflow's flow table
  flow_json JSONB, -- store entire flow config for portability

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversations (chat sessions in playground)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255), -- auto-generated from first message
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages (individual chat messages)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  metadata JSONB, -- store LLM provider, model, tokens, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
```

**Phase 2 - Multi-Tenancy (deferred)**:
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  plan VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE org_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- admin, member
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- Agents belong to orgs (not users)
ALTER TABLE agents ADD COLUMN org_id UUID REFERENCES organizations(id);
```

#### 5. Hosting & Deployment (DataStax)

**Infrastructure**:
- **Platform**: DataStax (Langflow-optimized hosting)
- **Containers**: Docker Compose
  - Langflow container (FastAPI backend)
  - PostgreSQL container (with pgvector extension)
  - Nginx (reverse proxy, SSL termination)

**Deployment Process**:
1. Fork Langflow repository
2. Add custom frontend components (onboarding, playground)
3. Add custom backend APIs (template mapping, playground chat)
4. Use **RAGStack AI Langflow** deployment guide: https://github.com/datastax/ragstack-ai-langflow
5. Customize Docker Compose file for DataStax deployment (PostgreSQL + pgvector + Langflow)
6. Set up environment variables via DataStax dashboard
7. Deploy to DataStax using RAGStack AI Langflow blueprint

**CI/CD** (Future):
- GitHub Actions for automated testing
- Push to `main` branch triggers deployment
- Run E2E tests before deploy

## Data Flow

### Critical User Flow: Create Agent from Q&A

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Completes 3-Step Q&A                                │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend POSTs to /api/v1/agents/create-from-qa         │
│    Body: { who: "...", rules: "...", tricks: "..." }       │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend: Template Mapping Engine                         │
│    - Parse answers                                          │
│    - Select template (support bot, sales agent, etc.)       │
│    - Populate template with user text                       │
│    - Generate Langflow flow JSON                            │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend: Save to Database                                │
│    - INSERT INTO agents (user_id, qa_who, flow_json, ...)  │
│    - INSERT INTO langflow.flows (for Langflow runtime)      │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Backend: Return agent_id                                 │
│    Response: { agent_id: "uuid", status: "created" }       │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend: Redirect to Playground                         │
│    URL: /playground/{agent_id}                              │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. User Chats with Agent in Playground                      │
│    - User: "Hi Charlie, what are your hours?"               │
│    - POST /api/v1/agents/{agent_id}/chat                    │
│    - Agent: "We're open 9am-5pm every day!"                 │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. User Unlocks Flow (Optional)                             │
│    - Clicks "See how Charlie works"                         │
│    - Frontend loads Langflow canvas                         │
│    - Shows nodes, connections, system prompt                │
└─────────────────────────────────────────────────────────────┘
```

## Template Mapping Logic

### Strategy: Rule-Based Mapping (Not AI-Generated)

For **MVP**, use **predefined templates** and **string substitution**, NOT AI generation. This is simpler, faster, and more reliable.

### Template Example: "Support Bot"

**Template Flow (JSON)**:
```json
{
  "nodes": [
    {
      "id": "input-1",
      "type": "ChatInput",
      "position": { "x": 100, "y": 100 },
      "data": { "label": "User Question" }
    },
    {
      "id": "llm-1",
      "type": "OpenAI",
      "position": { "x": 300, "y": 100 },
      "data": {
        "model": "gpt-3.5-turbo",
        "system_prompt": "{{SYSTEM_PROMPT}}", // Template variable
        "temperature": 0.7
      }
    },
    {
      "id": "output-1",
      "type": "ChatOutput",
      "position": { "x": 500, "y": 100 },
      "data": { "label": "Charlie's Response" }
    }
  ],
  "edges": [
    { "source": "input-1", "target": "llm-1" },
    { "source": "llm-1", "target": "output-1" }
  ]
}
```

**Mapping Logic** (Python pseudocode):
```python
def create_agent_from_qa(who, rules, tricks):
    # Build system prompt from Q&A answers
    system_prompt = f"""
You are {who}.

Your rules:
{rules}

Your capabilities:
{tricks}

Be helpful, friendly, and stay in character.
""".strip()

    # Load support bot template
    template = load_template("support_bot.json")

    # Replace template variables
    template_str = json.dumps(template)
    template_str = template_str.replace("{{SYSTEM_PROMPT}}", system_prompt)
    flow = json.loads(template_str)

    # Save to database
    agent = create_agent(user_id, flow)

    return agent.id
```

### Template Library (MVP)

Start with **3 templates**:
1. **Support Bot** - Simple Q&A, no external data
2. **Sales Agent** - Lead qualification, captures contact info
3. **Knowledge Assistant** - Retrieves info from uploaded docs (future RAG)

**Phase 2**: Allow users to browse template library, remix templates.

## API Design

### RESTful API Structure

**Base URL**: `/api/v1`

**Authentication**:
- All endpoints require Clerk JWT in `Authorization: Bearer <token>` header
- Middleware validates JWT and extracts `user_id`

**Endpoints**:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create new user (Clerk handles) |
| POST | `/auth/login` | Login (Clerk handles) |
| GET | `/auth/me` | Get current user info |
| POST | `/agents/create-from-qa` | Create agent from Q&A answers |
| GET | `/agents` | List user's agents |
| GET | `/agents/{agent_id}` | Get specific agent |
| PUT | `/agents/{agent_id}` | Update agent |
| DELETE | `/agents/{agent_id}` | Delete agent |
| POST | `/agents/{agent_id}/chat` | Send message to agent (playground) |
| GET | `/agents/{agent_id}/conversations` | List conversations |
| GET | `/conversations/{conv_id}/messages` | Get messages in conversation |

**Error Handling**:
- Standard HTTP status codes (200, 400, 401, 404, 500)
- Friendly error messages (not technical jargon)
- Example:
  ```json
  {
    "error": "Charlie couldn't understand that. Can you try again?",
    "code": "INVALID_INPUT"
  }
  ```

## Security Architecture

### Authentication Flow
1. User signs up/logs in via Clerk
2. Clerk issues JWT token
3. Frontend stores JWT in localStorage
4. Every API request includes JWT in `Authorization` header
5. Backend middleware validates JWT, extracts `user_id`
6. Backend enforces: User can only access their own agents

### Authorization (Phase 2 - Multi-Tenancy)
- Org-level isolation: `WHERE agent.org_id = current_user.org_id`
- Role-based access: Admins can manage org, members can only view/edit

### Secrets Management
- **Never commit secrets to git**
- Use `.env` file for local development
- Use DataStax environment variables for production
- Rotate API keys regularly

### Rate Limiting (Cost Control)
- Limit API calls per user (e.g., 100 messages/day for free tier)
- LLM usage tracking (count tokens, estimate cost)
- Alert when user approaches limit

## Performance Optimization

### Frontend
- **Code splitting**: Load onboarding, playground, canvas separately
- **Lazy loading**: Don't load Langflow canvas until user unlocks
- **Caching**: Cache agent flows in localStorage for fast loading

### Backend
- **Database indexing**: Index `user_id`, `agent_id`, `conversation_id`
- **Query optimization**: Use `SELECT *` sparingly, fetch only needed fields
- **Connection pooling**: Reuse database connections

### LLM Response Time
- **Streaming**: Stream LLM responses for instant feedback (Phase 2)
- **Caching**: Cache common questions/answers (Phase 2)
- **Model selection**: Default to `gpt-3.5-turbo` (fast, cheap), allow upgrade to GPT-4

## Monitoring & Observability

### MVP (Minimal)
- **Error Tracking**: Sentry free tier
- **Logging**: Console logs, CloudWatch (DataStax)
- **Manual Monitoring**: Check DataStax dashboard daily

### Phase 2 (Robust)
- **APM**: Application performance monitoring (Datadog, New Relic)
- **User Analytics**: PostHog or Mixpanel (funnels, retention)
- **Uptime Monitoring**: UptimeRobot or Pingdom

## Deployment Strategy

### MVP Deployment
1. **Fork Langflow** on GitHub
2. **Customize** (add onboarding, playground, template mapping)
3. **Test Locally** (Docker Compose)
4. **Deploy to DataStax** (using Langflow blueprint)
5. **Manual Testing** (smoke test key flows)
6. **Launch** (invite 5-10 beta testers)

### Phase 2 - CI/CD
- GitHub Actions workflow
- Run E2E tests (Playwright) on every PR
- Auto-deploy to staging on merge to `main`
- Manual approval for production deploy

## Testing Strategy

### E2E Tests (Playwright) - Priority for MVP
- **Test 1**: Signup → Q&A → Playground → Chat works
- **Test 2**: Create agent → Save → Reload → Agent persists
- **Test 3**: Error handling (invalid input, LLM timeout)

### Manual Testing (MVP)
- Test on Chrome, Firefox, Safari
- Test happy path (create agent, chat, unlock flow)
- Test edge cases (empty inputs, long messages, special characters)

### Future Testing
- Unit tests (Jest/Vitest) for template mapping logic
- Integration tests for API endpoints
- Performance tests (load testing with k6)

## Technology Stack Summary

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React + React Flow | Inherit from Langflow, proven for node-based UIs |
| **State Management** | Zustand or Jotai | Lightweight, easy to learn for AI-assisted dev |
| **Backend** | FastAPI (Python) | Langflow's existing backend, great docs |
| **Database** | PostgreSQL + pgvector | Production-ready, supports vectors for future RAG |
| **Auth** | Clerk | Best DX, org management built-in |
| **Hosting** | DataStax | Langflow-optimized, low ops overhead |
| **LLM Providers** | OpenAI, Anthropic, etc. | Inherit Langflow's multi-provider support |
| **Payment** | Stripe | Industry standard, great docs |
| **Email** | SendGrid or Resend | Reliable transactional email |
| **Analytics** | PostHog or Mixpanel | Open-source option, good free tier |
| **Error Tracking** | Sentry | Free tier, easy integration |
| **Testing** | Playwright | E2E testing, works with CI/CD |

## Migration Path (Langflow to Custom)

### Phase 1 - Wrapper (MVP)
- Use Langflow as-is, add custom UI layer
- Minimal modifications to Langflow core
- Focus: Onboarding, playground, template mapping

### Phase 2 - Selective Customization
- Hide unused Langflow nodes (sidebar pruning)
- Rename technical terms ("System Prompt" → "Charlie's Job Description")
- Add beginner/advanced mode toggle

### Phase 3 - Deep Fork (Future)
- Modify Langflow core for multi-tenancy
- Custom node types for educational UX
- White-label capabilities

## Risks & Mitigations

### Architecture Risks

**Risk 1: Forking Langflow is too complex**
- **Mitigation**: Start with wrapper, not fork. Add custom UI layer on top of unmodified Langflow.
- **Fallback**: Use Langflow as a dependency, not a fork (harder to customize, but simpler).

**Risk 2: Template mapping doesn't work**
- **Mitigation**: Use simple rule-based templates, not AI generation. Test with beta users.
- **Fallback**: Allow users to manually edit flows (skip template mapping).

**Risk 3: DataStax hosting issues**
- **Mitigation**: Test thoroughly in local environment first. Have backup plan (AWS, Render).
- **Fallback**: Self-host on AWS/GCP if DataStax doesn't work.

## Next Steps

1. **Fork Langflow** and set up local development environment
2. **Build 3-step Q&A frontend** (React component)
3. **Build template mapping backend** (FastAPI endpoint)
4. **Build playground chat UI** (React component)
5. **Integrate Clerk auth**
6. **Set up PostgreSQL database** (locally, then DataStax)
7. **E2E test** (create agent, chat, unlock flow)
8. **Deploy to DataStax**
9. **Invite beta testers**

## References
- [Langflow GitHub Repository](https://github.com/logspace-ai/langflow)
- [RAGStack AI Langflow (DataStax Deployment)](https://github.com/datastax/ragstack-ai-langflow)
- [Langflow Architecture Docs](https://docs.langflow.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [React Flow Documentation](https://reactflow.dev/)
- [DataStax Platform](https://www.datastax.com/)
