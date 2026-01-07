# Database Architecture

This document describes the database structure for Teach Charlie AI, including table schemas, relationships, and migration status.

## Overview

The application uses **SQLAlchemy 2.0 (async)** with support for both SQLite (development) and PostgreSQL (production). All models inherit from `BaseModel` which provides UUID primary keys and timestamp fields.

## Architecture Evolution

The database has evolved through two phases:

1. **Legacy Phase (MVP)**: Simple `agents` table for Q&A-created agents with Langflow integration
2. **Three-Tab Architecture (Current)**: Separation into `agent_components`, `workflows`, and `mcp_servers`

### Current State

| Table | Status | Purpose |
|-------|--------|---------|
| `users` | Active | Clerk-synced user accounts |
| `agents` | **Legacy** | Original MVP agents (being phased out) |
| `agent_components` | **New** | Reusable AI personalities from Q&A wizard |
| `workflows` | **New** | Langflow flows that orchestrate components |
| `mcp_servers` | **New** | MCP tool integrations |
| `conversations` | Active | Chat sessions (supports both agents and workflows) |
| `messages` | Active | Individual chat messages |
| `projects` | Active | Organization/folder structure |
| `user_settings` | Active | User preferences and API keys |

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

### agents (LEGACY)

Original MVP agent table. **Being phased out** in favor of `agent_components` + `workflows`.

```sql
CREATE TABLE agents (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(36) REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(500),
    qa_who TEXT NOT NULL,
    qa_rules TEXT NOT NULL,
    qa_tricks TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    langflow_flow_id VARCHAR(255),     -- UUID in Langflow
    template_name VARCHAR(100) DEFAULT 'support_bot',
    is_active BOOLEAN DEFAULT TRUE,
    flow_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_agents_user_id ON agents(user_id);
CREATE INDEX ix_agents_project_id ON agents(project_id);
CREATE INDEX ix_agents_langflow_flow_id ON agents(langflow_flow_id);
```

### conversations

Chat sessions between users and agents/workflows.

```sql
CREATE TABLE conversations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_id VARCHAR(36) REFERENCES agents(id) ON DELETE CASCADE,      -- LEGACY
    workflow_id VARCHAR(36) REFERENCES workflows(id) ON DELETE CASCADE, -- NEW
    langflow_session_id VARCHAR(255),  -- Langflow session for context
    title VARCHAR(255),                -- Auto-generated from first message
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_conversations_user_id ON conversations(user_id);
CREATE INDEX ix_conversations_agent_id ON conversations(agent_id);
CREATE INDEX ix_conversations_workflow_id ON conversations(workflow_id);
```

**Note**: Either `agent_id` (legacy) OR `workflow_id` (new) should be set, but both are nullable for migration flexibility.

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

### mcp_servers (NEW)

MCP (Model Context Protocol) server configurations for external tool integrations.

```sql
CREATE TABLE mcp_servers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(36) REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    server_type VARCHAR(50) NOT NULL,  -- 'postgres', 'sqlite', 'playwright', etc.
    command VARCHAR(500) NOT NULL,     -- Command to run (e.g., 'npx')
    args JSON DEFAULT '[]',            -- Command arguments
    env JSON DEFAULT '{}',             -- Environment variables
    credentials_encrypted TEXT,        -- Encrypted credentials JSON
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

---

## Entity Relationships

```
users (core)
├── agent_components (NEW - primary)
│   └── (referenced by workflows via agent_component_ids JSON)
├── workflows (NEW)
│   └── conversations (workflow_id)
│       └── messages
├── agents (LEGACY)
│   └── conversations (agent_id - deprecated)
│       └── messages
├── projects (folders)
│   ├── agent_components
│   ├── workflows
│   ├── mcp_servers
│   └── agents (legacy)
├── user_settings (1-to-1)
└── mcp_servers (global or project-scoped)
```

---

## API to Table Mapping

| API Endpoint Prefix | Database Table | Notes |
|---------------------|----------------|-------|
| `/api/v1/agent-components/*` | `agent_components` | **Primary** - Use this for new features |
| `/api/v1/workflows/*` | `workflows` | Langflow flow orchestration |
| `/api/v1/agents/*` | `agents` | **Legacy** - Avoid for new features |
| `/api/v1/mcp-servers/*` | `mcp_servers` | MCP tool integrations |
| `/api/v1/projects/*` | `projects` | Organization |
| `/api/v1/settings/*` | `user_settings` | User preferences |

---

## Frontend Page to API Mapping

| Page | Uses API | Database Table |
|------|----------|----------------|
| CreateAgentPage | `createAgentComponentFromQA`, `createWorkflowFromAgent` | `agent_components`, `workflows` |
| EditAgentPage | `getAgentComponent`, `updateAgentComponent` | `agent_components` |
| ProjectDetailPage | `listAgentComponents`, `deleteAgentComponent` | `agent_components` |
| PlaygroundPage | `getAgentComponent`, `chatWithWorkflow` | `agent_components`, `workflows` |
| DashboardPage | `listAgents` | `agents` **LEGACY - needs migration** |

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

## Migration Notes

### From Legacy Agents to New Architecture

The legacy `agents` table combined personality + flow in one record. The new architecture separates:

- **AgentComponent**: The personality/knowledge (reusable)
- **Workflow**: The flow that uses components (executable)

To migrate:
1. Create `agent_components` record from agent's Q&A fields
2. Create `workflows` record linked to the component
3. Update `conversations` to use `workflow_id` instead of `agent_id`
4. Mark old agent as inactive

### Database Column Additions

If you encounter "column not found" errors, manually add columns:

```sql
-- Add avatar_url to agent_components
ALTER TABLE agent_components ADD COLUMN avatar_url VARCHAR(500);

-- Add avatar_url to agents (legacy)
ALTER TABLE agents ADD COLUMN avatar_url VARCHAR(500);
```

---

## Best Practices

1. **Always use `agent_components`** for new features, not `agents`
2. **Always create a workflow** when creating an agent component (for chat capability)
3. **Use `workflow_id`** for conversations, not `agent_id`
4. **Project is optional** - resources can be global (project_id = NULL)
5. **Cascade deletes** - deleting a user deletes all their resources
6. **User isolation** - always filter by `user_id` in queries
