# Custom Components Strategy for Teach Charlie AI

**Created**: 2026-01-06
**Purpose**: Strategic research and implementation plan for Langflow custom components
**Status**: Research Complete - Ready for Implementation

---

## Executive Summary

This document outlines our strategy for leveraging Langflow's custom component system to create two key value propositions:

1. **Reusable Agent Components**: When users create agents, we also create reusable components they can drag into other flows
2. **Educational Component Library**: Progressive disclosure of components based on user skill level

This strategy positions component library management as a **core differentiator** for Teach Charlie AI.

---

## IMPORTANT: Technical Reality Clarification

Before diving into implementation, let's be precise about what Langflow supports natively vs. what requires custom development.

### How Langflow's Component Sidebar Works

Looking at Langflow's sidebar (Models & Agents → Agent, Language Model, etc.), these items come from:

1. **Built-in Python classes** - Compiled into Langflow's codebase
2. **Custom Python components** - `.py` files in `LANGFLOW_COMPONENTS_PATH` directory, loaded at Langflow startup
3. **MCP Tools** - Dynamically discovered from configured MCP servers

### What `is_component: true` Actually Does

The `is_component` flag on a flow does **NOT** make it appear in the sidebar component list. Instead:
- It marks a flow as a "saved component" (a reusable flow template)
- It can be loaded from the flow list and used as a starting point
- It does NOT create a new draggable item in the sidebar

### The Honest Answer

**Q: Can we automatically make user-created agents appear in the sidebar?**

**A: Not with native Langflow features alone.** Here's what IS possible:

| Approach | Appears in Sidebar? | Complexity | Notes |
|----------|---------------------|------------|-------|
| `is_component: true` flow | ❌ No | Low | Saved as reusable flow, not sidebar item |
| Dynamic Python file generation | ✅ Yes | High | Requires Langflow restart |
| MCP Tools integration | ✅ Yes (under MCP Tools) | Medium | Langflow 1.4+, agents appear as tools |
| Custom sidebar modification | ✅ Yes | Very High | Requires forking Langflow frontend |
| "Run Flow" component | ❌ No (but functional) | Low | User selects flow from dropdown |

---

## Part 1: Reusable Agent Components

### The Vision

When a user creates an AI agent through our 3-step Q&A wizard:
1. We create the normal Langflow flow (current behavior)
2. **Goal**: Make that agent reusable in other flows

### Realistic Implementation Options

#### Option A: Run Flow Component (Recommended)

Langflow's **Run Flow** component allows one flow to call another, with **Tool Mode** support.

**How it works:**
```
User creates "Sales Charlie" agent
  ↓
We create flow: sales_charlie_flow (is_component: false)
  ↓
We create component-flow: sales_charlie_component (is_component: true)
  containing: Run Flow → pointing to sales_charlie_flow
  ↓
User can drag "Sales Charlie" into any flow as a single node
```

**Implementation in `agent_service.py`:**
```python
async def create_from_qa(self, user: User, qa_data: AgentCreateFromQA) -> Agent:
    # 1. Create the main flow (existing code)
    flow_id = await self._create_langflow_flow(user, qa_data)

    # 2. NEW: Create component wrapper
    component_id = await self._create_agent_component(flow_id, qa_data.name)

    # 3. Store both IDs
    agent = Agent(
        flow_id=flow_id,
        component_id=component_id,  # New field
        ...
    )
```

**Component Flow Template:**
```json
{
  "name": "{{AGENT_NAME}} (Component)",
  "description": "Reusable component for {{AGENT_NAME}}",
  "is_component": true,
  "data": {
    "nodes": [
      {
        "type": "RunFlow",
        "data": {
          "flow_id": "{{MAIN_FLOW_ID}}",
          "tool_mode": true
        }
      }
    ]
  }
}
```

#### Option B: MCP Server Exposure (Advanced)

Langflow 1.4+ supports MCP (Model Context Protocol), where flows become callable tools.

**How it works:**
- Each project becomes an MCP server
- Flows within are auto-exposed as tools
- External agents can discover and call them

**Best for:** Integration with Claude Desktop, Cursor, or external AI tools

#### Option C: Custom Python Components (Most Flexible)

Create Python components that wrap agent functionality.

