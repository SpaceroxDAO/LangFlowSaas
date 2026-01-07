# Plan: Project Tabs Reorganization

## Overview

Transform the current single-tab project view into a three-tab structure:

| Tab | Contents | Purpose |
|-----|----------|---------|
| **Agents** | Custom agent components | Reusable AI agent building blocks |
| **Workflows** | Langflow flows | Complete AI workflows using components |
| **MCP Servers** | MCP server configurations | External tool integrations |

---

## Current State Analysis

### What We Have Now

```
Project
└── "Agents" tab (single tab)
    └── List of "Agents" (which are actually Langflow flows)
        └── Each "agent" = Q&A answers + Langflow flow
```

**Problem**: We conflate two concepts:
1. **Agent Components** - Reusable AI personalities with specific knowledge/rules
2. **Workflows** - Complete flows that orchestrate components + tools

**Current Data Flow**:
```
User Q&A → Template Mapping → Langflow Flow → Stored as "Agent"
```

---

## Proposed Architecture

### Conceptual Model

```
Project
├── Agents Tab
│   └── Agent Components (reusable AI personalities)
│       └── "Charlie the Car Salesman" component
│       └── "Support Bot" component
│       └── "Knowledge Assistant" component
│
├── Workflows Tab
│   └── Langflow Flows (complete workflows)
│       └── "Customer Support Flow" (uses Support Bot + Web Search)
│       └── "Sales Pipeline" (uses Car Salesman + CRM Tool)
│       └── "Research Assistant" (uses Knowledge Assistant + URL Reader)
│
└── MCP Servers Tab
    └── External Tool Configurations
        └── PostgreSQL server
        └── Playwright browser automation
        └── Custom API integrations
```

### Key Distinction

| Concept | Agent Component | Workflow |
|---------|----------------|----------|
| **What it is** | A configured AI personality | A complete flow with multiple components |
| **Langflow equivalent** | Custom Python component | Flow with nodes and edges |
| **Created via** | Q&A wizard | Canvas editor or flow builder |
| **Reusability** | Can be used in multiple workflows | Standalone execution |
| **In sidebar** | Yes (under "My Agents") | No (in project workflows list) |

---

## Data Model Changes

### Current Models

```
User ─┬─► Project ─┬─► Agent (conflated)
      │            │     ├─ name, description
      │            │     ├─ qa_who, qa_rules, qa_tricks
      │            │     ├─ system_prompt
      │            │     ├─ langflow_flow_id
      │            │     └─ flow_data (cached)
      │            │
      └─► Conversation ─► Message
```

### Proposed Models

```
User ─┬─► Project ─┬─► AgentComponent (NEW - replaces Agent)
      │            │     ├─ name, description
      │            │     ├─ qa_who, qa_rules, qa_tricks
      │            │     ├─ system_prompt
      │            │     ├─ component_file_path (Python file)
      │            │     ├─ is_published (visible in sidebar)
      │            │     └─ icon, color (customization)
      │            │
      │            ├─► Workflow (NEW)
      │            │     ├─ name, description
      │            │     ├─ langflow_flow_id
      │            │     ├─ flow_data (cached)
      │            │     ├─ is_active
      │            │     └─ agent_components[] (references)
      │            │
      │            └─► MCPServer (NEW)
      │                  ├─ name, description
      │                  ├─ server_type (postgres, sqlite, custom, etc.)
      │                  ├─ command, args, env (config)
      │                  ├─ is_enabled
      │                  └─ credentials (encrypted)
      │
      └─► Conversation ─► Message (linked to Workflow, not Agent)
```

### Database Schema Changes

#### 1. AgentComponent Table (replaces agents table)

```sql
CREATE TABLE agent_components (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,

    -- Identity
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'bot',
    color VARCHAR(7) DEFAULT '#7C3AED',

    -- Q&A Configuration (educational input)
    qa_who TEXT NOT NULL,
    qa_rules TEXT NOT NULL,
    qa_tricks TEXT,

    -- Generated Output
    system_prompt TEXT NOT NULL,
    component_file_path VARCHAR(500),  -- Path to generated Python file
    component_class_name VARCHAR(255), -- Python class name

    -- State
    is_published BOOLEAN DEFAULT FALSE,  -- Visible in Langflow sidebar
    is_active BOOLEAN DEFAULT TRUE,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agent_components_user ON agent_components(user_id);
CREATE INDEX idx_agent_components_project ON agent_components(project_id);
```

