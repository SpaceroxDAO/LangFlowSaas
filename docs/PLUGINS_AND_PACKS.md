# Plugins and Packs Guide

This guide explains the plugin/pack system and how to extend Claude Code functionality.

## Overview

This starter uses a **CORE + PACKS** architecture:

- **CORE**: Small, stable foundation (10 commands, 5 agents, 3 hooks)
- **PACKS**: Optional, installable extensions for specific use cases
- **MARKETPLACE**: Local plugin marketplace for additional tools

## Philosophy

### Core Stays Minimal
Core functionality is intentionally limited to avoid bloat:
- Essential commands only
- Cross-project agents
- Conservative hooks

### Packs Provide Specialization
Packs add domain-specific functionality:
- Web development tools
- Backend/API utilities
- Database integrations
- Testing frameworks
- Advanced skills

### Everything is Optional
- Packs are disabled by default
- Install only what you need
- No hidden dependencies
- Easy to remove

---

## Available Packs

### core-workflows
**What it adds**: PSB workflow commands, retro-style improvement skill

**Use when**: Following structured development processes

**Contents**:
- Commands for plan/setup/build cycle
- Workflow templates
- Project templates

**Enable**:
```bash
./scripts/enable-pack.sh core-workflows
```

### webapp
**What it adds**: Frontend development tools

**Use when**: Building web UIs (React, Vue, Svelte, etc)

**Contents**:
- Frontend-specific commands
- Component generation agents
- UI testing helpers
- Bundle analysis tools

**Enable**:
```bash
./scripts/enable-pack.sh webapp
```

### backend-python
**What it adds**: Python backend tools

**Use when**: Building Python APIs, services

**Contents**:
- FastAPI/Flask helpers
- Python testing agents
- Virtual environment management
- Dependency management commands

**Enable**:
```bash
./scripts/enable-pack.sh backend-python
```

### db-postgres
**What it adds**: PostgreSQL integration

**Use when**: Working with PostgreSQL databases

**Contents**:
- Database schema commands
- Migration helpers
- Query optimization agents
- MCP PostgreSQL configuration

**Enable**:
```bash
./scripts/enable-pack.sh db-postgres
```

### browser-testing
**What it adds**: Browser automation and testing

**Use when**: E2E testing, web scraping

**Contents**:
- Playwright integration
- Test generation commands
- Visual regression helpers
- MCP browser configuration

**Enable**:
```bash
./scripts/enable-pack.sh browser-testing
```

### session-tooling
**What it adds**: Advanced session management

**Use when**: Need session persistence, context management

**Contents**:
- Session save/restore
- Context tracking
- Session templates
- Conversation management

**Enable**:
```bash
./scripts/enable-pack.sh session-tooling
```

### skills-advanced
**What it adds**: Curated advanced slash commands

**Use when**: Power user workflows

**Contents**:
- Advanced refactoring commands
- Code analysis skills
- Optimization helpers
- Security scanning

**Enable**:
```bash
./scripts/enable-pack.sh skills-advanced
```

### subagents-library
**What it adds**: Catalog of specialized agents

**Use when**: Need domain-specific agents

**Contents**:
- Catalog of 20+ specialized agents
- Agent templates
- Multi-agent coordination patterns

**Enable**:
```bash
./scripts/enable-pack.sh subagents-library
```

### lsp
**What it adds**: Language Server Protocol integration

**Use when**: Need advanced IDE features in Claude

**Contents**:
- LSP client configuration
- Code navigation helpers
- Refactoring tools
- Documentation templates

**Enable**:
```bash
./scripts/enable-pack.sh lsp
```

---

## Pack Management

### Discovering Packs
```bash
# List available packs
ls packs/

# Read pack documentation
cat packs/webapp/README.md
```

### Enabling a Pack
```bash
# Interactive mode
./scripts/enable-pack.sh

# Specific pack
./scripts/enable-pack.sh webapp

# Multiple packs
./scripts/enable-pack.sh webapp db-postgres browser-testing
```

