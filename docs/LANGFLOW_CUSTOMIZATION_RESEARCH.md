# Langflow UI Customization Research

**Date**: January 8, 2026
**Purpose**: Explore approaches to hide/customize Langflow UI elements without sacrificing loading speed

---

## Executive Summary

| Approach | Performance Impact | FOUC Risk | Complexity | Maintenance | Recommended |
|----------|-------------------|-----------|------------|-------------|-------------|
| **CSS Injection (iframe)** | Minimal (+5ms) | None | Low | Medium | ✅ MVP |
| **Reverse Proxy (nginx)** | Low (+5-20ms) | None | Medium | Low | ✅ Production |
| **Backend-Only + Custom UI** | Best | None | High | Low | ✅ Long-term |
| **Langflow Embedded Chat** | Good | None | Low | Low | ✅ Chat-only |
| **JavaScript Injection** | Medium | HIGH | Low | Medium | ❌ Avoid |
| **Custom Docker Image** | None | None | Medium | Medium | ✅ Branding |
| **Deep Fork** | None | None | Very High | Very High | ❌ Avoid |

**Key Finding**: The nginx reverse proxy approach we attempted is architecturally sound but had implementation issues. There are simpler alternatives.

---

## Approach 1: Langflow Backend-Only Mode (RECOMMENDED FOR LONG-TERM)

### Overview
Run Langflow without its frontend, build a completely custom UI.

### Implementation
```bash
langflow run --backend-only
# or
LANGFLOW_BACKEND_ONLY=true
```

### API Endpoints Available
- `/api/v1/run/{flow_id}` - Execute flows
- `/api/v1/flows` - CRUD operations
- `/api/v1/components` - Component listing

### Pros
- **Zero Langflow branding** - Complete control
- **Best performance** - No unused UI code loaded
- **No maintenance burden** - Langflow is just an API
- **Custom UX** - Build exactly what you need

### Cons
- **High initial effort** - Must build flow editor UI
- **Feature parity** - Won't have full Langflow canvas features

### When to Use
- When you only need chat interface (not flow editing)
- When you want complete white-labeling
- Long-term production deployment

---

## Approach 2: Langflow Embedded Chat Widget (RECOMMENDED FOR CHAT-ONLY)

### Overview
Use official `langflow-chat` npm package for chat interfaces only.

### Installation
```bash
npm install langflow-chat
```

### Implementation
```html
<langflow-chat
  flow_id="your-flow-id"
  host_url="http://localhost:7860"
  window_title="Charlie Support"
  chat_window_style='{"backgroundColor": "#fff", "borderRadius": "12px"}'
  bot_message_style='{"backgroundColor": "#f3f4f6", "color": "#1f2937"}'
  user_message_style='{"backgroundColor": "#8b5cf6", "color": "#fff"}'
  chat_trigger_style='{"backgroundColor": "#8b5cf6"}'
/>
```

### Customization Options
| Property | Description |
|----------|-------------|
| `window_title` | Chat window title |
| `chat_window_style` | JSON styles for window |
| `bot_message_style` | Bot message appearance |
| `user_message_style` | User message appearance |
| `input_style` | Input field styling |
| `send_button_style` | Send button appearance |
| `chat_position` | Position (bottom-right, etc.) |
| `height` / `width` | Dimensions |

### Pros
- **Official support** - Maintained by Langflow team
- **Full styling control** - JSON-based theming
- **No Langflow UI visible** - Just chat interface
- **Lightweight** - Only loads what's needed

### Cons
- **Chat-only** - No flow editing capability
- **Requires Chat Input/Output** - Flows must use these components

### When to Use
- Playground chat interface
- Customer-facing chat widgets
- Embedded support bots

---

## Approach 3: CSS Injection via Same-Origin iframe (CURRENT APPROACH)

### Overview
Embed Langflow in iframe, inject CSS to hide elements.

### Requirements
- **Same-origin** - Frontend and Langflow on same domain
- Achieved via nginx reverse proxy OR same-origin deployment

