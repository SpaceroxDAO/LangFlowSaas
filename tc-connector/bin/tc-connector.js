#!/usr/bin/env node

/**
 * TC Connector — Teach Charlie AI MCP Bridge
 *
 * A local MCP server that connects your Teach Charlie workflows
 * to OpenClaw and other MCP-compatible AI agents.
 *
 * Usage:
 *   tc-connector --token tc_abc123...
 *   TC_TOKEN=tc_abc123 tc-connector
 *   tc-connector --setup
 */

import("../dist/index.js").catch((err) => {
  console.error("Failed to start TC Connector:", err.message);
  console.error(
    "\nMake sure to build first: cd tc-connector && npm install && npm run build"
  );
  process.exit(1);
});
