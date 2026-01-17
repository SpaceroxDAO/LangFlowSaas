# Mission Schema Reference

> Complete data model for Teach Charlie AI missions

---

## Mission Object

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique identifier, hybrid format | `"L011-prompt-variables"` |
| `name` | string | Display name | `"Prompt Variables"` |
| `description` | string | What user will learn/build | `"Learn to use variables..."` |
| `category` | enum | Mission category | `"skill_sprint"` |
| `difficulty` | enum | Difficulty level | `"beginner"` |
| `estimated_minutes` | int | Time estimate | `15` |
| `icon` | string | Icon name | `"variable"` |
| `sort_order` | int | Display order | `11` |
| `steps` | array | Mission steps | See Step Schema |
| `outcomes` | array[string] | Learning outcomes | `["Use variables", "Create responses"]` |

### Optional Fields

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `prerequisites` | array[string] | Mission IDs to complete first | `None` |
| `canvas_mode` | bool | Whether mission uses canvas | `False` |
| `template_id` | string | Langflow template to start from | `None` |
| `component_pack` | object | Canvas component restrictions | `None` |
| `continues_from` | string | Previous mission workflow to continue | `None` |
| `ui_config` | object | Canvas UI visibility settings | `None` |

---

## UI Config Schema (DEPRECATED)

> **⚠️ WARNING**: Hiding Langflow UI elements via CSS injection is fragile and NOT recommended.
> For L001 and beginner missions, use `ui_config: None` (show full canvas).
> Progressive disclosure is better achieved through step-by-step guidance, not hiding UI.

Controls what's visible on the canvas during a mission:

```python
{
    "hide_sidebar": bool,           # Hide entire component sidebar (NOT RECOMMENDED)
    "hide_toolbar": bool,           # Hide top toolbar (NOT RECOMMENDED)
    "hide_minimap": bool,           # Hide the minimap (NOT RECOMMENDED)
    "show_only": [str],             # Only show these UI elements
    "custom_actions_only": bool,    # Only show "Actions" category (course components)
}
```

### Recommended: Show Full Canvas

```python
# For L001 and most missions, don't hide anything
"ui_config": None,  # Show full Langflow canvas
```

### Why Hiding Is Problematic

1. **Fragile CSS injection** - Langflow's class names can change between versions
2. **Breaks functionality** - Some hidden elements are needed for proper operation
3. **User confusion** - Users may see different UI when they return outside missions
4. **Maintenance burden** - Each Langflow update may break hiding selectors

### Alternative: Guide, Don't Hide

Instead of hiding UI elements, use:
- **Highlights** to draw attention to specific elements
- **Step descriptions** to explain what to ignore
- **Component packs** to validate (not hide) allowed components

---

## Field Enums

### category

```python
VALID_CATEGORIES = [
    "skill_sprint",    # 10-15 min, learn 1-2 concepts
    "applied_build",   # 30-45 min, ship something useful
]
```

### difficulty

```python
VALID_DIFFICULTIES = [
    "beginner",        # No prerequisites or just L001
    "intermediate",    # Requires several completed missions
    "advanced",        # Complex multi-system integration
]
```

### step.type

```python
VALID_STEP_TYPES = [
    "info",    # Informational, orientation, reading
    "action",  # User must do something
]
```

---

## ID Format

Mission IDs use the **hybrid format**: `L{NNN}-{slug}`

### Pattern
```
L001-hello-flow
L010-build-first-agent
L011-prompt-variables
```

### Rules
- `L` prefix (for "Lesson")
- 3-digit zero-padded number
- Hyphen separator
- Lowercase slug (2-4 words, hyphens)
- Max 50 characters total

### Sequence Ranges
```
L001-L099: Core curriculum
L100-L199: Advanced topics
L200-L299: Business systems
L300-L399: Enterprise features
ORG001+:   Organization custom missions
```

---

## Step Schema

### Step Object