### Implementation
```typescript
const injectCSS = () => {
  const doc = iframeRef.current?.contentDocument;
  if (!doc) return;

  const style = doc.createElement('style');
  style.textContent = `
    [data-testid="app-header"] { display: none !important; }
    [data-testid="shad-sidebar"] { display: none !important; }
  `;
  doc.head.appendChild(style);
};
```

### Known CSS Selectors (Langflow 1.x)
```css
/* Header */
[data-testid="app-header"] { display: none; }

/* Sidebar */
[data-testid="shad-sidebar"] { display: none; }

/* Social Links */
a[href*="github.com/langflow"] { display: none; }
a[href*="discord.gg"] { display: none; }

/* Canvas Controls */
[data-testid="canvas_controls"] { display: none; }
[data-testid="main_canvas_controls"] { display: none; }
```

### Pros
- **No FOUC** - CSS applied before render
- **Simple** - Standard browser API
- **Dynamic** - Can change levels on the fly

### Cons
- **Same-origin only** - Requires proxy setup
- **Selector brittleness** - May break on Langflow updates
- **Full Langflow loaded** - Memory overhead

### Why Our Implementation Had Issues
1. **Port confusion** - Links pointed to 7860, not 3080
2. **Caching** - Old CSS cached in browser
3. **nginx complexity** - sub_filter requires careful setup

---

## Approach 4: nginx Reverse Proxy with sub_filter

### Overview
nginx intercepts HTML responses, injects CSS before browser receives them.

### Implementation
```nginx
location /flow/ {
    proxy_pass http://langflow:7860;

    # Disable compression for sub_filter to work
    proxy_set_header Accept-Encoding "";

    # Inject CSS
    sub_filter '</head>' '<link rel="stylesheet" href="/overlay.css"></head>';
    sub_filter_once on;
    sub_filter_types text/html;
}
```

### Pros
- **Works cross-origin** - Proxy sits in middle
- **No FOUC** - Server-side injection
- **No iframe needed** - Direct page access

### Cons
- **Complex setup** - nginx configuration required
- **Buffering overhead** - Must buffer response
- **Debugging harder** - Can't inspect injected CSS easily

### When to Use
- Production multi-user deployments
- When iframe overhead is unacceptable

---

## Approach 5: Custom Docker Image (RECOMMENDED FOR BRANDING)

### Overview
Build custom Langflow image with CSS overrides baked in.

### Dockerfile
```dockerfile
FROM langflowai/langflow:latest

# Copy custom CSS
COPY custom.css /app/static/custom.css

# Copy custom nginx config to inject CSS
COPY nginx-override.conf /etc/nginx/conf.d/custom.conf
```

### custom.css
```css
/* Hide social links */
a[href*="github.com/langflow"] { display: none !important; }
a[href*="discord.gg"] { display: none !important; }
a[href*="twitter.com/langflow"] { display: none !important; }

/* Custom branding colors */
:root {
  --primary-color: #8b5cf6;
}
```

### Pros
- **No runtime overhead** - CSS baked into image
- **Simple deployment** - Just use custom image
- **Survives restarts** - No injection needed

### Cons
- **Rebuild on updates** - Must rebuild when Langflow updates
- **Limited to CSS** - Can't change React components

### When to Use
- Production deployments
- When you want consistent branding

---

## Approach 6: JavaScript Injection (NOT RECOMMENDED)

### Overview
Inject JavaScript that hides elements after page loads.

### Implementation
```javascript
const hideElements = () => {
  document.querySelectorAll('[data-testid="app-header"]').forEach(el => {
    el.style.display = 'none';
  });
};

document.addEventListener('DOMContentLoaded', hideElements);
setInterval(hideElements, 500); // For dynamic content
```

### Why NOT Recommended
- **FOUC** - Elements visible for 100-500ms before hiding
- **Flickering** - User sees elements appear then disappear
- **Performance** - Continuous DOM polling
- **Poor UX** - Visually jarring

---

## Approach 7: Environment Variables (LIMITED)

