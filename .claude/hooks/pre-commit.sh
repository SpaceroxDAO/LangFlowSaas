#!/usr/bin/env bash
# Pre-commit hook: Run tests if test command detected
# Detects common test frameworks and runs tests before commit

set -euo pipefail

STRICT_MODE="${CLAUDE_STRICT_HOOKS:-false}"

# Function to detect and run tests
run_tests() {
  # Node/JavaScript projects
  if [ -f "package.json" ]; then
    if grep -q '"test"' package.json; then
      echo "ℹ️  Running npm test..."

      # Detect package manager
      if [ -f "pnpm-lock.yaml" ] && command -v pnpm &> /dev/null; then
        pnpm test || return 1
      elif [ -f "yarn.lock" ] && command -v yarn &> /dev/null; then
        yarn test || return 1
      elif command -v npm &> /dev/null; then
        npm test || return 1
      fi
      return 0
    fi
  fi

  # Python projects
  if [ -f "pyproject.toml" ] || [ -f "setup.py" ] || [ -f "pytest.ini" ]; then
    if command -v pytest &> /dev/null; then
      echo "ℹ️  Running pytest..."
      pytest || return 1
      return 0
    elif command -v python &> /dev/null; then
      if python -m pytest --version &> /dev/null; then
        echo "ℹ️  Running python -m pytest..."
        python -m pytest || return 1
        return 0
      fi
    fi
  fi

  # Go projects
  if [ -f "go.mod" ] && command -v go &> /dev/null; then
    echo "ℹ️  Running go test..."
    go test ./... || return 1
    return 0
  fi

  # Rust projects
  if [ -f "Cargo.toml" ] && command -v cargo &> /dev/null; then
    echo "ℹ️  Running cargo test..."
    cargo test || return 1
    return 0
  fi

  # No tests found or test framework not available
  return 0
}

# Run tests
if run_tests; then
  echo "✅ Tests passed"
  exit 0
else
  echo "❌ Tests failed"

  if [ "$STRICT_MODE" = "true" ]; then
    echo "   Commit blocked due to test failures (strictHooks enabled)"
    echo "   Fix the failing tests before committing"
    exit 1
  else
    echo "⚠️  WARNING: Tests failed but commit will proceed (strictHooks disabled)"
    echo "   Fix the failing tests soon to avoid breaking the build"
    echo "   Enable strictHooks to block commits with failing tests"
    exit 0
  fi
fi
