# Custom Component Generation Implementation Plan

**Created**: 2026-01-07
**Status**: Planning
**Feature Request**: Generate custom Langflow components from published agents

---

## Executive Summary

When a user "publishes" an AI agent in Teach Charlie AI, we will generate a **custom Python component** that is a 1:1 copy of Langflow's core Agent component, but **prefilled with the details captured during the 3-step Q&A process**. This component will appear in the Langflow sidebar under "My Agents" for use in other workflows.

Additionally, we will add an **Advanced Editor** modal in the EditAgentPage that exposes all the hidden options available in a basic Agent node (temperature, max_tokens, etc.), allowing power users to customize their agent component before publishing.

---

## Current State Analysis

### What Exists Today

1. **AgentComponent Model** (`/backend/app/models/agent_component.py`)
   - Stores Q&A answers: `qa_who`, `qa_rules`, `qa_tricks`
   - Stores generated: `system_prompt`
   - Has publishing fields: `is_published`, `component_file_path`, `component_class_name`
   - **But**: No actual Python file generation occurs

2. **Publish Endpoint** (`/api/v1/agent-components/{id}/publish`)
   - Sets `is_published=True`
   - Generates class name: `UserAgent_{name}_{id[:8]}`
   - **But**: Returns `"needs_restart": True` without creating any file

3. **EditAgentPage** (`/frontend/src/pages/EditAgentPage.tsx`)
   - Edits: name, persona (qa_who), instructions (qa_rules), tools (qa_tricks)
   - Has "Open Flow Editor" link to `/canvas/{agentId}`
   - **But**: No advanced options (temperature, max_tokens, etc.)

### What's Missing

1. **Python Component Generator**: Service to generate `.py` files
2. **Component Template**: Jinja2 template mirroring Langflow's Agent component
3. **Advanced Editor Modal**: UI for hidden Agent options
4. **AgentComponent Schema Updates**: Fields for advanced options
5. **Langflow Restart Integration**: Trigger restart after component generation

---

## Architecture Design

### System Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Journey                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. CREATE AGENT (Q&A Wizard)                                           │
│     └─► AgentComponent saved (is_published=false)                       │
│     └─► User lands in Playground (can test immediately)                 │
│                                                                          │
│  2. EDIT AGENT (Optional)                                               │
│     └─► Edit basic fields (name, persona, rules, tools)                 │
│     └─► Click "Advanced Editor" → Modal with all Agent options          │
│     └─► Configure: temperature, max_tokens, model, etc.                 │
│     └─► Save → Updates AgentComponent with advanced_config              │
│                                                                          │
│  3. PUBLISH AGENT                                                       │
│     └─► User clicks "Publish" on agent card                             │
│     └─► Backend generates Python component file                         │
│     └─► File written to custom_components/my_agents/                    │
│     └─► Returns: "Component created! Restart required."                 │
│                                                                          │
│  4. RESTART LANGFLOW                                                    │
│     └─► User clicks "Restart Now" (or later)                            │
│     └─► Langflow container restarts (~5-10 seconds)                     │
│     └─► Component appears in sidebar under "My Agents"                  │
│                                                                          │
│  5. USE IN WORKFLOWS                                                    │
│     └─► User drags "Charlie the Car Salesman" from sidebar              │
│     └─► Drops into any flow as a single node                            │
│     └─► All Q&A config is prefilled, tools connected                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Structure

