# Development Workflows

This document describes the recommended workflows for using this Claude Code starter.

## The PSB Workflow (Plan → Setup → Build)

The PSB workflow is the recommended approach for structured feature development.

### 1. Plan Phase

Start by creating or updating specifications:

```bash
# Create project specification
/plan/spec

# Break down into tasks
/plan/issues
```

**Output**: Documented requirements in `docs/00_PROJECT_SPEC.md` and task breakdown.

### 2. Setup Phase

Configure your environment and permissions:

```bash
# Set up MCP servers for external integrations
/setup/mcp

# Configure permissions and hooks
/setup/permissions

# Check environment health
/ops/doctor
```

**Output**: Configured `.mcp.json`, `.claude/settings.json`, verified environment.

### 3. Build Phase

Implement features following the plan:

```bash
# Build a feature end-to-end
/build/feature [feature-name]

# Run and fix tests
/build/test

# Update documentation
/docs/update
```

**Output**: Working code, tests, updated documentation.

---

## Single-Feature Workflow

For implementing one feature quickly:

### Quick Path
1. **Plan**: Describe the feature to core-architect agent
2. **Approve**: Review and approve the approach
3. **Build**: Use `/build/feature [name]` to implement
4. **Test**: Verify with `/build/test`
5. **Document**: Update docs with `/docs/update`
6. **Commit**: Commit the changes

### Example
```
User: I need to add user authentication with email/password

Claude: I'll invoke core-architect to plan this feature...
[Architecture plan presented]

User: Looks good, proceed

Claude: [Uses /build/feature to implement]
[Tests created and passing]
[Documentation updated]

Claude: Feature complete! Ready to commit.
```

---

## Issue-Based Workflow

For working from an existing issue or task list:

### Workflow
1. **Read the issue**: Understand requirements and acceptance criteria
2. **Check dependencies**: Ensure prerequisite work is done
3. **Implement**: Use appropriate agent (usually core-implementer)
4. **Test**: Write and run tests
5. **Review**: Self-review or request code review
6. **Update**: Mark issue as complete, update status doc

### Example
```
User: Please implement issue #42 from our tracker

Claude: [Reads issue]
Claude: [Uses core-implementer to write code]
Claude: [Runs /build/test]
Claude: [Updates docs/03_STATUS.md]
```

---

## Multi-Agent Worktree Workflow

For parallel development on multiple features:

### Setup
Use git worktrees to work on multiple branches simultaneously without conflicts:

```bash
# Create worktree for feature A
/ops/worktree-new feature-a

# Create worktree for feature B
/ops/worktree-new feature-b
```

### Agent Assignment
- **Worktree 1**: core-implementer works on feature A
- **Worktree 2**: core-reviewer reviews existing code
- **Worktree 3**: core-docs updates documentation

### Coordination
Each worktree has its own:
- Git branch
- Working directory
- Independent file state

Shared across worktrees:
- Git history
- Configuration from `.worktreeinclude`

### Cleanup
```bash
# After merging feature-a
/ops/worktree-clean feature-a

# Or clean all merged worktrees
/ops/worktree-clean --all
```

---

## Code Review Workflow

### Before Requesting Review
1. **Self-review**: Read your own code first
2. **Run tests**: Ensure `/build/test` passes
3. **Check hooks**: Verify no hook warnings
4. **Update docs**: Run `/docs/update`

### Requesting Review
```
User: Please review the authentication feature I just built

Claude: [Invokes core-reviewer agent]
[Analyzes code for bugs, security, maintainability]
[Provides categorized feedback]
```

### Addressing Feedback
```
User: Please fix the critical issues from the review

Claude: [Addresses critical issues]
[Re-runs tests]
[Requests re-review if needed]
```

---

## Refactoring Workflow

Safe refactoring with tests and validation:

### Workflow
1. **Ensure tests exist**: Write tests for current behavior if missing
2. **Baseline**: Verify all tests pass before refactoring
3. **Plan**: Use core-architect to plan refactoring approach
4. **Refactor**: Make changes incrementally
5. **Test continuously**: Run `/build/test` after each change
6. **Verify**: Ensure behavior unchanged, only structure improved

### Example
```
User: The auth module needs refactoring, it's getting messy

Claude: [Invokes core-architect]
[Proposes refactoring plan with before/after structure]

User: Approved

Claude: [Refactors incrementally]
[Runs tests after each step]
[Documents architectural changes]
```

---

## Documentation Workflow

Keep docs up to date as code changes:

### When to Update Docs
- **After new features**: Update architecture, changelog
- **After bug fixes**: Update changelog
- **Architecture changes**: Update architecture doc
- **New APIs**: Document API contracts
- **Status changes**: Update status doc

### Quick Updates
```bash
# Update specific doc
/docs/update architecture
/docs/update changelog
/docs/update status

# Update all relevant docs
/docs/update
```

### Documentation Agent
For larger doc tasks, invoke core-docs directly:
```
User: @core-docs Please create comprehensive API documentation

Claude: [core-docs generates structured API docs]
```

---

## Emergency/Hotfix Workflow

For critical production issues:

### Workflow
1. **Create hotfix branch**: `git checkout -b hotfix/critical-bug`
2. **Reproduce**: Understand and isolate the issue
3. **Fix**: Make minimal, targeted fix
4. **Test**: Verify fix works and doesn't break anything
5. **Fast-track review**: Use core-security for security issues
6. **Deploy**: Follow expedited deployment process
7. **Post-mortem**: Document in changelog and status

### Example
```
User: Production is down, users can't log in!

Claude: [Investigates issue]
[Proposes minimal fix]
[Tests thoroughly]
[Updates changelog with security note]
Ready for immediate deployment.
```

---

## Pack Installation Workflow

Enable additional functionality via packs:

### Discovering Packs
```bash
# See available packs
ls packs/

# Read pack documentation
cat packs/[pack-name]/README.md
```

### Installing a Pack
```bash
# Enable a pack
./scripts/enable-pack.sh [pack-name]

# Verify installation
/ops/doctor
```

### Example Packs
- `session-tooling`: Advanced session management
- `skills-advanced`: Additional slash commands
- `webapp`: Frontend-specific tools
- `backend-python`: Python backend tools
- `db-postgres`: PostgreSQL integration
- `browser-testing`: Browser automation
- `lsp`: Language Server Protocol integration

---

## Workflow Selection Guide

| Scenario | Recommended Workflow |
|----------|---------------------|
| New project | PSB Workflow |
| Single feature | Single-Feature or Issue-Based |
| Multiple parallel features | Multi-Agent Worktree |
| Code review | Code Review Workflow |
| Cleaning up code | Refactoring Workflow |
| Production bug | Emergency/Hotfix |
| Adding functionality | Pack Installation |

---

## Best Practices

### General
- Run `/ops/doctor` periodically to catch issues early
- Keep `docs/03_STATUS.md` updated
- Use hooks to catch problems before commit
- Enable strictHooks for critical projects

### Git
- Commit frequently with clear messages
- Use worktrees for parallel work
- Keep branches short-lived
- Clean up merged branches

### Testing
- Write tests before or alongside code
- Run `/build/test` before committing
- Fix failing tests immediately
- Aim for high coverage on critical paths

### Documentation
- Update docs as you code, not after
- Use templates for consistency
- Keep diagrams simple (ASCII art works!)
- Link to code from docs with line numbers

### Agents
- Use the right agent for the job
- Give agents clear, specific instructions
- Review agent output before approving
- Provide feedback to improve results