```python
{
    "id": int,              # Sequential within mission (1, 2, 3...)
    "title": str,           # Short title (3-6 words)
    "description": str,     # What to do (1-3 sentences)
    "type": str,            # "info" or "action"

    # Optional fields
    "phase": str,           # "works", "reliable", "connected"
    "validation": dict,     # Auto-validation config
    "highlight": dict,      # Driver.js highlight config (Walk Me)
    "hints": list[str],     # Additional help tips
    "show_me_text": str,    # Custom "Show Me" button text
}
```

### Validation Object (for auto-completion)

```python
{
    "auto": bool,           # Can be auto-validated
    "event_type": str,      # "node_added", "node_selected", "node_configured", "flow_run"
    "node_type": str,       # Expected component type
    "field_name": str,      # Field that must be filled (for node_configured)
    "assertions": list,     # Conditions to check
}
```

### Highlight Object (for Walk Me) - ENHANCED

The highlight field configures driver.js to auto-spotlight elements on the canvas.

```python
{
    "element": str,         # What to highlight: "node:Agent", "field:agent_instructions", "button:play"
    "selector": str,        # CSS selector (fallback if element not found)
    "title": str,           # Tooltip title
    "description": str,     # Tooltip body text
    "position": str,        # "top", "bottom", "left", "right", "auto"
    "auto_trigger": bool,   # Auto-highlight when step becomes active (default: True)
    "allow_click": bool,    # Allow clicking the highlighted element (default: True)
}
```

### Highlight Element Types

| Element Pattern | Description | Example |
|-----------------|-------------|---------|
| `node:{type}` | A canvas node by type | `"node:Agent"` |
| `field:{label}` | An input field by its visible label | `"field:agent_instructions"` |
| `button:{id}` | A toolbar/UI button | `"button:playground"`, `"button:play"`, `"button:save"` |
| `sidebar:{category}` | A sidebar category | `"sidebar:tools"` |
| `panel:{name}` | A UI panel | `"panel:chat"` |

### How Element Finding Works (Implementation Details)

**IMPORTANT**: Langflow's DOM doesn't use standard HTML attributes. The overlay script uses these strategies:

| Pattern | Finding Strategy |
|---------|-----------------|
| `node:{type}` | CSS selector: `[data-type="{type}"]` or class-based matching |
| `field:{name}` | **Container-based lookup**: Find containers that have BOTH the label text (e.g., "Agent Instructions") AND an input element. The `{name}` is converted from snake_case to Title Case for label matching. |
| `button:playground` | Text-based lookup: Finds buttons/links containing "Playground" text |
| `button:play` | Multiple selectors: `button[title*="Run"]`, `[aria-label*="Play"]`, etc. |

**Why Container-Based Lookup?**
In Langflow, field labels and inputs are siblings, not parent-child:
```
DIV.field-container        ← We highlight this container
  ├── DIV.label-wrapper
  │     └── SPAN "Agent Instructions"   ← Label
  └── DIV.input-wrapper
        └── INPUT                        ← Input
```

The overlay finds containers that contain BOTH the label text AND an input, preferring smaller (more specific) containers.

### Hints Array

Additional tips shown in an expandable section:

```python
"hints": [
    "💡 Try describing Charlie's personality, not just his job",
    "💡 The more specific your instructions, the better Charlie will perform",
]
```

---

## Component Pack Schema

For canvas_mode missions:

```python
{
    "allowed_components": [
        "ChatInput",
        "ChatOutput",
        "Agent",
        # Specific component names
    ],

    "allowed_categories": [
        "input & output",
        "models & agents",
        # Langflow sidebar categories
    ],

    "hidden_categories": [
        "tools",
        "memories",
        # Categories to hide
    ],

    "course_components": [
        "Memory Kit",
        "Ship Pack",
        # Custom course components needed
    ],

    "validation_rules": {
        "require_chat_input": True,
        "require_chat_output": True,
        "max_nodes": 5,
        "require_connections": True,
    },
}
```

### Valid Langflow Categories

