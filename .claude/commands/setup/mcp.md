# Command: /setup/mcp

Configure MCP (Model Context Protocol) servers for your project.

## Purpose
Set up MCP integrations for databases, browsers, APIs, and other services.

## Usage
```
/setup/mcp [service-name]
```

## What This Does
1. Detects your project type (webapp, backend, data app, etc)
2. Recommends relevant MCP servers:
   - Database (Postgres, SQLite, etc)
   - Browser automation
   - File system tools
   - API clients
3. Generates .mcp.json configuration
4. Provides installation instructions

## When to Use
- Initial project setup
- Adding new external integrations
- Troubleshooting MCP connections

## Arguments
- `service-name` (optional): specific service to configure (postgres, browser, etc)

## Output
- .mcp.json file with configuration
- Installation commands
- Testing steps

## Related Commands
- /setup/permissions - configure Claude Code permissions
- See docs/MCP_GUIDE.md for detailed MCP documentation
