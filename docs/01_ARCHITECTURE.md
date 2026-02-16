# Technical Architecture: Teach Charlie AI

**Last Updated**: 2026-02-16
**Status**: MVP Complete (Phase 13) + OpenClaw Integration (Phase 2)
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

### OpenClaw Integration (MCP Bridge + TC Connector)

```
┌───────────────────────────────┐
│       OpenClaw Agent          │  (user's local AI agent)
│       (local machine)         │
└───────────┬───────────────────┘
            │ stdio (MCP protocol)
            ▼
┌───────────────────────────────┐
│      TC Connector CLI         │  npm package: tc-connector
│   (@modelcontextprotocol/sdk) │  runs as local MCP server
└───────────┬───────────────────┘
            │ HTTPS + Bearer token (mcp_bridge_token)
            ▼
┌───────────────────────────────┐
│   Teach Charlie API           │
│   /api/v1/mcp/bridge/*        │  FastAPI endpoints
│   ├─ GET  /tools              │  list skill-enabled workflows
│   └─ POST /tools/call         │  execute via WorkflowService.chat()
└───────────┬───────────────────┘
            │ internal
            ▼
┌───────────────────────────────┐
│       Langflow                │  executes the workflow
└───────────────────────────────┘
```
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

**Phase 9 - Three-Tab Architecture (implemented 2026-01-07)**:

> **Note**: Phase 9 added significant schema changes. See `docs/15_PROJECT_TABS_REORGANIZATION.md` for full details.

```sql
-- Agent Components (reusable AI personalities)
CREATE TABLE agent_components (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'bot',
  color VARCHAR(7) DEFAULT '#7C3AED',
  qa_who TEXT NOT NULL,
  qa_rules TEXT NOT NULL,
  qa_tricks TEXT,
  system_prompt TEXT NOT NULL,
  component_file_path VARCHAR(500),
  component_class_name VARCHAR(255),
  is_published BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workflows (Langflow flows)
CREATE TABLE workflows (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  langflow_flow_id VARCHAR(36) NOT NULL,
  flow_data JSONB,
  agent_component_ids UUID[],
  is_active BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- MCP Servers (external tool integrations)
CREATE TABLE mcp_servers (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  server_type VARCHAR(50) NOT NULL,
  command VARCHAR(500) NOT NULL,
  args JSONB NOT NULL DEFAULT '[]',
  env JSONB DEFAULT '{}',
  credentials_encrypted TEXT,
  is_enabled BOOLEAN DEFAULT TRUE,
  last_health_check TIMESTAMP,
  health_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Settings
CREATE TABLE user_settings (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  default_llm_provider VARCHAR(50) DEFAULT 'openai',
  api_keys_encrypted JSONB,
  theme VARCHAR(20) DEFAULT 'light',
  sidebar_collapsed BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  tours_completed JSONB DEFAULT '{}',
  settings_json JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Conversations now link to workflows (not agents)
ALTER TABLE conversations ADD COLUMN workflow_id UUID REFERENCES workflows(id);
CREATE INDEX idx_conversations_workflow ON conversations(workflow_id);
```

**Phase 12-17 - Additional Tables (implemented 2026-01-10 to 2026-01-21)**:

