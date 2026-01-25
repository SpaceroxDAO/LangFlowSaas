# Composio Integration

[Composio](https://composio.dev) provides OAuth connections to 500+ apps. This guide explains how to use Composio integrations in Teach Charlie AI.

## Overview

Composio handles the complexity of OAuth authentication, allowing your agents to:

- Read/send emails (Gmail, Outlook)
- Manage calendars (Google Calendar, Outlook)
- Post to social media (Twitter, LinkedIn)
- Update CRMs (Salesforce, HubSpot)
- And 500+ more integrations

## How It Works

```
1. User initiates connection → Composio OAuth flow
2. User authorizes access → Tokens stored securely
3. Agent uses tool → Composio executes action
4. Results returned → Agent incorporates in response
```

## Setting Up Composio

### 1. Get API Key

1. Sign up at [composio.dev](https://composio.dev)
2. Create a project
3. Copy your API key

### 2. Configure in Teach Charlie AI

Add to your environment:

```env
COMPOSIO_API_KEY=your-api-key
```

Or set via the dashboard:

1. Go to **Settings → Integrations**
2. Find **Composio**
3. Enter your API key
4. Click **Save**

## Connecting Apps

### Via Dashboard

1. Go to **Settings → Connections**
2. Click **"Add Connection"**
3. Select the app (e.g., Gmail)
4. Click **"Connect"**
5. Complete the OAuth flow in popup
6. Connection appears in your list

### Via API

```http
POST /api/v1/connections/initiate
```

```json
{
  "app": "gmail",
  "redirect_url": "https://yourapp.com/callback"
}
```

Response:

```json
{
  "authorization_url": "https://accounts.google.com/o/oauth2/..."
}
```

After OAuth completes:

```http
POST /api/v1/connections/callback
```

```json
{
  "code": "auth-code-from-oauth",
  "state": "state-parameter"
}
```

## Available Apps

### Productivity

| App | Actions Available |
|-----|-------------------|
| Gmail | Send, read, search, label emails |
| Google Calendar | Create, update, delete events |
| Slack | Send messages, read channels |
| Notion | Create pages, update databases |
| Asana | Create tasks, update projects |
| Trello | Create cards, move lists |

### Business

| App | Actions Available |
|-----|-------------------|
| Salesforce | Create leads, update accounts |
| HubSpot | Manage contacts, deals |
| Stripe | List payments, create invoices |
| QuickBooks | Create invoices, expenses |
| Shopify | List orders, update products |

### Developer

| App | Actions Available |
|-----|-------------------|
| GitHub | Create issues, PRs, comments |
| GitLab | Manage repos, pipelines |
| Jira | Create tickets, update sprints |
| Linear | Create issues, update cycles |

### Communication

| App | Actions Available |
|-----|-------------------|
| Discord | Send messages, manage servers |
| Microsoft Teams | Send messages, create meetings |
| Zoom | Create meetings, list recordings |
| Twilio | Send SMS, make calls |

## Using in Agents

### Enable Tools

1. Open your agent settings
2. Go to **Tools** section
3. Enable connected apps
4. Select specific actions

### Example: Email Agent

```
Q&A Answers:
- Who: Email assistant for managing inbox
- Rules: Be helpful, never delete emails without confirmation
- Tricks: Gmail (read, send, search)

Agent can now:
- "What emails did I get today?"
- "Send a reply to John's email"
- "Search for emails about the project"
```

### Conversation Example

```
User: Send an email to sarah@example.com about our meeting tomorrow

Agent: I'll send that email now.
[Tool: gmail.send_email]
{
  "to": "sarah@example.com",
  "subject": "Meeting Tomorrow",
  "body": "Hi Sarah,\n\nJust confirming our meeting tomorrow..."
}

Done! I've sent the email to Sarah about tomorrow's meeting.
```

## API Reference

### List Connections

```http
GET /api/v1/connections
```

Response:

```json
{
  "connections": [
    {
      "id": "conn-uuid",
      "app": "gmail",
      "status": "active",
      "account": "user@gmail.com",
      "created_at": "2024-01-15T10:00:00Z",
      "expires_at": "2024-04-15T10:00:00Z"
    }
  ]
}
```

### Get Connection Details

```http
GET /api/v1/connections/{id}
```

### Refresh Connection

```http
POST /api/v1/connections/{id}/refresh
```

### Delete Connection

```http
DELETE /api/v1/connections/{id}
```

### List Available Apps

```http
GET /api/v1/connections/apps
```

### Get App Actions

```http
GET /api/v1/connections/apps/{app}/actions
```

## Composio SDK

For advanced integrations, use Composio's SDK directly:

### Python

```python
from composio import Composio

client = Composio(api_key="your-api-key")

# Execute an action
result = client.execute_action(
    action="gmail.send_email",
    params={
        "to": "recipient@example.com",
        "subject": "Hello",
        "body": "This is a test"
    },
    entity_id="user-connection-id"
)
```

### JavaScript

```javascript
import { Composio } from "composio-sdk";

const client = new Composio({ apiKey: "your-api-key" });

const result = await client.executeAction({
  action: "gmail.send_email",
  params: {
    to: "recipient@example.com",
    subject: "Hello",
    body: "This is a test"
  },
  entityId: "user-connection-id"
});
```

## Security

### Token Storage

- OAuth tokens stored encrypted
- Refresh tokens handled automatically
- Tokens never exposed to frontend

### Permissions

- Each connection has specific scopes
- Users control what access is granted
- Can revoke access anytime

### Action Confirmation

Enable confirmation for sensitive actions:

```json
{
  "tool_settings": {
    "gmail.send_email": {
      "require_confirmation": true
    },
    "gmail.delete_email": {
      "require_confirmation": true
    }
  }
}
```

## Best Practices

### 1. Minimal Permissions

Request only the scopes you need:

```python
# Good: Specific scopes
scopes = ["gmail.readonly", "gmail.send"]

# Bad: Full access
scopes = ["gmail.all"]
```

### 2. Handle Expiration

Tokens expire. Handle gracefully:

```python
try:
    result = await execute_action(...)
except TokenExpiredError:
    # Prompt user to reconnect
    return "Your Gmail connection has expired. Please reconnect."
```

### 3. Rate Limits

Respect app-specific rate limits:

| App | Typical Limit |
|-----|---------------|
| Gmail | 250 emails/day |
| Slack | 1 msg/sec |
| GitHub | 5000 reqs/hour |

### 4. Error Messages

Provide helpful errors:

```python
if error.code == "insufficient_permissions":
    return "I don't have permission to send emails. Please reconnect Gmail with send permissions."
```

## Troubleshooting

### Connection Fails

1. Check Composio API key is valid
2. Verify app is supported
3. Check OAuth redirect URL matches

### Actions Not Working

1. Verify connection is active
2. Check required permissions exist
3. Review Composio dashboard for errors

### Token Expired

1. Try automatic refresh first
2. If fails, prompt user to reconnect
3. Check connection expiration date

### Rate Limited

1. Implement exponential backoff
2. Queue actions for later
3. Notify user of delay

## Webhooks

Get notified when connections change:

```http
POST /api/v1/webhooks
```

```json
{
  "url": "https://yourapp.com/webhooks/composio",
  "events": [
    "connection.created",
    "connection.refreshed",
    "connection.expired",
    "connection.deleted"
  ]
}
```

---

For custom tool connections, see [MCP Protocol](/resources/developers/mcp-protocol).