#### 2. Workflows Table (NEW)

```sql
CREATE TABLE workflows (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,

    -- Identity
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Langflow Integration
    langflow_flow_id VARCHAR(36) NOT NULL,
    flow_data JSONB,  -- Cached flow JSON

    -- References to components used
    agent_component_ids UUID[],  -- Array of AgentComponent IDs used

    -- State
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT FALSE,  -- Shareable via link

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workflows_user ON workflows(user_id);
CREATE INDEX idx_workflows_project ON workflows(project_id);
CREATE INDEX idx_workflows_langflow ON workflows(langflow_flow_id);
```

#### 3. MCP Servers Table (NEW)

```sql
CREATE TABLE mcp_servers (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,

    -- Identity
    name VARCHAR(255) NOT NULL,
    description TEXT,
    server_type VARCHAR(50) NOT NULL,  -- postgres, sqlite, playwright, filesystem, git, custom

    -- Configuration (matches .mcp.json structure)
    command VARCHAR(500) NOT NULL,      -- e.g., "npx"
    args JSONB NOT NULL DEFAULT '[]',   -- e.g., ["-y", "@modelcontextprotocol/server-postgres"]
    env JSONB DEFAULT '{}',             -- Environment variables

    -- Credentials (encrypted)
    credentials_encrypted TEXT,         -- Encrypted JSON of sensitive data

    -- State
    is_enabled BOOLEAN DEFAULT TRUE,
    last_health_check TIMESTAMP,
    health_status VARCHAR(50),  -- healthy, unhealthy, unknown

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mcp_servers_user ON mcp_servers(user_id);
CREATE INDEX idx_mcp_servers_project ON mcp_servers(project_id);
```

#### 4. Update Conversations Table

```sql
-- Change foreign key from agent_id to workflow_id
ALTER TABLE conversations
    DROP COLUMN agent_id,
    ADD COLUMN workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE;

CREATE INDEX idx_conversations_workflow ON conversations(workflow_id);
```

### Migration Strategy

```
Phase 1: Add new tables (non-breaking)
  └─► Create agent_components, workflows, mcp_servers tables

Phase 2: Data migration
  └─► For each existing Agent:
      ├─► Create AgentComponent (copy Q&A data)
      ├─► Create Workflow (copy flow data)
      └─► Link conversation to Workflow

Phase 3: Update foreign keys
  └─► Conversations point to Workflow instead of Agent

Phase 4: Remove old table
  └─► Drop agents table (after verification)
```

---

## Backend API Changes

### New Endpoints

#### Agent Components API (`/api/v1/agent-components`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/agent-components/create-from-qa` | Create from Q&A wizard |
| GET | `/agent-components` | List components (with project filter) |
| GET | `/agent-components/{id}` | Get single component |
| PATCH | `/agent-components/{id}` | Update component |
| DELETE | `/agent-components/{id}` | Delete component |
| POST | `/agent-components/{id}/publish` | Publish to Langflow sidebar |
| POST | `/agent-components/{id}/unpublish` | Remove from sidebar |
| GET | `/agent-components/{id}/export` | Export as JSON |
| POST | `/agent-components/import` | Import from JSON |

#### Workflows API (`/api/v1/workflows`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/workflows` | Create new workflow |
| POST | `/workflows/from-template` | Create from template |
| GET | `/workflows` | List workflows (with project filter) |
| GET | `/workflows/{id}` | Get single workflow |
| PATCH | `/workflows/{id}` | Update workflow |
| DELETE | `/workflows/{id}` | Delete workflow |
| POST | `/workflows/{id}/chat` | Chat with workflow |
| GET | `/workflows/{id}/conversations` | List conversations |
| POST | `/workflows/{id}/duplicate` | Duplicate workflow |
| GET | `/workflows/{id}/export` | Export as JSON |
| POST | `/workflows/import` | Import from JSON |

