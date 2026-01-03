# Command: /plan/spec

Create or update the project specification document.

## Purpose
Document product requirements, technical constraints, and success criteria.

## Usage
```
/plan/spec
```

## What This Does
1. Reads existing docs/00_PROJECT_SPEC.md if present
2. Asks you key questions about:
   - Product goals and user needs
   - Core features and functionality
   - Technical requirements
   - Success metrics
   - Out of scope items
3. Updates docs/00_PROJECT_SPEC.md with structured specification

## When to Use
- Starting a new project
- Major feature planning
- Clarifying project scope
- Onboarding new team members

## Output
- Updated docs/00_PROJECT_SPEC.md
- Clear, actionable specification

## Related Commands
- /plan/issues - break spec into actionable issues
- /docs/update - update other documentation
