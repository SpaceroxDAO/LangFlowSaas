# Project Status: Teach Charlie AI

**Last Updated**: 2026-01-14
**Current Phase**: MVP Complete - Ready for Production Deploy
**Owner**: Adam (Product) + Claude Code (Technical)

## Current Phase

**Phase**: MVP Feature-Complete (Phases 0-12 Done)
**Status**: ✅ All Success Criteria Met
**Next Milestone**: Production Deploy + First Workshops

## Health Indicators

| Metric | Status | Notes |
|--------|--------|-------|
| Documentation | ✅ Updated | This document updated 2026-01-14 |
| Backend API | ✅ Complete | 36+ endpoints + avatar generation |
| Database | ✅ Complete | New tables + workflow_id migration done |
| Authentication | ✅ Complete | Clerk JWT + Dev Mode |
| Langflow Integration | ✅ Enhanced | Share, Embed, Webhook, API, Analytics + Nginx proxy fixed |
| Frontend | ✅ Enhanced | Three-tab UI + avatar display + EditAgentPage redesign |
| Performance | ✅ Fixed | SQLAlchemy lazy loading optimized |
| Tour System | ✅ Tested | Driver.js integrated and working |
| Canvas Viewer | ✅ Fixed | Updated for AgentComponent/Workflow architecture |
| Streaming | ✅ Added | Backend streaming support enabled |
| Testing | ✅ Complete | 15+ E2E tests (chat, publish, multi-turn, RAG) |
| Knowledge Sources | ✅ Working | Text, File Upload, URL - all tested |
| RAG Search | ⚠️ Partial | Keyword-based fallback working; vector ingestion needs work |
| Import/Export | ✅ Added | Agent JSON import/export working |
| New Data Flow | ✅ Working | CreateAgent → AgentComponent + Workflow |
| Avatar System | ✅ Complete | Auto-inference (40+ job types), three-tier generation |
| Custom Components | ✅ Complete | Publish agent → Langflow sidebar working |
| Chat Playground | ✅ Fixed | Multi-turn conversations with memory + streaming |

Legend: ✅ Good | ⚠️ Warning | ❌ Critical | ⏳ Pending

## MVP Success Criteria (All Met)

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Platform stable for live workshops | ✅ | 15+ E2E tests passing |
| 3-step Q&A onboarding works | ✅ | Multi-type support, avatar auto-inference |
| Playground allows testing agents | ✅ | Multi-turn memory, streaming, tool execution |
| Basic agent persistence | ✅ | CRUD + export/import working |
| E2E tests pass | ✅ | chat, publish, multi-turn, RAG all passing |

## What's Working (Feature Summary)

- **3-Step Q&A Wizard**: Multi-type support with avatar auto-inference
- **Playground Chat**: Multi-turn memory, streaming responses, tool execution
- **Agent Persistence**: Full CRUD operations + JSON export/import
- **Knowledge Sources**: Text paste, file upload (PDF/TXT/MD/DOCX/CSV), URL fetch with keyword RAG
- **Custom Langflow Components**: Publish agent → appears in Langflow sidebar
- **Avatar System**: Auto-inference from 40+ job types, three-tier generation (known job → description → base)
- **Progressive Canvas Unlock**: 4 disclosure levels for gradual complexity exposure
- **Three-Tab UI**: Agents, Workflows, MCP Servers organization
- **Langflow Integration**: Share, Embed, Webhook, API tabs with white-label overlay

## Known Limitations

1. **Vector RAG Ingestion Fails**: Langflow-native vector ingestion (Chroma + OpenAI Embeddings) returns template validation errors. Keyword-based search fallback works reliably.

2. **MCP Server .mcp.json Sync Implemented**: MCP servers sync to `.mcp.json` automatically. Use `/sync-and-restart` endpoint to apply changes to Langflow.

3. **Legacy Agents Table Coexists**: Old `agents` table still exists alongside new `agent_components` table. Legacy agents still work via `/playground/:agentId`.

