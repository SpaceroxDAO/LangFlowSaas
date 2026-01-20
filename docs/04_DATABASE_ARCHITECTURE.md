# Database Architecture

This document describes the database structure for Teach Charlie AI, including table schemas, relationships, and migration status.

**Last Audit**: 2026-01-18

## Overview

The application uses **SQLAlchemy 2.0 (async)** with **PostgreSQL** (via Docker Compose). All models inherit from `BaseModel` which provides UUID primary keys and timestamp fields.

> **IMPORTANT**: Always use Docker Compose for development. Do NOT use standalone SQLite or Langflow Desktop.
> ```bash
> docker-compose -f docker-compose.dev.yml up -d
> ```
> This starts PostgreSQL (port 5432) and Langflow (port 7860) in Docker containers.

---

## Infrastructure Summary

### Database Services by Environment

| Component | Dev Stack (`docker-compose.dev.yml`) | Full Stack (`docker-compose.yml`) | Purpose |
|-----------|--------------------------------------|-----------------------------------|---------|
| **PostgreSQL 16** | ✅ Port 5432 | ✅ Port 5432 | Primary relational database |
| **Redis 7** | ❌ Not included | ✅ Port 6379 | Distributed rate limiting |
| **Chroma** | Embedded (no volume) | ✅ `chroma_data` volume | Vector embeddings for RAG |

### PostgreSQL Databases (2 on same server)

| Database | Owner | Managed By | Access Pattern |
|----------|-------|------------|----------------|
| `teachcharlie` | Backend | Alembic migrations | Direct SQLAlchemy ORM |
| `langflow` | Langflow | Langflow internal | **HTTP API only** (no direct SQL) |

> **CRITICAL**: We never access Langflow's database directly. All Langflow integration is via HTTP API (`/api/v1/flows/`, `/api/v1/run/`, etc.). This allows independent scaling and version upgrades.

### Connection Strings

```bash
# Backend → teachcharlie (async)
DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/teachcharlie

# Langflow → langflow (standard)
LANGFLOW_DATABASE_URL=postgresql://postgres:postgres@postgres:5432/langflow

# Redis (full stack only)
REDIS_URL=redis://redis:6379
```

---

## Architecture Evolution

The database has evolved through two phases:

1. **Legacy Phase (MVP)**: Simple `agents` table for Q&A-created agents with Langflow integration
2. **Three-Tab Architecture (Current)**: Separation into `agent_components`, `workflows`, and `mcp_servers`

### Current State (16 Active Tables)

| Table | Status | Purpose |
|-------|--------|---------|
| `users` | Active | Clerk-synced user accounts |
| `user_settings` | Active | User preferences and API keys |
| `projects` | Active | Organization/folder structure |
| `agent_components` | Active | Reusable AI personalities from Q&A wizard |
| `workflows` | Active | Langflow flows that orchestrate components |
| `mcp_servers` | Active | MCP tool integrations (STDIO, SSE, HTTP) |
| `conversations` | Active | Chat sessions linked to workflows |
| `messages` | Active | Individual chat messages with feedback |
| `user_files` | Active | Uploaded file metadata |
| `knowledge_sources` | Active | RAG document storage metadata |
| `agent_presets` | Active | Pre-built agent templates |
| `subscriptions` | Active | Stripe subscription tracking |
| `billing_events` | Active | Stripe webhook audit trail |
| `analytics_daily` | Active | Aggregated daily usage metrics |
| `missions` | Active | Guided learning content |
| `user_mission_progress` | Active | User learning progress tracking |

> **Note**: The legacy `agents` table was **removed** in migration `20260115_0001_cleanup_legacy_tables.py`. Use `agent_components` + `workflows` instead.

---

## Table Schemas

### users

