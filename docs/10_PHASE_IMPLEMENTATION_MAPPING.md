# Phase Implementation Mapping

**Document Version:** 1.0
**Date:** 2026-01-05
**Purpose:** Map proof-of-concept findings to the 10-phase progressive learning curriculum

---

## Overview

This document maps our technical findings and proof-of-concept work to each phase of the progressive learning curriculum outlined in `06_PROGRESSIVE_LEARNING_CURRICULUM.md`.

### Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Complete - Ready to use |
| 🔨 | Built - Needs testing/refinement |
| 📋 | Planned - Implementation path clear |
| ⚠️ | Blocked - Needs prerequisite or research |
| ❌ | Not started |

---

## Phase 0: The Philosophy
**"AI is like a puppy"**

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Conceptual introduction (no tech) | ✅ | Workshop/video content (external) |
| "Dog Trainer" metaphor established | ✅ | Already in all documentation |

**Technical Requirements:** None - purely educational content

**What We Built:** N/A (content-driven phase)

---

## Phase 1: Meet Charlie
**"Experience a trained dog"**

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Demo agent users can interact with | ✅ | PlaygroundPage exists |
| Simple chat interface | ✅ | Custom chat UI built |
| Pre-configured demo agent | 📋 | Need to create "Demo Charlie" agent |
| Suggested starter questions | 📋 | Add to PlaygroundPage empty state |

**Technical Requirements:**
- Chat interface ✅ (`PlaygroundPage.tsx`)
- Backend chat API ✅ (`/api/chat`)
- Demo agent in database 📋

**What We Built:**
- Full chat playground with markdown support
- Message history with auto-scroll
- Loading states and error handling

**Still Needed:**
```typescript
// Add to PlaygroundPage empty state
const STARTER_QUESTIONS = [
  "What can you help me with?",
  "Tell me about yourself",
  "What are your capabilities?",
];
```

---

## Phase 2: Give Charlie a Job
**"Basic obedience training" - 3-Step Q&A**

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| 3-step Q&A wizard | ✅ | `CreateAgentPage.tsx` |
| Step 1: Identity (Who is Charlie?) | ✅ | Name + Job Description fields |
| Step 2: Rules (Training instructions) | ✅ | Instructions textarea |
| Step 3: Tricks (Tool selection) | ✅ | Tool cards with toggles |
| No technical terminology | ✅ | "Dog Trainer" language throughout |
| Educational tour | 🔨 | `createAgentTour.ts` - needs testing |

**Technical Requirements:**
- Q&A form with validation ✅
- Template mapping backend ✅
- Tour system 🔨

**What We Built:**
- `CreateAgentPage.tsx` - Full 3-step wizard with progress indicators
- `WizardLayout.tsx` - Themed step container
- `ToolCard.tsx` - Tool selection component
- `createAgentTour.ts` - Driver.js tour (auto-triggers for first-time users)
- `TourProvider.tsx` - Tour state persistence

**Tour Integration:**
```typescript
// Already integrated in CreateAgentPage.tsx
useEffect(() => {
  if (shouldShowTour && currentStep === 1 && !tourStarted) {
    startCreateAgentTour(() => completeTour('create-agent'));
  }
}, [shouldShowTour, currentStep]);
```

---

## Phase 3: Test Charlie
**"Training exercises" - Playground chat**

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Playground chat interface | ✅ | `PlaygroundPage.tsx` |
| Auto-redirect after agent creation | ✅ | `navigate(/playground/${agent.id})` |
| Welcome message from Charlie | 📋 | Need to add initial greeting |
| Agent personality visible in responses | ✅ | System prompt applied |
| "Edit Training" button | ✅ | Links to `/edit/:agentId` |

**Technical Requirements:**
- Chat API with session management ✅
- Agent retrieval by ID ✅
- Conversation persistence ✅

**What We Built:**
- Full chat interface with markdown rendering
- Conversation ID tracking for context
- "Clear chat" functionality
- Links to edit agent

