# Branch Protection Rules

This document outlines the recommended branch protection rules for the Teach Charlie AI repository.

## Main Branch (`main`)

### Required Settings in GitHub Repository Settings > Branches

1. **Require a pull request before merging**
   - [x] Require approvals: 1 (or 2 for teams > 3 developers)
   - [x] Dismiss stale pull request approvals when new commits are pushed
   - [x] Require review from code owners (if CODEOWNERS file exists)

2. **Require status checks to pass before merging**
   - [x] Require branches to be up to date before merging
   - Required status checks:
     - `Backend Lint & Type Check`
     - `Backend Unit Tests`
     - `Frontend Lint & Type Check`
     - `E2E Tests (Playwright)`
     - `All Tests Passed`
     - `Security Gate` (from security.yml)
     - `Claude Code Review` (from ai-review.yml)

3. **Require conversation resolution before merging**
   - [x] All PR comments must be resolved

4. **Require signed commits** (Optional but recommended)
   - [ ] Require commits to be signed with GPG

5. **Require linear history**
   - [x] Squash merging only (keeps history clean)

6. **Do not allow bypassing the above settings**
   - [x] Apply rules to administrators

7. **Restrict who can push to matching branches**
   - Only allow pushes via PR merge

## How to Configure

1. Go to **Settings** > **Branches** in GitHub
2. Click **Add branch protection rule**
3. Set branch name pattern: `main`
4. Configure the settings above
5. Click **Create** or **Save changes**

## CI/CD Workflows Summary

| Workflow | Trigger | Blocks PR? | Purpose |
|----------|---------|------------|---------|
| `test.yml` | PR, Push | Yes | Runs all tests (backend + frontend) |
| `security.yml` | PR, Push, Weekly | Yes | Security scans (deps, SAST, secrets, containers) |
| `ai-review.yml` | PR | No (comment only) | AI code review with Claude |
| `deploy.yml` | Release, Manual | N/A | Production deployment |

## Security Workflow Blocking Behavior

The security workflow is configured to **fail the build** if:
- Python dependency vulnerabilities are found (pip-audit)
- Node.js high/critical vulnerabilities are found (npm audit)
- Semgrep SAST finds security issues
- **Secrets are detected in code** (Gitleaks) - ALWAYS blocks
- Container image has CRITICAL/HIGH vulnerabilities (Trivy)

## Deployment Protection

The `deploy.yml` workflow includes:
- **Pre-deployment checks**: Verifies tests passed
- **AI Risk Assessment**: Analyzes changes for high-risk patterns
- **Manual approval**: Can be required via GitHub Environments
- **Post-deployment verification**: Smoke tests after deploy

### Setting Up Deployment Protection

1. Go to **Settings** > **Environments**
2. Create or edit `production` environment
3. Enable **Required reviewers** and add approvers
4. Enable **Wait timer** (e.g., 5 minutes for rollback window)
5. Optionally add deployment branch rules (only `main`)
