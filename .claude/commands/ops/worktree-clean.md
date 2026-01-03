# Command: /ops/worktree-clean

Remove git worktrees that are no longer needed.

## Purpose
Clean up worktree directories after merging or abandoning branches.

## Usage
```
/ops/worktree-clean [branch-name|--all]
```

## What This Does
1. Lists existing worktrees
2. If branch-name provided:
   - Removes that specific worktree
   - Deletes the branch if already merged
3. If --all provided:
   - Shows all worktrees
   - Asks which to remove
   - Removes selected worktrees
4. Cleans up worktree admin files

## When to Use
- After merging feature branch
- Cleaning up abandoned experiments
- Reclaiming disk space
- Periodic maintenance

## Arguments
- `branch-name` (optional): specific worktree to remove
- `--all` (optional): interactive removal of multiple worktrees

## Output
- List of removed worktrees
- Disk space reclaimed
- Remaining worktrees

## Related Commands
- /ops/worktree-new - create worktree
- See docs/WORKFLOWS.md for worktree workflows
