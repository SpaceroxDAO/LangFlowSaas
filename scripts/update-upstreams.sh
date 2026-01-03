#!/usr/bin/env bash
# Update upstream repositories to latest or verify pinned versions
set -euo pipefail

MODE="${1:-check}"

if [ "$MODE" != "check" ] && [ "$MODE" != "update" ]; then
  echo "Usage: ./scripts/update-upstreams.sh [check|update]"
  echo ""
  echo "  check  - Check if upstreams have new commits (default)"
  echo "  update - Update upstreams.lock.json to latest commits"
  exit 1
fi

echo "🔍 Upstream Repository Manager"
echo "=============================="
echo ""

# Read current lock file
if [ ! -f "upstreams.lock.json" ]; then
  echo "❌ upstreams.lock.json not found"
  exit 1
fi

# Create temporary directory for clones
TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

echo "Checking upstreams..."
echo ""

# Parse JSON (simple approach using python or jq)
if command -v jq > /dev/null 2>&1; then
  PARSER="jq"
elif command -v python3 > /dev/null 2>&1; then
  PARSER="python"
else
  echo "❌ Need either 'jq' or 'python3' to parse JSON"
  exit 1
fi

# Extract upstream info
if [ "$PARSER" = "jq" ]; then
  upstream_count=$(jq '.upstreams | length' upstreams.lock.json)
else
  upstream_count=$(python3 -c "import json; print(len(json.load(open('upstreams.lock.json'))['upstreams']))")
fi

UPDATES_AVAILABLE=false

for ((i=0; i<upstream_count; i++)); do
  if [ "$PARSER" = "jq" ]; then
    name=$(jq -r ".upstreams[$i].name" upstreams.lock.json)
    url=$(jq -r ".upstreams[$i].url" upstreams.lock.json)
    current_commit=$(jq -r ".upstreams[$i].commit" upstreams.lock.json)
  else
    name=$(python3 -c "import json; d=json.load(open('upstreams.lock.json')); print(d['upstreams'][$i]['name'])")
    url=$(python3 -c "import json; d=json.load(open('upstreams.lock.json')); print(d['upstreams'][$i]['url'])")
    current_commit=$(python3 -c "import json; d=json.load(open('upstreams.lock.json')); print(d['upstreams'][$i]['commit'])")
  fi

  echo "📦 $name"
  echo "   URL: $url"
  echo "   Pinned: ${current_commit:0:8}"

  # Clone and check latest commit
  git clone --quiet --depth 1 "$url" "$TMP_DIR/$name" 2>/dev/null || {
    echo "   ❌ Failed to clone"
    echo ""
    continue
  }

  latest_commit=$(git -C "$TMP_DIR/$name" rev-parse HEAD)
  echo "   Latest: ${latest_commit:0:8}"

  if [ "$current_commit" != "$latest_commit" ]; then
    echo "   ⚠️  Update available!"
    UPDATES_AVAILABLE=true

    # Show commit difference
    commits_behind=$(git -C "$TMP_DIR/$name" rev-list --count "$current_commit..HEAD" 2>/dev/null || echo "unknown")
    if [ "$commits_behind" != "unknown" ]; then
      echo "   Commits behind: $commits_behind"
    fi
  else
    echo "   ✅ Up to date"
  fi
  echo ""
done

if [ "$MODE" = "check" ]; then
  if [ "$UPDATES_AVAILABLE" = true ]; then
    echo "To update upstreams.lock.json to latest commits:"
    echo "  ./scripts/update-upstreams.sh update"
  else
    echo "✨ All upstreams are up to date!"
  fi
  exit 0
fi

# Update mode
if [ "$MODE" = "update" ]; then
  echo "📝 Updating upstreams.lock.json..."

  # Create updated JSON
  if [ "$PARSER" = "jq" ]; then
    jq '.updated_at = now | .updated_at |= todate' upstreams.lock.json > upstreams.lock.tmp.json
  else
    python3 << 'EOF'
import json
from datetime import datetime

with open('upstreams.lock.json', 'r') as f:
    data = json.load(f)

data['updated_at'] = datetime.utcnow().isoformat() + 'Z'

with open('upstreams.lock.tmp.json', 'w') as f:
    json.dump(data, f, indent=2)
EOF
  fi

  # Update each upstream commit
  for ((i=0; i<upstream_count; i++)); do
    if [ "$PARSER" = "jq" ]; then
      name=$(jq -r ".upstreams[$i].name" upstreams.lock.json)
    else
      name=$(python3 -c "import json; d=json.load(open('upstreams.lock.json')); print(d['upstreams'][$i]['name'])")
    fi

    latest_commit=$(git -C "$TMP_DIR/$name" rev-parse HEAD 2>/dev/null || echo "")

    if [ -n "$latest_commit" ]; then
      if [ "$PARSER" = "jq" ]; then
        jq ".upstreams[$i].commit = \"$latest_commit\"" upstreams.lock.tmp.json > upstreams.lock.tmp2.json
        mv upstreams.lock.tmp2.json upstreams.lock.tmp.json
      else
        python3 << EOF
import json
with open('upstreams.lock.tmp.json', 'r') as f:
    data = json.load(f)
data['upstreams'][$i]['commit'] = "$latest_commit"
with open('upstreams.lock.tmp.json', 'w') as f:
    json.dump(data, f, indent=2)
EOF
      fi
      echo "  ✅ Updated $name to ${latest_commit:0:8}"
    fi
  done

  mv upstreams.lock.tmp.json upstreams.lock.json
  echo ""
  echo "✅ upstreams.lock.json updated!"
  echo ""
  echo "⚠️  Note: This only updates the lock file."
  echo "   Review and manually adapt any new upstream changes to packs."
fi
