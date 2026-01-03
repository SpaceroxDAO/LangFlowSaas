#!/usr/bin/env bash
# Create a new git worktree for parallel development
set -euo pipefail

BRANCH_NAME="${1:-}"
BASE_BRANCH="${2:-main}"

if [ -z "$BRANCH_NAME" ]; then
  echo "Usage: ./scripts/worktree-new.sh <branch-name> [base-branch]"
  echo ""
  echo "Examples:"
  echo "  ./scripts/worktree-new.sh feature-auth"
  echo "  ./scripts/worktree-new.sh hotfix-bug develop"
  exit 1
fi

# Check if git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ Not a git repository"
  exit 1
fi

WORKTREE_PATH="../.worktree-$BRANCH_NAME"

# Check if worktree already exists
if [ -d "$WORKTREE_PATH" ]; then
  echo "❌ Worktree already exists at $WORKTREE_PATH"
  exit 1
fi

# Check if branch already exists
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  echo "⚠️  Branch '$BRANCH_NAME' already exists"
  read -p "Use existing branch? [y/N] " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
  CREATE_BRANCH=false
else
  CREATE_BRANCH=true
fi

echo "🌳 Creating worktree for branch: $BRANCH_NAME"
echo "   Base branch: $BASE_BRANCH"
echo "   Location: $WORKTREE_PATH"
echo ""

# Create worktree
if [ "$CREATE_BRANCH" = true ]; then
  git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH" "$BASE_BRANCH"
else
  git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"
fi

# Copy .worktreeinclude files if they exist
if [ -f ".worktreeinclude" ]; then
  echo "📋 Copying shared configuration..."

  while IFS= read -r file; do
    # Skip empty lines and comments
    [[ -z "$file" || "$file" =~ ^# ]] && continue

    if [ -f "$file" ]; then
      # Create directory structure in worktree
      target_dir="$WORKTREE_PATH/$(dirname "$file")"
      mkdir -p "$target_dir"

      # Copy file
      cp "$file" "$WORKTREE_PATH/$file"
      echo "  ✅ Copied $file"
    fi
  done < .worktreeinclude
fi

echo ""
echo "✅ Worktree created successfully!"
echo ""
echo "To switch to the worktree:"
echo "  cd $WORKTREE_PATH"
echo ""
echo "To remove it later:"
echo "  ./scripts/worktree-clean.sh $BRANCH_NAME"