#### MCP Servers API (`/api/v1/mcp-servers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/mcp-servers` | Create MCP server config |
| GET | `/mcp-servers` | List MCP servers |
| GET | `/mcp-servers/{id}` | Get single server |
| PATCH | `/mcp-servers/{id}` | Update server config |
| DELETE | `/mcp-servers/{id}` | Delete server |
| POST | `/mcp-servers/{id}/enable` | Enable server |
| POST | `/mcp-servers/{id}/disable` | Disable server |
| GET | `/mcp-servers/{id}/health` | Check server health |
| POST | `/mcp-servers/sync` | Sync all to .mcp.json |
| GET | `/mcp-servers/templates` | Get predefined templates |

### MCP Server Templates

```python
MCP_SERVER_TEMPLATES = {
    "postgres": {
        "name": "PostgreSQL Database",
        "description": "Query PostgreSQL databases",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-postgres"],
        "env_schema": {
            "POSTGRES_URL": {"type": "string", "required": True, "secret": True}
        }
    },
    "sqlite": {
        "name": "SQLite Database",
        "description": "Query SQLite databases",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-sqlite"],
        "env_schema": {
            "DATABASE_PATH": {"type": "string", "required": True}
        }
    },
    "playwright": {
        "name": "Playwright Browser",
        "description": "Browser automation and web scraping",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-playwright"],
        "env_schema": {}
    },
    "filesystem": {
        "name": "File System",
        "description": "Read and write files",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem"],
        "env_schema": {
            "ALLOWED_PATHS": {"type": "array", "required": True}
        }
    },
    "git": {
        "name": "Git Operations",
        "description": "Programmatic git operations",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-git"],
        "env_schema": {}
    },
    "custom": {
        "name": "Custom Server",
        "description": "Configure your own MCP server",
        "command": "",
        "args": [],
        "env_schema": {}
    }
}
```

---

## Frontend Changes

### ProjectDetailPage Tabs

```tsx
// Current: Single tab
<div className="border-b">
  <button className="border-b-2 border-violet-500">Agents</button>
</div>

// Proposed: Three tabs
<div className="border-b flex">
  <TabButton active={activeTab === 'agents'} onClick={() => setActiveTab('agents')}>
    <Bot className="w-4 h-4" />
    Agents
    <Badge>{agentCount}</Badge>
  </TabButton>

  <TabButton active={activeTab === 'workflows'} onClick={() => setActiveTab('workflows')}>
    <GitBranch className="w-4 h-4" />
    Workflows
    <Badge>{workflowCount}</Badge>
  </TabButton>

  <TabButton active={activeTab === 'mcp'} onClick={() => setActiveTab('mcp')}>
    <Server className="w-4 h-4" />
    MCP Servers
    <Badge>{mcpCount}</Badge>
  </TabButton>
</div>
```

### Tab Content Components

#### Agents Tab (`AgentComponentsList.tsx`)

```tsx
interface AgentComponentsListProps {
  projectId: string
}

function AgentComponentsList({ projectId }: AgentComponentsListProps) {
  // Similar to current agent list but for AgentComponents
  // - List/Grid view toggle
  // - Search by name
  // - Actions: Edit, Publish/Unpublish, Export, Duplicate, Delete
  // - "New Agent" button → CreateAgentPage (Q&A wizard)
  // - Badge showing publish status
}
```

#### Workflows Tab (`WorkflowsList.tsx`)

```tsx
interface WorkflowsListProps {
  projectId: string
}

function WorkflowsList({ projectId }: WorkflowsListProps) {
  // List of Langflow flows
  // - List/Grid view toggle
  // - Search by name
  // - Actions: Edit (opens canvas), Playground, Export, Duplicate, Delete
  // - "New Workflow" button → Options:
  //   - Blank workflow (opens canvas)
  //   - From template
  //   - Quick workflow from agent (auto-creates flow using agent)
  // - Shows which agents are used in each workflow
}
```

#### MCP Servers Tab (`MCPServersList.tsx`)

```tsx
interface MCPServersListProps {
  projectId: string
}

function MCPServersList({ projectId }: MCPServersListProps) {
  // List of MCP server configurations
  // - Card view (not list)
  // - Each card shows:
  //   - Server name and type icon
  //   - Status indicator (healthy/unhealthy)
  //   - Enable/Disable toggle
  //   - Actions: Edit, Test Connection, Delete
  // - "Add MCP Server" button → Modal with:
  //   - Template selection (postgres, sqlite, etc.)
  //   - Configuration form
  //   - Test connection button
}
```

