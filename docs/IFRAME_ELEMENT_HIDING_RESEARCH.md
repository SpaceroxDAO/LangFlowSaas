# Iframe Element Hiding Research for Langflow Canvas

**Date**: January 8, 2026
**Context**: Hiding UI elements inside a Langflow iframe embedded in the Teach Charlie AI platform

---

## Problem Statement

The user has:
- A React app at `localhost:3001` with custom wrapper UI (header, complexity levels, educational overlay)
- Langflow embedded in an iframe at `localhost:7860`
- **Cross-origin restriction**: JavaScript cannot access `contentDocument` of cross-origin iframes

Currently visible Langflow elements that need hiding:
- Langflow logo (chain emoji icon, top-left)
- "PROJECTS" sidebar with component categories
- GitHub/Discord badges (top-right)
- Various controls (Playground, Share, Lock buttons)

---

## Current Implementation Analysis

**File**: `/src/frontend/src/components/LangflowCanvasViewer.tsx`

```typescript
// Lines 129-133: Environment setup
const langflowHost = import.meta.env.VITE_LANGFLOW_HOST || 'http://localhost:7860';
const canvasUrl = `${langflowHost}/flow/${flowId}`;

// Lines 136-160: CSS injection (only works same-origin)
const injectCSS = useCallback(() => {
  if (!iframeRef.current?.contentDocument) return;
  try {
    const doc = iframeRef.current.contentDocument;
    const style = doc.createElement('style');
    style.textContent = levelCSS[currentLevel];
    doc.head.appendChild(style);
  } catch (e) {
    // Cross-origin will block this - expected in production
    console.warn('Could not inject CSS (cross-origin):', e);
  }
}, [currentLevel]);
```

**Root Cause**: Different ports (`localhost:3001` vs `localhost:7860`) = different origins = blocked `contentDocument` access.

---

## Solution Approaches

### Approach 1: Same-Origin via Reverse Proxy (RECOMMENDED for Flow Editor)

**Concept**: Serve both apps from same origin so `contentDocument` CSS injection works.

#### Option A: nginx Reverse Proxy (Production)

```nginx
upstream react_app {
    server localhost:3001;
}

upstream langflow_app {
    server localhost:7860;
}

server {
    listen 80;
    server_name localhost;

    # React app on root
    location / {
        proxy_pass http://react_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Langflow on /langflow path
    location /langflow/ {
        proxy_pass http://langflow_app/;
        proxy_http_version 1.1;

        # WebSocket support (critical for Langflow)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;

        # Path rewriting
        proxy_redirect http://localhost:7860/ /langflow/;
    }
}
```

**Usage in React**:
```typescript
// Same origin now - CSS injection works
<iframe src="/langflow/flow/{flowId}" />
```

#### Option B: Vite Dev Proxy (Development)

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 3001,
    proxy: {
      '/langflow': {
        target: 'http://localhost:7860',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/langflow/, ''),
        ws: true,  // WebSocket support
      },
    }
  }
})
```

**Pros**:
- CSS injection via `contentDocument` works perfectly
- Zero FOUC (flash of unstyled content)
- Dynamic level changes work instantly

**Cons**:
- Requires proxy configuration
- WebSocket handling needs care
- Path rewriting complexity

---

### Approach 2: nginx sub_filter (Server-Side Injection)

**Concept**: nginx modifies HTML response before browser receives it - injects CSS/JS at the server level.

```nginx
location /langflow/ {
    proxy_pass http://langflow_app/;

    # CRITICAL: Disable upstream compression
    proxy_set_header Accept-Encoding "";

    # Inject CSS before </head>
    sub_filter '</head>' '<link rel="stylesheet" href="/overlay.css"></head>';

    # Inject JS before </body>
    sub_filter '</body>' '<script src="/overlay.js"></script></body>';

    sub_filter_once off;
    sub_filter_types text/html;
}
```

**overlay.css**:
```css
/* Always hide branding */
[data-testid="app-header"] { display: none !important; }
a[href*="github.com/langflow"] { display: none !important; }
a[href*="discord.gg"] { display: none !important; }

/* Level-based hiding via body class */
body.level-2 [data-testid="shad-sidebar"] { display: none !important; }
body.level-2 [data-testid="sidebar-nav-mcp"] { display: none !important; }
```

**Pros**:
- Works cross-origin (proxy handles everything)
- CSS loads before render (no FOUC)
- Server-side = secure, no client tampering

**Cons**:
- Requires nginx configuration
- Must disable upstream gzip
- Level changes require page reload or JS coordination

---

### Approach 3: langflow-chat Widget (RECOMMENDED for Chat Only)

**Concept**: Use Langflow's official embedded chat widget - zero branding, full styling control.

```bash
npm install langflow-chat
```

```tsx
import { LangflowChat } from "langflow-chat";

