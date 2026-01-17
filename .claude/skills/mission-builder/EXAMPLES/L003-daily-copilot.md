# Example Mission: L003 - Daily Co-Pilot (Applied Build)

> **Type**: Applied Build
> **Difficulty**: Beginner
> **Time**: 45 minutes
> **Canvas Mode**: No (Q&A Wizard)
> **Spiral Position**: 3 (third in a 3-lesson cycle)

## Mission Definition

```python
{
    "id": "L003",
    "name": "Daily Co-Pilot",
    "description": "Create a personal assistant agent that helps with your daily tasks.",
    "category": "applied_build",
    "difficulty": "beginner",
    "estimated_minutes": 45,
    "icon": "calendar",
    "sort_order": 3,
    "steps": [
        {
            "id": 1,
            "title": "Define Your Needs",
            "description": "List 3-5 tasks you do regularly that an AI could help with.",
            "type": "info"
        },
        {
            "id": 2,
            "title": "Create the Agent",
            "description": "Build an agent with a helpful assistant personality.",
            "type": "action"
        },
        {
            "id": 3,
            "title": "Train on Your Tasks",
            "description": "Add specific instructions for each task type.",
            "type": "action"
        },
        {
            "id": 4,
            "title": "Create a Workflow",
            "description": "Turn your agent into a workflow for easier access.",
            "type": "action"
        },
        {
            "id": 5,
            "title": "Daily Test Run",
            "description": "Use your co-pilot for one full day of tasks.",
            "type": "action"
        },
    ],
    "prerequisites": ["L001"],
    "outcomes": [
        "Build a personalized assistant",
        "Create workflows from agents"
    ],
}
```

## Analysis

### Applied Build Characteristics

This is an **Applied Build** mission, which differs from Skill Sprints:

| Aspect | Skill Sprint | Applied Build |
|--------|--------------|---------------|
| Time | 10-15 min | 30-45 min |
| Steps | 3-4 | 5-6 |
| Output | Learning exercise | Usable artifact |
| Focus | One concept | Combining concepts |

### The "Ship Something Useful" Pattern

Applied Builds follow the pattern:
1. **Plan** - What do you want to build? (Step 1)
2. **Build** - Create the core thing (Steps 2-3)
3. **Enhance** - Add features/polish (Step 4)
4. **Use** - Actually use it for real (Step 5)

### Step Pattern Analysis

- Step 1: **Planning/Info** - Personalization, user thinks about their needs
- Step 2: **Core Build** - Create the main artifact
- Step 3: **Customize** - Make it personal/specific
- Step 4: **Productize** - Turn into reusable workflow
- Step 5: **Real Usage** - Extended testing in real life

### Personal Value

This mission creates something **personally useful**:
- Not a tutorial exercise
- Actually helps with daily tasks
- Motivation to complete and maintain

### Prerequisites Strategy

Only requires L001 (Hello Flow):
- User knows how to create agents
- User knows how to use playground
- No tool knowledge required (yet)

This keeps it accessible while building on foundation.

### 5 Steps is Appropriate Because

- Applied builds take longer
- More complex outcome
- Includes planning AND usage phases
- Still fits in ~45 minutes

### Missing Canvas Mode - Why?

This mission uses Q&A wizard because:
- Focus is on the **agent content**, not the flow structure
- User personalizes the assistant's knowledge
- No need to understand components yet
- Canvas would add complexity without value here

Later missions (L010+) introduce canvas when flow structure matters.
