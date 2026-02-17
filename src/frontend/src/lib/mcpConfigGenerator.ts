/**
 * Generate and download OpenClaw-compatible MCP config files.
 */

export function generateOpenClawConfig(token: string, agentName: string): string {
  const config = {
    mcpServers: {
      'teach-charlie': {
        command: 'npx',
        args: ['tc-connector', '--token', token],
      },
    },
  }
  return JSON.stringify(config, null, 2)
}

export function downloadOpenClawConfig(token: string, agentName: string): void {
  const json = generateOpenClawConfig(token, agentName)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'openclaw.json'
  document.body.appendChild(a)
  a.click()

  // Cleanup
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
