# Mission Builder Skill - Planning Document

> **Status**: Planning Phase (No Code Yet)
> **Created**: 2026-01-17
> **Purpose**: Define a Claude Code skill for consistently creating guided learning missions

---

## Executive Summary

The guided education system is the core value proposition of Teach Charlie AI. To ensure consistent, high-quality mission creation over time, we need a dedicated Claude Code skill that:

1. Understands the mission data model and constraints
2. Follows educational best practices (progressive disclosure, dog-trainer metaphor)
3. Generates valid mission definitions with proper step structures
4. Integrates with the canvas system (component packs, templates)
5. Validates missions against the platform's requirements

---

## Part 1: Claude Code Skills - Key Learnings

### What is a Skill?

A **Skill** is a markdown file (SKILL.md) with YAML frontmatter that teaches Claude how to perform a specific task. Unlike slash commands (explicit `/command`), skills can be:
- **User-invocable**: Triggered via `/skill-name`
- **Model-invocable**: Claude automatically applies them based on context

### Skill File Structure

```
.claude/skills/
└── mission-builder/
    ├── SKILL.md              # Required: metadata + main instructions
    ├── MISSION_SCHEMA.md     # Reference: data model documentation
    ├── STEP_PATTERNS.md      # Reference: common step patterns
    ├── EXAMPLES.md           # Reference: example missions
    └── scripts/
        └── validate-mission.py  # Utility: validation script
```

### Required SKILL.md Anatomy

```yaml
---
name: mission-builder                    # Required: lowercase, hyphens only
description: |                           # Required: triggers + capabilities
  Create guided learning missions for Teach Charlie AI.
  Use when creating new missions, designing learning paths,
  or building canvas-mode educational content.
allowed-tools: Read, Grep, Write, Edit   # Optional: restrict tool access
user-invocable: true                     # Show in slash menu as /mission-builder
---

# Mission Builder

[Instructions for Claude on how to build missions]
```

### Best Practices Discovered

| Practice | Why It Matters |
|----------|----------------|
| **Keep SKILL.md < 500 lines** | Faster context loading, use supporting files for detail |
| **Specific description with trigger keywords** | Claude uses this to decide when to invoke |
| **Progressive disclosure** | Core instructions in SKILL.md, details in linked files |
| **Use scripts for validation** | Execute without reading, only consume output |
| **Restrict tools with allowed-tools** | Prevents unintended modifications |

---

## Part 2: Existing Project Infrastructure

### Current Command Structure

The project already has a well-organized `.claude/` directory:

```
.claude/
├── settings.json           # Main configuration
├── agents/                 # 5 core agents (architect, implementer, etc.)
├── commands/               # 8 slash commands organized by category
│   ├── plan/              # /plan/spec, /plan/issues
│   ├── setup/             # /setup/mcp, /setup/permissions
│   ├── ops/               # /ops/doctor, /ops/worktree-*
│   └── docs/              # /docs/update
└── hooks/                  # pre-tool-use, post-edit, pre-commit
```

### Mission System Architecture

From the codebase exploration:

**Backend Model** (`src/backend/app/models/mission.py`):
- `id`: Unique identifier (e.g., "L010")
- `name`: Display name
- `description`: What the mission teaches
- `category`: "skill_sprint" or "applied_build"
- `difficulty`: "beginner", "intermediate", "advanced"
- `estimated_minutes`: Time estimate
- `steps`: Array of step objects
- `canvas_mode`: Boolean for canvas integration
- `template_id`: Langflow template to use
- `component_pack`: Allowed components for mission

**Step Structure**:
```python
{
    "id": 1,
    "title": "Step title",
    "description": "What to do",
    "type": "info" | "action",
    "validation": { ... }  # Optional auto-validation rules
}
```

**Frontend Integration**:
- `MissionsPage.tsx`: Mission list and navigation
- `MissionSidePanel.tsx`: Canvas-integrated step guide
- `CanvasViewerPage.tsx`: Canvas + mission panel

---

## Part 3: Mission Builder Skill Requirements

### Core Goal

Create a skill that can be invoked to:
1. **Design** a new mission with proper educational scaffolding
2. **Generate** the mission definition (Python dict for DEFAULT_MISSIONS)
3. **Validate** the mission against platform requirements
4. **Document** the mission's learning objectives and outcomes

### Functional Requirements

| Requirement | Description |
|-------------|-------------|
| **FR1: Mission Design** | Guide through mission concept, objectives, target audience |
| **FR2: Step Generation** | Create 3-6 steps with progressive complexity |
| **FR3: Canvas Integration** | Configure component_pack and template_id for canvas_mode |
| **FR4: Validation** | Verify all required fields, step IDs, category values |
| **FR5: Output Format** | Generate Python dict ready for DEFAULT_MISSIONS |
| **FR6: Educational Alignment** | Apply "dog trainer" metaphor, friendly language |

### Non-Functional Requirements

| Requirement | Description |
|-------------|-------------|
| **NFR1: Consistency** | Every mission follows the same structure and quality bar |
| **NFR2: Discoverability** | Skill should trigger when discussing "missions", "learning", "tutorials" |
| **NFR3: Efficiency** | Complete mission creation in single conversation |
| **NFR4: Maintainability** | Easy to update as mission system evolves |

---

## Part 4: Skill Design Specification

### Proposed Structure

