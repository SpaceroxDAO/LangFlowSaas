# Step Patterns Reference

> Common step patterns for consistent mission design

---

## The 5 Core Step Patterns

Every mission step falls into one of these patterns:

| Pattern | Type | Purpose | When to Use |
|---------|------|---------|-------------|
| **Explore** | info | Orient the user | First step, new screens |
| **Configure** | action | Change settings | Filling forms, adjusting values |
| **Connect** | action | Wire components | Canvas mode, linking nodes |
| **Test** | action | Verify it works | After building something |
| **Ship** | action | Deploy/export | Final steps, productizing |

---

## Pattern 1: Explore (Info)

### Purpose
Orient the user to a new environment or concept.

### Characteristics
- Type: `info`
- No validation needed
- User reads/observes
- Sets context for following steps

### Template
```python
{
    "id": 1,
    "title": "Explore the [Environment]",
    "description": "Look at [what to observe]. Notice [key elements].",
    "type": "info",
    "phase": "works",
}
```

### Examples

**Canvas Introduction**
```python
{
    "id": 1,
    "title": "Explore the Canvas",
    "description": "Look at the three components on the canvas: Chat Input (where messages come in), Agent (the AI brain), and Chat Output (where replies go).",
    "type": "info",
}
```

**Concept Introduction**
```python
{
    "id": 1,
    "title": "What is RAG?",
    "description": "RAG (Retrieval Augmented Generation) lets your agent answer questions using your documents. Think of it as giving your agent a reference library.",
    "type": "info",
}
```

**Planning Step**
```python
{
    "id": 1,
    "title": "Define Your Needs",
    "description": "List 3-5 tasks you do regularly that an AI could help with. Think about emails, scheduling, research, or writing.",
    "type": "info",
}
```

---

## Pattern 2: Configure (Action)

### Purpose
Have user modify settings, fill forms, or adjust values.

### Characteristics
- Type: `action`
- Often has validation
- Specific field/setting mentioned
- Clear success criteria

### Template
```python
{
    "id": 2,
    "title": "[Action] the [Thing]",
    "description": "In the [location], [specific instruction]. For example: '[example value]'",
    "type": "action",
    "phase": "works",
    "validation": {
        "auto": True,
        "event_type": "node_configured",
        "node_type": "[ComponentType]",
        "field_name": "[field]",
    },
}
```

### Examples

**Agent Instructions**
```python
{
    "id": 3,
    "title": "Set Agent Instructions",
    "description": "In the Agent's 'Agent Instructions' field, write what you want your agent to do. For example: 'You are a helpful assistant that answers questions clearly and concisely.'",
    "type": "action",
    "validation": {
        "auto": True,
        "event_type": "node_configured",
        "node_type": "Agent",
        "field_name": "agent_instructions",
    },
}
```

**API Key Setup**
```python
{
    "id": 2,
    "title": "Add Your API Key",
    "description": "Click the Keys & Connections Wizard and enter your OpenAI API key. You can find this at platform.openai.com.",
    "type": "action",
}
```

**Template Customization**
```python
{
    "id": 2,
    "title": "Customize the Prompt",
    "description": "Edit the prompt template to include a {user_name} variable. This will let you personalize responses.",
    "type": "action",
}
```

---

## Pattern 3: Connect (Action)

### Purpose
Wire components together, create data flow.

### Characteristics
- Type: `action`
- Canvas mode only
- Describes source → target
- Often visual instruction

### Template
```python
{
    "id": 3,
    "title": "Connect [Source] to [Target]",
    "description": "Drag from the [output handle] on [Source] to the [input handle] on [Target]. This lets [what data flows].",
    "type": "action",
    "phase": "works",
    "validation": {
        "auto": True,
        "event_type": "edge_created",
        "source_type": "[SourceComponent]",
        "target_type": "[TargetComponent]",
    },
}
```

### Examples

**Basic Connection**
```python
{
    "id": 3,
    "title": "Connect Input to Agent",
    "description": "Drag from the blue output handle on Chat Input to the input on Agent. This sends user messages to your agent.",
    "type": "action",
    "validation": {
        "auto": True,
        "event_type": "edge_created",
        "source_type": "ChatInput",
        "target_type": "Agent",
    },
}
```

**RAG Connection**
```python
{
    "id": 4,
    "title": "Connect Knowledge to Agent",
    "description": "Connect the RAG Kit output to the Agent's 'context' input. Now your agent can access your documents.",
    "type": "action",
}
```

---

## Pattern 4: Test (Action)

### Purpose
Verify the built thing works correctly.

### Characteristics
- Type: `action`
- Specific test to perform
- Expected outcome described
- Often involves playground

### Template
```python
{
    "id": 4,
    "title": "Test [What]",
    "description": "[How to test]. You should see [expected result].",
    "type": "action",
    "phase": "reliable",
}
```

