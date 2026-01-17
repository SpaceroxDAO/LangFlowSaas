# Mission Builder Skill

> Create consistent, educationally-sound missions for Teach Charlie AI

---

## Overview

This skill helps create missions that teach users to build AI agents using Langflow. Every mission follows proven educational patterns:

- **Dog Trainer Metaphor**: Friendly language that makes AI accessible
- **Two-Concept Rule**: Max 2 new concepts per Skill Sprint
- **Spiral Learning**: 3-lesson cycles (Sprint → Sprint → Applied Build)
- **Progressive Disclosure**: Hide complexity until needed

---

## How to Invoke

### Interview Mode (Recommended)
```
Create a new mission for teaching [topic]
```
Claude will ask questions to gather requirements before generating.

### Brief Mode (For Experts)
```
/mission-builder

Mission Brief:
- ID: L015-tool-basics
- Name: Tool Basics
- Type: skill_sprint
- Concepts: Adding tools, Tool permissions
- Canvas: Yes
- Template: agent_base
- Prereqs: L010
```

---

## Mission Design Process

### Phase 1: Requirements Gathering

Ask these questions (or parse from brief):

1. **What's the learning goal?**
   - What concept(s) should the user understand after this mission?
   - Maximum 2 concepts for Skill Sprints

2. **Where does it fit in the curriculum?**
   - What's the mission ID? (L001-L099 core, L100+ advanced)
   - What missions must come before this one?
   - Is this position 1, 2, or 3 in the spiral?

3. **What's the mission type?**
   - Skill Sprint (10-15 min, 3-4 steps)
   - Applied Build (30-45 min, 5-6 steps)

4. **Does it use canvas mode?**
   - If yes: What template? What components are allowed?
   - If no: Uses Q&A wizard flow

5. **What's the user's deliverable?**
   - What will they have built/accomplished?
   - How will they know they succeeded?

### Phase 2: Step Design

Design steps following the 5 core patterns:

| Pattern | Type | Purpose |
|---------|------|---------|
| **Explore** | info | Orient to environment/concept |
| **Configure** | action | Change settings, fill forms |
| **Connect** | action | Wire components together |
| **Test** | action | Verify it works |
| **Ship** | action | Deploy, export, productize |

#### Step Sequence by Mission Type

**Skill Sprint (3-4 steps)**:
1. Explore (info) - Orient
2. Configure (action) - Make change
3. Test (action) - Verify

**Applied Build (5-6 steps)**:
1. Plan (info) - Define goals
2. Configure (action) - Core setup
3. Configure (action) - Customize
4. Connect (action) - Wire together
5. Test (action) - Verify
6. Ship (action) - Deploy

### Phase 3: Educational Review

Check against principles:

- [ ] Max 2 new concepts (Skill Sprint)?
- [ ] Dog trainer language used?
- [ ] Clear success criteria in each step?
- [ ] Celebration moment at end?
- [ ] Error states handled kindly?
- [ ] No jargon without explanation?

---

## Output Format

Generate a complete mission package including:

1. **Mission Definition** - Python dict for `DEFAULT_MISSIONS`
2. **E2E Test Spec** - Playwright test file
3. **MCP Test Checklist** - Manual verification steps

### Mission Definition (Python dict)

```python
{
    "id": "L015-tool-basics",
    "name": "Tool Basics",
    "description": "Learn to give your agent new abilities by adding tools.",
    "category": "skill_sprint",
    "difficulty": "beginner",
    "estimated_minutes": 15,
    "icon": "wrench",
    "sort_order": 15,
    "canvas_mode": True,
    "template_id": "agent_base",
    "component_pack": {
        "allowed_components": ["ChatInput", "ChatOutput", "Agent", "Calculator"],
        "allowed_categories": ["input & output", "models & agents", "tools"],
        "hidden_categories": ["memories", "processing", "data sources"],
        "validation_rules": {
            "require_chat_input": True,
            "require_chat_output": True,
            "max_nodes": 6,
        },
    },
    "steps": [
        {
            "id": 1,
            "title": "Explore the Toolbox",
            "description": "Look at the Tools category in the sidebar. These are abilities you can give your agent - like teaching a dog new tricks!",
            "type": "info",
            "phase": "works",
        },
        {
            "id": 2,
            "title": "Add a Calculator Tool",
            "description": "Drag the Calculator tool onto the canvas. This lets your agent do math calculations.",
            "type": "action",
            "phase": "works",
            "validation": {
                "auto": True,
                "event_type": "node_added",
                "node_type": "Calculator",
            },
        },
        {
            "id": 3,
            "title": "Connect Tool to Agent",
            "description": "Connect the Calculator's output to the Agent's 'tools' input. Now your agent knows this trick!",
            "type": "action",
            "phase": "works",
            "validation": {
                "auto": True,
                "event_type": "edge_created",
                "source_type": "Calculator",
                "target_type": "Agent",
            },
        },
        {
            "id": 4,
            "title": "Test the New Ability",
            "description": "Run your flow and ask: 'What is 15% of 230?' Your agent should calculate the answer using its new tool!",
            "type": "action",
            "phase": "reliable",
        },
    ],
    "prerequisites": ["L010-build-first-agent"],
    "outcomes": [
        "Add tools to extend agent capabilities",
        "Connect tools to agents on the canvas",
        "Test tool-enabled agents",
    ],
}
```

