# Component Builder Skill

> Create Langflow custom components for Teach Charlie AI course

---

## Overview

This skill creates Langflow custom components that simplify the canvas for learners. Course components wrap complex functionality in friendly, single-node interfaces.

**Design Philosophy**:
- Hide complexity behind simple interfaces
- Use dog trainer language in all labels
- Minimize required configuration
- Provide sensible defaults

---

## How to Invoke

### Interview Mode
```
Create a component for [purpose]
```

### Brief Mode
```
/component-builder

Component Brief:
- Name: Memory Kit
- Purpose: One-click conversation memory
- Inputs: None required
- Outputs: memory (to Agent tools input)
- Wraps: ConversationBufferMemory
```

---

## Course Components Registry

| Component | Purpose | Status | First Mission |
|-----------|---------|--------|---------------|
| Mission Brief | Show current objective | Planned | L001 |
| RAG Kit | Simplified document Q&A | Planned | L007 |
| Memory Kit | One-click conversation memory | Planned | L016 |
| Ship Pack | Deploy (link, embed, API) | Planned | L012 |
| Metrics Panel | Token/cost tracking | Planned | L019 |
| Email Tool | Send emails | Planned | L020 |
| Calendar Tool | Google Calendar integration | Planned | L021 |
| Slack Tool | Slack messaging | Planned | L022 |

---

## Component Design Process

### Phase 1: Requirements

1. **What's the purpose?**
   - What complex functionality should it simplify?
   - What would a user have to build manually without it?

2. **What's the user-facing name?**
   - Use friendly language (not technical)
   - Examples: "Memory Kit" not "ConversationBufferMemory"

3. **What inputs does it need?**
   - Minimize required inputs
   - Use sensible defaults
   - Hide advanced options

4. **What outputs does it provide?**
   - Usually one main output
   - Clear type annotation

5. **What does it wrap?**
   - Which existing components/APIs does it encapsulate?

### Phase 2: Implementation

Generate a Langflow custom component following the template:

```python
from langflow.custom import Component
from langflow.io import MessageTextInput, Output
from langflow.schema.message import Message


class MyComponent(Component):
    display_name = "Friendly Name"
    description = "What this does in plain English."
    icon = "icon-name"  # Lucide icon name
    name = "MyComponent"

    inputs = [
        # Define inputs here
    ]

    outputs = [
        Output(display_name="Output", name="output", method="build_output"),
    ]

    def build_output(self) -> Message:
        # Implementation here
        pass
```

### Phase 3: Testing

1. Unit test the component logic
2. Integration test in Langflow canvas
3. Test with target mission flow

---

## Input Types Reference

```python
from langflow.io import (
    MessageTextInput,    # Text input (single line)
    MultilineInput,      # Text input (multi-line)
    IntInput,            # Integer number
    FloatInput,          # Decimal number
    BoolInput,           # True/False toggle
    DropdownInput,       # Select from options
    FileInput,           # File upload
    SecretStrInput,      # Password/API key (hidden)
    HandleInput,         # Connection from other component
)
```

### Common Input Patterns

**Text Input**:
```python
MessageTextInput(
    name="agent_name",
    display_name="Agent Name",
    info="Give your agent a friendly name",
    value="Charlie",  # Default value
),
```

**Dropdown**:
```python
DropdownInput(
    name="model",
    display_name="AI Model",
    options=["GPT-4", "GPT-3.5", "Claude"],
    value="GPT-4",
),
```

**Boolean Toggle**:
```python
BoolInput(
    name="remember_context",
    display_name="Remember Context",
    info="Should the agent remember previous messages?",
    value=True,
    advanced=True,  # Hide in "Advanced" section
),
```

**Connection Input**:
```python
HandleInput(
    name="documents",
    display_name="Documents",
    input_types=["Document"],
    info="Connect documents for the agent to reference",
),
```

---

## Output Types Reference

```python
from langflow.io import Output

# Single output
outputs = [
    Output(display_name="Result", name="result", method="build_result"),
]

# Multiple outputs
outputs = [
    Output(display_name="Success", name="success", method="on_success"),
    Output(display_name="Error", name="error", method="on_error"),
]
```

---

## Example Component: Memory Kit

