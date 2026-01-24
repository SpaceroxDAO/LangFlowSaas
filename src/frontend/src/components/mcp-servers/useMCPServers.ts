import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { MCPServer } from './types'

export function useMCPServers(projectId: string) {
  const queryClient = useQueryClient()
  const [togglingServerId, setTogglingServerId] = useState<string | null>(null)

  // Fetch workflows for this project
  const { data: workflowsData } = useQuery({
    queryKey: ['workflows', projectId],
    queryFn: () => api.listWorkflows(projectId, 1, 100),
  })

  const workflows = workflowsData?.workflows || []

  // Fetch MCP servers
  const { data, isLoading } = useQuery({
    queryKey: ['mcp-servers', projectId],
    queryFn: () => api.listMCPServers(projectId),
  })

  // Fetch restart status
  const { data: restartStatus } = useQuery({
    queryKey: ['restart-status'],
    queryFn: () => api.getRestartStatus(),
    refetchInterval: 5000,
  })

  const servers = data?.mcp_servers || []
  const pendingChanges = restartStatus?.pending_changes || []
  const hasPendingChanges = pendingChanges.length > 0

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: () => api.syncMCPServers(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['restart-status'] })
    },
  })

  // Toggle server mutation
  const toggleMutation = useMutation({
    mutationFn: ({ serverId, enabled }: { serverId: string; enabled: boolean }) =>
      api.updateMCPServer(serverId, { is_enabled: enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['restart-status'] })
      setTogglingServerId(null)
    },
    onError: () => {
      setTogglingServerId(null)
    },
  })

  // Delete server mutation
  const deleteMutation = useMutation({
    mutationFn: (serverId: string) => api.deleteMCPServer(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['restart-status'] })
    },
  })

  // Enable/Disable mutations (used in modal)
  const enableMutation = useMutation({
    mutationFn: (serverId: string) => api.enableMCPServer(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
    },
  })

  const disableMutation = useMutation({
    mutationFn: (serverId: string) => api.disableMCPServer(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
    },
  })

  const handleToggleServer = (server: MCPServer) => {
    setTogglingServerId(server.id)
    toggleMutation.mutate({ serverId: server.id, enabled: !server.is_enabled })
  }

  const handleDeleteServer = (server: MCPServer) => {
    if (confirm(`Delete "${server.name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(server.id)
    }
  }

  const handleToggleServerInModal = (server: MCPServer) => {
    if (server.is_enabled) {
      disableMutation.mutate(server.id)
    } else {
      enableMutation.mutate(server.id)
    }
  }

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
    queryClient.invalidateQueries({ queryKey: ['restart-status'] })
  }

  return {
    // Data
    servers,
    workflows,
    pendingChanges,
    hasPendingChanges,
    isLoading,
    togglingServerId,

    // Mutations
    syncMutation,
    toggleMutation,
    deleteMutation,
    enableMutation,
    disableMutation,

    // Handlers
    handleToggleServer,
    handleDeleteServer,
    handleToggleServerInModal,
    invalidateQueries,

    // Computed mutation states
    isModalToggling: enableMutation.isPending || disableMutation.isPending,
  }
}

// Filter servers based on search query
export function useFilteredServers(servers: MCPServer[], searchQuery: string) {
  return useMemo(() => {
    if (!searchQuery.trim()) return servers
    const query = searchQuery.toLowerCase()
    return servers.filter(
      (server) =>
        server.name.toLowerCase().includes(query) ||
        server.description?.toLowerCase().includes(query) ||
        server.server_type.toLowerCase().includes(query)
    )
  }, [servers, searchQuery])
}