### What Happens When Enabling
1. Script checks for conflicts with existing files
2. Copies pack's `.claude/` contents to root `.claude/`
3. Merges settings (pack settings don't override core)
4. Installs any pack-specific MCP configurations
5. Verifies installation with doctor script

### Checking Enabled Packs
```bash
/ops/doctor
```

Shows:
- Which packs are enabled
- Pack versions
- Any conflicts or issues

### Disabling a Pack
Packs can be removed, but it requires manual cleanup:
```bash
# 1. Review what the pack added
cat packs/webapp/pack.json

# 2. Manually remove those files from .claude/
rm .claude/commands/webapp-*
rm .claude/agents/frontend-*

# 3. Verify
/ops/doctor
```

> **Note**: Future versions may include `disable-pack.sh` for automatic removal.

---

## Pack Structure

### Standard Pack Layout
```
packs/pack-name/
├── pack.json                 # Manifest
├── README.md                 # Documentation
└── .claude/
    ├── commands/             # Additional commands
    │   └── custom-cmd.md
    ├── agents/               # Additional agents
    │   └── specialized-agent.md
    ├── hooks/                # Additional hooks
    │   └── custom-hook.sh
    └── settings-addon.json   # Settings to merge
```

### pack.json Format
```json
{
  "name": "webapp",
  "version": "1.0.0",
  "description": "Frontend development tools",
  "author": "Your Name",
  "dependencies": {
    "core": ">=1.0.0"
  },
  "adds": {
    "commands": ["frontend-build", "component-gen"],
    "agents": ["frontend-architect", "ui-reviewer"],
    "hooks": ["pre-build-frontend"]
  },
  "conflicts": [],
  "mcpServers": ["playwright"]
}
```

---

## Local Marketplace

### What is the Local Marketplace?
A plugin marketplace that runs entirely locally - no external dependencies.

**Location**: `marketplaces/local-marketplace/`

### Available Plugins

#### core-workflows Plugin
**What it includes**: PSB workflow integration

**Install from marketplace**:
```bash
# Add marketplace (if not already added)
claude plugins add ./marketplaces/local-marketplace

# Install plugin
claude plugins install core-workflows
```

#### lsp-pack Plugin
**What it includes**: LSP integration templates

**Install from marketplace**:
```bash
claude plugins install lsp-pack
```

### Using the Marketplace

#### Add Marketplace
```bash
# Add local marketplace
claude plugins add-marketplace ./marketplaces/local-marketplace

# Verify
claude plugins list-marketplaces
```

#### Browse Plugins
```bash
# List available plugins
claude plugins search

# Get plugin details
claude plugins info core-workflows
```

#### Install Plugin
```bash
# Install plugin
claude plugins install core-workflows

# Verify installation
claude plugins list
```

#### Update Plugin
```bash
# Update specific plugin
claude plugins update core-workflows

# Update all
claude plugins update-all
```

#### Uninstall Plugin
```bash
claude plugins uninstall core-workflows
```

---

## Creating Custom Packs

### 1. Create Pack Structure
```bash
mkdir -p packs/my-pack/.claude/{commands,agents,hooks}
```

### 2. Create pack.json
```json
{
  "name": "my-pack",
  "version": "1.0.0",
  "description": "My custom pack",
  "adds": {
    "commands": ["my-command"],
    "agents": [],
    "hooks": []
  }
}
```

### 3. Add Content
```bash
# Create a command
cat > packs/my-pack/.claude/commands/my-command.md <<'EOF'
# Command: /my-command

Does something useful.

## Usage
\`\`\`
/my-command [args]
\`\`\`
EOF
```

### 4. Create README
Document what your pack does and how to use it.

### 5. Test Pack
```bash
./scripts/enable-pack.sh my-pack
/ops/doctor
```

---

## Pack vs Plugin vs Marketplace

### Pack
- **Storage**: Local folder in `packs/`
- **Enable**: Copy files to `.claude/`
- **Scope**: Project-specific
- **Version control**: Usually committed to git
- **Best for**: Project utilities, team-shared tools

### Plugin
- **Storage**: Can be remote or local
- **Install**: Via Claude Code plugin system
- **Scope**: User or global
- **Version control**: Independent packages
- **Best for**: Reusable tools across projects

### Marketplace
- **Purpose**: Distribution mechanism for plugins
- **Types**: Local (this repo) or remote
- **Function**: Plugin discovery and installation
- **Best for**: Organizing multiple plugins

---

## Conflict Resolution

### What Happens on Conflict?
When enabling a pack that conflicts with existing files:

```bash
$ ./scripts/enable-pack.sh webapp
⚠️  Conflict detected:
- .claude/commands/build.md exists
- Pack wants to add .claude/commands/build.md

Options:
  [s]kip - Keep existing file
  [o]verwrite - Replace with pack version
  [r]ename - Rename pack version to build-webapp.md
  [a]bort - Cancel installation

Choice:
```

### Preventing Conflicts
Packs should use namespaced names:
- ✅ `webapp-build.md`
- ❌ `build.md`

---

## Best Practices

### Choosing Packs
- Start with CORE only
- Add packs as needs arise
- Don't install unused packs
- Review pack code before enabling

### Maintaining Packs
- Keep pack.json up to date
- Document breaking changes
- Version your packs
- Test after enabling

### Sharing Packs
- Document dependencies clearly
- Include setup instructions
- Provide examples
- List known issues

---

## Pack Development

### Testing During Development
```bash
# Enable pack in dev mode (symlink instead of copy)
./scripts/enable-pack.sh --dev my-pack

# Changes to pack immediately reflected
# Edit packs/my-pack/.claude/commands/test.md
# Run command immediately
/test
```

### Pack Quality Checklist
- [ ] pack.json is valid JSON
- [ ] README.md documents all features
- [ ] Commands have clear descriptions
- [ ] Agents have explicit constraints
- [ ] Hooks are safe by default
- [ ] No hardcoded paths or secrets
- [ ] Compatible with core version
- [ ] Tested with /ops/doctor

---

## Troubleshooting

### Pack Won't Enable
**Check**:
1. pack.json exists and is valid
2. No syntax errors in pack files
3. Permissions on pack directory
4. Run with --verbose flag

```bash
./scripts/enable-pack.sh --verbose my-pack
```

### Commands Not Appearing
**Check**:
1. Command files in correct location
2. Files have .md extension
3. Command structure matches CORE examples
4. No filename conflicts

### Hooks Not Running
**Check**:
1. Hook scripts are executable
2. Hook registered in pack's settings-addon.json
3. Hooks enabled in main settings.json
4. No syntax errors in hook script

### Conflicts After Enabling
**Fix**:
1. Disable pack
2. Resolve conflicts manually
3. Re-enable pack

---

## Resources

- Example packs: `packs/*/README.md`
- Core conventions: `.claude/commands/` structure
- Upstream sources: `upstreams.lock.json`

## Related

- `/ops/doctor` - Check pack status
- See `docs/WORKFLOWS.md` for using packs in workflows
- See `docs/MCP_GUIDE.md` for pack-provided MCP configs
