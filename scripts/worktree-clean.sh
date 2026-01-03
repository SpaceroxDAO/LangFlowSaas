#!/usr/bin/env bash
# Remove git worktrees
set -euo pipefail

BRANCH_NAME="${1:-}"

if [ -z "$BRANCH_NAME" ] && [ "$BRANCH_NAME" != "--all" ]; then
  echo "Usage: ./scripts/worktree-clean.sh <branch-name|--all>"
  echo ""
  echo "Examples:"
  echo "  ./scripts/worktree-clean.sh feature-auth"
  echo "  ./scripts/worktree-clean.sh --all"
  echo ""
  echo "Current worktrees:"
  git worktree list
  exit 1
fi

# Check if git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ Not a git repository"
  exit 1
fi

if [ "$BRANCH_NAME" = "--all" ]; then
  echo "🧹 Cleaning all worktrees..."
  echo ""

  # List all worktrees except main
  git worktree list --porcelain | grep "worktree " | awk '{print $2}' | while read -r worktree; do
    # Skip main worktree (the current repo)
    if [ "$worktree" = "$(pwd)" ]; then
      continue
    fi

    branch=$(git worktree list --porcelain | grep -A2 "worktree $worktree" | grep "branch " | awk '{print $2}' | sed 's/refs\/heads\///')

    echo "Worktree: $worktree (branch: $branch)"
    read -p "Remove this worktree? [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      git worktree remove "$worktree"
      echo "  ✅ Removed worktree"

      # Ask about branch
      if git show-ref --verify --quiet "refs/heads/$branch"; then
        # Check if branch is merged
        if git branch --merged | grep -q "^[* ]*$branch$"; then
          read -p "Branch '$branch' is merged. Delete it? [y/N] " -n 1 -r
          echo
          if [[ $REPLY =~ ^[Yy]$ ]]; then
            git branch -d "$branch"
            echo "  ✅ Deleted branch $branch"
          fi
        else
          echo "  ⚠️  Branch '$branch' is not merged (keeping it)"
        fi
      fi
    else
      echo "  ⏭️  Skipped"
    fi
    echo ""
  done
else
  WORKTREE_PATH="../.worktree-$BRANCH_NAME"

  if [ ! -d "$WORKTREE_PATH" ]; then
    echo "❌ Worktree not found at $WORKTREE_PATH"
    echo ""
    echo "Available worktrees:"
    git worktree list
    exit 1
  fi

  echo "🧹 Removing worktree: $BRANCH_NAME"
  echo "   Location: $WORKTREE_PATH"
  echo ""

  # Remove worktree
  git worktree remove "$WORKTREE_PATH"
  echo "✅ Worktree removed"

  # Check if branch should be deleted
  if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    echo ""

    # Check if branch is merged
    if git branch --merged | grep -q "^[* ]*$BRANCH_NAME$"; then
      echo "Branch '$BRANCH_NAME' is merged into current branch."
      read -p "Delete branch '$BRANCH_NAME'? [y/N] " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        git branch -d "$BRANCH_NAME"
        echo "✅ Deleted branch $BRANCH_NAME"
      else
        echo "Branch kept"
      fi
    else
      echo "⚠️  Branch '$BRANCH_NAME' is NOT merged yet (keeping it)"
      echo "To force delete: git branch -D $BRANCH_NAME"
    fi
  fi
fi

echo ""
echo "Remaining worktrees:"
git worktree list
