# Phase 0-4 Implementation Plan: Real Tool Connections

**Document Version:** 1.0
**Date:** 2026-01-05
**Purpose:** Technical blueprint for making Phase 0-4 tools functional in Langflow

---

## Executive Summary

This document outlines the implementation plan for making the tool selections in Step 3 of the Q&A wizard **actually functional** in Langflow. Currently, tools are stored as text and injected into the system prompt. This plan upgrades to **real Langflow components** that will be visible and editable when users "Unlock Flow."

### The Core Problem

| Aspect | Current State | Target State |
|--------|---------------|--------------|
| Tool storage | Text in system prompt | Real Langflow tool components |
| Flow architecture | `LanguageModelComponent` (no tools port) | `Agent` component (has tools port) |
| Canvas view | Tools not visible | Tools appear as connected nodes |
| Functionality | Tools are descriptive only | Tools actually work (web search, etc.) |

---

## Part 1: Langflow Architecture Analysis

### Current Flow Structure (support_bot.json)

```
ChatInput ──────────────────────┐
                                ↓
Memory ───→ Prompt ───→ LanguageModelComponent ───→ ChatOutput
```

**Key limitation:** `LanguageModelComponent` has no `tools` input port. Tools cannot be connected.

### Required Flow Structure (Agent-based)

```
ChatInput ─────────────────────────────────────┐
                                               ↓
Memory ───→ Prompt (optional) ───→ Agent ───→ ChatOutput
                                     ↑
CalculatorComponent ─────────────────┤
URLComponent ────────────────────────┤
SearchAPIComponent ──────────────────┘
```

**Key change:** `Agent` component has:
- `input_value` port for user messages
- `tools` port that accepts multiple tool connections
- `system_prompt` field for instructions
- Built-in LLM configuration
- Autonomous decision-making for when to use tools

### Agent Component Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `input_value` | Message | User input (from ChatInput) |
| `system_prompt` | str | Agent instructions/persona |
| `tools` | Tool[] | Connected tool components |
| `model_name` | str | LLM model (e.g., "gpt-4o-mini") |
| `agent_llm` | str | Provider (e.g., "OpenAI", "Anthropic") |
| `temperature` | float | Creativity (0-1) |
| `response` | Message | Output (to ChatOutput) |

### Tool Connection Pattern

Tools connect via their `component_as_tool` output to the Agent's `tools` input:

```
ToolComponent ──[component_as_tool]──→ [tools]── Agent
```

Multiple tools can connect to the same `tools` port (many-to-one relationship).

---

## Part 2: Available Tool Components in Langflow

### Verified Tool Components

| Tool ID (Teach Charlie) | Langflow Component | Package | Requires API Key |
|------------------------|-------------------|---------|------------------|
| `web_search` | `SearchAPIComponent` | langflow | Yes (SearchAPI.io) |
| `web_search` | `TavilySearchComponent` | langflow | Yes (Tavily) |
| `web_search` | `DuckDuckGoSearchComponent` | langflow | No (free) |
| `calculator` | `CalculatorComponent` | langflow | No |
| `url_reader` | `URLComponent` | langflow | No |
| `python_code` | `PythonREPLComponent` | langflow | No |

### Recommended Tool Mapping

For MVP, map our tools to these Langflow components:

| Q&A Tool Selection | Langflow Component | Notes |
|-------------------|-------------------|-------|
| "Web Search" | `DuckDuckGoSearchComponent` | Free, no API key needed |
| "Google Maps" | Custom or placeholder | Requires Google API (defer) |
| "Image Generator" | Placeholder | Requires DALL-E API (defer) |
| "Video Creator" | Placeholder | Not available in Langflow |
| "Calculator" | `CalculatorComponent` | Built-in, works immediately |
| "URL Reader" | `URLComponent` | Built-in, works immediately |

### Placeholder Strategy

For tools without Langflow equivalents (Image Generator, Video Creator, Google Maps):
1. **Phase 0-4:** Show in UI but mark as "Coming Soon"
2. **Flow generation:** Don't add to flow if no component exists
3. **Future phases:** Add custom components when ready

---

## Part 3: Template Restructuring

### New Template Architecture

Create a new Agent-based template (`agent_with_tools.json`) with:

1. **Base components** (always present):
   - `ChatInput` - User message input
   - `Agent` - Core reasoning engine
   - `ChatOutput` - Response display
   - `Memory` - Conversation history (optional, Agent may have built-in)

2. **Conditional tool components** (added based on Q&A selections):
   - Only add tools the user selected
   - Each tool needs proper positioning and edge connections