The generated component will mirror Langflow's Agent component structure:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Generated Component Structure                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  class CharlieCarSalesmanAgent(Component):                              │
│      display_name = "Charlie the Car Salesman"                          │
│      description = "Your friendly car sales assistant"                  │
│      icon = "dog"                                                       │
│      name = "CharlieCarSalesmanAgent"                                   │
│                                                                          │
│      # BASIC INPUTS (visible by default)                                │
│      ├─ input_value (MessageTextInput) - User query                     │
│      ├─ model_provider (DropdownInput) - Prefilled: "OpenAI"           │
│      ├─ model_name (DropdownInput) - Prefilled: "gpt-4o-mini"          │
│      └─ api_key (SecretStrInput) - From user settings                   │
│                                                                          │
│      # ADVANCED INPUTS (hidden, configurable via Advanced Editor)       │
│      ├─ temperature (SliderInput) - Default: 0.7                        │
│      ├─ max_tokens (IntInput) - Default: 4096                           │
│      ├─ agent_instructions (MultilineInput) - PREFILLED from Q&A        │
│      ├─ chat_history (DataInput) - For multi-turn context               │
│      ├─ max_iterations (IntInput) - Default: 10                         │
│      ├─ verbose (BoolInput) - Default: false                            │
│      └─ handle_parsing_errors (BoolInput) - Default: true               │
│                                                                          │
│      # TOOL INPUTS (auto-connected based on Q&A tricks)                 │
│      └─ tools (HandleInput) - Pre-wired to selected tools               │
│                                                                          │
│      # OUTPUTS                                                           │
│      ├─ response (Message) - Agent's response                           │
│      └─ component_as_tool (Tool) - For use as sub-agent                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Backend - Schema & Model Updates

**Goal**: Add advanced configuration fields to AgentComponent

#### 1.1 Update AgentComponent Model

Add new JSON field for advanced configuration:

```python
# /backend/app/models/agent_component.py

class AgentComponent(Base):
    # ... existing fields ...

    # NEW: Advanced configuration (stored as JSON)
    advanced_config: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
        default=None
    )

    # Structure of advanced_config:
    # {
    #     "model_provider": "OpenAI",     # OpenAI, Anthropic, etc.
    #     "model_name": "gpt-4o-mini",
    #     "temperature": 0.7,
    #     "max_tokens": 4096,
    #     "max_iterations": 10,
    #     "verbose": false,
    #     "handle_parsing_errors": true,
    #     "chat_history_enabled": true,
    # }
```

#### 1.2 Update AgentComponent Schema

```python
# /backend/app/schemas/agent_component.py

class AgentComponentAdvancedConfig(BaseModel):
    """Advanced configuration for agent component."""
    model_provider: str = "OpenAI"
    model_name: str = "gpt-4o-mini"
    temperature: float = Field(default=0.7, ge=0, le=2)
    max_tokens: int = Field(default=4096, ge=1, le=128000)
    max_iterations: int = Field(default=10, ge=1, le=100)
    verbose: bool = False
    handle_parsing_errors: bool = True
    chat_history_enabled: bool = True

class AgentComponentUpdate(BaseModel):
    # ... existing fields ...
    advanced_config: Optional[AgentComponentAdvancedConfig] = None
```

#### 1.3 Database Migration

```bash
alembic revision --autogenerate -m "Add advanced_config to agent_components"
alembic upgrade head
```

---

### Phase 2: Backend - Component Generator Service

**Goal**: Generate Python component files that mirror Langflow's Agent

#### 2.1 Create Jinja2 Template

