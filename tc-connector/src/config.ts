/**
 * Configuration loader for TC Connector.
 *
 * Priority order:
 * 1. CLI flags (--token, --api-url)
 * 2. Environment variables (TC_TOKEN, TC_API_URL)
 * 3. Config file (~/.tc-connector/config.json)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { createInterface } from "node:readline";

export const VERSION = "1.1.0";

export interface Config {
  apiUrl: string;
  token: string;
}

const DEFAULT_API_URL = "https://app.teachcharlie.ai";
const CONFIG_DIR = join(homedir(), ".tc-connector");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

interface FileConfig {
  apiUrl?: string;
  token?: string;
}

function loadFileConfig(configPath?: string): FileConfig {
  const path = configPath || CONFIG_FILE;
  if (!existsSync(path)) return {};
  try {
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw) as FileConfig;
  } catch {
    return {};
  }
}

function parseArgs(argv: string[]): {
  token?: string;
  apiUrl?: string;
  configPath?: string;
  setup?: boolean;
  status?: boolean;
  help?: boolean;
  version?: boolean;
} {
  const result: ReturnType<typeof parseArgs> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--token" && argv[i + 1]) {
      result.token = argv[++i];
    } else if (arg === "--api-url" && argv[i + 1]) {
      result.apiUrl = argv[++i];
    } else if (arg === "--config" && argv[i + 1]) {
      result.configPath = argv[++i];
    } else if (arg === "--setup") {
      result.setup = true;
    } else if (arg === "--status") {
      result.status = true;
    } else if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--version" || arg === "-v") {
      result.version = true;
    }
  }
  return result;
}

function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stderr,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function runSetup(): Promise<void> {
  console.error("");
  console.error("  TC Connector — Setup Wizard");
  console.error("  ─────────────────────────────");
  console.error("");
  console.error("  Generate a token at:");
  console.error("  https://app.teachcharlie.ai/dashboard/settings");
  console.error("");

  const token = await prompt("  MCP Bridge Token (tc_...): ");

  if (!token) {
    console.error("\n  Error: Token is required. Aborting setup.");
    process.exit(1);
  }

  if (!token.startsWith("tc_")) {
    console.error("\n  Warning: Token should start with 'tc_'. Continuing anyway.");
  }

  const apiUrlAnswer = await prompt(
    `  API URL [${DEFAULT_API_URL}]: `
  );
  const apiUrl = apiUrlAnswer || DEFAULT_API_URL;

  // Verify token before saving
  console.error("\n  Verifying token...");
  try {
    const response = await fetch(`${apiUrl}/api/v1/mcp/bridge/tools`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("  Error: Token verification failed (HTTP " + response.status + ").");
      console.error("  Check your token and try again.");
      process.exit(1);
    }

    const data = (await response.json()) as { tools: Array<{ name: string }> };
    console.error(`  Token valid — ${data.tools.length} tool(s) available.`);
  } catch (err) {
    console.error("  Error: Could not reach API at " + apiUrl);
    console.error("  " + (err instanceof Error ? err.message : String(err)));
    process.exit(1);
  }

  // Write config file
  mkdirSync(CONFIG_DIR, { recursive: true });

  const configData: FileConfig = { token, apiUrl };
  writeFileSync(CONFIG_FILE, JSON.stringify(configData, null, 2) + "\n");

  console.error("");
  console.error("  Config saved to: " + CONFIG_FILE);
  console.error("");
  console.error("  You can now run tc-connector without --token:");
  console.error("    npx tc-connector");
  console.error("");
  console.error("  Or add to your .mcp.json:");
  console.error("    {");
  console.error('      "mcpServers": {');
  console.error('        "teach-charlie": {');
  console.error('          "command": "npx",');
  console.error('          "args": ["tc-connector"]');
  console.error("        }");
  console.error("      }");
  console.error("    }");
  console.error("");
}

async function runStatus(): Promise<void> {
  const fileConfig = loadFileConfig();
  const token =
    process.env.TC_TOKEN || fileConfig.token;
  const apiUrl =
    process.env.TC_API_URL || fileConfig.apiUrl || DEFAULT_API_URL;

  console.log("");
  console.log("  TC Connector — Status");
  console.log("  ─────────────────────");
  console.log("");
  console.log(`  Version:    ${VERSION}`);
  console.log(`  API URL:    ${apiUrl}`);
  console.log(`  Config:     ${existsSync(CONFIG_FILE) ? CONFIG_FILE : "(not found)"}`);

  if (!token) {
    console.log("  Token:      (not configured)");
    console.log("");
    console.log("  Run 'tc-connector --setup' to configure.");
    process.exit(1);
  }

  const masked = token.slice(0, 6) + "..." + token.slice(-4);
  console.log(`  Token:      ${masked}`);
  console.log("");
  console.log("  Checking connection...");

  try {
    const response = await fetch(`${apiUrl}/api/v1/mcp/bridge/tools`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.log(`  Connection:  FAILED (HTTP ${response.status})`);
      if (response.status === 401) {
        console.log("  Reason:     Token is invalid or revoked.");
        console.log("  Fix:        Generate a new token at:");
        console.log("              https://app.teachcharlie.ai/dashboard/settings");
      }
      process.exit(1);
    }

    const data = (await response.json()) as {
      tools: Array<{ name: string; description: string }>;
    };

    console.log("  Connection:  OK");
    console.log(`  Tools:       ${data.tools.length} available`);

    if (data.tools.length > 0) {
      console.log("");
      console.log("  Available tools:");
      for (const tool of data.tools) {
        console.log(`    - ${tool.name}: ${tool.description}`);
      }
    }

    console.log("");
  } catch (err) {
    console.log("  Connection:  FAILED");
    console.log("  Error:      " + (err instanceof Error ? err.message : String(err)));
    process.exit(1);
  }
}

export function showHelp(): void {
  console.log(`
TC Connector — Teach Charlie AI MCP Bridge

Connects your Teach Charlie workflows to local AI agents via MCP.

Usage:
  tc-connector [options]

Options:
  --token <token>     MCP bridge token (or TC_TOKEN env var)
  --api-url <url>     Teach Charlie API URL (default: ${DEFAULT_API_URL})
  --config <path>     Config file path (default: ~/.tc-connector/config.json)
  --setup             Interactive setup wizard
  --status            Check connection and token validity
  --version, -v       Show version
  --help, -h          Show this help

Examples:
  tc-connector --token tc_abc123...
  TC_TOKEN=tc_abc123 tc-connector
  tc-connector --setup
  tc-connector --status

OpenClaw .mcp.json config:
  {
    "mcpServers": {
      "teach-charlie": {
        "command": "npx",
        "args": ["tc-connector", "--token", "tc_abc123..."]
      }
    }
  }
`);
}

export function loadConfig(): Config | null {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  if (args.version) {
    console.log(`tc-connector v${VERSION}`);
    process.exit(0);
  }

  if (args.setup) {
    runSetup().then(() => process.exit(0)).catch((err) => {
      console.error("Setup failed:", err);
      process.exit(1);
    });
    return null;
  }

  if (args.status) {
    runStatus().then(() => process.exit(0)).catch((err) => {
      console.error("Status check failed:", err);
      process.exit(1);
    });
    return null;
  }

  const fileConfig = loadFileConfig(args.configPath);

  const token =
    args.token || process.env.TC_TOKEN || fileConfig.token;
  const apiUrl =
    args.apiUrl || process.env.TC_API_URL || fileConfig.apiUrl || DEFAULT_API_URL;

  if (!token) {
    console.error("Error: MCP bridge token is required.");
    console.error("");
    console.error("Provide it via one of:");
    console.error("  --token <token>           CLI flag");
    console.error("  TC_TOKEN=<token>          Environment variable");
    console.error("  ~/.tc-connector/config.json  Config file");
    console.error("");
    console.error(
      "Generate a token at: https://app.teachcharlie.ai/dashboard/settings"
    );
    console.error("");
    console.error("Or run: tc-connector --setup");
    process.exit(1);
  }

  return { apiUrl, token };
}
