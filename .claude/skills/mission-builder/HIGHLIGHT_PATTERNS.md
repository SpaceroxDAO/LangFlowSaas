# Highlight Patterns Reference (Show Me Guidance)

> Standard patterns for implementing Walk Me highlights in missions

---

## Overview

The "Show Me" guidance system uses driver.js to highlight UI elements within the Langflow canvas iframe. This creates a guided, interactive learning experience where users can click "Show Me" to have the system point directly at the element they need to interact with.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Parent: MissionStepPanel.tsx                                    │
│                                                                 │
│  ┌─────────────────────────────┐                               │
│  │ Step 2: Give Charlie a Job  │                               │
│  │ ┌─────────────────────────┐ │                               │
│  │ │ [Show Me] button        │─┼───► postMessage ───┐          │
│  │ └─────────────────────────┘ │                    │          │
│  └─────────────────────────────┘                    │          │
│                                                      │          │
└──────────────────────────────────────────────────────┼──────────┘
                                                       │
                                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Iframe: Langflow Canvas (nginx/overlay/script.js)              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ window.addEventListener('message', (event) => {             ││
│  │   if (event.data.source === 'teach-charlie-parent') {       ││
│  │     WalkMe.showHighlight(event.data.highlight)              ││
│  │   }                                                          ││
│  │ })                                                           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────┐                                      │
│  │ driver.js highlight  │ ← Popover with title/description     │
│  │ ┌──────────────────┐ │                                      │
│  │ │ Agent Component  │ │ ← Highlighted element                │
│  │ └──────────────────┘ │                                      │
│  └──────────────────────┘                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Highlight Data Structure

### TypeScript Definition

```typescript
interface StepHighlight {
  // Target element (required - one of these)
  element?: string           // Pattern: "node:Agent", "field:agent_instructions", "button:play"
  selector?: string          // Fallback CSS selector

  // Popover content
  title?: string             // Bold heading in popover
  description?: string       // Body text in popover

  // Positioning
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'

  // Behavior
  auto_trigger?: boolean     // Auto-show when step becomes active (default: false)
  allow_click?: boolean      // Allow clicking highlighted element (default: true)
}
```

### Python Definition (for mission.py)

```python
{
    "element": str,           # "node:Agent", "field:agent_instructions", "button:play"
    "selector": str,          # Optional CSS fallback
    "title": str,             # Popover title
    "description": str,       # Popover body
    "position": str,          # "top", "bottom", "left", "right", "auto"
    "auto_trigger": bool,     # Default: False
    "allow_click": bool,      # Default: True
}
```

---

## Element Patterns

### Pattern 1: `node:{type}` - Highlight Canvas Nodes

**Format**: `node:ComponentTypeName`

**Resolves to**: `[data-type="{type}"], .react-flow__node[class*="{type}"]`

**Use when**: Highlighting a component on the canvas (Agent, ChatInput, ChatOutput, etc.)

**Examples**:
```python
# Highlight the Agent component
"highlight": {
    "element": "node:Agent",
    "title": "This is Charlie!",
    "description": "The Agent component is Charlie's brain. Click it to configure.",
    "position": "right",
}

# Highlight Chat Input
"highlight": {
    "element": "node:ChatInput",
    "title": "Message Entry Point",
    "description": "This is where user messages enter your flow.",
    "position": "left",
}

# Highlight a Tool component
"highlight": {
    "element": "node:Calculator",
    "title": "Calculator Tool",
    "description": "This tool gives your agent math abilities.",
    "position": "bottom",
}
```

---

### Pattern 2: `field:{name}` - Highlight Input Fields

**Format**: `field:field_name_in_snake_case`

**Resolves to**: Container-based lookup that finds elements containing BOTH:
- A label matching the title-cased field name (e.g., "Agent Instructions")
- An input/textarea element

**Use when**: Highlighting a specific input field within an expanded component

**Important**: The component must be expanded/selected for the field to be visible!

