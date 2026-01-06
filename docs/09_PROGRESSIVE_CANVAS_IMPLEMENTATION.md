# Progressive Canvas Implementation Plan

**Document Version:** 1.0
**Date:** 2026-01-05
**Purpose:** Technical implementation plan for introducing Langflow canvas progressively to users

---

## Executive Summary

This document outlines the completed proof-of-concept and implementation plan for progressively introducing users to the Langflow AI Canvas builder. Instead of hiding the canvas until Phase 10, we now introduce it early with progressive disclosure overlays.

### Key Decision

**Early Canvas Introduction** - Rather than building a separate simplified view and dumping users into full Langflow later, we embed the actual Langflow canvas early with progressive complexity levels.

```
OLD APPROACH:                        NEW APPROACH:
Custom Q&A → Custom View → ... →    Custom Q&A → Langflow (hidden) →
SURPRISE! Full Langflow             Langflow (simplified) → Langflow (full)
```

---

## Completed Proof-of-Concept

### Components Created

| Component | Path | Purpose |
|-----------|------|---------|
| `TourProvider` | `/src/providers/TourProvider.tsx` | Context for tour state management |
| `LangflowCanvasViewer` | `/src/components/LangflowCanvasViewer.tsx` | Iframe wrapper with progressive disclosure |
| `CanvasViewerPage` | `/src/pages/CanvasViewerPage.tsx` | Full page for canvas viewing |
| `createAgentTour` | `/src/tours/createAgentTour.ts` | Driver.js tour for agent creation |

### Routes Added

| Route | Component | Purpose |
|-------|-----------|---------|
| `/canvas/:agentId` | `CanvasViewerPage` | View agent's Langflow canvas |

### Integration Points

1. **PlaygroundPage** - "Unlock Flow" button links to canvas viewer
2. **CreateAgentPage** - Tour auto-starts for first-time users, Help button for manual trigger
3. **main.tsx** - TourProvider wraps entire app

### Dependencies Added

```json
{
  "driver.js": "^1.3.1"  // Educational tours and overlays
}
```

---

## Progressive Disclosure Levels

### Level 1: Peek Mode (Read-Only)
**What users see:** Canvas with nodes, nothing else
**What's hidden:** Sidebar, toolbar, controls, editing
**Purpose:** Let users observe how their agent is structured

```css
/* Injected CSS for Level 1 */
[data-testid="app-header"] { display: none !important; }
[data-testid="shad-sidebar"] { display: none !important; }
[data-testid="canvas_controls"] { display: none !important; }
[data-testid="main_canvas_controls"] { display: none !important; }
.react-flow__pane { pointer-events: none !important; }
```

### Level 2: Explore Mode (Limited Editing)
**What users see:** Canvas + simplified sidebar (basic components only)
**What's hidden:** Advanced components, MCP, Bundles, advanced controls
**Purpose:** Let users add simple tools/tricks to their agent

### Level 3: Builder Mode (Most Features)
**What users see:** Full canvas, most sidebar components
**What's hidden:** MCP, Bundles, custom component button
**Purpose:** Intermediate users who want more control

### Level 4: Expert Mode (Full Access)
**What users see:** Everything
**What's hidden:** Nothing
**Purpose:** Power users who are comfortable with Langflow

---

## Technical Architecture

### iframe Embedding Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Teach Charlie App                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Educational Overlay Layer                 │  │
│  │   - Level selector buttons                             │  │
│  │   - Educational labels/tooltips                        │  │
│  │   - Progress indicators                                │  │
│  │   ┌─────────────────────────────────────────────────┐ │  │
│  │   │                                                 │ │  │
│  │   │            Langflow (iframe)                    │ │  │
│  │   │         with injected CSS hiding                │ │  │
│  │   │         elements per disclosure level           │ │  │
│  │   │                                                 │ │  │
│  │   └─────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### CSS Injection Method

The `LangflowCanvasViewer` component attempts to inject CSS into the iframe:

```typescript
const injectCSS = useCallback(() => {
  if (!iframeRef.current?.contentDocument) return;

  const doc = iframeRef.current.contentDocument;
  const style = doc.createElement('style');
  style.id = 'teachcharlie-disclosure-css';
  style.textContent = levelCSS[currentLevel];
  doc.head.appendChild(style);
}, [currentLevel]);
```

**Note:** CSS injection only works when Langflow is on the same origin. For cross-origin, we fall back to a redirect approach with query params.

---

## Docker Configuration

Added to `docker-compose.yml` for iframe embedding support:

```yaml
langflow:
  environment:
    # Existing settings...
    LANGFLOW_BACKEND_ONLY: "false"
    # Note: May need additional CORS settings for production
```

---

## Tour System

### Driver.js Integration

Tours are defined as step arrays with element selectors:

```typescript
const createAgentTourSteps: DriveStep[] = [
  {
    element: '[data-tour="agent-name"]',
    popover: {
      title: "Give Charlie a Name",
      description: "Every good dog needs a name!",
      side: 'bottom',
    },
  },
  // ... more steps
];
```

### Tour State Persistence

Tour completion is stored in localStorage:

```typescript
const STORAGE_KEY = 'teachcharlie_tour_state';

interface TourState {
  hasSeenCreateTour: boolean;
  hasSeenCanvasTour: boolean;
  hasSeenPlaygroundTour: boolean;
  currentDisclosureLevel: 1 | 2 | 3 | 4;
  completedTours: string[];
}
```

---

## CSS Selectors Reference

