# Composio Integration Guide for Teach Charlie

> **Status**: Phase 2 Complete (Tool Integration Implemented)
> **Last Updated**: 2026-01-21
> **Author**: Implementation Guide for Multi-User Tool Integration

---

## Implementation Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1: Foundation | **Complete** | OAuth connection management, settings page |
| Phase 2: Agent Integration | **Complete** | Composio tools in chat, availability indicators |
| Phase 3: Mission Integration | Pending | Mission-required connections |
| Phase 4: Polish & Scale | Pending | Monitoring, additional apps |

---

## User Journey: From Connection to Tool Usage

This section documents the complete user experience for connecting apps and using them in AI chat.

### Journey Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPOSIO USER JOURNEY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. DISCOVER                    2. CONNECT                3. USE            │
│  ┌─────────────────┐           ┌─────────────────┐       ┌─────────────────┐│
│  │ Dashboard       │    →      │ Connections     │   →   │ Playground      ││
│  │ /connections    │           │ OAuth Flow      │       │ Enhanced Chat   ││
│  └─────────────────┘           └─────────────────┘       └─────────────────┘│
│                                                                              │
│  User sees available           User authorizes           Tools appear as    │
│  apps they can connect         via OAuth popup           badges above chat  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 1: Discover Available Apps

**URL**: `/dashboard/connections`

The user navigates to the Connections page from the dashboard. They see:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🔗 Connected Apps                                                           │
│                                                                              │
│  Connect your apps to give Charlie superpowers!                              │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  📧 Gmail                                                            │    │
│  │  Read, search, and send emails                                      │    │
│  │  [Connect]                                                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  📅 Google Calendar                                                  │    │
│  │  View and create calendar events                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  💬 Slack                                                            │    │
│  │  Send messages and manage channels                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Technical Flow**:
1. Frontend calls `GET /api/v1/connections/apps`
2. Backend uses `ComposioConnectionService.get_available_apps(user)`
3. Returns list of apps with connection status per user

### Step 2: Initiate OAuth Connection

When user clicks "Connect" on an app:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Connecting Gmail...                                                         │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          OAUTH POPUP                                 │    │
│  │                                                                      │    │
│  │  ┌──────────────────────────────────────────────────────────────┐  │    │
│  │  │                      Google                                   │  │    │
│  │  │                                                               │  │    │
│  │  │  Sign in with Google                                         │  │    │
│  │  │                                                               │  │    │
│  │  │  Teach Charlie wants access to:                              │  │    │
│  │  │  ✓ Read your emails                                          │  │    │
│  │  │  ✓ Send emails on your behalf                                │  │    │
│  │  │  ✓ Manage your calendar                                      │  │    │
│  │  │                                                               │  │    │
│  │  │  [Cancel]                             [Allow]                │  │    │
│  │  └──────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Technical Flow**:
1. Frontend calls `POST /api/v1/connections/initiate` with `{ app_name: "gmail" }`
2. Backend uses Composio SDK:
   - Creates integration: `client.integrations.create(use_composio_auth=True)`
   - Initiates connection: `client.connected_accounts.initiate(integration_id=...)`
3. Returns `{ redirect_url: "https://composio...", connection_id: "..." }`
4. Frontend opens popup to `redirect_url`
5. User completes OAuth in Google's UI
6. Composio redirects back to callback URL

### Step 3: Handle OAuth Callback

After successful OAuth:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ✅ Gmail Connected Successfully!                                            │
│                                                                              │
│  Your account john@gmail.com is now connected.                              │
│  Charlie can now help you with:                                             │
│  • Searching your inbox                                                     │
│  • Reading email content                                                    │
│  • Sending emails on your behalf                                            │
│                                                                              │
│  [Got it!]                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Technical Flow**:
1. Frontend listens for popup close or postMessage
2. Calls `POST /api/v1/connections/callback` with `{ connection_id }`
3. Backend verifies connection status with Composio
4. Stores connection record in `user_connections` table
5. Returns connection details with status "active"

### Step 4: See Connected Tools in Playground

When user opens any agent's playground:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Charlie - Sales Agent                                    [Settings] [Share]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                        │  │
│  │        (Chat messages appear here)                                    │  │
│  │                                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Connected Tools: [📧 Gmail] [📅 Calendar] [💬 Slack]    [Manage →]   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Type your message...                                        [Send]  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Technical Flow**:
1. PlaygroundPage loads and calls `GET /api/v1/connections/tools/availability`
2. `ComposioAgentService.check_user_has_tools(user)` returns availability
3. `ComposioAgentService.get_available_tools_for_user(user)` returns tool list
4. Frontend displays connected apps as colorful badges with emoji icons
5. Hovering a badge shows tooltip: "Gmail is connected - 15 actions available"
6. "Manage" link navigates to `/dashboard/connections`