Core user table synced from Clerk authentication.

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_users_clerk_id ON users(clerk_id);
CREATE INDEX ix_users_email ON users(email);
```

### agent_components (NEW - Primary)

Reusable AI agent personalities created via the 3-step Q&A wizard. This is the **primary table** for agents.

```sql
CREATE TABLE agent_components (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(36) REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'bot',
    color VARCHAR(20) DEFAULT '#7C3AED',
    avatar_url VARCHAR(500),           -- AI-generated avatar image URL
    qa_who TEXT NOT NULL,              -- Q&A Step 1: "Who is Charlie?"
    qa_rules TEXT NOT NULL,            -- Q&A Step 2: "What rules?"
    qa_tricks TEXT DEFAULT '',         -- Q&A Step 3: "What tools?"
    system_prompt TEXT NOT NULL,       -- Generated from Q&A answers
    component_file_path VARCHAR(500),  -- Path to published Python component
    component_class_name VARCHAR(255), -- Published class name
    is_published BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_agent_components_user_id ON agent_components(user_id);
CREATE INDEX ix_agent_components_project_id ON agent_components(project_id);
```

### workflows (NEW)

Langflow flows that orchestrate agent components, tools, and logic.

```sql
CREATE TABLE workflows (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(36) REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    langflow_flow_id VARCHAR(255),     -- UUID in Langflow backend
    flow_data JSONB,                   -- Cached Langflow flow JSON
    agent_component_ids JSON DEFAULT '[]',  -- Array of component UUIDs used
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT FALSE,   -- Public shareable link
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_workflows_user_id ON workflows(user_id);
CREATE INDEX ix_workflows_project_id ON workflows(project_id);
CREATE INDEX ix_workflows_langflow_flow_id ON workflows(langflow_flow_id);
```

### conversations

Chat sessions between users and workflows.

```sql
CREATE TABLE conversations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workflow_id VARCHAR(36) REFERENCES workflows(id) ON DELETE CASCADE,
    langflow_session_id VARCHAR(255),  -- Langflow session for context
    title VARCHAR(255),                -- Auto-generated from first message
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_conversations_user_id ON conversations(user_id);
CREATE INDEX ix_conversations_workflow_id ON conversations(workflow_id);
```

### messages

Individual chat messages within conversations.

```sql
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,         -- 'user', 'assistant', or 'system'
    content TEXT NOT NULL,
    message_metadata JSONB,            -- Metadata from Langflow response
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_messages_conversation_id ON messages(conversation_id);
```

### projects

Organization/folder structure for agents and workflows.

```sql
CREATE TABLE projects (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'folder',
    color VARCHAR(20) DEFAULT '#f97316',
    is_default BOOLEAN DEFAULT FALSE,  -- One per user, cannot delete
    is_archived BOOLEAN DEFAULT FALSE, -- Soft delete flag
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_projects_user_id ON projects(user_id);
```

### mcp_servers

MCP (Model Context Protocol) server configurations for external tool integrations.
Supports three transport types: STDIO (command-based), SSE, and HTTP.

```sql
CREATE TABLE mcp_servers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(36) REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    server_type VARCHAR(50) NOT NULL,  -- 'postgres', 'sqlite', 'playwright', 'sse', 'custom'

    -- Transport type (determines which fields to use)
    transport VARCHAR(20) DEFAULT 'stdio',  -- 'stdio', 'sse', or 'http'

    -- STDIO transport (command-based)
    command VARCHAR(500),              -- e.g., 'npx', 'python'
    args JSON DEFAULT '[]',            -- Command arguments

    -- SSE/HTTP transport (URL-based)
    url VARCHAR(2000),                 -- Server URL
    headers JSON DEFAULT '{}',         -- HTTP headers (Authorization, etc.)
    ssl_verify BOOLEAN DEFAULT TRUE,
    use_cache BOOLEAN DEFAULT FALSE,   -- Cache connections for performance

    -- Environment & Credentials
    env JSON DEFAULT '{}',             -- Non-sensitive environment variables
    credentials_encrypted TEXT,        -- Encrypted sensitive credentials

    -- Status & Health
    is_enabled BOOLEAN DEFAULT TRUE,
    needs_sync BOOLEAN DEFAULT TRUE,   -- Needs sync to Langflow
    last_health_check TIMESTAMP,
    health_status VARCHAR(50) DEFAULT 'unknown',  -- 'healthy', 'unhealthy', 'unknown'

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_mcp_servers_user_id ON mcp_servers(user_id);
CREATE INDEX ix_mcp_servers_project_id ON mcp_servers(project_id);
```

**Transport Types:**
- **STDIO**: Traditional command-based (requires `command` + `args`)
- **SSE**: Server-Sent Events (requires `url`)
- **HTTP**: Direct HTTP calls (requires `url`)

### user_settings

User preferences, API keys, and onboarding state.

```sql
CREATE TABLE user_settings (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    default_llm_provider VARCHAR(50) DEFAULT 'openai',
    api_keys_encrypted JSON,           -- Encrypted API keys dict
    theme VARCHAR(20) DEFAULT 'light', -- 'light', 'dark', 'system'
    sidebar_collapsed BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    tours_completed JSON DEFAULT '{}', -- Map of completed tour IDs
    settings_json JSON,                -- Extensible settings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_user_settings_user_id ON user_settings(user_id);
```

### user_files

Uploaded file metadata (actual files stored on disk).

```sql
CREATE TABLE user_files (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(36) REFERENCES projects(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,          -- Stored filename (UUID-based)
    original_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,      -- MIME type
    size INTEGER NOT NULL,                   -- Bytes
    storage_path VARCHAR(500) NOT NULL,      -- Relative to uploads directory
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_user_files_user_id ON user_files(user_id);
CREATE INDEX ix_user_files_project_id ON user_files(project_id);
```

### knowledge_sources

RAG document metadata (vectors stored in Chroma).

```sql
CREATE TABLE knowledge_sources (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(36) REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(20) NOT NULL,        -- 'file' or 'url'
    file_path VARCHAR(500),                  -- For file sources
    original_filename VARCHAR(255),
    mime_type VARCHAR(100),
    file_size INTEGER,
    url VARCHAR(2000),                       -- For URL sources
    status VARCHAR(20) DEFAULT 'pending',    -- pending, processing, ready, error
    error_message TEXT,
    collection_id VARCHAR(100),              -- Chroma collection ID
    chunk_count INTEGER DEFAULT 0,
    content_preview TEXT,                    -- First ~500 chars
    metadata_json JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_knowledge_sources_user_id ON knowledge_sources(user_id);
CREATE INDEX ix_knowledge_sources_project_id ON knowledge_sources(project_id);
```

### agent_presets

Pre-built agent templates (system-wide, not per-user).

```sql
CREATE TABLE agent_presets (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Bot',          -- Lucide icon name
    category VARCHAR(100) DEFAULT 'general',
    gradient VARCHAR(50),                    -- CSS gradient class
    tags JSONB DEFAULT '[]',
    who TEXT NOT NULL,                       -- Step 1: identity
    rules TEXT,                              -- Step 2: rules/knowledge
    tools JSONB,                             -- Step 3: tools
    system_prompt TEXT,
    model_provider VARCHAR(50) DEFAULT 'OpenAI',
    model_name VARCHAR(100) DEFAULT 'gpt-4o-mini',
    temperature VARCHAR(10) DEFAULT '0.7',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order VARCHAR(10) DEFAULT '100',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### subscriptions

Stripe subscription tracking (1:1 with users).

```sql
CREATE TABLE subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    plan_id VARCHAR(50) DEFAULT 'free',      -- free, pro, team
    status VARCHAR(50) DEFAULT 'active',     -- active, canceled, past_due, trialing
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX ix_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
```

### billing_events

Stripe webhook audit trail.

```sql
CREATE TABLE billing_events (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,        -- e.g., 'subscription.created', 'invoice.paid'
    stripe_event_id VARCHAR(255) UNIQUE,     -- For deduplication
    payload JSONB,                           -- Full event payload
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_billing_events_user_id ON billing_events(user_id);
CREATE INDEX ix_billing_events_stripe_event_id ON billing_events(stripe_event_id);
```

### analytics_daily

Aggregated daily usage metrics per user.

```sql
CREATE TABLE analytics_daily (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    conversations_count INTEGER DEFAULT 0,
    messages_count INTEGER DEFAULT 0,
    tokens_used BIGINT DEFAULT 0,
    agents_created INTEGER DEFAULT 0,
    agents_active INTEGER DEFAULT 0,
    workflows_created INTEGER DEFAULT 0,
    workflows_executed INTEGER DEFAULT 0,
    avg_response_time_ms INTEGER,
    error_count INTEGER DEFAULT 0,
    breakdown JSONB,                         -- Per-agent/workflow details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, record_date)
);

CREATE INDEX ix_analytics_daily_user_id ON analytics_daily(user_id);
```

### missions

Guided learning content (system-wide).

```sql
CREATE TABLE missions (
    id VARCHAR(50) PRIMARY KEY,              -- e.g., 'L001', 'L001-hello-charlie'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,           -- skill_sprint, applied_build
    difficulty VARCHAR(20) DEFAULT 'beginner',
    estimated_minutes INTEGER DEFAULT 30,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    steps JSONB NOT NULL,                    -- Array of step objects
    prerequisites JSONB,                     -- Array of mission IDs
    outcomes JSONB,                          -- Learning outcomes
    template_id VARCHAR(100),                -- e.g., 'agent_base'
    component_pack JSONB,                    -- Allowed components
    canvas_mode BOOLEAN DEFAULT FALSE,
    ui_config JSONB,                         -- UI visibility settings
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_missions_category ON missions(category);
CREATE INDEX ix_missions_sort_order ON missions(sort_order);
```

### user_mission_progress

Tracks user progress through missions.

```sql
CREATE TABLE user_mission_progress (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mission_id VARCHAR(50) NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed
    current_step INTEGER DEFAULT 0,
    completed_steps JSONB DEFAULT '[]',       -- Array of completed step IDs
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    artifacts JSONB,                          -- Created agent/workflow IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, mission_id)
);

CREATE INDEX ix_user_mission_progress_user_id ON user_mission_progress(user_id);
CREATE INDEX ix_user_mission_progress_status ON user_mission_progress(status);
```

---

## Entity Relationships

```
users (core identity - synced from Clerk)
│
├── user_settings (1:1) ─────────── User preferences, API keys
├── subscription (1:1) ──────────── Stripe billing
│
├── projects (folders) ──────────── Organization structure
│   ├── agent_components ────────── AI personalities from Q&A wizard
│   ├── workflows ───────────────── Langflow flow orchestration
│   ├── mcp_servers ─────────────── External tool integrations
│   ├── user_files ──────────────── Uploaded documents
│   └── knowledge_sources ───────── RAG document metadata
│
├── workflows ───────────────────── Can be global (no project)
│   └── conversations ───────────── Chat sessions
│       └── messages ────────────── Individual messages
│
├── billing_events ──────────────── Stripe webhook audit trail
├── analytics_daily ─────────────── Daily usage aggregates
└── user_mission_progress ───────── Learning progress

Standalone tables (not per-user):
├── agent_presets ───────────────── Pre-built agent templates
└── missions ────────────────────── Guided learning content
```

---

## API to Table Mapping

| API Endpoint Prefix | Database Table | Notes |
|---------------------|----------------|-------|
| `/api/v1/agent-components/*` | `agent_components` | AI personalities from Q&A wizard |
| `/api/v1/workflows/*` | `workflows` | Langflow flow orchestration |
| `/api/v1/mcp-servers/*` | `mcp_servers` | MCP tool integrations |
| `/api/v1/projects/*` | `projects` | Organization folders |
| `/api/v1/settings/*` | `user_settings` | User preferences |
| `/api/v1/files/*` | `user_files` | File uploads |
| `/api/v1/knowledge/*` | `knowledge_sources` | RAG document metadata |
| `/api/v1/presets/*` | `agent_presets` | Pre-built templates |
| `/api/v1/billing/*` | `subscriptions`, `billing_events` | Stripe integration |
| `/api/v1/analytics/*` | `analytics_daily` | Usage metrics |
| `/api/v1/missions/*` | `missions`, `user_mission_progress` | Learning system |

---

## Frontend Page to API Mapping

| Page | Uses API | Database Table |
|------|----------|----------------|
| CreateAgentPage | `createAgentComponentFromQA`, `createWorkflowFromAgent` | `agent_components`, `workflows` |
| EditAgentPage | `getAgentComponent`, `updateAgentComponent` | `agent_components` |
| ProjectDetailPage | `listAgentComponents`, `deleteAgentComponent` | `agent_components` |
| PlaygroundPage | `getAgentComponent`, `chatWithWorkflow` | `agent_components`, `workflows` |
| WorkflowsPage | `listWorkflows` | `workflows` |
| FilesPage | `listFiles`, `uploadFile` | `user_files` |
| BillingPage | `getSubscription`, `createCheckoutSession` | `subscriptions` |
| AnalyticsDashboardPage | `getDailyAnalytics` | `analytics_daily` |
| MissionsPage | `listMissions`, `getMissionProgress` | `missions`, `user_mission_progress` |

---

## Data Flow: Creating an Agent

When a user creates an agent via the 3-step Q&A wizard:

1. **Step 1-3**: User fills out Q&A form (who, rules, tricks)
2. **CreateAgentPage** calls `api.createAgentComponentFromQA()`:
   - Creates row in `agent_components` table
   - Generates system prompt from Q&A answers
   - Optionally generates AI avatar via DALL-E
3. **CreateAgentPage** calls `api.createWorkflowFromAgent()`:
   - Creates row in `workflows` table
   - Creates Langflow flow with the agent component
   - Stores `langflow_flow_id` for chat integration
4. **Navigate** to PlaygroundPage with workflow ID

---

## Chat Flow

For chatting with an agent:

1. **PlaygroundPage** receives agent component ID
2. Fetches `agent_components` record for display
3. Searches `workflows` table for workflows containing this component
4. Uses `chatWithWorkflow()` API which:
   - Creates/retrieves `conversations` record (with `workflow_id`)
   - Sends message to Langflow via `langflow_flow_id`
   - Stores messages in `messages` table

---

## Migration History

### Completed: Legacy Agents to Three-Tab Architecture (2026-01-15)

The legacy `agents` table has been **removed**. Migration `20260115_0001_cleanup_legacy_tables.py` deleted it.

The new architecture separates concerns:
- **AgentComponent**: The personality/knowledge (reusable across workflows)
- **Workflow**: The Langflow flow that orchestrates components (executable)

All conversations now use `workflow_id` instead of the deprecated `agent_id`.

### Alembic Migrations (16 total)

| Date | Migration | Purpose |
|------|-----------|---------|
| 2026-01-03 | `initial_schema` | Core tables (users, conversations, messages, projects) |
| 2026-01-07 | `add_advanced_config` | Model settings (temperature, max_tokens) |
| 2026-01-09 | `add_selected_tools` | Tool selection for agents |
| 2026-01-10 | `add_knowledge_source_ids` | RAG integration |
| 2026-01-10 | `add_message_editing_and_feedback_columns` | Message UX features |
| 2026-01-14 | `add_agent_presets_table` | Pre-built templates |
| 2026-01-14 | `add_billing_tables` | Stripe subscriptions |
| 2026-01-14 | `add_analytics_tables` | Daily metrics |
| 2026-01-14 | `add_missions_tables` | Learning system |
| 2026-01-14 | `add_embed_fields` | Embedding configuration |
| 2026-01-15 | `cleanup_legacy_tables` | **Removed deprecated `agents` table** |
| 2026-01-16 | `add_mission_canvas_fields` | Mission canvas mode |
| 2026-01-17 | `add_mission_ui_config` | Mission UI customization |
| 2026-01-17 | `add_mcp_servers_table` | MCP server configuration |
| 2026-01-18 | `add_mcp_transport_fields` | SSE/HTTP transport for MCP |
| 2026-01-18 | `add_mcp_use_cache_field` | MCP connection caching |

---

## Best Practices

1. **Use `agent_components`** for AI personalities created via Q&A wizard
2. **Use `workflows`** for executable Langflow flows
3. **Always create a workflow** when creating an agent component (for chat capability)
4. **Use `workflow_id`** for conversations (not deprecated `agent_id`)
5. **Project is optional** - resources can be global (`project_id = NULL`)
6. **Cascade deletes** - deleting a user deletes all their resources
7. **User isolation** - always filter by `user_id` in queries (enforced at service layer)
8. **Never access Langflow DB directly** - use HTTP API via `langflow_client.py`