### New Pages/Components

| Component | Path | Purpose |
|-----------|------|---------|
| `AgentComponentsList` | `/src/components/AgentComponentsList.tsx` | Agent components grid/list |
| `WorkflowsList` | `/src/components/WorkflowsList.tsx` | Workflows grid/list |
| `MCPServersList` | `/src/components/MCPServersList.tsx` | MCP servers cards |
| `MCPServerCard` | `/src/components/MCPServerCard.tsx` | Individual MCP server card |
| `MCPServerModal` | `/src/components/MCPServerModal.tsx` | Create/edit MCP server |
| `WorkflowCard` | `/src/components/WorkflowCard.tsx` | Individual workflow card |
| `CreateWorkflowModal` | `/src/components/CreateWorkflowModal.tsx` | New workflow options |

### Routing Updates

```tsx
// Current routes (keep)
/create                    → CreateAgentPage (Q&A wizard)
/edit/:agentId             → EditAgentPage (edit agent component)
/playground/:agentId       → PlaygroundPage (chat with workflow)

// Updated routes
/playground/:workflowId    → PlaygroundPage (chat with workflow)
/canvas/:workflowId        → CanvasViewerPage (edit workflow in Langflow)

// New routes
/mcp/:serverId             → MCPServerDetailPage (optional)
/workflow/create           → CreateWorkflowPage (optional, or use modal)
```

---

## MCP Server Integration Details

### How MCP Syncing Works

```
User creates MCP server in UI
        ↓
Backend saves to mcp_servers table
        ↓
Backend regenerates .mcp.json file
        ↓
Backend triggers Langflow restart (optional)
        ↓
MCP tools appear in Langflow sidebar
```

### MCPServerService

```python
class MCPServerService:
    async def create(self, user: User, data: MCPServerCreate) -> MCPServer:
        """Create MCP server and sync to .mcp.json"""
        server = MCPServer(**data.dict(), user_id=user.id)
        db.add(server)
        await db.commit()
        await self.sync_to_config()
        return server

    async def sync_to_config(self):
        """Regenerate .mcp.json from database"""
        servers = await self.list_enabled()
        config = {"mcpServers": {}}

        for server in servers:
            config["mcpServers"][server.name] = {
                "command": server.command,
                "args": server.args,
                "env": self._decrypt_env(server),
                "disabled": not server.is_enabled
            }

        with open(MCP_CONFIG_PATH, 'w') as f:
            json.dump(config, f, indent=2)

        # Optionally trigger Langflow restart
        if LANGFLOW_AUTO_RESTART:
            await self.restart_langflow()

    async def test_connection(self, server: MCPServer) -> HealthStatus:
        """Test if MCP server can be started"""
        # Spawn server process with timeout
        # Return healthy/unhealthy status
        pass

    async def restart_langflow(self):
        """Trigger Langflow container restart"""
        # Use Docker API or HTTP endpoint
        pass
```

### Credential Encryption

```python
from cryptography.fernet import Fernet

class CredentialManager:
    def __init__(self, key: str):
        self.cipher = Fernet(key.encode())

    def encrypt(self, credentials: dict) -> str:
        """Encrypt credentials for database storage"""
        json_str = json.dumps(credentials)
        return self.cipher.encrypt(json_str.encode()).decode()

    def decrypt(self, encrypted: str) -> dict:
        """Decrypt credentials from database"""
        json_str = self.cipher.decrypt(encrypted.encode()).decode()
        return json.loads(json_str)
```

---

## User Experience Flow

### Creating an Agent Component

```
1. User clicks "New Agent" in Agents tab
        ↓
2. 3-step Q&A wizard (unchanged)
   - Who is Charlie?
   - What are the rules?
   - What tools does Charlie need?
        ↓
3. Backend creates:
   - AgentComponent record in database
   - Python component file (if Phase 3 enabled)
        ↓
4. Agent appears in Agents tab (unpublished)
        ↓
5. User clicks "Publish" to make available in Langflow sidebar
        ↓
6. Agent component appears under "My Agents" in Langflow
```