4. **Agent Presets Active**: Phase 13 (Agent Presets) is fully implemented with 8 default presets available in the onboarding wizard.

## Phase Progress

### Phases 0-13: Complete ✅

All MVP phases completed:
- Phase 0-4: MVP Foundation (Q&A wizard, Playground, EditAgent)
- Phase 5: Progressive Canvas (iframe with 4 disclosure levels)
- Phase 6: Tools (calculator, web_search, url_reader verified working)
- Phase 7: Memory (multi-turn context retention)
- Phase 7b: Langflow Integration (Share, Embed, Webhook, API tabs)
- Phase 8: UI Polish (Langflow-style violet theme, search, pagination, bulk ops)
- Phase 9: Three-Tab Architecture (Agents, Workflows, MCP Servers)
- Phase 10: Avatar V2 & Architecture Fixes
- Phase 11: Custom Component Generation & E2E Testing
- Phase 11b-d: EditAgent Redesign, Proxy Fix, Config Management
- Phase 12: Knowledge Sources & RAG Foundation
- Phase 13: Agent Presets (8 default templates in wizard)

### Phase 12: Knowledge Sources & RAG Foundation ✅ Complete

**Goal**: Enable users to add knowledge sources (text, files, URLs) to their agents for context-aware responses

#### Completed (2026-01-10 Morning)

**Knowledge Source Types - All Working:**
- [x] **Paste Text**: Users can paste text content directly (e.g., employee handbooks, FAQs)
- [x] **Upload File**: Support for PDF, TXT, MD, DOCX, CSV (max 10MB each)
- [x] **Add URL**: Fetch and index content from web pages

**Database Migrations:**
- [x] Created `20260109_0001` - Added `selected_tools` column to agent_components
- [x] Created `20260110_0001` - Added `knowledge_source_ids` column to agent_components

**Knowledge Search Tool:**
- [x] Created `KnowledgeRetrieverComponent` - Custom Langflow component for keyword-based search
- [x] Implemented keyword matching with relevance scoring
- [x] Content chunking with paragraph/sentence splitting
- [x] Tool properly injected into agent workflows

**RAG Fallback System:**
- [x] Implemented graceful fallback when Langflow-native RAG ingestion fails
- [x] System falls back to keyword-based search automatically
- [x] User experience unaffected - agents still work with knowledge sources

**E2E Testing:**
- [x] Created comprehensive `rag-integration.spec.ts` test
- [x] Tested all three knowledge source types via Playwright MCP
- [x] Verified chat responses use knowledge content correctly

**Files Created:**
- `src/backend/templates/tools/knowledge_retriever.json` - Knowledge search tool component
- `src/backend/templates/rag/ingest_documents.json` - RAG ingestion flow template
- `src/backend/templates/rag_agent.json` - RAG agent flow template
- `src/backend/alembic/versions/20260110_0001_add_knowledge_source_ids.py` - DB migration
- `src/frontend/e2e/tests/rag-integration.spec.ts` - E2E test for RAG workflow

**Files Modified:**
- `src/backend/app/services/workflow_service.py` - Added RAG fallback, ingestion support
- `src/backend/app/services/template_mapping.py` - Added RAG template configuration
- `src/backend/app/services/knowledge_service.py` - Added debug logging
- `docker-compose.yml` - Added chroma_data volume for vector persistence

#### Known Limitations

**RAG Ingestion Still Needs Work:**
- Langflow-native vector ingestion (Chroma + OpenAI Embeddings) fails with template validation errors
- The ingestion flow template format doesn't match Langflow's expected component structure exactly
- Current workaround: Automatic fallback to keyword-based search (works reliably)

**Future Improvements (Post-MVP):**
- [ ] Fix RAG ingestion flow template to match Langflow's exact format
- [ ] Enable true vector/semantic search via Chroma
- [ ] Add embedding model selection (OpenAI, Ollama)
- [ ] Add chunk size/overlap configuration options

#### Test Results (All Passing)