```python
# /backend/templates/component_templates/user_agent_component.py.jinja2

"""
Auto-generated component for: {{ agent_name }}
Created: {{ created_at }}
User ID: {{ user_id }}
Component ID: {{ component_id }}

This component is a custom wrapper around Langflow's Agent functionality,
prefilled with the user's Q&A configuration from Teach Charlie AI.
"""
from langflow.custom import Component
from langflow.io import (
    MessageTextInput,
    Output,
    DropdownInput,
    SecretStrInput,
    SliderInput,
    IntInput,
    BoolInput,
    MultilineInput,
    HandleInput,
    DataInput,
)
from langflow.schema.message import Message
from langflow.field_typing import Tool
from langflow.field_typing.range_spec import RangeSpec


class {{ class_name }}(Component):
    """{{ description }}"""

    display_name = "{{ display_name }}"
    description = "{{ description }}"
    icon = "dog"
    name = "{{ class_name }}"

    inputs = [
        # Basic Input
        MessageTextInput(
            name="input_value",
            display_name="Message",
            info="Enter your message or question",
            tool_mode=True,
        ),

        # Model Configuration (visible)
        DropdownInput(
            name="model_provider",
            display_name="Model Provider",
            options=["OpenAI", "Anthropic", "Google", "Azure OpenAI"],
            value="{{ model_provider }}",
            info="The LLM provider to use",
        ),
        DropdownInput(
            name="model_name",
            display_name="Model Name",
            options=[
                "gpt-4o-mini", "gpt-4o", "gpt-4-turbo",
                "claude-3-haiku-20240307", "claude-3-sonnet-20240229",
            ],
            value="{{ model_name }}",
            info="The specific model to use",
        ),
        SecretStrInput(
            name="api_key",
            display_name="API Key",
            info="Your API key for the selected provider",
            required=True,
        ),

        # Agent Instructions (PREFILLED from Q&A)
        MultilineInput(
            name="agent_instructions",
            display_name="Agent Instructions",
            info="Instructions for how the agent should behave",
            value='''{{ system_prompt | replace("'", "\\'") | replace("\n", "\\n") }}''',
        ),

        # Tools Input
        HandleInput(
            name="tools",
            display_name="Tools",
            input_types=["Tool", "BaseTool", "StructuredTool"],
            is_list=True,
            info="Tools the agent can use",
        ),

        # Advanced Options (hidden by default)
        SliderInput(
            name="temperature",
            display_name="Temperature",
            value={{ temperature }},
            range_spec=RangeSpec(min=0, max=2, step=0.01),
            info="Controls randomness in responses (0=deterministic, 2=creative)",
            advanced=True,
        ),
        IntInput(
            name="max_tokens",
            display_name="Max Tokens",
            value={{ max_tokens }},
            range_spec=RangeSpec(min=1, max=128000),
            info="Maximum number of tokens in the response",
            advanced=True,
        ),
        IntInput(
            name="max_iterations",
            display_name="Max Iterations",
            value={{ max_iterations }},
            range_spec=RangeSpec(min=1, max=100),
            info="Maximum number of agent reasoning steps",
            advanced=True,
        ),
        BoolInput(
            name="verbose",
            display_name="Verbose",
            value={{ verbose | lower }},
            info="Show detailed agent reasoning steps",
            advanced=True,
        ),
        BoolInput(
            name="handle_parsing_errors",
            display_name="Handle Parsing Errors",
            value={{ handle_parsing_errors | lower }},
            info="Gracefully handle LLM output parsing errors",
            advanced=True,
        ),
        DataInput(
            name="chat_history",
            display_name="Chat History",
            is_list=True,
            info="Previous messages for context",
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

    def run_agent(self) -> Message:
        """Execute the agent with the configured settings."""
        from langchain_openai import ChatOpenAI
        from langchain_anthropic import ChatAnthropic
        from langchain.agents import AgentExecutor, create_tool_calling_agent
        from langchain_core.prompts import ChatPromptTemplate

        # Select LLM based on provider
        if self.model_provider == "OpenAI":
            llm = ChatOpenAI(
                model=self.model_name,
                api_key=self.api_key,
                temperature=self.temperature,
                max_tokens=self.max_tokens or None,
            )
        elif self.model_provider == "Anthropic":
            llm = ChatAnthropic(
                model=self.model_name,
                api_key=self.api_key,
                temperature=self.temperature,
                max_tokens=self.max_tokens or 4096,
            )
        else:
            # Default to OpenAI
            llm = ChatOpenAI(
                model=self.model_name or "gpt-4o-mini",
                api_key=self.api_key,
                temperature=self.temperature,
            )

        # Build tools list
        tools = self.tools if self.tools else []

        # Build chat history
        history = []
        if self.chat_history:
            for msg in self.chat_history:
                if hasattr(msg, 'data'):
                    history.append(msg.data)

        # Create prompt template
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.agent_instructions),
            ("placeholder", "{chat_history}"),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}"),
        ])

        # Create and run agent
        if tools:
            agent = create_tool_calling_agent(llm, tools, prompt)
            executor = AgentExecutor(
                agent=agent,
                tools=tools,
                verbose=self.verbose,
                max_iterations=self.max_iterations,
                handle_parsing_errors=self.handle_parsing_errors,
            )
            result = executor.invoke({
                "input": self.input_value,
                "chat_history": history,
            })
            response_text = result.get("output", "")
        else:
            # No tools, just run LLM directly
            messages = [("system", self.agent_instructions)]
            messages.extend(history)
            messages.append(("human", self.input_value))
            response = llm.invoke(messages)
            response_text = response.content

        self.status = response_text
        return Message(text=response_text)

    def to_toolkit(self) -> list[Tool]:
        """Convert this component to a tool for use by other agents."""
        from langchain.tools import Tool as LangChainTool

        return [LangChainTool(
            name="{{ class_name }}",
            description="{{ description }}",
            func=lambda x: self._run_as_tool(x),
        )]

    def _run_as_tool(self, query: str) -> str:
        """Run this agent as a tool."""
        self.input_value = query
        result = self.run_agent()
        return result.text if hasattr(result, 'text') else str(result)
```