### Creating a Workflow

```
1. User clicks "New Workflow" in Workflows tab
        ↓
2. Modal offers options:
   - "Blank Workflow" → Opens Langflow canvas
   - "Quick Workflow" → Select agent → Auto-create flow
   - "From Template" → Select predefined template
        ↓
3. For "Quick Workflow":
   - User selects agent component
   - Backend creates flow: ChatInput → [Agent] → ChatOutput
   - Workflow record created
        ↓
4. Workflow appears in Workflows tab
        ↓
5. User can:
   - Open in Playground (chat)
   - Open in Canvas (edit nodes)
   - Share/Deploy
```

### Adding an MCP Server

```
1. User clicks "Add MCP Server" in MCP Servers tab
        ↓
2. Modal shows templates:
   - PostgreSQL, SQLite, Playwright, Filesystem, Git, Custom
        ↓
3. User selects template (e.g., PostgreSQL)
        ↓
4. Configuration form shows:
   - Name (editable)
   - Connection URL (secret input)
   - Test Connection button
        ↓
5. User fills in details, clicks "Test Connection"
        ↓
6. If successful, clicks "Save"
        ↓
7. Backend:
   - Saves to mcp_servers table
   - Regenerates .mcp.json
   - Restarts Langflow (background, ~5-10 seconds)
        ↓
8. MCP server appears in list with "Healthy" status
        ↓
9. User can now use MCP tools in workflows
```

---

## Implementation Phases

### Phase 1: Database & Backend Foundation (Week 1)

1. Create new database models:
   - `AgentComponent` model
   - `Workflow` model
   - `MCPServer` model

2. Create Alembic migrations:
   - Add new tables
   - Keep `agents` table temporarily

3. Create new services:
   - `AgentComponentService`
   - `WorkflowService`
   - `MCPServerService`

4. Create API endpoints:
   - `/api/v1/agent-components/*`
   - `/api/v1/workflows/*`
   - `/api/v1/mcp-servers/*`

### Phase 2: Data Migration (Week 1-2)

1. Write migration script:
   - Split existing agents into AgentComponent + Workflow
   - Update conversation foreign keys

2. Test migration on development database

3. Update existing API calls to use new endpoints

### Phase 3: Frontend Tabs UI (Week 2)

1. Update `ProjectDetailPage`:
   - Add tab navigation
   - Tab state management
   - URL query param for active tab (`?tab=agents`)

2. Create tab content components:
   - `AgentComponentsList`
   - `WorkflowsList`
   - `MCPServersList`

3. Update existing components:
   - Rename references from "Agent" to "AgentComponent" or "Workflow" as appropriate

### Phase 4: MCP Server Management (Week 2-3)

1. Create MCP UI components:
   - `MCPServerCard`
   - `MCPServerModal`
   - Template selection UI

2. Implement MCP sync:
   - `.mcp.json` generation
   - Langflow restart mechanism

3. Add health checking:
   - Background health check job
   - Status indicators in UI

### Phase 5: Testing & Polish (Week 3)

1. Update E2E tests:
   - Test all three tabs
   - Test MCP server creation
   - Test workflow from agent component

2. Update documentation:
   - User-facing help
   - API documentation

3. Visual polish:
   - Consistent styling across tabs
   - Loading states
   - Error handling

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Data migration complexity | Medium | High | Thorough testing, rollback plan |
| MCP restart disruption | Medium | Medium | Background restart, status indicators |
| User confusion (Agent vs Workflow) | Medium | Medium | Clear UI labels, onboarding tooltips |
| Langflow API changes | Low | Medium | Version lock, compatibility layer |
| Performance (three queries per page) | Low | Low | Parallel queries, caching |

---

## Success Criteria

- [ ] All three tabs visible and functional in ProjectDetailPage
- [ ] Existing agents migrated to AgentComponent + Workflow
- [ ] MCP servers can be created, edited, deleted
- [ ] MCP changes sync to .mcp.json
- [ ] Workflows can be created from agent components
- [ ] All E2E tests pass
- [ ] No data loss during migration
- [ ] Page load time < 2 seconds

---

## User Decisions (Confirmed)

