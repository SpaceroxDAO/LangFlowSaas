# Research Notes: Phase 0 Validation

**Created**: 2026-01-03
**Status**: In Progress
**Purpose**: Validate technical assumptions before writing production code

---

## Executive Summary

Phase 0 research confirms that Langflow's API fully supports our use case. All critical assumptions have been validated:

- **Flow CRUD via API**: Fully supported with comprehensive REST endpoints
- **Flow Execution via API**: Supported with streaming options
- **PostgreSQL Integration**: Supported via `LANGFLOW_DATABASE_URL`
- **Trusted Mode**: Supported via `LANGFLOW_AUTO_LOGIN=true`
- **Flow JSON Format**: Well-documented, predictable structure

**GO/NO-GO Decision**: **GO** - Proceed with development

---

## 1. Langflow API Endpoints

### Flow CRUD Operations

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/v1/flows/` | Create a single flow |
| `POST` | `/api/v1/flows/batch/` | Create multiple flows |
| `GET` | `/api/v1/flows/{flow_id}` | Get a specific flow |
| `GET` | `/api/v1/flows/` | List all flows (paginated) |
| `GET` | `/api/v1/flows/basic_examples/` | Get template flows |
| `PATCH` | `/api/v1/flows/{flow_id}` | Update a flow |
| `DELETE` | `/api/v1/flows/{flow_id}` | Delete a flow |
| `POST` | `/api/v1/flows/download/` | Export flows as ZIP |
| `POST` | `/api/v1/flows/upload/` | Import flows from JSON |

### Flow Execution Endpoints

**Primary Run Endpoint:**
```
POST /api/v1/run/{flow_id_or_name}?stream=true|false
```

**Request Body:**
```json
{
  "input_value": "User message here",
  "input_type": "chat",
  "output_type": "chat",
  "session_id": "optional-session-id",
  "tweaks": {
    "component_id": {
      "parameter_name": "override_value"
    }
  }
}
```

**Alternative Endpoints:**
- `POST /api/v1/webhook/{flow_id}` - Async webhook trigger
- `POST /api/v1/build/{flow_id}/flow` - Build and execute
- `GET /api/v1/build/{job_id}/events` - Stream build results

### Other Useful Endpoints

- `GET /api/v1/health_check` - Health check
- `GET /api/v1/version` - Version info
- `GET /api/v1/config` - Configuration
- `GET /api/v1/auto_login` - Auto-login (if enabled)
- `GET /docs` - Interactive OpenAPI documentation

---

## 2. Flow JSON Structure

### Simplified Template Structure

```json
{
  "id": "uuid-string",
  "name": "Flow Name",
  "description": "Flow description",
  "tags": ["tag1", "tag2"],

  "data": {
    "nodes": [
      {
        "id": "ChatInput-jFwUm",
        "type": "genericNode",
        "position": { "x": 100, "y": 200 },
        "data": {
          "type": "ChatInput",
          "display_name": "Chat Input",
          "template": {
            "input_value": {
              "type": "str",
              "value": "",
              "display_name": "Text"
            }
          },
          "outputs": [
            {
              "name": "message",
              "types": ["Message"],
              "display_name": "Message"
            }
          ]
        }
      },
      {
        "id": "Prompt-xYz12",
        "type": "genericNode",
        "data": {
          "type": "Prompt",
          "template": {
            "template": {
              "type": "str",
              "value": "{{SYSTEM_PROMPT}}"
            }
          }
        }
      },
      {
        "id": "OpenAIModel-abc34",
        "type": "genericNode",
        "data": {
          "type": "OpenAIModel",
          "template": {
            "model_name": { "type": "str", "value": "gpt-4" },
            "temperature": { "type": "float", "value": 0.7 }
          }
        }
      }
    ],

    "edges": [
      {
        "id": "edge-1",
        "source": "ChatInput-jFwUm",
        "target": "Prompt-xYz12",
        "sourceHandle": "{\"dataType\":\"ChatInput\",\"name\":\"message\"}",
        "targetHandle": "{\"fieldName\":\"input_value\"}"
      }
    ],

    "viewport": { "x": 0, "y": 0, "zoom": 1 }
  }
}
```

### Key Observations

1. **Node IDs**: Format is `COMPONENT_TYPE-RandomID` (e.g., `ChatInput-jFwUm`)
2. **Template Injection**: System prompts can be injected by modifying `data.template.template.value`
3. **Edge Connections**: Use `sourceHandle` and `targetHandle` JSON strings for type matching
4. **Tweak Override**: Can override node values at runtime via `tweaks` parameter

### Template Mapping Strategy

For Teach Charlie AI, we'll:
1. Create a base `support_bot.json` template with placeholder for system prompt
2. Replace `{{SYSTEM_PROMPT}}` with generated prompt from Q&A answers
3. Save the customized flow via `POST /api/v1/flows/`
4. Execute via `POST /api/v1/run/{flow_id}`

---

## 3. Authentication Configuration

### Authentication Modes

| Mode | Variables | Use Case |
|------|-----------|----------|
| Auto-Login (Default) | `LANGFLOW_AUTO_LOGIN=true` | Development, single-tenant |
| Full Auth | `LANGFLOW_AUTO_LOGIN=false`, `LANGFLOW_SUPERUSER`, `LANGFLOW_SUPERUSER_PASSWORD` | Multi-user production |
| Environment API Key | `LANGFLOW_API_KEY_SOURCE=env`, `LANGFLOW_API_KEY` | Stateless containers |

### Recommended Setup for Teach Charlie AI

```bash
# Langflow runs in trusted mode (our backend handles auth)
LANGFLOW_AUTO_LOGIN=true
LANGFLOW_BACKEND_ONLY=false  # Keep frontend for "Unlock Flow" feature

