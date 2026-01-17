# Mission Builder Skill - Requirements Specification

> **Status**: Requirements Complete - Ready for Implementation
> **Created**: 2026-01-17
> **Based on**: User interview conducted via AskUserQuestion

---

## Executive Summary

Two complementary Claude Code skills will be created:

1. **`/mission-builder`** - Creates complete mission packages for the guided learning curriculum
2. **`/component-builder`** - Creates Langflow Custom Components (Course Components)

These skills will enable consistent, high-quality mission creation for the Teach Charlie AI platform, supporting a multi-tenant SaaS model where organizations can customize the base curriculum.

---

## Part 1: Interview Answers Summary

| Question | Decision |
|----------|----------|
| Output target | Flexible for multi-tenant SaaS (database-stored with JSON export) |
| Course Components | Langflow Custom Components (Python) |
| Walk Me guidance | Use existing driver.js system (same as Q&A wizard) |
| Mission chaining | Soft prerequisites with warnings (allow skip with confirmation) |
| Component filtering | Both: whitelist specific components + category show/hide |
| Template management | Langflow's built-in template system |
| Component generation | Yes, full Python code (via separate /component-builder skill) |
| Validation depth | Full simulation check (schema + educational + verify all dependencies) |
| Test pack format | Playwright-style E2E specs |
| Multi-tenant customization | Full customization with base curriculum inheritance |
| Spiral pattern enforcement | Suggested with override (advisory, not blocking) |
| Mission naming | Hybrid: `L001-tools-101` (sequential + semantic) |
| Workflow modes | Both: interactive interview + brief generation |
| Component management | Separate `/component-builder` skill |
| Output artifacts | Full mission package (def + template + components + tests + docs) |

---

## Part 2: Curriculum Design Context

### The Spiral Learning Pattern

Every 3 lessons follow this cycle:
1. **Skill Sprint** (10-15 min): One new concept, tiny flow, instant success
2. **Skill Sprint** (10-15 min): Add one more concept, still small
3. **Applied Build** (30-45 min): Ship a real agent using both concepts

### The Value Ladder (Progression)

| Stage | Focus | Example Missions |
|-------|-------|------------------|
| 1 | Personal quick wins | Email summaries, calendar assistant, daily planner |
| 2 | Personal knowledge + automation | Personal RAG, journal, second brain |
| 3 | Prosumer / creator / solo business | Content pipeline, lead capture, proposals |
| 4 | Business systems | CRM updates, support triage, KB RAG, routing |

### Course Components Library

Pre-built components that simplify Langflow for learners:

| Component | Purpose |
|-----------|---------|
| Keys & Connections Wizard | Simplified API key and OAuth setup |
| Agent Scaffold | Pre-configured agent with best practices |
| Google Workspace Toolset | Composio-backed email/calendar/drive |
| RAG Kit + Answer Composer | Simplified retrieval + citation |
| Memory Kit | Conversation memory with persistence |
| Scenario Test Runner | E2E testing within flows |
| Ship Pack | Embed snippet + API example + webhook helper |
| Output Formatter | Structured output without schema jargon |
| Guardrail Gate | Confirmation before sensitive actions |
| Intent Router | Route to specialist subflows |
| Approval Queue | Human-in-the-loop pattern |
| Batch Loop Helper | Safe iteration with checkpoints |

---

## Part 3: Mission Definition Schema

### Mission Object Structure

