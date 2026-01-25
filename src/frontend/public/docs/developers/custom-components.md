# Custom Langflow Components

When you publish an agent in Teach Charlie AI, it becomes a custom Langflow component. This guide explains how components work and how to build advanced customizations.

## Understanding Components

Langflow uses a component system where each node in a workflow is a self-contained unit with:

- **Inputs**: Data the component receives
- **Outputs**: Data the component produces
- **Parameters**: Configurable settings
- **Logic**: The processing code

## Published Agents as Components

When you publish an agent via Teach Charlie AI:

1. The agent configuration is packaged
2. A Langflow component is generated
3. The component appears in your sidebar
4. You can drag it into any workflow

### What Gets Included

| Element | Included | Notes |
|---------|----------|-------|
| System prompt | Yes | From Q&A "who" and "rules" |
| Tools/actions | Yes | From Q&A "tricks" |
| Knowledge sources | Reference | Points to your knowledge base |
| Conversation memory | Yes | Memory configuration |
| Model settings | Yes | Temperature, max tokens, etc. |

## Using Published Components

### In the Canvas

1. Open the Langflow canvas (unlock level 3)
2. Find your component in the sidebar under "Custom Agents"
3. Drag onto the canvas
4. Connect inputs and outputs

### Component Interface

Your published agent exposes:

**Inputs:**
- `input_message` (string) - User's message
- `conversation_id` (string) - For context continuity
- `context` (object) - Additional context data

**Outputs:**
- `response` (string) - Agent's reply
- `metadata` (object) - Token usage, tool calls, etc.

### Chaining Components

Connect multiple agents in sequence:

```
User Input → Agent A → Agent B → Output
              ↓
        (specialized task)
```

Example: Route support questions to a triage agent, then to specialized agents.

## Building Custom Components

For developers who want to create components from scratch (not via the Q&A wizard).

### Component Structure

```python
from langflow.custom import CustomComponent
from langflow.schema import Data

class MyCustomAgent(CustomComponent):
    display_name = "My Custom Agent"
    description = "A specialized agent for..."
    icon = "bot"

    def build_config(self):
        return {
            "system_prompt": {
                "display_name": "System Prompt",
                "type": "text",
                "required": True
            },
            "temperature": {
                "display_name": "Temperature",
                "type": "float",
                "default": 0.7
            }
        }

    def build(
        self,
        system_prompt: str,
        temperature: float = 0.7
    ) -> Data:
        # Component logic here
        result = self.process(system_prompt, temperature)
        return Data(value=result)
```

### Key Methods

#### build_config()

Define the component's parameters:

```python
def build_config(self):
    return {
        "parameter_name": {
            "display_name": "Human Readable Name",
            "type": "text",  # text, float, int, bool, select
            "default": "default value",
            "required": True,
            "options": ["a", "b", "c"],  # For select type
            "advanced": False  # Hide in advanced settings
        }
    }
```

#### build()

The main processing logic:

```python
def build(self, **kwargs) -> Data:
    # Process inputs
    # Call external APIs
    # Return result
    return Data(value=result)
```

### Type Annotations

Langflow infers types from annotations:

```python
def build(
    self,
    message: str,          # Text input
    count: int = 10,       # Integer with default
    enabled: bool = True,  # Boolean toggle
    items: list = [],      # List input
) -> Data:
    pass
```

## Component Examples

### Simple API Wrapper

```python
from langflow.custom import CustomComponent
from langflow.schema import Data
import httpx

class WeatherComponent(CustomComponent):
    display_name = "Weather Lookup"
    description = "Get current weather for a city"

    def build_config(self):
        return {
            "city": {
                "display_name": "City",
                "type": "text",
                "required": True
            },
            "api_key": {
                "display_name": "API Key",
                "type": "password",
                "required": True
            }
        }

    def build(self, city: str, api_key: str) -> Data:
        response = httpx.get(
            f"https://api.weather.com/v1/current",
            params={"city": city, "key": api_key}
        )
        return Data(value=response.json())
```

### Database Query Component

```python
from langflow.custom import CustomComponent
from langflow.schema import Data
import sqlalchemy

class DatabaseQuery(CustomComponent):
    display_name = "Database Query"
    description = "Execute SQL queries"

    def build_config(self):
        return {
            "connection_string": {
                "display_name": "Connection String",
                "type": "password"
            },
            "query": {
                "display_name": "SQL Query",
                "type": "text",
                "multiline": True
            }
        }

    def build(self, connection_string: str, query: str) -> Data:
        engine = sqlalchemy.create_engine(connection_string)
        with engine.connect() as conn:
            result = conn.execute(sqlalchemy.text(query))
            rows = [dict(row) for row in result]
        return Data(value=rows)
```

### LLM Wrapper with Custom Logic

```python
from langflow.custom import CustomComponent
from langflow.schema import Data
from anthropic import Anthropic

class CustomClaudeAgent(CustomComponent):
    display_name = "Custom Claude Agent"

    def build_config(self):
        return {
            "system_prompt": {"type": "text", "multiline": True},
            "model": {
                "type": "select",
                "options": ["claude-3-opus", "claude-3-sonnet"],
                "default": "claude-3-sonnet"
            }
        }

    def build(
        self,
        message: str,
        system_prompt: str,
        model: str = "claude-3-sonnet"
    ) -> Data:
        client = Anthropic()

        # Custom pre-processing
        enhanced_prompt = f"{system_prompt}\n\nContext: {self.get_context()}"

        response = client.messages.create(
            model=model,
            system=enhanced_prompt,
            messages=[{"role": "user", "content": message}]
        )

        # Custom post-processing
        result = self.format_response(response.content[0].text)

        return Data(value=result)
```

## Deploying Custom Components

### Via Teach Charlie AI

1. Write your component code
2. Go to **Dashboard → Custom Components**
3. Click **"Upload Component"**
4. Paste your Python code
5. Click **"Deploy"**

### Via Langflow Directly

1. Add to `langflow/components/custom/`
2. Restart Langflow
3. Component appears in sidebar

## Component Best Practices

### 1. Error Handling

```python
def build(self, **kwargs) -> Data:
    try:
        result = self.process(**kwargs)
        return Data(value=result)
    except Exception as e:
        self.log_error(f"Processing failed: {e}")
        return Data(value={"error": str(e)})
```

### 2. Logging

```python
def build(self, message: str) -> Data:
    self.log_info(f"Processing message: {message[:50]}...")
    # ... processing
    self.log_info("Processing complete")
```

### 3. Caching

```python
from functools import lru_cache

class CachedComponent(CustomComponent):

    @lru_cache(maxsize=100)
    def expensive_operation(self, key: str):
        # Cached result
        return self.fetch_data(key)
```

### 4. Async Operations

```python
import asyncio

class AsyncComponent(CustomComponent):

    async def async_build(self, **kwargs) -> Data:
        results = await asyncio.gather(
            self.fetch_a(),
            self.fetch_b()
        )
        return Data(value=results)
```

### 5. Testing

```python
def test_my_component():
    component = MyCustomAgent()
    result = component.build(
        system_prompt="Test prompt",
        temperature=0.5
    )
    assert result.value is not None
```

## Sharing Components

### Export

Download component as a `.py` file:

1. Go to component settings
2. Click **"Export"**
3. Save the file

### Import

Upload a component file:

1. Go to **Custom Components**
2. Click **"Import"**
3. Select the `.py` file

### Community (Coming Soon)

Share components in the Teach Charlie AI marketplace:

- Browse community components
- One-click install
- Rate and review
- Earn credits for popular components

---

Learn more about the underlying engine: [Langflow Integration](/resources/developers/langflow).