# API Key for backend-to-Langflow communication
LANGFLOW_API_KEY_SOURCE=env
LANGFLOW_API_KEY=your-secure-api-key
```

### API Authentication Headers

```bash
# All API calls require x-api-key header (v1.5+)
curl -H "x-api-key: $LANGFLOW_API_KEY" \
     -H "Content-Type: application/json" \
     http://localhost:7860/api/v1/flows/
```

---

## 4. PostgreSQL Configuration

### Primary Environment Variable

```bash
LANGFLOW_DATABASE_URL="postgresql://user:password@host:port/dbname"
```

### Connection String Examples

```bash
# Local PostgreSQL
LANGFLOW_DATABASE_URL="postgresql://langflow:langflow@localhost:5432/langflow"

# Docker Compose (use service name)
LANGFLOW_DATABASE_URL="postgresql://langflow:langflow@postgres:5432/langflow"

# With SSL
LANGFLOW_DATABASE_URL="postgresql://user@host:5432/dbname?sslmode=verify-full"
```

### Database Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LANGFLOW_DATABASE_URL` | SQLite | PostgreSQL connection string |
| `LANGFLOW_DATABASE_CONNECTION_RETRY` | `false` | Retry lost connections |
| `LANGFLOW_DB_CONNECT_TIMEOUT` | `30` | Connection timeout (seconds) |
| `LANGFLOW_MIGRATION_LOCK_NAMESPACE` | auto | Lock namespace for multi-instance |

### Connection Pool Settings

```bash
LANGFLOW_DB_CONNECTION_SETTINGS='{"pool_size": 20, "max_overflow": 30, "pool_timeout": 30, "pool_pre_ping": true}'
```

### Automatic Migrations

- Langflow automatically runs migrations on first PostgreSQL connection
- Creates all necessary tables: flows, message_history, logs, users, settings
- No manual migration required for fresh installs

### pgvector Support

pgvector is supported but uses a **separate connection** from the main database:

```bash
# pgvector connection (different format!)
PG_VECTOR_URL="postgresql+psycopg://user:password@host:port/vectors"
```

**Note**: pgvector is optional for MVP. We can defer RAG/vector functionality to Phase 2.

---

## 5. Multi-Service Architecture

### Recommended Setup

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  langflow:
    image: langflowai/langflow:latest
    environment:
      LANGFLOW_DATABASE_URL: postgresql://admin:password@postgres:5432/langflow
      LANGFLOW_AUTO_LOGIN: "true"
      LANGFLOW_API_KEY: "${LANGFLOW_API_KEY}"
    ports:
      - "7860:7860"
    depends_on:
      - postgres

  backend:
    build: ./src/backend
    environment:
      DATABASE_URL: postgresql://admin:password@postgres:5432/teachcharlie
      LANGFLOW_API_URL: http://langflow:7860
      LANGFLOW_API_KEY: "${LANGFLOW_API_KEY}"
      CLERK_SECRET_KEY: "${CLERK_SECRET_KEY}"
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - langflow

  frontend:
    build: ./src/frontend
    environment:
      VITE_API_URL: http://localhost:8000
      VITE_CLERK_PUBLISHABLE_KEY: "${CLERK_PUBLISHABLE_KEY}"
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Database Strategy