### Step 5: Chat with Connected Tools

When user sends a message that could use connected tools:

```
User: "Search my inbox for emails from John about the proposal"

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  👤 You                                                              2:30 PM│
│  Search my inbox for emails from John about the proposal                    │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  🤖 Charlie                                                          2:30 PM│
│  I'll search your Gmail for emails from John about the proposal.            │
│                                                                              │
│  🔧 Using GMAIL_SEARCH...                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Query: from:john proposal                                           │   │
│  │ Found: 3 emails                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  I found 3 emails from John about the proposal:                             │
│                                                                              │
│  1. **Re: Q1 Proposal Draft** (Jan 18)                                      │
│     "Looks good, let's discuss the pricing section..."                      │
│                                                                              │
│  2. **Proposal Feedback** (Jan 15)                                          │
│     "I've reviewed the initial draft and have some thoughts..."             │
│                                                                              │
│  3. **Proposal Meeting** (Jan 12)                                           │
│     "Can we schedule a call to go over the proposal?"                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Technical Flow (Enhanced Chat)**:
1. Frontend can use either:
   - Standard Langflow execution (tools defined in flow)
   - Enhanced Composio execution (direct LangChain agent)
2. For enhanced chat, calls `POST /api/v1/connections/chat/stream`
3. Backend creates LangChain agent with Composio tools:
   ```python
   toolset = ComposioToolSet(api_key=settings.composio_api_key)
   tools = toolset.get_tools(entity_id=str(user.id))
   agent = create_openai_functions_agent(llm, tools, prompt)
   ```
4. Agent executes and streams results via SSE
5. Tool calls are visible in the stream (tool_call_start, tool_call_end events)

### Connection Status Management

Users can manage connections from the Connections page:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📧 Gmail                                              Status: ✅ Active     │
│  Connected as: john@gmail.com                                               │
│  Connected: 3 days ago                                                      │
│  Last used: 2 hours ago                                                     │
│                                                                              │
│  Available Actions:                                                         │
│  • GMAIL_SEARCH - Search your inbox                                        │
│  • GMAIL_READ - Read email content                                         │
│  • GMAIL_SEND - Send emails                                                │
│  • GMAIL_CREATE_DRAFT - Create email drafts                                │
│                                                                              │
│  [Refresh Connection]  [Disconnect]                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Available Actions**:
- **Refresh**: `POST /api/v1/connections/{id}/refresh` - Re-validates with Composio
- **Disconnect**: `POST /api/v1/connections/{id}/revoke` - Marks as revoked
- **Delete**: `DELETE /api/v1/connections/{id}` - Permanently removes record

### Error Handling

**Expired Token**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ⚠️ Gmail connection needs refresh                                          │
│                                                                              │
│  Your Gmail connection has expired. Please reconnect to continue            │
│  using Gmail features.                                                       │
│                                                                              │
│  [Reconnect Gmail]                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

**No Connections**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  💡 Connect your apps for more power!                                        │
│                                                                              │
│  Charlie can do more when connected to your apps.                           │
│  Try connecting Gmail, Calendar, or Slack.                                  │
│                                                                              │
│  [Connect Apps →]                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation Reference

This section documents the actual implemented files and their purposes.

### Backend Files

| File | Purpose |
|------|---------|
| `app/services/composio_connection_service.py` | OAuth flow management, connection CRUD |
| `app/services/composio_agent_service.py` | LangChain agent execution with Composio tools |
| `app/api/connections.py` | REST API endpoints for connections and enhanced chat |
| `app/schemas/connection.py` | Pydantic models for request/response validation |
| `app/models/user_connection.py` | SQLAlchemy model for `user_connections` table |

### Frontend Files

| File | Purpose |
|------|---------|
| `src/pages/ConnectionsPage.tsx` | Connections management UI |
| `src/pages/PlaygroundPage.tsx` | Chat with tool availability indicators |
| `src/lib/api.ts` | API client methods |
| `src/types/index.ts` | TypeScript interfaces |

### API Endpoints (Implemented)

#### Connection Management

```
GET    /api/v1/connections/apps                    # List available apps
POST   /api/v1/connections/initiate                # Start OAuth flow
POST   /api/v1/connections/callback                # Handle OAuth callback
GET    /api/v1/connections                         # List user's connections
GET    /api/v1/connections/{id}                    # Get connection details
GET    /api/v1/connections/{id}/status             # Check connection status
POST   /api/v1/connections/{id}/refresh            # Refresh connection
POST   /api/v1/connections/{id}/revoke             # Revoke connection
DELETE /api/v1/connections/{id}                    # Delete connection
```

#### Tool Execution

```
POST   /api/v1/connections/tools                   # Get tools for apps
GET    /api/v1/connections/tools/availability      # Check if user has tools
POST   /api/v1/connections/chat                    # Enhanced chat (non-streaming)
POST   /api/v1/connections/chat/stream             # Enhanced chat (SSE streaming)
```

### Key Classes

#### ComposioConnectionService

Handles OAuth flows and connection management:

```python
class ComposioConnectionService:
    async def get_available_apps(user) -> ComposioAppsResponse
    async def initiate_connection(user, data) -> ConnectionInitiateResponse
    async def handle_callback(user, connection_id) -> ConnectionResponse
    async def get_tools_for_user(user, app_names) -> ConnectionToolsResponse
    async def get_active_connections(user_id) -> List[UserConnection]