```python
class UserAgentComponent(Component):
    display_name = "{{AGENT_NAME}}"
    description = "{{AGENT_DESCRIPTION}}"
    icon = "dog"

    inputs = [
        MessageTextInput(
            name="query",
            display_name="Ask {{AGENT_NAME}}",
            tool_mode=True,
        ),
    ]

    outputs = [
        Output(
            display_name="Response",
            name="response",
            method="run_agent",
        ),
        Output(
            display_name="As Tool",
            name="component_as_tool",
            method="to_toolkit",
        ),
    ]

    async def run_agent(self) -> Message:
        # Call the stored Langflow flow
        result = await self.langflow_client.run_flow(
            flow_id="{{FLOW_ID}}",
            input_value=self.query
        )
        return Message(text=result)
```

### Recommended Approach

**Phase 1 (MVP)**: Use Run Flow component approach
- Simplest to implement
- Uses native Langflow features
- No file system access needed

**Phase 2 (Enhancement)**: MCP Tools integration
- Agents appear in "MCP Tools" sidebar section
- True sidebar presence
- Dynamic discovery

**Phase 3 (Advanced)**: Dynamic Python component generation
- Full sidebar integration under custom category
- Requires hot-reload solution

---

## Detailed Example: "Charlie the Car Salesman"

Here's exactly what happens when a user creates an agent, showing each approach:

### Current State (What We Do Now)

```
User fills out form:
  - Name: "Charlie the car salesman"
  - Persona: "Charlie likes to sell cars"
  - Instructions: "He knows the prices of cars"
  - Tools: [Web Search]

↓ Frontend calls POST /api/v1/agents/create-from-qa

↓ Backend creates Langflow flow with:
  - ChatInput component
  - Agent component (with system prompt)
  - DuckDuckGoSearch component (tool)
  - ChatOutput component

↓ Flow saved to Langflow, flow_id returned

↓ Agent record saved to our database

Result: User can chat with "Charlie" in Playground
        User can see flow in Langflow canvas
        User CANNOT drag "Charlie" into other flows
```

### Option A: Run Flow Approach (Easiest)

```
Same creation process as above, PLUS:

↓ User opens another flow in Langflow canvas

↓ User drags "Run Flow" component from Logic category

↓ User clicks dropdown, sees list of their flows:
  - "Charlie the car salesman"
  - "Support Bot"
  - etc.

↓ User selects "Charlie the car salesman"

↓ Run Flow component now calls Charlie's flow

↓ User enables "Tool Mode" checkbox

↓ User connects Run Flow's "Tool" output to another Agent's "Tools" input

Result: New agent can call "Charlie" as a tool
        Works TODAY with no changes needed
        Not as elegant (requires manual selection)
```

**Visual Example:**
```
┌─────────────────────────────────────────────────────────┐
│                    New Complex Flow                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐      ┌────────────────┐      ┌─────────┐ │
│  │ Chat     │──────│ Manager Agent  │──────│ Chat    │ │
│  │ Input    │      │                │      │ Output  │ │
│  └──────────┘      │   Tools ●──────│      └─────────┘ │
│                    └────────────────┘                   │
│                           │                             │
│                    ┌──────┴──────┐                      │
│                    │             │                      │
│               ┌────▼────┐  ┌────▼────────────┐         │
│               │Run Flow │  │ Calculator     │          │
│               │"Charlie"│  │ Component      │          │
│               │(Tool)   │  │                │          │
│               └─────────┘  └────────────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Option B: MCP Tools Integration (Recommended for Phase 2)

```
Configuration (one-time setup):
1. Configure Langflow project as MCP server
2. Each flow automatically becomes an MCP tool

When user creates "Charlie":

↓ Flow created in MCP-enabled project

↓ Langflow automatically exposes it via MCP

↓ "Charlie the car salesman" appears under:
   Sidebar → MCP Tools → [Charlie the car salesman]

↓ User can DRAG "Charlie" directly from sidebar!

↓ Drops into flow as a single-node tool

Result: True sidebar presence!
        Automatic discovery
        Works like built-in components
```

**What the sidebar would look like:**
```
Components
├─ Input & Output
├─ Data Sources
├─ Models & Agents
│   ├─ Language Model
│   ├─ Agent
│   └─ ...
├─ MCP Tools              ← User agents appear HERE
│   ├─ Charlie the car salesman  ← Draggable!
│   ├─ Support Bot
│   └─ Knowledge Assistant
├─ LLM Operations
└─ ...
```

### Option C: Dynamic Python Components (Most Complex)

```
When user creates "Charlie":