```typescript
interface Mission {
  // Identity
  id: string;                    // e.g., "L001-hello-flow"
  name: string;                  // e.g., "Hello Flow"
  description: string;           // What user will learn/build

  // Classification
  type: "skill_sprint" | "applied_build";
  category: "personal" | "creator" | "business" | "support";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_minutes: number;     // 10-15 for sprints, 30-45 for builds

  // Curriculum Position
  sequence_number: number;       // Position in curriculum (1, 2, 3...)
  spiral_position: 1 | 2 | 3;    // Position in 3-lesson cycle
  track?: string;                // Optional track: "personal_ops", "creator", "business"

  // Prerequisites
  prerequisites: string[];       // Mission IDs that should be completed first
  prerequisite_mode: "soft";     // Always soft - warn but allow skip

  // Skills & Learning
  new_skills: string[];          // Max 2 new concepts introduced
  skills_reinforced: string[];   // Previously learned skills used
  outcome: string;               // One sentence: what user gets

  // Canvas Configuration
  canvas_mode: boolean;
  template_id: string;           // Langflow template to start from
  continues_from?: string;       // Mission ID if continuing previous workflow
  component_pack: {
    allowed_components: string[];     // Whitelist of component names
    allowed_categories: string[];     // Categories to show
    hidden_categories: string[];      // Categories to hide
    course_components: string[];      // Custom course components needed
  };

  // Steps
  steps: MissionStep[];

  // Testing
  test_pack: E2ETestSpec[];

  // Ship Configuration
  ship_lanes: ("embed" | "api" | "webhook")[];
  artifact_type: string;         // What they've built: "template", "endpoint", "widget"

  // Driver.js Tours
  tours: {
    intro?: DriverStep[];        // Welcome tour
    per_step?: Record<number, DriverStep[]>;  // Tour for each step
  };

  // Metadata
  icon: string;
  sort_order: number;
  created_at: string;
  version: string;
}

interface MissionStep {
  id: number;
  title: string;
  description: string;
  type: "info" | "action";

  // Build Phase (from curriculum design)
  phase: "works" | "reliable" | "connected";

  // Validation
  validation?: {
    auto: boolean;               // Can be auto-validated from canvas events
    event_type?: string;         // node_added, edge_created, node_configured
    node_type?: string;          // Expected node type
    assertions?: string[];       // Conditions to check
  };

  // Walk Me / Driver.js
  highlight?: {
    selector: string;            // CSS selector to highlight
    description: string;         // Tooltip text
    click_target?: string;       // Where to click
  };

  // Help Content
  help_video?: string;           // URL to help video
  help_gif?: string;             // URL to animated GIF
  troubleshooting?: string[];    // Common issues and solutions
}

interface E2ETestSpec {
  name: string;
  description: string;
  prompt: string;

  // Assertions
  expects: {
    contains?: string[];         // Response should contain these
    not_contains?: string[];     // Response should NOT contain these
    traits?: string[];           // helpful, concise, cited, etc.
    structured_output?: object;  // Expected JSON structure
    tool_calls?: string[];       // Expected tools to be called
  };

  // Edge Cases
  scenario_type: "happy_path" | "edge_case" | "error_handling";
}

interface DriverStep {
  element?: string;              // CSS selector
  popover: {
    title: string;
    description: string;
    side: "top" | "bottom" | "left" | "right" | "over";
    align: "start" | "center" | "end";
  };
}
```

---

## Part 4: /mission-builder Skill Specification

### Skill Metadata

```yaml
---
name: mission-builder
description: |
  Create guided learning missions for Teach Charlie AI platform.
  Use when designing new tutorials, building learning paths, creating
  canvas-mode educational content, or when user mentions "mission",
  "tutorial", "learning module", "lesson", or "guided exercise".

  Supports two modes:
  - Interactive: Ask questions to build mission incrementally
  - Brief: Generate from a provided specification

allowed-tools: Read, Grep, Write, Edit, Bash(python:*)
user-invocable: true
---
```

### Invocation Modes

**Interactive Mode** (default):
```
/mission-builder
```
Skill asks questions one-by-one:
1. What's the learning outcome?
2. What type? (skill sprint / applied build)
3. What new skills are introduced? (max 2)
4. What template to start from?
5. What course components are needed?
6. Walk through step creation...

**Brief Mode**:
```
/mission-builder --brief
```
User provides specification upfront:
```yaml
outcome: "Build a daily co-pilot that creates personalized daily plans"
type: applied_build
new_skills: [memory_persistence, calendar_integration]
template: memory_chatbot
course_components: [Memory Kit, Ship Pack]
```
Skill generates complete mission from brief.

