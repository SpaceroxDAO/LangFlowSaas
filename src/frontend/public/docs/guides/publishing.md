# Publishing Your Agent

Once you've trained Charlie to perfection, you can publish them as a reusable component. This lets you use the same agent across multiple workflows or share it with your team.

## What Is Publishing?

Publishing transforms your agent into a custom Langflow component that appears in the sidebar. Think of it like saving a recipe you can use over and over again!

**Before publishing:**
- Agent exists only in your project
- Changes affect only that instance
- Can't be reused elsewhere

**After publishing:**
- Agent becomes a reusable component
- Appears in your Langflow sidebar
- Can be added to any workflow
- Shareable with team members

## How to Publish

### Step 1: Verify Your Agent
Before publishing, make sure:

✅ Agent works correctly in the Playground
✅ All knowledge sources are properly loaded
✅ Tools and actions are configured
✅ You're happy with the name and description

### Step 2: Open Publishing Options

1. Navigate to your agent
2. Click **"Edit"** to open agent settings
3. Scroll to the **"Publishing"** section
4. Or look for the **"Publish"** button in the toolbar

### Step 3: Configure Publication Settings

| Setting | Description | Example |
|---------|-------------|---------|
| Component Name | How it appears in the sidebar | "Support Agent v2" |
| Category | Where to place it | "Custom Agents" |
| Description | What the component does | "Trained support agent for product questions" |
| Icon | Visual identifier | 🤖 or custom upload |

### Step 4: Publish

1. Click **"Publish Component"**
2. Wait for processing
3. Success! Your agent is now a component

### Step 5: Find Your Component

1. Open any workflow canvas
2. Look in the sidebar under your category
3. Drag your custom component onto the canvas

## Using Published Components

### In Your Own Workflows
Drag your published agent into any workflow like any other node:

```
Chat Input → [Your Published Agent] → Chat Output
```

### Updating Published Components
When you update the original agent:

1. Make your changes
2. Test in the Playground
3. Click **"Republish"** to update the component
4. Existing uses will update automatically

### Versioning
Each publish creates a version. You can:
- View publish history
- Roll back to previous versions
- Keep multiple versions available

## Sharing with Your Team

### Team Plan Features
On the Team plan, published components are shared across your organization:

- All team members see your components
- Permissions control who can edit
- Usage analytics show component popularity

### Export/Import
Share components outside your team:

1. Click **"Export"** on a published component
2. Download the JSON file
3. Share the file
4. Others import via **"Import Component"**

## Best Practices

### Use Descriptive Names
Good: "Support Agent - Billing Questions v2"
Bad: "Agent1" or "Test"

### Write Clear Descriptions
Help others understand what the component does:

```
Customer support agent trained on:
- Product documentation
- FAQ database
- Troubleshooting guides

Best for: First-line support queries
Updates: Monthly knowledge refresh
```

### Version Control
Keep track of changes:
- v1.0 - Initial release
- v1.1 - Added billing knowledge
- v2.0 - Complete rewrite with new model

### Test Before Publishing
Always test thoroughly before publishing. Published components affect all workflows using them!

## Component Settings

### Visibility
- **Private**: Only you can use it
- **Team**: Shared with your organization (Team plan)
- **Public**: Available in the community library (coming soon)

### Permissions
- **Viewer**: Can use but not edit
- **Editor**: Can edit and republish
- **Owner**: Full control including deletion

### Dependencies
Components may depend on:
- Specific knowledge sources
- External tool connections
- API keys and credentials

Ensure all dependencies are available where the component is used.

## Troubleshooting

### Component Not Appearing in Sidebar
**Causes:**
1. Publishing still processing - wait a moment
2. Wrong category selected - check component settings
3. Cache issue - refresh the page

### "Dependency Missing" Error
**Cause:** Component requires something not set up in the current project.
**Solution:** Check component dependencies and add missing items.

### Republish Fails
**Causes:**
1. Original agent was deleted
2. Permissions changed
3. Conflicting changes

**Solution:** Try publishing as a new component instead.

## Advanced: Component Customization

### Exposing Parameters
Let users customize your component without editing:

1. In the agent settings, mark fields as "Exposable"
2. These appear as configurable options when the component is used
3. Example: Expose "greeting message" so each use can customize it

### Input/Output Configuration
Define what goes in and out of your component:

- **Inputs**: Chat message, context, metadata
- **Outputs**: Response, tool results, status

### Documentation
Add inline documentation visible when hovering over your component:

```markdown
## Usage
Drag into any workflow and connect to Chat Input/Output.

## Required
- Anthropic API key in environment

## Optional
- Custom greeting (default: "Hello!")
```

---

Ready to put Charlie on your website? Learn about [Embedding on Your Website](/resources/guides/embedding)!