### Template Generation Strategy

**Option A: Single Template + Dynamic Injection**
- One base template with Agent
- Add tool nodes dynamically
- Add edges dynamically
- Pros: Simple, less maintenance
- Cons: Complex edge generation logic

**Option B: Multiple Pre-built Templates**
- Template for each tool combination
- Pre-configured edges
- Pros: Predictable, easy debugging
- Cons: Combinatorial explosion (2^n templates for n tools)

**Recommendation: Hybrid Approach**
- Base Agent template (no tools)
- Tool component snippets (one per tool)
- Dynamic composition at flow creation time

### Flow JSON Structure Reference

```json
{
  "name": "Agent Template",
  "data": {
    "nodes": [
      {
        "id": "Agent-xxx",
        "data": {
          "type": "Agent",
          "node": {
            "template": {
              "system_prompt": { "value": "..." },
              "model_name": { "value": "gpt-4o-mini" },
              "agent_llm": { "value": "OpenAI" }
            }
          }
        },
        "position": { "x": 400, "y": 200 }
      },
      {
        "id": "DuckDuckGoSearchComponent-xxx",
        "data": {
          "type": "DuckDuckGoSearchComponent",
          "node": {
            "outputs": [
              { "name": "component_as_tool", ... }
            ]
          }
        },
        "position": { "x": 100, "y": 300 }
      }
    ],
    "edges": [
      {
        "source": "DuckDuckGoSearchComponent-xxx",
        "sourceHandle": "...[component_as_tool]...",
        "target": "Agent-xxx",
        "targetHandle": "...[tools]..."
      }
    ]
  }
}
```

---

## Part 4: Implementation Plan

### Phase 0: Foundation (No Code Changes)
**Status:** Already complete in current MVP

- 3-step Q&A wizard exists
- Playground chat works
- Agent persistence works
- Basic template mapping exists

**No changes needed for Phase 0.**

### Phase 1: Create Agent Base Template

**Goal:** Replace `LanguageModelComponent` with `Agent` in flow generation.

**Tasks:**

1. **Create new template file** (`templates/agent_base.json`)
   - Export a working Agent flow from Langflow
   - Strip tool connections
   - Document all required fields

2. **Update TemplateMapper class**
   - Load Agent template instead of support_bot
   - Inject system prompt into Agent's `system_prompt` field (not Prompt component)
   - Remove Memory→Prompt→LLM chain (Agent handles this internally)

3. **Verify chat still works**
   - Agent should respond without tools
   - System prompt personality should work

**Files to modify:**
- `src/backend/templates/agent_base.json` (new)
- `src/backend/app/services/template_mapping.py`

### Phase 2: Implement Tool Node Generation

**Goal:** Add actual tool components based on Q&A selections.

**Tasks:**

1. **Create tool component templates** (`templates/tools/`)
   - `web_search.json` - DuckDuckGoSearchComponent snippet
   - `calculator.json` - CalculatorComponent snippet
   - `url_reader.json` - URLComponent snippet

2. **Implement tool injection logic**
   ```python
   class TemplateMapper:
       def inject_tools(self, flow_data: dict, selected_tools: list[str]) -> dict:
           # For each selected tool:
           #   1. Load tool component template
           #   2. Generate unique node ID
           #   3. Add node to flow_data["data"]["nodes"]
           #   4. Create edge from tool to Agent
           #   5. Add edge to flow_data["data"]["edges"]
           pass
   ```

3. **Handle tool positioning**
   - Calculate positions to avoid overlap
   - Stack tools vertically to left of Agent

4. **Handle edge ID generation**
   - Langflow uses special Unicode format for edge IDs
   - Must match exactly or flow won't load

**Files to modify:**
- `src/backend/templates/tools/` (new directory)
- `src/backend/app/services/template_mapping.py`

### Phase 3: Update Frontend Tool Selection

**Goal:** Connect frontend tool choices to real backend tool injection.

**Tasks:**

1. **Update CreateAgentPage tools list**
   - Mark unavailable tools as "Coming Soon"
   - Add tooltips explaining what each tool does
   - Only send available tools to backend

2. **Update API schema**
   ```typescript
   interface CreateAgentRequest {
     name: string;
     qa_who: string;
     qa_rules: string;
     qa_tricks: string[];  // Changed from string to array
     selected_tools: string[];  // New field: ['web_search', 'calculator']
   }
   ```

3. **Update backend agent creation**
   - Accept `selected_tools` array
   - Pass to template mapper
   - Store in agent metadata (for later editing)

