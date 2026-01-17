# Example Mission: L016 - Memory Basics (Skill Sprint)

> **Type**: Skill Sprint
> **Difficulty**: Beginner
> **Time**: 15 minutes
> **Canvas Mode**: Yes
> **Spiral Position**: 1 (first in a new 3-lesson cycle)
> **Created Using**: /mission-builder skill

## Mission Definition

```python
{
    "id": "L016-memory-basics",
    "name": "Memory Basics",
    "description": "Give your agent the ability to remember conversations. Learn how memory makes interactions feel more natural.",
    "category": "skill_sprint",
    "difficulty": "beginner",
    "estimated_minutes": 15,
    "icon": "brain",
    "sort_order": 16,
    "canvas_mode": True,
    "template_id": "agent_base",
    "component_pack": {
        "allowed_components": ["ChatInput", "ChatOutput", "Agent", "Memory Kit"],
        "allowed_categories": ["input & output", "models & agents", "custom"],
        "hidden_categories": ["tools", "data sources", "processing"],
        "course_components": ["Memory Kit"],
        "validation_rules": {
            "require_chat_input": True,
            "require_chat_output": True,
            "max_nodes": 5,
        },
    },
    "steps": [
        {
            "id": 1,
            "title": "Meet the Memory Kit",
            "description": "Look at the Memory Kit component in the sidebar. This gives your agent the ability to remember previous messages - like teaching a dog to recognize familiar faces!",
            "type": "info",
            "phase": "works",
        },
        {
            "id": 2,
            "title": "Add Memory to Your Agent",
            "description": "Drag the Memory Kit onto the canvas and connect its output to the Agent's memory input. Now your agent can remember what you talked about!",
            "type": "action",
            "phase": "works",
            "validation": {
                "auto": True,
                "event_type": "edge_created",
                "source_type": "MemoryKit",
                "target_type": "Agent",
            },
        },
        {
            "id": 3,
            "title": "Test the Memory",
            "description": "Run the flow and tell your agent your name. Then ask 'What's my name?' in a new message. Your agent should remember!",
            "type": "action",
            "phase": "reliable",
        },
        {
            "id": 4,
            "title": "Try a Longer Conversation",
            "description": "Have a 5-message conversation about a topic. Ask your agent to summarize what you discussed. See how memory makes the conversation flow naturally!",
            "type": "action",
            "phase": "reliable",
        },
    ],
    "prerequisites": ["L010-build-first-agent"],
    "outcomes": [
        "Add memory to agents using the Memory Kit",
        "Understand how memory improves conversations",
        "Test memory across multiple messages",
    ],
}
```

## Analysis

### Skill Sprint Characteristics

This mission follows Skill Sprint patterns:
- **10-15 minutes** estimated time
- **3-4 steps** (we have 4)
- **1-2 new concepts**: Memory basics only
- **Small, focused outcome**: Agent can remember conversations

### Step Pattern Breakdown

| Step | Pattern | Purpose |
|------|---------|---------|
| 1 | Explore (info) | Orient to Memory Kit component |
| 2 | Connect (action) | Wire Memory Kit to Agent |
| 3 | Test (action) | Basic memory verification |
| 4 | Test (action) | Extended memory verification |

### Dog Trainer Language

Notice the friendly language:
- "Like teaching a dog to recognize familiar faces" (memory metaphor)
- "Your agent can remember" (not "conversation buffer stores messages")
- "Memory makes the conversation flow naturally" (benefit-focused)

### Component Pack Strategy

- **allowed_components**: Only what's needed (ChatInput, ChatOutput, Agent, Memory Kit)
- **course_components**: Memory Kit (our custom simplified component)
- **hidden_categories**: Everything except what's needed for this lesson

### Validation Notes

Auto-validation on Step 2:
- Detects when user connects Memory Kit → Agent
- Automatically marks step complete
- Reduces manual "Mark Complete" clicks

### Spiral Position

This is position 1 in a potential spiral:
- L016: Memory Basics (introduces memory concept)
- L017: Memory Styles (introduces long-term vs short-term)
- L018: Personal Journal Agent (applied build using both)

## Validation Result

Running `python validate_mission.py` on this mission:

```
✅ Mission is valid!
```
