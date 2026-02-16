# TC Connector

**Teach Charlie AI MCP Connector** — bridges your Teach Charlie workflows to local AI agents like OpenClaw via the [Model Context Protocol](https://modelcontextprotocol.io/).

## How It Works

```
OpenClaw Agent (local)
    | stdio (MCP protocol)
TC Connector (this package)
    | HTTPS
Teach Charlie API (remote)
    | internal
Langflow (executes workflow)
```

1. You enable workflows as "skills" in Teach Charlie
2. TC Connector fetches those skills and exposes them as MCP tools
3. Your local AI agent (OpenClaw, Claude Code, etc.) can call those tools
4. The connector routes calls to Teach Charlie, which runs the workflow in Langflow

## Quick Start

### 1. Generate an MCP Token

Go to **Settings > OpenClaw Connection** in your Teach Charlie dashboard and click **Generate MCP Token**.

### 2. Add to OpenClaw

Add this to your `.mcp.json` (or OpenClaw MCP config):

```json
{
  "mcpServers": {
    "teach-charlie": {
      "command": "npx",
      "args": ["tc-connector", "--token", "tc_YOUR_TOKEN_HERE"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "teach-charlie": {
      "command": "tc-connector",
      "args": ["--token", "tc_YOUR_TOKEN_HERE"]
    }
  }
}
```

### 3. Restart OpenClaw

Restart OpenClaw and your Teach Charlie workflow skills will appear as available tools.

## Configuration

### CLI Flags

```
tc-connector [options]

Options:
  --token <token>     MCP bridge token (required)
  --api-url <url>     Teach Charlie API URL (default: https://app.teachcharlie.ai)
  --config <path>     Config file path (default: ~/.tc-connector/config.json)
  --setup             Interactive setup wizard
  --version, -v       Show version
  --help, -h          Show help
```

### Environment Variables

```bash
TC_TOKEN=tc_abc123...     # MCP bridge token
TC_API_URL=https://...    # API URL (optional)
```

### Config File

Create `~/.tc-connector/config.json`:

```json
{
  "token": "tc_abc123...",
  "apiUrl": "https://app.teachcharlie.ai"
}
```

## Development

```bash
cd tc-connector
npm install
npm run build
TC_TOKEN=your_token node bin/tc-connector.js
```

### Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector tc-connector --token your_token
```

## Requirements

- Node.js 18+
- A Teach Charlie account with at least one workflow skill enabled