### 1. Workflow Creation Flow
**Decision**: Modal with three options
- **Blank Workflow** → Opens Langflow canvas directly
- **Quick Workflow** → Select agent component → Auto-creates flow
- **From Template** → Select predefined template

### 2. Agent Publishing
**Decision**: Two-stage approach for progressive disclosure

| Stage | Action | Result | Restart? |
|-------|--------|--------|----------|
| **Create** | User completes Q&A wizard, clicks "Save" | Agent available in Playground immediately | No |
| **Publish** | User clicks "Publish" button on agent | Agent appears in Langflow sidebar | Yes (with warning) |

**Rationale**:
- Beginners get instant gratification (chat works immediately)
- Advanced users can publish to sidebar when ready
- Aligns with progressive disclosure philosophy

### 3. MCP/Publish Restart Behavior
**Decision**: User-controlled restart with warning

```
User clicks "Publish" (agent) or "Save" (MCP server)
        ↓
Show toast: "Changes saved. Restart required for canvas availability."
        ↓
Show persistent banner in tab:
"⚠️ Pending restart - changes won't appear in canvas until restart"
[Restart Now] [Restart Later]
        ↓
If "Restart Now" clicked, show confirmation:
"Langflow will restart in 5 seconds.
 Recent canvas edits (last ~1 second) may be lost.
 Make sure your work is saved."
[Cancel] [Restart Anyway]
        ↓
5-second countdown with cancel option, then restart
```

**Technical Note**: Langflow autosaves with 300ms debounce, so risk of data loss is minimal but non-zero.

### 4. URL Structure
**Decision**: Persist tab in URL for easy sharing
- Format: `/dashboard/project/{id}?tab=agents|workflows|mcp`
- Default tab: `agents`

### 5. Migration Strategy
**Decision**: Big-bang migration with safety net

```
1. Backup existing database (automated)
2. Run migration script:
   - Each existing "Agent" becomes AgentComponent + Workflow pair
   - Conversations linked to new Workflow
3. Deploy new code
4. Verify via E2E tests
5. Keep backup for 30 days
```

**Rationale**: Small user base (MVP), dual-mode adds complexity, clean cut is easier to test.

---

## Unified Restart Notification System

Both **Agent Publishing** and **MCP Server changes** use the same notification pattern:

### Component: `RestartNotificationBanner`

```tsx
interface RestartNotificationBannerProps {
  pendingChanges: Array<{
    type: 'agent' | 'mcp';
    name: string;
    timestamp: Date;
  }>;
  onRestartNow: () => void;
  onDismiss: () => void;
}

// Usage in ProjectDetailPage
<RestartNotificationBanner
  pendingChanges={[
    { type: 'agent', name: 'Charlie the Car Salesman', timestamp: new Date() },
    { type: 'mcp', name: 'PostgreSQL Server', timestamp: new Date() }
  ]}
  onRestartNow={handleRestartLangflow}
  onDismiss={handleDismissBanner}
/>
```

### Visual Design

```
┌─────────────────────────────────────────────────────────────────────┐
│ ⚠️ Pending changes require Langflow restart to appear in canvas    │
│                                                                     │
│ • Agent: "Charlie the Car Salesman" (published 2 min ago)          │
│ • MCP: "PostgreSQL Server" (added 5 min ago)                       │
│                                                                     │
│                              [Restart Later]  [Restart Now]        │
└─────────────────────────────────────────────────────────────────────┘
```

### Restart Confirmation Modal

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Restart Langflow?                               │
│                                                                     │
│  Langflow will restart in 5 seconds to apply your changes.         │
│                                                                     │
│  ⚠️ Warning: Any unsaved canvas changes from the last second       │
│  may be lost. Langflow autosaves frequently, but there's a         │
│  small window of risk.                                              │
│                                                                     │
│  Changes to apply:                                                  │
│  ✓ Agent: "Charlie the Car Salesman"                               │
│  ✓ MCP Server: "PostgreSQL Server"                                 │
│                                                                     │
│                    [Cancel]  [Restart Now (5)]                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Backend: RestartService

