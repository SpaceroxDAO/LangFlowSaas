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

## Recommendation: Phase 3 - Dynamic Python Component Generation

Based on our architecture (separate frontend/backend + Langflow in Docker), we can implement **automatic component generation with silent Langflow restart**.

### Why This Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    Our Architecture                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│   │   Frontend   │────▶│   Backend    │────▶│   Langflow   │   │
│   │   (React)    │     │   (FastAPI)  │     │   (Docker)   │   │
│   │   Port 3001  │     │   Port 8000  │     │   Port 7860  │   │
│   └──────────────┘     └──────────────┘     └──────────────┘   │
│         │                     │                    │            │
│         │                     │                    │            │
│     Always Up            Always Up          Can Restart!        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Insight**: When user creates an agent:
1. Frontend stays responsive (React app unaffected)
2. Backend saves agent to database (unaffected)
3. Backend generates Python component file
4. Backend triggers Langflow container restart (5-10 seconds)
5. New component appears in sidebar

**User Experience**: "Your agent is being prepared... ✓ Ready!"

---

## Phase 3 Implementation: Complete Guide

### Step 1: Python Component Template

Create a template file that we fill in with user's Q&A answers:

**File: `/src/backend/templates/component_templates/user_agent_template.py.jinja2`**

```python
"""
Auto-generated component for: {{ agent_name }}
Created: {{ created_at }}
User ID: {{ user_id }}
"""
from langflow.custom import Component
from langflow.io import MessageTextInput, Output, DropdownInput, SecretStrInput
from langflow.schema.message import Message
from langflow.field_typing import Tool
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate


class {{ class_name }}(Component):
    """{{ description }}"""

    display_name = "{{ display_name }}"
    description = "{{ description }}"
    icon = "dog"  # Our Teach Charlie icon
    name = "{{ component_name }}"

    # Appears under "My Agents" category
    # Note: Category is determined by directory structure

    inputs = [
        MessageTextInput(
            name="input_value",
            display_name="Message",
            info="What would you like to ask {{ display_name }}?",
            tool_mode=True,
        ),
        DropdownInput(
            name="model_name",
            display_name="Model",
            options=["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"],
            value="gpt-4o-mini",
            advanced=True,
        ),
        SecretStrInput(
            name="openai_api_key",
            display_name="OpenAI API Key",
            info="Leave blank to use system default",
            advanced=True,
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

    # Pre-configured system prompt from user's Q&A
    SYSTEM_PROMPT = """{{ system_prompt }}"""

    # Pre-configured tools from user's selection
    TOOL_IDS = {{ tool_ids }}  # e.g., ["calculator", "web_search"]

    def run_agent(self) -> Message:
        """Execute the agent with the user's input."""
        from langflow.components.tools import CalculatorComponent, DuckDuckGoSearchComponent

        # Get API key (user's or system default)
        api_key = self.openai_api_key or self._get_system_api_key()

        # Initialize LLM
        llm = ChatOpenAI(
            model=self.model_name,
            api_key=api_key,
            temperature=0.7,
        )

        # Build tools based on configuration
        tools = self._build_tools()

        # Create prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.SYSTEM_PROMPT),
            ("placeholder", "{chat_history}"),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}"),
        ])

        # Create and run agent
        agent = create_tool_calling_agent(llm, tools, prompt)
        executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

        result = executor.invoke({"input": self.input_value})

        self.status = result["output"]
        return Message(text=result["output"])

    def _build_tools(self):
        """Build tool instances based on configured tool IDs."""
        tools = []

        {% for tool in tools %}
        {% if tool.id == "calculator" %}
        # Calculator tool
        from langchain_community.tools import Tool
        from langchain_community.utilities import calculator
        tools.append(Tool(
            name="calculator",
            description="Useful for math calculations",
            func=lambda x: str(eval(x))
        ))
        {% endif %}
        {% if tool.id == "web_search" %}
        # Web search tool
        from langchain_community.tools import DuckDuckGoSearchRun
        tools.append(DuckDuckGoSearchRun())
        {% endif %}
        {% endfor %}

        return tools

    def _get_system_api_key(self):
        """Get API key from environment or Langflow variables."""
        import os
        return os.environ.get("OPENAI_API_KEY", "")
```

