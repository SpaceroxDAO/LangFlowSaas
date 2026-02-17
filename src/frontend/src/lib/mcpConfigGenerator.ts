/**
 * Generate and download OpenClaw-compatible MCP config files.
 *
 * The config embeds the agent's personality (name, system prompt, skills)
 * alongside the MCP server entry so OpenClaw can personalize the experience.
 */

export interface AgentPersonality {
  name: string
  systemPrompt?: string
  avatarUrl?: string
  skills?: Array<{ id: string; name: string }>
  channels?: string[]
}

export function generateOpenClawConfig(
  token: string,
  personality: AgentPersonality
): string {
  const config: Record<string, unknown> = {
    mcpServers: {
      'teach-charlie': {
        command: 'npx',
        args: ['tc-connector', '--token', token],
      },
    },
    teachCharlie: {
      agentName: personality.name,
      ...(personality.systemPrompt && { systemPrompt: personality.systemPrompt }),
      ...(personality.avatarUrl && { avatarUrl: personality.avatarUrl }),
      ...(personality.skills &&
        personality.skills.length > 0 && {
          skills: personality.skills.map((s) => s.name),
        }),
      ...(personality.channels &&
        personality.channels.length > 0 && {
          channels: personality.channels,
        }),
    },
  }
  return JSON.stringify(config, null, 2)
}

export function downloadOpenClawConfig(
  token: string,
  personality: AgentPersonality
): void {
  const json = generateOpenClawConfig(token, personality)
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