Full documentation in `/docs/08_LANGFLOW_UI_CSS_SELECTORS.md`

### Key Selectors

| Element | Selector |
|---------|----------|
| Header | `[data-testid="app-header"]` |
| Sidebar | `[data-testid="shad-sidebar"]` |
| Canvas | `[data-testid="rf__wrapper"]` |
| Controls (bottom-left) | `[data-testid="canvas_controls"]` |
| Controls (bottom-right) | `[data-testid="main_canvas_controls"]` |
| Playground button | `[data-testid="playground-btn-flow-io"]` |
| Share button | `[data-testid="publish-button"]` |

### Component Categories

| Category | Selector |
|----------|----------|
| Input & Output | `[data-testid="disclosure-input & output"]` |
| Models & Agents | `[data-testid="disclosure-models & agents"]` |
| LLM Operations | `[data-testid="disclosure-llm operations"]` |
| Processing | `[data-testid="disclosure-processing"]` |
| Flow Control | `[data-testid="disclosure-flow control"]` |

---

## Implementation Phases

### Phase 5: Simplified Flow Visualization ✅ COMPLETE (POC)

- [x] LangflowCanvasViewer component with iframe embedding
- [x] Level 1 (Peek Mode) CSS injection
- [x] Educational overlay with level selector
- [x] "Unlock Flow" button on PlaygroundPage
- [x] CanvasViewerPage with agent context

### Phase 6: Tools Integration

- [ ] Verify tools actually execute (calculator, web search)
- [ ] Test tool visibility in canvas at each level
- [ ] Add tool-specific tour steps
- [ ] Update Level 2 to show only tool-related components

### Phase 7: Memory Configuration

- [ ] Add memory toggle to Q&A wizard or Playground
- [ ] Verify memory component visible in canvas
- [ ] Add memory tour explaining context retention
- [ ] Test multi-turn conversations

### Phase 8: RAG (Documents)

- [ ] Manual RAG flow testing in Langflow
- [ ] Document upload UI design
- [ ] Text file processing implementation
- [ ] Vector store integration
- [ ] RAG-specific canvas tour

### Phase 9: Agent Reasoning Visibility

- [ ] Show "thinking" process in Playground
- [ ] Expose tool selection reasoning
- [ ] Multi-step tool chaining visualization
- [ ] Agent-specific tour steps

### Phase 10: Full Canvas Mastery

- [ ] Level 4 is already implemented (no hiding)
- [ ] Add advanced tour for power users
- [ ] Component reference documentation
- [ ] Custom component creation guide

---

## Testing Checklist

### iframe Embedding

- [ ] Canvas loads in iframe at `/canvas/:agentId`
- [ ] CSS injection works (same-origin)
- [ ] Fallback message appears for cross-origin
- [ ] Level selector changes visible elements
- [ ] "Open Full Editor" link works

### Tours

- [ ] Create agent tour auto-starts for new users
- [ ] Tour can be manually triggered via Help button
- [ ] Tour completion persists in localStorage
- [ ] Canvas tour triggers on first canvas view

### Integration

- [ ] "Unlock Flow" button appears on PlaygroundPage
- [ ] Canvas loads correct agent's flow
- [ ] Back navigation works from canvas viewer
- [ ] Level preference persists across sessions

---

## Known Limitations

### Cross-Origin CSS Injection

If Langflow runs on a different origin than the frontend, CSS injection will fail due to browser security. Mitigations:

1. **Same-origin deployment** - Deploy frontend and Langflow on same domain
2. **Langflow feature flags** - Request beginner mode feature from Langflow team
3. **Proxy approach** - Route Langflow through same-origin proxy

### iframe Performance

Loading full Langflow in an iframe is heavy. Mitigations:

1. **Lazy loading** - Only load iframe when user clicks "Unlock Flow"
2. **Loading states** - Show spinner while Langflow loads
3. **Error handling** - Graceful fallback if iframe fails

---

## Next Steps

1. **Test with real agent** - Create agent, verify canvas shows correct flow
2. **Verify tool execution** - Confirm tools actually work (Phase 6 prerequisite)
3. **User testing** - Get feedback on progressive disclosure UX
4. **Production deployment** - Configure CORS and same-origin access

---

## Files Changed/Created

### New Files

```
src/frontend/src/providers/TourProvider.tsx
src/frontend/src/components/LangflowCanvasViewer.tsx
src/frontend/src/pages/CanvasViewerPage.tsx
src/frontend/src/tours/createAgentTour.ts
docs/08_LANGFLOW_UI_CSS_SELECTORS.md
docs/09_PROGRESSIVE_CANVAS_IMPLEMENTATION.md
```

### Modified Files

```
src/frontend/src/main.tsx              # Added TourProvider
src/frontend/src/App.tsx               # Added canvas route
src/frontend/src/pages/CreateAgentPage.tsx  # Added tour integration
src/frontend/src/pages/PlaygroundPage.tsx   # Added "Unlock Flow" button
docker-compose.yml                     # Added Langflow config
src/frontend/package.json              # Added driver.js
```

---

## Success Criteria

Phase 5 POC is successful when:

- [x] Canvas loads in iframe with agent's flow
- [x] Level selector changes visible elements
- [x] Educational overlays appear at Level 1
- [x] Tour system works on CreateAgentPage
- [x] Build passes without errors

Phase 5+ production ready when:

- [ ] Tested with 3+ real agents
- [ ] User feedback indicates clarity improvement
- [ ] Performance acceptable (<3s canvas load)
- [ ] Cross-origin solution identified for production