```python
class LangflowRestartService:
    """Manages Langflow container restarts for component/MCP changes."""

    async def get_pending_changes(self, user_id: str) -> List[PendingChange]:
        """Get all unpublished agents and new MCP servers."""
        pass

    async def trigger_restart(self) -> RestartResult:
        """
        Restart Langflow container.
        1. Generate Python component files for published agents
        2. Regenerate .mcp.json from database
        3. Trigger Docker container restart
        4. Wait for health check
        5. Clear pending changes
        """
        pass

    async def get_restart_status(self) -> RestartStatus:
        """Check if restart is in progress, pending, or complete."""
        pass
```

### State Management

```typescript
// Store for tracking pending restart state
interface RestartState {
  pendingChanges: PendingChange[];
  isRestarting: boolean;
  lastRestartTime: Date | null;
  restartCountdown: number | null;
}

// Actions
- addPendingChange(change: PendingChange)
- clearPendingChanges()
- startRestart()
- completeRestart()
- cancelRestart()
```

### User Flow: Publishing an Agent

```
1. User creates agent via Q&A wizard
   └─► Agent saved to database
   └─► Flow created in Langflow
   └─► User redirected to Playground (can chat immediately!)

2. User clicks "Publish" button on agent card
   └─► API: POST /agent-components/{id}/publish
   └─► Agent marked as is_published=true
   └─► Toast: "Agent published! Restart required for canvas availability."
   └─► Banner appears in Agents tab

3. User can continue working (banner persists)

4. When ready, user clicks "Restart Now"
   └─► Confirmation modal with 5-second countdown
   └─► Backend generates Python component file
   └─► Backend restarts Langflow container
   └─► After ~5-10 seconds, agent appears in Langflow sidebar
   └─► Banner disappears, success toast shown
```

### User Flow: Adding MCP Server

```
1. User clicks "Add MCP Server" in MCP tab
   └─► Modal shows server templates

2. User selects template (e.g., PostgreSQL)
   └─► Configuration form appears

3. User fills credentials, clicks "Test Connection"
   └─► Backend tests MCP server can start
   └─► Success/failure feedback

4. User clicks "Save"
   └─► API: POST /mcp-servers
   └─► Server saved to database
   └─► Toast: "MCP Server saved! Restart required for canvas availability."
   └─► Banner appears in MCP tab (same banner component)

5. Same restart flow as agent publishing
```

---

## File Summary

### New Backend Files
- `src/backend/app/models/agent_component.py`
- `src/backend/app/models/workflow.py`
- `src/backend/app/models/mcp_server.py`
- `src/backend/app/schemas/agent_component.py`
- `src/backend/app/schemas/workflow.py`
- `src/backend/app/schemas/mcp_server.py`
- `src/backend/app/api/agent_components.py`
- `src/backend/app/api/workflows.py`
- `src/backend/app/api/mcp_servers.py`
- `src/backend/app/services/agent_component_service.py`
- `src/backend/app/services/workflow_service.py`
- `src/backend/app/services/mcp_server_service.py`

### New Frontend Files
- `src/frontend/src/components/AgentComponentsList.tsx`
- `src/frontend/src/components/WorkflowsList.tsx`
- `src/frontend/src/components/MCPServersList.tsx`
- `src/frontend/src/components/MCPServerCard.tsx`
- `src/frontend/src/components/MCPServerModal.tsx`
- `src/frontend/src/components/WorkflowCard.tsx`
- `src/frontend/src/components/CreateWorkflowModal.tsx`
- `src/frontend/src/components/ProjectTabs.tsx`

### Modified Files
- `src/frontend/src/pages/ProjectDetailPage.tsx` (add tabs)
- `src/frontend/src/types/index.ts` (new types)
- `src/frontend/src/lib/api.ts` (new endpoints)
- `src/backend/app/main.py` (register new routers)
- `src/backend/app/models/__init__.py` (export new models)

---

## Appendix: Langflow MCP Integration Notes

From research, Langflow's MCP implementation:

1. **Configuration**: `.mcp.json` file in project root
2. **No database storage**: MCP servers are not in Langflow DB
3. **Subprocess model**: Each MCP server runs as a subprocess
4. **UI location**: Sidebar → "MCP Tools" section
5. **CSS selector**: `[data-testid="sidebar-nav-mcp"]`

Our approach adds database storage and UI management on top of this, syncing to `.mcp.json` for Langflow compatibility.