**Examples**:
```python
# Highlight Agent Instructions field
"highlight": {
    "element": "field:agent_instructions",
    "title": "Charlie's Job Description",
    "description": "Type what you want Charlie to do. Be specific about personality.",
    "position": "left",
}

# Highlight Model Name field
"highlight": {
    "element": "field:model_name",
    "title": "Choose the Brain",
    "description": "Select which AI model powers your agent.",
    "position": "right",
}

# Highlight Temperature field
"highlight": {
    "element": "field:temperature",
    "title": "Creativity Level",
    "description": "Higher = more creative but less predictable.",
    "position": "bottom",
}
```

**Field Name Conversion**:
| `element` value | Looks for label |
|-----------------|-----------------|
| `field:agent_instructions` | "Agent Instructions" |
| `field:model_name` | "Model Name" |
| `field:system_prompt` | "System Prompt" |
| `field:api_key` | "Api Key" |

---

### Pattern 3: `button:{id}` - Highlight UI Buttons

**Format**: `button:buttonId`

**Supported button IDs**:
| ID | Matches | Location |
|----|---------|----------|
| `playground` | Playground button | Top right corner |
| `play` | Run/Play button | Top toolbar |
| `save` | Save button | Top toolbar |
| `stop` | Stop button | Top toolbar |
| `settings` | Settings button | Various |
| `undo` | Undo button | Top toolbar |
| `redo` | Redo button | Top toolbar |

**Resolves to**: Multiple selectors including `button[title*="..."]`, `[aria-label*="..."]`, `[data-testid*="..."]`, and text-based lookup

**Examples**:
```python
# Highlight Playground button (opens chat panel)
"highlight": {
    "element": "button:playground",
    "title": "Open the Playground",
    "description": "Click here to open the chat window where you can talk to Charlie!",
    "position": "bottom",
}

# Highlight Play button
"highlight": {
    "element": "button:play",
    "title": "Run Your Flow",
    "description": "Click this to start Charlie and open the chat panel.",
    "position": "bottom",
}

# Highlight Save button
"highlight": {
    "element": "button:save",
    "title": "Save Your Work",
    "description": "Click to save your flow. Changes are saved automatically too.",
    "position": "bottom",
}
```

---

### Pattern 4: `sidebar:{category}` - Highlight Sidebar Categories

**Format**: `sidebar:categoryName`

**Use when**: Drawing attention to component categories in the left sidebar

**Examples**:
```python
# Highlight Tools category
"highlight": {
    "element": "sidebar:tools",
    "title": "Charlie's Tricks",
    "description": "These are abilities you can give your agent.",
    "position": "right",
}

# Highlight Actions category (course components)
"highlight": {
    "element": "sidebar:actions",
    "title": "Quick Actions",
    "description": "Pre-built components designed for learning.",
    "position": "right",
}
```

---

### Pattern 5: `panel:{name}` - Highlight Panels

**Format**: `panel:panelName`

**Use when**: Highlighting side panels like chat, logs, etc.

**Examples**:
```python
# Highlight Chat panel
"highlight": {
    "element": "panel:chat",
    "title": "Chat with Charlie",
    "description": "Type your message here and press Enter.",
    "position": "left",
}

# Highlight Logs panel
"highlight": {
    "element": "panel:logs",
    "title": "Flow Logs",
    "description": "See what's happening inside your flow.",
    "position": "left",
}
```

---

## Position Guidelines

Choose position based on where the element is on screen:

| Element Location | Recommended Position | Reason |
|------------------|---------------------|--------|
| Center of canvas | `right` or `left` | Doesn't obscure center |
| Left sidebar | `right` | Points away from edge |
| Right panel | `left` | Points away from edge |
| Top toolbar | `bottom` | Points into canvas |
| Bottom of screen | `top` | Points up |
| Unknown/dynamic | `auto` | driver.js decides |

---

## Auto-Trigger Behavior

### `auto_trigger: false` (Default - Recommended)

User must click "Show Me" button to see highlight.

**Use when**:
- Step is an `action` type (user needs to do something)
- Highlight is optional guidance
- You don't want to interrupt user flow

```python
"highlight": {
    "element": "field:agent_instructions",
    "auto_trigger": False,  # User clicks "Show Me" when ready
}
```

### `auto_trigger: true`