```sql
-- Knowledge Sources (RAG data for agents)
CREATE TABLE knowledge_sources (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_component_id UUID REFERENCES agent_components(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  source_type VARCHAR(50) NOT NULL, -- 'text', 'file', 'url'
  content TEXT,
  file_path VARCHAR(500),
  url VARCHAR(2000),
  metadata JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'ready', -- 'pending', 'processing', 'ready', 'error'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions (Stripe billing)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan_id VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'team'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'canceled', 'past_due', 'trialing'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  credits_used INTEGER DEFAULT 0,
  credits_limit INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Billing Events (Stripe webhook audit trail)
CREATE TABLE billing_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_event_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Daily (aggregated metrics)
CREATE TABLE analytics_daily (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  conversations_count INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  agents_created INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, record_date)
);

-- Missions (gamified learning)
CREATE TABLE missions (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  difficulty VARCHAR(50) DEFAULT 'beginner',
  xp_reward INTEGER DEFAULT 100,
  badge_name VARCHAR(100),
  badge_icon VARCHAR(100),
  steps JSONB NOT NULL, -- Array of step objects
  prerequisites UUID[], -- Mission IDs that must be completed first
  ui_config JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Mission Progress
CREATE TABLE user_mission_progress (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  current_step INTEGER DEFAULT 0,
  completed_steps JSONB DEFAULT '[]',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

-- User Connections (Composio OAuth integrations)
CREATE TABLE user_connections (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_name VARCHAR(255) NOT NULL, -- 'gmail', 'slack', 'notion', etc.
  account_identifier VARCHAR(500), -- Email or username
  composio_connection_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'connected', 'disconnected', 'error'
  scopes JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  connected_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, app_name, account_identifier)
);

-- Agent Presets (templates for wizard)
CREATE TABLE agent_presets (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  icon VARCHAR(50),
  color VARCHAR(7),
  qa_who TEXT NOT NULL,
  qa_rules TEXT NOT NULL,
  qa_tricks TEXT,
  suggested_tools JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Composite Indexes for Performance (20260124_0001 migration)
CREATE INDEX ix_messages_conversation_created ON messages(conversation_id, created_at);
CREATE INDEX ix_conversations_user_created ON conversations(user_id, created_at);
CREATE INDEX ix_workflows_user_created ON workflows(user_id, created_at);
CREATE INDEX ix_workflows_user_langflow ON workflows(user_id, langflow_flow_id);
CREATE INDEX ix_agent_components_user_created ON agent_components(user_id, created_at);
CREATE INDEX ix_agent_components_user_published ON agent_components(user_id, is_published);
CREATE INDEX ix_knowledge_sources_user_created ON knowledge_sources(user_id, created_at);
CREATE INDEX ix_billing_events_user_created ON billing_events(user_id, created_at);
CREATE INDEX ix_projects_user_sort ON projects(user_id, sort_order);
CREATE INDEX ix_mcp_servers_user_created ON mcp_servers(user_id, created_at);
CREATE INDEX ix_user_connections_user_status ON user_connections(user_id, status);
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
- Public endpoints (embed widget) use embed tokens instead

### Complete API Endpoint Reference (21 Routers, 140+ Endpoints)

#### Agent Components (`/api/v1/agent-components`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-from-qa` | Create from Q&A wizard |
| GET | `/` | List components (paginated) |
| GET | `/{id}` | Get single component |
| PATCH | `/{id}` | Update component |
| DELETE | `/{id}` | Delete component |
| POST | `/{id}/publish` | Publish to Langflow sidebar |
| POST | `/{id}/unpublish` | Remove from Langflow sidebar |
| POST | `/{id}/duplicate` | Duplicate component |
| GET | `/{id}/export` | Export as JSON |
| POST | `/import` | Import from JSON |

#### Agent Presets (`/api/v1/agent-presets`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all presets |
| GET | `/{id}` | Get preset by ID |
| GET | `/category/{category}` | List by category |
| POST | `/` | Create preset (admin) |

#### Workflows (`/api/v1/workflows`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create workflow |
| POST | `/from-agent` | Create from agent component |
| POST | `/from-template` | Create from template |
| GET | `/` | List workflows (paginated) |
| GET | `/{id}` | Get workflow details |
| PATCH | `/{id}` | Update workflow |
| DELETE | `/{id}` | Delete workflow |
| POST | `/{id}/duplicate` | Duplicate workflow |
| GET | `/{id}/export` | Export as JSON |
| POST | `/{id}/chat` | Chat with workflow (streaming) |
| GET | `/{id}/conversations` | List conversations |
| POST | `/{id}/repair` | Repair Langflow sync |

#### MCP Servers (`/api/v1/mcp-servers`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/templates` | List server templates |
| POST | `/` | Create MCP server |
| POST | `/from-template` | Create from template |
| GET | `/` | List MCP servers |
| GET | `/{id}` | Get single server |
| PATCH | `/{id}` | Update server |
| DELETE | `/{id}` | Delete server |
| POST | `/{id}/enable` | Enable server |
| POST | `/{id}/disable` | Disable server |
| GET | `/{id}/health` | Check health |
| POST | `/sync` | Sync to .mcp.json |
| POST | `/sync-and-restart` | Sync and restart Langflow |