### Step 2: Component Generator Service

**File: `/src/backend/app/services/component_generator.py`**

```python
"""
Service for generating custom Python components from user agents.
"""
import os
import re
from datetime import datetime
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from typing import Optional

from app.models.agent import Agent
from app.core.config import settings


class ComponentGenerator:
    """Generates Python component files for user-created agents."""

    TEMPLATE_DIR = Path(__file__).parent.parent.parent / "templates" / "component_templates"
    COMPONENTS_DIR = Path(settings.CUSTOM_COMPONENTS_PATH) / "my_agents"

    def __init__(self):
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(self.TEMPLATE_DIR)),
            trim_blocks=True,
            lstrip_blocks=True,
        )
        # Ensure my_agents directory exists
        self.COMPONENTS_DIR.mkdir(parents=True, exist_ok=True)
        self._ensure_init_file()

    def _ensure_init_file(self):
        """Ensure __init__.py exists in my_agents directory."""
        init_file = self.COMPONENTS_DIR / "__init__.py"
        if not init_file.exists():
            init_file.write_text('''"""
My Agents - User-created AI agent components.
Auto-generated by Teach Charlie AI.
"""
# Components are auto-discovered by Langflow
''')

    def _sanitize_class_name(self, name: str) -> str:
        """Convert agent name to valid Python class name."""
        # Remove special characters, convert to PascalCase
        name = re.sub(r'[^a-zA-Z0-9\s]', '', name)
        words = name.split()
        class_name = ''.join(word.capitalize() for word in words)
        return f"{class_name}Agent"

    def _sanitize_component_name(self, name: str) -> str:
        """Convert agent name to valid component name (snake_case)."""
        name = re.sub(r'[^a-zA-Z0-9\s]', '', name)
        return '_'.join(name.lower().split()) + "_agent"

    def generate_component(self, agent: Agent) -> str:
        """
        Generate a Python component file for the given agent.

        Returns the path to the generated file.
        """
        template = self.jinja_env.get_template("user_agent_template.py.jinja2")

        # Prepare template variables
        class_name = self._sanitize_class_name(agent.name)
        component_name = self._sanitize_component_name(agent.name)

        # Build system prompt from Q&A answers
        system_prompt = self._build_system_prompt(agent)

        # Get tool configuration
        tools = self._get_tool_config(agent)

        content = template.render(
            agent_name=agent.name,
            class_name=class_name,
            component_name=component_name,
            display_name=agent.name,
            description=agent.description or f"AI Agent: {agent.name}",
            system_prompt=system_prompt,
            tool_ids=[t["id"] for t in tools],
            tools=tools,
            user_id=str(agent.user_id),
            created_at=datetime.utcnow().isoformat(),
        )

        # Write component file
        file_path = self.COMPONENTS_DIR / f"{component_name}.py"
        file_path.write_text(content)

        # Update __init__.py to export new component
        self._update_init_file(class_name, component_name)

        return str(file_path)

    def _build_system_prompt(self, agent: Agent) -> str:
        """Build system prompt from agent's Q&A answers."""
        parts = []

        if agent.qa_who:
            parts.append(f"You are {agent.qa_who}.")

        if agent.qa_rules:
            parts.append(f"\n## Your Rules and Knowledge\n{agent.qa_rules}")

        if agent.qa_tricks:
            parts.append(f"\n## Your Capabilities\n{agent.qa_tricks}")

        parts.append("""
## Guidelines
- Stay in character as described above
- Be helpful, friendly, and professional
- If you don't know something, admit it honestly
- Use your tools when they can help answer questions
""")

        return "\n".join(parts)

    def _get_tool_config(self, agent: Agent) -> list:
        """Get tool configuration from agent's flow_data."""
        tools = []

        # Parse tools from flow_data if available
        if agent.flow_data and "nodes" in agent.flow_data.get("data", {}):
            for node in agent.flow_data["data"]["nodes"]:
                node_type = node.get("data", {}).get("type", "")
                if "Calculator" in node_type:
                    tools.append({"id": "calculator", "name": "Calculator"})
                elif "DuckDuckGo" in node_type or "Search" in node_type:
                    tools.append({"id": "web_search", "name": "Web Search"})
                elif "URL" in node_type:
                    tools.append({"id": "url_reader", "name": "URL Reader"})

        return tools

    def _update_init_file(self, class_name: str, component_name: str):
        """Update __init__.py to export the new component."""
        init_file = self.COMPONENTS_DIR / "__init__.py"
        content = init_file.read_text()

        import_line = f"from .{component_name} import {class_name}"

        if import_line not in content:
            # Add import after the docstring
            lines = content.split('\n')
            insert_idx = next(
                (i for i, line in enumerate(lines) if line.strip() and not line.startswith('#') and not line.startswith('"""')),
                len(lines)
            )
            lines.insert(insert_idx, import_line)
            init_file.write_text('\n'.join(lines))

    def delete_component(self, agent: Agent):
        """Delete the component file for an agent."""
        component_name = self._sanitize_component_name(agent.name)
        file_path = self.COMPONENTS_DIR / f"{component_name}.py"

        if file_path.exists():
            file_path.unlink()
            # TODO: Also remove from __init__.py
```