#### 2.2 Create Component Generator Service

```python
# /backend/app/services/component_generator.py

"""
Service for generating custom Python components from AgentComponents.
"""
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Optional
from jinja2 import Environment, FileSystemLoader

from app.models.agent_component import AgentComponent
from app.core.config import settings


class ComponentGenerator:
    """Generates Python component files for user-created agents."""

    TEMPLATE_DIR = Path(__file__).parent.parent.parent / "templates" / "component_templates"

    # Default: custom_components/my_agents/ in Langflow's components directory
    COMPONENTS_DIR = Path(settings.CUSTOM_COMPONENTS_PATH) / "my_agents"

    def __init__(self):
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(self.TEMPLATE_DIR)),
            trim_blocks=True,
            lstrip_blocks=True,
        )
        self._ensure_directories()

    def _ensure_directories(self):
        """Ensure my_agents directory and __init__.py exist."""
        self.COMPONENTS_DIR.mkdir(parents=True, exist_ok=True)

        init_file = self.COMPONENTS_DIR / "__init__.py"
        if not init_file.exists():
            init_file.write_text('''"""
My Agents - Custom AI agent components generated by Teach Charlie AI.
These components are auto-generated from the 3-step Q&A wizard.
"""
''')

    def _sanitize_class_name(self, name: str, component_id: str) -> str:
        """Convert agent name to valid Python class name."""
        # Remove special characters, convert to PascalCase
        name = re.sub(r'[^a-zA-Z0-9\s]', '', name)
        words = name.split()
        class_name = ''.join(word.capitalize() for word in words)
        # Add unique suffix from component ID
        short_id = component_id[:8].replace('-', '')
        return f"{class_name}Agent_{short_id}"

    def _sanitize_file_name(self, name: str, component_id: str) -> str:
        """Convert agent name to valid file name (snake_case)."""
        name = re.sub(r'[^a-zA-Z0-9\s]', '', name)
        short_id = component_id[:8].replace('-', '')
        return '_'.join(name.lower().split()) + f"_agent_{short_id}"

    def generate_component(self, component: AgentComponent) -> str:
        """
        Generate a Python component file for the given AgentComponent.

        Returns the path to the generated file.
        """
        template = self.jinja_env.get_template("user_agent_component.py.jinja2")

        # Generate names
        class_name = self._sanitize_class_name(component.name, str(component.id))
        file_name = self._sanitize_file_name(component.name, str(component.id))

        # Get advanced config with defaults
        config = component.advanced_config or {}

        # Render template
        content = template.render(
            # Identity
            agent_name=component.name,
            class_name=class_name,
            display_name=component.name,
            description=component.description or f"AI Agent: {component.name}",

            # IDs
            component_id=str(component.id),
            user_id=str(component.user_id),
            created_at=datetime.utcnow().isoformat(),

            # Q&A Generated
            system_prompt=component.system_prompt,

            # Advanced Config
            model_provider=config.get('model_provider', 'OpenAI'),
            model_name=config.get('model_name', 'gpt-4o-mini'),
            temperature=config.get('temperature', 0.7),
            max_tokens=config.get('max_tokens', 4096),
            max_iterations=config.get('max_iterations', 10),
            verbose=config.get('verbose', False),
            handle_parsing_errors=config.get('handle_parsing_errors', True),
        )

        # Write file
        file_path = self.COMPONENTS_DIR / f"{file_name}.py"
        file_path.write_text(content)

        return str(file_path), class_name

    def delete_component(self, component: AgentComponent) -> bool:
        """Delete the component file for an AgentComponent."""
        if component.component_file_path:
            file_path = Path(component.component_file_path)
            if file_path.exists():
                file_path.unlink()
                return True
        return False

    def component_exists(self, component: AgentComponent) -> bool:
        """Check if the component file exists."""
        if component.component_file_path:
            return Path(component.component_file_path).exists()
        return False
```