### Output Artifacts

A complete mission generation produces:

```
missions/
└── L003-daily-copilot/
    ├── mission.json           # Complete mission definition
    ├── mission.py             # Python dict for DEFAULT_MISSIONS
    ├── template.json          # Langflow flow template (if new)
    ├── tests/
    │   └── e2e.spec.ts        # Playwright test specifications
    ├── docs/
    │   ├── README.md          # Mission documentation
    │   └── TROUBLESHOOTING.md # Common issues
    └── assets/
        └── tours.json         # Driver.js tour definitions
```

### Validation Checklist

The skill validates before outputting:

**Schema Validation**:
- [ ] All required fields present
- [ ] Types correct (id is string, steps is array, etc.)
- [ ] ID follows hybrid naming: `L{NNN}-{slug}`
- [ ] Sequence number is unique

**Educational Validation**:
- [ ] Max 2 new skills introduced
- [ ] Step count: 3-6 steps
- [ ] Spiral position matches type (1,2 = sprint, 3 = build)
- [ ] Estimated time matches type (10-15 sprint, 30-45 build)
- [ ] Prerequisites list valid mission IDs

**Dependency Validation**:
- [ ] Template exists in Langflow
- [ ] All course components exist (or flag for creation)
- [ ] All allowed_components are valid Langflow component names
- [ ] continues_from references valid mission ID

**Test Pack Validation**:
- [ ] At least 5 test prompts
- [ ] Mix of happy_path and edge_case scenarios
- [ ] All assertions are valid assertion types

---

## Part 5: /component-builder Skill Specification

### Skill Metadata

```yaml
---
name: component-builder
description: |
  Create Langflow Custom Components (Course Components) for Teach Charlie AI.
  Use when building simplified components for the learning curriculum,
  creating toolset wrappers, or when user mentions "course component",
  "custom component", "simplified component", or specific component names
  like "Memory Kit", "Ship Pack", "Agent Scaffold".

allowed-tools: Read, Grep, Write, Edit, Bash(python:*)
user-invocable: true
---
```

### Component Categories

Components are organized under "Actions" in the Langflow sidebar:

```
Actions/
├── Wizards/
│   ├── Keys & Connections Wizard
│   └── Deployment Wizard
├── Agent Kits/
│   ├── Agent Scaffold
│   └── Intent Router
├── Data Kits/
│   ├── RAG Kit
│   ├── Memory Kit
│   └── KB Sync Kit
├── Toolsets/
│   ├── Google Workspace Toolset
│   ├── Personal Database Toolset
│   ├── Research Toolset
│   └── CRM Toolset
├── Safety/
│   ├── Guardrail Gate
│   ├── Approval Queue
│   └── Redaction Filter
├── Output/
│   ├── Output Formatter
│   └── Citation Formatter
├── Testing/
│   ├── Scenario Test Runner
│   └── Regression Snapshot
└── Shipping/
    ├── Ship Pack
    └── Template Exporter
```

### Component Definition Schema

```python
# Each course component follows this pattern
from langflow.custom import Component
from langflow.io import MessageTextInput, Output

class CourseComponent(Component):
    display_name = "Component Name"
    description = "What this component does (educational, friendly)"
    icon = "icon-name"

    # Simplified inputs (hide complexity)
    inputs = [
        # Only expose what learner needs to configure
    ]

    outputs = [
        # Clear, named outputs
    ]

    def build(self, ...):
        # Implementation that handles complexity internally
        pass
```

### Output Artifacts

```
components/
└── memory_kit/
    ├── memory_kit.py          # Langflow custom component
    ├── __init__.py
    ├── README.md              # Usage documentation
    └── tests/
        └── test_memory_kit.py # Component unit tests
```

---

## Part 6: Multi-Tenant Architecture

### Base Curriculum Inheritance