```python
from langflow.custom import Component
from langflow.io import BoolInput, IntInput, Output
from langflow.schema.message import Message
from langchain.memory import ConversationBufferWindowMemory


class MemoryKit(Component):
    display_name = "Memory Kit"
    description = "Give your agent the ability to remember conversations."
    icon = "brain"
    name = "MemoryKit"

    inputs = [
        IntInput(
            name="memory_length",
            display_name="Memory Length",
            info="How many messages should the agent remember? (Default: 10)",
            value=10,
            advanced=True,
        ),
        BoolInput(
            name="return_messages",
            display_name="Return Full Messages",
            info="Return complete message objects instead of text summary",
            value=True,
            advanced=True,
        ),
    ]

    outputs = [
        Output(
            display_name="Memory",
            name="memory",
            method="build_memory",
        ),
    ]

    def build_memory(self) -> ConversationBufferWindowMemory:
        """Build and return the memory component."""
        return ConversationBufferWindowMemory(
            k=self.memory_length,
            return_messages=self.return_messages,
            memory_key="chat_history",
        )
```

---

## Example Component: RAG Kit

```python
from langflow.custom import Component
from langflow.io import FileInput, DropdownInput, Output, HandleInput
from langflow.schema.message import Message


class RAGKit(Component):
    display_name = "RAG Kit"
    description = "Upload documents and let your agent answer questions about them."
    icon = "book-open"
    name = "RAGKit"

    inputs = [
        FileInput(
            name="documents",
            display_name="Documents",
            info="Upload PDF, TXT, or DOCX files",
            file_types=["pdf", "txt", "docx"],
        ),
        DropdownInput(
            name="chunk_strategy",
            display_name="Reading Style",
            info="How should the agent read your documents?",
            options=["Quick Scan", "Thorough Read", "Detailed Analysis"],
            value="Thorough Read",
            advanced=True,
        ),
    ]

    outputs = [
        Output(
            display_name="Knowledge",
            name="knowledge",
            method="build_retriever",
        ),
    ]

    def build_retriever(self):
        """Build document retriever with sensible defaults."""
        # Map friendly names to technical settings
        chunk_settings = {
            "Quick Scan": {"chunk_size": 2000, "overlap": 100},
            "Thorough Read": {"chunk_size": 1000, "overlap": 200},
            "Detailed Analysis": {"chunk_size": 500, "overlap": 100},
        }
        settings = chunk_settings[self.chunk_strategy]

        # ... implementation
        pass
```

---

## File Locations

Components should be placed in:

```
src/backend/langflow_components/
├── __init__.py
├── memory_kit.py
├── rag_kit.py
├── ship_pack.py
└── ...
```

Register in `__init__.py`:
```python
from .memory_kit import MemoryKit
from .rag_kit import RAGKit

__all__ = ["MemoryKit", "RAGKit"]
```

---

## Testing Components

### Unit Test Template

```python
import pytest
from langflow_components.memory_kit import MemoryKit


def test_memory_kit_default():
    """Test Memory Kit with default settings."""
    component = MemoryKit()
    memory = component.build_memory()

    assert memory is not None
    assert memory.k == 10  # Default memory length


def test_memory_kit_custom_length():
    """Test Memory Kit with custom memory length."""
    component = MemoryKit()
    component.memory_length = 5
    memory = component.build_memory()

    assert memory.k == 5
```

### Integration Test

```python
def test_memory_kit_in_flow():
    """Test Memory Kit connected to Agent in a flow."""
    # Create flow with Agent + Memory Kit
    # Verify memory is passed correctly
    pass
```

---

## Validation Checklist

Before finalizing a component:

### Code Quality
- [ ] Follows Langflow component pattern
- [ ] Has sensible defaults for all inputs
- [ ] Advanced options hidden by default
- [ ] Clear type annotations
- [ ] Proper error handling

### Educational Quality
- [ ] Display name is friendly (no jargon)
- [ ] Description explains purpose clearly
- [ ] Input labels use dog trainer language
- [ ] Info tooltips are helpful
- [ ] Icon is appropriate

### Integration
- [ ] Works with target mission flow
- [ ] Connects properly to Agent component
- [ ] Tested in Langflow canvas
- [ ] Unit tests pass

---

## Reference Documentation

For Langflow component development:
- [Langflow Custom Components](https://docs.langflow.org/components-custom-components)
- [Langflow Component Reference](https://docs.langflow.org/components-reference)
- [Lucide Icons](https://lucide.dev/icons/) (for icon names)