### Examples

**Playground Test**
```python
{
    "id": 4,
    "title": "Test Your Agent",
    "description": "Click the Play button in the toolbar to run your flow, then send a message like 'Hello, who are you?' Your agent should respond with its personality.",
    "type": "action",
}
```

**Specific Scenario**
```python
{
    "id": 5,
    "title": "Test Edge Cases",
    "description": "Try these prompts: 'What if I ask something you don't know?' and 'Can you help with [off-topic]?' Your agent should handle both gracefully.",
    "type": "action",
}
```

**RAG Test**
```python
{
    "id": 4,
    "title": "Test Document Retrieval",
    "description": "Ask a question that requires information from your document. Check that the answer includes specific details from your source.",
    "type": "action",
}
```

---

## Pattern 5: Ship (Action)

### Purpose
Deploy, export, or productize the creation.

### Characteristics
- Type: `action`
- Final or near-final step
- Creates lasting artifact
- User takes ownership

### Template
```python
{
    "id": 5,
    "title": "[Deploy/Export/Save] Your [Thing]",
    "description": "[How to ship]. This creates [what artifact] that you can [how to use it].",
    "type": "action",
    "phase": "connected",
}
```

### Examples

**Create Workflow**
```python
{
    "id": 5,
    "title": "Create a Workflow",
    "description": "Click 'Save as Workflow' to turn your agent into a reusable workflow. Give it a clear name like 'Daily Co-Pilot'.",
    "type": "action",
}
```

**Export Template**
```python
{
    "id": 4,
    "title": "Save as Template",
    "description": "Export this flow as a template. You can reuse it as a starting point for similar agents.",
    "type": "action",
}
```

**Embed Widget**
```python
{
    "id": 6,
    "title": "Get Your Embed Code",
    "description": "Open the Ship Pack and copy the embed snippet. You can add this to any webpage to let others use your agent.",
    "type": "action",
}
```

---

## Step Sequences by Mission Type

### Skill Sprint (3-4 steps)

**Pattern A: Learn by Doing**
1. Explore (info) - Orient to the concept
2. Configure (action) - Make one change
3. Test (action) - Verify it works

**Pattern B: Build Small**
1. Explore (info) - See the template
2. Configure (action) - Customize it
3. Connect (action) - Wire components
4. Test (action) - Verify flow

### Applied Build (5-6 steps)

**Pattern: Full Build Cycle**
1. Explore/Plan (info) - Define what to build
2. Configure (action) - Set up core component
3. Configure (action) - Add customization
4. Connect (action) - Wire everything together
5. Test (action) - Verify works correctly
6. Ship (action) - Deploy/export artifact

### Capstone (6-8 steps)

**Pattern: Complex Integration**
1. Plan (info) - Architecture overview
2. Build Core (action) - Main component
3. Add Feature 1 (action)
4. Add Feature 2 (action)
5. Connect Systems (action)
6. Test Happy Path (action)
7. Test Edge Cases (action)
8. Ship & Document (action)

---

## Phase Progression

Steps should progress through phases:

| Phase | Focus | Typical Steps |
|-------|-------|---------------|
| `works` | Happy path | 1-2 (Explore, Configure) |
| `reliable` | Edge cases | 3-4 (Test, Refine) |
| `connected` | Integration | 5-6 (Ship, Deploy) |

```python
# Example progression
{"id": 1, "phase": "works", ...}      # Explore
{"id": 2, "phase": "works", ...}      # Configure
{"id": 3, "phase": "reliable", ...}   # Test
{"id": 4, "phase": "connected", ...}  # Ship
```

---

## Anti-Patterns to Avoid

### Too Vague
```python
# BAD
{"title": "Set it up", "description": "Configure the component."}

# GOOD
{"title": "Set Agent Instructions", "description": "In the Agent's 'Agent Instructions' field, write what you want your agent to do. For example: 'You are a helpful assistant that answers questions clearly.'"}
```

### Too Technical
```python
# BAD
{"description": "Configure the LLM parameters including temperature, top_p, and max_tokens."}

# GOOD
{"description": "Adjust how creative your agent is using the 'Creativity' slider. Higher values mean more creative but less predictable responses."}
```

### Missing Context
```python
# BAD
{"title": "Click Next", "description": "Click the next button."}

# GOOD
{"title": "Save Your Agent", "description": "Click the 'Save' button in the top right. This saves your agent so you can use it later."}
```

### Too Many Concepts
```python
# BAD - Introduces 4 new concepts
{"description": "Configure the RAG pipeline by setting the embedding model, chunk size, overlap, and retrieval strategy."}

# GOOD - One concept at a time
{"description": "Upload your document. The system will automatically prepare it for searching."}
```