| Knowledge Source | Test | Result |
|------------------|------|--------|
| Paste Text | PTO query → "20 days per year" | ✅ Correct |
| Paste Text | Office hours query → Mon-Fri 9-6 | ✅ Correct |
| Upload File | Product price query → "$299.99" | ✅ Correct |
| Upload File | Return policy query → "30 days" | ✅ Correct |
| Add URL | Moby Dick query → Found content | ✅ Correct |
| Add URL | Author query → "Herman Melville" | ✅ Correct |

---

### Phase 11d: Configuration Management & Local Dev Nginx Setup ✅ Complete

**Goal**: Fix configuration management issues and enable nginx proxy for local development

#### Completed (2026-01-09 Afternoon)

**Configuration Management Fixes:**
- [x] Fixed Langflow container name mismatch (`langflow` vs `teachcharlie-langflow`)
- [x] Created single source of truth pattern: `.env` → `config.py` → services
- [x] Added `LANGFLOW_CONTAINER_NAME` to `.env.example` and `config.py`
- [x] Updated `docker-compose.yml` to use `${LANGFLOW_CONTAINER_NAME:-teachcharlie-langflow}`
- [x] Updated `langflow_service.py` to use centralized config instead of hardcoded values
- [x] Added startup validation to check container exists (warns early on misconfiguration)

**Local Development Nginx Setup:**
- [x] Created `nginx/nginx.dev.conf` - simplified nginx config for local dev (Langflow proxy only)
- [x] Created `docker-compose.dev.yml` - lightweight compose for local dev (postgres + langflow + nginx)
- [x] nginx on port 7861 handles CSS/JS injection for white-label overlay
- [x] Frontend/backend run on host machine, only Docker services proxied

**Frontend Langflow URL Fix:**
- [x] Updated `LangflowCanvasViewer.tsx` to default to port 7861 (nginx)
- [x] Canvas always goes through nginx for CSS injection (never direct to 7860)

**Documentation:**
- [x] Updated `.env.example` with local dev instructions
- [x] Documented configuration dependencies in CLAUDE.md

**Files Created:**
- `nginx/nginx.dev.conf` - Local dev nginx config
- `docker-compose.dev.yml` - Local dev Docker Compose

**Files Modified:**
- `.env.example` - Added LANGFLOW_CONTAINER_NAME, updated VITE_LANGFLOW_URL docs
- `src/backend/app/config.py` - Added langflow_container_name setting
- `src/backend/app/services/langflow_service.py` - Refactored to use settings
- `src/backend/app/main.py` - Added startup validation
- `docker-compose.yml` - Container name from env var, removed obsolete version
- `src/frontend/src/components/LangflowCanvasViewer.tsx` - Default to nginx port

**Local Dev Commands:**
```bash
# Start services for local development
docker-compose -f docker-compose.dev.yml up -d

# Then run frontend and backend on host
cd src/frontend && npm run dev
cd src/backend && uvicorn app.main:app --reload
```

**Architecture (Local Dev):**
- Frontend: `localhost:3001` (host)
- Backend: `localhost:8000` (host)
- Langflow (via nginx): `localhost:7861` (Docker, with CSS injection)
- Langflow (direct): `localhost:7860` (Docker, no CSS)
- PostgreSQL: `localhost:5432` (Docker)

---

### Phase 11c: Langflow Proxy Fix & White-Label System ✅ Complete

**Goal**: Fix "Couldn't establish a connection" error in Langflow iframe and implement white-label CSS/JS injection

#### Completed (2026-01-08 Afternoon)

**Root Cause Found & Fixed:**
- [x] Diagnosed "Couldn't establish a connection" popup in Langflow canvas
- [x] Root cause: nginx `location /health` prefix match was intercepting `/health_check`
- [x] Fix: Changed to `location = /health` (exact match)
- [x] Langflow's `/health_check` endpoint now returns proper JSON: `{"status":"ok","chat":"ok","db":"ok"}`

