# Example Mission: L010 - Build Your First Agent (Canvas Mode)

> **Type**: Skill Sprint
> **Difficulty**: Beginner
> **Time**: 20 minutes
> **Canvas Mode**: Yes

## Mission Definition

```python
{
    "id": "L010",
    "name": "Build Your First Agent",
    "description": "Learn to build an AI agent directly on the canvas. See how components connect and data flows.",
    "category": "skill_sprint",
    "difficulty": "beginner",
    "estimated_minutes": 20,
    "icon": "bot",
    "sort_order": 10,
    "canvas_mode": True,
    "template_id": "agent_base",
    "component_pack": {
        "allowed_components": ["ChatInput", "ChatOutput", "Agent"],
        "allowed_categories": ["input & output", "models & agents"],
        "validation_rules": {
            "require_chat_input": True,
            "require_chat_output": True,
            "max_nodes": 5,
        },
    },
    "steps": [
        {
            "id": 1,
            "title": "Explore the Canvas",
            "description": "Look at the three components on the canvas: Chat Input (where messages come in), Agent (the AI brain), and Chat Output (where replies go).",
            "type": "info",
        },
        {
            "id": 2,
            "title": "Click the Agent",
            "description": "Click on the Agent component (the one in the middle). This is where you configure your AI's behavior.",
            "type": "action",
            "validation": {"node_type": "Agent"},
        },
        {
            "id": 3,
            "title": "Set Agent Instructions",
            "description": "In the Agent's 'Agent Instructions' field, write what you want your agent to do. For example: 'You are a helpful assistant that answers questions clearly and concisely.'",
            "type": "action",
        },
        {
            "id": 4,
            "title": "Test Your Agent",
            "description": "Click the Play button in the toolbar to run your flow, then send a message to test your agent.",
            "type": "action",
        },
    ],
    "prerequisites": ["L001"],
    "outcomes": [
        "Understand flow-based AI building",
        "Configure an Agent component",
        "Test flows in the canvas",
    ],
}
```

## Analysis

### Canvas Mode Features

This mission demonstrates:

1. **template_id**: Starts from "agent_base" template
2. **component_pack**: Restricts visible components
3. **validation**: Step 2 can auto-validate when Agent is clicked

### Component Pack Breakdown

```python
"component_pack": {
    # Only these specific components are visible
    "allowed_components": ["ChatInput", "ChatOutput", "Agent"],

    # These categories are shown in sidebar
    "allowed_categories": ["input & output", "models & agents"],

    # Validation rules for the flow
    "validation_rules": {
        "require_chat_input": True,   # Must have input
        "require_chat_output": True,  # Must have output
        "max_nodes": 5,               # Prevent complexity
    },
}
```

### Step Pattern Used

- Step 1: **Explore/Info** - Orientation, look around
- Step 2: **Interact** - Click something (with validation)
- Step 3: **Configure** - Modify settings
- Step 4: **Test** - Run and verify

### What's Hidden from User

By restricting to only 3 components and 2 categories, we hide:
- All tool-related components
- RAG and vector store components
- Memory components
- Processing components
- All advanced features

This creates a **focused learning environment** where the user can't get overwhelmed or lost.

### Auto-Validation

Step 2 has validation:
```python
"validation": {"node_type": "Agent"}
```

This means when the user clicks the Agent node, the canvas sends an event:
```javascript
{
  source: 'langflow-overlay',
  event: {
    type: 'node_selected',
    node_type: 'Agent'
  }
}
```

The backend checks if this matches the current step's validation rule and auto-completes the step if it does.

### Why Canvas Mode Works Here

1. **Visual learning**: User sees data flow
2. **Limited scope**: Only 3 nodes to understand
3. **Hands-on**: Click, configure, test - active learning
4. **Foundation**: Introduces canvas without overwhelm