**Files to modify:**
- `src/frontend/src/pages/CreateAgentPage.tsx`
- `src/frontend/src/types/index.ts`
- `src/backend/app/schemas/agent.py`
- `src/backend/app/services/agent_service.py`

### Phase 4: Verify End-to-End Functionality

**Goal:** Ensure tools actually work when chatting.

**Tasks:**

1. **Test tool execution**
   - Create agent with web search
   - Ask "What's the weather in New York?"
   - Verify Agent uses DuckDuckGo to search
   - Verify response contains real search results

2. **Test flow editing**
   - Click "Unlock Flow" on agent with tools
   - Verify tool nodes appear in canvas
   - Verify edges connect to Agent's tools port
   - Add/remove tool in canvas
   - Save and verify changes persist

3. **Test edge cases**
   - Agent with no tools (should still work)
   - Agent with multiple tools (should all connect)
   - Invalid tool selection (should gracefully ignore)

4. **Write E2E tests**
   - Test: Create agent with web search, verify search works
   - Test: Unlock flow, verify tool visible
   - Test: Edit in Langflow, save, verify changes persist

**Files to create/modify:**
- `src/frontend/e2e/tools.spec.ts` (new)

---

## Part 5: Technical Deep Dive

### Edge ID Format

Langflow uses a special format for edge IDs with Unicode character `œ` (U+0153):

```
reactflow__edge-{sourceId}{sourceHandle}-{targetId}{targetHandle}
```

Where handles are JSON-like strings with `œ` replacing `"`:
```
{œdataTypeœ:œAgentœ,œidœ:œAgent-xxxœ,œnameœ:œresponseœ,œoutput_typesœ:[œMessageœ]}
```

**Critical:** Edge IDs must match this format exactly or Langflow won't recognize connections.

### Node ID Generation

Node IDs follow pattern: `{ComponentType}-{5charId}`

Example: `Agent-Kx92f`, `DuckDuckGoSearchComponent-P3mNq`

Generate IDs with:
```python
import random
import string

def generate_node_id(component_type: str) -> str:
    suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=5))
    return f"{component_type}-{suffix}"
```

### Tool-to-Agent Edge Template

```python
def create_tool_edge(tool_node_id: str, tool_type: str, agent_node_id: str) -> dict:
    return {
        "source": tool_node_id,
        "sourceHandle": f"{{œdataTypeœ:œ{tool_type}œ,œidœ:œ{tool_node_id}œ,œnameœ:œcomponent_as_toolœ,œoutput_typesœ:[œToolœ]}}",
        "target": agent_node_id,
        "targetHandle": f"{{œfieldNameœ:œtoolsœ,œidœ:œ{agent_node_id}œ,œinputTypesœ:[œToolœ,œBaseToolœ],œtypeœ:œotherœ}}",
        "id": f"reactflow__edge-{tool_node_id}{{...}}-{agent_node_id}{{...}}",
        "animated": False,
        "data": {
            "sourceHandle": {
                "dataType": tool_type,
                "id": tool_node_id,
                "name": "component_as_tool",
                "output_types": ["Tool"]
            },
            "targetHandle": {
                "fieldName": "tools",
                "id": agent_node_id,
                "inputTypes": ["Tool", "BaseTool"],
                "type": "other"
            }
        }
    }
```

---

## Part 6: Risk Assessment

### High Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent component behavior differs from LLM component | Chat may break | Test thoroughly, keep fallback template |
| Edge ID format breaks on Langflow update | Flows won't load | Version lock Langflow, test on upgrades |
| Tool components require API keys we don't have | Tools won't work | Use free tools (DuckDuckGo, Calculator) for MVP |

### Medium Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| Node positioning overlaps | Ugly canvas view | Calculate positions carefully |
| Multiple tools slow down response | UX degradation | Limit to 3 tools initially |
| Users confused by tool options | Support tickets | Clear tooltips and "Coming Soon" labels |

### Low Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tool names don't match Dog metaphor | Minor UX issue | Custom display names in UI |

---

## Part 7: Testing Strategy

### Unit Tests

