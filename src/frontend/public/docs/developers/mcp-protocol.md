# MCP Protocol

The Model Context Protocol (MCP) is an open standard for connecting AI agents to external tools and services. This guide covers implementing MCP servers for Teach Charlie AI.

## What is MCP?

MCP defines a standardized way for AI models to:

- Discover available tools
- Call tools with parameters
- Receive structured results
- Handle errors consistently

Think of it as a "USB standard" for AI tools—any MCP-compliant tool works with any MCP-compliant agent.

## Protocol Overview

```
┌─────────────────┐         ┌─────────────────┐
│   AI Agent      │  MCP    │   MCP Server    │
│  (Client)       │◄───────►│  (Your Service) │
└─────────────────┘         └─────────────────┘
        │                           │
        │ 1. List tools             │
        │──────────────────────────►│
        │         Tools manifest    │
        │◄──────────────────────────│
        │                           │
        │ 2. Call tool              │
        │──────────────────────────►│
        │         Tool result       │
        │◄──────────────────────────│
```

## MCP Server Structure

An MCP server exposes:

1. **Tools** - Actions the agent can perform
2. **Resources** - Data the agent can read
3. **Prompts** - Pre-configured prompt templates

## Implementing an MCP Server

### Basic Structure (Python)

```python
from mcp.server import Server
from mcp.types import Tool, Resource

server = Server("my-mcp-server")

@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="get_weather",
            description="Get current weather for a city",
            inputSchema={
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "City name"
                    }
                },
                "required": ["city"]
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "get_weather":
        city = arguments["city"]
        # Your implementation
        weather = await fetch_weather(city)
        return {"temperature": weather.temp, "conditions": weather.conditions}

    raise ValueError(f"Unknown tool: {name}")

if __name__ == "__main__":
    server.run()
```

### Basic Structure (Node.js)

```javascript
import { Server } from "@modelcontextprotocol/sdk/server";

const server = new Server({
  name: "my-mcp-server",
  version: "1.0.0"
});

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_weather",
      description: "Get current weather for a city",
      inputSchema: {
        type: "object",
        properties: {
          city: { type: "string", description: "City name" }
        },
        required: ["city"]
      }
    }
  ]
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_weather") {
    const weather = await fetchWeather(args.city);
    return {
      content: [
        { type: "text", text: JSON.stringify(weather) }
      ]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

server.listen();
```

## Protocol Messages

### List Tools

Request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_weather",
        "description": "Get current weather",
        "inputSchema": {
          "type": "object",
          "properties": {
            "city": {"type": "string"}
          }
        }
      }
    ]
  }
}
```

### Call Tool

Request:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "city": "San Francisco"
    }
  }
}
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"temperature\": 72, \"conditions\": \"sunny\"}"
      }
    ]
  }
}
```

## Tool Schema

### Input Schema (JSON Schema)

```json
{
  "type": "object",
  "properties": {
    "recipient": {
      "type": "string",
      "description": "Email address to send to"
    },
    "subject": {
      "type": "string",
      "description": "Email subject line"
    },
    "body": {
      "type": "string",
      "description": "Email body content"
    },
    "priority": {
      "type": "string",
      "enum": ["low", "normal", "high"],
      "default": "normal"
    }
  },
  "required": ["recipient", "subject", "body"]
}
```

### Output Content Types

| Type | Description | Example |
|------|-------------|---------|
| `text` | Plain text response | `{"type": "text", "text": "Done!"}` |
| `image` | Base64 image | `{"type": "image", "data": "...", "mimeType": "image/png"}` |
| `resource` | Reference to resource | `{"type": "resource", "uri": "file:///data.json"}` |

## Resources

Resources let agents access data:

```python
@server.list_resources()
async def list_resources():
    return [
        Resource(
            uri="crm://customers",
            name="Customer Database",
            description="Access to CRM customer records",
            mimeType="application/json"
        )
    ]

@server.read_resource()
async def read_resource(uri: str):
    if uri == "crm://customers":
        customers = await db.get_customers()
        return json.dumps(customers)
```

## Connecting to Teach Charlie AI

### Register Your Server

1. Go to **Dashboard → MCP Servers**
2. Click **"Add MCP Server"**
3. Enter details:

| Field | Description |
|-------|-------------|
| Name | Display name |
| URL | Server endpoint |
| Transport | HTTP or stdio |
| Auth | API key (if required) |

4. Click **"Test Connection"**
5. Save

### Using via API

