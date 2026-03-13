# Connecting to OpenClaw

OpenClaw is a local AI agent platform that can use your Teach Charlie workflows as tools. When connected, your agent can call your workflows from WhatsApp, Telegram, Slack, and other channels.

## How It Works

Your Teach Charlie workflows become "skills" that OpenClaw can call:

```
You (WhatsApp, Telegram, etc.)
    -> OpenClaw (local AI agent)
    -> TC Connector (MCP bridge)
    -> Teach Charlie API
    -> Your Langflow workflow
    -> Response back to you
```

## Step 1: Publish Your Agent

Before connecting to OpenClaw, you need a published agent with at least one workflow skill.

1. Go to your agent's **Edit** page
2. Click the **Publish Agent** button
3. In the publish modal, select which workflows should be available as skills
4. Click **Publish**

Your agent is now "live" and its skills are available via the MCP bridge.

## Step 2: Get Your MCP Token

The MCP token authenticates the connection between OpenClaw and your Teach Charlie account.

1. Go to **Settings** in the sidebar
2. Find the **OpenClaw Connection** section
3. Click **Generate MCP Token**
4. Copy the token (it starts with `tc_`)

Keep this token secret. Anyone with it can execute your workflows.

## Step 3: Install TC Connector

TC Connector is a small Node.js package that bridges OpenClaw and Teach Charlie. You need Node.js 18 or later installed.

### Option A: Interactive Setup (Recommended)

Run this in your terminal:

```bash
npx tc-connector --setup
```

It will ask for your token, verify it works, and save the config automatically.

### Option B: Download the Installer

After publishing your agent, click **Download Installer** in the publish modal. This gives you a ready-to-run script that installs everything.

### Option C: Manual Configuration

Add this to your OpenClaw `.mcp.json` config:

```json
{
  "mcpServers": {
    "teach-charlie": {
      "command": "npx",
      "args": ["tc-connector", "--token", "tc_YOUR_TOKEN_HERE"]
    }
  }
}
```

## Step 4: Verify the Connection

Check that everything is working:

```bash
npx tc-connector --status
```

You should see:

```
  TC Connector — Status
  Version:    1.1.0
  API URL:    https://app.teachcharlie.ai
  Token:      tc_abc...xyz
  Connection:  OK
  Tools:       2 available
```

## Step 5: Restart OpenClaw

Restart OpenClaw and your Teach Charlie skills will appear as available tools. You can now message your agent through any connected channel.

## Managing Skills

You can enable or disable individual workflows as skills:

1. Go to your project's **Workflows** tab
2. Toggle the **Agent skill** switch on any workflow
3. Enabled skills appear immediately in OpenClaw (on next tool refresh)

## Troubleshooting

### "Token is invalid or revoked"

Your token may have been revoked. Go to **Settings > OpenClaw Connection** and generate a new one. Update your `.mcp.json` or run `tc-connector --setup` again.

### "Connection failed"

- Check your internet connection
- Verify the API is reachable: `curl https://app.teachcharlie.ai/api/v1/health`
- Make sure Node.js 18+ is installed: `node -v`

### "0 tools available"

No workflows are marked as skills. Go to your project's **Workflows** tab and enable the **Agent skill** toggle on at least one workflow.

### OpenClaw doesn't see the tools

1. Make sure your agent is published (look for the "Live" badge)
2. Restart OpenClaw after changing the config
3. Run `npx tc-connector --status` to verify the connection independently
