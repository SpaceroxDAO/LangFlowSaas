#!/usr/bin/env bash
# Smoke test - Validate repository structure and configuration
set -euo pipefail

echo "🧪 Running Smoke Tests"
echo "======================"
echo ""

FAILED=0
PASSED=0

pass() {
  echo "✅ $1"
  ((PASSED++))
}

fail() {
  echo "❌ $1"
  ((FAILED++))
}

# Test 1: Required directories exist
echo "📁 Testing directory structure..."
[ -d ".claude" ] && pass ".claude/ exists" || fail ".claude/ missing"
[ -d ".claude/agents" ] && pass ".claude/agents/ exists" || fail ".claude/agents/ missing"
[ -d ".claude/commands" ] && pass ".claude/commands/ exists" || fail ".claude/commands/ missing"
[ -d ".claude/hooks" ] && pass ".claude/hooks/ exists" || fail ".claude/hooks/ missing"
[ -d "docs" ] && pass "docs/ exists" || fail "docs/ missing"
[ -d "scripts" ] && pass "scripts/ exists" || fail "scripts/ missing"
[ -d "packs" ] && pass "packs/ exists" || fail "packs/ missing"
[ -d "marketplaces" ] && pass "marketplaces/ exists" || fail "marketplaces/ missing"
echo ""

# Test 2: Required files exist
echo "📄 Testing required files..."
[ -f ".gitignore" ] && pass ".gitignore exists" || fail ".gitignore missing"
[ -f "upstreams.lock.json" ] && pass "upstreams.lock.json exists" || fail "upstreams.lock.json missing"
[ -f ".claude/settings.json" ] && pass ".claude/settings.json exists" || fail ".claude/settings.json missing"
[ -f ".claude/settings.local.json.example" ] && pass "settings.local.json.example exists" || fail "settings.local.json.example missing"
[ -f ".mcp.json.example" ] && pass ".mcp.json.example exists" || fail ".mcp.json.example missing"
echo ""

# Test 3: CORE agents (exactly 5)
echo "🤖 Testing CORE agents..."
agent_count=$(find .claude/agents -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
if [ "$agent_count" -eq 5 ]; then
  pass "Exactly 5 CORE agents found"
else
  fail "Expected 5 CORE agents, found $agent_count"
fi

required_agents=("core-architect.md" "core-implementer.md" "core-reviewer.md" "core-security.md" "core-docs.md")
for agent in "${required_agents[@]}"; do
  [ -f ".claude/agents/$agent" ] && pass "Agent $agent exists" || fail "Agent $agent missing"
done
echo ""

# Test 4: CORE commands (exactly 10)
echo "⚡ Testing CORE commands..."
command_count=$(find .claude/commands -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
if [ "$command_count" -eq 10 ]; then
  pass "Exactly 10 CORE commands found"
else
  fail "Expected 10 CORE commands, found $command_count"
fi

required_commands=(
  "plan/spec.md"
  "plan/issues.md"
  "setup/mcp.md"
  "setup/permissions.md"
  "build/feature.md"
  "build/test.md"
  "docs/update.md"
  "ops/worktree-new.md"
  "ops/worktree-clean.md"
  "ops/doctor.md"
)
for cmd in "${required_commands[@]}"; do
  [ -f ".claude/commands/$cmd" ] && pass "Command $cmd exists" || fail "Command $cmd missing"
done
echo ""

# Test 5: CORE hooks (exactly 3)
echo "🪝 Testing CORE hooks..."
hook_count=$(find .claude/hooks -maxdepth 1 -name "*.sh" 2>/dev/null | wc -l | tr -d ' ')
if [ "$hook_count" -eq 3 ]; then
  pass "Exactly 3 CORE hooks found"
else
  fail "Expected 3 CORE hooks, found $hook_count"
fi

required_hooks=("pre-tool-use.sh" "post-edit.sh" "pre-commit.sh")
for hook in "${required_hooks[@]}"; do
  if [ -f ".claude/hooks/$hook" ]; then
    if [ -x ".claude/hooks/$hook" ]; then
      pass "Hook $hook exists and is executable"
    else
      fail "Hook $hook exists but is not executable"
    fi
  else
    fail "Hook $hook missing"
  fi
done
echo ""

# Test 6: Documentation files
echo "📚 Testing documentation..."
docs=(
  "00_PROJECT_SPEC.template.md"
  "01_ARCHITECTURE.template.md"
  "02_CHANGELOG.template.md"
  "03_STATUS.template.md"
  "WORKFLOWS.md"
  "PERMISSIONS_AND_HOOKS.md"
  "MCP_GUIDE.md"
  "PLUGINS_AND_PACKS.md"
  "IDE_SETUP.md"
)
for doc in "${docs[@]}"; do
  [ -f "docs/$doc" ] && pass "Doc $doc exists" || fail "Doc $doc missing"
done
echo ""

# Test 7: Scripts
echo "🔧 Testing scripts..."
scripts=("bootstrap.sh" "enable-pack.sh" "doctor.sh" "smoke.sh" "worktree-new.sh" "worktree-clean.sh" "update-upstreams.sh")
for script in "${scripts[@]}"; do
  if [ -f "scripts/$script" ]; then
    if [ -x "scripts/$script" ]; then
      pass "Script $script exists and is executable"
    else
      fail "Script $script exists but not executable"
    fi
  else
    fail "Script $script missing"
  fi
done
echo ""

# Test 8: JSON files are valid
echo "🔍 Testing JSON validity..."
json_files=(".claude/settings.json" "upstreams.lock.json" ".mcp.json.example" ".vscode/extensions.json")
for json_file in "${json_files[@]}"; do
  if [ -f "$json_file" ]; then
    if command -v jq > /dev/null 2>&1; then
      if jq empty "$json_file" 2>/dev/null; then
        pass "$json_file is valid JSON"
      else
        fail "$json_file has invalid JSON"
      fi
    else
      if python3 -m json.tool "$json_file" > /dev/null 2>&1; then
        pass "$json_file is valid JSON"
      else
        fail "$json_file has invalid JSON"
      fi
    fi
  fi
done
echo ""

# Test 9: No _upstream/ directory (should be deleted)
echo "🧹 Testing cleanup..."
if [ -d "_upstream" ]; then
  fail "_upstream/ directory still exists (should be deleted)"
else
  pass "_upstream/ directory removed"
fi
echo ""

# Test 10: Pack structure
echo "📦 Testing pack structure..."
pack_count=$(find packs -maxdepth 1 -type d ! -name packs | wc -l | tr -d ' ')
if [ "$pack_count" -ge 1 ]; then
  pass "Found $pack_count packs"
else
  fail "No packs found"
fi
echo ""

# Summary
echo "📊 Test Summary"
echo "==============="
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo ""

if [ "$FAILED" -eq 0 ]; then
  echo "✨ All smoke tests passed!"
  exit 0
else
  echo "❌ Some tests failed. Please review the output above."
  exit 1
fi
