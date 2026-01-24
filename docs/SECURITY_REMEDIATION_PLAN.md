# Security Remediation Plan

**Created:** 2026-01-24
**Status:** In Progress

---

## Phase 1: Critical Dependency Fix (Immediate)

### 1.1 Update react-router-dom
- **Current:** 7.11.0
- **Target:** 7.13.0+
- **Fixes:** 3 CVEs (XSS, CSRF)

```bash
cd src/frontend
npm update react-router-dom@^7.13.0
npm audit fix
```

---

## Phase 2: Backend Security Fixes

### 2.1 Enforce Encryption Key in Production
**File:** `src/backend/app/main.py`
**Change:** Convert warning to hard failure

### 2.2 Fix Rate Limiting Fallback
**File:** `src/backend/app/middleware/redis_rate_limit.py`
**Change:** Deny requests when Redis unavailable (configurable)

### 2.3 Fix JWT Error Messages
**File:** `src/backend/app/middleware/clerk_auth.py`
**Change:** Return generic error messages

### 2.4 Add Path Traversal Protection
**File:** `src/backend/app/api/files.py`
**Change:** Validate resolved path is within uploads directory

### 2.5 Add MCP Command Validation
**File:** `src/backend/app/services/mcp_server_service.py`
**Change:** Whitelist allowed commands

### 2.6 Add Security Headers Middleware
**File:** `src/backend/app/main.py`
**Change:** Add X-Content-Type-Options, X-Frame-Options headers

---

## Phase 3: Frontend Security Fixes

### 3.1 Fix Embed Code XSS
**File:** `src/frontend/src/components/EmbedModal.tsx`
**Change:** HTML-escape agent name and other user content

### 3.2 Tighten Iframe Sandbox
**File:** `src/frontend/src/components/LangflowCanvasViewer.tsx`
**Change:** Review and potentially restrict sandbox permissions

### 3.3 Validate URL Parameters
**File:** `src/frontend/src/components/LangflowCanvasViewer.tsx`
**Change:** Add regex validation for componentFilter

---

## Phase 4: Infrastructure Fixes

### 4.1 Remove Staging Domain from Prod CORS
**File:** `nginx/nginx.prod.conf`
**Change:** Remove staging.teachcharlie.ai from allowed origins

### 4.2 Pin Docker Image Versions
**Files:** `langflow.Dockerfile`, `src/backend/Dockerfile`, `src/frontend/Dockerfile`
**Change:** Use specific version tags instead of :latest

### 4.3 Add Pre-commit Hook Configuration
**File:** `.pre-commit-config.yaml`
**Change:** Add gitleaks for secret detection

---

## Phase 5: Documentation

### 5.1 Create Security Policy
**File:** `docs/SECURITY_POLICY.md`
**Content:** Vulnerability disclosure, data privacy, contacts

### 5.2 Create Incident Response Plan
**File:** `docs/INCIDENT_RESPONSE_PLAN.md`
**Content:** Severity levels, escalation, communication

---

## Phase 6: Testing

### 6.1 Run E2E Tests
```bash
cd src/frontend
npx playwright test
```

### 6.2 Manual Verification
- Test agent creation flow
- Test playground chat
- Test canvas editing
- Verify error handling

---

## Execution Order

1. **Update dependencies** (critical security fix)
2. **Backend fixes** (security hardening)
3. **Frontend fixes** (XSS prevention)
4. **Infrastructure** (deployment readiness)
5. **Documentation** (compliance)
6. **Testing** (verification)

---

## Rollback Plan

If any fix breaks functionality:
1. Revert the specific commit
2. Document the issue
3. Create separate fix branch
4. Test fix in isolation before re-merging