```

#### ComposioAgentService

Executes LangChain agents with Composio tools:

```python
class ComposioAgentService:
    async def check_user_has_tools(user) -> bool
    async def get_available_tools_for_user(user) -> List[Dict]
    def _get_langchain_tools(user, app_names) -> List[Tool]
    async def chat(user, message, workflow, ...) -> Dict
    async def chat_stream(user, message, workflow, ...) -> AsyncGenerator[StreamEvent]
```

### Streaming Events

The enhanced chat stream (`/connections/chat/stream`) emits these SSE events:

| Event Type | Description |
|------------|-------------|
| `session_start` | Session initialized with session_id |
| `text_delta` | Incremental text from LLM |
| `text_complete` | Final complete text |
| `tool_call_start` | Tool execution beginning (shows tool name, input) |
| `tool_call_end` | Tool execution complete (shows output) |
| `error` | Error occurred |
| `done` | Stream complete |

### Database Schema

```sql
CREATE TABLE user_connections (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    app_name VARCHAR(100) NOT NULL,
    app_display_name VARCHAR(255),
    composio_connection_id VARCHAR(255),
    composio_entity_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',  -- pending, active, expired, revoked
    connected_at TIMESTAMP,
    last_used_at TIMESTAMP,
    account_identifier VARCHAR(255),
    scopes JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Environment Variables

```bash
# Required
COMPOSIO_API_KEY=your_composio_api_key

# Optional (defaults shown)
DEFAULT_LLM_MODEL=gpt-4o
```

---

## Executive Summary

Composio provides a unified integration layer that enables Teach Charlie users to connect their personal accounts (Gmail, Calendar, Slack, etc.) to their AI agents without the complexity of OAuth implementation. This document outlines the architecture, implementation phases, and considerations for integrating Composio into the Teach Charlie platform.

### Key Benefits
- **Zero OAuth Implementation**: Composio handles all OAuth flows, token refresh, and credential storage
- **500+ Integrations**: Immediate access to Gmail, Calendar, Slack, HubSpot, Notion, and more
- **Multi-Tenant by Design**: Built-in user isolation via entity IDs
- **White-Label Ready**: OAuth popups can show Teach Charlie branding
- **MCP Compatible**: Can run as an MCP server alongside existing tools

---

## 1. Architecture Overview

### 1.1 Current State (Without Composio)

```
┌─────────────────────────────────────────────────────────────────┐
│                      Teach Charlie                               │
├─────────────────────────────────────────────────────────────────┤
│  User → Create Agent → Select Tools → Configure API Keys        │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │  Built-in Tools │                          │
│                    │  - Calculator   │                          │
│                    │  - Web Search   │                          │
│                    │  - URL Reader   │                          │
│                    └─────────────────┘                          │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │    Langflow     │                          │
│                    │  (executes flow)│                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘

Limitations:
- Users must manually configure API keys
- No personal account connections (Gmail, Calendar, etc.)
- Each new integration requires custom development
- No OAuth handling capability
```

### 1.2 Target State (With Composio)

```
┌─────────────────────────────────────────────────────────────────┐
│                      Teach Charlie                               │
├─────────────────────────────────────────────────────────────────┤
│  User → Create Agent → Select Tools → Connect Accounts          │
│                              │                                   │
│              ┌───────────────┼───────────────┐                  │
│              ▼               ▼               ▼                  │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐       │
│    │ Built-in    │  │  Composio   │  │  MCP Servers    │       │
│    │ Tools       │  │  Toolsets   │  │  (user-added)   │       │
│    │ - Calculator│  │  - Gmail    │  │  - Postgres     │       │
│    │ - Web Search│  │  - Calendar │  │  - Custom APIs  │       │
│    │ - URL Reader│  │  - Slack    │  │                 │       │
│    └─────────────┘  │  - HubSpot  │  └─────────────────┘       │
│                     │  - Notion   │                             │
│                     │  - 500+     │                             │
│                     └──────┬──────┘                             │
│                            │                                     │
│              ┌─────────────┴─────────────┐                      │
│              ▼                           ▼                      │
│    ┌─────────────────┐         ┌─────────────────┐             │
│    │   Composio      │         │   Langflow      │             │
│    │   Cloud API     │◄───────►│   Runtime       │             │
│    │ (manages OAuth) │         │                 │             │
│    └─────────────────┘         └─────────────────┘             │
└─────────────────────────────────────────────────────────────────┘

Benefits:
- One-click account connections via OAuth popup
- User data isolation via entity_id = user.id
- No credential storage in Teach Charlie
- 500+ integrations available immediately
```

### 1.3 Data Flow for Tool Execution

```
User sends message to agent
         │
         ▼
┌─────────────────────────────────────┐
│  Teach Charlie Backend              │
│  1. Identify user (Clerk JWT)       │
│  2. Load agent workflow             │
│  3. Get user's connected accounts   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Composio SDK                       │
│  1. toolset.get_tools(              │
│       entity_id=user.id,            │
│       apps=["gmail", "calendar"]    │
│     )                               │
│  2. Returns LangChain-compatible    │
│     tools with user's auth          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Langflow Execution                 │
│  1. Agent receives tools            │
│  2. Decides to call GMAIL_SEARCH    │
│  3. Tool executes via Composio      │
│  4. Returns results to agent        │
└──────────────┬──────────────────────┘
               │
               ▼
        Response to user
```

---

## 2. Multi-Tenant Architecture

### 2.1 The Entity Model

Composio uses "entities" to isolate users. In Teach Charlie's context:

| Composio Concept | Teach Charlie Mapping |
|------------------|----------------------|
| `entity_id` | Clerk `user.id` (UUID) |
| Connected Account | User's Gmail, Slack, etc. |
| Auth Config | App-level OAuth credentials (yours) |

**Critical Rule**: Never use `entity_id="default"` in production. Always use the actual user ID.

### 2.2 Connection Ownership

```python
# Each user owns their connections
# Entity: user_abc123
#   └── Gmail (personal@gmail.com) - ACTIVE
#   └── Slack (workspace A) - ACTIVE
#   └── Calendar (personal) - ACTIVE

# Entity: user_xyz789
#   └── Gmail (work@company.com) - ACTIVE
#   └── HubSpot (company CRM) - ACTIVE

# Users cannot access each other's connections
# Composio enforces this automatically
```

### 2.3 Database Schema

```sql
-- Track user connections (mirrors Composio state)
CREATE TABLE user_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Ownership
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Connection details
    app_name VARCHAR(100) NOT NULL,           -- "gmail", "slack", "hubspot"
    app_display_name VARCHAR(255),            -- "Gmail", "Slack", "HubSpot"
    composio_connection_id VARCHAR(255),      -- Composio's internal ID
    composio_entity_id VARCHAR(255),          -- Should match user_id

    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending',     -- pending, active, expired, revoked
    connected_at TIMESTAMP,
    last_used_at TIMESTAMP,

    -- Metadata
    account_identifier VARCHAR(255),          -- "john@gmail.com" (for display)
    scopes JSONB,                             -- Granted OAuth scopes

    -- Indexing
    UNIQUE(user_id, app_name, account_identifier)
);

CREATE INDEX idx_user_connections_user ON user_connections(user_id);
CREATE INDEX idx_user_connections_status ON user_connections(status);

-- Track available Composio apps (cached from Composio API)
CREATE TABLE composio_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    app_key VARCHAR(100) UNIQUE NOT NULL,     -- "gmail", "slack"
    display_name VARCHAR(255) NOT NULL,        -- "Gmail", "Slack"
    description TEXT,
    icon_url VARCHAR(500),
    category VARCHAR(100),                     -- "communication", "crm", "productivity"

    -- Feature flags
    is_enabled BOOLEAN DEFAULT true,           -- Can we offer this to users?
    requires_oauth BOOLEAN DEFAULT true,
    is_premium BOOLEAN DEFAULT false,          -- Counts against premium quota

    -- Available actions (cached)
    actions JSONB,                             -- [{name, description, parameters}]

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 3. User Experience Flows

### 3.1 Connection Flow (First Time)

```
┌─────────────────────────────────────────────────────────────────┐
│  User is creating an agent or starting a mission                │
│                                                                  │
│  "To help manage your inbox, Charlie needs access to Gmail"     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🔗 Connect Gmail                                        │   │
│  │                                                          │   │
│  │  Charlie will be able to:                               │   │
│  │  ✓ Read your emails                                     │   │
│  │  ✓ Search your inbox                                    │   │
│  │  ✓ Send emails on your behalf                           │   │
│  │                                                          │   │
│  │  [Connect Gmail]  [Skip for now]                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Click "Connect Gmail"
┌─────────────────────────────────────────────────────────────────┐
│  OAuth Popup (Composio-hosted, Teach Charlie branded)           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     Google                               │   │
│  │                                                          │   │
│  │  Teach Charlie wants to access your Google Account       │   │
│  │                                                          │   │
│  │  john.doe@gmail.com                                     │   │
│  │                                                          │   │
│  │  This will allow Teach Charlie to:                      │   │
│  │  • Read, compose, and send emails                       │   │
│  │  • View and edit your calendar                          │   │
│  │                                                          │   │
│  │  [Cancel]                              [Allow]          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ User clicks "Allow"
┌─────────────────────────────────────────────────────────────────┐
│  Back to Teach Charlie                                          │
│                                                                  │
│  ✅ Gmail connected successfully!                               │
│                                                                  │
│  Connected as: john.doe@gmail.com                               │
│                                                                  │
│  [Continue with mission]                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Mission Integration Flow

```
User selects "Daily Co-Pilot" mission
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Mission: Daily Co-Pilot                                        │
│  "Your AI assistant for email and calendar management"          │
│                                                                  │
│  Required Connections:                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✅ Gmail           john.doe@gmail.com    [Disconnect]  │   │
│  │  ⬜ Google Calendar  Not connected         [Connect]     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Start Mission] (disabled until all required apps connected)   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Connections Management Page

```
┌─────────────────────────────────────────────────────────────────┐
│  Settings > Connected Accounts                                  │
│                                                                  │
│  These accounts are available to your AI agents.                │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Communication                                           │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │ 📧 Gmail         john.doe@gmail.com               │  │   │
│  │  │                  Connected 3 days ago              │  │   │
│  │  │                  [Reconnect] [Disconnect]          │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │ 💬 Slack         Acme Corp Workspace              │  │   │
│  │  │                  Connected 1 week ago              │  │   │
│  │  │                  [Reconnect] [Disconnect]          │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  [+ Connect another app]                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Productivity                                            │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │ 📅 Google Calendar  john.doe@gmail.com            │  │   │
│  │  │                     ⚠️ Token expired               │  │   │
│  │  │                     [Reconnect] [Disconnect]       │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Agent Tool Selection with Composio

```
┌─────────────────────────────────────────────────────────────────┐
│  Create Agent > Step 2: Select Tools                            │
│                                                                  │
│  What tools should Charlie have access to?                      │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Built-in Tools                                          │   │
│  │  ☑️ Calculator    ☑️ Web Search    ☐ URL Reader          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Your Connected Apps                                     │   │
│  │  ☑️ Gmail (john.doe@gmail.com)                          │   │
│  │     Actions: Search, Read, Send, Create Draft           │   │
│  │  ☐ Slack (Acme Corp)                                    │   │
│  │     Actions: Send Message, List Channels, Search        │   │
│  │  ☐ Google Calendar (john.doe@gmail.com) ⚠️ Reconnect    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Connect More Apps                                       │   │
│  │  [+ HubSpot] [+ Notion] [+ Zendesk] [Browse all...]     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. API Design

### 4.1 Backend Endpoints

```
# Connection Management
POST   /api/v1/connections/initiate          # Start OAuth flow
GET    /api/v1/connections/callback          # OAuth callback handler
GET    /api/v1/connections                   # List user's connections
GET    /api/v1/connections/{id}              # Get connection details
DELETE /api/v1/connections/{id}              # Revoke connection
POST   /api/v1/connections/{id}/refresh      # Force token refresh

# Available Apps
GET    /api/v1/composio/apps                 # List available apps
GET    /api/v1/composio/apps/{app_key}       # Get app details & actions

# Tool Execution (internal, used by Langflow)
POST   /api/v1/composio/tools                # Get tools for user
POST   /api/v1/composio/execute              # Execute a tool action
```

### 4.2 Request/Response Examples

**Initiate Connection:**
```json
// POST /api/v1/connections/initiate
{
  "app_name": "gmail",
  "redirect_url": "https://app.teachcharlie.ai/connections/callback"
}

// Response
{
  "connection_id": "conn_abc123",
  "auth_url": "https://accounts.google.com/o/oauth2/...",
  "expires_in": 600
}
```

**List Connections:**
```json
// GET /api/v1/connections

{
  "connections": [
    {
      "id": "conn_abc123",
      "app_name": "gmail",
      "app_display_name": "Gmail",
      "account_identifier": "john.doe@gmail.com",
      "status": "active",
      "connected_at": "2026-01-15T10:30:00Z",
      "last_used_at": "2026-01-17T14:22:00Z",
      "available_actions": [
        {"name": "GMAIL_SEARCH", "description": "Search emails"},
        {"name": "GMAIL_SEND", "description": "Send an email"},
        {"name": "GMAIL_READ", "description": "Read email content"}
      ]
    }
  ],
  "total": 1
}
```

---

## 5. Langflow Integration Options

### 5.1 Option A: Custom Langflow Component (Recommended for MVP)

Create a `ComposioToolset` component that wraps the Composio SDK:

```python
# src/backend/langflow_components/composio_toolset.py

from langflow.custom import Component
from langflow.io import DropdownInput, Output, SecretStrInput
from langflow.schema import Data

class ComposioToolsetComponent(Component):
    display_name = "Connected Apps"
    description = "Access your connected apps (Gmail, Calendar, Slack, etc.)"
    icon = "plug"

    inputs = [
        DropdownInput(
            name="selected_apps",
            display_name="Apps to Include",
            options=[],  # Populated dynamically from user's connections
            is_list=True,
            info="Select which connected apps this agent can use"
        ),
        SecretStrInput(
            name="composio_api_key",
            display_name="Composio API Key",
            info="Your Composio API key (from environment)",
            load_from_db=True,
        ),
    ]

    outputs = [
        Output(display_name="Tools", name="tools", method="get_tools"),
    ]

    def get_tools(self) -> list:
        from composio_langchain import ComposioToolSet

        # Get user ID from flow context
        user_id = self.get_flow_context().get("user_id")

        toolset = ComposioToolSet(api_key=self.composio_api_key)
        tools = toolset.get_tools(
            entity_id=user_id,
            apps=self.selected_apps
        )

        return tools
```

### 5.2 Option B: MCP Server (For Advanced Users)

Add Composio as an MCP server option:

```json
// .mcp.json entry for Composio
{
  "mcpServers": {
    "composio": {
      "command": "npx",
      "args": ["-y", "composio-mcp"],
      "env": {
        "COMPOSIO_API_KEY": "${COMPOSIO_API_KEY}"
      }
    }
  }
}
```

### 5.3 Option C: Hybrid Approach (Recommended for Production)

- **MVP**: Custom Langflow component for simplicity
- **Phase 2**: Add MCP server option for power users
- **Phase 3**: Let users choose their preferred integration method

---

## 6. Mission System Integration

### 6.1 Mission Metadata Schema Update

```yaml
# missions/daily-copilot.yaml
id: daily-copilot
name: Daily Co-Pilot
description: Your AI assistant for email and calendar management

# NEW: Required Composio connections
required_connections:
  - app: gmail
    reason: "To read and send emails on your behalf"
    required_actions:
      - GMAIL_SEARCH
      - GMAIL_SEND
      - GMAIL_READ
  - app: googlecalendar
    reason: "To view and create calendar events"
    required_actions:
      - CALENDAR_GET_EVENTS
      - CALENDAR_CREATE_EVENT

# Optional connections that enhance the mission
optional_connections:
  - app: slack
    reason: "To send Slack messages about important emails"

# Template configuration
template:
  base: agent_with_composio_tools
  inject_tools_from_connections: true
```

### 6.2 Mission Validation Logic

```python
async def validate_mission_requirements(
    user_id: str,
    mission_id: str
) -> MissionValidationResult:
    """Check if user has all required connections for a mission."""

    mission = await get_mission(mission_id)
    user_connections = await get_user_connections(user_id)

    missing = []
    expired = []
    ready = []

    for required in mission.required_connections:
        connection = find_connection(user_connections, required.app)

        if not connection:
            missing.append(required)
        elif connection.status == "expired":
            expired.append(required)
        else:
            ready.append(required)

    return MissionValidationResult(
        can_start=len(missing) == 0 and len(expired) == 0,
        missing_connections=missing,
        expired_connections=expired,
        ready_connections=ready
    )
```

---

## 7. Security Considerations

### 7.1 Credential Handling

| Data | Where Stored | Teach Charlie Access |
|------|-------------|---------------------|
| OAuth tokens | Composio Cloud | Never sees them |
| Refresh tokens | Composio Cloud | Never sees them |
| User's email content | Composio (transit only) | Only during tool execution |
| Connection IDs | Teach Charlie DB | Read/write |
| Composio API key | Teach Charlie secrets | Backend only |

### 7.2 Data Isolation Guarantees

```python
# Composio enforces entity isolation
# This code cannot access another user's Gmail:

toolset.get_tools(
    entity_id="user_abc",  # Can only get user_abc's tools
    apps=["gmail"]
)

# Even if someone tried to pass a different entity_id,
# the Composio API validates against the connection ownership
```

### 7.3 Write Action Approvals

For sensitive actions (sending emails, creating events), implement approval:

```python
class ComposioToolsetComponent(Component):
    inputs = [
        BoolInput(
            name="require_approval_for_writes",
            display_name="Require Approval for Write Actions",
            value=True,
            info="If enabled, sending emails or creating events requires user confirmation"
        ),
    ]
```

### 7.4 Audit Logging

```python
# Log all Composio tool executions
async def log_tool_execution(
    user_id: str,
    tool_name: str,
    app_name: str,
    success: bool,
    error: str = None
):
    await db.execute("""
        INSERT INTO composio_audit_log
        (user_id, tool_name, app_name, success, error, executed_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
    """, user_id, tool_name, app_name, success, error)
```

---

## 8. Cost Analysis

### 8.1 Composio Pricing Tiers

| Tier | Monthly Cost | Tool Calls | Connected Accounts | Best For |
|------|-------------|------------|-------------------|----------|
| Free | $0 | 20,000 | 1,000 | MVP, Beta |
| Starter | $29 | 200,000 | 30,000 | Early Growth |
| Business | $229 | 2,000,000 | 100,000 | Scale |

### 8.2 Usage Projections

**Assumptions:**
- Average user makes 50 tool calls/day when active
- 30% of users are active daily
- Each user connects 2-3 apps on average

| Users | Daily Active | Tool Calls/Month | Tier Needed | Monthly Cost |
|-------|-------------|------------------|-------------|--------------|
| 100 | 30 | 45,000 | Starter | $29 |
| 500 | 150 | 225,000 | Starter | $29 + overage |
| 1,000 | 300 | 450,000 | Business | $229 |
| 5,000 | 1,500 | 2,250,000 | Business | $229 + overage |

### 8.3 Connection Limits

The connection limit (1,000 on free tier) is per Composio account, not per app:
- 100 users × 3 apps each = 300 connections (within free tier)
- 500 users × 3 apps each = 1,500 connections (needs Starter)

---

## 9. Implementation Phases

### Phase 1: Foundation (Week 1-2) - COMPLETE

**Goal**: Basic connection management without Langflow integration

**Status**: Complete

**Implemented:**
1. Composio SDK integrated with async/await support
2. `user_connections` database table with migration
3. Full connection management API:
   - `POST /connections/initiate` - OAuth initiation
   - `POST /connections/callback` - OAuth callback handling
   - `GET /connections` - List user connections
   - `GET /connections/{id}` - Get connection details
   - `GET /connections/{id}/status` - Check status
   - `POST /connections/{id}/refresh` - Refresh connection
   - `POST /connections/{id}/revoke` - Revoke access
   - `DELETE /connections/{id}` - Delete record
4. ConnectionsPage frontend component
5. OAuth flow working with Gmail and other Composio apps

**Files Created:**
- `app/services/composio_connection_service.py`
- `app/api/connections.py`
- `app/schemas/connection.py`
- `app/models/user_connection.py`
- `src/pages/ConnectionsPage.tsx`

---

### Phase 2: Agent Integration (Week 3-4) - COMPLETE

**Goal**: Agents can use connected apps as tools

**Status**: Complete

**Implemented:**
1. `ComposioAgentService` - LangChain agent execution with Composio tools
2. Enhanced chat endpoints bypassing Langflow for direct tool access
3. Tool availability indicator in PlaygroundPage
4. SSE streaming for real-time tool execution visibility
5. Tool call events (start/end) in stream for UI feedback

**Files Created:**
- `app/services/composio_agent_service.py`

**API Endpoints Added:**
- `GET /connections/tools/availability` - Check if user has tools
- `POST /connections/chat` - Non-streaming enhanced chat
- `POST /connections/chat/stream` - Streaming enhanced chat with SSE

**Architecture Decision:**
Rather than modifying Langflow flows at runtime, created a parallel execution path using LangChain directly. This approach:
- Avoids complex Langflow flow manipulation
- Provides cleaner tool injection
- Enables real-time tool call visibility
- Maintains backward compatibility with existing Langflow execution

---

### Phase 3: Mission Integration (Week 5-6)

**Goal**: Missions can require specific connections

**Tasks:**
1. Update mission schema to include `required_connections`
2. Implement mission validation logic
3. Create "Connect required apps" UI for missions
4. Update mission templates to use Composio tools
5. Add connection status indicators to mission cards

**Deliverables:**
- "Daily Co-Pilot" mission requires Gmail + Calendar
- Users prompted to connect apps before starting
- Mission uses real Gmail/Calendar data

**Testing:**
- Start mission without Gmail connected → prompted to connect
- Start mission with Gmail connected → proceeds normally
- Mission agent can read user's real emails

---

### Phase 4: Polish & Scale (Week 7-8)

**Goal**: Production-ready with monitoring and error handling

**Tasks:**
1. Implement token expiration detection and refresh prompts
2. Add audit logging for all tool executions
3. Create admin dashboard for usage monitoring
4. Implement rate limiting and quota tracking
5. Add more apps (Slack, Notion, HubSpot)
6. Write user documentation

**Deliverables:**
- Expired tokens show "Reconnect" prompt
- Admin can see tool usage statistics
- 5+ apps available for connection

**Testing:**
- Simulate token expiration → user prompted to reconnect
- Hit rate limits → graceful error message
- Connect multiple apps → all work in same agent

---

## 10. Risk Mitigation

### 10.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Composio API downtime | Low | High | Implement graceful degradation; show "tools unavailable" |
| Token refresh failures | Medium | Medium | Proactive refresh; clear "Reconnect" UX |
| Rate limiting hits | Medium | Medium | Implement client-side throttling; queue requests |
| SDK breaking changes | Low | Medium | Pin SDK version; test before upgrading |

### 10.2 Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Composio pricing changes | Medium | Medium | Monitor announcements; have fallback plan |
| Composio acquisition/shutdown | Low | High | Store minimal dependencies; abstract SDK usage |
| User data concerns | Medium | High | Clear privacy policy; minimal data access |

### 10.3 Fallback Plan

If Composio becomes unavailable or unsuitable:

1. **Short-term**: Disable connected apps feature; agents use built-in tools only
2. **Medium-term**: Implement OAuth flows for top 3 apps (Gmail, Calendar, Slack) in-house
3. **Long-term**: Evaluate alternatives (Nango, Paragon, custom)

---

## 11. Success Metrics

### 11.1 Adoption Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|--------|-----------------|------------------|
| Users who connect at least 1 app | 30% | 60% |
| Average connections per user | 1.5 | 2.5 |
| Missions completed with connected apps | 20% | 50% |

### 11.2 Engagement Metrics

| Metric | Target |
|--------|--------|
| Tool calls per active user per day | 20+ |
| Connection retention (still active after 30 days) | 80% |
| Time to first successful tool execution | < 5 minutes |

### 11.3 Quality Metrics

| Metric | Target |
|--------|--------|
| Tool execution success rate | > 95% |
| Token refresh success rate | > 99% |
| User-reported connection issues | < 5% of users |

---

## 12. Open Questions

### 12.1 Product Questions

1. **Which apps to prioritize first?**
   - Recommendation: Gmail, Google Calendar, Slack (covers 80% of use cases)

2. **Should we limit connections on free tier?**
   - Recommendation: Allow 3 connections on free, unlimited on paid

3. **How to handle team/shared connections?**
   - Deferred to Phase 5; focus on individual connections first

### 12.2 Technical Questions

1. **Where to run Composio SDK calls?**
   - Option A: In Teach Charlie backend (recommended - more control)
   - Option B: In Langflow component (simpler but less control)

2. **How to handle long-running tool executions?**
   - Implement timeouts (30s default)
   - Show "still working..." indicator

3. **Should we cache Composio responses?**
   - Cache app metadata (24h TTL)
   - Don't cache user data (privacy)

---

## 13. Appendix

### 13.1 Composio SDK Quick Reference

```python
from composio_langchain import ComposioToolSet

# Initialize
toolset = ComposioToolSet(api_key="your_api_key")

# Initiate OAuth
connection = toolset.initiate_connection(
    entity_id="user_123",
    app="gmail"
)
print(connection.redirect_url)  # Send user here

# Check connection status
status = toolset.get_entity("user_123").get_connection("gmail")
print(status.status)  # "ACTIVE", "PENDING", "EXPIRED"

# Get tools for agent
tools = toolset.get_tools(
    entity_id="user_123",
    apps=["gmail", "googlecalendar"],
    actions=["GMAIL_SEARCH", "GMAIL_SEND"]  # Optional: limit actions
)

# Execute tool (usually done by LangChain agent)
result = tools[0].invoke({"query": "from:john@example.com"})
```

### 13.2 Available Apps (Priority List)

**Tier 1 (Phase 2):**
- Gmail
- Google Calendar
- Slack

**Tier 2 (Phase 4):**
- Notion
- HubSpot
- Google Drive

**Tier 3 (Future):**
- Zendesk
- Salesforce
- Airtable
- Linear
- GitHub

### 13.3 Related Documentation

- [Composio Official Docs](https://docs.composio.dev/)
- [Composio LangChain Integration](https://docs.langchain.com/oss/python/integrations/tools/composio)
- [Teach Charlie Mission System](./06_MISSION_BASED_LEARNING_SYSTEM.md)
- [Teach Charlie MCP Server Guide](./03_STATUS.md#mcp-servers)

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-21 | Claude | Added toggle mode for connected tools in Playground |
| 2026-01-21 | Claude | Created "My Connected Apps" custom Langflow component |
| 2026-01-21 | Claude | Added E2E tests for Composio features |
| 2026-01-21 | Claude | Added backend startup sync for built-in components |
| 2026-01-21 | Claude | Added User Journey documentation, Technical Reference, Implementation Status |
| 2026-01-21 | Claude | Phase 2 complete: ComposioAgentService, enhanced chat endpoints, playground indicators |
| 2026-01-17 | Claude | Initial document creation |