### Step 3: Langflow Restart Service

**File: `/src/backend/app/services/langflow_restart.py`**

```python
"""
Service for restarting Langflow container after component changes.
"""
import asyncio
import docker
from typing import Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class LangflowRestartService:
    """Handles graceful restart of Langflow container."""

    CONTAINER_NAME = "langflow"  # From docker-compose.yml
    RESTART_TIMEOUT = 30  # seconds
    HEALTH_CHECK_INTERVAL = 1  # seconds

    def __init__(self):
        self.docker_client = docker.from_env()

    async def restart_langflow(self) -> bool:
        """
        Restart Langflow container and wait for it to be healthy.

        Returns True if restart was successful.
        """
        try:
            container = self.docker_client.containers.get(self.CONTAINER_NAME)

            logger.info("Restarting Langflow container...")

            # Graceful restart
            container.restart(timeout=10)

            # Wait for health check to pass
            healthy = await self._wait_for_healthy()

            if healthy:
                logger.info("Langflow restarted successfully")
            else:
                logger.warning("Langflow restart timed out")

            return healthy

        except docker.errors.NotFound:
            logger.error(f"Container '{self.CONTAINER_NAME}' not found")
            return False
        except Exception as e:
            logger.error(f"Failed to restart Langflow: {e}")
            return False

    async def _wait_for_healthy(self) -> bool:
        """Wait for Langflow to respond to health checks."""
        import httpx

        health_url = f"{settings.LANGFLOW_URL}/health"
        elapsed = 0

        while elapsed < self.RESTART_TIMEOUT:
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(health_url, timeout=2)
                    if response.status_code == 200:
                        return True
            except:
                pass

            await asyncio.sleep(self.HEALTH_CHECK_INTERVAL)
            elapsed += self.HEALTH_CHECK_INTERVAL

        return False

    def get_container_status(self) -> Optional[str]:
        """Get current status of Langflow container."""
        try:
            container = self.docker_client.containers.get(self.CONTAINER_NAME)
            return container.status
        except docker.errors.NotFound:
            return None
```

### Step 4: Update Agent Service

**File: `/src/backend/app/services/agent_service.py` (additions)**