#### Billing (`/api/v1/billing`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subscription` | Get current subscription |
| POST | `/checkout` | Create Stripe checkout session |
| POST | `/portal` | Create billing portal session |
| POST | `/webhook` | Stripe webhook handler |
| GET | `/usage` | Get usage statistics |
| GET | `/plans` | List available plans |

#### Missions (`/api/v1/missions`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all missions |
| GET | `/{id}` | Get mission details |
| GET | `/progress` | Get user's progress |
| POST | `/{id}/start` | Start a mission |
| POST | `/{id}/steps/{step}/complete` | Complete a step |
| POST | `/{id}/complete` | Complete entire mission |

#### Connections (Composio OAuth) (`/api/v1/connections`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List user connections |
| GET | `/apps` | List available apps (500+) |
| POST | `/initiate` | Start OAuth flow |
| GET | `/callback` | OAuth callback |
| DELETE | `/{id}` | Disconnect app |
| GET | `/{id}/actions` | List available actions |

#### Knowledge Sources (`/api/v1/knowledge-sources`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List knowledge sources |
| POST | `/text` | Add text source |
| POST | `/file` | Upload file source |
| POST | `/url` | Add URL source |
| DELETE | `/{id}` | Delete source |
| GET | `/{id}/search` | Search within source |

#### Embed Widget (`/api/v1/embed`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/widget.js` | Get embed widget script |
| GET | `/{token}` | Get embed config |
| POST | `/{token}/chat` | Public chat endpoint |
| GET | `/{token}/conversations` | List embed conversations |

#### Analytics (`/api/v1/analytics`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/overview` | Dashboard overview |
| GET | `/conversations` | Conversation metrics |
| GET | `/agents` | Agent usage metrics |
| GET | `/daily` | Daily aggregated stats |

#### Additional Routers
- **Projects** (`/api/v1/projects`): Project CRUD, organization
- **Settings** (`/api/v1/settings`): User preferences, API keys
- **Avatars** (`/api/v1/avatars`): Avatar generation, caching
- **Files** (`/api/v1/files`): File upload, storage management
- **Chat Files** (`/api/v1/chat-files`): In-chat file handling
- **Dashboard** (`/api/v1/dashboard`): Dashboard data aggregation
- **Langflow** (`/api/v1/langflow`): Direct Langflow operations
- **Health** (`/health`): Health check endpoints

**Error Handling**:
- Standardized ErrorResponse schema with error codes
- Global exception handlers for consistent formatting
- User-friendly messages (not technical jargon)
- Example:
  ```json
  {
    "error": "Charlie couldn't understand that. Can you try again?",
    "code": "VALIDATION_ERROR",
    "details": {}
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
| **Frontend** | React 19 + Vite + TypeScript | Fast builds, type safety, modern React features |
| **UI Framework** | Tailwind CSS 4 | Utility-first, consistent styling |
| **State Management** | TanStack Query | Server state caching, optimistic updates |
| **Backend** | FastAPI (Python 3.11) | Async-first, auto OpenAPI docs, great performance |
| **Database** | PostgreSQL 16 + pgvector | Production-ready, vector search for RAG |
| **ORM** | SQLAlchemy 2.0 (async) | Modern async support, type hints |
| **Migrations** | Alembic | Schema versioning, rollback support |
| **Auth** | Clerk | JWT validation, user management, orgs |
| **AI Engine** | Langflow | Flow-based agent execution, multi-provider |
| **LLM Providers** | OpenAI, Anthropic, Ollama | Multi-provider via Langflow |
| **Tool Integrations** | Composio | 500+ OAuth app integrations |
| **Payment** | Stripe | Subscriptions, usage billing, webhooks |
| **Vector DB** | Chroma (via Langflow) | Embeddings storage for RAG |
| **Caching** | Redis | Rate limiting, session data |
| **Hosting** | Docker Compose / DataStax | Containerized, production-ready |
| **Reverse Proxy** | nginx | SSL termination, Langflow overlay |
| **Error Tracking** | Sentry | Error monitoring, performance tracing |
| **Testing** | Playwright + Vitest + Pytest | E2E, component, and unit testing |
| **CI/CD** | GitHub Actions (planned) | Automated testing and deployment |

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
