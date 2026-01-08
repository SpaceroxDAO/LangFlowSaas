# Langflow Nginx Proxy Fix - Connection Error Resolution

**Date:** 2026-01-08
**Issue:** "Couldn't establish a connection" popup in Langflow canvas
**Status:** RESOLVED

---

## The Problem

When accessing Langflow through the nginx reverse proxy on port 7861, users saw a persistent "Couldn't establish a connection" modal that blocked interaction with the canvas.

**Symptoms:**
- Gray overlay blocking the UI
- "Couldn't establish a connection" popup appearing repeatedly
- Sidebar becoming unclickable intermittently
- Console showing `DialogContent requires a DialogTitle` warnings

---

## Root Cause

**The nginx `/health` location was using a PREFIX match instead of an EXACT match.**

```nginx
# BROKEN - Prefix match catches /health AND /health_check
location /health {
    return 200 "healthy\n";
}
```

This caused `/health_check` requests (Langflow's internal health endpoint) to return nginx's simple `healthy` string instead of Langflow's expected JSON response:

| Endpoint | Expected Response | Actual Response (broken) |
|----------|-------------------|--------------------------|
| `/health_check` | `{"status":"ok","chat":"ok","db":"ok"}` | `healthy` |

Langflow's frontend couldn't parse the response and assumed the connection was broken.

---

## The Fix

**Change the nginx health location to EXACT match using `=`:**

```nginx
# FIXED - Exact match only catches /health, not /health_check
location = /health {
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

**File:** `nginx/nginx.conf`
**Lines:** 119 (port 80) and 219 (port 7861)

---

## Additional Fixes Applied

### 1. CSS to Hide Connection Error Modal (Fallback)

Even with the root cause fixed, we added CSS to hide any transient connection modals:

**File:** `nginx/overlay/style.css`

```css
/* THE BLACK BACKDROP ONLY - must have bg-black class */
.fixed.inset-0.z-50[class*="bg-black"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
}

/* Hide dialog content (the white modal box) */
[role="dialog"],
[role="alertdialog"] {
    display: none !important;
    pointer-events: none !important;
}

/* Any z-50 fixed overlay should not block clicks */
.fixed.inset-0.z-50 {
    pointer-events: none !important;
}
```

### 2. Nginx WebSocket/Proxy Configuration

**File:** `nginx/nginx.conf` (port 7861 server block)

```nginx
location / {
    proxy_pass http://langflow;
    proxy_http_version 1.1;

    # WebSocket Support
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;

    # Standard proxy headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # CRITICAL: Disable buffering for WebSockets
    proxy_buffering off;

    # Extended timeouts (24 hours for WebSocket idle)
    proxy_read_timeout 86400s;
    proxy_send_timeout 86400s;

    # Remove Langflow's restrictive headers for iframe embedding
    proxy_hide_header X-Frame-Options;
    proxy_hide_header Content-Security-Policy;

    # CSS/JS Injection
    proxy_set_header Accept-Encoding "";
    sub_filter_types text/html;
    sub_filter_once on;
    sub_filter '</head>' '<link rel="stylesheet" href="/overlay/style.css?v=11"></head>';
    sub_filter '</body>' '<script src="/overlay/script.js?v=11"></script></body>';
}
```

### 3. WebSocket Map Variable

At the top of `nginx.conf`:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}
```

---

## Debugging Steps That Led to Solution

1. **Checked HAR file** - All HTTP requests returning 200 OK
2. **Checked Langflow logs** - Found "Exception in ASGI application" (red herring from earlier tests)
3. **Compared direct vs proxied health check:**
   ```bash
   # Direct (correct)
   curl http://localhost:7860/health_check
   # Returns: {"status":"ok","chat":"ok","db":"ok"}

   # Via nginx (broken)
   curl http://localhost:7861/health_check
   # Returns: healthy  <-- WRONG!
   ```
4. **Found the culprit** - `location /health` was a prefix match catching `/health_check`

---

## Verification Commands

```bash
# Test health_check returns JSON (not "healthy")
curl -s http://localhost:7861/health_check
# Expected: {"status":"ok","chat":"ok","db":"ok"}

# Test nginx's own health endpoint still works
curl -s http://localhost:7861/health
# Expected: healthy

# Restart nginx after config changes
docker-compose restart nginx
```

---

## Key Lessons

1. **Nginx location matching is prefix-based by default** - Use `location = /path` for exact matches
2. **Always compare direct vs proxied responses** when debugging proxy issues
3. **HAR files don't capture WebSocket connections well** - Check browser Network tab WS filter
4. **CSS can hide modals but won't fix the underlying issue** - Always find the root cause
5. **Langflow's `/health_check` endpoint returns JSON** - The frontend parses this to determine connection status

---

## Files Modified

| File | Change |
|------|--------|
| `nginx/nginx.conf` | Fixed `/health` to `= /health` (exact match) |
| `nginx/overlay/style.css` | Added CSS to hide error modals (fallback) |
| `nginx/overlay/script.js` | Simplified overlay script |

---

## Final CSS/JS Approach (White-Label Only)

After fixing the root cause, we simplified the overlay files to **only handle white-labeling**:

### What We HIDE (branding):
- Langflow header/logo (`[data-testid="app-header"]`)
- GitHub/Discord/Twitter links
- Any "Langflow" text in navigation

### What We KEEP (functional UI):
- All dialogs (Playground, Logs, Settings)
- All dropdowns and menus
- All tooltips
- Component configuration panels
- Modal backdrops (needed for click-outside-to-close)

**Key principle:** Don't hide `[role="dialog"]`, `[data-radix-portal]`, or `.fixed.inset-0.z-50` - these are functional UI elements.

---

## Related Issues

- Langflow doesn't support subpath deployment (`<base href="/">` is hardcoded)
- See: https://github.com/langflow-ai/langflow/issues/5468
- Solution: Serve Langflow on separate port (7861) instead of subpath (/langflow/)
