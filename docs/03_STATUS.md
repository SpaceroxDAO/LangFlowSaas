# Project Status: Teach Charlie AI

**Last Updated**: 2026-01-07 (Night)
**Current Phase**: Phase 10 - Avatar V2 & Architecture Fixes
**Owner**: Adam (Product) + Claude Code (Technical)

## Current Phase

**Phase**: Phase 10 - Avatar V2 & Architecture Fixes
**Status**: ✅ Complete
**Next Milestone**: Production Deploy, Data Migration (Optional)

## Health Indicators

| Metric | Status | Notes |
|--------|--------|-------|
| Documentation | ✅ Updated | This document updated 2026-01-07 |
| Backend API | ✅ Complete | 36+ new endpoints + avatar generation |
| Database | ✅ Complete | New tables + workflow_id migration done |
| Authentication | ✅ Complete | Clerk JWT + Dev Mode |
| Langflow Integration | ✅ Enhanced | Share, Embed, Webhook, API, Analytics |
| Frontend | ✅ Enhanced | Three-tab UI + avatar display |
| Performance | ✅ Fixed | SQLAlchemy lazy loading optimized |
| Tour System | ✅ Tested | Driver.js integrated and working |
| Canvas Viewer | ✅ Fixed | Updated for AgentComponent/Workflow architecture |
| Streaming | ✅ Added | Backend streaming support enabled |
| Testing | ✅ Complete | 5 E2E tests passing for three-tab + create flow |
| Import/Export | ✅ Added | Agent JSON import/export working |
| New Data Flow | ✅ Working | CreateAgent → AgentComponent + Workflow |
| Avatar System | ✅ Complete | Auto-inference, three-tier generation |

Legend: ✅ Good | 🔨 Built | ⚠️ Warning | ❌ Critical | ⏳ Pending

## Phase Progress

### Phases 0-9: Complete ✅

All previous phases completed:
- Phase 0-4: MVP Foundation (Q&A wizard, Playground, EditAgent)
- Phase 5: Progressive Canvas (iframe with 4 disclosure levels)
- Phase 6: Tools (calculator, web_search, url_reader verified working)
- Phase 7: Memory (multi-turn context retention)
- Phase 7b: Langflow Integration (Share, Embed, Webhook, API tabs)
- Phase 8: UI Polish (Langflow-style violet theme, search, pagination, bulk ops)
- Phase 9: Three-Tab Architecture (Agents, Workflows, MCP Servers)

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

### Phase 10-11: Planned
- [ ] Phase 10: RAG/Documents (high effort, research needed)
- [ ] Phase 11: Agent reasoning visibility

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

## Git Status (2026-01-07)

Recent commits:
- `7898e8a` - docs: Add Phase 3 dynamic component generation implementation guide
- `36b0dd5` - docs: Add detailed technical clarification and example walkthrough
- `c2d0eee` - docs: Add Custom Components Strategy research document

Uncommitted changes (ready to commit):
- Phase 9: Three-tab architecture (backend + frontend)
- Phase 10: Avatar V2 with auto-inference
- Architecture fixes (CanvasViewerPage, PlaygroundPage)
- Performance optimization (lazy loading)
- Bug fixes (rename, dotted grid background, Edit Flow link)

## Known Issues

1. **Legacy agents tab**: The Agents tab shows old agents from legacy `agents` table
   - New agents created via wizard go to Workflows tab (as AgentComponent + Workflow)
   - Legacy agents still work via `/playground/:agentId`
   - Optional: Data migration script to convert legacy agents

2. **MCP servers not synced**: Creating MCP server in UI doesn't sync to `.mcp.json`

3. **Publish not implemented**: Agent publish/unpublish buttons exist but don't generate Python components

## Next Steps (Priority Order)

1. **Production Deploy** (Next)
   - Test in production environment
   - Verify Langflow integration

2. **Data Migration** (Optional)
   - Script to split existing legacy agents into AgentComponent + Workflow
   - Or: Continue with dual support (legacy + new)

3. **MCP Integration** (Post-MVP)
   - Implement `.mcp.json` sync
   - Implement Langflow restart mechanism

---

**Status Summary**: ✅ Green - Phase 10 complete. Avatar system V2 with auto-inference working. All architecture issues fixed (CanvasViewerPage, PlaygroundPage). Phase 9 three-tab architecture stable. Ready for production deploy.

---

## Documentation Index

| Document | Purpose | Last Updated |
|----------|---------|--------------|
| `00_PROJECT_SPEC.md` | Product requirements, personas | 2026-01-03 |
| `01_ARCHITECTURE.md` | Technical architecture, DB schema | 2026-01-03 |
| `02_CHANGELOG.md` | Major decisions & rationale | 2026-01-06 |
| `03_STATUS.md` | **This file** - Current status | 2026-01-07 |
| `04_DEVELOPMENT_PLAN.md` | Original development plan | 2026-01-03 |
| `05_EDUCATIONAL_OVERLAY_RESEARCH.md` | UX patterns research | 2026-01-05 |
| `06_PROGRESSIVE_LEARNING_CURRICULUM.md` | 10-phase curriculum | 2026-01-05 |
| `07_PHASE_0_4_IMPLEMENTATION_PLAN.md` | Tool implementation | 2026-01-05 |
| `08_LANGFLOW_UI_CSS_SELECTORS.md` | CSS selectors for canvas | 2026-01-05 |
| `09_PROGRESSIVE_CANVAS_IMPLEMENTATION.md` | Canvas POC docs | 2026-01-05 |
| `10_PHASE_IMPLEMENTATION_MAPPING.md` | Findings → phases | 2026-01-05 |
| `11_PRODUCTION_DEPLOYMENT.md` | Deployment guide | 2026-01-05 |
| `11_LANGFLOW_DESIGN_MATCH.md` | UI matching guide | 2026-01-06 |
| `12_USER_JOURNEYS_AND_ENTERPRISE_ROADMAP.md` | User journeys | 2026-01-05 |
| `13_LANGFLOW_INTEGRATION_STRATEGY.md` | Integration strategy | 2026-01-05 |
| `14_CUSTOM_COMPONENTS_STRATEGY.md` | Component strategy | 2026-01-06 |
| `15_PROJECT_TABS_REORGANIZATION.md` | **Three-tab plan** | 2026-01-07 |