↓ Backend generates Python file:

# /custom_components/user_agents/charlie_car_salesman.py
from lfx.custom.custom_component.component import Component
from lfx.io import Output, MessageTextInput

class CharlieCarSalesmanAgent(Component):
    display_name = "Charlie the car salesman"
    description = "Charlie likes to sell cars. He knows car prices."
    icon = "dog"
    category = "my_agents"  # Custom category

    inputs = [
        MessageTextInput(
            name="query",
            display_name="Ask Charlie",
            tool_mode=True,
        ),
    ]

    outputs = [
        Output(
            name="response",
            display_name="Charlie's Response",
            method="ask_charlie",
        ),
        Output(
            name="component_as_tool",
            display_name="Use as Tool",
            method="to_toolkit",
        ),
    ]

    async def ask_charlie(self):
        # Call the stored Langflow flow via API
        from app.services.langflow_client import LangflowClient
        client = LangflowClient()
        result = await client.run_flow(
            flow_id="abc-123-flow-id",
            input_value=self.query
        )
        return Message(text=result)

↓ File saved to /custom_components/user_agents/

↓ Langflow RESTART required (or hot-reload if implemented)

↓ "Charlie the car salesman" appears under:
   Sidebar → My Agents → [Charlie the car salesman]

Result: Full sidebar integration!
        Custom category "My Agents"
        Requires Langflow restart (major downside)
```

**What the sidebar would look like:**
```
Components
├─ Input & Output
├─ Data Sources
├─ Models & Agents
├─ My Agents              ← Custom category we create
│   ├─ Charlie the car salesman
│   ├─ Support Bot
│   └─ Knowledge Assistant
├─ MCP Tools
├─ LLM Operations
└─ ...
```

---

## Recommendation: Phased Implementation

| Phase | Approach | User Experience | Effort |
|-------|----------|-----------------|--------|
| **Now** | Run Flow component | Manual selection from dropdown | Zero changes |
| **Phase 2** | MCP Tools | Drag from MCP Tools section | Medium |
| **Phase 3** | Python generation | Drag from custom "My Agents" | High |

### Why MCP Tools is the Sweet Spot

1. **Native Langflow feature** - No forking required
2. **Dynamic discovery** - No restarts needed
3. **Sidebar presence** - True drag-and-drop from sidebar
4. **Tool integration** - Works naturally with Agent's "Tools" input
5. **Future-proof** - MCP is becoming a standard (Claude, Cursor support it)

---

## Part 2: Educational Component Library (Progressive Disclosure)

### The Vision

For our educational platform, users in early phases should only see **simplified, educational components**, not the full Langflow library of 100+ components.

| Level | User Stage | Visible Components |
|-------|------------|-------------------|
| 1 | Beginner | Chat Input, Chat Output, Basic Agent |
| 2 | Learning Tools | + Calculator, Web Search, URL Reader |
| 3 | Intermediate | + Memory, Custom Prompts, RAG basics |
| 4 | Advanced | + All processing, Flow Control |
| 5 | Expert | Full Langflow component library |

### Implementation Options

#### Option A: CSS Injection (Current Approach - Enhanced)

We already use CSS injection in `LangflowCanvasViewer.tsx`. Enhance it:

```typescript
const levelCSS: Record<number, string> = {
  1: `
    /* Level 1: Only show Input & Output */
    [data-testid="shad-sidebar"] > div:not([data-testid="disclosure-input & output"]) {
      display: none !important;
    }
    [data-testid="sidebar-nav-bundles"] { display: none !important; }
    [data-testid="sidebar-nav-mcp"] { display: none !important; }
  `,
  2: `
    /* Level 2: Add Models & Agents */
    [data-testid="disclosure-llm operations"] { display: none !important; }
    [data-testid="disclosure-processing"] { display: none !important; }
    [data-testid="disclosure-flow control"] { display: none !important; }
    [data-testid="disclosure-utilities"] { display: none !important; }
    [data-testid="disclosure-files"] { display: none !important; }
  `,
  3: `
    /* Level 3: Add Data Sources */
    [data-testid="disclosure-processing"] { display: none !important; }
    [data-testid="disclosure-flow control"] { display: none !important; }
  `,
  4: `
    /* Level 4: Full access */
  `,
};
```

**Pros:** Simple, no Langflow modifications
**Cons:** Requires same-origin deployment, CSS can be bypassed

#### Option B: Custom Component Directory per Level

Use `LANGFLOW_COMPONENTS_PATH` with level-specific directories:

```
/components/
├── level_1/
│   └── basics/
│       ├── __init__.py
│       ├── simple_chat.py
│       └── basic_agent.py
├── level_2/
│   └── tools/
│       ├── __init__.py
│       ├── calculator.py
│       └── web_search.py
└── level_3/
    └── advanced/
        ├── __init__.py
        └── rag_component.py