**Nginx Configuration:**
- [x] WebSocket support with `proxy_buffering off;`
- [x] Extended timeouts (24 hours for WebSocket idle)
- [x] CSS/JS injection via `sub_filter` for white-labeling
- [x] Removed restrictive Langflow headers for iframe embedding

**White-Label System:**
- [x] `nginx/overlay/style.css` - Hides Langflow branding (header, social links, logos)
- [x] `nginx/overlay/script.js` - Hides branding text in navigation
- [x] Preserved all functional UI (Playground, Logs, Settings dialogs)

**Documentation:**
- [x] Created `docs/LANGFLOW_PROXY_FIX.md` - Comprehensive debugging guide
- [x] Updated `docs/02_CHANGELOG.md` with entry

**Files Modified:**
- `nginx/nginx.conf` - Fixed exact match for `/health`, WebSocket config
- `nginx/overlay/style.css` - White-label CSS (branding only)
- `nginx/overlay/script.js` - White-label script (branding text only)

**Files Created:**
- `docs/LANGFLOW_PROXY_FIX.md` - Connection error resolution guide

**Key Lessons:**
- Nginx location matching is prefix-based by default; use `= /path` for exact matches
- Always compare direct vs proxied responses when debugging proxy issues
- Langflow's `/health_check` endpoint returns JSON that the frontend parses

---

### Phase 11b: EditAgentPage Redesign & Avatar Fixes ✅ Complete

**Goal**: Redesign EditAgentPage with proper action buttons and fix avatar display/generation issues

#### Completed (2026-01-08 Morning)

**EditAgentPage UI Redesign:**
- [x] Added "Talk to Agent" button in header (links to playground)
- [x] Added "Advanced Settings" button in header (opens settings modal)
- [x] Created footer with three action buttons:
  - Save Draft (stays on page, shows success message)
  - Publish / Publish Updates (shows restart modal)
  - Create New Workflow (disabled until published & restarted)
- [x] Removed duplicate Advanced Settings section from bottom
- [x] Added restart modal after publishing (restart now/later options)
- [x] Create New Workflow uses internal route `/canvas/:agentId`

**Behavior Fixes:**
- [x] Save Draft no longer navigates to playground
- [x] Publish no longer navigates away, shows feedback message
- [x] Publish button text changes to "Publish Updates" after initial publish
- [x] PlaygroundPage back button now goes to Edit Agent page

**Avatar Fixes:**
- [x] Avatar images in ProjectDetailPage cards display at 150% scale
- [x] Added OPENAI_API_KEY environment variable to backend container
- [x] Fixed static files path in main.py
- [x] Added avatar-generation.spec.ts E2E test

**Files Modified:**
- `src/frontend/src/pages/EditAgentPage.tsx` - Complete UI redesign
- `src/frontend/src/pages/PlaygroundPage.tsx` - Back button navigation fix
- `src/frontend/src/pages/ProjectDetailPage.tsx` - Avatar scale adjustment
- `docker-compose.yml` - Added OPENAI_API_KEY
- `src/backend/app/main.py` - Fixed static path

**Files Created:**
- `src/frontend/e2e/tests/avatar-generation.spec.ts` - Avatar generation E2E test

---

### Phase 11: Custom Component Generation & E2E Testing ✅ Complete

**Goal**: Enable publishing agents as custom Langflow components + comprehensive E2E test coverage

#### Completed (2026-01-08 Night)

**Custom Component Generation:**
- [x] Fixed Docker permissions for backend container (user: "0:0")
- [x] Installed Docker CLI in backend container for Langflow restart
- [x] Publish Agent button generates Python component file
- [x] Component file written to shared `custom_components/my_agents/` volume
- [x] Restart Langflow button triggers container restart
- [x] Published components appear in Langflow sidebar under "my_agents" category
- [x] Unpublish removes component file

**Chat Playground Fixes:**
- [x] Fixed "Failed to send" error - workflow_service now passes user LLM settings
- [x] Fixed old workflows with broken Anthropic placeholder keys
- [x] Synced fixed workflows to Langflow
- [x] Multi-turn conversations working (verified with 2-turn test)

