# Security Audit Report - Teach Charlie AI

**Date:** 2026-01-24
**Auditor:** Claude Code Security Analysis
**Status:** 🔴 CRITICAL - Immediate action required before production deployment

---

## Executive Summary

A comprehensive security audit of the Teach Charlie AI codebase revealed **71 total issues** across 7 categories. The most critical finding is that **active API keys have been committed to the git repository**, requiring immediate revocation.

| Category | Severity | Critical | High | Medium | Low |
|----------|----------|----------|------|--------|-----|
| Secrets Management | 🔴 CRITICAL | 5 | 3 | 0 | 0 |
| Frontend Dependencies | 🔴 CRITICAL | 3 | 0 | 2 | 0 |
| Backend Security | 🟠 HIGH | 0 | 6 | 10 | 4 |
| Infrastructure | 🟠 HIGH | 0 | 6 | 6 | 2 |
| Database | 🟠 HIGH | 1 | 3 | 4 | 1 |
| Frontend Code | 🟡 MEDIUM | 0 | 0 | 4 | 1 |
| Documentation | 🟡 MEDIUM | 0 | 0 | 10+ | 0 |

---

## 1. CRITICAL: Secrets Exposed in Git

### 1.1 Active API Keys in `.env`

**Location:** `/LangflowSaaS/.env` (committed to repository)

| Secret | Type | Exposed Value (Redacted) | Risk Level |
|--------|------|--------------------------|------------|
| `OPENAI_API_KEY` | Production | `sk-A1blNQxoY6_V-bLfNL4Y...` | 🔴 CRITICAL |
| `ANTHROPIC_API_KEY` | Production | `sk-ant-api03-uIWiUVaKgBiW...` | 🔴 CRITICAL |
| `COMPOSIO_API_KEY` | Production | `ak_PqouA1y8ccDrpg3JrSrU` | 🔴 CRITICAL |
| `CLERK_SECRET_KEY` | Test | `sk_test_pwIhtqsz4pa4q0pg...` | 🟠 HIGH |
| `LANGFLOW_SECRET_KEY` | Production | `2qw3f8SjUruMFkNIAamhU5v...` | 🟠 HIGH |
| `CLERK_PUBLISHABLE_KEY` | Test | `pk_test_ZGV2b3RlZC1ndXBw...` | 🟡 MEDIUM |

### 1.2 User Credentials in `.env.test`

**Location:** `/LangflowSaaS/src/frontend/e2e/.env.test`

| Credential | Value | Risk |
|------------|-------|------|
| `TEST_USER_EMAIL` | `adamxboyle@gmail.com` | Real email exposed |
| `TEST_USER_PASSWORD` | `Skillfire314!` | Plaintext password |

### 1.3 Remediation Steps

1. **Immediately revoke all exposed API keys:**
   - OpenAI: https://platform.openai.com/account/api-keys
   - Anthropic: https://console.anthropic.com/
   - Composio: https://app.composio.dev/settings
   - Clerk: https://dashboard.clerk.com/

2. **Change the exposed Gmail password**

3. **Remove `.env` from git history:**
   ```bash
   # Using BFG Repo-Cleaner (recommended)
   bfg --delete-files .env
   git reflog expire --expire=now --all && git gc --prune=now --aggressive

   # Or using git filter-branch
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env .env.test" \
     --prune-empty --tag-name-filter cat -- --all
   ```

4. **Add pre-commit hooks to prevent future leaks:**
   ```yaml
   # .pre-commit-config.yaml
   repos:
     - repo: https://github.com/gitleaks/gitleaks
       rev: v8.18.0
       hooks:
         - id: gitleaks
   ```

---

## 2. CRITICAL: Frontend Dependency Vulnerabilities

### 2.1 react-router-dom (3 CVEs)

**Current Version:** 7.11.0
**Fixed Version:** 7.13.0+

| CVE ID | Severity | Type | CVSS | Description |
|--------|----------|------|------|-------------|
| GHSA-2w69-qvjg-hvjx | HIGH | XSS | 8.0 | XSS via Open Redirects |
| GHSA-8v8x-cx79-35w7 | HIGH | XSS | 8.2 | SSR XSS in ScrollRestoration |
| GHSA-h5cw-625j-3rxh | MODERATE | CSRF | 6.5 | CSRF in Action Processing |

### 2.2 Remediation

