# Connecting Tools (MCP Servers)

MCP (Model Context Protocol) servers give Charlie superpowers! Connect external tools and services so Charlie can take actions, not just chat.

## What Are MCP Servers?

MCP is a protocol that lets AI agents connect to external tools. Think of MCP servers as "power-ups" for Charlie:

| Without MCP | With MCP |
|-------------|----------|
| "I can tell you about your calendar" | "I've scheduled your meeting for 3 PM" |
| "You could send an email..." | "Done! I've sent the email to John" |
| "Here's how to check the weather..." | "It's 72°F and sunny in San Francisco" |

## Available Integrations

### Composio (500+ Apps)

Through our Composio integration, Charlie can connect to:

**Productivity**
- Gmail, Outlook
- Google Calendar, Outlook Calendar
- Slack, Discord
- Notion, Asana, Trello

**Developer**
- GitHub, GitLab
- Jira, Linear
- AWS, GCP

**Business**
- Salesforce, HubSpot
- Stripe, QuickBooks
- Shopify, WooCommerce

**And many more!**

### Custom MCP Servers

Build your own connections for:
- Internal APIs
- Proprietary systems
- Custom databases
- Specialized tools

## Connecting via Composio

### Step 1: Enable Composio

1. Go to **Dashboard → Settings**
2. Find **"Integrations"** or **"Connections"**
3. Click **"Connect Composio"**

### Step 2: Choose Apps

1. Browse available apps
2. Click on the app you want to connect
3. Click **"Connect"**

### Step 3: Authorize

1. A popup will open for the app's login
2. Sign in to your account (Gmail, Slack, etc.)
3. Grant permissions
4. You'll be redirected back to Teach Charlie AI

### Step 4: Add to Agent

1. Open your agent settings
2. Find **"Tools"** or **"Actions"**
3. Enable the connected apps
4. Configure which actions are allowed

### Step 5: Test

In the Playground, try:
- "Send an email to john@example.com saying hello"
- "What's on my calendar tomorrow?"
- "Create a Slack message in #general"

## Configuring Tool Permissions

### Action-Level Control

Don't give Charlie unlimited access. Specify exactly what actions are allowed:

**Gmail Example:**
- ✅ Read emails
- ✅ Send emails
- ❌ Delete emails
- ❌ Create filters

**Calendar Example:**
- ✅ View events
- ✅ Create events
- ✅ Update events
- ❌ Delete events

### User Confirmation

Require approval before sensitive actions:

```
Tool Settings → "Require Confirmation"

Before Charlie sends an email, user will see:
"Charlie wants to send an email to john@example.com.
 Subject: Meeting Follow-up
 [Allow] [Deny]"
```

### Rate Limits

Prevent overuse:

- Max emails per hour: 10
- Max calendar events per day: 20
- Max API calls per minute: 60

## Custom MCP Servers

### What You Can Build

Custom MCP servers let Charlie connect to:

- Your company's internal API
- Custom databases
- Proprietary software
- Industry-specific tools

### Setting Up a Custom Server

1. Go to **MCP Servers** tab in your project
2. Click **"Add MCP Server"**
3. Enter server details:

| Field | Description | Example |
|-------|-------------|---------|
| Name | Display name | "Internal CRM" |
| URL | Server endpoint | "https://mcp.yourcompany.com" |
| API Key | Authentication | "sk_xxx..." |

4. Click **"Test Connection"**
5. Save

### Defining Tools

Each MCP server provides tools. Define what Charlie can do:

```json
{
  "name": "lookup_customer",
  "description": "Look up a customer by email",
  "parameters": {
    "email": {
      "type": "string",
      "description": "Customer email address"
    }
  }
}
```

## Best Practices

### Start with Read-Only

Begin with view/read permissions, then gradually add write access after testing.

### Use Descriptive Tool Names

Good: `send_support_email`
Bad: `tool1`

Charlie needs to understand what tools do!

### Limit Scope

Only enable tools the agent actually needs. A support agent doesn't need access to delete calendar events.

### Monitor Usage

Check analytics to see:
- Which tools are used most
- Any failed tool calls
- Unusual patterns

### Secure Credentials

- Never share API keys
- Use environment variables
- Rotate keys periodically

## Troubleshooting

### "Connection Failed" Error

**Causes:**
1. Wrong credentials
2. Server unreachable
3. Firewall blocking

**Solutions:**
1. Verify API key/OAuth credentials
2. Check server URL is correct
3. Test server is accessible from your network

### Charlie Doesn't Use Tools

**Causes:**
1. Tools not enabled for the agent
2. Instructions don't mention when to use tools
3. Tool descriptions are unclear

**Solutions:**
1. Verify tools are enabled in agent settings
2. Add instructions: "Use the calendar tool to check availability"
3. Write clear tool descriptions

### Tool Returns Errors

**Causes:**
1. Rate limit exceeded
2. Invalid parameters
3. Service outage

**Solutions:**
1. Check rate limit settings
2. Review tool call logs for parameter issues
3. Check the external service's status page

### Wrong Tool Selected

**Cause:** Charlie picks the wrong tool for the task.

**Solution:** Improve tool descriptions to be more specific:

```
Bad: "Send message"
Good: "Send a Slack message to a specific channel"
```

## Advanced: Building MCP Servers

For developers who want to create custom integrations:

### MCP Server Requirements

1. HTTP/HTTPS endpoint
2. JSON-RPC 2.0 protocol
3. Tool definitions following MCP spec
4. Proper error handling

### Example Server (Node.js)

```javascript
const express = require('express');
const app = express();

app.post('/mcp', (req, res) => {
  const { method, params } = req.body;

  if (method === 'tools/list') {
    return res.json({
      tools: [{
        name: 'get_weather',
        description: 'Get current weather for a city',
        inputSchema: {
          type: 'object',
          properties: {
            city: { type: 'string' }
          }
        }
      }]
    });
  }

  if (method === 'tools/call') {
    // Handle tool execution
  }
});
```

See [Developer Docs → MCP Protocol](/resources/developers/mcp-protocol) for full specification.

---

Finally, learn about [Plans & Billing](/resources/guides/billing) to understand feature availability!
