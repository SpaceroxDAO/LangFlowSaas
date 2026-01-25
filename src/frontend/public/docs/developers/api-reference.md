# API Reference

Teach Charlie AI provides 140+ API endpoints organized across 21 routers. All endpoints are RESTful and return JSON.

## Base URL

```
Production: https://api.teachcharlie.ai
Development: http://localhost:8000
```

## Authentication

All protected endpoints require a Bearer token:

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

See [Authentication](/resources/developers/authentication) for details.

---

## Core Resources

### Agent Components

Manage AI agents created through the Q&A wizard.

#### List Agent Components

```http
GET /api/v1/agent-components
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| project_id | string | Filter by project (optional) |
| limit | int | Max results (default: 50) |
| offset | int | Pagination offset |

**Response:**
```json
{
  "agent_components": [
    {
      "id": "uuid",
      "name": "Support Agent",
      "qa_who": "Customer support agent for...",
      "qa_rules": "Be friendly and helpful...",
      "qa_tricks": "Answer questions, search docs",
      "avatar_url": "/avatars/support.png",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### Create Agent from Q&A

```http
POST /api/v1/agent-components/create-from-qa
```

**Request Body:**
```json
{
  "name": "Support Agent",
  "qa_who": "A friendly customer support agent for Acme Corp",
  "qa_rules": "Always be helpful. Escalate billing issues.",
  "qa_tricks": "search_knowledge, send_email",
  "project_id": "uuid",
  "preset_id": "uuid"  // Optional: use a preset template
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Support Agent",
  "workflow_id": "uuid",
  "avatar_url": "/avatars/inferred-support.png",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### Get Agent Component

```http
GET /api/v1/agent-components/{id}
```

#### Update Agent Component

```http
PUT /api/v1/agent-components/{id}
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "qa_who": "Updated description...",
  "qa_rules": "Updated rules...",
  "qa_tricks": "Updated tools..."
}
```

#### Delete Agent Component

```http
DELETE /api/v1/agent-components/{id}
```

#### Publish Agent

```http
POST /api/v1/agent-components/{id}/publish
```

Publishes the agent as a reusable Langflow component.

#### Export Agent

```http
GET /api/v1/agent-components/{id}/export
```

Returns the agent configuration as downloadable JSON.

---

### Workflows

Workflows represent the Langflow flows behind agents.

#### List Workflows

```http
GET /api/v1/workflows
```

#### Get Workflow

```http
GET /api/v1/workflows/{id}
```

#### Chat with Workflow

```http
POST /api/v1/workflows/{id}/chat
```

**Request Body:**
```json
{
  "message": "Hello, I need help with...",
  "conversation_id": "uuid"  // Optional: continue conversation
}
```

**Response (Streaming):**

The response is Server-Sent Events (SSE):

```
data: {"token": "Hello"}
data: {"token": "!"}
data: {"token": " How"}
data: {"token": " can"}
data: {"done": true, "conversation_id": "uuid"}
```

#### Get Workflow Status

```http
GET /api/v1/workflows/{id}/status
```

---

### Projects

Organize agents and workflows into projects.

#### List Projects

```http
GET /api/v1/projects
```

#### Create Project

```http
POST /api/v1/projects
```

```json
{
  "name": "My Project"
}
```

#### Update Project

```http
PUT /api/v1/projects/{id}
```

#### Delete Project

```http
DELETE /api/v1/projects/{id}
```

---

### Knowledge Sources

Add documents and content for RAG.

#### List Knowledge Sources

```http
GET /api/v1/knowledge-sources
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| agent_id | string | Filter by agent |

#### Create Knowledge Source (Text)

```http
POST /api/v1/knowledge-sources
```

```json
{
  "name": "FAQ",
  "type": "text",
  "content": "Q: What are your hours?\nA: 9am-5pm",
  "agent_id": "uuid"
}
```

#### Upload Knowledge File

```http
POST /api/v1/knowledge-sources/upload
Content-Type: multipart/form-data
```

**Form Fields:**
- `file`: The file to upload (PDF, TXT, MD, DOCX, CSV)
- `agent_id`: Target agent UUID
- `name`: Display name (optional)

#### Fetch Knowledge from URL

```http
POST /api/v1/knowledge-sources/fetch-url
```

```json
{
  "url": "https://example.com/docs",
  "agent_id": "uuid",
  "name": "Product Docs"
}
```

#### Delete Knowledge Source

```http
DELETE /api/v1/knowledge-sources/{id}
```

---

### MCP Servers

Configure Model Context Protocol servers.

#### List MCP Servers

```http
GET /api/v1/mcp-servers
```

#### Create MCP Server

```http
POST /api/v1/mcp-servers
```

```json
{
  "name": "Internal CRM",
  "url": "https://mcp.company.com",
  "api_key": "sk_xxx",
  "project_id": "uuid"
}
```

#### Update MCP Server

```http
PUT /api/v1/mcp-servers/{id}
```

#### Delete MCP Server

```http
DELETE /api/v1/mcp-servers/{id}
```

#### Test Connection

```http
POST /api/v1/mcp-servers/{id}/test
```

---

### Connections (Composio)

OAuth connections for 500+ apps.

#### List Connections

```http
GET /api/v1/connections
```

#### Initiate Connection

```http
POST /api/v1/connections/initiate
```

```json
{
  "app": "gmail",
  "redirect_url": "https://yourapp.com/callback"
}
```

**Response:**
```json
{
  "authorization_url": "https://accounts.google.com/..."
}
```

#### Complete Connection

```http
POST /api/v1/connections/callback
```

#### Delete Connection

```http
DELETE /api/v1/connections/{id}
```

---

### Embed Widget

Public endpoints for embedded chat widget.

#### Get Widget Config

```http
GET /api/v1/embed/{token}/config
```

No authentication required. Returns widget styling and agent info.

#### Widget Chat

```http
POST /api/v1/embed/{token}/chat
```

No authentication required. Rate limited by IP.

```json
{
  "message": "Hello!",
  "session_id": "string"
}
```

---

### Billing

Subscription and payment management.

#### Get Subscription

```http
GET /api/v1/billing/subscription
```

**Response:**
```json
{
  "plan": "pro",
  "status": "active",
  "current_period_end": "2024-02-15T00:00:00Z",
  "usage": {
    "messages": 1234,
    "messages_limit": 5000,
    "agents": 5,
    "agents_limit": 10
  }
}
```

#### Create Checkout Session

```http
POST /api/v1/billing/checkout
```

```json
{
  "plan": "pro",
  "interval": "monthly"
}
```

#### Create Portal Session

```http
POST /api/v1/billing/portal
```

Returns a Stripe Customer Portal URL for subscription management.

#### Get Invoices

```http
GET /api/v1/billing/invoices
```

---

### Missions

Learning missions and guided tutorials.

#### List Missions

```http
GET /api/v1/missions
```

#### Get Mission Progress

```http
GET /api/v1/missions/{id}/progress
```

#### Complete Mission Step

```http
POST /api/v1/missions/{id}/steps/{step_id}/complete
```

---

### Analytics

Usage metrics and conversation analytics.

#### Get Analytics Summary

```http
GET /api/v1/analytics/summary
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| start_date | string | ISO date (YYYY-MM-DD) |
| end_date | string | ISO date (YYYY-MM-DD) |
| agent_id | string | Filter by agent |

**Response:**
```json
{
  "total_conversations": 150,
  "total_messages": 1234,
  "average_messages_per_conversation": 8.2,
  "daily_breakdown": [
    {"date": "2024-01-15", "conversations": 50, "messages": 400}
  ]
}
```

---

### Files

User file management.

#### List Files

```http
GET /api/v1/files
```

#### Upload File

```http
POST /api/v1/files
Content-Type: multipart/form-data
```

#### Delete File

```http
DELETE /api/v1/files/{id}
```

---

### Health

System health check.

#### Health Check

```http
GET /health
```

No authentication required.

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "langflow": "connected",
    "redis": "connected"
  }
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "detail": "Error message here",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | BAD_REQUEST | Invalid request body or parameters |
| 401 | UNAUTHORIZED | Missing or invalid auth token |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource doesn't exist |
| 409 | CONFLICT | Resource already exists |
| 422 | VALIDATION_ERROR | Request validation failed |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

---

## Rate Limits

| Plan | Requests/minute | Requests/day |
|------|-----------------|--------------|
| Free | 30 | 1,000 |
| Pro | 120 | 10,000 |
| Team | 300 | 50,000 |

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 115
X-RateLimit-Reset: 1705315200
```

---

## Pagination

List endpoints support pagination:

```http
GET /api/v1/agent-components?limit=20&offset=40
```

Response includes total count:

```json
{
  "items": [...],
  "total": 150,
  "limit": 20,
  "offset": 40
}
```

---

## Webhooks

See [Webhooks](/resources/developers/webhooks) for event notifications.
