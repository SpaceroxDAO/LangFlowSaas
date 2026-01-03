# Command: /plan/issues

Break down specifications into actionable issues or tasks.

## Purpose
Convert high-level requirements into concrete, implementable work items.

## Usage
```
/plan/issues
```

## What This Does
1. Reads docs/00_PROJECT_SPEC.md
2. Analyzes features and requirements
3. Creates breakdown of:
   - User stories or features
   - Technical tasks
   - Dependencies between tasks
   - Suggested priority order
4. Outputs task list (can be imported to issue tracker)

## When to Use
- After spec is approved
- Sprint planning
- Breaking down large features
- Estimating work

## Output
- Markdown task list
- Each task includes:
  - Clear description
  - Acceptance criteria
  - Dependencies
  - Suggested size (S/M/L)

## Related Commands
- /plan/spec - create the specification first
- /build/feature - implement individual tasks
