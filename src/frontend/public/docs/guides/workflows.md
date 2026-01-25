# Understanding Workflows

Workflows are the visual representation of how Charlie thinks. As you become more advanced, you can unlock the workflow canvas to customize and extend your agent's capabilities.

## What Is a Workflow?

A workflow is a diagram showing how information flows through your agent:

```
User Message → Process Input → Search Knowledge → Generate Response → Send Reply
```

Think of it like a flowchart for Charlie's brain!

## The 4 Disclosure Levels

Teach Charlie AI progressively reveals complexity as you learn:

### Level 0: Hidden
**For:** Complete beginners

The workflow canvas is hidden. You only interact through the Q&A wizard and Playground. This keeps things simple while you learn the basics.

### Level 1: View Only
**For:** Curious learners

You can see the workflow canvas but can't edit it. Great for understanding how your agent works "under the hood."

### Level 2: Simple Editing
**For:** Intermediate users

You can make basic edits:
- Adjust node settings
- Enable/disable components
- Modify connections

### Level 3: Full Access
**For:** Advanced users

Complete access to the Langflow canvas:
- Add new nodes
- Create custom flows
- Build complex logic
- Import/export workflows

## The Workflow Canvas

When you open the canvas, you'll see:

### Nodes
Boxes representing different functions:

| Node Type | Purpose | Example |
|-----------|---------|---------|
| Input | Receives user messages | Chat Input |
| Agent | The AI brain | Claude Agent |
| Knowledge | Information retrieval | Vector Store |
| Tools | Actions to perform | Web Search |
| Output | Sends responses | Chat Output |

### Connections (Edges)
Lines connecting nodes show data flow:
- **Input → Agent**: User message goes to AI
- **Knowledge → Agent**: Retrieved info supplements AI
- **Agent → Output**: AI response sent to user

### Node Settings
Click any node to configure it:
- Name and description
- Model settings (for AI nodes)
- Parameters and options

## Common Workflow Patterns

### Basic Q&A Agent
```
Chat Input → Agent → Chat Output
```
Simple agent that responds to messages.

### Knowledge-Enhanced Agent
```
Chat Input → Agent → Chat Output
              ↑
        Vector Store (Knowledge)
```
Agent searches knowledge base before responding.

### Multi-Tool Agent
```
                  ↗ Web Search
Chat Input → Agent → Calendar
                  ↘ Email Send
              ↓
        Chat Output
```
Agent can use multiple tools based on the conversation.

### Conditional Flow
```
Chat Input → Router → Agent A (support questions)
                   → Agent B (sales questions)
              ↓
        Chat Output
```
Different agents handle different types of queries.

## Unlocking the Canvas

### For Existing Agents
1. Go to your agent's settings
2. Find **"Canvas Access"** or **"Disclosure Level"**
3. Select your desired level
4. Save changes

### Through Missions
Complete learning missions to unlock progressively higher access levels. This ensures you understand the basics before diving into advanced features.

## Working with Nodes

### Adding Nodes (Level 3)
1. Open the canvas
2. Click the **"+"** button or drag from the component sidebar
3. Select the node type
4. Position it on the canvas
5. Connect to other nodes

### Configuring Nodes
1. Click a node to select it
2. The settings panel opens on the right
3. Adjust parameters
4. Changes auto-save

### Connecting Nodes
1. Click the output port (right side) of a node
2. Drag to the input port (left side) of another node
3. Release to create the connection

### Deleting Connections
1. Click on a connection line
2. Press Delete or click the trash icon

## Langflow Integration

Teach Charlie AI is built on [Langflow](https://langflow.org/), an open-source visual framework for building AI applications.

### What This Means for You
- **Extensive components**: Access to 100+ pre-built nodes
- **Community templates**: Import workflows others have built
- **Export flexibility**: Take your workflows anywhere
- **Continuous updates**: New features from the Langflow community

### Langflow Components We Use
- **Anthropic Claude**: Our primary AI model
- **Chroma Vector Store**: Knowledge storage and retrieval
- **Memory Components**: Conversation history management
- **Tool Components**: External integrations

## Best Practices

### Start Simple
Don't try to build a complex workflow immediately. Start with the basics:
1. Get a simple agent working
2. Add one feature at a time
3. Test after each addition

### Use Templates
When you unlock Level 3, browse our templates:
- Customer Support Agent
- Sales Assistant
- Knowledge Base Bot
- Research Helper

### Keep Flows Clean
- Use descriptive names for nodes
- Organize nodes in a logical flow (left to right, top to bottom)
- Delete unused nodes and connections

### Test Frequently
After every canvas change:
1. Save the workflow
2. Test in the Playground
3. Verify the changes work as expected

## Troubleshooting Canvas Issues

### Nodes Won't Connect
**Cause:** Incompatible input/output types.
**Solution:** Check that the output type matches what the receiving node expects.

### Flow Doesn't Work After Editing
**Cause:** Broken connections or misconfigured nodes.
**Solution:** Check for red error indicators on nodes. Review all connections.

### Canvas Is Slow
**Cause:** Too many nodes or complex workflows.
**Solution:** Simplify the flow. Consider breaking into multiple workflows.

## What's Next?

Now that you understand workflows, you can:

- [Publish Your Agent](/resources/guides/publishing) as a reusable component
- [Embed on Your Website](/resources/guides/embedding) to go live
- [Connect Tools](/resources/guides/mcp-servers) for more capabilities

---

Ready to share your trained Charlie? Learn about [Publishing Your Agent](/resources/guides/publishing)!
