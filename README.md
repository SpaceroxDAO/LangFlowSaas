# Claude Code Universal Starter

A production-ready, project-agnostic starter template for Claude Code with a minimal CORE and optional PACKS architecture.

## Philosophy

- **CORE stays small and stable**: 10 commands, 5 agents, 3 hooks
- **PACKS provide specialization**: Install only what you need
- **No project-specific code**: Generic and reusable across any project type
- **Proven patterns**: Adapted from 8+ upstream Claude Code repositories

## Quick Start

```bash
# Clone or copy this starter
git clone <this-repo> my-project
cd my-project

# Bootstrap the project
./scripts/bootstrap.sh

# Check environment
/ops/doctor

# Optional: Enable packs for your stack
./scripts/enable-pack.sh webapp        # For frontend projects
./scripts/enable-pack.sh backend-python # For Python backends
./scripts/enable-pack.sh db-postgres   # For PostgreSQL projects
```

## What's Included

### CORE (Always Enabled)

**Commands (10)**:
- `/plan/spec` - Create project specification
- `/plan/issues` - Break down into tasks
- `/setup/mcp` - Configure MCP servers
- `/setup/permissions` - Configure permissions
- `/build/feature` - Build a complete feature
- `/build/test` - Run tests and fix failures
- `/docs/update` - Update documentation
- `/ops/worktree-new` - Create git worktree
- `/ops/worktree-clean` - Remove git worktrees
- `/ops/doctor` - Diagnose environment

**Agents (5)**:
- `core-architect` - Design architecture
- `core-implementer` - Write code
- `core-reviewer` - Review code
- `core-security` - Security audits
- `core-docs` - Documentation

**Hooks (3)**:
- `pre-tool-use` - Safety warnings
- `post-edit` - Auto-format (if tools exist)
- `pre-commit` - Run tests before commit

### PACKS (Optional)

| Pack | Description |
|------|-------------|
| `core-workflows` | PSB workflow integration |
| `webapp` | Frontend development tools |
| `backend-python` | Python backend utilities |
| `db-postgres` | PostgreSQL integration |
| `browser-testing` | E2E testing with Playwright |
| `session-tooling` | Session management |
| `skills-advanced` | Advanced commands |
| `subagents-library` | 20+ specialized agents |
| `lsp` | LSP integration templates |

## Documentation

Comprehensive guides in `docs/`:

- **[Workflows](docs/WORKFLOWS.md)** - PSB workflow, single-feature, multi-agent patterns
- **[Permissions & Hooks](docs/PERMISSIONS_AND_HOOKS.md)** - Configure safety and automation
- **[MCP Guide](docs/MCP_GUIDE.md)** - Database, browser, and service integrations
- **[Plugins & Packs](docs/PLUGINS_AND_PACKS.md)** - Extend functionality
- **[IDE Setup](docs/IDE_SETUP.md)** - VS Code, Cursor, JetBrains, Vim

## Project Templates

Use bootstrap to initialize project-specific docs:

```bash
./scripts/bootstrap.sh
```

Creates:
- `docs/00_PROJECT_SPEC.md` - Product & engineering requirements
- `docs/01_ARCHITECTURE.md` - Technical architecture
- `docs/02_CHANGELOG.md` - Release history
- `docs/03_STATUS.md` - Current project status

## Workflows

### PSB Workflow (Plan → Setup → Build)

```bash
# 1. Plan
/plan/spec              # Define requirements
/plan/issues            # Break into tasks

# 2. Setup
/setup/mcp              # Configure integrations
/setup/permissions      # Set permissions

# 3. Build
/build/feature [name]   # Implement feature
/build/test             # Verify with tests
/docs/update            # Update documentation
```

### Single Feature Workflow

```bash
# Quick feature implementation
/build/feature "add user authentication"

# Review and test
/build/test

# Update docs and commit
/docs/update
```

### Multi-Agent Worktree Workflow

```bash
# Create parallel workspaces
/ops/worktree-new feature-a
/ops/worktree-new feature-b

# Work on multiple features simultaneously
# Each worktree has independent file state

# Clean up when done
/ops/worktree-clean feature-a
```

## Pack Management

```bash
# List available packs
ls packs/

# View pack documentation
cat packs/webapp/README.md

# Enable a pack
./scripts/enable-pack.sh webapp

# Verify installation
/ops/doctor
```

## MCP Integration

Example `.mcp.json` configuration:

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

See `.mcp.json.example` and `docs/MCP_GUIDE.md` for details.

## Hooks Configuration

### Safe Mode (Default)
Hooks warn but don't block:

```json
{
  "features": {
    "strictHooks": false,
    "autoFormat": false
  }
}
```

### Strict Mode
Hooks block on failures (recommended for production):

