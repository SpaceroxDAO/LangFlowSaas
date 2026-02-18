# Changelog: Teach Charlie AI

**Purpose**: This changelog documents major decisions, rationale, and design choices made during discovery and development.

---

## 2026-02-17 - Teach Charlie Desktop App (Tauri v2) — Phase 1-3 Scaffold

### Summary
Scaffolded the entire Teach Charlie Desktop application using Tauri v2 (Rust + React). The desktop app eliminates the need for CLI/terminal knowledge to connect AI agents to OpenClaw — users download, sign in, and everything connects automatically. This replaces the `npx tc-connector --setup` workflow for non-technical users.

### Design Decision
**Tauri v2 over Electron**: ~5MB base runtime vs 150MB. Native system tray, auto-start, and sidecar management. The existing `tc-connector` is compiled into a standalone binary via `bun build --compile` and bundled as a Tauri sidecar — no Node.js runtime needed on the user's machine.

### Architecture
```
Teach Charlie Desktop (Tauri v2)
├── WebView (React + Tailwind + Framer Motion)
│   ├── Splash → Sign-in (Clerk) → Agent Dashboard → Settings
│   └── "Coming Alive" animation sequence
├── Rust Core
│   ├── System tray (hide-on-close)
│   ├── Sidecar management (start/stop/restart tc-connector)
│   ├── Config I/O (~/.teach-charlie/config.json)
│   └── Auto-start plugin
└── tc-connector sidecar (bun compiled binary)
    └── Standalone MCP server — no Node.js required
```

### User Flow
1. Download & install (.dmg on macOS, .msi on Windows)
2. Open app → sign in with Clerk
3. App auto-fetches published agent + generates MCP token (single bootstrap call)
4. Animated "agent coming alive" sequence (avatar, skills lighting up, confetti)
5. MCP bridge starts in background → green status indicator
6. Close window → app continues in system tray
7. OpenClaw / Claude Desktop discovers the agent via auto-generated `.mcp.json`

### Files Created (38 new files)

**Backend:**
- `src/backend/app/api/desktop.py` — `GET /api/v1/desktop/bootstrap` (returns agent + skills + MCP token in one call)
- Modified `api/__init__.py` and `main.py` to register `desktop_router`

**Tauri Project — `tc-agent/` (36 files):**

| Layer | Key Files |
|-------|-----------|
| Config | `package.json`, `vite.config.ts`, `tsconfig.json` (strict: true), `tauri.conf.json` |
| Rust | `lib.rs` (tray + hide-on-close), `commands.rs` (6 IPC commands), `state.rs` (AppState) |
| Pages | `SplashPage`, `SignInPage`, `AgentDashboardPage`, `SettingsPage` |
| Components | `AgentCard`, `AgentComingAlive` (5-step Framer Motion), `SkillsList`, `MCPStatus` |
| Hooks | `useAgent` (bootstrap API), `useSidecar` (Tauri invoke), `useMCPToken` (local config) |
| API | `lib/api.ts` (desktop bootstrap client) |
| Build | `scripts/build-sidecar.sh` (bun compile for macOS/Windows) |

**CI/CD:**
- `.github/workflows/build-desktop.yml` — Builds macOS (arm64 + x64) + Windows, creates GitHub Releases

### Key Technical Decisions
| Decision | Choice | Why |
|----------|--------|-----|
| Framework | Tauri v2 | 5MB vs 150MB Electron, native feel |
| Auth | Clerk `<SignIn />` in webview | In-app auth, consistent with web platform |
| Sidecar | `bun build --compile` of tc-connector | Single binary, no Node.js dependency |
| Animations | Framer Motion | Spring physics, staggered reveals |
| Auto-update | tauri-plugin-updater + GitHub Releases | Official Tauri approach |
| Config location | `~/.teach-charlie/config.json` | Standard XDG-style, separate from tc-connector |

### Build Verification (Same Day)
All compilation steps verified:
- **Frontend**: Vite build 420KB JS bundle, TypeScript strict zero errors
- **Rust**: `cargo check` clean, release binary 11MB, compiled in ~90s
- **Sidecar**: `bun build --compile` → 58MB standalone binary, `--version` / `--help` verified
- **.app bundle**: 69MB (Tauri 11MB + sidecar 61MB)
- **.dmg installer**: 29MB compressed via UDZO

