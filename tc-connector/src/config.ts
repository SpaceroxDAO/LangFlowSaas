/**
 * Configuration loader for TC Connector.
 *
 * Priority order:
 * 1. CLI flags (--token, --api-url)
 * 2. Environment variables (TC_TOKEN, TC_API_URL)
 * 3. Config file (~/.tc-connector/config.json)
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

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
    } else if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--version" || arg === "-v") {
      result.version = true;
    }
  }
  return result;
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
  --version, -v       Show version
  --help, -h          Show this help

Examples:
  tc-connector --token tc_abc123...
  TC_TOKEN=tc_abc123 tc-connector
  tc-connector --setup

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
    console.log("tc-connector v1.0.0");
    process.exit(0);
  }

  if (args.setup) {
    console.log("Interactive setup is not yet implemented.");
    console.log("For now, use: tc-connector --token <your-token>");
    console.log(
      "\nGenerate a token at: https://app.teachcharlie.ai/dashboard/settings"
    );
    process.exit(0);
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
    process.exit(1);
  }

  return { apiUrl, token };
}