```json
{
  "features": {
    "strictHooks": true,
    "autoFormat": true
  }
}
```

Configure in `.claude/settings.local.json`.

## Scripts

| Script | Purpose |
|--------|---------|
| `bootstrap.sh` | Initialize project from templates |
| `enable-pack.sh` | Enable optional packs |
| `doctor.sh` | Diagnose environment |
| `smoke.sh` | Validate structure |
| `worktree-new.sh` | Create git worktree |
| `worktree-clean.sh` | Remove git worktrees |
| `update-upstreams.sh` | Check/update upstream sources |

All scripts have PowerShell (.ps1) versions for Windows.

## Local Marketplace

Browse and install plugins from the local marketplace:

```bash
# Add marketplace
claude plugins add-marketplace ./marketplaces/local-marketplace

# Browse plugins
claude plugins search

# Install plugin
claude plugins install core-workflows
```

## Upstream Attribution

This starter adapts content from 8 upstream repositories (see `upstreams.lock.json`):

- [claude-starter-kit](https://github.com/serpro69/claude-starter-kit) - Patterns
- [cclsp](https://github.com/ktnyt/cclsp) - LSP integration
- [claude-code-tools](https://github.com/pchalasani/claude-code-tools) - Session tools
- [raintree-claude-starter](https://github.com/Raintree-Technology/claude-starter) - Skills library
- [wshobson/agents](https://github.com/wshobson/agents) - Agent patterns
- [claude-marketplace](https://github.com/claude-market/marketplace) - Marketplace structure
- [compound-engineering](https://github.com/EveryInc/compound-engineering-plugin) - Workflows
- [claude-plugins-official](https://github.com/anthropics/claude-plugins-official) - Conventions

All upstream commits are pinned in `upstreams.lock.json` for reproducibility.

## Project Structure

```
claude-code-universal-starter/
├─ .claude/                 # CORE configuration
│  ├─ agents/              # 5 core agents
│  ├─ commands/            # 10 core commands
│  ├─ hooks/               # 3 core hooks
│  ├─ settings.json        # Default settings
│  └─ settings.local.json.example
├─ docs/                   # Documentation
│  ├─ 00_PROJECT_SPEC.template.md
│  ├─ 01_ARCHITECTURE.template.md
│  ├─ 02_CHANGELOG.template.md
│  ├─ 03_STATUS.template.md
│  ├─ WORKFLOWS.md
│  ├─ PERMISSIONS_AND_HOOKS.md
│  ├─ MCP_GUIDE.md
│  ├─ PLUGINS_AND_PACKS.md
│  └─ IDE_SETUP.md
├─ scripts/                # Utility scripts
├─ packs/                  # Optional packs
├─ marketplaces/           # Local plugin marketplace
├─ .vscode/                # VS Code configuration
├─ upstreams.lock.json     # Upstream commit SHAs
├─ .mcp.json.example       # MCP configuration template
└─ .worktreeinclude        # Worktree shared files

```

## Health Checks

```bash
# Full environment diagnostic
/ops/doctor

# Validate repository structure
./scripts/smoke.sh

# Check for upstream updates
./scripts/update-upstreams.sh check
```

## Best Practices

### Do's
- ✅ Run `/ops/doctor` after setup and changes
- ✅ Use worktrees for parallel feature development
- ✅ Enable only the packs you need
- ✅ Review pack code before enabling
- ✅ Keep `strictHooks: false` during development
- ✅ Enable `strictHooks: true` for production

### Don'ts
- ❌ Don't modify CORE files directly (use packs)
- ❌ Don't commit secrets in `.mcp.json` or `.env`
- ❌ Don't install all packs at once
- ❌ Don't skip the bootstrap step
- ❌ Don't delete `upstreams.lock.json`

## Troubleshooting

### Setup Issues
```bash
# Re-run bootstrap
./scripts/bootstrap.sh

# Check environment
/ops/doctor

# Validate structure
./scripts/smoke.sh
```

### Pack Issues
```bash
# List what's installed
ls .claude/commands/ .claude/agents/ .claude/hooks/

# Re-enable pack
./scripts/enable-pack.sh [pack-name]
```

### Hook Issues
```bash
# Disable hooks temporarily
# In .claude/settings.local.json:
{"hooks": {"enabled": false}}

# Or disable strict mode
{"features": {"strictHooks": false}}
```

## Contributing

To add new packs or improve existing ones:

1. Fork this repository
2. Create new pack in `packs/my-pack/`
3. Test with `./scripts/enable-pack.sh my-pack`
4. Document in pack's README.md
5. Submit pull request

## License

MIT License - feel free to use this starter for any project.

## Support

- Documentation: `docs/` directory
- Issues: File an issue in this repository
- Upstream sources: See `upstreams.lock.json`

---

Built with ❤️ using patterns from the Claude Code community.