**E2E Test Suite (Playwright):**
- [x] `chat-debug.spec.ts` - Debug test for chat functionality
- [x] `multi-turn-chat.spec.ts` - 2-turn conversation verification
- [x] `publish-agent.spec.ts` - Full publish flow with Langflow verification:
  - Create agent via wizard
  - Navigate to edit page
  - Click "Publish Agent"
  - Verify component generated
  - Click "Restart Langflow"
  - Navigate to Langflow
  - Verify "my_agents" category contains published components
- [x] `comprehensive.spec.ts` - P001 chat message flow test

**Files Created:**
- `src/backend/Dockerfile` - Added Docker CE CLI installation
- `docker-compose.yml` - Added `user: "0:0"` to backend service
- `src/frontend/e2e/tests/publish-agent.spec.ts` - 4 E2E tests for publish flow
- `src/frontend/e2e/tests/multi-turn-chat.spec.ts` - Multi-turn conversation test
- `src/frontend/e2e/tests/chat-debug.spec.ts` - Chat debugging test

### Phase 10: Avatar V2 & Architecture Fixes ✅ Complete

**Goal**: Enhanced avatar system with auto-inference and critical architecture fixes

#### Completed (2026-01-07 Night)

**Avatar System V2:**
- [x] Auto-inference of job type from agent name/description
- [x] 40+ job types with keyword matching
- [x] Three-tier generation strategy (known job → description-based → base image)
- [x] Avatar display in PlaygroundPage (header + empty state)
- [x] Avatar display in ProjectDetailPage (list + grid views)
- [x] Larger avatar sizes (40px list, 48px grid)
- [x] Light violet background for avatar circles

**Architecture Fixes:**
- [x] CanvasViewerPage updated for AgentComponent/Workflow architecture
- [x] PlaygroundPage "Edit Flow" link fixed
- [x] Removed broken `/canvas/${workflowId}` references

### Phase 9: Three-Tab Architecture ✅ Complete

**Goal**: Transform single-tab project view into three tabs: Agents, Workflows, MCP Servers

#### Completed (2026-01-07)

**Backend:**
- [x] AgentComponent model and schema
- [x] Workflow model and schema
- [x] MCPServer model and schema
- [x] Database tables created (agent_components, workflows, mcp_servers)
- [x] workflow_id column added to conversations table
- [x] AgentComponentService, WorkflowService, MCPServerService
- [x] API routes: `/api/v1/agent-components/*`, `/api/v1/workflows/*`, `/api/v1/mcp-servers/*`
- [x] 36 new API endpoints registered
- [x] **conversations.agent_id made nullable** (for workflow conversations)

**Frontend:**
- [x] WorkflowsTab component with list/grid views
- [x] MCPServersTab component with enable/disable toggles
- [x] CreateWorkflowModal (blank/from-agent options)
- [x] CreateMCPServerModal (template-based)
- [x] ProjectDetailPage updated with three tabs
- [x] Tab counts in badges
- [x] URL-based tab state (`?tab=agents|workflows|mcp-servers`)
- [x] Frontend types for all new entities
- [x] API client methods (~30 new methods)
- [x] **Workflow cards now clickable** (navigate to playground)

**Data Flow Integration (2026-01-07 Evening):**
- [x] **CreateAgentPage creates AgentComponent + Workflow** (not legacy agents)
- [x] **New route `/playground/workflow/:workflowId`** for workflow chat
- [x] **PlaygroundPage supports both legacy agents and workflows**
- [x] **Alembic env.py imports all Phase 9 models**
- [x] Workflow chat tested and working end-to-end

**Performance Fix:**
- [x] SQLAlchemy lazy loading optimized (7+ queries → 2 per request)
- [x] Changed all `lazy="selectin"` and `lazy="joined"` to `lazy="select"`
- [x] Fixed in User, Project, Conversation, Agent, Workflow, MCPServer models

