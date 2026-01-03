# Available Packs

This directory contains optional packs that extend Claude Code functionality.

## Philosophy

- **CORE stays minimal**: Only essential commands, agents, and hooks
- **Packs provide specialization**: Domain-specific tools as needed
- **Everything is optional**: Install only what you need

## Available Packs

| Pack | Description | Use When |
|------|-------------|----------|
| **core-workflows** | PSB workflow integration | Structured development processes |
| **webapp** | Frontend development tools | Building web UIs |
| **backend-python** | Python backend utilities | Python APIs/services |
| **db-postgres** | PostgreSQL integration | Working with PostgreSQL |
| **browser-testing** | Browser automation | E2E testing, web scraping |
| **session-tooling** | Session management | Advanced context tracking |
| **skills-advanced** | Advanced commands | Power user workflows |
| **subagents-library** | Specialized agents catalog | Domain-specific agents |
| **lsp** | LSP integration | Advanced IDE features |

## Installing a Pack

```bash
# View available packs
ls packs/

# Read pack documentation
cat packs/[pack-name]/README.md

# Enable a pack
./scripts/enable-pack.sh [pack-name]

# Verify installation
/ops/doctor
```

## Pack Structure

Each pack contains:
- `pack.json` - Manifest describing what the pack adds
- `README.md` - Documentation
- `.claude/` - Commands, agents, hooks to be installed

## Creating Custom Packs

See `docs/PLUGINS_AND_PACKS.md` for how to create your own packs.

## Upstream Sources

All pack content is adapted from upstream repositories listed in `upstreams.lock.json`.