#### 2.3 Update AgentComponentService

```python
# /backend/app/services/agent_component_service.py - additions

from app.services.component_generator import ComponentGenerator

class AgentComponentService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.template_mapper = TemplateMapper()
        self.component_generator = ComponentGenerator()

    async def publish(
        self,
        component: AgentComponent
    ) -> AgentComponentPublishResponse:
        """
        Publish agent component - generates Python component file.
        """
        if component.is_published:
            return AgentComponentPublishResponse(
                success=True,
                message="Component is already published",
                needs_restart=False,
            )

        # Generate Python component file
        try:
            file_path, class_name = self.component_generator.generate_component(component)

            # Update component record
            component.is_published = True
            component.component_file_path = file_path
            component.component_class_name = class_name
            component.updated_at = datetime.utcnow()

            await self.session.commit()
            await self.session.refresh(component)

            return AgentComponentPublishResponse(
                success=True,
                message=f"Component '{component.name}' published successfully! Langflow restart required.",
                needs_restart=True,
                component_file_path=file_path,
                component_class_name=class_name,
            )
        except Exception as e:
            logger.error(f"Failed to generate component: {e}")
            return AgentComponentPublishResponse(
                success=False,
                message=f"Failed to generate component: {str(e)}",
                needs_restart=False,
            )

    async def unpublish(self, component: AgentComponent) -> AgentComponent:
        """Unpublish - delete component file."""
        if not component.is_published:
            return component

        # Delete the Python file
        self.component_generator.delete_component(component)

        # Update record
        component.is_published = False
        component.component_file_path = None
        component.component_class_name = None
        component.updated_at = datetime.utcnow()

        await self.session.commit()
        await self.session.refresh(component)

        return component
```

---

### Phase 3: Frontend - Advanced Editor Modal

**Goal**: Create a modal that exposes all Agent options for power users

#### 3.1 Create AdvancedEditorModal Component

```tsx
// /frontend/src/components/AdvancedEditorModal.tsx

interface AdvancedConfig {
  model_provider: string
  model_name: string
  temperature: number
  max_tokens: number
  max_iterations: number
  verbose: boolean
  handle_parsing_errors: boolean
  chat_history_enabled: boolean
}

interface AdvancedEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: AdvancedConfig) => void
  initialConfig: AdvancedConfig | null
  agentName: string
}

const MODEL_OPTIONS = {
  OpenAI: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  Anthropic: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
  Google: ['gemini-1.5-flash', 'gemini-1.5-pro'],
}

export function AdvancedEditorModal({
  isOpen,
  onClose,
  onSave,
  initialConfig,
  agentName
}: AdvancedEditorModalProps) {
  const [config, setConfig] = useState<AdvancedConfig>({
    model_provider: 'OpenAI',
    model_name: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 4096,
    max_iterations: 10,
    verbose: false,
    handle_parsing_errors: true,
    chat_history_enabled: true,
    ...initialConfig,
  })

  // Modal UI with form fields for each option
  // Grouped into sections: Model, Generation, Agent Behavior
}
```