**Still Needed:**
```typescript
// Add welcome message on first load
useEffect(() => {
  if (agent && messages.length === 0) {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm ${agent.name}. ${agent.description || 'How can I help you today?'}`,
      timestamp: new Date(),
    }]);
  }
}, [agent]);
```

---

## Phase 4: Refine the Training
**"Adjusting commands" - Iterative editing**

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Edit agent form | ✅ | `EditAgentPage.tsx` |
| Quick access from Playground | ✅ | "Edit Agent" button in header |
| Side-by-side editing | 📋 | Could add split view |
| Visual indicator of changes | 📋 | Toast notification on save |

**Technical Requirements:**
- Agent update API ✅
- Form with pre-populated values ✅
- Navigation between playground and edit ✅

**What We Built:**
- `EditAgentPage.tsx` - Full edit form
- Links from Playground and Dashboard
- Save/cancel functionality

**Enhancement Opportunity:**
```typescript
// Side-by-side view component (future)
<SplitView>
  <ChatPanel agentId={agentId} />
  <EditPanel agentId={agentId} onSave={refreshChat} />
</SplitView>
```

---

## Phase 5: Peek Inside Charlie's Brain
**"Understanding how dogs think" - Simplified flow visualization**

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Simplified flow visualization | 🔨 | `LangflowCanvasViewer.tsx` |
| Dog-themed node labels | 📋 | CSS overlay approach |
| Read-only mode initially | 🔨 | Level 1 CSS injection |
| "Unlock Flow" button | ✅ | Added to PlaygroundPage |
| Canvas tour | 🔨 | Built into LangflowCanvasViewer |

**Technical Requirements:**
- iframe embedding of Langflow ✅
- CSS injection for hiding elements 🔨
- Progressive disclosure levels 🔨
- Canvas tour steps 🔨

**What We Built:**
- `LangflowCanvasViewer.tsx` - iframe wrapper with 4 disclosure levels
- `CanvasViewerPage.tsx` - Full page for canvas viewing
- CSS selectors documented in `08_LANGFLOW_UI_CSS_SELECTORS.md`
- Level selector UI with persistence

**CSS Injection for Level 1 (Peek Mode):**
```css
/* Hide everything except canvas */
[data-testid="app-header"] { display: none !important; }
[data-testid="shad-sidebar"] { display: none !important; }
[data-testid="canvas_controls"] { display: none !important; }
[data-testid="main_canvas_controls"] { display: none !important; }
.react-flow__pane { pointer-events: none !important; }
```

**Limitations Identified:**
- CSS injection requires same-origin (localhost works, production needs proxy)
- Full Langflow loads even when hidden (performance consideration)

---

## Phase 6: Teach Charlie Tricks
**"Advanced skills" - Tools**

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Tool selection in Q&A | ✅ | Step 3 with ToolCard components |
| Web Search tool | 🔨 | Template exists, needs verification |
| Calculator tool | 🔨 | Template exists, needs verification |
| URL Reader tool | 🔨 | Template exists, needs verification |
| Tools visible in canvas | 📋 | Level 2 should show tool nodes |
| Tool execution verification | ⚠️ | **CRITICAL: Needs testing** |

**Technical Requirements:**
- Tool templates in backend ✅
- Template mapping for tools ✅
- Agent component with tools port 🔨
- Tool-to-Agent edge generation 🔨

**What We Built:**
- Tool templates in `/src/backend/templates/tools/`
- `ToolCard.tsx` for selection UI
- Template mapping service

**Critical Verification Needed:**
```bash
# Test 1: Create agent with calculator
# Ask: "What is 847 * 23?"
# Expected: Returns 19,481 (not "I cannot calculate")