Highlight appears automatically when step becomes active (after 1 second delay).

**Use when**:
- Step is `info` type (orientation)
- Element is critical and easy to miss
- First step of a mission (welcome/intro)

```python
"highlight": {
    "element": "node:Agent",
    "auto_trigger": True,  # Auto-show on step activation
}
```

---

## Complete Examples

### Example 1: L001 Hello Charlie (3 steps, 2 with highlights)

```python
"steps": [
    {
        "id": 1,
        "title": "Meet the Canvas",
        "description": "Look at the three boxes on screen. Chat Input tells Charlie to expect messages from users. The Agent in the middle is Charlie's brain where he processes everything. Chat Output tells Charlie to send his responses back. These components are already wired together - you'll chat with Charlie using the Playground button later!",
        "type": "info",
        "phase": "works",
        # No highlight - this is orientation only, no specific element to point at
    },
    {
        "id": 2,
        "title": "Give Charlie a Job",
        "description": "Click on the Agent box in the middle. Find the 'Agent Instructions' field and tell Charlie what to do.",
        "type": "action",
        "phase": "works",
        "highlight": {
            "element": "field:agent_instructions",
            "title": "Charlie's Job Description",
            "description": "Type what you want Charlie to do. Be specific about his personality.",
            "position": "left",
            "auto_trigger": False,
        },
        "hints": [
            "Think of this like writing a job description",
            "Be specific about personality and response style",
        ],
        "validation": {
            "auto": True,
            "event_type": "node_configured",
            "node_type": "Agent",
            "field_name": "agent_instructions",
        },
    },
    {
        "id": 3,
        "title": "Say Hello!",
        "description": "Click the Playground button in the top right corner to open the chat. Type 'Hello Charlie!' and press Enter.",
        "type": "action",
        "phase": "reliable",
        "highlight": {
            "element": "button:playground",
            "title": "Open the Playground",
            "description": "Click here to open the chat window where you can talk to Charlie!",
            "position": "bottom",
            "auto_trigger": False,
        },
        "hints": [
            "The Playground button is in the top right corner next to Share",
            "Try asking Charlie about himself to see if he follows your instructions",
        ],
    },
]
```

### Example 2: Tools Mission (Adding a Calculator)

```python
"steps": [
    {
        "id": 1,
        "title": "Find the Toolbox",
        "description": "Look at the sidebar on the left...",
        "type": "info",
        "phase": "works",
        "highlight": {
            "element": "sidebar:tools",
            "title": "Charlie's Tricks",
            "description": "Each tool here is a new ability you can teach Charlie.",
            "position": "right",
            "auto_trigger": True,  # Auto-show since it's info/orientation
        },
    },
    {
        "id": 2,
        "title": "Add the Calculator",
        "description": "Drag the Calculator tool onto the canvas...",
        "type": "action",
        "phase": "works",
        "highlight": {
            "element": "node:Calculator",
            "title": "Math Powers!",
            "description": "This component lets Charlie do calculations.",
            "position": "left",
            "auto_trigger": False,
        },
        "validation": {
            "auto": True,
            "event_type": "node_added",
            "node_type": "Calculator",
        },
    },
    {
        "id": 3,
        "title": "Connect to Agent",
        "description": "Connect the Calculator's output to the Agent's tools input...",
        "type": "action",
        "phase": "works",
        # No highlight - connection process is visual enough
    },
    {
        "id": 4,
        "title": "Test Math Skills",
        "description": "Run the flow and ask Charlie a math question...",
        "type": "action",
        "phase": "reliable",
        "highlight": {
            "element": "button:play",
            "title": "Test Time!",
            "description": "Run your flow and ask: 'What is 15% of 230?'",
            "position": "bottom",
            "auto_trigger": False,
        },
    },
]
```

---

## Implementation Checklist

When adding highlights to a mission step:

### Required
- [ ] `element` field with valid pattern (`node:`, `field:`, `button:`, `sidebar:`, `panel:`)
- [ ] `title` - short, friendly heading (2-5 words)
- [ ] `description` - helpful explanation (1-2 sentences)