```python
LANGFLOW_CATEGORIES = [
    "input & output",
    "data sources",
    "models & agents",
    "memories",
    "tools",
    "processing",
    "utilities",
    "custom",        # Where course components appear
]
```

---

## Spiral Pattern Position

Missions follow a 3-lesson spiral:

| Position | Type | Characteristics |
|----------|------|-----------------|
| 1 | Skill Sprint | One new concept, tiny flow |
| 2 | Skill Sprint | Add one more concept |
| 3 | Applied Build | Ship something using both |

Calculate position:
```python
spiral_position = ((sort_order - 1) % 3) + 1
```

---

## Time Guidelines

| Type | Minutes | Steps |
|------|---------|-------|
| Skill Sprint | 10-15 | 3-4 |
| Applied Build | 30-45 | 5-6 |
| Capstone | 60-90 | 6-8 |

---

## Prerequisites Rules

1. **Soft enforcement**: Warn but allow skip
2. **First mission**: No prerequisites (`None` or `[]`)
3. **Skill Sprints**: Usually just need foundational missions
4. **Applied Builds**: Need the related skill sprints

### Example Chains
```
L001 (no prereqs)
  └── L002 (prereq: L001)
      └── L003 Applied Build (prereq: L001)

L004 (prereq: L001)
  └── L005 (prereq: L004)
      └── L006 Applied Build (prereq: L005)
```

---

## Complete Example: L001 (Full Canvas, Guided)

```python
{
    "id": "L001-hello-charlie",
    "name": "Hello Charlie",
    "description": "Meet your first AI agent on the canvas. See how components connect and bring Charlie to life!",
    "category": "skill_sprint",
    "difficulty": "beginner",
    "estimated_minutes": 10,
    "icon": "bot",
    "sort_order": 1,
    "canvas_mode": True,
    "template_id": "agent_base",

    # UI Config - show full canvas, guide with highlights instead of hiding
    "ui_config": None,

    # Component pack (for validation)
    "component_pack": {
        "allowed_components": ["ChatInput", "ChatOutput", "Agent"],
        "allowed_categories": ["input & output", "models & agents"],
        "validation_rules": {
            "require_chat_input": True,
            "require_chat_output": True,
            "max_nodes": 3,
        },
    },

    "steps": [
        {
            "id": 1,
            "title": "Meet the Canvas",
            "description": "Look at the three boxes on screen: Chat Input (where you type), Agent (Charlie's brain), and Chat Output (where Charlie replies). They're already connected!",
            "type": "info",
            "phase": "works",
            "highlight": {
                "element": "node:Agent",
                "title": "This is Charlie!",
                "description": "The Agent component is Charlie's brain. Click it to give Charlie instructions.",
                "position": "right",
                "auto_trigger": False,  # Only show on "Show Me" click
            },
        },
        {
            "id": 2,
            "title": "Give Charlie a Job",
            "description": "Click on the Agent box in the middle. Find the 'Agent Instructions' field and tell Charlie what to do. Try: 'You are a friendly assistant who loves helping people learn new things.'",
            "type": "action",
            "phase": "works",
            "highlight": {
                "element": "field:agent_instructions",  # Converted to "Agent Instructions" for label lookup
                "title": "Charlie's Job Description",
                "description": "Type what you want Charlie to do. Be specific about his personality and how he should respond.",
                "position": "left",
                "auto_trigger": False,
            },
            "hints": [
                "Think of this like writing a job description for a new employee",
                "Be specific about Charlie's personality and how he should respond",
                "Try mentioning what topics Charlie should help with",
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
            "description": "Click the Play button at the top to start your flow. Type 'Hello Charlie!' in the chat and press Enter. Charlie will respond based on the job you gave him!",
            "type": "action",
            "phase": "reliable",
            "highlight": {
                "element": "button:play",
                "title": "Run Your Flow",
                "description": "Click this button to start Charlie. Then you can chat with him!",
                "position": "bottom",
                "auto_trigger": False,
            },
            "hints": [
                "After clicking Play, look for the chat panel on the right",
                "Try asking Charlie about himself to see if he follows your instructions",
                "If Charlie doesn't respond the way you want, you can go back and update his instructions",
            ],
        },
    ],

    "prerequisites": None,
    "outcomes": [
        "Understand how the canvas works",
        "Give an agent its job description",
        "Chat with your first AI agent",
    ],
}
```