### Build Notes
- Rust fix: `use tauri::Emitter;` needed for `app.emit()` (Tauri v2 trait import)
- Rust fix: `app.default_window_icon()` instead of `Image::from_bytes()` for tray icon
- Rust fix: Removed `macos-ahp` feature from `tauri-plugin-autostart` (doesn't exist)
- PostCSS fix: Added `@tailwindcss/postcss` to devDependencies for Tailwind v4
- DMG fix: Tauri's built-in `bundle_dmg.sh` fails; manual `hdiutil create` works

### Auth Verification (2026-02-17, Same Day)
Clerk `<SignIn />` confirmed working in Tauri WebView — **no browser redirect fallback needed**.

**What was tested:**
- Launched .app bundle → Splash screen → Sign-in page transition (AnimatePresence fade)
- Clerk component renders: Google sign-in button, email/password fields, Sign up link
- Zero console errors (1 expected Clerk dev mode warning)
- CSP configured for all Clerk domains (connect-src, script-src, style-src, frame-src, worker-src)
- App process runs at ~90MB RAM, 69MB on disk

**Bug fixed:** Moved `setScreen()` state transitions from render to `useEffect` in `App.tsx` to avoid React state-during-render warnings.

**Note:** "Sign in to My Application" text comes from the Clerk dashboard application name setting, not from our code. Change it in Clerk dashboard → Application → General.

### Remaining Work
- Deploy backend to production (bootstrap endpoint returns 404 until deployed)
- Add `tauri://localhost` to Clerk allowed origins (for actual Tauri webview, not Vite dev server)
- End-to-end test: sign in → bootstrap API → sidecar start → MCP bridge live
- Real branded icons (replace placeholder purple PNGs with proper .icns/.ico)
- Code signing (Apple Developer ID, Windows cert)

---

## 2026-02-16 - OpenClaw Integration Phase 2: MCP Bridge Execution + TC Connector CLI

### Summary
Implemented real MCP tool execution in the bridge endpoint, token-based authentication for secure remote access, and a lightweight Node.js CLI connector package (`tc-connector`) that acts as a local MCP server for OpenClaw.

### Design Decision
**Node.js CLI over desktop app**: Instead of an Electron/Tauri desktop app (originally planned), chose a lightweight Node.js CLI package using `@modelcontextprotocol/sdk` v1.26.0 with stdio transport. This is simpler to distribute (via `npx`), has zero dependencies beyond the MCP SDK, and aligns with how OpenClaw expects MCP servers to be configured (as CLI commands in `.mcp.json`).

### Key Features
- **Real MCP Execution**: Bridge endpoint now executes workflows via `WorkflowService.chat()` instead of placeholder responses
- **Stateless Calls**: Each MCP tool call creates a new conversation (`conversation_id=None`) — the calling agent manages context
- **120s Timeout**: `asyncio.wait_for()` wraps execution, returns MCP-formatted error on timeout
- **MCP Bridge Token**: Cryptographic token (`tc_` prefix, `secrets.token_urlsafe(48)`) stored on User model for auth
- **Token Auth Endpoints**: `GET/POST /api/v1/mcp/bridge/tools` (no user_id in URL) with Bearer token auth
- **TC Connector CLI**: npm package that bridges OpenClaw ↔ Teach Charlie via stdio MCP transport
- **Settings UI**: OpenClaw Connection section with token generation, masked preview, revocation
- **ConnectOpenClawModal**: 3-step setup guide (install → configure → restart)

### Architecture
```
OpenClaw Agent (local)
    ↓ stdio (MCP protocol)
TC Connector (local Node.js process)
    ↓ HTTPS + Bearer token
Teach Charlie API (/api/v1/mcp/bridge/*)
    ↓ WorkflowService.chat()
Langflow (executes workflow)
```

### E2E Tests (33 tests across 6 groups)
New file: `src/frontend/e2e/tests/openclaw-phase2.spec.ts`
- MCP bridge real execution (6 tests)
- MCP token API (5 tests)
- Token-based bridge auth (6 tests)
- Settings page UI (8 tests)
- ConnectOpenClaw modal (6 tests)
- Full integration flow (1 test — end-to-end: generate token → enable skill → list tools → call tool)

### Files Created (12)
- `tc-connector/` — Complete npm package (package.json, tsconfig.json, bin/, src/, README.md, .npmignore)
- `src/backend/alembic/versions/20260216_0002_add_mcp_bridge_token_to_users.py` — Migration
- `src/frontend/src/components/ConnectOpenClawModal.tsx` — Setup guide modal
- `src/frontend/e2e/tests/openclaw-phase2.spec.ts` — 33 E2E tests

### Files Modified (5)
- `src/backend/app/api/mcp_bridge.py` — Real execution, Pydantic schemas, token auth, dual endpoints
- `src/backend/app/models/user.py` — Added `mcp_bridge_token` column
- `src/backend/app/api/settings.py` — MCP token generate/status/revoke endpoints
- `src/frontend/src/lib/api.ts` — Token management API methods
- `src/frontend/src/pages/SettingsPage.tsx` — OpenClaw Connection section

---

## 2026-02-16 - OpenClaw Integration Phase 1: UI Foundation & Backend Infrastructure

### Summary
Implemented the foundation for OpenClaw agent integration. Users can now publish an agent as their "live" AI agent and mark workflows as skills that the agent can execute. This Phase 1 builds the complete UI flow and backend infrastructure; the TC Connector desktop app (Phase 2) will provide the local execution environment.

### Design Decision
**Wrapper-only approach**: All changes are in Teach Charlie's layer. No modifications to Langflow or OpenClaw core. The MCP bridge translates between Teach Charlie workflows and MCP-compatible tool format, allowing OpenClaw to discover and execute skills without knowing about Langflow.

### Key Features
- **Agent Publishing**: 1-live-agent limit with purple "Publish Agent 0/1" button, confirmation modal with replace flow
- **Visual Indicators**: Purple gradient star in sidebar, purple card border + "Live" pill badge on project cards
- **Workflow Skill Toggles**: "Agent skill" toggle on every workflow card (grid + list views)
- **MCP Bridge**: REST endpoints that expose skill-enabled workflows as MCP-compatible tools
- **WebSocket Relay**: Foundation for bidirectional communication between frontend and local agent
- **Connection Indicator**: PlaygroundPage shows "Agent Offline" for published agents (Phase 2 enables "Live Agent")

### Architecture
```
Frontend ─── Publish Button ──→ Backend /publish endpoint
                                    ↓ sets is_published=true
Frontend ─── Skill Toggle ───→ Backend /agent-skill endpoint
                                    ↓ sets is_agent_skill=true
TC Connector ── GET /tools ──→ MCP Bridge ── lists skill workflows
TC Connector ── POST /call ──→ MCP Bridge ── routes to workflow chat
TC Connector ── WS connect ──→ WS Relay ── maintains user↔agent mapping
```

### QA Bug Fix
During manual QA, discovered the Publish button and connection indicator were not showing on the Playground page when accessed via workflow route (`/playground/workflow/...`). Root cause: the page only fetched `agentComponent` in agent mode, but the publish UI referenced it in both modes. Fixed by introducing `resolvedAgentComponent` that resolves to the correct data source in either mode.

### E2E Tests (18 tests, all passing)
New file: `src/frontend/e2e/tests/openclaw-publish.spec.ts`
- Publish button visibility (Edit Agent + Playground pages)
- Publish modal (first-time flow + replace flow)
- API publish/unpublish with 1-live-agent enforcement
- Live badge in grid and list views
- Purple gradient styling on published cards
- Workflow skill toggle (UI clicks + API)
- MCP bridge endpoints (tools list + tool call)
- Connection indicator for published agents

### Files Created (6)
- `src/backend/app/api/mcp_bridge.py` - MCP bridge router (GET /tools, POST /tools/call)
- `src/backend/app/api/ws_relay.py` - WebSocket relay (auth, connection map, ping/pong)
- `src/backend/alembic/versions/20260216_0001_add_is_agent_skill_to_workflows.py` - Migration
- `src/frontend/src/hooks/usePublishedAgent.ts` - React Query hook for published state
- `src/frontend/src/components/PublishAgentModal.tsx` - Publish confirmation modal
- `src/frontend/e2e/tests/openclaw-publish.spec.ts` - 18 E2E tests

### Files Modified (13)
- Backend: workflow model, workflow schema, agent_components API, workflows API, api/__init__.py, main.py
- Frontend: types/index.ts, lib/api.ts, EditAgentPage, PlaygroundPage, Sidebar, ProjectDetailPage, WorkflowsTab

---

## 2026-01-24 - Resources Section: GitBook-Style Documentation

### Summary
Implemented a comprehensive public documentation section with GitBook-style experience. The Resources section provides User Guides, Developer Documentation, and Changelog - all publicly accessible (no login required) for SEO benefits.

### Features Implemented
- **Public Routes**: `/resources/*` accessible without authentication
- **GitBook-Style Layout**: Collapsible sidebar with navigation, dark mode support
- **User Guides (10 pages)**: Introduction, Quick Start, Dog Trainer Metaphor, Playground, Knowledge Sources, Workflows, Publishing, Embedding, MCP Servers, Billing
- **Developer Docs (10 pages)**: Architecture Overview, Authentication, API Reference, Webhooks, Embed API, Custom Components, Langflow Integration, Composio Integration, MCP Protocol, Self-Hosting Guide
- **Changelog Page**: Version history with release notes
- **Markdown Rendering**: react-markdown with GitHub Flavored Markdown, code syntax highlighting
- **Responsive Design**: Mobile-friendly with collapsible sidebar

### Files Created

**React Components (9 files)**:
- `src/frontend/src/pages/resources/ResourcesLayout.tsx` - Main layout
- `src/frontend/src/pages/resources/ResourcesHomePage.tsx` - Landing page
- `src/frontend/src/pages/resources/GuidesPage.tsx` - Guides index
- `src/frontend/src/pages/resources/GuidePage.tsx` - Individual guide viewer
- `src/frontend/src/pages/resources/DevelopersPage.tsx` - Developer docs index
- `src/frontend/src/pages/resources/DeveloperDocPage.tsx` - Individual doc viewer
- `src/frontend/src/pages/resources/ChangelogPage.tsx` - Changelog viewer
- `src/frontend/src/components/docs/DocSidebar.tsx` - Navigation sidebar
- `src/frontend/src/components/docs/DocContent.tsx` - Markdown renderer

**Markdown Content (21 files)**:
- `src/frontend/public/docs/guides/*.md` - 10 user guide files
- `src/frontend/public/docs/developers/*.md` - 10 developer doc files
- `src/frontend/public/docs/changelog/index.md` - Changelog content

**Files Modified**:
- `src/frontend/src/App.tsx` - Added public /resources routes
- `src/frontend/src/components/Sidebar.tsx` - Added Resources link

**Dependencies Added**:
- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-highlight` - Syntax highlighting
- `highlight.js` - Highlighting themes

### URL Structure
```
/resources                    → Landing page
/resources/guides             → User Guides index
/resources/guides/:slug       → Individual guide
/resources/developers         → Developer Docs index
/resources/developers/:slug   → Individual doc
/resources/changelog          → Changelog page
```

### Design Decisions
1. **Public Access**: No authentication required - improves SEO and allows potential users to browse docs before signing up
2. **Markdown Files**: Content stored as `.md` files in `public/docs/` - easy to edit without code changes
3. **Dog Trainer Metaphor**: User guides consistently use the educational metaphor throughout
4. **Similar to Langflow Docs**: Developer documentation structure mirrors Langflow's approach since we're built on it

---

## 2026-01-24 - Best Practices Audit: Complete (100%)

### Summary
Completed all remaining best practices fixes. Final item was setting up frontend component testing with Vitest and React Testing Library (45 tests across 3 components). Also implemented composite database indexes, standardized API error responses, rate limiting on critical endpoints, and pagination standardization.

### Fix 16: Composite Database Indexes
**Files**: `src/backend/alembic/versions/20260124_0001_add_composite_indexes.py`

Added 11 composite indexes for query performance optimization:
- `ix_messages_conversation_created` - Message ordering by conversation
- `ix_conversations_user_created` - User's conversation list
- `ix_workflows_user_created` - User's workflow list
- `ix_workflows_user_langflow` - Flow lookups
- `ix_agent_components_user_created` - User's agent list
- `ix_agent_components_user_published` - Published agent filtering
- `ix_knowledge_sources_user_created` - Knowledge source list
- `ix_billing_events_user_created` - Audit trail queries
- `ix_projects_user_sort` - Project ordering
- `ix_mcp_servers_user_created` - MCP server list
- `ix_user_connections_user_status` - Connection filtering

### Fix 13: Standardized API Error Responses
**Files**: `src/backend/app/schemas/error.py`, `src/backend/app/exceptions.py`, `src/backend/app/main.py`

Implemented comprehensive error handling system:
- `ErrorResponse` schema with consistent structure (error, message, status_code, details)
- `ErrorCode` constants for machine-readable error types
- Custom exceptions: `NotFoundError`, `ValidationError`, `RateLimitError`, `LangflowError`, etc.
- Global exception handlers for `AppException`, `RequestValidationError`, and unhandled exceptions
- Production-safe: detailed error messages only in debug mode

**Example Response**:
```json
{
  "error": "not_found",
  "message": "Agent not found",
  "status_code": 404
}
```

### Fix 14: Rate Limiting on Critical Endpoints
**Files**: `src/backend/app/api/workflows.py`, `billing.py`, `avatars.py`, `agent_components.py`

Added rate limiting to prevent abuse on expensive/sensitive endpoints:
- `chat_with_workflow` and `chat_with_workflow_stream` (LLM costs)
- `create_checkout` and `create_portal` (billing security)
- `generate_avatar` and `generate_dog_avatar` (API costs)
- Uses existing Redis-based rate limiter with per-user tracking

### Fix 15: Pagination Standardization
**Files**: `src/backend/app/api/analytics.py`

Standardized all list endpoints to use `page/page_size` pattern:
- Converted `get_workflow_messages` from `limit/offset` to `page/page_size`
- Internal conversion to `limit/offset` for Langflow API calls
- All other endpoints already used `page/page_size`

### Fix 12: Frontend Component Testing
**Files**: `vitest.config.ts`, `src/test/setup.ts`, `src/test/test-utils.tsx`

Set up Vitest 4.0 with React Testing Library for frontend component testing:
- `vitest.config.ts` - Test configuration with jsdom environment
- `src/test/setup.ts` - Browser API mocks (matchMedia, IntersectionObserver, etc.)
- `src/test/test-utils.tsx` - Custom render with React Query and Router providers
- 45 tests across 3 components:
  - `MessageBubble.test.tsx` - 26 tests (rendering, copy, edit, delete, feedback, regenerate)
  - `Pagination.test.tsx` - 11 tests (rendering, navigation, dropdown)
  - `ProgressBar.test.tsx` - 8 tests (step rendering, coloring)

**New npm scripts**:
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:coverage` - Generate coverage report

### Progress Summary
| Category | Completed | Total |
|----------|-----------|-------|
| Critical (Security) | 5 | 5 |
| High Priority | 6 | 6 |
| Medium Priority | 5 | 5 |
| **Overall** | **15** | **15** |

**Best practices audit complete!** All security, high-priority, and medium-priority fixes implemented.

---

## 2026-01-21 - Best Practices Audit: Phases 1-3 (Critical & High Priority)

### Summary
Comprehensive security audit and best practices remediation. Completed all critical security fixes and high-priority improvements to prepare the platform for production deployment.

### Security Fixes (5 Critical)
1. **Input Validation**: Added Pydantic constraints (min/max length, regex patterns) to all request schemas
2. **File Upload Security**: Implemented file type validation, size limits, and secure storage paths
3. **CORS Hardening**: Restricted allowed origins, methods, and headers
4. **Security Headers**: Added middleware for CSP, X-Frame-Options, X-Content-Type-Options, etc.
5. **Rate Limiting**: Implemented Redis-based rate limiting with per-user tracking

### High-Priority Fixes (6 Items)
6. **Environment Validation**: Startup checks for required environment variables
7. **Structured Logging**: JSON logging format with correlation IDs
8. **Error Sanitization**: Removed internal details from error messages in production
9. **Database Transactions**: Proper transaction boundaries and rollback handling
10. **Graceful Shutdown**: Signal handling for clean service termination
11. **Health Checks**: Comprehensive health endpoints with dependency checks

### Files Created
- `src/backend/app/middleware/security_headers.py` - Security headers middleware
- `src/backend/app/middleware/redis_rate_limit.py` - Redis-based rate limiter

### Files Modified
- 15+ schema files with input validation
- `src/backend/app/main.py` - Middleware registration, exception handlers
- `src/backend/app/config.py` - Environment validation
- Multiple API files for error handling improvements

---

## 2026-01-10 - Phase 12: Knowledge Sources & RAG Foundation

### Summary
Implemented comprehensive knowledge source support for AI agents, enabling users to add context from text, files, and URLs. The system uses a keyword-based search fallback while Langflow-native RAG ingestion is being refined.

### Knowledge Source Types Implemented

#### 1. Paste Text
- Users can paste text content directly into agents
- Useful for FAQs, handbooks, product info
- Stored as text files in knowledge storage

#### 2. Upload File
- Supports PDF, TXT, MD, DOCX, CSV formats
- Max file size: 10MB each
- Files stored per-user in `uploads/knowledge/{user_id}/`

#### 3. Add URL
- Fetches and indexes content from web pages
- HTML converted to plain text for indexing
- Supports any public URL

### Technical Implementation

#### Database Migrations
Created two new migrations for agent component enhancements:
```sql
-- 20260109_0001: Add tool selection
ALTER TABLE agent_components ADD COLUMN selected_tools JSON;

-- 20260110_0001: Add knowledge source tracking
ALTER TABLE agent_components ADD COLUMN knowledge_source_ids JSON;
```

#### Knowledge Search Tool
Created custom `KnowledgeRetrieverComponent` for Langflow:
- Keyword-based search with relevance scoring
- Paragraph and sentence-level chunking
- Returns top-k most relevant passages
- Tool mode enabled for agent integration

#### RAG Architecture (Two Approaches)

**Approach A: Langflow-Native RAG (Planned, Not Working Yet)**
```
Ingestion: File → SplitText → Embeddings → Chroma
Retrieval: Query → Embeddings → Chroma Search → Agent
```
- Uses Langflow's built-in components
- Vector/semantic search via Chroma
- Currently fails due to template validation issues

**Approach B: Keyword-Based Fallback (Working)**
```
Ingestion: File content loaded into knowledge_content field
Retrieval: Query → Keyword matching → Relevance scoring → Agent
```
- Simpler, more reliable
- Works with all knowledge source types
- Automatic fallback when RAG fails

#### Graceful Fallback System
```python
# workflow_service.py
try:
    await self._ingest_knowledge_sources(...)  # Try RAG
    flow_data = self.mapper.create_rag_flow_from_qa(...)
except Exception as e:
    logger.warning(f"RAG ingestion failed, falling back to keyword search: {e}")
    # Load content directly into knowledge_content field
    knowledge_content = await knowledge_service.load_combined_content(...)
    flow_data = self.mapper.create_flow_from_qa(..., knowledge_content=knowledge_content)
```

### Files Created

| File | Purpose |
|------|---------|
| `templates/tools/knowledge_retriever.json` | Knowledge search tool component |
| `templates/rag/ingest_documents.json` | RAG ingestion flow template |
| `templates/rag_agent.json` | RAG agent flow template |
| `alembic/versions/20260110_0001_*.py` | knowledge_source_ids migration |
| `e2e/tests/rag-integration.spec.ts` | Comprehensive E2E test |

### Files Modified

| File | Change |
|------|--------|
| `workflow_service.py` | Added RAG/fallback logic, ingestion support |
| `template_mapping.py` | Added RAG template configuration methods |
| `knowledge_service.py` | Added debug logging, load_combined_content |
| `docker-compose.yml` | Added chroma_data volume |

### E2E Testing Results

All knowledge source types tested and verified:

| Type | Test Query | Expected | Actual | Status |
|------|------------|----------|--------|--------|
| Text | "How many days of PTO?" | 20 days | "20 days per year" | ✅ |
| Text | "What are office hours?" | 9-6 M-F | Correct hours listed | ✅ |
| File | "Price of Premium Widget Pro?" | $299.99 | "$299.99 with warranty" | ✅ |
| File | "Return policy?" | 30 days | "30-day return policy" | ✅ |
| URL | "What about Moby Dick?" | Found | Identified the reference | ✅ |
| URL | "Who is Herman Melville?" | Author | Found in document | ✅ |

### Known Limitations

1. **RAG Ingestion Not Working**: The Langflow-native ingestion template fails validation
   - Chroma/OpenAI Embeddings components don't match expected format
   - Falls back to keyword search automatically (users unaffected)

2. **Future Improvements Needed**:
   - Fix RAG template to match Langflow's exact component structure
   - Enable true semantic/vector search
   - Add embedding model configuration
   - Add chunk size/overlap settings

### Architecture Decision

**Decision**: Ship with keyword-based fallback, refine RAG later

**Rationale**:
- Users can create agents with knowledge sources today
- Keyword search works well for structured content (FAQs, handbooks)
- RAG ingestion can be fixed without changing user-facing behavior
- Follows "wrapper not fork" philosophy - using Langflow's components when possible

---

## 2026-01-09 - Configuration Management & Local Dev Nginx Setup

### Summary
Fixed critical configuration management issues where hardcoded values caused Docker container name mismatches. Implemented a single source of truth pattern and created a dedicated local development Docker Compose setup for nginx-proxied Langflow.

### Problems Discovered & Fixed

#### 1. Langflow Container Restart Failed
**Problem**: Clicking "Restart Langflow" showed error: `No such container: langflow`

**Root Cause**: Container name mismatch
- `docker-compose.yml` defined: `teachcharlie-langflow`
- `langflow_service.py` hardcoded: `langflow`

**Solution**: Single source of truth pattern
```
.env (LANGFLOW_CONTAINER_NAME) → config.py → services
```

#### 2. Canvas Not Loading in Local Dev
**Problem**: Canvas iframe showed broken image/nothing after publishing agent

**Root Cause**:
- nginx container was in restart loop (depends_on frontend, which doesn't run in Docker for local dev)
- Frontend URL defaulted to port 7861 (nginx) but nginx wasn't working

**Solution**: Created dedicated `docker-compose.dev.yml` for local development that only runs:
- PostgreSQL (database)
- Langflow (AI engine)
- nginx (Langflow proxy with CSS injection)

Frontend and backend run directly on host machine.

### Implementation Details

#### Single Source of Truth Pattern
| Setting | .env.example | config.py | Usage |
|---------|-------------|-----------|-------|
| `LANGFLOW_CONTAINER_NAME` | Line 85 | `langflow_container_name` | `langflow_service.py` |
| `LANGFLOW_API_URL` | Line 81 | `langflow_api_url` | Health checks |

#### Startup Validation
Added `validate_container_config()` method to `LangflowService` that:
1. Checks if Docker is available
2. Verifies configured container exists
3. Logs clear error if misconfigured

```python
# app/main.py - Called at startup
langflow_validator = LangflowService(session=None)
langflow_validator.validate_container_config()
```

### Files Created
| File | Purpose |
|------|---------|
| `nginx/nginx.dev.conf` | Simplified nginx config for local dev (Langflow proxy only) |
| `docker-compose.dev.yml` | Local dev compose (postgres + langflow + nginx) |

### Files Modified
| File | Change |
|------|--------|
| `.env.example` | Added LANGFLOW_CONTAINER_NAME, updated VITE_LANGFLOW_URL docs |
| `src/backend/app/config.py` | Added langflow_container_name setting |
| `src/backend/app/services/langflow_service.py` | Refactored to use centralized settings |
| `src/backend/app/main.py` | Added startup validation |
| `docker-compose.yml` | Container name from env var, removed obsolete version |
| `src/frontend/src/components/LangflowCanvasViewer.tsx` | Default to port 7861 (nginx) |

### Local Development Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Host Machine                          │
│  ┌──────────────┐          ┌──────────────┐             │
│  │   Frontend   │          │   Backend    │             │
│  │ localhost:3001│         │ localhost:8000│            │
│  └──────────────┘          └──────────────┘             │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                Docker (docker-compose.dev.yml)          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   postgres   │  │   langflow   │  │    nginx     │  │
│  │   :5432      │  │   :7860      │◄─│   :7861      │  │
│  └──────────────┘  └──────────────┘  │ (CSS inject) │  │
│                                       └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Usage
```bash
# Start local dev services
docker-compose -f docker-compose.dev.yml up -d

# Run frontend on host
cd src/frontend && npm run dev

# Run backend on host
cd src/backend && uvicorn app.main:app --reload

# Canvas URL (always via nginx)
http://localhost:7861/flow/{flowId}
```

### Key Principle
**nginx is ALWAYS required** for Langflow canvas viewing because it handles CSS/JS injection for white-labeling. Never bypass nginx (port 7860) for end-user views.

---

## 2026-01-08 - Nginx Proxy Fix & White-Label Overlay System

### Summary
Fixed critical "Couldn't establish a connection" error in Langflow canvas caused by nginx misconfiguration. Implemented proper white-label overlay system that hides branding without blocking functional UI.

### Root Cause Discovery
**Problem**: Users saw persistent "Couldn't establish a connection" popup that blocked the Langflow canvas.

**Root Cause**: Nginx `location /health` was using PREFIX match instead of EXACT match, causing `/health_check` requests to return nginx's simple `healthy` string instead of Langflow's expected JSON response.

```nginx
# BROKEN - Prefix match catches /health AND /health_check
location /health { return 200 "healthy\n"; }

# FIXED - Exact match only catches /health
location = /health { return 200 "healthy\n"; }
```

### Debugging Journey
1. Initially suspected WebSocket handshake issues
2. Tried various nginx WebSocket configurations (map variables, forced headers, buffering)
3. Added aggressive CSS to hide error modals (caused collateral damage - hid Playground/Logs)
4. Compared direct Langflow response vs proxied response
5. **Found the culprit**: `/health_check` returning wrong response through nginx

### Files Modified

**Nginx Configuration**:
- `nginx/nginx.conf` - Fixed `/health` to `= /health` (exact match) on both port 80 and 7861

**Overlay System (White-Label Only)**:
- `nginx/overlay/style.css` - Simplified to only hide branding elements
- `nginx/overlay/script.js` - Simplified to only handle white-label text matching

**Documentation**:
- `docs/LANGFLOW_PROXY_FIX.md` - NEW: Complete debugging guide and solution

### White-Label Approach

| Category | HIDE | KEEP |
|----------|------|------|
| Branding | Header, Logo, "Langflow" text | - |
| Social | GitHub, Discord, Twitter links | - |
| Dialogs | - | Playground, Logs, Settings |
| UI | - | Dropdowns, tooltips, menus |

**Key Principle**: Don't hide `[role="dialog"]`, `[data-radix-portal]`, or `.fixed.inset-0.z-50` - these are functional UI elements needed for Playground, Logs, etc.

### Testing Verified
- ✅ `/health_check` returns proper JSON through nginx
- ✅ No more "Couldn't establish a connection" popup
- ✅ Playground modal works
- ✅ Logs modal works
- ✅ All dropdowns and menus work
- ✅ Branding elements hidden (header, social links)

---

## 2026-01-08 - Phase 11b: EditAgentPage Redesign & Avatar Fixes

### Summary
Major redesign of the EditAgentPage with proper header/footer action buttons, improved navigation flow, and avatar display fixes across all pages.

### EditAgentPage UI Redesign

#### Header Changes
**Decision**: Replace single "Back to Chat" link with two action buttons.

**Implementation**:
- "Talk to Agent" button (violet, links to `/playground/:agentId`)
- "Advanced Settings" button (gray outline, opens settings modal)

**Rationale**: Users need quick access to both testing their agent and configuring advanced options.

#### Footer Action Buttons
**Decision**: Add dedicated footer with three action buttons.

**Implementation**:
1. **Save Draft** (gray) - Saves changes without navigation, shows success message
2. **Publish / Publish Updates** (violet) - Publishes agent, shows restart modal
3. **Create New Workflow** (outline) - Links to wrapped canvas at `/canvas/:agentId`

**Key Behaviors**:
- Save Draft and Publish stay on page (no navigation)
- Save Draft shows "Changes saved!" message for 3 seconds
- Publish shows restart modal (Restart Now / Later options)
- Create New Workflow disabled until agent is published AND restarted
- Button text changes from "Publish" to "Publish Updates" after initial publish

#### Navigation Fixes
**Problem**: Multiple navigation issues after user feedback.

**Fixes Applied**:
1. Save Draft no longer navigates to playground
2. Publish no longer calls handleSave (which navigated) - inlined save logic
3. Create New Workflow uses internal route `/canvas/:agentId` instead of external Langflow URL
4. PlaygroundPage back button goes to Edit Agent page instead of dashboard
5. Removed duplicate Advanced Settings section from page bottom

### Avatar Fixes

#### Display Scaling
**Problem**: Avatar images in agent cards were too small.

**Solution**: Changed avatar image scale from `scale-125` (125%) to `scale-150` (150%) in ProjectDetailPage.

#### Generation Infrastructure
**Problem**: Avatar generation was failing due to missing environment variable.

**Fixes**:
1. Added `OPENAI_API_KEY` environment variable to backend container in docker-compose.yml
2. Fixed static files path in main.py to serve avatar images correctly

#### E2E Test Added
Created comprehensive `avatar-generation.spec.ts` test that:
1. Creates an agent via the 3-step wizard
2. Navigates to Edit page
3. Clicks Generate avatar button
4. Waits for avatar API response
5. Verifies avatar image displays correctly
6. Verifies avatar saved to database

### Files Modified

**Frontend**:
- `src/frontend/src/pages/EditAgentPage.tsx` - Complete UI redesign with header/footer
- `src/frontend/src/pages/PlaygroundPage.tsx` - Back button navigation fix
- `src/frontend/src/pages/ProjectDetailPage.tsx` - Avatar scale adjustment (150%)

**Backend**:
- `src/backend/app/main.py` - Fixed static files path
- `docker-compose.yml` - Added OPENAI_API_KEY

**Tests**:
- `src/frontend/e2e/tests/avatar-generation.spec.ts` - NEW: Avatar generation E2E test

### Testing Verified
- ✅ Save Draft stays on page with success message
- ✅ Publish shows restart modal
- ✅ Create New Workflow links to internal canvas route
- ✅ Back button returns to Edit Agent page
- ✅ Avatar generation working end-to-end
- ✅ Avatar displays at correct scale in agent cards

---

## 2026-01-08 - Phase 11: Custom Component Generation & E2E Testing

### Summary
Implemented full custom component generation pipeline allowing users to publish their agents as reusable Langflow components. Also fixed critical chat issues and added comprehensive E2E test coverage.

### Custom Component Generation

#### Docker Infrastructure Fixes
**Problem**: Backend container couldn't write to shared `custom_components` volume or restart Langflow.

**Root Cause**:
1. Backend ran as non-root user (`appuser`) but Docker volume was created with root permissions
2. Docker CLI wasn't installed in the backend container

**Solution**:
1. Added `user: "0:0"` to backend service in `docker-compose.yml` (matching Langflow container)
2. Updated `Dockerfile` to install Docker CE CLI for container restart capability

#### Component Generation Flow
**Decision**: Generate Python component files that Langflow loads on restart.

**Implementation**:
1. User clicks "Publish Agent" on Edit page
2. Backend generates Python file via Jinja2 template
3. File written to `/app/custom_components/my_agents/{name}_{id}.py`
4. User clicks "Restart Langflow"
5. Backend uses Docker CLI to restart Langflow container
6. Langflow reloads and shows component in sidebar under "my_agents" category

**Files Modified**:
- `docker-compose.yml` - Added `user: "0:0"` for backend
- `src/backend/Dockerfile` - Added Docker CE CLI installation

### Chat Playground Fixes

#### "Failed to send" Error Resolution
**Problem**: Chat messages failed with "Failed to send" error for newly created workflows.

**Root Cause**: `workflow_service.py` wasn't passing user's LLM settings (provider, API key) to the template mapper when creating workflows. Workflows were created with placeholder values like `ANTHROPIC_API_KEY`.

**Solution**:
1. Updated `workflow_service.py` to fetch user settings and pass `llm_provider` and `api_key` to template mapper
2. Created script to fix existing workflows with broken config
3. Synced fixed workflows to Langflow via `langflow_client.update_flow()`

#### Multi-Turn Conversation Verification
**Decision**: Add explicit E2E tests for multi-turn conversations.

**Implementation**: Created `multi-turn-chat.spec.ts` that:
1. Creates a new agent
2. Sends first message, verifies response
3. Sends second message, verifies different response
4. Confirms both turns succeed without errors

### E2E Test Suite

#### Test Files Created
| File | Purpose | Tests |
|------|---------|-------|
| `publish-agent.spec.ts` | Full publish flow with Langflow verification | 4 tests |
| `multi-turn-chat.spec.ts` | 2-turn conversation verification | 2 tests |
| `chat-debug.spec.ts` | Chat functionality debugging | 2 tests |
| `comprehensive.spec.ts` | P001 chat message flow | 1 test |

#### Publish Agent Test Flow
The most comprehensive test (`publish-agent.spec.ts`) verifies:
1. ✅ Create agent via wizard
2. ✅ Navigate to edit page
3. ✅ Click "Publish Agent" button
4. ✅ Verify component file generated
5. ✅ Click "Restart Langflow" button
6. ✅ Wait for Langflow to restart (poll health endpoint)
7. ✅ Navigate to Langflow directly (port 7860)
8. ✅ Click "New Flow" → "Blank Flow"
9. ✅ Verify "my_agents" category visible in sidebar
10. ✅ Verify published components listed

### Testing Verified
- ✅ 4/4 publish-agent tests passing
- ✅ 2/2 multi-turn-chat tests passing
- ✅ Chat playground working with correct LLM settings
- ✅ Custom components appear in Langflow sidebar
- ✅ Langflow restart triggered from UI

---

## 2026-01-07 - Phase 10: Avatar V2 & Architecture Fixes

### Summary
Enhanced avatar generation system with automatic job inference, improved avatar display across all pages, and critical architecture fixes for the three-tab system.

### Avatar Generation V2

#### Automatic Job Inference
**Decision**: Remove manual job dropdown - auto-detect job type from agent name and description using keyword matching.

**Implementation**:
- Created `avatarJobInference.ts` with 40+ job types and extensive keyword lists
- Jobs include: support, developer, data, manager, sales, security, designer, product, marketing, finance, legal, hr, ops, qa, research, doctor, nurse, teacher, tutor, coach, trainer, therapist, pilot, chef, artist, writer, musician, scientist, gardener, athlete, photographer, engineer, accountant, consultant, assistant, receptionist, guide, bot, agent

#### Three-Tier Avatar Generation Strategy
**Decision**: Implement fallback strategy when no job keyword matches.

**Rationale**: Always preserve the canonical dog base image identity regardless of job match.

**Implementation**:
1. **Known Job** → Use predefined accessory prompt
2. **Unknown Job + Description** → Use description-based prompt with constrained accessory list (6 options: glasses, headset, stethoscope, chef hat, graduation cap, hardhat)
3. **Unknown Job + No Description** → Return base image directly (no API call, saves cost)

### Architecture Fixes

#### CanvasViewerPage Updated for New Architecture
**Problem**: "Open Flow Editor" button was broken - called `api.getAgent()` but new system uses AgentComponents and Workflows.

**Solution**: Updated CanvasViewerPage to:
1. Fetch AgentComponent via `api.getAgentComponent()`
2. Find associated Workflow via `api.listWorkflows()`
3. Use `workflow.langflow_flow_id` for canvas display

#### PlaygroundPage Avatar & Edit Link Fix
**Problem**: Avatar not showing in chat page, "Edit Flow" link broken.

**Solution**:
- Added avatar display in header (10x10) and empty state (20x20)
- Added query to fetch agent component for workflow mode
- Fixed Edit Flow link to use `/edit/${agentComponentId}` instead of broken `/canvas/${workflowId}`

### UI Improvements

#### Avatar Styling in Agent Views
- **List View (AgentRow)**: 40px circle, 36px avatar image
- **Grid View (AgentCard)**: 48px circle, 44px avatar image
- Background: Light violet (`bg-violet-100`) when avatar present, gradient when using default icon
- Avatar images display in original black color (no inversion)

### Files Modified

**Frontend**:
- `src/frontend/src/lib/avatarJobInference.ts` - NEW: Job inference from description
- `src/frontend/src/pages/CreateAgentPage.tsx` - Auto-infer job, pass description
- `src/frontend/src/pages/EditAgentPage.tsx` - Auto-infer job, pass description
- `src/frontend/src/pages/PlaygroundPage.tsx` - Avatar display, fixed Edit Flow link
- `src/frontend/src/pages/ProjectDetailPage.tsx` - Larger avatars with violet background
- `src/frontend/src/pages/CanvasViewerPage.tsx` - Updated for AgentComponent/Workflow architecture
- `src/frontend/src/lib/api.ts` - Added description parameter to generateDogAvatar
- `src/frontend/src/types/index.ts` - Added avatar_url to AgentComponentUpdate

**Backend**:
- `src/backend/app/services/dog_avatar_service.py` - Three-tier generation, description support
- `src/backend/app/api/avatars.py` - Added description field to request

### Testing Verified
- ✅ Avatar auto-generates based on agent name/description
- ✅ Avatar displays in PlaygroundPage header
- ✅ Avatar displays in agent list/grid views
- ✅ Open Flow Editor button works
- ✅ Edit Flow link navigates correctly

---

## 2026-01-07 - Phase 9: Three-Tab Project Architecture

### Summary
Major architectural upgrade to transform the single-tab project view into a three-tab structure: Agents, Workflows, and MCP Servers. This separates reusable AI personalities (Agent Components) from executable flows (Workflows) and adds MCP server management.

### Design Decision: Three-Tab Architecture
**Decision**: Split the monolithic "Agents" concept into three distinct entities.

**Rationale**:
- **Agent Components** = Reusable AI personalities with Q&A config (can be used in multiple workflows)
- **Workflows** = Complete Langflow flows that orchestrate components + tools
- **MCP Servers** = External tool integrations (databases, browsers, file systems)

This separation enables:
- Better code reuse (same agent personality in different flows)
- Clearer mental model for users
- Foundation for advanced workflow editing

### Implementation Completed

#### Backend Foundation
- **New Database Models**:
  - `AgentComponent` - Reusable AI personalities (Q&A config, system prompt)
  - `Workflow` - Langflow flows with component references
  - `MCPServer` - External tool configurations with encrypted credentials
  - `UserSettings` - User preferences and API keys

- **New Services**:
  - `AgentComponentService` - CRUD + publish/unpublish
  - `WorkflowService` - CRUD + chat + duplicate
  - `MCPServerService` - CRUD + sync + health checks

- **New API Routes** (36 new endpoints):
  - `/api/v1/agent-components/*` - Create from Q&A, list, get, update, delete, publish, unpublish, duplicate, export, import
  - `/api/v1/workflows/*` - Create, from-agent, from-template, list, get, update, delete, duplicate, export, chat, conversations
  - `/api/v1/mcp-servers/*` - Templates, create, from-template, list, get, update, delete, enable, disable, health, sync, restart-status

- **Database Migration**:
  - Added `workflow_id` column to conversations table
  - Created index `ix_conversations_workflow_id`
  - New tables: `agent_components`, `workflows`, `mcp_servers`, `user_settings`

#### Frontend Updates
- **WorkflowsTab Component**: List/grid views with CRUD operations
- **MCPServersTab Component**: Server cards with enable/disable toggles
- **CreateWorkflowModal**: Options for blank workflow or from-agent
- **CreateMCPServerModal**: Template-based server creation
- **ProjectDetailPage**: Three-tab UI with URL-based state (`?tab=agents|workflows|mcp-servers`)
- **Tab Badges**: Show counts for each tab
- **~30 new API client methods**: Full frontend integration

### Performance Fix: SQLAlchemy Lazy Loading
**Problem**: API requests taking several seconds after database migration.

**Root Cause**: User model had `lazy="selectin"` on 6 relationships, causing 7+ database queries per API request.

**Solution**: Changed all `lazy="selectin"` and `lazy="joined"` to `lazy="select"` across all models:
- User, Project, Agent, Conversation, Message
- AgentComponent, Workflow, MCPServer, UserSettings

**Result**: API response time reduced from ~5 seconds to ~31ms.

### Bug Fixes
1. **Project Rename Not Working**
   - Problem: `ProjectMenu` component called `onRename?.()` but `Sidebar` wasn't passing the callback
   - Solution: Added rename state, mutation, handlers, and inline input UI to Sidebar
   - Also fixed blur/submit race condition with 150ms timeout

2. **Dotted Grid Background**
   - Added canvas-style dotted grid background to:
     - CreateAgentPage (3-step wizard via WizardLayout)
     - EditAgentPage (main view, loading state, error state)
   - CSS: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)` at 24px spacing

### Files Modified (Key Changes)

**Backend**:
- `src/backend/app/models/agent_component.py` - NEW
- `src/backend/app/models/workflow.py` - NEW
- `src/backend/app/models/mcp_server.py` - NEW
- `src/backend/app/models/user_settings.py` - NEW
- `src/backend/app/models/user.py` - Lazy loading fix + new relationships
- `src/backend/app/models/project.py` - Lazy loading fix + new relationships
- `src/backend/app/models/conversation.py` - Lazy loading fix + workflow relationship
- `src/backend/app/api/agent_components.py` - NEW
- `src/backend/app/api/workflows.py` - NEW
- `src/backend/app/api/mcp_servers.py` - NEW
- `src/backend/app/services/agent_component_service.py` - NEW
- `src/backend/app/services/workflow_service.py` - NEW
- `src/backend/app/services/mcp_server_service.py` - NEW

**Frontend**:
- `src/frontend/src/components/WorkflowsTab.tsx` - NEW
- `src/frontend/src/components/MCPServersTab.tsx` - NEW
- `src/frontend/src/pages/ProjectDetailPage.tsx` - Three-tab UI
- `src/frontend/src/components/Sidebar.tsx` - Project rename functionality
- `src/frontend/src/components/WizardLayout.tsx` - Dotted grid background
- `src/frontend/src/pages/EditAgentPage.tsx` - Dotted grid background
- `src/frontend/src/lib/api.ts` - ~30 new methods
- `src/frontend/src/types/index.ts` - New entity types

### Known Issues (Pending)
1. **Empty Tabs**: Workflows and MCP Servers tabs show empty because no data migration from old `agents` table
2. **MCP Sync Not Implemented**: Creating MCP server doesn't sync to `.mcp.json`
3. **Publish Not Implemented**: Agent publish/unpublish buttons exist but don't generate Python components
4. **E2E Tests Needed**: No tests for three-tab functionality yet

### Next Steps
1. Commit current Phase 9 work to git
2. Optional: Data migration to split existing agents
3. E2E tests for three-tab navigation
4. MCP server sync implementation (post-MVP)

---

## 2026-01-06 - Phase 8: UI Polish & Langflow-Style Dashboard

### Summary
Comprehensive UI overhaul to match Langflow's visual styling while preserving our educational UX. Added missing dashboard features including search, pagination, bulk operations, and import/export.

### Design Decision: Match Langflow UI
**Decision**: Update our dashboard to visually match Langflow's UI styling.

**Rationale**:
- Consistent visual language between our app and Langflow canvas
- Users familiar with Langflow will feel at home
- Professional, polished appearance for workshops
- Violet/purple theme differentiates from generic orange SaaS

### Implementation Completed

#### Visual Updates
- **Color Theme Migration**: Orange → Violet/Purple (#7C3AED)
  - All buttons, accents, and highlights updated
  - Matches Langflow's signature purple
- **Header Restructure**: Full-width header like Langflow
  - Dog icon (lucide-react) as logo on left
  - Profile dropdown on right with Settings and Sign out
  - AI Canvas link for quick access to Langflow (dev mode)
- **Sidebar Updates**: Clean white background
  - Project list with hover menus
  - Import button for uploading agent JSON
  - My Files link at bottom

#### Dashboard Features (Matching Langflow)
- **Search**: Real-time agent filtering by name
- **View Toggle**: List/Grid views with localStorage persistence
- **Bulk Selection**: Checkbox per agent, select all, bulk delete
- **Pagination**: 12 agents per page, page navigation, total count
- **Agent Menu**: Three-dot menu with Edit, Export, Duplicate, Delete (all with icons)

#### Import/Export System
- **Export Agent**: Downloads JSON with full agent config and flow data
- **Import Agent**: Upload JSON to create new agent
  - Supports direct format `{ name: "...", ... }`
  - Supports wrapped format `{ agent: {...} }`
  - Supports batch format `{ agents: [...] }`
- **Duplicate Agent**: Creates copy with "(Copy)" suffix

### New Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| lucide-react | ^0.469.0 | Icon library (Dog logo, menu icons) |

### Files Modified (Key Changes)
- `src/frontend/src/components/AppShell.tsx` - Full-width header with logo
- `src/frontend/src/components/Sidebar.tsx` - Import button, white theme
- `src/frontend/src/pages/ProjectDetailPage.tsx` - Search, pagination, bulk ops
- `src/frontend/src/providers/DevModeProvider.tsx` - Profile dropdown
- `src/frontend/src/lib/api.ts` - Export, import, duplicate methods
- `src/backend/app/api/agents.py` - Export, import, duplicate endpoints
- `src/backend/app/services/agent_service.py` - Import/duplicate logic

### Testing Verified
- ✅ File chooser opens on import button click
- ✅ Exported JSON contains full flow data
- ✅ Import creates new agent in default project
- ✅ Search filters agents correctly
- ✅ View toggle persists preference
- ✅ Bulk delete removes multiple agents

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
