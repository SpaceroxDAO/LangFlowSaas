# Architecture Overview

Teach Charlie AI is built as a lightweight wrapper around [Langflow](https://langflow.org/), providing an educational interface for building AI agents without deep forking the core engine.

## Design Philosophy

> "We're not innovating on Langflow - we're packaging it brilliantly for a market that's desperate to learn."

**Core Strategy:**
- Leverage Langflow as-is for agent execution
- Build custom onboarding layer (3-step Q&A → template mapping → playground)
- Minimize modifications to Langflow core
- Focus on packaging and presentation

## System Architecture

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
│  Users, Projects, Agents, Workflows, Conversations, etc.     │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 19 + Vite + TypeScript | Fast, type-safe UI |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Authentication | Clerk | User auth + JWT validation |
| Backend | FastAPI | Async Python API (140+ endpoints) |
| Database | PostgreSQL | Relational data storage |
| Cache | Redis | Session and rate limit caching |
| AI Engine | Langflow | Flow-based agent execution |
| LLM Provider | Anthropic Claude | Primary AI model |
| Integrations | Composio | 500+ OAuth app connections |
| Payments | Stripe | Billing and subscriptions |
| Containerization | Docker Compose | Development and deployment |

## Key Components

### Frontend Layer

**Technology:** React + Vite + TypeScript + Tailwind CSS

**Key Pages:**
- **Landing Page** - Marketing and value proposition
- **Dashboard** - Project and agent management
- **CreateAgentPage** - 3-Step Q&A wizard
- **PlaygroundPage** - Chat testing interface
- **CanvasViewerPage** - Langflow canvas (embedded iframe)
- **ResourcesPage** - Documentation (you're here!)

**State Management:** React Query for server state, local state for UI

### Backend Layer

**Technology:** FastAPI + Python 3.9+ + SQLAlchemy + Pydantic

**21 API Routers:**
- Agent Components, Presets, Workflows
- Knowledge Sources, MCP Servers
- Billing, Missions, Connections
- Analytics, Embed Widget, Files
- And more...

**Key Services:**
- `template_mapping.py` - Q&A → Langflow flow generation
- `langflow_service.py` - Langflow API communication
- `billing_service.py` - Stripe integration
- `composio_service.py` - OAuth app connections

### Database Layer

**Technology:** PostgreSQL with SQLAlchemy ORM

**18 Models:**
- Users, Projects
- AgentComponents, AgentPresets
- Workflows, Conversations, Messages
- KnowledgeSources
- Subscriptions, BillingEvents
- Missions, UserMissionProgress
- MCPServers, UserConnections
- And more...

### Langflow Integration

Langflow runs as a separate Docker container. Communication happens via:

1. **HTTP API** - For flow CRUD operations
2. **Embedded iframe** - For canvas display
3. **WebSocket** - For streaming chat responses

## Project Structure

```
LangflowSaaS/
├── src/
│   ├── frontend/              # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/    # Reusable React components
│   │   │   ├── pages/         # Page components
│   │   │   ├── services/      # API client
│   │   │   ├── lib/           # Utilities
│   │   │   └── App.tsx        # Main routing
│   │   └── package.json
│   │
│   └── backend/               # FastAPI backend
│       ├── app/
│       │   ├── api/           # 21 API routers
│       │   ├── models/        # 18 SQLAlchemy models
│       │   ├── schemas/       # Pydantic schemas
│       │   ├── services/      # 20 service files
│       │   └── middleware/    # Auth, CORS, rate limiting
│       ├── templates/         # Langflow flow templates
│       └── requirements.txt
│
├── docker-compose.yml         # Development setup
├── docker-compose.prod.yml    # Production setup
└── docs/                      # Internal documentation
```

## Data Flow

### Creating an Agent

```
1. User fills Q&A wizard → Frontend validates input
2. POST /api/v1/agent-components/create-from-qa
3. Backend: Template mapping service generates flow
4. Backend: Creates flow in Langflow via API
5. Backend: Saves AgentComponent in PostgreSQL
6. Frontend: Redirects to Playground
```

### Chat Interaction

```
1. User sends message → Frontend displays typing indicator
2. POST /api/v1/workflows/{id}/chat (streaming)
3. Backend: Forwards to Langflow with conversation context
4. Langflow: Executes flow, calls Claude API
5. Backend: Streams tokens back via SSE
6. Frontend: Renders response in real-time
7. Backend: Saves conversation/messages to database
```

### Embedding Widget

```
1. Widget loads on external site
2. POST /api/v1/embed/{token}/chat
3. Backend: Validates embed token
4. Backend: Routes to appropriate agent
5. Same chat flow as above (no auth required)
```

## Security Model

- **Authentication:** Clerk JWT validation on all protected routes
- **Authorization:** User isolation via `user_id` on all database queries
- **Rate Limiting:** Redis-based per-IP and per-user limits
- **Input Validation:** Pydantic schemas on all requests
- **CORS:** Restricted to allowed origins
- **Embed Security:** Token-based access with domain restrictions

## Deployment

### Development
```bash
docker compose up -d        # Start PostgreSQL, Langflow, Redis
cd src/frontend && npm run dev  # Frontend on :3001
cd src/backend && uvicorn app.main:app --reload  # Backend on :8000
```

### Production
- Docker Compose with production config
- PostgreSQL (managed or containerized)
- Redis for caching
- Nginx for SSL termination
- Environment-based configuration

See [Self-Hosting Guide](/resources/developers/self-hosting) for complete deployment instructions.

## Next Steps

- [Authentication](/resources/developers/authentication) - How auth works
- [API Reference](/resources/developers/api-reference) - All 140+ endpoints
- [Langflow Integration](/resources/developers/langflow) - Deep dive into Langflow
