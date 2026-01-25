# Langflow Integration

Teach Charlie AI is built on [Langflow](https://langflow.org/), an open-source visual framework for building AI applications. This document explains how we integrate with Langflow and how you can leverage its full power.

## What is Langflow?

Langflow is a low-code tool for building AI workflows using a visual node-based editor. It supports:

- Multiple LLM providers (OpenAI, Anthropic, etc.)
- Vector stores for RAG
- Conversation memory
- Tool/function calling
- Custom Python components

## Integration Architecture

```
┌─────────────────────────────────────────────┐
│           Teach Charlie AI                   │
│  ┌───────────────────────────────────────┐  │
│  │        Custom Layer                    │  │
│  │  • Q&A Wizard                          │  │
│  │  • Playground                          │  │
│  │  • Template Mapping                    │  │
│  └───────────────────────────────────────┘  │
│                     │                        │
│                     ▼                        │
│  ┌───────────────────────────────────────┐  │
│  │        Langflow (Engine)               │  │
│  │  • Flow Execution                      │  │
│  │  • Node Graph                          │  │
│  │  • LLM Integration                     │  │
│  │  • Memory Management                   │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## How We Use Langflow

### 1. Flow Execution

When you chat with an agent, we:

1. Load the agent's Langflow flow
2. Inject the user message
3. Execute the flow via Langflow's API
4. Stream the response back

```python
# Simplified flow execution
response = await langflow_client.run_flow(
    flow_id=agent.flow_id,
    input_value=user_message,
    tweaks={
        "ChatInput": {"input_value": user_message},
        "Memory": {"session_id": conversation_id}
    }
)
```

### 2. Template Mapping

The Q&A wizard maps to Langflow flows:

| Q&A Answer | Langflow Component |
|------------|-------------------|
| "Who is Charlie" | System Prompt in Agent |
| "Rules" | Additional system context |
| "Tricks" | Tool/Action nodes |

### 3. Canvas Display

The workflow canvas is Langflow's editor embedded via iframe:

```html
<iframe
  src="${LANGFLOW_URL}/flow/${flowId}"
  title="Langflow Canvas"
/>
```

## Langflow API

### Base URL

```
Internal: http://langflow:7860 (Docker network)
External: http://localhost:7860 (Development)
```

### Key Endpoints

#### List Flows

```http
GET /api/v1/flows
```

#### Get Flow

```http
GET /api/v1/flows/{flow_id}
```

#### Create Flow

```http
POST /api/v1/flows
Content-Type: application/json

{
  "name": "My Flow",
  "description": "...",
  "data": { /* flow JSON */ }
}
```

#### Run Flow

```http
POST /api/v1/run/{flow_id}
Content-Type: application/json

{
  "input_value": "Hello",
  "input_type": "chat",
  "output_type": "chat",
  "tweaks": {}
}
```

#### Stream Flow (WebSocket)

```javascript
const ws = new WebSocket(`ws://langflow:7860/api/v1/run/${flowId}/stream`);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Token:', data.token);
};
```

## Flow Structure

A Langflow flow is a JSON document describing nodes and connections:

```json
{
  "id": "flow-uuid",
  "name": "Support Agent",
  "data": {
    "nodes": [
      {
        "id": "ChatInput-1",
        "type": "ChatInput",
        "position": {"x": 100, "y": 100},
        "data": {
          "input_value": ""
        }
      },
      {
        "id": "Agent-1",
        "type": "AnthropicAgent",
        "position": {"x": 400, "y": 100},
        "data": {
          "system_prompt": "You are a helpful assistant...",
          "temperature": 0.7
        }
      },
      {
        "id": "ChatOutput-1",
        "type": "ChatOutput",
        "position": {"x": 700, "y": 100}
      }
    ],
    "edges": [
      {
        "source": "ChatInput-1",
        "target": "Agent-1"
      },
      {
        "source": "Agent-1",
        "target": "ChatOutput-1"
      }
    ]
  }
}
```

## Key Components

### LLM Agents

We use Anthropic Claude as the primary model:

```json
{
  "type": "AnthropicAgent",
  "data": {
    "model": "claude-3-sonnet-20240229",
    "temperature": 0.7,
    "max_tokens": 4096,
    "system_prompt": "..."
  }
}
```

### Memory

Conversation memory persists context:

```json
{
  "type": "ConversationBufferMemory",
  "data": {
    "session_id": "conversation-uuid",
    "memory_key": "chat_history",
    "return_messages": true
  }
}
```

### Vector Stores (RAG)

For knowledge retrieval:

```json
{
  "type": "ChromaDB",
  "data": {
    "collection_name": "agent-knowledge",
    "persist_directory": "/data/chroma"
  }
}
```

### Tools

Function calling for actions:

```json
{
  "type": "Tool",
  "data": {
    "name": "search_knowledge",
    "description": "Search the knowledge base",
    "function": "..."
  }
}
```

## Template System

### Available Templates

| Template | Use Case | Components |
|----------|----------|------------|
| `support` | Customer support | Agent + Memory + Knowledge |
| `sales` | Sales assistant | Agent + Memory + CRM tools |
| `research` | Research helper | Agent + Web search + Memory |
| `custom` | Blank slate | Minimal setup |

### Template Mapping Logic

```python
def create_flow_from_qa(qa_answers: dict) -> dict:
    # Select base template
    template = select_template(qa_answers["tricks"])

    # Customize system prompt
    template["nodes"]["Agent"]["data"]["system_prompt"] = (
        f"{qa_answers['who']}\n\n"
        f"Rules:\n{qa_answers['rules']}"
    )

    # Add requested tools
    for trick in qa_answers["tricks"]:
        add_tool_node(template, trick)

    return template
