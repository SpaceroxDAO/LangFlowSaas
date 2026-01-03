# MCP (Model Context Protocol) Guide

This guide explains how to configure and use MCP servers with Claude Code.

## What is MCP?

MCP (Model Context Protocol) allows Claude Code to integrate with external services, databases, and tools. MCP servers provide:
- Database connections (Postgres, MySQL, SQLite)
- Browser automation
- File system operations
- API integrations
- Custom tool extensions

## Quick Start

### 1. Check Example Configuration
```bash
cat .mcp.json.example
```

### 2. Create Your MCP Configuration
```bash
cp .mcp.json.example .mcp.json
```

### 3. Configure MCP Interactively
```bash
/setup/mcp
```

### 4. Verify Configuration
```bash
/ops/doctor
```

---

## Configuration File

### Location
**File**: `.mcp.json` (in project root)
**Versioned**: Usually NO (add to .gitignore if contains secrets)
**Alternative**: Use environment variables for secrets

### Basic Structure
```json
{
  "mcpServers": {
    "server-name": {
      "command": "command-to-run",
      "args": ["arg1", "arg2"],
      "env": {
        "ENV_VAR": "value"
      }
    }
  }
}
```

---

## Common MCP Servers

### PostgreSQL Database
**Use case**: Database operations, queries, schema management

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://user:password@localhost:5432/dbname"
      ]
    }
  }
}
```

**With environment variable**:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres"
      ],
      "env": {
        "POSTGRES_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

### Browser Automation (Playwright)
**Use case**: Web scraping, testing, automation

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-playwright"
      ]
    }
  }
}
```

### File System Operations
**Use case**: Advanced file operations, search

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    }
  }
}
```

### SQLite Database
**Use case**: Local database, embedded DB operations

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "/path/to/database.db"
      ]
    }
  }
}
```

### Git Operations
**Use case**: Advanced git operations

```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "/path/to/repo"
      ]
    }
  }
}
```

---

## Environment Variables

### Using .env Files
Create `.env` file (add to .gitignore):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
API_KEY=your-secret-key
BROWSER_HEADLESS=true
```

Reference in `.mcp.json`:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

### Shell Environment
Alternatively, set environment variables in your shell:
```bash
export DATABASE_URL="postgresql://localhost/mydb"
```

---

## Project-Specific Configurations

### Full-Stack Web App
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {"DATABASE_URL": "${DATABASE_URL}"}
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
  }
}
```

### Data Science / Python Backend
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "./data.db"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./data"]
    }
  }
}
```

### API Integration Project
```json
{
  "mcpServers": {
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "."]
    }
  }
}
```

---

## Custom MCP Servers

### Writing Your Own
Create a custom MCP server for project-specific tools:

**File**: `mcp-servers/custom-tool.js`
```javascript
#!/usr/bin/env node
// Custom MCP server implementation
// See: https://modelcontextprotocol.io/docs

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "custom-tool",
  version: "1.0.0"
});

// Implement your tools, resources, prompts
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "my-custom-tool",
        description: "Does something useful",
        inputSchema: {
          type: "object",
          properties: {
            param: { type: "string" }
          }
        }
      }
    ]
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

**Configure in .mcp.json**:
```json
{
  "mcpServers": {
    "custom": {
      "command": "node",
      "args": ["./mcp-servers/custom-tool.js"]
    }
  }
}
```

---

## Troubleshooting

### MCP Server Won't Start
**Symptoms**: Error messages about server connection

**Check**:
1. Server command is installed: `which npx` or `which node`
2. Path is correct in configuration
3. Environment variables are set
4. Check logs: `/ops/doctor`

**Fix**:
```bash
# Install missing tools
npm install -g @modelcontextprotocol/server-postgres

# Test server manually
npx @modelcontextprotocol/server-postgres "postgresql://localhost/test"
```

### Connection Refused
**Symptoms**: Database/service connection errors

**Check**:
1. Service is running (database, API, etc)
2. Connection string is correct
3. Credentials are valid
4. Firewall/network allows connection

**Fix**:
```bash
# Test database connection
psql postgresql://user:password@localhost:5432/dbname

# Check if service is running
docker ps  # if using Docker
pg_isready  # for PostgreSQL
```

### Permission Denied
**Symptoms**: MCP server can't access files/directories

**Check**:
1. File paths are absolute or relative to project root
2. User has permission to access paths
3. Directories exist

**Fix**:
```bash
# Create missing directories
mkdir -p /path/to/directory

# Check permissions
ls -la /path/to/directory
```

### Environment Variables Not Loading
**Symptoms**: ${VAR_NAME} not substituted

**Check**:
1. `.env` file exists and is readable
2. Variables are exported in shell
3. Variable names match exactly (case-sensitive)

**Fix**:
```bash
# Load .env manually
export $(cat .env | xargs)

# Verify variables
echo $DATABASE_URL
```

---

## Security Best Practices

### Do's
- ✅ Use environment variables for secrets
- ✅ Add `.env` to .gitignore
- ✅ Limit filesystem server to specific directories
- ✅ Use read-only database users when possible
- ✅ Validate MCP server sources before using

### Don'ts
- ❌ Don't commit secrets in .mcp.json
- ❌ Don't give filesystem access to entire drive
- ❌ Don't use root database credentials
- ❌ Don't run untrusted MCP servers
- ❌ Don't expose MCP servers to network

---

## Testing MCP Configuration

### Quick Test
```bash
# Run doctor command
/ops/doctor

# Should show:
# ✅ MCP servers configured: 2
# ✅ postgres: Connected
# ✅ playwright: Ready
```

### Manual Test
Test MCP server standalone:
```bash
# Test PostgreSQL MCP server
npx @modelcontextprotocol/server-postgres "postgresql://localhost/testdb"

# Should start and wait for input
# Press Ctrl+C to exit
```

### Integration Test
Ask Claude to use MCP:
```
User: Can you connect to the database and show me the users table schema?

Claude: [Uses postgres MCP server to query database]
```

---

## Pack-Provided MCP Configurations

Some packs include MCP server configurations:

### db-postgres Pack
Adds ready-to-use PostgreSQL MCP configuration
```bash
./scripts/enable-pack.sh db-postgres
```

### browser-testing Pack
Adds Playwright MCP configuration
```bash
./scripts/enable-pack.sh browser-testing
```

### lsp Pack
Adds Language Server Protocol integration
```bash
./scripts/enable-pack.sh lsp
```

Check pack documentation:
```bash
cat packs/[pack-name]/README.md
```

---

## Advanced Configuration

### Multiple Database Connections
```json
{
  "mcpServers": {
    "postgres-prod": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {"DATABASE_URL": "${PROD_DATABASE_URL}"}
    },
    "postgres-dev": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {"DATABASE_URL": "${DEV_DATABASE_URL}"}
    }
  }
}
```

### Conditional Configuration
Use different configs per environment:
```bash
# Development
ln -s .mcp.dev.json .mcp.json

# Production
ln -s .mcp.prod.json .mcp.json
```

### Custom Arguments
Pass additional arguments to MCP servers:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "--connection-string", "${DATABASE_URL}",
        "--read-only",
        "--max-connections", "5"
      ]
    }
  }
}
```

---

## Resources

- [MCP Official Docs](https://modelcontextprotocol.io)
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Community MCP Servers](https://github.com/topics/mcp-server)

## Related

- `/setup/mcp` - Interactive MCP configuration
- `/ops/doctor` - Verify MCP server status
- See `docs/PLUGINS_AND_PACKS.md` for pack-provided MCP configs
