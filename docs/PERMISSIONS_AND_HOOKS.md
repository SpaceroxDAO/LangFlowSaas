# Permissions and Hooks Guide

This document explains how to configure Claude Code permissions and hooks for your project.

## Permissions Overview

Permissions control what operations Claude Code can perform without explicit confirmation.

### Permission Types

#### 1. Bash Permissions
Controls which shell commands can run automatically.

**Default behavior**: All bash commands require confirmation.

**Configuration**:
```json
{
  "permissions": {
    "bash": {
      "allowedCommands": [
        "npm run *",
        "pnpm *",
        "pytest *"
      ],
      "requireConfirmation": true
    }
  }
}
```

**Patterns**:
- `"npm run *"`: Allows any `npm run` command
- `"git status"`: Allows only exact command
- `"docker ps"`: Allows specific Docker command
- `"*"`: Allows everything (NOT RECOMMENDED)

#### 2. File Operation Permissions
Controls file read/write operations.

**Default behavior**: File operations allowed, but sensitive paths excluded.

**Configuration**:
```json
{
  "permissions": {
    "fileOperations": {
      "requireConfirmation": false,
      "excludePaths": [
        "**/.env",
        "**/.env.*",
        "**/secrets.*",
        "**/*secret*",
        "**/*password*",
        "**/*credential*"
      ]
    }
  }
}
```

#### 3. Network Permissions
Controls external network requests.

**Default behavior**: Network operations require confirmation.

**Configuration**:
```json
{
  "permissions": {
    "network": {
      "requireConfirmation": true,
      "allowedDomains": [
        "api.github.com",
        "registry.npmjs.org"
      ]
    }
  }
}
```

---

## Hooks Overview

Hooks are scripts that run automatically at specific lifecycle events.

### Hook Events

| Event | When It Fires | Use Case |
|-------|---------------|----------|
| `pre-tool-use` | Before any tool is used | Safety checks, validation |
| `post-edit` | After file is edited | Auto-formatting, linting |
| `pre-commit` | Before git commit | Run tests, lint checks |
| `post-commit` | After git commit | Notifications, deployments |

### CORE Hooks

This starter includes 3 conservative hooks:

#### 1. pre-tool-use.sh
**Purpose**: Warn about dangerous operations

**Behavior**:
- Detects potentially dangerous patterns (rm -rf /, chmod 777, etc)
- Warns but allows operation (unless strictMode enabled)
- Flags operations on sensitive files

**Configuration**:
```json
{
  "hooks": {
    "hooks": [
      {
        "name": "pre-tool-use",
        "event": "pre-tool-use",
        "command": ".claude/hooks/pre-tool-use.sh"
      }
    ]
  }
}
```

#### 2. post-edit.sh
**Purpose**: Auto-format code if tooling exists

**Behavior**:
- Only runs if `autoFormat` feature is enabled
- Detects file type and available formatters
- Runs formatter if found (prettier, black, gofmt, etc)
- Never installs tools automatically

**Enable auto-formatting**:
```json
{
  "features": {
    "autoFormat": true
  }
}
```

#### 3. pre-commit.sh
**Purpose**: Run tests before committing

**Behavior**:
- Detects test framework (npm test, pytest, go test, cargo test)
- Runs tests if found
- In strictMode: blocks commit if tests fail
- Otherwise: warns but allows commit

**Configuration**:
```json
{
  "hooks": {
    "hooks": [
      {
        "name": "pre-commit",
        "event": "pre-commit",
        "command": ".claude/hooks/pre-commit.sh"
      }
    ]
  }
}
```

---

## Strict Mode vs Safe Mode

### Safe Mode (Default)
**Setting**: `"strictHooks": false`

**Behavior**:
- Hooks warn about issues but don't block operations
- Failed tests allow commit with warning
- Dangerous commands show warning but proceed
- Good for: Development, experimentation, learning

### Strict Mode
**Setting**: `"strictHooks": true`

**Behavior**:
- Hooks block operations that fail checks
- Failed tests prevent commit
- Dangerous commands require manual override
- Good for: Production code, shared codebases, CI/CD

**Enable strict mode**:
```json
{
  "features": {
    "strictHooks": true
  }
}
```

---

## Configuration Files

### Global Settings
**File**: `.claude/settings.json`
**Purpose**: Default settings for all users
**Versioned**: Yes, committed to git
**When to edit**: Setting project-wide defaults

### Local Overrides
**File**: `.claude/settings.local.json`
**Purpose**: User-specific overrides
**Versioned**: No, in .gitignore
**When to edit**: Personal preferences, local tools

**Example local override**:
```json
{
  "features": {
    "strictHooks": true,
    "autoFormat": true,
    "verboseLogs": true
  },
  "permissions": {
    "bash": {
      "allowedCommands": [
        "npm *",
        "pnpm *",
        "docker compose *"
      ]
    }
  }
}
```

---

## Common Scenarios

### Scenario 1: Hooks Are Too Annoying
**Problem**: Hooks warn too often or block valid operations