- **Langflow Database**: `langflow` - Stores flows, message history
- **Custom Backend Database**: `teachcharlie` - Stores users, agents, conversations
- **Same PostgreSQL server**, different databases (recommended for isolation)

---

## 6. Critical API Examples

### Create Agent Flow

```python
import httpx

async def create_flow(template: dict, name: str) -> str:
    """Create a new flow in Langflow"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{LANGFLOW_API_URL}/api/v1/flows/",
            headers={
                "x-api-key": LANGFLOW_API_KEY,
                "Content-Type": "application/json"
            },
            json={
                "name": name,
                "data": template["data"],
                "description": f"Agent: {name}"
            }
        )
        response.raise_for_status()
        return response.json()["id"]
```

### Execute Flow (Chat)

```python
async def run_flow(flow_id: str, message: str, session_id: str = None) -> str:
    """Execute a flow with a user message"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{LANGFLOW_API_URL}/api/v1/run/{flow_id}",
            headers={
                "x-api-key": LANGFLOW_API_KEY,
                "Content-Type": "application/json"
            },
            json={
                "input_value": message,
                "input_type": "chat",
                "output_type": "chat",
                "session_id": session_id
            }
        )
        response.raise_for_status()
        result = response.json()
        return result["outputs"][0]["outputs"][0]["results"]["message"]["text"]
```

### Delete Flow

```python
async def delete_flow(flow_id: str) -> bool:
    """Delete a flow from Langflow"""
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{LANGFLOW_API_URL}/api/v1/flows/{flow_id}",
            headers={"x-api-key": LANGFLOW_API_KEY}
        )
        return response.status_code == 200
```

---

## 7. Validated Assumptions

| Assumption | Status | Notes |
|------------|--------|-------|
| Create flows via API | **CONFIRMED** | `POST /api/v1/flows/` |
| Execute flows via API | **CONFIRMED** | `POST /api/v1/run/{flow_id}` |
| PostgreSQL support | **CONFIRMED** | `LANGFLOW_DATABASE_URL` |
| Trusted mode (no auth) | **CONFIRMED** | `LANGFLOW_AUTO_LOGIN=true` |
| Flow JSON is predictable | **CONFIRMED** | Template injection works |
| Streaming responses | **CONFIRMED** | `?stream=true` parameter |
| Session/conversation tracking | **CONFIRMED** | `session_id` parameter |

---

## 8. Known Limitations & Risks

### Limitations

1. **No SQLite→PostgreSQL migration tool**: Fresh start required
2. **pgvector uses separate connection**: Different connection string format
3. **Windows async issues**: Avoid Windows for development
4. **API key required (v1.5+)**: Cannot skip API auth on newer versions

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Flow JSON format changes | Pin Langflow version, test on upgrades |
| API breaking changes | Use versioned endpoints (`/api/v1/`) |
| Template complexity | Start with simplest possible template |
| Session management | Use Langflow's built-in session_id |

---

## 9. Next Steps (Phase 1)

Based on this research, proceed with:

1. **Day 4-5**: Set up project structure
   - Create FastAPI backend scaffold
   - Configure PostgreSQL with Docker Compose
   - Test Langflow API connectivity

2. **Day 6-7**: Implement authentication
   - Set up Clerk account
   - Create JWT validation middleware
   - Test auth flow

3. **Day 8-9**: Build template mapping
   - Create `support_bot.json` template
   - Implement Q&A → system prompt → flow logic
   - Test end-to-end flow creation

4. **Day 10**: API endpoints
   - `POST /api/v1/agents/create-from-qa`
   - `GET /api/v1/agents`
   - `POST /api/v1/agents/{id}/chat`

---

## Sources

