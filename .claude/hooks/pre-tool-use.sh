#!/usr/bin/env bash
# Pre-tool-use hook: Safety warnings for dangerous operations
# This hook warns about potentially dangerous commands but doesn't block by default

set -euo pipefail

TOOL_NAME="${1:-}"
STRICT_MODE="${CLAUDE_STRICT_HOOKS:-false}"

# Patterns that should trigger warnings
DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf /*"
  "chmod -R 777"
  "> /dev/sda"
  "dd if="
  "mkfs."
  "fdisk"
  ":(){ :|:& };:"
)

# Check if any dangerous pattern is in the command
for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$TOOL_NAME" | grep -q "$pattern"; then
    echo "⚠️  WARNING: Potentially dangerous operation detected: $pattern"

    if [ "$STRICT_MODE" = "true" ]; then
      echo "❌ BLOCKED: strictHooks is enabled. This operation requires manual confirmation."
      echo "   To allow this, set 'features.strictHooks: false' in .claude/settings.local.json"
      exit 1
    else
      echo "ℹ️  Proceeding (strictHooks is disabled). Enable strictHooks for additional safety."
    fi
  fi
done

# Check for operations on sensitive files
if echo "$TOOL_NAME" | grep -qE '(\.env|secret|password|credential|key\.pem|\.ssh/id_)'; then
  echo "⚠️  WARNING: Operation involves sensitive files"

  if [ "$STRICT_MODE" = "true" ]; then
    echo "   Verify this operation is intentional"
  fi
fi

exit 0
