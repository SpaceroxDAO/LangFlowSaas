# Command: /setup/permissions

Configure Claude Code permissions and hooks for your project.

## Purpose
Set up safe defaults for bash commands, file operations, and hooks.

## Usage
```
/setup/permissions
```

## What This Does
1. Reviews current .claude/settings.json permissions
2. Detects your toolchain (npm, pnpm, pytest, etc)
3. Recommends safe command allowlist
4. Explains hook behavior
5. Helps configure strictMode if desired

## When to Use
- Initial project setup
- When hooks are blocking work
- Adding new tools to the project
- Security hardening

## Output
- Updated .claude/settings.json (or settings.local.json)
- Explanation of each permission
- Hook behavior summary

## Related Commands
- /ops/doctor - diagnose permission issues
- See docs/PERMISSIONS_AND_HOOKS.md for detailed documentation
