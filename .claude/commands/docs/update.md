# Command: /docs/update

Update project documentation after changes.

## Purpose
Keep documentation in sync with code and architecture.

## Usage
```
/docs/update [doc-type]
```

## What This Does
1. Analyzes recent changes (git diff or file modifications)
2. Identifies which docs need updates:
   - Architecture (docs/01_ARCHITECTURE.md)
   - Changelog (docs/02_CHANGELOG.md)
   - Status (docs/03_STATUS.md)
   - API docs
   - README
3. Invokes core-docs agent to update relevant documents
4. Reviews and formats updates

## When to Use
- After implementing features
- When architecture changes
- Before releases
- Periodic documentation maintenance

## Arguments
- `doc-type` (optional): specific doc to update (architecture, changelog, status, readme)

## Output
- Updated documentation files
- Summary of changes made

## Related Commands
- /plan/spec - update project specification
- See docs/WORKFLOWS.md for documentation workflows