### Recommended
- [ ] `position` - explicit position based on element location
- [ ] `auto_trigger: false` for action steps
- [ ] `auto_trigger: true` for info/orientation steps (optional)

### Verification
- [ ] Element exists in the Langflow canvas at that mission step
- [ ] Position doesn't obscure the element or important UI
- [ ] Title uses dog-trainer friendly language
- [ ] Description tells user what to do AND why

---

## Troubleshooting

### Highlight Not Appearing

1. **Check element exists**: The target element must be visible in the iframe
2. **Check timing**: driver.js loads from CDN, may need retry
3. **Check postMessage**: Verify `source: 'teach-charlie-parent'` in message
4. **Check console**: Look for `[TeachCharlie] WalkMe received highlight`

### Highlight on Wrong Element

1. **Field pattern**: Ensure field label matches exactly (check title case)
2. **Node pattern**: Verify component type name is exact
3. **Use selector fallback**: Add explicit CSS selector if needed

```python
"highlight": {
    "element": "field:weird_field_name",
    "selector": "[data-testid='my-specific-field']",  # Fallback
}
```

### Highlight Position Awkward

1. **Use `auto`**: Let driver.js decide optimal position
2. **Check viewport**: Element might be near edge
3. **Consider timing**: Element might animate into position

### Target Element Disappears After Multiple Uses

**Symptom**: After clicking "Show Me" and dismissing 5-10 times, the target element (e.g., Playground button) disappears or becomes unclickable.

**Cause**: The cleanup code is calling `.remove()` on elements with `.driver-active-element` class, which deletes the actual UI element instead of just removing the class.

**Fix**: See the "driver.js Internals & Cleanup" section above. Ensure cleanup code:
- Removes `.driver-overlay` and `.driver-popover` elements
- Only removes the CLASS from `.driver-active-element` elements, not the elements themselves

**Verification**: Test 10+ cycles of Show Me → dismiss before considering the highlight working.

### Show Me Button Stops Responding

**Symptom**: After several uses, clicking "Show Me" does nothing.

**Possible causes**:
1. **Invisible overlay blocking clicks**: Check for leftover `.driver-overlay` elements with `pointer-events: auto`
2. **Event listener accumulation**: Check if click handlers are being added without cleanup
3. **postMessage not reaching iframe**: Check console for `[TeachCharlie] WalkMe received highlight`

**Debug steps**:
```javascript
// In browser console (inside iframe):
document.querySelectorAll('.driver-overlay').length  // Should be 0 when no highlight active
document.querySelectorAll('.driver-popover').length  // Should be 0 when no highlight active
document.querySelectorAll('.driver-active-element').length  // Should be 0 when no highlight active
```

---

## driver.js Internals & Cleanup (CRITICAL)

### How driver.js Works

When you call `driver.highlight()`, driver.js does the following:

1. **Creates overlay elements**: Adds `.driver-overlay` (dark backdrop) and `.driver-popover` (tooltip) to the DOM
2. **Marks the target element**: Adds `.driver-active-element` class to the **actual UI element** being highlighted (e.g., the Playground button itself)
3. **Positions the popover**: Calculates position based on the target element

**IMPORTANT: The `.driver-overlay` is an SVG element, NOT a div!**

```
┌─────────────────────────────────────────────────────────────┐
│ DOM after highlight is triggered:                           │
│                                                             │
│  <svg class="driver-overlay">               ← SVG element!  │
│    <path d="...">...</path>                 ← Path creates  │
│  </svg>                                       the cutout    │
│  <div class="driver-popover">...</div>      ← REMOVE THIS   │
│  <button class="driver-active-element">     ← DO NOT REMOVE │
│    Playground                                THE ELEMENT!   │
│  </button>                                   Just remove    │
│                                              the class.     │
└─────────────────────────────────────────────────────────────┘
```

### SVG Overlay Technical Details

The driver.js overlay uses an SVG with a path element to create the "spotlight" effect. This has important implications:

1. **SVG click events behave differently** - Clicks on the `<path>` don't bubble to the parent `<svg>` normally
2. **The overlay has `pointer-events: none`** - driver.js sets this so you can click the highlighted element
3. **You cannot attach click handlers directly to the SVG overlay** - They won't fire reliably