```
Base Curriculum (maintained by Teach Charlie)
├── Core Skill Sprints (L001-L040)
├── Core Applied Builds
├── Core Course Components
└── Core Templates

Organization Curriculum (customizable)
├── Inherits: Base Curriculum
├── Can Add: Custom missions
├── Can Modify: Mission order, prerequisites
├── Can Disable: Specific missions
├── Can Rebrand: Names, descriptions, icons
└── Cannot Modify: Core component logic (for safety)
```

### Database Schema Considerations

```sql
-- Base missions (system-wide)
CREATE TABLE base_missions (
    id VARCHAR PRIMARY KEY,      -- L001-hello-flow
    definition JSONB NOT NULL,
    version VARCHAR NOT NULL,
    created_at TIMESTAMP
);

-- Organization mission overrides
CREATE TABLE org_mission_overrides (
    org_id UUID REFERENCES organizations(id),
    mission_id VARCHAR REFERENCES base_missions(id),
    enabled BOOLEAN DEFAULT true,
    custom_name VARCHAR,
    custom_description TEXT,
    custom_order INTEGER,
    custom_prerequisites VARCHAR[],
    PRIMARY KEY (org_id, mission_id)
);

-- Organization custom missions
CREATE TABLE org_custom_missions (
    id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations(id),
    mission_id VARCHAR NOT NULL,  -- ORG001-custom-mission
    definition JSONB NOT NULL,
    created_at TIMESTAMP
);
```

---

## Part 7: Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Create skill directory structure
- [ ] Document complete mission schema (this doc)
- [ ] Catalog existing L001-L010 missions as examples
- [ ] Create mission validation script

### Phase 2: /mission-builder Core (Week 2)
- [ ] Create SKILL.md with interview mode
- [ ] Implement brief mode
- [ ] Add schema validation
- [ ] Add educational validation
- [ ] Test with 3 new missions

### Phase 3: /component-builder (Week 3)
- [ ] Create SKILL.md for component generation
- [ ] Define component patterns and templates
- [ ] Generate 5 core components (Memory Kit, Ship Pack, etc.)
- [ ] Test component integration with Langflow

### Phase 4: Integration (Week 4)
- [ ] Full dependency validation
- [ ] E2E test generation
- [ ] Driver.js tour generation
- [ ] Multi-tenant database schema
- [ ] Migration scripts

### Phase 5: Polish (Week 5)
- [ ] Generate missions L011-L020
- [ ] Refine based on output quality
- [ ] Documentation and examples
- [ ] Team training on skill usage

---

## Part 8: Success Criteria

### The skills are successful when:

| Metric | Target |
|--------|--------|
| Mission creation time | < 30 minutes (interview mode) |
| Mission creation time | < 10 minutes (brief mode) |
| Schema validation pass rate | 100% |
| Missions requiring post-gen fixes | < 10% |
| Component generation accuracy | > 90% working on first try |
| Test coverage per mission | 5+ E2E specs |
| Learner completion rate | > 70% (missions created via skill) |

### Quality Bar

Every mission created by the skill must:

1. **Work**: Flow runs without errors on happy path
2. **Teach**: Introduces max 2 new concepts clearly
3. **Delight**: Includes helpful tours and troubleshooting
4. **Ship**: Produces a real, usable artifact
5. **Test**: Has comprehensive E2E coverage

---

## Part 9: Open Items for Implementation

### Questions Resolved
- ✅ Output format and storage
- ✅ Component creation approach
- ✅ Validation depth
- ✅ Multi-tenant strategy
- ✅ Skill invocation modes

### Remaining Decisions (can be made during implementation)
- Exact Driver.js tour format for each step type
- E2E test runner integration details
- Component hot-reload during development
- Version migration strategy for curriculum updates

---

## References

- Curriculum Design: User-provided 40-lesson plan
- Existing Missions: `src/backend/app/models/mission.py`
- Langflow Components: https://docs.langflow.org/components-custom-components
- Driver.js: https://driverjs.com/
- Playwright: https://playwright.dev/