**Bug Fixes:**
- [x] Project rename functionality (was missing onRename callback)
- [x] Dotted grid canvas background on Create/Edit pages
- [x] **Workflow card links missing** (fixed - now navigate to playground)

**E2E Tests (2026-01-07 Evening):**
- [x] `project-tabs.spec.ts` - 5 tests all passing:
  1. ✅ Display all three tabs
  2. ✅ Switch between tabs
  3. ✅ Preserve tab state in URL
  4. ✅ Show empty state for empty tabs
  5. ✅ Create agent → navigate to workflow playground

#### Pending (Post-MVP)

- [ ] Data migration (split existing legacy agents into AgentComponent + Workflow)
- [ ] Agent publish/unpublish to Langflow sidebar
- [ ] MCP server sync to .mcp.json
- [ ] Restart notification banner

### Phase 13: Agent Presets ✅ Complete

**Status**: ✅ Fully implemented and active

Agent Presets allow users to select from pre-configured agent templates during onboarding. The feature includes 8 default presets that auto-populate the wizard fields.

**Active Files:**
- `src/backend/alembic/versions/20260114_1219_603ff68b3523_add_agent_presets_table.py` - DB migration (active)
- `src/backend/app/api/agent_presets.py` - API routes (4 endpoints)
- `src/backend/app/models/agent_preset.py` - Model with 8 default presets
- `src/frontend/src/pages/CreateAgentPage.tsx` - Preset selection UI (lines 491-576)

**Default Presets:**
1. Customer Support Agent
2. Sales Assistant
3. Knowledge Base Expert
4. Creative Writing Partner
5. Data Analyst
6. Code Review Assistant
7. Meeting Facilitator
8. Learning Coach

### Phases 14-17: Mission-Based Learning System (Planned)

**Status**: ⏳ Documented, planned for post-launch

The Mission System introduces gamified learning with guided tours, achievements, and badges. Documented in:
- `docs/06_MISSION_BASED_LEARNING_SYSTEM.md` - Core design
- `docs/07_MISSION_SYSTEM_ANALYSIS.md` - Implementation analysis

**Planned Phases:**
- Phase 14: Mission Tours & First Mission ("Create Your First Agent")
- Phase 15: Achievement System & Badges
- Phase 16: Mission Categories (Beginner, Intermediate, Advanced)
- Phase 17: Leaderboards & Social Features

### Future Improvements (Post-MVP Backlog)
- [ ] Fix RAG vector ingestion (export real template from Langflow UI)
- [ ] Agent reasoning visibility / chain-of-thought display
- [ ] Advanced RAG settings (chunk size, embedding models, search type)
- [x] MCP server .mcp.json sync implementation (completed 2026-01-17)
- [ ] Legacy agents migration script
- [ ] Freemium pricing integration
- [ ] **Composio Integration** - See `docs/08_COMPOSIO_INTEGRATION_GUIDE.md` for full plan

## Frontend Pages

| Route | Component | Description | Status |
|-------|-----------|-------------|--------|
| `/` | HomePage | Landing page | ✅ |
| `/sign-in` | SignInPage | Auth | ✅ |
| `/sign-up` | SignUpPage | Auth | ✅ |
| `/dashboard` | DashboardPage | Redirect to default project | ✅ |
| `/dashboard/project/:id` | ProjectDetailPage | **Three tabs: Agents, Workflows, MCP Servers** | ✅ |
| `/dashboard/files` | FilesPage | File storage (placeholder) | ✅ |
| `/create` | CreateAgentPage | 3-step wizard → AgentComponent + Workflow | ✅ |
| `/edit/:agentId` | EditAgentPage | Edit legacy agent + dotted grid bg | ✅ |
| `/playground/:agentId` | PlaygroundPage | Legacy agent chat + Unlock Flow | ✅ |
| `/playground/workflow/:workflowId` | PlaygroundPage | **NEW: Workflow chat** | ✅ |
| `/canvas/:agentId` | CanvasViewerPage | Progressive canvas | ✅ |
| `/framework` | FrameworkPage | Educational content | ✅ |
| `/settings` | SettingsPage | User settings | ✅ |