### Click-to-Dismiss Implementation (CRITICAL)

To allow users to dismiss the highlight by clicking the overlay, we use a **transparent click capture div** on top of the SVG overlay:

```
┌─────────────────────────────────────────────────────────────┐
│ Z-Index Layering (bottom to top):                           │
│                                                             │
│  z-index: 10000  → .driver-overlay (SVG, pointer-events:none)│
│  z-index: 10001  → .tc-click-capture (our div, MUST have    │
│                     pointer-events: auto!)                  │
│  z-index: 10002  → .driver-popover (the tooltip box)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**The click capture div MUST have these CSS properties:**

```css
.tc-click-capture {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10001;           /* Above driver-overlay (10000) */
    cursor: pointer;
    background: transparent;
    pointer-events: auto;     /* CRITICAL! Without this, clicks pass through */
}
```

**Why `pointer-events: auto` is required:**
- The driver.js SVG overlay has `pointer-events: none`
- Child elements inherit `pointer-events` from ancestors unless explicitly set
- Without `pointer-events: auto`, our click capture div cannot receive clicks
- This was the root cause of overlay click not working in v44 (fixed in v45)

**Three ways to dismiss a highlight:**
1. **Click overlay** (anywhere outside the popover) - handled by `.tc-click-capture`
2. **Click X button** - custom button added to `.driver-popover`
3. **Press Escape** - document-level keydown listener

### CRITICAL: Cleanup Rules

When dismissing a highlight, you MUST follow these rules:

| Element | Action | Why |
|---------|--------|-----|
| `.driver-overlay` | **Remove element** | This is a generated backdrop, safe to delete |
| `.driver-popover` | **Remove element** | This is a generated tooltip, safe to delete |
| `.driver-active-element` | **Remove CLASS only** | This is the ACTUAL UI element! Deleting it breaks the UI |

**WRONG** (breaks the UI after repeated use):
```javascript
// DON'T DO THIS - deletes the actual Playground button!
document.querySelectorAll('.driver-overlay, .driver-popover, .driver-active-element').forEach(el => {
    el.remove();
});
```

**CORRECT** (preserves the UI):
```javascript
// Remove overlay and popover elements
document.querySelectorAll('.driver-overlay, .driver-popover').forEach(el => {
    el.remove();
});