```

**Challenge:** Requires restarting Langflow to switch levels

#### Option C: Backend Proxy Filtering (Most Control)

Create a proxy that intercepts `/api/v1/all` and filters components:

```python
@router.get("/api/v1/all-filtered")
async def get_filtered_components(
    user_level: int,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    # Get all components from Langflow
    all_components = await langflow_client.get_all_components()

    # Filter based on user level
    allowed_categories = LEVEL_CATEGORIES[user_level]
    filtered = {
        cat: components
        for cat, components in all_components.items()
        if cat in allowed_categories
    }

    return filtered

LEVEL_CATEGORIES = {
    1: ["inputs", "outputs"],
    2: ["inputs", "outputs", "models_and_agents", "tools"],
    3: ["inputs", "outputs", "models_and_agents", "tools", "data"],
    4: ["*"],  # All categories
}
```

**Pros:** Full control, per-user filtering
**Cons:** Requires modifying Langflow frontend to use filtered endpoint

### Recommended Approach

**Phase 1 (MVP)**: Enhanced CSS injection
- Already implemented
- Quick to enhance
- Works for same-origin deployment

**Phase 2 (Production)**: Backend proxy filtering
- Full control over component visibility
- Per-user level tracking
- Analytics on component usage

---

## Part 3: Component Library Management

### Directory Structure Best Practices

```
custom_components/
├── teach_charlie/                    # Our branded category
│   ├── __init__.py
│   ├── beginner/
│   │   ├── __init__.py
│   │   ├── simple_chat_agent.py      # "Meet Charlie"
│   │   └── basic_web_search.py       # "Fetch"
│   ├── intermediate/
│   │   ├── __init__.py
│   │   ├── memory_agent.py           # "Charlie Remembers"
│   │   └── knowledge_base.py         # "Charlie's Library"
│   └── advanced/
│       ├── __init__.py
│       ├── multi_agent.py            # "Working Dogs Team"
│       └── rag_pipeline.py           # "Charlie's Scent Library"
├── user_agents/                      # User-created agent components
│   ├── __init__.py
│   └── (dynamically generated)
└── templates/                        # Base templates
    ├── __init__.py
    └── agent_wrapper.py
```

### Component Versioning Strategy

Store version metadata with each agent:

```python
# In Agent model
class Agent(Base):
    # ... existing fields ...

    # Version tracking
    template_version: str = "1.0.0"
    langflow_version: str = "1.2.0"
    component_versions: JSON = {}  # {"Agent": "1.2.0", "Calculator": "1.0.0"}
```

### Migration Safety

```python
async def load_agent_with_migration_check(agent_id: str):
    agent = await get_agent(agent_id)

    # Check for version mismatches
    if agent.template_version != CURRENT_TEMPLATE_VERSION:
        # Option 1: Auto-migrate
        await migrate_agent_template(agent)

        # Option 2: Warn user
        return AgentResponse(
            ...agent,
            migration_available=True,
            migration_message="New features available! Update your agent?"
        )

    return agent
```

### Backward Compatibility Rules

From Langflow documentation:

1. **Never change class names** - breaks existing flows
2. **Preserve field names** - removing fields disconnects edges
3. **Use deprecation** - mark old components as `legacy=true`
4. **Provide migration paths** - document how to upgrade

---

## Part 4: "Dog Trainer" Component Naming

Map our educational metaphor to component names:

| Langflow Name | Teach Charlie Name | Category |
|---------------|-------------------|----------|
| Agent | Charlie (Your AI) | Basics |
| ChatInput | Talk to Charlie | Basics |
| ChatOutput | Charlie Responds | Basics |
| Calculator | Count Trick | Tricks |
| DuckDuckGoSearch | Fetch Trick | Tricks |
| URLReader | Read Trick | Tricks |
| Memory | What Charlie Remembers | Training |
| SystemPrompt | Charlie's Job Description | Training |
| RAGPipeline | Charlie's Scent Library | Advanced |
| MultiAgent | Working Dogs Team | Advanced |

### Custom Educational Components to Build

1. **SimpleChatAgent** - Pre-configured agent with friendly defaults
2. **FetchWebSearch** - Web search with educational tooltips
3. **CountCalculator** - Calculator with step-by-step explanations
4. **RememberConversation** - Memory component with visual indicator
5. **LearnFromDocuments** - Simplified RAG interface

---

## Part 5: Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

- [ ] Create `custom_components/` directory structure
- [ ] Build first educational component (SimpleChatAgent)
- [ ] Update docker-compose with `LANGFLOW_COMPONENTS_PATH`
- [ ] Test component discovery in Langflow

### Phase 2: Reusable Agents (Week 3-4)

- [ ] Add `component_id` field to Agent model
- [ ] Create Run Flow component template
- [ ] Update `create_from_qa` to create both flow and component
- [ ] Test dragging user agents into other flows

### Phase 3: Educational Library (Week 5-6)

- [ ] Build 5 core educational components
- [ ] Enhance CSS injection for better level control
- [ ] Add component usage tracking/analytics
- [ ] Create component documentation for users

### Phase 4: Advanced Features (Future)

- [ ] Python component generation from agents
- [ ] MCP server integration
- [ ] Component marketplace for sharing
- [ ] AI-assisted component creation

---

## API Changes Required

### New Endpoints

```
POST /api/v1/agents/{id}/as-component
  - Creates a reusable component from an agent
  - Returns component_id

GET /api/v1/components/educational
  - Returns components filtered by user level
  - Query param: level (1-5)

GET /api/v1/components/user-agents
  - Returns user's agent components
  - For dragging into flows
```

### Database Changes

```sql
-- Add to agents table
ALTER TABLE agents ADD COLUMN component_id UUID;
ALTER TABLE agents ADD COLUMN template_version VARCHAR(20);
ALTER TABLE agents ADD COLUMN component_versions JSONB;

-- New table for component metadata
CREATE TABLE user_components (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    agent_id UUID REFERENCES agents(id),
    langflow_component_id UUID,
    name VARCHAR(255),
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## Key Findings Summary

### What Langflow Supports Natively

| Feature | Support | Notes |
|---------|---------|-------|
| Custom Python components | Yes | Via `LANGFLOW_COMPONENTS_PATH` |
| `is_component` flag | Yes | Makes flow appear as single node |
| Run Flow component | Yes | Call one flow from another |
| Tool Mode | Yes | Use components/flows as agent tools |
| MCP Server | Yes (1.4+) | Expose flows as external tools |
| Component versioning | Partial | Manual update notifications |
| Per-user component filtering | No | Not natively supported |

### What We Need to Build

1. **Agent-to-Component conversion** - Create component when agent is created
2. **Level-based filtering** - CSS injection or backend proxy
3. **Educational wrapper components** - Simplified interfaces
4. **Version tracking** - Store versions with agents
5. **Migration service** - Handle template updates

---

## Sources

- [Langflow Custom Components Documentation](https://docs.langflow.org/components-custom-components)
- [Langflow Components Overview](https://docs.langflow.org/concepts-components)
- [Langflow API - Flow Management](https://docs.langflow.org/api-flows)
- [Langflow MCP Server](https://docs.langflow.org/mcp-server)
- [Langflow 1.4 Release - MCP Support](https://www.langflow.org/blog/langflow-1-4-organize-workflows-connect-with-mcp)
- [Configure Tools for Agents](https://docs.langflow.org/agents-tools)
- [Contributing Components](https://docs.langflow.org/contributing-components)
- [Run Flow Component PR #5518](https://github.com/langflow-ai/langflow/pull/5518)
- [n8n Community Nodes](https://n8engine.com/community-nodes) (comparison)

---

## Next Steps

1. Review this strategy with stakeholders
2. Prioritize Phase 1 tasks
3. Create first educational component prototype
4. Test component discovery in Docker setup
5. Design UI for "My Agents" component library

---

**This document represents significant research into Langflow's architecture. Implementing these features will differentiate Teach Charlie AI from other Langflow deployments and create real value for our educational platform.**
