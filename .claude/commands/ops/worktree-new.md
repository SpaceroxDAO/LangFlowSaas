# Command: /ops/worktree-new

Create a new git worktree for parallel feature work.

## Purpose
Set up isolated workspace for working on a feature without affecting main branch.

## Usage
```
/ops/worktree-new <branch-name> [base-branch]
```

## What This Does
1. Creates new git worktree in ../.worktree-<branch-name>
2. Creates and checks out new branch from base-branch (default: main)
3. Copies .worktreeinclude files to new worktree
4. Initializes the worktree environment
5. Provides instructions to switch to it

## When to Use
- Working on multiple features simultaneously
- Experimenting without affecting main work
- Code review in separate environment
- Parallel agent workflows

## Arguments
- `branch-name` (required): name for the new branch
- `base-branch` (optional): branch to create from (default: main)

## Output
- New worktree at ../.worktree-<branch-name>
- Instructions to use it
- Path to worktree

## Related Commands
- /ops/worktree-clean - remove worktrees
- See docs/WORKFLOWS.md for multi-agent worktree patterns