```python
# Add to imports
from app.services.component_generator import ComponentGenerator
from app.services.langflow_restart import LangflowRestartService

# Add to AgentService class
class AgentService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.component_generator = ComponentGenerator()
        self.restart_service = LangflowRestartService()

    async def create_from_qa(
        self,
        user: User,
        qa_data: AgentCreateFromQA,
    ) -> Agent:
        """Create agent from Q&A answers."""
        # ... existing flow creation code ...

        # After agent is saved to database:

        # Generate Python component
        component_path = self.component_generator.generate_component(agent)
        logger.info(f"Generated component at: {component_path}")

        # Store component path
        agent.component_path = component_path
        await self.session.commit()

        # Restart Langflow in background (don't block response)
        asyncio.create_task(self._restart_langflow_background())

        return agent

    async def _restart_langflow_background(self):
        """Restart Langflow in background after short delay."""
        # Small delay to ensure file is written
        await asyncio.sleep(1)

        success = await self.restart_service.restart_langflow()
        if success:
            logger.info("Langflow restarted - new components available")
        else:
            logger.warning("Langflow restart failed - components may not be available yet")
```

### Step 5: Docker Compose Updates

**File: `docker-compose.yml` (additions)**

```yaml
services:
  langflow:
    # ... existing config ...
    environment:
      # Add custom components path
      - LANGFLOW_COMPONENTS_PATH=/app/custom_components
    volumes:
      # Mount custom components directory
      - ./custom_components:/app/custom_components
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7860/health"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 30s

  backend:
    # ... existing config ...
    volumes:
      # Backend needs access to same directory to write components
      - ./custom_components:/app/custom_components
      # Backend needs Docker socket to restart Langflow
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - CUSTOM_COMPONENTS_PATH=/app/custom_components
```

### Step 6: Directory Structure

```
LangflowSaaS/
├── custom_components/                    # Mounted to both containers
│   └── my_agents/                        # User-created agents appear here
│       ├── __init__.py
│       ├── charlie_car_salesman_agent.py
│       ├── support_bot_agent.py
│       └── knowledge_assistant_agent.py
├── src/
│   └── backend/
│       ├── templates/
│       │   └── component_templates/
│       │       └── user_agent_template.py.jinja2
│       └── app/
│           └── services/
│               ├── component_generator.py
│               └── langflow_restart.py
└── docker-compose.yml
```

---

## User Experience Flow

```
1. User creates "Charlie the car salesman" in frontend
   ↓
2. Frontend shows: "Creating your agent..."
   ↓
3. Backend:
   - Creates Langflow flow (existing)
   - Generates Python component file
   - Triggers Langflow restart (background)
   ↓
4. Frontend shows: "Almost ready... Setting up Charlie..."
   ↓
5. Langflow restarts (5-10 seconds)
   ↓
6. Frontend shows: "✓ Charlie is ready!"
   ↓
7. User opens Langflow canvas
   ↓
8. User sees in sidebar:

   Components
   ├─ Input & Output
   ├─ Data Sources
   ├─ Models & Agents
   ├─ My Agents              ← NEW CATEGORY
   │   └─ Charlie the car salesman  ← Their agent!
   ├─ MCP Tools
   └─ ...
   ↓
9. User drags "Charlie" into any flow as a single node!
```

---

## Restart Timing Optimization

| Scenario | Strategy |
|----------|----------|
| First agent created | Restart immediately |
| Multiple agents in session | Batch restarts (restart after 30s of no new agents) |
| Agent deleted | Queue restart, don't block UI |
| User opens canvas | Check if restart pending, show loading if so |

### Batched Restart Implementation

```python
class LangflowRestartService:
    _restart_scheduled = False
    _restart_lock = asyncio.Lock()

    async def schedule_restart(self, delay_seconds: int = 5):
        """Schedule a restart after delay (batches multiple requests)."""
        async with self._restart_lock:
            if self._restart_scheduled:
                return  # Already scheduled

            self._restart_scheduled = True

        await asyncio.sleep(delay_seconds)
        await self.restart_langflow()

        async with self._restart_lock:
            self._restart_scheduled = False
```

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