// Remove the class from target elements (don't delete them!)
document.querySelectorAll('.driver-active-element').forEach(el => {
    el.classList.remove('driver-active-element');
});
```

### Symptoms of Incorrect Cleanup

If cleanup is done incorrectly, users will experience:

1. **Target element disappears** after dismissing highlight a few times
2. **Show Me stops working** because the target element no longer exists
3. **Buttons become unclickable** if invisible overlay elements accumulate

### Testing Highlight Cleanup

Always test highlights with **at least 10 cycles** of:
1. Click "Show Me"
2. Dismiss (Escape, X button, or click outside)
3. Verify target element is still visible and clickable
4. Verify no console errors

---

## postMessage Protocol Reference

### Parent → Iframe: Trigger Highlight

```javascript
iframeRef.current.contentWindow.postMessage({
  source: 'teach-charlie-parent',
  type: 'highlight',
  highlight: {
    element: 'field:agent_instructions',
    title: 'Title Here',
    description: 'Description here',
    position: 'left',
    auto_trigger: false,
  }
}, '*')
```

### Parent → Iframe: Clear Highlight

```javascript
iframeRef.current.contentWindow.postMessage({
  source: 'teach-charlie-parent',
  type: 'clear_highlight',
}, '*')
```

### Iframe → Parent: Canvas Event (for auto-validation)

```javascript
window.parent.postMessage({
  source: 'langflow-overlay',
  event: {
    type: 'node_configured',
    node_type: 'Agent',
    node_id: 'xyz123',
    timestamp: Date.now(),
  }
}, '*')
```

---

## Complete Implementation Reference

### setupCloseHandlers() - Full Implementation

This is the complete implementation for setting up highlight dismiss handlers:

```javascript
setupCloseHandlers() {
    const self = this;

    // 1. Add custom close button to popover
    const popover = document.querySelector('.driver-popover');
    if (popover && !popover.querySelector('.tc-close-btn')) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'tc-close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #f3f4f6;
            border: none;
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
            color: #374151;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            self.clearHighlight();
        };
        popover.appendChild(closeBtn);
    }

    // 2. Create transparent click capture overlay
    //    CRITICAL: Must have pointer-events: auto!
    const overlay = document.querySelector('.driver-overlay');
    if (overlay) {
        const clickCapture = document.createElement('div');
        clickCapture.className = 'tc-click-capture';
        clickCapture.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 10001;
            cursor: pointer;
            background: transparent;
            pointer-events: auto;
        `;

        clickCapture.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            self.clearHighlight();
        });

        document.body.appendChild(clickCapture);

        // Ensure popover is above click capture
        if (popover) {
            popover.style.zIndex = '10002';
        }

        // Store reference for cleanup
        this._overlayClickHandler = {
            clickCapture: clickCapture,
        };
    }
}
```

### cleanupHandlersOnly() - Full Implementation

```javascript
cleanupHandlersOnly() {
    // 1. Remove Escape key handler
    if (this._escapeHandler) {
        document.removeEventListener('keydown', this._escapeHandler);
        this._escapeHandler = null;
    }

    // 2. Remove click capture overlay
    if (this._overlayClickHandler) {
        try {
            if (this._overlayClickHandler.clickCapture) {
                this._overlayClickHandler.clickCapture.remove();
            }
        } catch (e) {
            // Element might already be removed
        }
        this._overlayClickHandler = null;
    }

    // 3. Clean up any leftover click capture divs
    document.querySelectorAll('.tc-click-capture').forEach(el => {
        try { el.remove(); } catch (e) {}
    });
}
```

### removeLeftoverElements() - Full Implementation

```javascript
removeLeftoverElements() {
    // Remove overlay and popover (these are generated by driver.js)
    document.querySelectorAll('.driver-overlay, .driver-popover').forEach(el => {
        try { el.remove(); } catch (e) {}
    });

    // CRITICAL: Only remove the CLASS from active elements, not the elements themselves!
    document.querySelectorAll('.driver-active-element').forEach(el => {
        try { el.classList.remove('driver-active-element'); } catch (e) {}
    });

    // Remove our custom elements
    document.querySelectorAll('.tc-close-btn, .tc-click-capture').forEach(el => {
        try { el.remove(); } catch (e) {}
    });
}
```

---

## Common Mistakes & Solutions

| Mistake | Symptom | Solution |
|---------|---------|----------|
| Missing `pointer-events: auto` on click capture | Overlay click doesn't close highlight | Add `pointer-events: auto` to `.tc-click-capture` CSS |
| Click capture z-index too low | SVG overlay intercepts clicks | Set click capture z-index to 10001 (above overlay's 10000) |
| Popover z-index too low | Popover is behind click capture, clicks on it close highlight | Set popover z-index to 10002 |
| Using `el.remove()` on `.driver-active-element` | Target element disappears after a few uses | Only remove the class: `el.classList.remove('driver-active-element')` |
| Not cleaning up click capture on dismiss | Invisible overlay blocks all clicks | Always remove `.tc-click-capture` in cleanup |
| Attaching click handler to SVG overlay | Click handler never fires | Use separate click capture div instead |

---

## Testing Checklist for New Highlights

Before considering a highlight implementation complete:

- [ ] **Show Me button works** - Clicking opens the highlight
- [ ] **Escape key closes** - Press Escape dismisses highlight
- [ ] **X button closes** - Click the X button dismisses highlight
- [ ] **Overlay click closes** - Click outside popover dismisses highlight
- [ ] **10+ cycle test passes** - Repeat Show Me → dismiss 10+ times
- [ ] **Target element remains clickable** - After all tests, original element still works
- [ ] **No console errors** - Check for removeChild, null reference errors
- [ ] **No leftover elements** - Inspect DOM to ensure no orphaned overlays