```
.claude/skills/mission-builder/
├── SKILL.md                    # Main skill definition (~200 lines)
├── MISSION_SCHEMA.md           # Complete data model reference
├── STEP_PATTERNS.md            # Common step patterns and templates
├── EDUCATIONAL_PRINCIPLES.md   # Dog-trainer metaphor, UX guidelines
├── EXAMPLES/
│   ├── L010_build_first_agent.md
│   └── L001_hello_flow.md
└── scripts/
    └── validate_mission.py     # JSON schema validation
```

### SKILL.md Outline

```yaml
---
name: mission-builder
description: |
  Create guided learning missions for Teach Charlie AI platform.
  Use when designing new tutorials, building learning paths, creating
  canvas-mode educational content, or when user mentions "mission",
  "tutorial", "learning module", or "guided exercise".
allowed-tools: Read, Grep, Write, Edit, Bash(python scripts/*)
user-invocable: true
---

# Mission Builder Skill

## Purpose
[Why this skill exists, what problem it solves]

## Mission Design Process
1. Gather Requirements (audience, objectives, prerequisites)
2. Design Learning Path (steps, progressive disclosure)
3. Configure Canvas Integration (if canvas_mode)
4. Generate Mission Definition
5. Validate and Output

## Step Design Guidelines
[How to write effective steps]

## Canvas Mode Configuration
[When and how to use canvas_mode, component_pack]

## Output Format
[Python dict structure for DEFAULT_MISSIONS]

## Validation Checklist
[What must be true for a valid mission]
```

### Key Supporting Files

**MISSION_SCHEMA.md** should document:
- All fields with types and constraints
- Valid category and difficulty values
- Step structure requirements
- component_pack schema
- Validation rules

**STEP_PATTERNS.md** should include:
- "Explore" pattern (info type, orientation)
- "Do This" pattern (action type, specific task)
- "Configure" pattern (action type, settings change)
- "Test It" pattern (action type, verification)
- "Celebrate" pattern (info type, completion)

**EDUCATIONAL_PRINCIPLES.md** should cover:
- Dog-trainer metaphor application
- Friendly, encouraging language
- Progressive complexity
- Error recovery guidance
- Celebration of progress

---

## Part 5: Implementation Checklist

### Phase 1: Foundation (Documentation)
- [ ] Document complete mission data model in MISSION_SCHEMA.md
- [ ] Catalog existing missions as examples
- [ ] Define step patterns and templates
- [ ] Write educational principles guide
- [ ] Create validation rules/schema

### Phase 2: Skill Creation
- [ ] Create `.claude/skills/mission-builder/` directory
- [ ] Write SKILL.md with frontmatter and core instructions
- [ ] Add supporting documentation files
- [ ] Create validation script (Python)
- [ ] Test skill invocation via `/mission-builder`

### Phase 3: Validation & Refinement
- [ ] Test creating 3 different mission types
- [ ] Verify generated missions work in platform
- [ ] Refine instructions based on output quality
- [ ] Add edge case handling
- [ ] Document common issues and solutions

### Phase 4: Integration
- [ ] Add skill to project documentation
- [ ] Create workflow for adding missions to DEFAULT_MISSIONS
- [ ] Consider: auto-migration script for new missions
- [ ] Consider: mission preview/testing mode

---

## Part 6: Open Questions

### Design Decisions Needed

1. **Skill vs Command**: Should this be a skill (model-invokable) or command (explicit /mission-builder)?
   - **Recommendation**: Start as command for explicit control, convert to skill later

2. **Output Target**: Where should generated missions go?
   - Option A: Output Python dict to copy/paste into code
   - Option B: Write directly to a staging file
   - Option C: Create migration file
   - **Recommendation**: Option A initially (safer, reviewable)

3. **Canvas Template Creation**: Should skill also create Langflow templates?
   - **Recommendation**: Phase 2 - start with missions only, add template generation later

4. **Validation Depth**: How strict should validation be?
   - **Recommendation**: Strict on structure, advisory on content quality

### Questions for Product

1. What categories should exist beyond skill_sprint and applied_build?
2. What's the target mission count for launch?
3. Should missions have dependencies/prerequisites enforced?
4. What metrics define a "successful" mission?

---

## Part 7: Success Criteria

### The skill is successful when:

1. **Consistency**: Any team member can create missions that match existing quality
2. **Speed**: Mission creation takes < 30 minutes including validation
3. **Completeness**: Generated missions include all required fields
4. **Correctness**: Missions work in platform without code changes
5. **Education**: Missions follow pedagogical best practices

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Fields validation pass rate | 100% |
| Mission creation time | < 30 min |
| Missions requiring post-generation fixes | < 20% |
| User completion rate (missions created with skill) | > 70% |

---

## Next Steps

1. **Review this document** - Ensure alignment on goals and approach
2. **Finalize design decisions** - Answer open questions above
3. **Create supporting documentation** - MISSION_SCHEMA.md first
4. **Build the skill** - SKILL.md + validation script
5. **Test with real missions** - Create 2-3 missions using the skill
6. **Iterate** - Refine based on output quality

---

## References

- Claude Code Skills Documentation: https://docs.anthropic.com/claude-code/skills
- Project Mission System: `src/backend/app/models/mission.py`
- Existing Missions: `DEFAULT_MISSIONS` in mission model
- Educational UX: `docs/00_PROJECT_SPEC.md` (dog-trainer metaphor)