```python
# test_template_mapping.py

def test_agent_template_loads():
    mapper = TemplateMapper()
    template = mapper.load_template("agent_base")
    assert "Agent" in str(template)

def test_inject_single_tool():
    mapper = TemplateMapper()
    flow = mapper.create_flow_with_tools(
        who="A helpful assistant",
        rules="Be nice",
        selected_tools=["web_search"]
    )
    nodes = flow["data"]["nodes"]
    tool_nodes = [n for n in nodes if "Search" in n["data"]["type"]]
    assert len(tool_nodes) == 1

def test_tool_edge_created():
    mapper = TemplateMapper()
    flow = mapper.create_flow_with_tools(
        who="A helpful assistant",
        rules="Be nice",
        selected_tools=["calculator"]
    )
    edges = flow["data"]["edges"]
    tool_edges = [e for e in edges if "tools" in e["targetHandle"]]
    assert len(tool_edges) == 1
```

### E2E Tests

```typescript
// e2e/tools.spec.ts

test('agent with web search can search', async ({ page }) => {
  // Create agent with web search tool
  await page.goto('/create')
  await page.fill('[name="name"]', 'Search Charlie')
  // ... fill form, select web search
  await page.click('button:has-text("Create")')

  // Go to playground
  await page.waitForURL(/\/playground/)

  // Ask a search question
  await page.fill('textarea', "What's the latest news today?")
  await page.click('button:has-text("Send")')

  // Verify response contains search results (not "I don't have access")
  const response = await page.locator('.message-assistant').last()
  await expect(response).not.toContainText("I don't have access")
  await expect(response).not.toContainText("I cannot search")
})

test('unlock flow shows tool nodes', async ({ page }) => {
  // ... create agent with tools

  // Click unlock flow
  await page.click('button:has-text("Unlock Flow")')

  // Verify in Langflow canvas
  await expect(page.locator('[data-type="DuckDuckGoSearchComponent"]')).toBeVisible()
  await expect(page.locator('[data-type="Agent"]')).toBeVisible()
})
```

---

## Part 8: Success Criteria

Phase 0-4 is complete when:

- [ ] Agent template replaces LanguageModelComponent template
- [ ] Web Search tool actually searches when asked
- [ ] Calculator tool actually calculates when asked
- [ ] Tools appear as nodes in Langflow canvas
- [ ] Edges correctly connect tools to Agent
- [ ] Creating agent with no tools still works
- [ ] Creating agent with multiple tools works
- [ ] E2E tests pass for tool functionality
- [ ] "Coming Soon" tools are clearly marked in UI

---

## Part 9: Implementation Order

1. **Day 1:** Export Agent flow from Langflow, create agent_base.json
2. **Day 1:** Update TemplateMapper to use Agent template
3. **Day 2:** Create tool component snippets
4. **Day 2:** Implement tool injection logic
5. **Day 3:** Update frontend tool selection UI
6. **Day 3:** Update API schema for selected_tools
7. **Day 4:** Test end-to-end functionality
8. **Day 4:** Write E2E tests
9. **Day 5:** Bug fixes and polish

**Estimated total: 5 days**

---

## Part 10: Future Considerations (Post Phase 4)

### Phase 5-6: More Tools
- Google Maps integration (requires API key management)
- Image generation (requires DALL-E/Stability API)
- Custom tool builder (advanced users)

### Phase 7-8: Tool Configuration
- Allow users to configure tool parameters (search depth, etc.)
- Per-tool API key management

### Phase 9-10: Canvas Education
- Highlight tools in Langflow canvas
- Tooltip explanations for each tool node
- "What does this connection mean?" overlays

---

## Appendix A: Component Type Reference

| Display Name | Component Type (in JSON) |
|--------------|-------------------------|
| Agent | `Agent` |
| Chat Input | `ChatInput` |
| Chat Output | `ChatOutput` |
| Calculator | `CalculatorComponent` |
| DuckDuckGo Search | `DuckDuckGoSearchComponent` |
| URL | `URLComponent` |
| Search API | `SearchAPIComponent` |
| Python REPL | `PythonREPLComponent` |
| Memory | `Memory` |
| Prompt | `Prompt` |

## Appendix B: Useful Langflow API Endpoints

```bash
# List all available components
GET /api/v1/store/components

# Get component definition
GET /api/v1/store/components/{component_name}

# Get flow
GET /api/v1/flows/{flow_id}

# Update flow
PATCH /api/v1/flows/{flow_id}

# Run flow (for testing)
POST /api/v1/run/{flow_id}
```

## Appendix C: Unicode Edge Format

The edge ID format uses `œ` (U+0153) instead of quotes in JSON-like strings:

```
Standard JSON: {"key": "value"}
Langflow edge: {œkeyœ: œvalueœ}
```

Python conversion:
```python
def to_edge_format(s: str) -> str:
    return s.replace('"', 'œ')

def from_edge_format(s: str) -> str:
    return s.replace('œ', '"')
```