```bash
cd src/frontend
npm update react-router-dom@7.13.0
npm audit fix
npm run build  # Verify build works
npx playwright test  # Run E2E tests
```

---

## 3. HIGH: Backend Security Issues

### 3.1 Rate Limiting Bypass

**File:** `src/backend/app/middleware/redis_rate_limit.py:105-108`

**Issue:** When Redis is unavailable, rate limiting is completely disabled:
```python
if redis_client is None:
    return True, "", {"fallback": True}  # All requests allowed!
```

**Fix:** Implement deny-by-default or in-memory fallback.

### 3.2 MCP Server Command Injection Risk

**File:** `src/backend/app/services/mcp_server_service.py:156-157`

**Issue:** User-supplied commands stored without validation:
```python
command=data.command,  # User-supplied, no whitelist
args=data.args,
```

**Fix:** Validate commands against a whitelist of known safe executables.

### 3.3 JWT Error Message Disclosure

**File:** `src/backend/app/middleware/clerk_auth.py:130-143`

**Issue:** Detailed JWT errors returned to clients:
```python
detail=f"Invalid token: {str(e)}"  # Leaks validation details
```

**Fix:** Return generic error message: `"Authentication failed"`

### 3.4 Path Traversal on File Download

**File:** `src/backend/app/api/files.py:245-251`

**Issue:** File path not validated with `resolve()` before serving.

**Fix:** Add path validation:
```python
safe_path = file_path.resolve()
if not str(safe_path).startswith(str(UPLOADS_DIR.resolve())):
    raise HTTPException(status_code=403, detail="Access denied")
```

### 3.5 Missing Security Headers

**File:** `src/backend/app/main.py:306-323`

**Missing Headers:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security`

### 3.6 In-Memory Rate Limiter Memory Leak

**File:** `src/backend/app/middleware/rate_limit.py:28-30`

**Issue:** Dictionaries grow unbounded with unique IPs.

---

## 4. HIGH: Infrastructure Security Issues

### 4.1 HTTPS/SSL Not Configured

**File:** `nginx/nginx.prod.conf:278-296`

**Issue:** HTTPS server block is commented out. HTTP→HTTPS redirect disabled.

**Fix:** Uncomment SSL configuration and provide valid certificates.

### 4.2 HSTS Header Disabled

**File:** `nginx/nginx.prod.conf:292-293`

**Issue:** `Strict-Transport-Security` header commented out.

### 4.3 Staging Domain in Production CORS

**File:** `nginx/nginx.prod.conf:31`

**Issue:** `https://staging.teachcharlie.ai` included in production CORS.

**Fix:** Remove before production deployment.

### 4.4 Docker Security (Development)

| Issue | File | Status |
|-------|------|--------|
| Root user containers | `docker-compose.yml:97,153` | Fixed in prod ✅ |
| Docker socket mount | `docker-compose.yml:184` | Fixed in prod ✅ |
| Exposed internal ports | `docker-compose.yml:54-77` | Fixed in prod ✅ |
| Default credentials | `docker-compose.dev.yml:24` | Needs attention |
| No resource limits | All compose files | Missing |

### 4.5 Unpinned Docker Images

| Image | Current | Recommendation |
|-------|---------|----------------|
| `langflowai/langflow` | `:latest` | Pin to specific version |
| `python` | `:3.11-slim` | Pin to `:3.11.9-slim` |
| `node` | `:20-alpine` | Pin to `:20.21.0-alpine` |
| `nginx` | `:alpine` | Pin to `:1.27.3-alpine` |

---

## 5. HIGH: Database Security Issues

### 5.1 Encryption Not Enforced

**File:** `src/backend/app/main.py:162-167`

**Issue:** Missing `ENCRYPTION_KEY` only logs warning, doesn't stop startup:
```python
if is_production and not settings.encryption_key:
    logger.critical("...")  # Warning only!
```

**Fix:** Raise exception to prevent unencrypted production.

### 5.2 Unencrypted Data Fallback

**File:** `src/backend/app/services/settings_service.py:~275`

**Issue:** If decryption fails, plaintext data is returned without warning.

### 5.3 Message Metadata Exposure

**File:** `src/backend/app/models/message.py:61-65`

**Issue:** LLM response metadata returned to clients without redaction.

---

## 6. MEDIUM: Frontend Security Issues

### 6.1 Iframe Sandbox Too Permissive

**File:** `src/frontend/src/components/LangflowCanvasViewer.tsx:161-172`