# Test 2: Create agent with web search
# Ask: "What are today's top news headlines?"
# Expected: Returns current information (not "I don't have access")
```

**Level 2 CSS (Explore Mode):**
```css
/* Show canvas + simplified sidebar */
[data-testid="app-header"] { display: none !important; }
[data-testid="sidebar-nav-mcp"] { display: none !important; }
[data-testid="sidebar-nav-bundles"] { display: none !important; }
[data-testid="disclosure-llm operations"] { display: none !important; }
[data-testid="disclosure-processing"] { display: none !important; }
```

---

## Phase 7: Give Charlie a Memory
**"Remembering commands and contexts"**

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Memory enabled by default | 📋 | Agent template update needed |
| Multi-turn conversation context | 🔨 | Session ID tracking exists |
| "New Conversation" button | ✅ | "Clear chat" in PlaygroundPage |
| Memory visualization in canvas | 📋 | Memory node should be visible |

**Technical Requirements:**
- Session management ✅
- Memory component in Agent template 📋
- Memory toggle UI 📋

**What We Built:**
- Conversation ID tracking in PlaygroundPage
- "Clear chat" button for new sessions
- Session passed to backend API

**Implementation Plan:**
```typescript
// Agent template should include Memory component
// Level 2-3 should show Memory node in canvas

// Optional: Add memory toggle to PlaygroundPage
<MemoryToggle
  enabled={memoryEnabled}
  onToggle={() => setMemoryEnabled(!memoryEnabled)}