```

## Tweaks System

Modify flow behavior at runtime without editing:

```python
# Change model temperature for a specific run
tweaks = {
    "Agent-1": {
        "temperature": 0.3  # More deterministic
    }
}

response = await langflow.run_flow(flow_id, tweaks=tweaks)
```

Common tweaks:

| Component | Parameter | Use Case |
|-----------|-----------|----------|
| Agent | temperature | Adjust creativity |
| Agent | max_tokens | Limit response length |
| Memory | session_id | Different conversations |
| VectorStore | top_k | Retrieval count |

## Development

### Local Langflow

```bash
# Start Langflow in Docker
docker compose up langflow

# Access at http://localhost:7860
```

### Environment Variables

```env
LANGFLOW_API_URL=http://langflow:7860
LANGFLOW_DATABASE_URL=postgresql://...
LANGFLOW_SECRET_KEY=your-secret-key
```

### Debugging Flows

1. Open Langflow at `:7860`
2. Import your flow
3. Use the playground to test
4. Check component outputs
5. View execution logs

## Advanced Usage

### Custom Nodes

Add custom functionality:

```python
# See Custom Components documentation
from langflow.custom import CustomComponent
```

### Subflows

Nest flows within flows:

```json
{
  "type": "SubFlow",
  "data": {
    "flow_id": "another-flow-uuid"
  }
}
```

### Conditional Routing

Route based on input:

```json
{
  "type": "ConditionalRouter",
  "data": {
    "conditions": [
      {"pattern": "billing", "target": "BillingAgent"},
      {"pattern": "technical", "target": "TechAgent"}
    ],
    "default": "GeneralAgent"
  }
}
```

## Best Practices

### 1. Keep Flows Simple

- Fewer nodes = easier debugging
- Split complex logic into subflows
- Use clear naming conventions

### 2. Memory Management

- Always set session IDs
- Clear memory for new conversations
- Limit memory size for long chats

### 3. Error Handling

- Add fallback routes
- Log component failures
- Graceful degradation

### 4. Performance

- Cache vector store connections
- Use streaming for long responses
- Optimize retrieval parameters

## Troubleshooting

### Flow Not Executing

1. Check Langflow container is running
2. Verify flow ID exists
3. Check component configurations
4. Review Langflow logs

### Memory Not Persisting

1. Verify session_id is consistent
2. Check memory component is connected
3. Confirm database is accessible

### Slow Responses

1. Reduce max_tokens
2. Optimize vector search (lower top_k)
3. Check network latency to LLM provider

---

For more on extending Langflow: [Custom Components](/resources/developers/custom-components).