## New Components (Phase 9)

| Component | Path | Purpose |
|-----------|------|---------|
| WorkflowsTab | `/src/components/WorkflowsTab.tsx` | Workflows list with CRUD |
| MCPServersTab | `/src/components/MCPServersTab.tsx` | MCP servers with toggle |
| CreateWorkflowModal | (in WorkflowsTab) | Create workflow options |
| CreateMCPServerModal | (in MCPServersTab) | Template-based MCP creation |

## Backend Endpoints (Phase 9)

### Agent Components (`/api/v1/agent-components`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-from-qa` | Create from Q&A wizard |
| GET | `/` | List components |
| GET | `/{id}` | Get single component |
| PATCH | `/{id}` | Update component |
| DELETE | `/{id}` | Delete component |
| POST | `/{id}/publish` | Publish to sidebar |
| POST | `/{id}/unpublish` | Remove from sidebar |
| POST | `/{id}/duplicate` | Duplicate component |
| GET | `/{id}/export` | Export as JSON |
| POST | `/import` | Import from JSON |

### Workflows (`/api/v1/workflows`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create workflow |
| POST | `/from-agent` | Create from agent |
| POST | `/from-template` | Create from template |
| GET | `/` | List workflows |
| GET | `/{id}` | Get single workflow |
| PATCH | `/{id}` | Update workflow |
| DELETE | `/{id}` | Delete workflow |
| POST | `/{id}/duplicate` | Duplicate workflow |
| GET | `/{id}/export` | Export as JSON |
| POST | `/{id}/chat` | Chat with workflow |
| GET | `/{id}/conversations` | List conversations |

### MCP Servers (`/api/v1/mcp-servers`)
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
| GET | `/restart-status` | Get restart status |

## Database Schema (Phase 9)

### New Tables
```sql
-- Agent Components (reusable AI personalities)
agent_components (
    id, user_id, project_id, name, description, icon, color,
    qa_who, qa_rules, qa_tricks, system_prompt,
    component_file_path, component_class_name,
    is_published, is_active, created_at, updated_at
)

-- Workflows (Langflow flows)
workflows (
    id, user_id, project_id, name, description,
    langflow_flow_id, flow_data, agent_component_ids,
    is_active, is_public, created_at, updated_at
)

-- MCP Servers (external tool integrations)
mcp_servers (
    id, user_id, project_id, name, description, server_type,
    command, args, env, credentials_encrypted,
    is_enabled, last_health_check, health_status,
    created_at, updated_at
)
```

### Migration Applied
- `conversations.workflow_id` column added (nullable FK to workflows)
- Index created: `ix_conversations_workflow_id`

## Development Commands

```bash
# Start all services
docker-compose up -d

# Start frontend dev server
cd src/frontend && npm run dev

# Start backend dev server
cd src/backend && python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Build frontend
cd src/frontend && npm run build

# Test backend imports
cd src/backend && python3 -c "from app.main import app; print('OK')"
```

## Git Status (2026-01-14)

Recent commits:
- `66bfc27` - feat: Phase 2 - Add operational scripts
- `fdd2786` - feat: Phase 1 - Adopt langflow-factory component standards
- `69b5413` - docs: Add Langflow component standards & implementation plan
- `ed37fa5` - feat: UI improvements & playground enhancements
- `0a9c292` - feat: RAG implementation with comprehensive E2E testing plan

**Uncommitted Files (pending):**
- `docs/06_MISSION_BASED_LEARNING_SYSTEM.md` - Mission system design
- `docs/07_MISSION_SYSTEM_ANALYSIS.md` - Implementation analysis
- `src/backend/alembic/versions/20260114_1049_add_agent_presets_table.py` - Agent presets migration (deferred)
- `src/backend/app/api/agent_presets.py` - Agent presets API (deferred)
- `src/backend/app/models/agent_preset.py` - Agent presets model (deferred)