#### 3.2 Update EditAgentPage

Add "Advanced Editor" button and modal integration:

```tsx
// In EditAgentPage.tsx

const [showAdvancedEditor, setShowAdvancedEditor] = useState(false)
const [advancedConfig, setAdvancedConfig] = useState<AdvancedConfig | null>(null)

// Load from API
useEffect(() => {
  const loadAgent = async () => {
    const component = await api.getAgentComponent(agentId)
    // ... existing field loading ...
    setAdvancedConfig(component.advanced_config || null)
  }
}, [agentId])

// In the UI, add button next to "Open Flow Editor"
<button
  onClick={() => setShowAdvancedEditor(true)}
  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg"
>
  <Settings className="w-4 h-4" />
  Advanced Editor
</button>

<AdvancedEditorModal
  isOpen={showAdvancedEditor}
  onClose={() => setShowAdvancedEditor(false)}
  onSave={handleSaveAdvancedConfig}
  initialConfig={advancedConfig}
  agentName={name}
/>
```

#### 3.3 Update API Client

```typescript
// In api.ts

interface AgentComponentUpdate {
  // ... existing fields ...
  advanced_config?: {
    model_provider?: string
    model_name?: string
    temperature?: number
    max_tokens?: number
    max_iterations?: number
    verbose?: boolean
    handle_parsing_errors?: boolean
    chat_history_enabled?: boolean
  }
}
```

---

### Phase 4: Langflow Restart Integration

**Goal**: Provide mechanism to restart Langflow after publishing

#### 4.1 Docker Integration

```python
# /backend/app/services/langflow_restart.py

import docker
import asyncio
import httpx

class LangflowRestartService:
    """Manages Langflow container restarts."""

    CONTAINER_NAME = "langflow"
    HEALTH_URL = "http://langflow:7860/health"
    RESTART_TIMEOUT = 60  # seconds

    def __init__(self):
        self.docker_client = docker.from_env()

    async def restart(self) -> dict:
        """Restart Langflow container and wait for health."""
        try:
            container = self.docker_client.containers.get(self.CONTAINER_NAME)
            container.restart(timeout=10)

            # Wait for health
            healthy = await self._wait_for_healthy()

            return {
                "success": healthy,
                "message": "Langflow restarted successfully" if healthy else "Restart timed out"
            }
        except Exception as e:
            return {"success": False, "message": str(e)}

    async def _wait_for_healthy(self) -> bool:
        """Poll health endpoint until healthy."""
        async with httpx.AsyncClient() as client:
            for _ in range(self.RESTART_TIMEOUT):
                try:
                    resp = await client.get(self.HEALTH_URL, timeout=2)
                    if resp.status_code == 200:
                        return True
                except:
                    pass
                await asyncio.sleep(1)
        return False
```

#### 4.2 Add Restart Endpoint

```python
# /backend/app/api/system.py

@router.post("/restart-langflow")
async def restart_langflow(
    current_user: CurrentUser,
) -> dict:
    """Restart Langflow container to load new components."""
    restart_service = LangflowRestartService()
    result = await restart_service.restart()
    return result
```

---

### Phase 5: Docker Configuration

#### 5.1 Update docker-compose.yml

```yaml
services:
  langflow:
    # ... existing config ...
    environment:
      - LANGFLOW_COMPONENTS_PATH=/app/custom_components
    volumes:
      - ./custom_components:/app/custom_components
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7860/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  backend:
    # ... existing config ...
    volumes:
      - ./custom_components:/app/custom_components
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - CUSTOM_COMPONENTS_PATH=/app/custom_components
```

#### 5.2 Create Directory Structure