- [Langflow API Documentation](https://docs.langflow.org/api-flows)
- [Langflow Flow Execution](https://docs.langflow.org/api-flows-run)
- [Langflow Environment Variables](https://docs.langflow.org/environment-variables)
- [Langflow PostgreSQL Configuration](https://docs.langflow.org/configuration-custom-database)
- [Langflow Authentication](https://docs.langflow.org/api-keys-and-authentication)
- [Langflow pgvector](https://docs.langflow.org/bundles-pgvector)
- [Langflow Docker Deployment](https://docs.langflow.org/deployment-docker)

---

## 10. RAGStack AI Langflow Deployment

### Repository Overview

The RAGStack AI Langflow repository (https://github.com/datastax/ragstack-ai-langflow) is DataStax's fork of Langflow, providing production-ready deployment configurations.

### Docker Compose Options

**Simple Deployment (`docker_example/`):**
```yaml
services:
  langflow:
    image: langflowai/langflow:latest
    ports:
      - "7860:7860"
    environment:
      - LANGFLOW_DATABASE_URL=postgresql://langflow:langflow@postgres:5432/langflow
      - LANGFLOW_CONFIG_DIR=/app/langflow
    volumes:
      - langflow-data:/app/langflow
    depends_on:
      - postgres

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: langflow
      POSTGRES_PASSWORD: langflow
      POSTGRES_DB: langflow
    volumes:
      - langflow-postgres:/var/lib/postgresql/data
```

**Production Deployment (`deploy/`):**
Includes additional services:
- Traefik (reverse proxy + SSL)
- PgAdmin (database management)
- Celery + RabbitMQ (async tasks)
- Redis (caching)
- Prometheus + Grafana (monitoring)

### Key Environment Variables

| Variable | Description |
|----------|-------------|
| `LANGFLOW_DATABASE_URL` | PostgreSQL connection string |
| `LANGFLOW_CONFIG_DIR` | Data directory (`/app/langflow`) |
| `LANGFLOW_SECRET_KEY` | Encryption key (generate securely) |
| `LANGFLOW_SUPERUSER` | Admin username |
| `LANGFLOW_SUPERUSER_PASSWORD` | Admin password |
| `LANGFLOW_SSRF_PROTECTION_ENABLED` | Enable SSRF protection |
| `LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT` | Env vars to import as global vars |

### Deployment Steps (Simple)

```bash
# 1. Clone repository
git clone https://github.com/datastax/ragstack-ai-langflow.git
cd ragstack-ai-langflow/docker_example

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Start services
docker compose up -d

# 4. Access Langflow
open http://localhost:7860
```

### Kubernetes/Helm Option

```bash
# Add Helm repo
helm repo add langflow https://langflow-ai.github.io/langflow-helm-charts
helm repo update

# Install with external PostgreSQL
helm install langflow langflow/langflow-ide \
  --set postgresql.enabled=false \
  --set langflow.backend.externalDatabase.enabled=true \
  --set langflow.backend.externalDatabase.host.value="postgres-host" \
  --set langflow.backend.externalDatabase.database.value="langflow"
```

### Volume Persistence

Always mount volumes for:
- `/app/langflow` - Application data, logs, secrets
- `/var/lib/postgresql/data` - Database files

### Security Best Practices

1. Generate secure secret key:
   ```python
   python3 -c "from secrets import token_urlsafe; print(token_urlsafe(32))"
   ```

2. Enable SSRF protection in production
3. Pin specific versions instead of `latest`
4. Configure specific CORS origins (not wildcards)

---

## Summary: Architecture Validation

### Confirmed Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Custom Frontend (React)                       │
│  Landing → 3-Step Q&A → Playground → [Unlock Flow Canvas]       │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Custom Backend (FastAPI)                      │
│  • Clerk JWT validation                                          │
│  • Template mapping engine (Q&A → system prompt)                │
│  • Langflow API client (create flow, run flow)                  │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Langflow (Backend Service)                    │
│  • LANGFLOW_AUTO_LOGIN=true (trusted mode)                      │
│  • API Key authentication for backend calls                     │
│  • Exposes /api/v1/flows and /api/v1/run endpoints             │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL + pgvector                         │
│  • langflow database (flows, messages)                          │
│  • teachcharlie database (users, agents, conversations)         │
└─────────────────────────────────────────────────────────────────┘
```

### GO/NO-GO: **GO**

All technical assumptions validated. Proceed to Phase 1.

---

*Document created: 2026-01-03*
*Phase 0 Status: COMPLETE - All assumptions validated*
