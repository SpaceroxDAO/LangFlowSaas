/**
 * Generate platform-specific installer scripts for OpenClaw + TC Connector.
 *
 * Downloads a shell script (macOS/Linux) or PowerShell script (Windows)
 * that auto-installs OpenClaw, writes the agent config, and starts the daemon.
 */

import type { AgentPersonality } from './mcpConfigGenerator'
import { generateOpenClawConfig } from './mcpConfigGenerator'
import { detectOS, type DetectedOS } from './osDetect'

function generateShellScript(
  token: string,
  personality: AgentPersonality
): string {
  const configJson = generateOpenClawConfig(token, personality)
  // Escape single quotes in JSON for embedding in shell script
  const escapedJson = configJson.replace(/'/g, "'\\''")

  return `#!/bin/bash
#
# Teach Charlie AI — OpenClaw Installer
# Agent: ${personality.name}
#
# This script installs OpenClaw and configures your AI agent.
# Run with: bash install-${personality.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.sh
#

set -e

AGENT_NAME="${personality.name}"
CONFIG_DIR="$HOME/.openclaw"
CONFIG_FILE="$CONFIG_DIR/openclaw.json"

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║   Teach Charlie AI — Agent Installer     ║"
echo "  ║   Setting up: $AGENT_NAME"
echo "  ╚══════════════════════════════════════════╝"
echo ""

# Step 1: Check Node.js
echo "→ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "  ✗ Node.js not found."
    echo "  Please install Node.js 18+ from https://nodejs.org"
    echo "  Then run this script again."
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "  ✗ Node.js $NODE_VERSION found, but version 18+ is required."
    echo "  Please update Node.js from https://nodejs.org"
    exit 1
fi
echo "  ✓ Node.js $(node -v) detected"

# Step 2: Install OpenClaw
echo ""
echo "→ Installing OpenClaw..."
if command -v openclaw &> /dev/null; then
    echo "  ✓ OpenClaw already installed"
else
    npm install -g openclaw@latest
    echo "  ✓ OpenClaw installed"
fi

# Step 3: Write config
echo ""
echo "→ Writing agent config..."
mkdir -p "$CONFIG_DIR"

if [ -f "$CONFIG_FILE" ]; then
    # Backup existing config
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d%H%M%S)"
    echo "  ✓ Existing config backed up"
fi

cat > "$CONFIG_FILE" << 'CONFIGEOF'
${escapedJson}
CONFIGEOF
echo "  ✓ Config written to $CONFIG_FILE"

# Step 4: Start OpenClaw
echo ""
echo "→ Starting OpenClaw..."
if command -v openclaw &> /dev/null; then
    openclaw onboard --install-daemon 2>/dev/null || true
    echo "  ✓ OpenClaw daemon installed"
fi

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║   ✓ Setup Complete!                      ║"
echo "  ║                                          ║"
echo "  ║   Your agent '$AGENT_NAME' is ready.     ║"
echo "  ║   OpenClaw will start automatically.     ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""
echo "  Next steps:"
echo "  • Open WhatsApp/Telegram and message your agent"
echo "  • Or run: openclaw chat"
echo ""
`
}

function generatePowerShellScript(
  token: string,
  personality: AgentPersonality
): string {
  const configJson = generateOpenClawConfig(token, personality)
  // Escape for PowerShell here-string (no escaping needed inside @' '@ blocks)

  return `#
# Teach Charlie AI — OpenClaw Installer (Windows)
# Agent: ${personality.name}
#
# Run with: Right-click → "Run with PowerShell"
# Or: powershell -ExecutionPolicy Bypass -File install-${personality.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ps1
#

$ErrorActionPreference = "Stop"
$AgentName = "${personality.name}"
$ConfigDir = "$env:USERPROFILE\\.openclaw"
$ConfigFile = "$ConfigDir\\openclaw.json"

Write-Host ""
Write-Host "  ========================================"
Write-Host "   Teach Charlie AI - Agent Installer"
Write-Host "   Setting up: $AgentName"
Write-Host "  ========================================"
Write-Host ""

# Step 1: Check Node.js
Write-Host "-> Checking Node.js..."
try {
    $nodeVersion = (node -v) -replace 'v', ''
    $major = [int]($nodeVersion.Split('.')[0])
    if ($major -lt 18) {
        Write-Host "  X Node.js $nodeVersion found, but version 18+ is required."
        Write-Host "  Please update from https://nodejs.org"
        exit 1
    }
    Write-Host "  OK Node.js v$nodeVersion detected"
} catch {
    Write-Host "  X Node.js not found."
    Write-Host "  Please install Node.js 18+ from https://nodejs.org"
    Write-Host "  Then run this script again."
    exit 1
}

# Step 2: Install OpenClaw
Write-Host ""
Write-Host "-> Installing OpenClaw..."
try {
    $null = Get-Command openclaw -ErrorAction Stop
    Write-Host "  OK OpenClaw already installed"
} catch {
    npm install -g openclaw@latest
    Write-Host "  OK OpenClaw installed"
}

# Step 3: Write config
Write-Host ""
Write-Host "-> Writing agent config..."
if (-not (Test-Path $ConfigDir)) {
    New-Item -ItemType Directory -Path $ConfigDir -Force | Out-Null
}

if (Test-Path $ConfigFile) {
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    Copy-Item $ConfigFile "$ConfigFile.backup.$timestamp"
    Write-Host "  OK Existing config backed up"
}

$configContent = @'
${configJson}
'@

Set-Content -Path $ConfigFile -Value $configContent -Encoding UTF8
Write-Host "  OK Config written to $ConfigFile"

# Step 4: Start OpenClaw
Write-Host ""
Write-Host "-> Starting OpenClaw..."
try {
    openclaw onboard --install-daemon 2>$null
    Write-Host "  OK OpenClaw daemon installed"
} catch {
    Write-Host "  Note: Run 'openclaw onboard --install-daemon' manually to start the daemon"
}

Write-Host ""
Write-Host "  ========================================"
Write-Host "   Setup Complete!"
Write-Host ""
Write-Host "   Your agent '$AgentName' is ready."
Write-Host "   OpenClaw will start automatically."
Write-Host "  ========================================"
Write-Host ""
Write-Host "  Next steps:"
Write-Host "  - Open WhatsApp/Telegram and message your agent"
Write-Host "  - Or run: openclaw chat"
Write-Host ""

Read-Host "Press Enter to close"
`
}

export function downloadInstaller(
  token: string,
  personality: AgentPersonality
): void {
  const os = detectOS()
  const safeName = personality.name.toLowerCase().replace(/[^a-z0-9]/g, '-')

  let content: string
  let filename: string
  let mimeType: string

  if (os === 'windows') {
    content = generatePowerShellScript(token, personality)
    filename = `install-${safeName}.ps1`
    mimeType = 'application/octet-stream'
  } else {
    content = generateShellScript(token, personality)
    filename = `install-${safeName}.sh`
    mimeType = 'application/x-sh'
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()

  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
