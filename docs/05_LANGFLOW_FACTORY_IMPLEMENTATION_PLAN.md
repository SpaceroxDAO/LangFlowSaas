# Langflow Factory Integration - Implementation Plan

> **Created**: 2026-01-14
> **Status**: Pending Review
> **Source**: Analysis of [langflow-factory](https://github.com/Empreiteiro/langflow-factory)

---

## Executive Summary

This plan outlines how to integrate learnings and patterns from the langflow-factory project into Teach Charlie AI. The goal is to improve our custom component quality, add utility scripts for operations, and potentially leverage their template library.

### Key Outcomes

1. **Standardized component development** - Consistent, production-grade components
2. **Operational tooling** - Backup, export, migration scripts
3. **Template gallery** - Pre-built agent types for users
4. **Improved streaming** - Better real-time chat experience

---

## Phase 1: Foundation (Immediate - Low Risk)

### 1.1 Adopt Logging Standards

**Current State**: Mixed `print()` statements and Python `logging` module
**Target State**: All components use `self.log()` consistently

**Changes Required**:
- Audit existing custom components in `src/backend/custom_components/`
- Replace `print()` and `logging.*` with `self.log()`
- Add log level context (`info`, `debug`, `warning`, `error`)

**Files to Modify**:
```
src/backend/custom_components/my_agents/*.py
src/backend/app/services/template_mapping.py (component generation)
```

**Effort**: ~2 hours
**Risk**: Very Low - Internal logging change only

---

### 1.2 Update Component Generation Template

**Current State**: Basic component structure in `template_mapping.py`
**Target State**: Components follow langflow-factory standards

**Changes Required**:

1. Update `_generate_component_code()` in `template_mapping.py`:
   - Add `version` attribute
   - Ensure `icon` uses Lucide names only
   - Add proper `description` field
   - Include `required=True` on mandatory inputs
   - Add `helper_text` for user guidance

2. Ensure generated components include:
   - Proper error handling with `self.log()`
   - Input validation before processing
   - Structured output types

**Template Before**:
```python
class {class_name}(Component):
    display_name = "{display_name}"
    description = "Custom agent component"
    icon = "bot"
```

**Template After**:
```python
class {class_name}(Component):
    display_name = "{display_name}"
    description = "{description}"
    icon = "Bot"  # Lucide icon
    name = "{class_name}"
    version = "1.0.0"
```

**Effort**: ~3 hours
**Risk**: Low - May need to regenerate existing components

---

### 1.3 Input Type Best Practices

**Current State**: Basic input definitions
**Target State**: Rich input configurations with validation

**Changes Required**:

Update input generation to include:
```python
MultilineInput(
    name="system_prompt",
    display_name="Charlie's Instructions",
    required=True,
    placeholder="You are a helpful assistant that...",
    helper_text="Describe how Charlie should behave and respond",
)
```

**Key Improvements**:
- `required=True` on mandatory fields
- `placeholder` text for guidance
- `helper_text` for tooltips
- `SecretStrInput` for any API keys

**Effort**: ~2 hours
**Risk**: Very Low

---

## Phase 2: Operational Tooling (Short-term)

### 2.1 Create Backup/Export Scripts

**Purpose**: Enable bulk export of agents and workflows for backup/migration

**Scripts to Create**:

| Script | Purpose | Priority |
|--------|---------|----------|
| `backup_agents.py` | Export all agents as JSON | High |
| `backup_workflows.py` | Export all workflows | High |
| `import_agents.py` | Bulk import agents | Medium |
| `transfer_project.py` | Move between instances | Low |

**Location**: `src/backend/scripts/`

**Implementation Pattern** (from langflow-factory):
```python
# backup_agents.py
async def backup_all_agents(output_dir: str):
    """Export all agents to individual JSON files"""
    agents = await db.get_all_agents()

    for agent in agents:
        export_data = await api.export_agent_component(agent.id)
        filename = f"{agent.name.replace(' ', '_').lower()}.json"

        with open(os.path.join(output_dir, filename), 'w') as f:
            json.dump(export_data, f, indent=2)

        print(f"Exported: {agent.name}")
```

**Effort**: ~4 hours
**Risk**: Low - Read-only operations

---

### 2.2 Add Admin CLI Commands

**Purpose**: Command-line tools for operations

**Commands to Add**:

```bash
# List all agents
python -m scripts.list_agents

# Export single agent
python -m scripts.export_agent --id <agent_id> --output ./backup/

# Backup all agents
python -m scripts.backup_agents --output ./backup/

# List all workflows
python -m scripts.list_workflows

# Health check
python -m scripts.health_check
```

**Effort**: ~3 hours
**Risk**: Low

---

## Phase 3: Streaming Enhancement (Medium-term)

### 3.1 Align Streaming Event Types

**Current State**: Raw SSE streaming
**Target State**: Structured event types matching langflow-factory pattern

**Event Type Standardization**:

| Event | Payload | Description |
|-------|---------|-------------|
| `token` | `{"chunk": "text"}` | Streaming text chunk |
| `add_message` | `{"sender": "...", "text": "..."}` | Complete message |
| `tool_call` | `{"tool": "...", "args": {...}}` | Tool invocation |
| `tool_result` | `{"tool": "...", "result": "..."}` | Tool response |
| `thinking` | `{"content": "..."}` | Reasoning display |
| `end` | `{"result": {...}}` | Stream complete |

**Files to Modify**:
```
src/backend/app/api/workflows.py (streaming endpoint)
src/frontend/src/hooks/useStreamingChat.ts
src/frontend/src/components/playground/StreamingMessageBubble.tsx
```

**Backend Change**:
```python
# Current
yield f"data: {chunk}\n\n"

# Proposed
yield f"data: {json.dumps({'event': 'token', 'chunk': chunk})}\n\n"
```

**Frontend Change**:
```typescript
// Handle structured events
const data = JSON.parse(event.data);
switch (data.event) {
  case 'token':
    appendToMessage(data.chunk);
    break;
  case 'tool_call':
    showToolCall(data.tool, data.args);
    break;
  case 'end':
    finalizeMessage(data.result);
    break;
}
```

**Effort**: ~6 hours
**Risk**: Medium - Changes streaming contract, needs frontend sync

---

### 3.2 Add Tool Call Display

**Purpose**: Show when agents use tools (knowledge retrieval, etc.)

**UI Component**:
```tsx
// ToolCallDisplay.tsx
function ToolCallDisplay({ tool, args, result, status }) {
  return (
    <div className="tool-call">
      <span className="tool-icon">{getToolIcon(tool)}</span>
      <span className="tool-name">{tool}</span>
      {status === 'pending' && <Spinner />}
      {status === 'complete' && <CheckIcon />}
    </div>
  );
}
```

**Effort**: ~4 hours
**Risk**: Low - Additive UI feature

---

## Phase 4: Template Gallery (Future)

### 4.1 Import langflow-templates

**Purpose**: Offer pre-built agent types to users

**Template Categories to Import**:

| Category | Templates | Teach Charlie Use |
|----------|-----------|-------------------|
| Customer Support | 9 | "Support Agent" preset |
| Document Intelligence | 10 | "Document Q&A" preset |
| Sales & Marketing | 7 | "Sales Assistant" preset |

**Implementation Approach**:

1. **Curate Templates**: Select 5-10 most relevant templates
2. **Adapt for Q&A**: Map templates to our 3-step wizard questions
3. **Create Presets**: Add "Start from template" option in wizard

**UI Flow**:
```
Create Agent
  └─> Start from scratch
  └─> Use a template
        ├─> Customer Support Bot
        ├─> Document Q&A Assistant
        ├─> Sales Helper
        └─> Custom...
```

**Effort**: ~8-12 hours
**Risk**: Medium - Requires template adaptation and testing

---

### 4.2 Template Preset System

**Database Changes**:
```sql
CREATE TABLE agent_templates (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    template_data JSONB,  -- Pre-filled Q&A answers
    flow_template JSONB,  -- Base Langflow flow
    icon VARCHAR(50),
    created_at TIMESTAMP
);
```

**API Endpoints**:
```
GET  /api/v1/templates           - List all templates
GET  /api/v1/templates/{id}      - Get template details
POST /api/v1/agents/from-template - Create agent from template
```

**Effort**: ~6 hours
**Risk**: Low - New feature, no breaking changes

---

## Phase 5: Dynamic UI (Future Enhancement)

### 5.1 Conditional Form Fields

**Purpose**: Show/hide form fields based on selections

**Example**: In Step 3 (Actions), show knowledge config only if RAG is enabled

**Current Flow**:
```
Step 3: Actions
  [x] Web Search
  [x] Knowledge Retrieval
  [x] Code Execution
```

**Enhanced Flow**:
```
Step 3: Actions
  [x] Web Search
  [x] Knowledge Retrieval
      └─> [Conditionally shown]
          - Chunk size: [500]
          - Top K results: [3]
  [x] Code Execution
```

**Implementation**:
```tsx
// CreateAgentPage.tsx
const [showKnowledgeConfig, setShowKnowledgeConfig] = useState(false);

<Checkbox
  checked={tools.knowledge}
  onChange={(e) => {
    setTools({...tools, knowledge: e.target.checked});
    setShowKnowledgeConfig(e.target.checked);
  }}
/>

{showKnowledgeConfig && (
  <KnowledgeConfigPanel
    chunkSize={knowledgeConfig.chunkSize}
    topK={knowledgeConfig.topK}
    onChange={setKnowledgeConfig}
  />
)}
```

**Effort**: ~4 hours
**Risk**: Low - UI enhancement only

---

## Implementation Priority Matrix

| Phase | Item | Effort | Impact | Risk | Priority |
|-------|------|--------|--------|------|----------|
| 1.1 | Logging Standards | 2h | Medium | Very Low | **P0** |
| 1.2 | Component Template | 3h | High | Low | **P0** |
| 1.3 | Input Best Practices | 2h | Medium | Very Low | **P0** |
| 2.1 | Backup Scripts | 4h | High | Low | **P1** |
| 2.2 | Admin CLI | 3h | Medium | Low | **P1** |
| 3.1 | Streaming Events | 6h | High | Medium | **P2** |
| 3.2 | Tool Call Display | 4h | Medium | Low | **P2** |
| 4.1 | Template Import | 10h | High | Medium | **P3** |
| 4.2 | Preset System | 6h | High | Low | **P3** |
| 5.1 | Dynamic Forms | 4h | Medium | Low | **P3** |

---

## Recommended Execution Order

### Sprint 1: Foundation (1-2 days)
1. ✅ Document standards (this document)
2. [ ] Phase 1.1: Logging standards
3. [ ] Phase 1.2: Component template update
4. [ ] Phase 1.3: Input best practices

### Sprint 2: Operations (1 day)
5. [ ] Phase 2.1: Backup scripts
6. [ ] Phase 2.2: Admin CLI

### Sprint 3: Streaming (1-2 days)
7. [ ] Phase 3.1: Streaming event types
8. [ ] Phase 3.2: Tool call display

### Sprint 4: Templates (2-3 days)
9. [ ] Phase 4.1: Template import
10. [ ] Phase 4.2: Preset system

### Sprint 5: Polish (1 day)
11. [ ] Phase 5.1: Dynamic forms

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Component logging consistency | ~30% | 100% |
| Input fields with helper text | ~10% | 80% |
| Backup automation | None | Daily |
| Template presets available | 0 | 5+ |
| Tool calls visible in UI | No | Yes |

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing components | Low | High | Test regeneration first |
| Streaming changes break chat | Medium | High | Feature flag, gradual rollout |
| Template adaptation effort | Medium | Medium | Start with 3 templates only |
| User confusion with presets | Low | Low | Clear UI labels |

---

## Dependencies

```
Phase 1 (Foundation)
    └─> No dependencies, can start immediately

Phase 2 (Operations)
    └─> Phase 1 complete (for consistent component format)

Phase 3 (Streaming)
    └─> Phase 1 complete
    └─> Frontend/backend coordination required

Phase 4 (Templates)
    └─> Phase 1, 2 complete
    └─> Database migration required

Phase 5 (Dynamic UI)
    └─> Can run in parallel with Phase 3-4
```

---

## Appendix: Files Reference

### Files to Create
```
docs/04_LANGFLOW_COMPONENT_STANDARDS.md  ✅ Created
docs/05_LANGFLOW_FACTORY_IMPLEMENTATION_PLAN.md  ✅ This file
src/backend/scripts/backup_agents.py
src/backend/scripts/backup_workflows.py
src/backend/scripts/list_agents.py
src/backend/scripts/health_check.py
```

### Files to Modify
```
src/backend/app/services/template_mapping.py
src/backend/app/api/workflows.py
src/backend/custom_components/my_agents/*.py
src/frontend/src/hooks/useStreamingChat.ts
src/frontend/src/pages/CreateAgentPage.tsx
```

### Database Migrations (Future)
```
Add agent_templates table
Add template_id to agent_components (optional FK)
```

---

## Approval

- [ ] Technical approach reviewed
- [ ] Priority order agreed
- [ ] Sprint assignments confirmed
- [ ] Ready to begin implementation

---

*Document prepared by Claude Code based on langflow-factory analysis*
