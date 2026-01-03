# Command: /ops/doctor

Diagnose project environment and configuration.

## Purpose
Check that toolchain, dependencies, and Claude Code setup are working correctly.

## Usage
```
/ops/doctor
```

## What This Does
1. Runs scripts/doctor.sh (or .ps1 on Windows)
2. Reports on:
   - Detected programming languages and tools
   - Package managers (npm, pnpm, pip, etc)
   - Test frameworks available
   - Claude Code settings and hooks status
   - MCP server connections
   - Git configuration
   - Enabled packs
3. Identifies missing dependencies
4. Suggests fixes for common issues

## When to Use
- Initial project setup
- Troubleshooting environment issues
- Before onboarding new developers
- After major tooling changes
- When hooks aren't working as expected

## Output
- Health check report
- Environment summary
- Issues found
- Recommended actions

## Related Commands
- /setup/permissions - fix permission issues
- /setup/mcp - fix MCP configuration
