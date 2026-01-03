#!/usr/bin/env bash
# Doctor script - Diagnose project environment and configuration
set -euo pipefail

echo "🏥 Claude Code Environment Doctor"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success() {
  echo -e "${GREEN}✅ $1${NC}"
}

warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
  echo -e "${RED}❌ $1${NC}"
}

# Check git
echo "📍 Repository Status"
if git rev-parse --git-dir > /dev/null 2>&1; then
  success "Git repository initialized"
  branch=$(git rev-parse --abbrev-ref HEAD)
  echo "   Current branch: $branch"
else
  warning "Not a git repository"
fi
echo ""

# Check Claude Code structure
echo "📁 Claude Code Structure"
if [ -d ".claude" ]; then
  success ".claude/ directory exists"
else
  error ".claude/ directory missing"
fi

if [ -f ".claude/settings.json" ]; then
  success "settings.json found"
else
  error "settings.json missing"
fi

# Count agents, commands, hooks
if [ -d ".claude/agents" ]; then
  agent_count=$(find .claude/agents -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  echo "   Agents: $agent_count"
fi

if [ -d ".claude/commands" ]; then
  command_count=$(find .claude/commands -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  echo "   Commands: $command_count"
fi

if [ -d ".claude/hooks" ]; then
  hook_count=$(find .claude/hooks -name "*.sh" 2>/dev/null | wc -l | tr -d ' ')
  echo "   Hooks: $hook_count"
fi
echo ""

# Check toolchains
echo "🔧 Detected Toolchains"

# Node.js
if command -v node > /dev/null 2>&1; then
  node_version=$(node --version)
  success "Node.js $node_version"

  # Package managers
  if command -v npm > /dev/null 2>&1; then
    echo "   npm $(npm --version)"
  fi
  if command -v pnpm > /dev/null 2>&1; then
    echo "   pnpm $(pnpm --version)"
  fi
  if command -v yarn > /dev/null 2>&1; then
    echo "   yarn $(yarn --version)"
  fi
fi

# Python
if command -v python3 > /dev/null 2>&1; then
  python_version=$(python3 --version)
  success "$python_version"

  if command -v pip > /dev/null 2>&1; then
    echo "   pip $(pip --version | awk '{print $2}')"
  fi
  if command -v poetry > /dev/null 2>&1; then
    echo "   poetry $(poetry --version | awk '{print $3}')"
  fi
fi

# Go
if command -v go > /dev/null 2>&1; then
  go_version=$(go version | awk '{print $3}')
  success "Go $go_version"
fi

# Rust
if command -v cargo > /dev/null 2>&1; then
  rust_version=$(rustc --version | awk '{print $2}')
  success "Rust $rust_version"
fi

if ! command -v node > /dev/null 2>&1 && ! command -v python3 > /dev/null 2>&1 && ! command -v go > /dev/null 2>&1; then
  warning "No major programming language detected"
fi
echo ""

# Test frameworks
echo "🧪 Test Frameworks"
test_found=false

if [ -f "package.json" ] && grep -q '"test"' package.json 2>/dev/null; then
  success "npm test script found"
  test_found=true
fi

if command -v pytest > /dev/null 2>&1; then
  success "pytest available"
  test_found=true
fi

if command -v go > /dev/null 2>&1 && [ -f "go.mod" ]; then
  success "Go testing available"
  test_found=true
fi

if [ "$test_found" = false ]; then
  warning "No test framework detected"
fi
echo ""

# Formatters
echo "💅 Formatters"
formatter_found=false

if command -v prettier > /dev/null 2>&1; then
  success "prettier available"
  formatter_found=true
fi

if command -v black > /dev/null 2>&1; then
  success "black available"
  formatter_found=true
fi

if command -v gofmt > /dev/null 2>&1; then
  success "gofmt available"
  formatter_found=true
fi

if [ "$formatter_found" = false ]; then
  warning "No formatters detected (hooks won't auto-format)"
fi
echo ""

# MCP configuration
echo "🔌 MCP Configuration"
if [ -f ".mcp.json" ]; then
  success ".mcp.json found"

  # Try to parse MCP servers (simple grep)
  server_count=$(grep -c '"command"' .mcp.json 2>/dev/null || echo "0")
  echo "   Configured servers: $server_count"
else
  warning ".mcp.json not found"
  echo "   Run: /setup/mcp to configure"
fi
echo ""

# Hooks status
echo "🪝 Hooks Status"
if [ -f ".claude/settings.json" ]; then
  if grep -q '"enabled": true' .claude/settings.json 2>/dev/null; then
    success "Hooks enabled"
  else
    warning "Hooks disabled"
  fi

  if grep -q '"strictHooks": true' .claude/settings.json 2>/dev/null || grep -q '"strictHooks": true' .claude/settings.local.json 2>/dev/null; then
    echo "   Mode: Strict (blocks on failures)"
  else
    echo "   Mode: Safe (warns only)"
  fi
fi
echo ""

# Enabled packs
echo "📦 Enabled Packs"
enabled_packs=()
if [ -d "packs" ]; then
  for pack in packs/*/; do
    pack_name=$(basename "$pack")
    # Simple heuristic: if pack's .claude files exist in root .claude/
    if [ -f "$pack/pack.json" ]; then
      # Could do more sophisticated checking here
      enabled_packs+=("$pack_name")
    fi
  done
fi

if [ ${#enabled_packs[@]} -gt 0 ]; then
  for pack in "${enabled_packs[@]}"; do
    echo "   - $pack (to verify: check if pack files are in .claude/)"
  done
else
  warning "No packs enabled"
  echo "   Available: ls packs/"
  echo "   Enable: ./scripts/enable-pack.sh [pack-name]"
fi
echo ""

# Environment variables
echo "🌍 Environment"
if [ -f ".env" ]; then
  success ".env file found"
else
  warning ".env file not found"
  if [ -f ".env.example" ]; then
    echo "   Run: cp .env.example .env"
  fi
fi
echo ""

# Summary
echo "📊 Summary"
echo "=========="

issues=0

# Critical checks
if [ ! -d ".claude" ]; then
  error "CRITICAL: .claude/ directory missing"
  ((issues++))
fi

if [ ! -f ".claude/settings.json" ]; then
  error "CRITICAL: settings.json missing"
  ((issues++))
fi

if [ "$issues" -eq 0 ]; then
  success "No critical issues found"
  echo ""
  echo "✨ Environment looks good!"
else
  echo ""
  error "Found $issues critical issue(s)"
  echo "Run ./scripts/bootstrap.sh if this is a new setup"
fi
