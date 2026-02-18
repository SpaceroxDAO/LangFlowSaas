/**
 * TC Connector — Teach Charlie AI MCP Server
 *
 * A local MCP server that bridges Teach Charlie workflows to AI agents
 * like OpenClaw via the Model Context Protocol.
 *
 * Architecture:
 *   OpenClaw Agent (local) → stdio/MCP → TC Connector (this) → HTTPS → Teach Charlie API → Langflow
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { loadConfig, VERSION } from "./config.js";
import { TeachCharlieClient } from "./api-client.js";
import type { MCPTool } from "./api-client.js";

async function main() {
  const config = loadConfig();
  if (!config) {
    // loadConfig returns null for --setup and --status (they handle their own exit)
    // Wait briefly for async handlers to complete
    await new Promise((resolve) => setTimeout(resolve, 30000));
    return;
  }

  const client = new TeachCharlieClient(config.apiUrl, config.token);

  // Verify authentication
  const isValid = await client.verify();
  if (!isValid) {
    console.error("Error: Failed to authenticate with Teach Charlie API.");
    console.error("Check that your token is valid and the API is reachable.");
    console.error(`API URL: ${config.apiUrl}`);
    process.exit(1);
  }

  // Fetch available tools on startup
  let cachedTools: MCPTool[];
  try {
    cachedTools = await client.listTools();
  } catch (err) {
    console.error("Error fetching tools:", err);
    process.exit(1);
  }

  // Create MCP server
  const server = new Server(
    {
      name: "tc-connector",
      version: VERSION,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle tools/list — return cached tools as MCP tool definitions
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    // Re-fetch tools on each list request to stay up to date
    try {
      cachedTools = await client.listTools();
    } catch {
      // Use cached tools if refresh fails
    }

    return {
      tools: cachedTools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  // Handle tools/call — route to Teach Charlie API
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const result = await client.callTool(name, args ?? {});
    return {
      content: result.content,
      isError: result.isError,
    } as const;
  });

  // Log startup info to stderr (stdout is used by MCP stdio transport)
  console.error(
    `TC Connector started — ${cachedTools.length} tool(s) available from ${config.apiUrl}`
  );
  for (const tool of cachedTools) {
    console.error(`  - ${tool.name}: ${tool.description}`);
  }

  // Connect via stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