<LangflowChat
  flow_id={workflow.langflow_flow_id}
  host_url="http://localhost:7860"
  window_title={agentName}
  chat_window_style='{"backgroundColor": "#fff", "borderRadius": "12px"}'
  bot_message_style='{"backgroundColor": "#f3f4f6", "color": "#1f2937"}'
  user_message_style='{"backgroundColor": "#8b5cf6", "color": "#fff"}'
/>
```

**Pros**:
- Official Langflow solution
- Zero Langflow branding visible
- Full CSS control via props
- No proxy configuration needed
- Works cross-origin natively

**Cons**:
- Chat interface ONLY (no flow editing)
- Requires Chat Input/Output components in flows

---

### Approach 4: Node.js Express Proxy (Development Alternative)

**Concept**: Node.js proxy with response modification - automatic gzip handling.

```javascript
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

app.use('/langflow', createProxyMiddleware({
    target: 'http://localhost:7860',
    changeOrigin: true,
    selfHandleResponse: true,

    on: {
        proxyRes: responseInterceptor(async (buffer, proxyRes, req, res) => {
            if (proxyRes.headers['content-type']?.includes('text/html')) {
                let html = buffer.toString('utf8');
                html = html.replace('</head>', '<link rel="stylesheet" href="/overlay.css"></head>');
                return html;
            }
            return buffer;
        }),
    },
}));
```

**Pros**:
- Automatic gzip handling
- Full JavaScript flexibility
- Good for development

**Cons**:
- Memory intensive (buffers entire response)
- Slower than nginx
- Requires Node.js runtime

---

## CSS Selector Coverage Analysis

### Selectors Currently Implemented (LangflowCanvasViewer.tsx)

| Level | Elements Hidden |
|-------|-----------------|
| 1 | Header, Sidebar, Canvas controls, Nodes (read-only) |
| 2 | Header, MCP tab, Bundles tab, Advanced categories |
| 3 | MCP tab, Bundles tab, Custom component button |
| 4 | None (full Langflow UI) |

### Identified Selector Gaps

| Element | Selector | Status |
|---------|----------|--------|
| Langflow logo | None found | **CRITICAL GAP** |
| GitHub badge | `a[href*="github.com"]` | Not implemented |
| Discord badge | `a[href*="discord.gg"]` | Not implemented |
| Playground button | `[data-testid="playground-btn-flow-io"]` | Not implemented |
| Share button | `[data-testid="publish-button"]` | Level 1 only |
| Bottom tabs | `[data-testid="search"]`, etc. | Not implemented |
| "Discover more" link | None found | **GAP** |

### Recommended Additional CSS Rules

```css
/* Add to Level 2 CSS */
[data-testid="publish-button"] { display: none !important; }
[data-testid="playground-btn-flow-io"] { display: none !important; }
a[href*="github.com/langflow"] { display: none !important; }
a[href*="discord.gg"] { display: none !important; }

/* Add to Level 1 CSS */
[data-testid="lock-status"] { display: none !important; }
```

---

## Recommended Strategy

### For MVP Playground (Chat Interface)

**Use: langflow-chat Widget**

- No flow editing needed for playground chat
- Zero branding visible
- Official, maintained solution
- No proxy complexity

### For Flow Canvas Editor

**Development**: Vite dev proxy + CSS injection via `contentDocument`

```typescript
// vite.config.ts
proxy: {
  '/langflow': {
    target: 'http://localhost:7860',
    ws: true,
    rewrite: (path) => path.replace(/^\/langflow/, ''),
  }
}

// LangflowCanvasViewer.tsx
const langflowHost = '/langflow';  // Same origin via proxy
```

**Production**: nginx reverse proxy + sub_filter CSS injection

---

## Implementation Checklist

- [ ] Update `vite.config.ts` with `/langflow` proxy
- [ ] Update `LangflowCanvasViewer.tsx` to use `/langflow` path
- [ ] Add missing CSS selectors (GitHub, Discord badges)
- [ ] Create `overlay.css` for nginx sub_filter injection
- [ ] Set up nginx configuration for production
- [ ] Test WebSocket connections through proxy
- [ ] Consider langflow-chat widget for PlaygroundPage

---

## Performance Comparison

| Approach | FOUC Risk | Complexity | Performance | Production Ready |
|----------|-----------|------------|-------------|------------------|
| Same-origin + contentDocument | None | Medium | Excellent | Yes |
| nginx sub_filter | None | Medium | Excellent | Yes |
| langflow-chat widget | None | Low | Good | Yes |
| Node.js proxy | None | Medium | Good | Development only |
| Direct iframe (current) | N/A | Low | N/A | **Broken** (cross-origin) |

---

## Key Takeaways

1. **The current implementation cannot work** without same-origin setup - cross-origin `contentDocument` access is blocked by browsers.

2. **Two proven paths forward**:
   - **Chat**: Use `langflow-chat` widget (simplest, no branding)
   - **Flow Editor**: Set up nginx or Vite proxy for same-origin serving

3. **CSS selectors are well-documented** - the research doc has 40+ selectors, but only ~15 are currently implemented.

4. **Langflow logo has no known selector** - may need structural CSS or component investigation.