### Available Langflow Environment Variables
```bash
# Server
LANGFLOW_HOST=0.0.0.0
LANGFLOW_PORT=7860
LANGFLOW_WORKERS=1

# Database
LANGFLOW_DATABASE_URL=postgresql://...

# Authentication
LANGFLOW_AUTO_LOGIN=true
LANGFLOW_SUPERUSER=admin

# Performance
LANGFLOW_LAZY_LOAD_COMPONENTS=true

# Backend-only mode
LANGFLOW_BACKEND_ONLY=true
```

### Key Finding
**NO environment variable exists to hide header/branding.**

Variables like `LANGFLOW_HIDE_HEADER` or `LANGFLOW_EMBEDDED_MODE` do not exist in current Langflow versions.

---

## Approach 8: LANGFLOW_CUSTOM_THEME (UNRELIABLE)

### Overview
Langflow has a custom theme system via environment variable.

### Configuration
```bash
LANGFLOW_CUSTOM_THEME=/app/theme
```

### Directory Structure
```
theme/
├── theme.properties
├── resources/
│   ├── css/app.css
│   └── img/logo.png
```

### Known Issues
- **Frequently fails to apply** - GitHub Issue #8612
- **Inconsistent behavior** - Works in some versions, not others
- **Poor documentation** - Limited official guidance

### Recommendation
**Avoid for MVP** - Too unreliable. Use CSS injection or custom Docker image instead.

---

## Recommended Strategy for Teach Charlie AI

### Phase 1: MVP (Now)
**Use: Langflow Embedded Chat Widget**

For the playground chat interface, use the official widget:
```html
<langflow-chat
  flow_id="${workflow.langflow_flow_id}"
  host_url="http://localhost:7860"
  window_title="${agent.name}"
/>
```

**Benefits**:
- No header/branding visible
- Full styling control
- Official, maintained solution
- No nginx complexity

### Phase 2: Flow Editing
**Use: CSS Injection via iframe (same-origin)**

When users need to edit flows:
1. Serve frontend and Langflow from same origin (nginx proxy)
2. Inject CSS to hide unwanted elements
3. Use progressive disclosure levels

**OR**

**Use: Direct Langflow access (accept branding)**

If CSS injection is too fragile:
- Let users access Langflow directly at port 7860
- Accept that Langflow branding is visible
- Focus development effort on your custom features instead

### Phase 3: Production
**Use: Custom Docker Image + Backend-Only Mode**

1. Build custom Langflow image with CSS overrides
2. Use backend-only mode for API
3. Build custom flow editor UI (optional, high effort)

---

## Performance Comparison

| Approach | Load Time Impact | Memory | CPU | Complexity |
|----------|-----------------|--------|-----|------------|
| Embedded Chat Widget | +100ms | Low | Low | Simple |
| CSS Injection (iframe) | +200ms | +15MB | Low | Medium |
| nginx sub_filter | +20ms | Low | Low | Complex |
| Custom Docker Image | 0ms | Same | Same | Medium |
| Backend-Only + Custom UI | -500ms | -50MB | Lower | High |

---

## Appendix: Langflow Header Component Location

**File**: `langflow/src/frontend/src/components/headerComponent/index.tsx`

**Hardcoded Elements**:
- Logo: Chain emoji (⛓️)
- GitHub link: `https://github.com/langflow-ai/langflow`
- Discord link: `https://discord.gg/EqksyE2EX9`
- Twitter link: `https://twitter.com/langflow_ai`

**To fully customize**: Would require forking Langflow (not recommended for MVP).

---

## Conclusion

For **Teach Charlie AI MVP**:

1. **Chat Interface**: Use `langflow-chat` embedded widget
2. **Flow Editing**: Either:
   - Accept Langflow branding (simplest)
   - Use CSS injection via same-origin iframe (medium complexity)
   - Wait for Langflow to add official hiding options (passive)

3. **Avoid**:
   - Deep Langflow fork
   - JavaScript-based hiding (FOUC)
   - LANGFLOW_CUSTOM_THEME (unreliable)

The embedded chat widget approach gives you **zero Langflow branding** with **minimal complexity** for the primary user-facing feature (chat playground).