```http
POST /api/v1/mcp-servers
```

```json
{
  "name": "Weather Service",
  "url": "https://mcp.myservice.com",
  "transport": "http",
  "api_key": "sk_xxx",
  "project_id": "project-uuid"
}
```

### Enable for Agents

1. Open agent settings
2. Go to **Tools** section
3. Find your MCP server
4. Enable desired tools

## Transport Options

### HTTP (Recommended)

Standard HTTP/HTTPS endpoint:

```python
# Server
from mcp.server.http import run_http_server

run_http_server(server, port=8080)
```

```json
// Connection config
{
  "transport": "http",
  "url": "https://mcp.example.com"
}
```

### Stdio

For local processes:

```python
# Server runs as subprocess
import sys
server.run(stdin=sys.stdin, stdout=sys.stdout)
```

```json
// Connection config
{
  "transport": "stdio",
  "command": "python",
  "args": ["mcp_server.py"]
}
```

### WebSocket

For real-time bidirectional:

```python
from mcp.server.websocket import run_websocket_server

run_websocket_server(server, port=8080)
```

## Authentication

### API Key

```python
@server.authenticate()
async def authenticate(request):
    api_key = request.headers.get("Authorization")
    if not api_key or api_key != f"Bearer {EXPECTED_KEY}":
        raise AuthenticationError("Invalid API key")
    return {"user_id": "authenticated-user"}
```

### OAuth

For user-specific data:

```python
@server.call_tool()
async def call_tool(name: str, arguments: dict, auth_context: dict):
    user_token = auth_context.get("access_token")
    # Use user's token for API calls
    return await execute_with_token(name, arguments, user_token)
```

## Error Handling

### Standard Errors

```python
from mcp.types import ErrorCode

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name not in TOOLS:
        raise McpError(
            ErrorCode.METHOD_NOT_FOUND,
            f"Tool not found: {name}"
        )

    try:
        return await execute_tool(name, arguments)
    except ValidationError as e:
        raise McpError(
            ErrorCode.INVALID_PARAMS,
            f"Invalid parameters: {e}"
        )
    except Exception as e:
        raise McpError(
            ErrorCode.INTERNAL_ERROR,
            f"Tool execution failed: {e}"
        )
```

### Error Codes

| Code | Meaning |
|------|---------|
| -32700 | Parse error |
| -32600 | Invalid request |
| -32601 | Method not found |
| -32602 | Invalid params |
| -32603 | Internal error |

## Examples

### Database Query Server

```python
server = Server("database-mcp")

@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="query",
            description="Execute SQL query",
            inputSchema={
                "type": "object",
                "properties": {
                    "sql": {"type": "string"},
                    "params": {"type": "array"}
                },
                "required": ["sql"]
            }
        ),
        Tool(
            name="list_tables",
            description="List all database tables",
            inputSchema={"type": "object"}
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "query":
        result = await db.execute(
            arguments["sql"],
            arguments.get("params", [])
        )
        return {"rows": result}

    if name == "list_tables":
        tables = await db.list_tables()
        return {"tables": tables}
```

### File System Server

```python
server = Server("filesystem-mcp")

@server.list_resources()
async def list_resources():
    files = os.listdir(BASE_DIR)
    return [
        Resource(
            uri=f"file://{f}",
            name=f,
            mimeType=mimetypes.guess_type(f)[0]
        )
        for f in files
    ]

@server.read_resource()
async def read_resource(uri: str):
    path = uri.replace("file://", "")
    with open(os.path.join(BASE_DIR, path)) as f:
        return f.read()
```

## Testing

### Manual Testing

```bash
# Start server
python mcp_server.py

# Test with curl
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### Unit Testing

```python
import pytest
from mcp.testing import MockClient

@pytest.fixture
def client():
    return MockClient(server)

async def test_list_tools(client):
    result = await client.list_tools()
    assert len(result.tools) > 0

async def test_call_tool(client):
    result = await client.call_tool(
        "get_weather",
        {"city": "London"}
    )
    assert "temperature" in result
```

## Best Practices

1. **Clear descriptions** - Help the AI understand when to use each tool
2. **Strict schemas** - Validate inputs thoroughly
3. **Idempotent when possible** - Same call = same result
4. **Reasonable timeouts** - Don't block forever
5. **Rate limiting** - Protect your resources
6. **Logging** - Track all tool calls for debugging

---

See also: [Composio Integration](/resources/developers/composio) for pre-built connections.