**Solutions**:
1. Keep `strictHooks: false` (default)
2. Disable specific hooks:
   ```json
   {
     "hooks": {
       "enabled": false
     }
   }
   ```
3. Override locally in `.claude/settings.local.json`

### Scenario 2: Want More Safety
**Problem**: Need stricter validation for production code

**Solutions**:
1. Enable strict mode:
   ```json
   {
     "features": {
       "strictHooks": true
     }
   }
   ```
2. Require confirmation for more commands:
   ```json
   {
     "permissions": {
       "bash": {
         "allowedCommands": [],
         "requireConfirmation": true
       }
     }
   }
   ```

### Scenario 3: Need Project-Specific Tools
**Problem**: Project uses specific build tools (e.g., pnpm, poetry)

**Solution**: Add to allowed commands:
```json
{
  "permissions": {
    "bash": {
      "allowedCommands": [
        "pnpm *",
        "poetry run *",
        "make *"
      ]
    }
  }
}
```

### Scenario 4: Disable Auto-Format for Some Files
**Problem**: Auto-format breaks generated code or minified files

**Solution**: Hooks detect file type, but you can disable the feature:
```json
{
  "features": {
    "autoFormat": false
  }
}
```

Or create custom exclusion in hook script.

---

## Writing Custom Hooks

### Hook Script Requirements
1. Must be executable (`chmod +x`)
2. Must handle errors gracefully
3. Exit code 0 = success, non-zero = failure
4. Should respect `CLAUDE_STRICT_HOOKS` environment variable

### Example Custom Hook
**File**: `.claude/hooks/custom-lint.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail

EDITED_FILE="${1:-}"
STRICT_MODE="${CLAUDE_STRICT_HOOKS:-false}"

# Run eslint if available
if command -v eslint &> /dev/null; then
  if ! eslint "$EDITED_FILE"; then
    if [ "$STRICT_MODE" = "true" ]; then
      echo "❌ Lint failed (strict mode)"
      exit 1
    else
      echo "⚠️  Lint warnings (not blocking)"
    fi
  fi
fi

exit 0
```

**Register in settings.json**:
```json
{
  "hooks": {
    "hooks": [
      {
        "name": "custom-lint",
        "event": "post-edit",
        "command": ".claude/hooks/custom-lint.sh",
        "description": "Run linting after edits"
      }
    ]
  }
}
```

---

## Debugging Hooks

### Check Hook Status
```bash
/ops/doctor
```

Shows:
- Which hooks are enabled
- Hook execution results
- Environment variables

### Test a Hook Manually
```bash
# Test pre-tool-use hook
./.claude/hooks/pre-tool-use.sh "rm -rf /tmp/test"

# Test post-edit hook
CLAUDE_AUTO_FORMAT=true ./.claude/hooks/post-edit.sh "src/index.ts"

# Test pre-commit hook
CLAUDE_STRICT_HOOKS=true ./.claude/hooks/pre-commit.sh
```

### Enable Verbose Logging
```json
{
  "features": {
    "verboseLogs": true
  }
}
```

---

## Security Best Practices

### Do's
- ✅ Keep sensitive files in `excludePaths`
- ✅ Use `strictHooks: true` for production
- ✅ Review allowed commands periodically
- ✅ Version `.claude/settings.json` in git
- ✅ Keep `.claude/settings.local.json` out of git

### Don'ts
- ❌ Don't add `"allowedCommands": ["*"]`
- ❌ Don't disable hooks entirely without understanding risks
- ❌ Don't commit secrets in settings files
- ❌ Don't run untrusted hooks from packs without review

---

## Hook Environment Variables

Hooks receive these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `CLAUDE_STRICT_HOOKS` | Whether strict mode is enabled | `true` or `false` |
| `CLAUDE_AUTO_FORMAT` | Whether auto-format is enabled | `true` or `false` |
| `CLAUDE_VERBOSE_LOGS` | Whether verbose logging is on | `true` or `false` |

Access in hooks:
```bash
STRICT_MODE="${CLAUDE_STRICT_HOOKS:-false}"
if [ "$STRICT_MODE" = "true" ]; then
  # Strict behavior
fi
```

---

## Troubleshooting

### Hooks Not Running
1. Check hooks are enabled: `"hooks.enabled": true`
2. Verify hook scripts are executable: `ls -l .claude/hooks/`
3. Check for syntax errors: Run hook manually
4. Review logs if `verboseLogs: true`

### Hooks Blocking Valid Operations
1. Check `strictHooks` setting
2. Review hook logic in script files
3. Override locally if needed
4. Consider disabling specific hook temporarily

### Performance Issues
1. Hooks should be fast (< 1 second)
2. Avoid expensive operations in hooks
3. Cache results when possible
4. Consider async hooks for slow operations

---

## Related Commands

- `/setup/permissions` - Interactive permission configuration
- `/ops/doctor` - Check hook and permission status
- See `docs/WORKFLOWS.md` for workflow integration