```
LangflowSaaS/
├── custom_components/
│   └── my_agents/
│       ├── __init__.py
│       └── (generated .py files appear here)
```

---

## UI/UX Design

### Advanced Editor Modal Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚙️ Advanced Editor - Charlie the Car Salesman                    [X]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  MODEL SETTINGS                                                          │
│  ┌─────────────────────────────┐ ┌─────────────────────────────────────┐│
│  │ Model Provider              │ │ Model Name                          ││
│  │ [OpenAI           ▼]       │ │ [gpt-4o-mini               ▼]      ││
│  └─────────────────────────────┘ └─────────────────────────────────────┘│
│                                                                          │
│  GENERATION SETTINGS                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ Temperature                                              0.7        ││
│  │ ○━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━○                                ││
│  │ More Deterministic            ↑            More Creative            ││
│  └─────────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────┐ ┌─────────────────────────────────────┐│
│  │ Max Tokens                  │ │ Max Iterations                      ││
│  │ [4096                    ]  │ │ [10                              ]  ││
│  └─────────────────────────────┘ └─────────────────────────────────────┘│
│                                                                          │
│  BEHAVIOR SETTINGS                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ [✓] Handle Parsing Errors     Gracefully handle LLM output errors  ││
│  │ [ ] Verbose Mode              Show detailed reasoning steps        ││
│  │ [✓] Enable Chat History       Remember previous messages           ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ⚠️ These settings will be used when the component is published.        │
│                                                                          │
│                                        [Cancel]  [Save Configuration]   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Publish Flow UI

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Publish "Charlie the Car Salesman"?                              [X]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Publishing will create a custom component that appears in the          │
│  Langflow sidebar under "My Agents".                                    │
│                                                                          │
│  Other users in your workspace will be able to drag this agent          │
│  into their workflows.                                                  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ 📋 Configuration Summary                                           │ │
│  │                                                                    │ │
│  │ • Model: OpenAI / gpt-4o-mini                                     │ │
│  │ • Temperature: 0.7                                                 │ │
│  │ • Max Tokens: 4096                                                 │ │
│  │ • Tools: Web Search, Calculator                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ⚠️ After publishing, Langflow will need to restart (~10 seconds).      │
│                                                                          │
│                                        [Cancel]  [Publish & Restart]    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Timeline

| Phase | Tasks | Estimated Effort |
|-------|-------|------------------|
| **Phase 1** | Schema updates, migration | 2-3 hours |
| **Phase 2** | Component generator service + template | 4-6 hours |
| **Phase 3** | Advanced Editor modal | 3-4 hours |
| **Phase 4** | Langflow restart integration | 2-3 hours |
| **Phase 5** | Docker configuration | 1-2 hours |
| **Testing** | E2E tests, manual validation | 2-3 hours |

**Total**: ~15-20 hours

---

## Success Criteria

1. [ ] User can open "Advanced Editor" modal from EditAgentPage
2. [ ] Advanced settings persist in database and reload correctly
3. [ ] Publishing generates valid Python component file
4. [ ] Generated component appears in Langflow sidebar after restart
5. [ ] Component works correctly when dragged into a flow
6. [ ] Unpublishing removes component file
7. [ ] All existing functionality continues to work

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Generated Python has syntax errors | Medium | High | Extensive template testing, validation before write |
| Langflow restart fails | Low | Medium | Health check polling, manual restart fallback |
| Docker socket permissions | Medium | Medium | Documentation, fallback to manual restart |
| Component naming collisions | Low | Low | Include component ID in class name |
| Model/API changes in LangChain | Medium | Medium | Pin dependency versions |

---

## Future Enhancements

1. **Hot Reload**: Implement component hot-reloading without full Langflow restart
2. **Component Versioning**: Track versions, allow rollback
3. **Component Sharing**: Share components across users/organizations
4. **Template Library**: Pre-built component templates beyond basic Agent
5. **Visual Component Builder**: Drag-and-drop component input configuration
