# Educational Principles Guide

> How to write missions that teach effectively using the "Dog Trainer" metaphor

---

## Core Philosophy

> "We're not innovating on Langflow - we're packaging it brilliantly for a market that's desperate to learn."

The mission system exists to make AI agent building **accessible to non-technical users**. Every design decision should reduce cognitive load and increase confidence.

---

## The Dog Trainer Metaphor

Teach Charlie AI uses a "dog trainer" metaphor throughout. This makes AI concepts approachable:

| Technical Term | Dog Trainer Translation |
|----------------|------------------------|
| System Prompt | Charlie's Job Description |
| Temperature | Creativity |
| Agent | Charlie (or the agent's name) |
| Tools | Tricks |
| RAG / Knowledge | Reference Library |
| Workflow | Routine |
| API | Commands |
| Token Limit | Attention Span |

### Examples

**Instead of:**
> "Configure the system prompt with instructions for the LLM."

**Write:**
> "Tell Charlie what his job is. What should he help with? What's his personality?"

**Instead of:**
> "Add tools to extend the agent's capabilities."

**Write:**
> "Teach Charlie a new trick! Pick a tool that gives him new abilities."

---

## The Two-Concept Rule

### Rule
Each Skill Sprint introduces **maximum 2 new concepts**.

### Why
- Cognitive load theory: Working memory holds ~4 items
- New concepts need repetition to stick
- Users need to feel successful, not overwhelmed

### How to Count Concepts

**One concept:**
- Using the Q&A wizard
- Connecting two components
- Using the playground
- Saving as a workflow

**Multiple concepts (avoid combining in one sprint):**
- RAG + Vector stores + Embedding models (3 concepts!)
- Tools + MCP + API keys (3 concepts!)
- Routing + Multiple agents + Handoff (3 concepts!)

### Example: Breaking Down RAG

Instead of one mission teaching all of RAG:

```
L007: Upload a document, ask questions (RAG basics)
L008: Improve answer quality, add citations (RAG refinement)
L009: Build personal second brain (Applied: combine both)
```

---

## Progressive Disclosure

### Principle
Show only what's needed for the current task. Hide advanced features.

### In Missions
Use `component_pack` to hide components:

```python
"component_pack": {
    "allowed_components": ["ChatInput", "ChatOutput", "Agent"],
    "hidden_categories": ["tools", "memories", "processing"],
}
```

### In Steps
Start simple, add complexity:

```python
# Step 1: Basic (everyone does this)
# Step 2: Customize (most people do this)
# Step 3: Advanced (optional challenge)
```

### In Language
Avoid jargon until user has context:

```
Lesson 1: "Save your work" (not "persist to database")
Lesson 10: "Your agent saves to the database"
Lesson 20: "Configure database persistence options"
```

---

## The Celebration Pattern

### Why Celebrate
- Dopamine reinforcement
- Builds confidence
- Marks progress
- Motivation to continue

### When to Celebrate
- Completing a mission
- First successful test
- Shipping something
- Unlocking new capability

### How to Celebrate

**In Step Descriptions:**
```python
{
    "title": "Test Your Agent",
    "description": "...Your agent should respond! Congratulations - you just built your first AI assistant.",
}
```

**In Outcomes:**
```python
"outcomes": [
    "You can now create agents using Q&A!",
    "You understand agent personalities!",
]
```

**In Mission Complete UI:**
- Show confetti or animation
- Display achievements unlocked
- Suggest next mission

---

## Friendly Error Language

### Principle
Errors should guide, not blame.

### Examples

| Technical Error | Friendly Message |
|-----------------|------------------|
| "ValidationError: field required" | "Charlie needs a job! Tell us what Charlie should do." |
| "API key invalid" | "Hmm, that key didn't work. Double-check it at openai.com." |
| "Connection failed" | "Can't reach the server. Check your internet and try again." |
| "Rate limit exceeded" | "Whoa, slow down! Take a breather and try again in a minute." |

### In Mission Steps

**Instead of:**
> "If this fails, check the console for errors and verify your configuration."

**Write:**
> "Not working? Make sure you filled in all the fields. Try clicking 'Test' again."

---

## Writing Step Descriptions

### The Formula

```
[What to do] + [Where to do it] + [Why/What happens]
```

### Good Examples

```
"Click the Agent component (the middle box). This is where you tell your agent how to behave."

"Type a message in the chat box and press Enter. Your agent will respond using the instructions you gave it."

"Drag from the blue dot on Chat Input to the Agent. This connects them so messages flow through."
```

### Bad Examples

```
"Configure the component."  # Too vague
"Click Agent."  # Missing context
"Set the system prompt parameter."  # Too technical
```

---

## The Spiral Learning Pattern

### Pattern
Every 3 lessons follow this cycle:

1. **Skill Sprint 1**: Learn concept A (tiny, instant success)
2. **Skill Sprint 2**: Learn concept B (still small)
3. **Applied Build**: Ship something using A + B (personally useful)

### Why It Works
- Concepts introduced separately (low load)
- Applied build reinforces both
- User ships something useful (motivation)
- Pattern repeats (predictable)

### Example Cycle

```
L001: Create agent with Q&A (concept: agents)
L002: Build FAQ bot (concept: knowledge)
L003: Build Daily Co-Pilot (applied: agent + knowledge = useful assistant)
```

---

## The Value Ladder

### Principle
Start with personal value, expand to business value.

### Stages

| Stage | Focus | Example Missions |
|-------|-------|------------------|
| 1 | Personal quick wins | Email summary, daily planner |
| 2 | Personal knowledge | Second brain, notes search |
| 3 | Creator/Prosumer | Content pipeline, lead capture |
| 4 | Business systems | Support triage, CRM integration |

### Why This Order
1. Personal value = immediate motivation
2. Low stakes = safe to experiment
3. Builds confidence before complexity
4. Business value builds on personal skills

---

## Inclusive Language

### Use "You" Not "Users"

**Write:** "You can now create agents..."
**Not:** "Users can create agents..."

### Avoid Assumptions

**Write:** "If you have a Google account, you can connect it."
**Not:** "Connect your Google account." (assumes they have one)

### Be Encouraging

**Write:** "Don't worry if this takes a few tries - that's normal!"
**Not:** "This should be straightforward."

### Avoid Gendered Language

**Write:** "The agent responds to the user's question."
**Not:** "The agent responds to his question."

---

## Testing Educational Quality

### Checklist for Each Mission

- [ ] **Two-concept max**: Does this sprint introduce more than 2 new ideas?
- [ ] **Dog trainer language**: Is technical jargon translated?
- [ ] **Clear success**: Will user know when they've succeeded?
- [ ] **Celebration moment**: Is there a "you did it!" moment?
- [ ] **Progressive disclosure**: Are advanced features hidden?
- [ ] **Error guidance**: Are failure states handled kindly?
- [ ] **Personal value**: Does user get something useful?

### Red Flags

- Step says "configure" without saying what or where
- Multiple technical terms in one sentence
- No test/verification step
- No celebration/outcome
- Assumes knowledge not yet taught
- Uses acronyms without explanation

---

## Quick Reference: Translation Table

| Say This | Not This |
|----------|----------|
| "Your agent" or "Charlie" | "The LLM" |
| "creativity slider" | "temperature parameter" |
| "job description" | "system prompt" |
| "tricks" or "abilities" | "tools" or "functions" |
| "reference library" | "vector store" or "RAG" |
| "connect" | "configure edges" |
| "test it" | "execute the flow" |
| "save your work" | "persist state" |
| "Click the blue dot" | "Connect the output handle" |