**Issue:** Sandbox allows `allow-same-origin` + `allow-scripts`:
```tsx
sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
```

**Fix:** Remove `allow-same-origin` and `allow-scripts` if possible.

### 6.2 Embed Code XSS

**File:** `src/frontend/src/components/EmbedModal.tsx:115-122`

**Issue:** `agent.name` inserted into embed code without HTML escaping:
```tsx
window_title="${agent.name}"  // XSS if name contains quotes
```

**Fix:** Escape HTML special characters before insertion.

### 6.3 URL Parameter Injection

**File:** `src/frontend/src/components/LangflowCanvasViewer.tsx:110-119`

**Issue:** `componentFilter` and `uiConfig` not validated before URL construction.

---

## 7. MEDIUM: Documentation Gaps

### Missing Documents

| Document | Purpose | Priority |
|----------|---------|----------|
| `SECURITY_POLICY.md` | Vulnerability disclosure, data privacy | HIGH |
| `INCIDENT_RESPONSE_PLAN.md` | Escalation procedures, severity levels | HIGH |
| `BACKUP_DISASTER_RECOVERY.md` | Restore procedures, RTO/RPO | HIGH |
| `MONITORING_LOGGING_STRATEGY.md` | Alert thresholds, log retention | MEDIUM |
| `STAGING_ENVIRONMENT.md` | Staging setup, promotion process | MEDIUM |
| `AUTHENTICATION_SECURITY.md` | Token lifecycle, session management | MEDIUM |

### Inconsistencies Found

1. Docker compose command syntax varies (`docker-compose` vs `docker compose`)
2. Langflow port references inconsistent (7860 vs 7861)
3. Phase status conflicts between STATUS.md and PROJECT_SPEC.md

---

## 8. Dependency Audit Summary

### Python (Backend)

| Package | Version | Status |
|---------|---------|--------|
| fastapi | 0.115.6 | ✅ Current |
| cryptography | 44.0.0 | ✅ Current |
| pyjwt | 2.10.1 | ✅ Current |
| sentry-sdk | ≥2.0.0 | ⚠️ Loose pinning |
| composio-core | ≥0.7.0 | ⚠️ Loose pinning |

### Node.js (Frontend)

| Package | Current | Latest | Status |
|---------|---------|--------|--------|
| react-router-dom | 7.11.0 | 7.13.0 | 🔴 VULNERABLE |
| @sentry/react | 8.55.0 | 10.36.0 | ⚠️ 2 majors behind |
| @clerk/clerk-react | 5.59.2 | 5.59.6 | ⚠️ Minor update |

---

## 9. Compliance Status

| Standard | Status | Key Gaps |
|----------|--------|----------|
| OWASP Top 10 | ⚠️ PARTIAL | A02: Cryptographic Failures, A06: Vulnerable Components |
| 12-Factor App | ⚠️ PARTIAL | Secrets in source control |
| SOC 2 | ❌ NOT READY | Missing audit logging, key rotation, incident response |
| GDPR | ⚠️ PARTIAL | Encryption optional, no retention policy |

---

## 10. What's Done Well ✅

1. **DEV_MODE safeguards** - Multiple layers prevent auth bypass in production
2. **SQLAlchemy ORM** - No SQL injection vectors found
3. **User isolation** - All queries properly filter by user_id
4. **JWT validation** - Production-grade Clerk integration
5. **Secret sanitization** - Good log masking for API keys
6. **Production docker-compose** - Proper network isolation, non-root containers
7. **Fernet encryption** - Correctly implemented when enabled
8. **E2E test coverage** - 15+ tests covering critical paths

---

## 11. Remediation Priority

### Immediate (Today)
1. Revoke all exposed API keys
2. Update react-router-dom to 7.13.0+
3. Run E2E tests to verify functionality

### This Week
4. Enable HTTPS/SSL in nginx
5. Enforce encryption key requirement
6. Remove staging domain from prod CORS
7. Add pre-commit hooks for secret detection
8. Create security policy document

### Before Launch
9. Create incident response plan
10. Fix iframe sandbox permissions
11. Fix embed code escaping
12. Pin Docker image versions
13. Add resource limits to containers

### Ongoing
14. Monthly dependency reviews
15. Quarterly security assessments
16. Document encryption key rotation

---

**Report Generated:** 2026-01-24
**Next Review:** Before production deployment
