/**
 * usePublishedAgent - Hook for tracking published agent state
 *
 * Provides information about which agent (if any) is currently
 * published as the user's live OpenClaw agent.
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AgentComponent } from '@/types'

interface UsePublishedAgentReturn {
  /** The currently published agent, or null */
  publishedAgent: AgentComponent | null
  /** Check if a specific agent is the published one */
  isPublished: (agentId: string) => boolean
  /** Number of published agents (0 or 1) */
  publishCount: number
  /** Loading state */
  isLoading: boolean
}

export function usePublishedAgent(): UsePublishedAgentReturn {
  const { data, isLoading } = useQuery({
    queryKey: ['agent-components', 'published'],
    queryFn: async () => {
      // listAgentComponents(projectId, page, pageSize, activeOnly, publishedOnly)
      const response = await api.listAgentComponents(undefined, 1, 100, true, false)
      return response.agent_components
    },
    staleTime: 30_000, // 30 seconds
  })

  const publishedAgent = data?.find((a: AgentComponent) => a.is_published) ?? null
  const publishCount = publishedAgent ? 1 : 0

  return {
    publishedAgent,
    isPublished: (agentId: string) => publishedAgent?.id === agentId,
    publishCount,
    isLoading,
  }
}