/>
```

---

## Phase 8: Charlie's Library
**"Training manuals and reference materials" - RAG**

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Document upload UI | ❌ | Not started |
| Text file processing | ❌ | Not started |
| PDF processing | ❌ | Not started (defer to post-MVP) |
| Vector store integration | ❌ | Not started |
| RAG flow template | ❌ | Needs manual creation first |

**Technical Requirements:**
- File upload endpoint ❌
- Document chunking service ❌
- Embedding generation ❌
- Vector store (pgvector) ❌
- RAG-enhanced Agent template ❌

**Research Completed:**
- Langflow has built-in document components
- Vector stores available: Chroma, pgvector, Pinecone
- Need to manually build RAG flow first to understand components

**Recommended Approach:**
1. **Manual POC:** Build RAG flow in Langflow UI
2. **Document components:** Identify required nodes
3. **Simplify:** Start with text-only (no PDF)
4. **Template:** Create RAG-enhanced agent template
5. **UI:** Build document upload interface

**Estimated Effort:** 1-2 weeks

---

## Phase 9: Charlie the Working Dog
**"Independent decision-making" - Autonomous agents**

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Agent autonomous tool selection | 🔨 | Agent component does this |
| Reasoning visibility ("thinking...") | 📋 | Need to expose in UI |
| Multi-step tool chaining | 🔨 | Agent component supports this |
| "Why did Charlie do that?" | 📋 | Parse reasoning from response |

**Technical Requirements:**
- Agent component (not LanguageModelComponent) 🔨
- Streaming responses for "thinking" state 📋
- Tool usage logging 📋

**What We Know:**
- Agent component in Langflow already does autonomous tool selection
- Need to verify template uses Agent (not LanguageModelComponent)
- May need to parse response for tool usage indicators

**Implementation Plan:**
```typescript
// Enhanced "thinking" state in PlaygroundPage
{isLoading && (
  <ThinkingIndicator>
    <span>Charlie is thinking...</span>
    {toolInUse && <span>Using: {toolInUse}</span>}
  </ThinkingIndicator>
)}
```

---

## Phase 10: Become a Dog Trainer
**"Train any dog for any job" - Full Langflow canvas**

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Full Langflow access | 🔨 | Level 4 in LangflowCanvasViewer |
| Guided tour of full canvas | 📋 | Need to create advanced tour |
| Component reference docs | 📋 | Link to Langflow docs |
| Custom component creation | ❌ | Advanced feature, defer |

**Technical Requirements:**
- Level 4 (no CSS hiding) ✅
- "Open Full Editor" link ✅
- Advanced tour steps 📋

**What We Built:**
- Level 4 mode shows full Langflow UI
- "Open Full Editor" link opens Langflow in new tab
- Canvas viewer with level selector

**Tour Steps for Phase 10:**
```typescript
const advancedCanvasTourSteps: DriveStep[] = [
  {
    element: '[data-testid="shad-sidebar"]',
    popover: {
      title: 'Component Library',
      description: 'All available components. Drag them onto the canvas.',
    },
  },
  {
    element: '[data-testid="publish-button"]',
    popover: {
      title: 'Share & Deploy',
      description: 'Export your flow, get API access, or embed on your site.',
    },
  },
  // ... more steps
];
```

---

## Implementation Priority Matrix

| Phase | Status | Priority | Effort | Dependencies |
|-------|--------|----------|--------|--------------|
| 0 | ✅ | - | - | None |
| 1 | ✅ | - | Low | Demo agent needed |
| 2 | ✅ | - | - | None |
| 3 | ✅ | - | Low | Welcome message |
| 4 | ✅ | - | - | None |
| 5 | 🔨 | High | Done | Test CSS injection |
| 6 | ⚠️ | **Critical** | Medium | **Tool verification** |
| 7 | 📋 | Medium | Low | Phase 6 |
| 8 | ❌ | Low | High | Manual RAG POC |
| 9 | 📋 | Medium | Medium | Phase 6 |
| 10 | 🔨 | Low | Low | Advanced tour |

---

## Recommended Next Steps

### Immediate (This Week)

1. **Verify Tool Execution (Phase 6 Blocker)**
   ```bash
   # Start services
   docker-compose up -d
   cd src/frontend && npm run dev

   # Create agent with calculator + web search
   # Test: "What is 500 * 3.14?"
   # Test: "What's the weather in New York?"
   ```

2. **Test Canvas Viewer (Phase 5)**
   - Create agent, go to Playground
   - Click "Unlock Flow"
   - Verify canvas loads with correct flow
   - Test level selector (1-4)

3. **Add Demo Agent (Phase 1)**
   - Create "Demo Charlie" in database
   - Link from homepage

### Short-term (Next 2 Weeks)

4. **Memory Integration (Phase 7)**
   - Verify Agent template has Memory component
   - Test multi-turn context retention

5. **Agent Reasoning Visibility (Phase 9)**
   - Check if Agent exposes tool usage in response
   - Add "thinking" indicator with tool info

### Medium-term (Month 2)

6. **RAG Research (Phase 8)**
   - Manual RAG flow in Langflow
   - Document component requirements
   - Design simplified upload UI

---

## Technical Debt & Risks

### Cross-Origin iframe

**Risk:** CSS injection fails in production if Langflow on different domain

**Mitigations:**
1. Deploy frontend/Langflow on same domain
2. Use Nginx proxy to route Langflow
3. Request beginner-mode feature from Langflow team

### Tool Verification

**Risk:** Tools may not actually execute (just text in system prompt)

**Test Protocol:**
1. Create agent with calculator
2. Ask math question
3. Verify answer is correct (not "I cannot")
4. If fails, check Agent template and edge generation

### Performance

**Risk:** Full Langflow loading in iframe is slow

**Mitigations:**
1. Lazy load iframe only when "Unlock Flow" clicked
2. Add loading skeleton
3. Consider Level 1 as static image initially

---

## Summary Table

| Phase | Name | Status | Key Component |
|-------|------|--------|---------------|
| 0 | Philosophy | ✅ | External content |
| 1 | Meet Charlie | ✅ | PlaygroundPage |
| 2 | Give Job | ✅ | CreateAgentPage |
| 3 | Test | ✅ | PlaygroundPage |
| 4 | Refine | ✅ | EditAgentPage |
| 5 | Peek Brain | 🔨 | LangflowCanvasViewer |
| 6 | Tricks | ⚠️ | Tool templates |
| 7 | Memory | 📋 | Agent template |
| 8 | Library | ❌ | RAG components |
| 9 | Working Dog | 📋 | Agent reasoning |
| 10 | Trainer | 🔨 | Full canvas access |

**MVP Scope (Phases 0-4):** ✅ Complete
**Phase 5 POC:** 🔨 Built, needs testing
**Phase 6 (Critical):** ⚠️ Tool verification blocking