## Complete Example: Later Mission (With Sidebar)

```python
{
    "id": "L004-tools-101",
    "name": "Tools 101",
    "description": "Teach Charlie a new trick! Learn to add tools that give your agent new abilities.",
    "category": "skill_sprint",
    "difficulty": "beginner",
    "estimated_minutes": 15,
    "icon": "wrench",
    "sort_order": 4,
    "canvas_mode": True,
    "template_id": "agent_base",
    "continues_from": "L001-hello-charlie",  # Continues from previous workflow

    # UI Config - show only Actions category
    "ui_config": {
        "hide_sidebar": False,
        "custom_actions_only": True,  # Only show "Actions" (course components)
        "hide_minimap": True,
    },

    "component_pack": {
        "allowed_components": ["ChatInput", "ChatOutput", "Agent", "Calculator"],
        "allowed_categories": ["actions"],  # Only our custom Actions category
        "course_components": ["Calculator"],  # Available in Actions
    },

    "steps": [
        {
            "id": 1,
            "title": "Meet the Toolbox",
            "description": "Look at the 'Actions' panel on the left. These are tricks you can teach Charlie!",
            "type": "info",
            "phase": "works",
            "highlight": {
                "element": "sidebar:actions",
                "title": "Charlie's Tricks",
                "description": "Each action here is a new ability you can give Charlie.",
                "position": "right",
            },
        },
        # ... more steps
    ],
}
```

---

## Validation Checklist

Before a mission is valid:

### Schema Validation
- [ ] All required fields present
- [ ] ID follows hybrid format
- [ ] Category is valid enum
- [ ] Difficulty is valid enum
- [ ] sort_order is unique
- [ ] Steps have sequential IDs starting at 1

### Educational Validation
- [ ] Max 2 new concepts for skill sprints
- [ ] Step count: 3-4 for sprints, 5-6 for builds
- [ ] Time matches type (10-15 sprint, 30-45 build)
- [ ] Outcomes list 2-4 items

### Dependency Validation
- [ ] Prerequisites reference valid mission IDs
- [ ] template_id exists in Langflow (if canvas_mode)
- [ ] course_components exist (or flagged for creation)
- [ ] allowed_components are valid Langflow components

---

## Known Limitations & Gotchas

### Driver.js (Walk Me) Limitations

1. **Close button requires custom implementation** - Driver.js's built-in `showButtons: ['close']` doesn't work reliably inside iframes. The overlay script adds a custom close button.

2. **Click-outside-to-close requires capture phase** - Normal event listeners don't work. Must use `document.addEventListener('click', handler, true)` with capture phase.

3. **Cleanup must be explicit** - Call `clearHighlight()` which removes all driver.js DOM elements manually.

### Element Finding Limitations

1. **Fields must be visible** - `field:{name}` only works if the node is expanded and the field is visible on screen.

2. **Timing matters** - Elements may not exist immediately after page load. The overlay retries after delays.

3. **Multiple matches possible** - If multiple elements match, the smallest container is chosen.

### Iframe Communication

1. **postMessage is the only channel** - Parent React app communicates with Langflow iframe via `postMessage`.

2. **No direct DOM access** - Parent cannot directly manipulate iframe DOM due to cross-origin restrictions.

---

## E2E Testing Missions

**IMPORTANT**: After implementing or modifying a mission, always verify with E2E tests.

For complete test patterns and templates, see:
- [E2E_TEST_PATTERNS.md](./E2E_TEST_PATTERNS.md) - Regular Playwright tests + Playwright MCP tests
- [HIGHLIGHT_PATTERNS.md](./HIGHLIGHT_PATTERNS.md) - Show Me highlight system reference

