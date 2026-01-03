#!/usr/bin/env bash
# Post-edit hook: Auto-format if toolchain detected
# Only runs if formatting tools are already installed (doesn't install anything)

set -euo pipefail

EDITED_FILE="${1:-}"
AUTO_FORMAT="${CLAUDE_AUTO_FORMAT:-false}"

# Skip if file doesn't exist or auto-format disabled
if [ ! -f "$EDITED_FILE" ] || [ "$AUTO_FORMAT" != "true" ]; then
  exit 0
fi

FILE_EXT="${EDITED_FILE##*.}"

# Detect and run formatters based on file type
format_file() {
  case "$FILE_EXT" in
    js|jsx|ts|tsx|json|css|scss|html|md|yaml|yml)
      # Try prettier if available
      if command -v prettier &> /dev/null; then
        echo "ℹ️  Running prettier on $EDITED_FILE"
        prettier --write "$EDITED_FILE" 2>/dev/null || true
        return 0
      fi
      # Try deno fmt if available
      if command -v deno &> /dev/null; then
        echo "ℹ️  Running deno fmt on $EDITED_FILE"
        deno fmt "$EDITED_FILE" 2>/dev/null || true
        return 0
      fi
      ;;

    py)
      # Try black if available
      if command -v black &> /dev/null; then
        echo "ℹ️  Running black on $EDITED_FILE"
        black "$EDITED_FILE" 2>/dev/null || true
        return 0
      fi
      # Try ruff if available
      if command -v ruff &> /dev/null; then
        echo "ℹ️  Running ruff format on $EDITED_FILE"
        ruff format "$EDITED_FILE" 2>/dev/null || true
        return 0
      fi
      ;;

    go)
      # Try gofmt if available
      if command -v gofmt &> /dev/null; then
        echo "ℹ️  Running gofmt on $EDITED_FILE"
        gofmt -w "$EDITED_FILE" 2>/dev/null || true
        return 0
      fi
      ;;

    rs)
      # Try rustfmt if available
      if command -v rustfmt &> /dev/null; then
        echo "ℹ️  Running rustfmt on $EDITED_FILE"
        rustfmt "$EDITED_FILE" 2>/dev/null || true
        return 0
      fi
      ;;
  esac
}

format_file
exit 0
