# Langflow Component Development Standards

> **Source**: Adapted from [langflow-factory](https://github.com/Empreiteiro/langflow-factory) best practices
> **Last Updated**: 2026-01-14
> **Purpose**: Standards for building custom Langflow components in Teach Charlie AI

---

## Table of Contents

1. [Component Structure](#1-component-structure)
2. [Input Types Reference](#2-input-types-reference)
3. [Output Patterns](#3-output-patterns)
4. [Dynamic UI Patterns](#4-dynamic-ui-patterns)
5. [Error Handling](#5-error-handling)
6. [Flow Development Standards](#6-flow-development-standards)
7. [API Integration Patterns](#7-api-integration-patterns)
8. [Streaming Implementation](#8-streaming-implementation)
9. [Utility Scripts](#9-utility-scripts)

---

## 1. Component Structure

### Required Class Attributes

Every custom component MUST define:

```python
from langflow.custom import Component
from langflow.io import MessageTextInput, Output
from langflow.schema import Message

class MyComponent(Component):
    # Required metadata
    display_name = "My Component"          # User-friendly name in UI
    description = "Clear, concise explanation of what this does"
    icon = "Bot"                           # Lucide icon name ONLY
    name = "MyComponent"                   # Internal identifier
    version = "1.0.0"                      # Semantic versioning

    # Input definitions
    inputs = [
        MessageTextInput(
            name="input_value",
            display_name="Input",
            required=True,
        ),
    ]

    # Output definitions
    outputs = [
        Output(display_name="Output", name="output", method="process"),
    ]

    def process(self) -> Message:
        """Main processing method"""
        return Message(text=self.input_value)
```

### Icon Guidelines

- **ONLY use Lucide icons**: https://lucide.dev/icons
- Common icons for Teach Charlie:
  - `Bot` - Agent components
  - `MessageSquare` - Chat/conversation
  - `Database` - Data/storage
  - `FileText` - Documents
  - `Search` - Retrieval/search
  - `Zap` - Actions/triggers
  - `Settings` - Configuration

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Class name | PascalCase | `KnowledgeRetriever` |
| Field names | snake_case | `input_value`, `api_key` |
| Display names | Title Case | `"Knowledge Retriever"` |
| Method names | snake_case | `process_input()` |

---

## 2. Input Types Reference

### Text Inputs

```python
from langflow.io import StrInput, MultilineInput, SecretStrInput, MessageTextInput

# Simple text input
StrInput(
    name="field_name",
    display_name="Field Label",
    value="default value",           # Optional default
    required=True,                   # Makes field mandatory
    placeholder="Enter text...",     # Hint text
    helper_text="Explanation text",  # Help tooltip
)

# Multi-line text (for prompts, descriptions)
MultilineInput(
    name="system_prompt",
    display_name="System Prompt",
    required=True,
    placeholder="You are a helpful assistant...",
)

# Secret/password input (auto-masked, never logged)
SecretStrInput(
    name="api_key",
    display_name="API Key",
    required=True,
    password=True,  # Ensures masking
)

# Message-aware text input
MessageTextInput(
    name="user_input",
    display_name="User Message",
)
```

### Numeric Inputs

```python
from langflow.io import IntInput, FloatInput, SliderInput

# Integer input
IntInput(
    name="max_tokens",
    display_name="Max Tokens",
    value=1000,
    min=1,
    max=4096,
)

# Float input
FloatInput(
    name="temperature",
    display_name="Temperature",
    value=0.7,
    min=0.0,
    max=2.0,
)

# Slider (visual numeric input)
SliderInput(
    name="creativity",
    display_name="Creativity Level",
    value=0.5,
    min=0.0,
    max=1.0,
    step=0.1,
)
```

### Selection Inputs

```python
from langflow.io import DropdownInput, BoolInput, MultiSelectInput

# Dropdown (single selection)
DropdownInput(
    name="model",
    display_name="Model",
    options=["gpt-4", "gpt-3.5-turbo", "claude-3"],
    value="gpt-4",  # Default selection
)

# Boolean toggle
BoolInput(
    name="stream",
    display_name="Enable Streaming",
    value=True,
)

# Multi-select
MultiSelectInput(
    name="features",
    display_name="Features",
    options=["feature_a", "feature_b", "feature_c"],
    value=["feature_a"],  # Default selections
)
```

### File & Data Inputs

```python
from langflow.io import FileInput, HandleInput, DataInput

# File upload
FileInput(
    name="document",
    display_name="Upload Document",
    file_types=["pdf", "txt", "docx"],  # Allowed extensions
    required=True,
)

# Connection handle (receives from other components)
HandleInput(
    name="retriever",
    display_name="Retriever",
    input_types=["Retriever"],  # Accepted component types
)

# Generic data input
DataInput(
    name="data",
    display_name="Input Data",
)
```

### Dynamic Inputs

```python
from langflow.io import StrInput

# Input that triggers UI refresh when changed
StrInput(
    name="trigger_field",
    display_name="Trigger Field",
    real_time_refresh=True,  # Calls update_outputs() on change
)

# Conditionally shown input
StrInput(
    name="conditional_field",
    display_name="Conditional Field",
    dynamic=True,   # Can be shown/hidden
    show=False,     # Initially hidden
)
```

---

## 3. Output Patterns

### Output Types

```python
from langflow.io import Output
from langflow.schema import Message, Data
from langflow.schema.dataframe import DataFrame

# Text/chat output
Output(
    display_name="Response",
    name="response",
    method="generate_response",
)

def generate_response(self) -> Message:
    return Message(
        text="Hello!",
        sender="Machine",
        sender_name="Charlie",
    )

# Structured data output
def get_data(self) -> Data:
    return Data(data={"key": "value"})

# Tabular data output
def get_dataframe(self) -> DataFrame:
    return DataFrame(data=[{"col1": "val1"}])
```

### Multi-Output Components

For components with multiple actions, create separate methods:

```python
class MultiActionComponent(Component):
    outputs = [
        Output(display_name="Success", name="success", method="on_success"),
        Output(display_name="Error", name="error", method="on_error"),
    ]

    def on_success(self) -> Message:
        if self._success:
            return Message(text=self._result)
        self.stop("success")  # Deactivate this output

    def on_error(self) -> Message:
        if not self._success:
            return Message(text=self._error_message)
        self.stop("error")  # Deactivate this output
```

---

## 4. Dynamic UI Patterns

### The `update_outputs` Method

This method is automatically called when a field with `real_time_refresh=True` changes:

```python
class DynamicComponent(Component):
    inputs = [
        DropdownInput(
            name="mode",
            display_name="Mode",
            options=["simple", "advanced"],
            value="simple",
            real_time_refresh=True,  # Triggers update_outputs()
        ),
        StrInput(
            name="advanced_option",
            display_name="Advanced Option",
            dynamic=True,
            show=False,  # Hidden by default
        ),
    ]

    def update_outputs(self):
        """Called when mode changes"""
        # Show/hide advanced options based on mode
        if self.mode == "advanced":
            self._inputs["advanced_option"]["show"] = True
        else:
            self._inputs["advanced_option"]["show"] = False
```

### Row-Count Based Dynamic Outputs

```python
def update_outputs(self):
    """Adapt outputs based on table row count"""
    row_count = len(self.table_input or [])

    self._outputs = []

    if row_count == 0:
        self._outputs.append(
            Output(name="warning", display_name="Warning", method="warn_empty")
        )
    elif row_count <= 5:
        self._outputs.append(
            Output(name="summary", display_name="Summary", method="summarize")
        )
    else:
        self._outputs.append(
            Output(name="analysis", display_name="Full Analysis", method="analyze")
        )
```

---

## 5. Error Handling

### Logging Standard

**ALWAYS use `self.log()` instead of Python's `logging` module:**

```python
def process(self) -> Message:
    # Info logging
    self.log("Starting process...")

    # Debug logging
    self.log(f"Input value: {self.input_value}", level="debug")

    try:
        result = self._do_work()
        self.log("Process completed successfully")
        return Message(text=result)

    except ValueError as e:
        # Log before raising
        self.log(f"Validation error: {e}", level="error")
        raise

    except Exception as e:
        self.log(f"Unexpected error: {e}", level="error")
        raise RuntimeError(f"Processing failed: {e}")
```

### Validation Pattern

```python
def process(self) -> Message:
    # Validate inputs early
    if not self.input_value:
        self.log("Missing required input", level="error")
        raise ValueError("Input value is required")

    if len(self.input_value) > 10000:
        self.log(f"Input too long: {len(self.input_value)} chars", level="warning")
        # Truncate or reject

    # Proceed with processing
    ...
```

---

## 6. Flow Development Standards

### Design Principles

1. **Modularity**: Each component should do one thing well
2. **Reusability**: Design for multiple use cases
3. **Testability**: Keep logic testable in isolation
4. **Documentation**: Include clear descriptions and examples

### Connection Types

| Type | Use Case | Example |
|------|----------|---------|
| `Message` | Chat/conversation data | User input, AI response |
| `Data` | Structured JSON data | API responses, configs |
| `DataFrame` | Tabular data | CSV processing, analytics |
| `Document` | Document objects | PDF, text files |
| `Retriever` | Search/retrieval | Vector store connections |

### Error Handling in Flows

Use conditional routing for error scenarios:

```
[Input] -> [Process] -> [Conditional Router]
                              |-> [Success Path]
                              |-> [Error Path]
```

---

## 7. API Integration Patterns

### HTTP Client Template

```python
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

class APIComponent(Component):
    inputs = [
        SecretStrInput(name="api_key", display_name="API Key", required=True),
        StrInput(name="endpoint", display_name="Endpoint URL", required=True),
    ]

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    async def _make_request(self, payload: dict) -> dict:
        """Make API request with retry logic"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.endpoint,
                json=payload,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                timeout=30.0,
            )
            response.raise_for_status()
            return response.json()

    def process(self) -> Data:
        try:
            result = asyncio.run(self._make_request({"input": self.input_value}))
            return Data(data=result)
        except httpx.HTTPStatusError as e:
            self.log(f"API error: {e.response.status_code}", level="error")
            raise
```

### Credential Validation

```python
def _validate_credentials(self) -> bool:
    """Validate API credentials before use"""
    if not self.api_key:
        self.log("API key not provided", level="error")
        return False

    if not self.api_key.startswith("sk-"):
        self.log("Invalid API key format", level="error")
        return False

    return True
```

---

## 8. Streaming Implementation

### Event Types

When implementing streaming responses, handle these event types:

| Event | Description | Handler |
|-------|-------------|---------|
| `token` | Individual streaming chunk | Yield immediately |
| `add_message` | Complete message | Log/store message |
| `end` | Stream complete | Return final result |

### Streaming Handler Pattern

```python
import requests
import json

def stream_response(self, flow_url: str, payload: dict) -> Generator[str, None, None]:
    """Stream response from Langflow"""
    response = requests.post(
        flow_url,
        json=payload,
        headers={"x-api-key": self.api_key},
        stream=True,
    )

    for line in response.iter_lines():
        if not line:
            continue

        try:
            data = json.loads(line.decode('utf-8'))
            event_type = data.get("event")

            if event_type == "token":
                yield data.get("chunk", "")

            elif event_type == "add_message":
                self.log(f"Message from {data.get('sender')}")

            elif event_type == "end":
                self.log("Stream completed")
                return

        except json.JSONDecodeError:
            self.log(f"Invalid JSON: {line}", level="warning")
            continue
```

---

## 9. Utility Scripts

### Useful API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/run/{flow_id}` | POST | Execute a flow |
| `/api/v1/flows/{flow_id}` | GET | Get flow details |
| `/api/v1/flows/upload/` | POST | Upload a flow |
| `/api/v2/files` | POST | Upload a file |
| `/health` | GET | Health check |

### Flow Execution Payload

```python
payload = {
    "output_type": "text",      # or "json", "any"
    "input_type": "text",       # or "json", "any"
    "input_value": "user input here",
    "tweaks": {
        # Override component values at runtime
        "ComponentName-abc123": {
            "input_value": "custom value"
        }
    },
    "session_id": "optional-session-id",  # For conversation context
}
```

### File Upload Pattern

```python
import mimetypes

def upload_file(file_path: str, langflow_url: str, api_key: str) -> dict:
    """Upload file to Langflow"""
    mime_type, _ = mimetypes.guess_type(file_path)

    with open(file_path, 'rb') as f:
        response = requests.post(
            f"{langflow_url}/api/v2/files",
            files={"file": (file_path, f, mime_type)},
            headers={"x-api-key": api_key},
        )

    return response.json()
```

---

## Quick Reference Card

### Component Checklist

- [ ] Class inherits from `Component`
- [ ] `display_name` is user-friendly
- [ ] `description` clearly explains purpose
- [ ] `icon` uses Lucide icon name
- [ ] All required inputs have `required=True`
- [ ] Sensitive inputs use `SecretStrInput`
- [ ] Outputs return proper types (`Message`, `Data`, `DataFrame`)
- [ ] Error handling logs before raising
- [ ] Uses `self.log()` not `logging`

### Common Patterns

```python
# Log with context
self.log(f"Processing {len(items)} items", level="info")

# Early validation
if not self.required_field:
    raise ValueError("required_field is mandatory")

# Safe dict access
value = self.optional_dict.get("key", "default")

# Type checking
if not isinstance(self.input_data, list):
    self.input_data = [self.input_data]
```

---

## See Also

- [Langflow Documentation](https://docs.langflow.org/)
- [Lucide Icons](https://lucide.dev/icons)
- [langflow-factory Repository](https://github.com/Empreiteiro/langflow-factory)
- [langflow-templates Repository](https://github.com/Empreiteiro/langflow-templates)