### Test Procedure

1. **Navigate to Missions Page**
   ```
   browser_navigate: http://localhost:3001/dashboard/missions
   ```

2. **Start/Continue the Mission**
   - Find the mission card in the UI
   - Click "Start Mission" or "Continue" button

3. **Verify Console Logs** - Check for these key messages:
   ```
   [TeachCharlie] Mission UI config: {hide_sidebar: true, hide_minimap: true}
   [TeachCharlie] Sidebar hidden
   [TeachCharlie] Minimap hidden
   [TeachCharlie] Mission Mode - Allowed components: [...]
   [TeachCharlie] Driver.js ready
   ```

4. **Visual Verification**
   - Take a screenshot: `browser_take_screenshot`
   - Verify Mission Side Panel shows step details
   - Verify "Show Me" button appears for steps with highlights
   - Verify "Need a hint?" section for steps with hints
   - Verify canvas UI matches `ui_config` (sidebar hidden if specified)

### What to Verify

| Feature | What to Check |
|---------|---------------|
| `component_pack.allowed_components` | Console shows correct component filter |
| Step `highlight` | "Show Me" button appears on current step |
| Step `hints` | "Need a hint?" expandable shows hints |
| Step navigation | Completing steps advances progress |
| **Highlight dismissal** | Can close highlight via × button, click outside, or Escape key |

### Testing Highlight Dismissal (CRITICAL)

After clicking "Show Me", verify ALL THREE dismissal methods work:

1. **× Button** - Click the close button in top-right of tooltip
2. **Click Outside** - Click on the dark overlay (outside the tooltip and highlighted element)
3. **Escape Key** - Press Escape to dismiss

```python
# Test highlight dismissal
browser_click(element="Show Me button", ref="eXXX")
browser_wait_for(time=1)

# Verify highlight appeared
browser_snapshot()
# Should see: dialog with tooltip title, dark overlay

# Test Escape key dismissal
browser_press_key(key="Escape")
browser_snapshot()
# Should see: no more driver-popover or driver-overlay elements
```

### Sample E2E Test Sequence (Playwright MCP)

```python
# 1. Navigate to missions
browser_navigate(url="http://localhost:3001/dashboard/missions")

# 2. Click Start/Continue on target mission
browser_click(element="Continue button", ref="eXXX")

# 3. Wait for canvas to load
browser_wait_for(time=3)

# 4. Check console for success messages
browser_console_messages(level="info")
# Should see: "Mission UI config", "Sidebar hidden", etc.

# 5. Take screenshot for visual verification
browser_take_screenshot(filename="mission-test.png")

# 6. Verify mission panel elements
browser_snapshot()
# Should see: Mission Side Panel, step details, Show Me button

# 7. Test "Show Me" button (triggers Walk Me highlight)
browser_click(element="Show Me button", ref="eYYY")

# 8. Clean up
browser_close()
```

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Sidebar still visible | `ui_config` not passed to iframe | Check `CanvasViewerPage.tsx` passes `uiConfig` prop |
| "Show Me" doesn't work | `iframeRef` not passed to panel | Check `iframeRef` is passed to `MissionSidePanel` |
| Console shows parse error | URL encoding issue | Check `JSON.stringify(uiConfig)` in `LangflowCanvasViewer` |
| Walk Me highlight not showing | Driver.js not loaded | Check overlay script loads `driver.js` CDN |

### Files Involved in Mission Canvas

| File | Purpose |
|------|---------|
| `CanvasViewerPage.tsx` | Main page, passes `uiConfig` and `iframeRef` |
| `LangflowCanvasViewer.tsx` | Builds iframe URL with `ui_config` param |
| `MissionSidePanel.tsx` | Displays steps, triggers highlights via `iframeRef` |
| `nginx/overlay/script.js` | Parses `ui_config`, applies CSS, handles Walk Me |
