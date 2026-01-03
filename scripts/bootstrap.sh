#!/usr/bin/env bash
# Bootstrap script - Initialize project from templates
set -euo pipefail

echo "🚀 Bootstrapping Claude Code Universal Starter..."

# Copy template docs to actual docs if they don't exist
copy_if_not_exists() {
  local src="$1"
  local dest="$2"

  if [ ! -f "$dest" ]; then
    cp "$src" "$dest"
    echo "  ✅ Created $dest"
  else
    echo "  ⏭️  Skipped $dest (already exists)"
  fi
}

echo ""
echo "📄 Setting up documentation..."
copy_if_not_exists "docs/00_PROJECT_SPEC.template.md" "docs/00_PROJECT_SPEC.md"
copy_if_not_exists "docs/01_ARCHITECTURE.template.md" "docs/01_ARCHITECTURE.md"
copy_if_not_exists "docs/02_CHANGELOG.template.md" "docs/02_CHANGELOG.md"
copy_if_not_exists "docs/03_STATUS.template.md" "docs/03_STATUS.md"

echo ""
echo "⚙️  Setting up configuration..."
copy_if_not_exists ".claude/settings.local.json.example" ".claude/settings.local.json"

# Create .env.example if it doesn't exist
if [ ! -f ".env.example" ]; then
  cat > .env.example <<'EOF'
# Example environment variables
# Copy this to .env and fill in your values

# Database
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# API Keys
# API_KEY=your-api-key-here

# Claude Code Settings
# CLAUDE_STRICT_HOOKS=false
# CLAUDE_AUTO_FORMAT=false
# CLAUDE_VERBOSE_LOGS=false
EOF
  echo "  ✅ Created .env.example"
else
  echo "  ⏭️  Skipped .env.example (already exists)"
fi

echo ""
echo "📋 Creating README if needed..."
if [ ! -f "README.md" ]; then
  cat > README.md <<'EOF'
# Project Name

Brief description of your project.

## Setup

```bash
# Bootstrap the project
./scripts/bootstrap.sh

# Install dependencies
npm install  # or: pip install -r requirements.txt, etc.

# Configure environment
cp .env.example .env
# Edit .env with your values

# Run doctor to verify setup
/ops/doctor
```

## Documentation

- [Project Specification](docs/00_PROJECT_SPEC.md)
- [Architecture](docs/01_ARCHITECTURE.md)
- [Changelog](docs/02_CHANGELOG.md)
- [Status](docs/03_STATUS.md)
- [Workflows](docs/WORKFLOWS.md)
- [Permissions & Hooks](docs/PERMISSIONS_AND_HOOKS.md)
- [MCP Guide](docs/MCP_GUIDE.md)
- [Plugins & Packs](docs/PLUGINS_AND_PACKS.md)
- [IDE Setup](docs/IDE_SETUP.md)

## Usage

See [docs/WORKFLOWS.md](docs/WORKFLOWS.md) for detailed workflows.

### Quick Commands

```bash
# Plan a feature
/plan/spec

# Build a feature
/build/feature [name]

# Run tests
/build/test

# Update docs
/docs/update

# Check health
/ops/doctor
```

## Packs

Available packs in `packs/`:
- `core-workflows` - PSB workflow integration
- `webapp` - Frontend development tools
- `backend-python` - Python backend utilities
- `db-postgres` - PostgreSQL integration
- `browser-testing` - Browser automation
- `session-tooling` - Session management
- `skills-advanced` - Advanced commands
- `subagents-library` - Specialized agents
- `lsp` - LSP integration

Enable packs:
```bash
./scripts/enable-pack.sh [pack-name]
```

## License

[Your license here]
EOF
  echo "  ✅ Created README.md"
else
  echo "  ⏭️  Skipped README.md (already exists)"
fi

echo ""
echo "✨ Bootstrap complete!"
echo ""
echo "Next steps:"
echo "  1. Edit docs/00_PROJECT_SPEC.md with your project details"
echo "  2. Run: cp .env.example .env (and configure)"
echo "  3. Install dependencies for your stack"
echo "  4. Run: /ops/doctor to verify setup"
echo "  5. Enable packs as needed: ./scripts/enable-pack.sh [pack-name]"
echo ""