---

## Test Generation

Every mission must include E2E test specifications. Generate tests in two formats:

### 1. Playwright Spec File

Generate a test file at `src/frontend/e2e/tests/mission-{id}.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'
import { missionSelectors } from '../helpers/selectors'

const MISSION_ID = 'L015-tool-basics'

test.describe('Mission L015: Tool Basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/missions')
    await page.waitForLoadState('networkidle')
  })

  test('mission card displays correctly', async ({ page }) => {
    const card = page.locator(`[data-testid="mission-card-${MISSION_ID}"]`)
    await expect(card).toBeVisible()
  })

  test('can start mission', async ({ page }) => {
    const card = page.locator(`[data-testid="mission-card-${MISSION_ID}"]`)
    await card.locator('button:has-text(/Start|Continue/)').click()
    await expect(page).toHaveURL(/\/mission\/L015.*\/canvas/)
  })

  // Generate highlight tests for each step with highlight field
  test('step 1 Show Me highlights sidebar:tools', async ({ page }) => {
    // Navigate to mission canvas
    // Click Show Me button
    // Verify highlight appears
    // Test dismissal with Escape key
  })

  test('progress persists after reload', async ({ page }) => {
    // Start mission, complete a step, reload, verify progress
  })
})
```

### 2. Playwright MCP Test Checklist

Generate a manual test checklist using Playwright MCP tools:

```markdown
## MCP Test: Mission L015-tool-basics

### Setup
browser_navigate: http://localhost:3001/dashboard/missions
browser_wait_for: time=2
browser_snapshot

### Test Mission Card
- [ ] Card visible with name "Tool Basics"
- [ ] Shows "15 min" and "Beginner"
- [ ] Shows "4 steps"

### Test Start Flow
browser_click: element="Start Mission", ref={from_snapshot}
browser_wait_for: text="Step 1"
browser_snapshot

### Test Each Step Highlight
Step 1 (sidebar:tools):
browser_click: element="Show Me", ref={from_snapshot}
browser_wait_for: time=1
browser_take_screenshot: filename="L015-step1-highlight.png"
browser_press_key: key="Escape"

Step 2-4: [repeat pattern]

### Verify Completion
- [ ] All steps show checkmarks
- [ ] Completion banner visible
- [ ] "Next Mission" button appears

### Error Check
browser_console_messages: level="error"
# Should be empty
```

### Test Generation Rules

1. **One highlight test per step with `highlight` field**
2. **Include progress persistence test for all missions**
3. **Include error handling test (API failure mock)**
4. **For canvas_mode missions**: Include iframe load verification
5. **For auto-validation steps**: Note as "requires canvas interaction"
6. **CRITICAL - Highlight cleanup test**: Test 10+ cycles of Show Me → dismiss to verify target element remains visible and clickable (see HIGHLIGHT_PATTERNS.md "driver.js Internals & Cleanup")

See [E2E_TEST_PATTERNS.md](./E2E_TEST_PATTERNS.md) for complete test templates.

---

## Highlight Configuration

Every action step should have a highlight to guide users. Use the standard patterns:

| Element Type | Pattern | Example |
|--------------|---------|---------|
| Canvas Node | `node:{type}` | `node:Agent` |
| Input Field | `field:{name}` | `field:agent_instructions` |
| Button | `button:{id}` | `button:play` |
| Sidebar | `sidebar:{category}` | `sidebar:tools` |
| Panel | `panel:{name}` | `panel:chat` |

### Highlight Template

```python
"highlight": {
    "element": "field:agent_instructions",
    "title": "Charlie's Job Description",  # 2-5 words, friendly
    "description": "Type what you want Charlie to do.",  # 1-2 sentences
    "position": "left",  # top, bottom, left, right, auto
    "auto_trigger": False,  # True for info steps, False for action steps
}
```

### Critical Technical Requirements

When implementing highlights, the underlying code MUST follow these rules:

1. **Click capture overlay requires `pointer-events: auto`** - The driver.js SVG overlay has `pointer-events: none`, so any click capture div must explicitly set `pointer-events: auto`
2. **Z-index layering**: driver-overlay (10000) < click-capture (10001) < popover (10002)
3. **Never remove `.driver-active-element` elements** - Only remove the class, not the element itself
4. **Test 10+ dismiss cycles** - Always verify highlights can be shown/dismissed repeatedly without breaking the UI

See [HIGHLIGHT_PATTERNS.md](./HIGHLIGHT_PATTERNS.md) for complete technical reference including code examples.

---

## Language Guidelines

### Dog Trainer Translation Table

