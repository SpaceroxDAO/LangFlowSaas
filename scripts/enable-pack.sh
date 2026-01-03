#!/usr/bin/env bash
# Enable a pack by copying its contents to root .claude/
set -euo pipefail

PACK_NAME="${1:-}"
DRY_RUN="${2:-}"

if [ -z "$PACK_NAME" ]; then
  echo "Usage: ./scripts/enable-pack.sh <pack-name> [--dry-run]"
  echo ""
  echo "Available packs:"
  for pack in packs/*/; do
    if [ -d "$pack" ]; then
      pack_name=$(basename "$pack")
      if [ -f "$pack/README.md" ]; then
        description=$(head -n 5 "$pack/README.md" | grep -E "^#" | head -1 | sed 's/^# //')
        echo "  - $pack_name: $description"
      else
        echo "  - $pack_name"
      fi
    fi
  done
  exit 1
fi

PACK_DIR="packs/$PACK_NAME"

if [ ! -d "$PACK_DIR" ]; then
  echo "❌ Pack '$PACK_NAME' not found in packs/"
  exit 1
fi

if [ ! -d "$PACK_DIR/.claude" ]; then
  echo "❌ Pack '$PACK_NAME' has no .claude/ directory"
  exit 1
fi

echo "📦 Enabling pack: $PACK_NAME"
echo ""

# Check for conflicts
CONFLICTS=()
if [ -d "$PACK_DIR/.claude" ]; then
  while IFS= read -r -d '' file; do
    rel_path="${file#$PACK_DIR/.claude/}"
    target=".claude/$rel_path"
    if [ -f "$target" ]; then
      CONFLICTS+=("$rel_path")
    fi
  done < <(find "$PACK_DIR/.claude" -type f -print0)
fi

if [ ${#CONFLICTS[@]} -gt 0 ]; then
  echo "⚠️  Conflicts detected:"
  for conflict in "${CONFLICTS[@]}"; do
    echo "  - .claude/$conflict"
  done
  echo ""
  echo "Options:"
  echo "  1. Rename pack files to avoid conflicts"
  echo "  2. Review and manually merge"
  echo "  3. Abort"
  echo ""
  read -p "Continue anyway? [y/N] " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
fi

# Copy files
if [ "$DRY_RUN" = "--dry-run" ]; then
  echo "🔍 Dry run mode - showing what would be copied:"
  find "$PACK_DIR/.claude" -type f | while read -r file; do
    rel_path="${file#$PACK_DIR/.claude/}"
    echo "  Would copy: .claude/$rel_path"
  done
  exit 0
fi

echo "📋 Copying pack files..."
cp -r "$PACK_DIR/.claude/"* ".claude/" 2>/dev/null || true

# Make hooks executable
if [ -d ".claude/hooks" ]; then
  chmod +x .claude/hooks/*.sh 2>/dev/null || true
fi

echo "✅ Pack '$PACK_NAME' enabled successfully!"
echo ""
echo "Run '/ops/doctor' to verify the installation."

if [ -f "$PACK_DIR/README.md" ]; then
  echo ""
  echo "📖 Pack documentation:"
  echo "  cat packs/$PACK_NAME/README.md"
fi