All MVP features committed and pushed to origin/main.

## Known Issues

1. **Legacy agents tab**: The Agents tab shows old agents from legacy `agents` table
   - New agents created via wizard go to Workflows tab (as AgentComponent + Workflow)
   - Legacy agents still work via `/playground/:agentId`
   - Optional: Data migration script to convert legacy agents

2. **MCP servers not synced**: Creating MCP server in UI doesn't sync to `.mcp.json`

3. ~~**Publish not implemented**~~ ✅ **RESOLVED** (Phase 11): Agent publish generates Python components and appears in Langflow sidebar

## Immediate Next Steps

1. **Commit Mission Documentation** (Now)
   - Commit `docs/06_MISSION_BASED_LEARNING_SYSTEM.md` and `docs/07_MISSION_SYSTEM_ANALYSIS.md`
   - Defer Agent Presets (Phase 13) files to separate branch

2. **Production Deploy** (This Week)
   - Deploy to DataStax using RAGStack AI Langflow
   - Verify Langflow integration in production
   - Set environment variables via DataStax dashboard

3. **Run First Workshops** (Next Week)
   - Onboard 5-10 beta testers
   - Collect user feedback on Q&A wizard flow
   - Identify friction points in playground experience

4. **Collect & Prioritize Feedback** (Ongoing)
   - Document user pain points
   - Prioritize Phase 13+ features based on real usage
   - Iterate on educational UX based on workshop learnings

---

**Status Summary**: ✅ Green - MVP Feature-Complete. All success criteria from CLAUDE.md are met. 15+ E2E tests passing. Platform is stable and workshop-ready. Agent Presets and Mission System documented for post-launch. Ready for production deploy and first user workshops.

---

## Documentation Index

| Document | Purpose | Last Updated |
|----------|---------|--------------|
| `00_PROJECT_SPEC.md` | Product requirements, personas | 2026-01-03 |
| `01_ARCHITECTURE.md` | Technical architecture, DB schema | 2026-01-03 |
| `02_CHANGELOG.md` | Major decisions & rationale | 2026-01-09 |
| `03_STATUS.md` | **This file** - Current status | 2026-01-14 |
| `04_DEVELOPMENT_PLAN.md` | Original development plan | 2026-01-03 |
| `05_EDUCATIONAL_OVERLAY_RESEARCH.md` | UX patterns research | 2026-01-05 |
| `06_MISSION_BASED_LEARNING_SYSTEM.md` | **Mission system design** | 2026-01-14 |
| `07_MISSION_SYSTEM_ANALYSIS.md` | **Mission implementation analysis** | 2026-01-14 |
| `08_LANGFLOW_UI_CSS_SELECTORS.md` | CSS selectors for canvas | 2026-01-05 |
| `09_PROGRESSIVE_CANVAS_IMPLEMENTATION.md` | Canvas POC docs | 2026-01-05 |
| `10_PHASE_IMPLEMENTATION_MAPPING.md` | Findings → phases | 2026-01-05 |
| `11_PRODUCTION_DEPLOYMENT.md` | Deployment guide | 2026-01-05 |
| `11_LANGFLOW_DESIGN_MATCH.md` | UI matching guide | 2026-01-06 |
| `12_USER_JOURNEYS_AND_ENTERPRISE_ROADMAP.md` | User journeys | 2026-01-05 |
| `13_LANGFLOW_INTEGRATION_STRATEGY.md` | Integration strategy | 2026-01-05 |
| `14_CUSTOM_COMPONENTS_STRATEGY.md` | Component strategy | 2026-01-06 |
| `15_PROJECT_TABS_REORGANIZATION.md` | Three-tab plan | 2026-01-07 |
| `LANGFLOW_PROXY_FIX.md` | Nginx proxy fix for Langflow | 2026-01-08 |
| `RAG_IMPLEMENTATION_MASTERPLAN.md` | RAG architecture & status | 2026-01-10 |