| Technical Term | Dog Trainer Translation |
|----------------|------------------------|
| System Prompt | Charlie's Job Description |
| Temperature | Creativity |
| Agent | Charlie (or agent's name) |
| Tools | Tricks |
| RAG / Knowledge | Reference Library |
| Workflow | Routine |
| API | Commands |
| Token Limit | Attention Span |

### Step Description Formula

```
[What to do] + [Where to do it] + [Why/What happens]
```

**Good Examples**:
- "Click the Agent component (the middle box). This is where you tell your agent how to behave."
- "Drag from the blue dot on Chat Input to the Agent. This connects them so messages flow through."

**Bad Examples**:
- "Configure the component." (too vague)
- "Set the system prompt parameter." (too technical)

---

## Validation Checklist

Before finalizing, verify:

### Schema Validation
- [ ] All required fields present
- [ ] ID follows hybrid format (L###-slug)
- [ ] Category is valid (`skill_sprint` or `applied_build`)
- [ ] Difficulty is valid (`beginner`, `intermediate`, `advanced`)
- [ ] sort_order is unique
- [ ] Steps have sequential IDs starting at 1
- [ ] Step types are valid (`info` or `action`)

### Educational Validation
- [ ] Max 2 new concepts for skill sprints
- [ ] Step count: 3-4 for sprints, 5-6 for builds
- [ ] Time matches type (10-15 sprint, 30-45 build)
- [ ] Outcomes list 2-4 items
- [ ] Dog trainer language used consistently

### Dependency Validation
- [ ] Prerequisites reference valid mission IDs
- [ ] template_id exists in Langflow (if canvas_mode)
- [ ] allowed_components are valid Langflow components
- [ ] component_pack categories exist in Langflow

---

## Course Components Reference

These custom Langflow components simplify the canvas for learners:

| Component | Purpose | First Appears |
|-----------|---------|---------------|
| Mission Brief | Shows current objective | L001 |
| RAG Kit | Simplified document Q&A | L007 |
| Memory Kit | One-click conversation memory | L016 |
| Ship Pack | Deploy (link, embed, API) | L012 |
| Metrics Panel | Token/cost tracking | L019 |

If a mission needs a component that doesn't exist, note it in the output:

```python
"required_components": [
    {"name": "Email Tool", "status": "needs_creation", "category": "tools"},
]
```

---

## File Locations

After generating, mission should be added to:

1. **Backend seed data**: `src/backend/app/models/mission.py` (DEFAULT_MISSIONS)
2. **Template** (if new): `src/backend/templates/flows/{template_id}.json`
3. **Component** (if new): Use `/component-builder` skill
4. **E2E Tests**: `src/frontend/e2e/tests/mission-{id}.spec.ts`
5. **MCP Test Checklist**: Include in mission documentation or `.claude/skills/mission-builder/TESTS/`

---

## Reference Documentation

For detailed specifications, see:

- [MISSION_SCHEMA.md](./MISSION_SCHEMA.md) - Complete data model
- [STEP_PATTERNS.md](./STEP_PATTERNS.md) - Step pattern templates
- [HIGHLIGHT_PATTERNS.md](./HIGHLIGHT_PATTERNS.md) - Show Me guidance system
- [E2E_TEST_PATTERNS.md](./E2E_TEST_PATTERNS.md) - E2E and Playwright MCP test patterns
- [EDUCATIONAL_PRINCIPLES.md](./EDUCATIONAL_PRINCIPLES.md) - Teaching guidelines
- [EXAMPLES/](./EXAMPLES/) - Full mission examples

---

## Example Usage

### Interview Mode

**User**: Create a mission for teaching users about conversation memory

**Claude**: I'll help you create a mission about conversation memory. Let me ask a few questions:

1. **Learning Goal**: What specific aspect of memory? (Storing context, recalling previous messages, long-term memory?)

2. **Curriculum Position**: Where should this fit? After L015 (tools) makes sense - would L016 work?

3. **Mission Type**: This seems like a focused concept - Skill Sprint (10-15 min)?

4. **Canvas Mode**: Should they see the Memory Kit component on canvas?

5. **Deliverable**: What should they build? An agent that remembers their name across conversations?

*[After gathering answers, generates full mission definition]*

### Brief Mode

**User**:
```
/mission-builder

Mission Brief:
- ID: L016-memory-basics
- Name: Memory Basics
- Type: skill_sprint
- Concepts: Conversation memory, Context persistence
- Canvas: Yes, with Memory Kit component
- Template: agent_base
- Prereqs: L010
- Deliverable: Agent that remembers user's name
```

**Claude**: *[Generates full mission definition based on brief]*

---

## Multi-Tenant Considerations

When creating missions for organization-specific curricula:

1. **ID Format**: Use `ORG###-slug` instead of `L###-slug`
2. **Prerequisites**: Can reference both core (L###) and org missions
3. **Components**: May need org-specific custom components
4. **Templates**: Can use org-specific flow templates

```python
{
    "id": "ORG001-salesforce-agent",
    "name": "Salesforce Agent",
    "prerequisites": ["L015-tool-basics"],  # References core curriculum
    "component_pack": {
        "allowed_components": ["Agent", "SalesforceConnector"],  # Org-specific
    },
}
```
