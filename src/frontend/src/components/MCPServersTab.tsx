import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Server, AlertTriangle, CheckCircle, XCircle, RefreshCw, Globe, Terminal,
  Plus, Trash2, Loader2, Copy, Check, ChevronDown, ChevronUp, Info, Key,
  Shield, X, Pencil, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Settings, ArrowRight, Search, List, LayoutGrid
} from 'lucide-react'
import { api } from '@/lib/api'
import type { MCPServer, MCPTransportType, MCPServerTemplate, Workflow } from '@/types'

type ViewMode = 'list' | 'grid'

interface MCPServersTabProps {
  projectId: string
}

// Generate gradient color based on index
const getGradientColor = (index: number) => {
  const colors = [
    'from-emerald-500 to-teal-400',
    'from-blue-500 to-indigo-400',
    'from-purple-500 to-violet-400',
    'from-amber-500 to-orange-400',
    'from-rose-500 to-pink-400',
    'from-cyan-500 to-blue-400',
    'from-lime-500 to-green-400',
    'from-fuchsia-500 to-purple-400',
  ]
  return colors[index % colors.length]
}

export function MCPServersTab({ projectId }: MCPServersTabProps) {
  const queryClient = useQueryClient()
  const [mcpModalOpen, setMcpModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

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

  // Filter servers based on search query
  const filteredServers = useMemo(() => {
    if (!searchQuery.trim()) return servers
    const query = searchQuery.toLowerCase()
    return servers.filter(
      (server) =>
        server.name.toLowerCase().includes(query) ||
        server.description?.toLowerCase().includes(query) ||
        server.server_type.toLowerCase().includes(query)
    )
  }, [servers, searchQuery])

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: () => api.syncMCPServers(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['restart-status'] })
    },
  })

  // Toggle server mutation
  const [togglingServerId, setTogglingServerId] = useState<string | null>(null)
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

  const handleToggleServer = (server: MCPServer) => {
    setTogglingServerId(server.id)
    toggleMutation.mutate({ serverId: server.id, enabled: !server.is_enabled })
  }

  const handleDeleteServer = (server: MCPServer) => {
    if (confirm(`Delete "${server.name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(server.id)
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 dark:border-neutral-600 border-t-gray-600 dark:border-t-gray-300" />
      </div>
    )
  }

  return (
    <>
      {/* Pending Changes Banner */}
      {hasPendingChanges && (
        <div className="mx-6 mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {pendingChanges.length} pending change{pendingChanges.length > 1 ? 's' : ''} require a restart
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Sync changes and restart Langflow to apply MCP server configurations
              </p>
            </div>
          </div>
          <button
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
            {syncMutation.isPending ? 'Syncing...' : 'Sync & Restart'}
          </button>
        </div>
      )}

      {/* Toolbar - always visible */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="Search MCP servers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-neutral-800 border-0 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-neutral-600"
          />
        </div>

        <div className="flex items-center gap-1">
          {/* View toggle */}
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300'
            }`}
            title="List view"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Empty state - No MCP servers configured */}
      {servers.length === 0 && (
        <div className="text-center py-16">
          <Server className="w-12 h-12 text-gray-300 dark:text-neutral-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-neutral-400 mb-4">No MCP servers configured yet</p>
          <button
            onClick={() => setMcpModalOpen(true)}
            className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-lg hover:shadow-gray-900/25 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add your first MCP server
          </button>
        </div>
      )}

      {/* No search results */}
      {servers.length > 0 && filteredServers.length === 0 && (
        <div className="text-center py-12 px-6">
          <p className="text-gray-500 dark:text-neutral-400">No servers found matching "{searchQuery}"</p>
        </div>
      )}

      {/* Server list/grid when servers exist */}
      {filteredServers.length > 0 && (
        <div className="flex-1 overflow-auto px-6 pb-4">
          {viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredServers.map((server, index) => (
                <ExternalServerCard
                  key={server.id}
                  server={server}
                  colorIndex={index}
                  onToggle={() => handleToggleServer(server)}
                  onDelete={() => handleDeleteServer(server)}
                  getHealthIcon={getHealthIcon}
                  isToggling={togglingServerId === server.id}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServers.map((server, index) => (
                <ExternalServerGridCard
                  key={server.id}
                  server={server}
                  colorIndex={index}
                  onToggle={() => handleToggleServer(server)}
                  onDelete={() => handleDeleteServer(server)}
                  getHealthIcon={getHealthIcon}
                  isToggling={togglingServerId === server.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* MCP Configuration Modal */}
      {mcpModalOpen && (
        <MCPConfigModal
          projectId={projectId}
          workflows={workflows}
          servers={servers}
          onClose={() => setMcpModalOpen(false)}
        />
      )}
    </>
  )
}

// ================================================================
// MCP Configuration Modal
// ================================================================
interface MCPConfigModalProps {
  projectId: string
  workflows: Workflow[]
  servers: MCPServer[]
  onClose: () => void
}

function MCPConfigModal({ projectId, workflows, servers, onClose }: MCPConfigModalProps) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'external' | 'expose'>('external')

  // Expose as Server state
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set())
  const [toolsSearchQuery, setToolsSearchQuery] = useState('')
  const [toolsPage, setToolsPage] = useState(1)
  const [transport, setTransport] = useState<'sse' | 'streamable-http'>('streamable-http')
  const [copiedConfig, setCopiedConfig] = useState(false)
  const toolsPerPage = 10

  // External Servers state
  const [addServerMode, setAddServerMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and paginate tools
  const filteredTools = useMemo(() => {
    if (!toolsSearchQuery.trim()) return workflows
    const query = toolsSearchQuery.toLowerCase()
    return workflows.filter(
      (w) =>
        w.name.toLowerCase().includes(query) ||
        w.description?.toLowerCase().includes(query)
    )
  }, [workflows, toolsSearchQuery])

  const totalToolsPages = Math.ceil(filteredTools.length / toolsPerPage)
  const paginatedTools = filteredTools.slice(
    (toolsPage - 1) * toolsPerPage,
    toolsPage * toolsPerPage
  )

  // Get enabled workflows
  const enabledWorkflows = selectedTools.size > 0
    ? workflows.filter(w => selectedTools.has(w.id))
    : workflows

  // Generate tool name from workflow
  const generateToolName = (workflow: Workflow) => {
    const baseName = workflow.name.toUpperCase().replace(/\s+/g, '_')
    const shortId = workflow.id.slice(0, 8).toUpperCase()
    return `${baseName}_${shortId}...`
  }

  // MCP config generation
  const langflowBaseUrl = 'http://localhost:7860'
  const mcpServerUrl = `${langflowBaseUrl}/api/v1/mcp/project/${projectId}/${transport === 'streamable-http' ? 'streamable' : 'sse'}`

  const generateMcpConfig = () => {
    const serverName = `tc-project-${projectId.slice(0, 8)}`
    return {
      mcpServers: {
        [serverName]: {
          command: 'uvx',
          args: [
            'mcp-proxy',
            '--transport',
            transport === 'streamable-http' ? 'streamablehttp' : 'sse',
            mcpServerUrl
          ]
        }
      }
    }
  }

  const mcpConfig = generateMcpConfig()
  const mcpConfigJson = JSON.stringify(mcpConfig, null, 2)

  const handleCopyConfig = async () => {
    try {
      await navigator.clipboard.writeText(mcpConfigJson)
      setCopiedConfig(true)
      setTimeout(() => setCopiedConfig(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Filter external servers
  const filteredServers = useMemo(() => {
    if (!searchQuery.trim()) return servers
    const query = searchQuery.toLowerCase()
    return servers.filter(
      (server) =>
        server.name.toLowerCase().includes(query) ||
        server.description?.toLowerCase().includes(query) ||
        server.server_type.toLowerCase().includes(query)
    )
  }, [servers, searchQuery])

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (serverId: string) => api.deleteMCPServer(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['restart-status'] })
    },
  })

  // Enable/Disable mutations
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
    if (server.is_enabled) {
      disableMutation.mutate(server.id)
    } else {
      enableMutation.mutate(server.id)
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-4xl mx-4 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New MCP Server</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex gap-1">
            <button
              onClick={() => { setActiveTab('external'); setAddServerMode(false) }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'external'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300'
              }`}
            >
              Add External Server
              {servers.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 text-xs rounded-full">
                  {servers.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('expose')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'expose'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300'
              }`}
            >
              Expose Internal Project as Server
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {/* ================================================================ */}
          {/* EXPOSE AS SERVER TAB */}
          {/* ================================================================ */}
          {activeTab === 'expose' && (
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Expose your project's workflows as tools that MCP clients can use.
              </p>

              {/* Tools Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Available Tools ({enabledWorkflows.length})</h3>
                  <div className="relative w-64">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search tools..."
                      value={toolsSearchQuery}
                      onChange={(e) => {
                        setToolsSearchQuery(e.target.value)
                        setToolsPage(1)
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Tools Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="w-10 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedTools.size === workflows.length && workflows.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTools(new Set(workflows.map(w => w.id)))
                              } else {
                                setSelectedTools(new Set())
                              }
                            }}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flow Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool Name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedTools.map((workflow) => (
                        <tr key={workflow.id} className="hover:bg-gray-50 transition-colors">
                          <td className="w-10 px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedTools.has(workflow.id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedTools)
                                if (e.target.checked) {
                                  newSelected.add(workflow.id)
                                } else {
                                  newSelected.delete(workflow.id)
                                }
                                setSelectedTools(newSelected)
                              }}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-[180px]" title={workflow.name}>
                            {workflow.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[220px]" title={workflow.description || ''}>
                            {workflow.description || `Workflow for ${workflow.name}`}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 font-mono truncate max-w-[200px]" title={generateToolName(workflow)}>
                            {generateToolName(workflow)}
                          </td>
                        </tr>
                      ))}
                      {paginatedTools.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                            {toolsSearchQuery ? 'No tools found' : 'No workflows in this project'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalToolsPages > 1 && (
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500">
                      {(toolsPage - 1) * toolsPerPage + 1} - {Math.min(toolsPage * toolsPerPage, filteredTools.length)} of {filteredTools.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setToolsPage(1)}
                        disabled={toolsPage === 1}
                        className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setToolsPage(p => Math.max(1, p - 1))}
                        disabled={toolsPage === 1}
                        className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-3 text-sm text-gray-600">Page {toolsPage} of {totalToolsPages}</span>
                      <button
                        onClick={() => setToolsPage(p => Math.min(totalToolsPages, p + 1))}
                        disabled={toolsPage >= totalToolsPages}
                        className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setToolsPage(totalToolsPages)}
                        disabled={toolsPage >= totalToolsPages}
                        className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Auth & Transport */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                {/* Auth */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Auth:</span>
                  <div className="flex items-center gap-1.5 text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">None (public)</span>
                  </div>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    onClick={() => alert('Authentication configuration coming soon!')}
                  >
                    <Key className="w-4 h-4" />
                    Add Auth
                  </button>
                </div>

                <div className="h-6 w-px bg-gray-200" />

                {/* Transport */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Transport:</span>
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setTransport('sse')}
                      className={`px-3 py-1.5 text-sm transition-colors ${
                        transport === 'sse'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      SSE
                    </button>
                    <button
                      onClick={() => setTransport('streamable-http')}
                      className={`px-3 py-1.5 text-sm transition-colors ${
                        transport === 'streamable-http'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Streamable HTTP
                    </button>
                  </div>
                </div>
              </div>

              {/* JSON Config */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Configuration</h3>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                  <button
                    onClick={handleCopyConfig}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                    title="Copy to clipboard"
                  >
                    {copiedConfig ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <pre className="p-4 pr-14 text-sm text-gray-100 overflow-x-auto font-mono">
                    {mcpConfigJson}
                  </pre>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Add this configuration to your MCP client (Claude Desktop, Cursor, etc.)
                </p>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* ADD EXTERNAL SERVER TAB */}
          {/* ================================================================ */}
          {activeTab === 'external' && (
            <AddServerPanel
              projectId={projectId}
              servers={servers}
              filteredServers={filteredServers}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onToggleServer={handleToggleServer}
              onDeleteServer={(s) => deleteMutation.mutate(s.id)}
              getHealthIcon={getHealthIcon}
              isToggling={enableMutation.isPending || disableMutation.isPending}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
                queryClient.invalidateQueries({ queryKey: ['restart-status'] })
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ================================================================
// External Server Card
// ================================================================
function ExternalServerCard({
  server,
  colorIndex,
  onToggle,
  onDelete,
  getHealthIcon,
  isToggling,
}: {
  server: MCPServer
  colorIndex: number
  onToggle: (server: MCPServer) => void
  onDelete: (server: MCPServer) => void
  getHealthIcon: (status: string) => React.ReactNode
  isToggling: boolean
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const gradientColor = getGradientColor(colorIndex)

  return (
    <div className={`bg-white dark:bg-neutral-800 border rounded-lg p-4 transition-all ${server.is_enabled ? 'border-gray-200 dark:border-neutral-700' : 'border-gray-100 dark:border-neutral-800 opacity-60'}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0`}>
          {server.transport === 'sse' || server.transport === 'http' ? (
            <Globe className="w-5 h-5 text-white" />
          ) : (
            <Terminal className="w-5 h-5 text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 dark:text-white">{server.name}</h3>
            {getHealthIcon(server.health_status)}
            {server.needs_sync && (
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                Pending sync
              </span>
            )}
          </div>
          {server.description && (
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">{server.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-neutral-500">
            <span>Type: {server.server_type}</span>
            {server.transport === 'sse' || server.transport === 'http' ? (
              <span className="truncate max-w-[200px]" title={server.url}>URL: {server.url}</span>
            ) : (
              <span>Command: {server.command}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(server)}
            disabled={isToggling}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
              server.is_enabled ? 'bg-purple-600' : 'bg-gray-200 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                server.is_enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
              className="p-1.5 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg z-10 py-1">
                <button
                  onClick={() => { setMenuOpen(false); onDelete(server) }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ================================================================
// External Server Grid Card (for grid view)
// ================================================================
function ExternalServerGridCard({
  server,
  colorIndex,
  onToggle,
  onDelete,
  getHealthIcon,
  isToggling,
}: {
  server: MCPServer
  colorIndex: number
  onToggle: (server: MCPServer) => void
  onDelete: (server: MCPServer) => void
  getHealthIcon: (status: string) => React.ReactNode
  isToggling: boolean
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const gradientColor = getGradientColor(colorIndex)

  return (
    <div className={`bg-white dark:bg-neutral-800 border rounded-xl p-5 transition-all hover:shadow-md ${server.is_enabled ? 'border-gray-200 dark:border-neutral-700' : 'border-gray-100 dark:border-neutral-800 opacity-60'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center`}>
          {server.transport === 'sse' || server.transport === 'http' ? (
            <Globe className="w-6 h-6 text-white" />
          ) : (
            <Terminal className="w-6 h-6 text-white" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(server)}
            disabled={isToggling}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
              server.is_enabled ? 'bg-purple-600' : 'bg-gray-200 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                server.is_enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
              className="p-1.5 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg z-10 py-1">
                <button
                  onClick={() => { setMenuOpen(false); onDelete(server) }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{server.name}</h3>
          {getHealthIcon(server.health_status)}
        </div>
        {server.needs_sync && (
          <span className="inline-block px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs rounded-full mb-2">
            Pending sync
          </span>
        )}
        {server.description && (
          <p className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-2">{server.description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-100 dark:border-neutral-700">
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-neutral-500">
          <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded">
            {server.server_type}
          </span>
          <span className="truncate flex-1">
            {server.transport === 'sse' || server.transport === 'http' ? server.url : server.command}
          </span>
        </div>
      </div>
    </div>
  )
}

// ================================================================
// Add Server Panel (inside modal)
// ================================================================
function AddServerPanel({
  projectId,
  servers,
  filteredServers,
  searchQuery,
  setSearchQuery,
  onToggleServer,
  onDeleteServer,
  getHealthIcon,
  isToggling,
  onSuccess,
}: {
  projectId: string
  servers: MCPServer[]
  filteredServers: MCPServer[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  onToggleServer: (server: MCPServer) => void
  onDeleteServer: (server: MCPServer) => void
  getHealthIcon: (status: string) => React.ReactNode
  isToggling: boolean
  onSuccess: () => void
}) {
  const [mode, setMode] = useState<'templates' | 'json'>('templates')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [name, setName] = useState('')
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([])
  const [sslVerify, setSslVerify] = useState(true)
  const [useCache, setUseCache] = useState(false)
  const [customCommand, setCustomCommand] = useState('')
  const [customArgs, setCustomArgs] = useState('')
  const [jsonConfig, setJsonConfig] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const { data: templatesData } = useQuery({
    queryKey: ['mcp-templates'],
    queryFn: () => api.getMCPServerTemplates(),
  })

  const templates = templatesData?.templates || []
  const selectedTemplateData = templates.find((t) => t.name === selectedTemplate)
  const isSSETemplate = selectedTemplateData?.transport === 'sse' || selectedTemplateData?.transport === 'http'
  const isCustomTemplate = selectedTemplate === 'custom'

  const handleSelectTemplate = (templateName: string) => {
    setSelectedTemplate(templateName)
    setCredentials({})
    setUrl('')
    setHeaders([])
    setSslVerify(true)
    setUseCache(false)
    setCustomCommand('')
    setCustomArgs('')
    setTestResult(null)
  }

  const handleTestConnection = async () => {
    if (!selectedTemplateData) return
    setIsTesting(true)
    setTestResult(null)

    try {
      const headersObj: Record<string, string> = {}
      headers.forEach(({ key, value }) => {
        if (key.trim()) headersObj[key.trim()] = value
      })

      const command = isCustomTemplate && customCommand ? customCommand : selectedTemplateData.command || undefined
      const args = isCustomTemplate && customArgs ? customArgs.split(' ').filter(Boolean) : selectedTemplateData.args

      const result = await api.testMCPConnection({
        transport: selectedTemplateData.transport as MCPTransportType,
        command,
        args,
        url: isSSETemplate ? url : undefined,
        headers: isSSETemplate ? headersObj : undefined,
        ssl_verify: sslVerify,
        env: credentials,
      })
      setTestResult({ success: result.success, message: result.message })
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to test connection' })
    } finally {
      setIsTesting(false)
    }
  }

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      if (mode === 'json') {
        try {
          const parsed = JSON.parse(jsonConfig)
          await api.createMCPServer({
            name: parsed.name || 'Imported Server',
            description: parsed.description,
            server_type: parsed.server_type || 'custom',
            transport: parsed.transport || 'stdio',
            command: parsed.command,
            args: parsed.args || [],
            url: parsed.url,
            headers: parsed.headers || {},
            ssl_verify: parsed.ssl_verify !== false,
            use_cache: parsed.use_cache || false,
            env: parsed.env || {},
            credentials: parsed.credentials || {},
            project_id: projectId,
          })
        } catch (parseError) {
          setJsonError('Invalid JSON format')
          setIsCreating(false)
          return
        }
      } else if (selectedTemplate) {
        const headersObj: Record<string, string> = {}
        headers.forEach(({ key, value }) => {
          if (key.trim()) headersObj[key.trim()] = value
        })

        const customCommandValue = isCustomTemplate && customCommand ? customCommand : undefined
        const customArgsValue = isCustomTemplate && customArgs ? customArgs.split(' ').filter(Boolean) : undefined

        await api.createMCPServerFromTemplate({
          template_name: selectedTemplate,
          name: name || undefined,
          credentials: Object.keys(credentials).length > 0 ? credentials : undefined,
          url: isSSETemplate ? url : undefined,
          headers: isSSETemplate && Object.keys(headersObj).length > 0 ? headersObj : undefined,
          ssl_verify: sslVerify,
          use_cache: useCache,
          command: customCommandValue,
          args: customArgsValue,
          project_id: projectId,
        })
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to create MCP server:', error)
      alert('Failed to create MCP server. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }])
  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index))
  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers]
    newHeaders[index][field] = value
    setHeaders(newHeaders)
  }

  return (
    <div className="p-6">
      {/* Existing Servers List (if any) */}
      {servers.length > 0 && !selectedTemplate && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Connected Servers ({servers.length})</h3>
            <div className="relative w-64">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>
          <div className="space-y-2 max-h-48 overflow-auto">
            {filteredServers.map((server, index) => (
              <ExternalServerCard
                key={server.id}
                server={server}
                colorIndex={index}
                onToggle={onToggleServer}
                onDelete={onDeleteServer}
                getHealthIcon={getHealthIcon}
                isToggling={isToggling}
              />
            ))}
            {filteredServers.length === 0 && searchQuery && (
              <div className="text-center py-4 text-sm text-gray-500">
                No servers found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add New Server Section */}
      {!selectedTemplate && (
        <>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            {servers.length > 0 ? 'Add Another Server' : 'Add a Server'}
          </h3>

          {/* Mode Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setMode('templates')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                mode === 'templates'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setMode('json')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                mode === 'json'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              JSON Import
            </button>
          </div>
        </>
      )}

      {/* JSON Mode */}
      {mode === 'json' && !selectedTemplate && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste MCP Server Configuration
            </label>
            <textarea
              value={jsonConfig}
              onChange={(e) => {
                setJsonConfig(e.target.value)
                setJsonError(null)
              }}
              placeholder={`{
  "name": "My MCP Server",
  "transport": "stdio",
  "command": "npx",
  "args": ["-y", "@example/mcp-server"]
}`}
              rows={10}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
            {jsonError && <p className="text-xs text-red-500 mt-1">{jsonError}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleCreate}
              disabled={isCreating || !jsonConfig.trim()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm disabled:opacity-50"
            >
              {isCreating ? 'Adding...' : 'Add Server'}
            </button>
          </div>
        </div>
      )}

      {/* Templates Mode */}
      {mode === 'templates' && !selectedTemplate && (
        <div className="grid grid-cols-2 gap-3">
          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() => handleSelectTemplate(template.name)}
              className="p-4 border border-gray-200 rounded-lg text-left hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                {template.transport === 'sse' || template.transport === 'http' ? (
                  <Globe className="w-5 h-5 text-blue-600" />
                ) : (
                  <Terminal className="w-5 h-5 text-gray-600" />
                )}
                <span className="font-medium text-gray-900">{template.display_name}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Template Configuration */}
      {selectedTemplate && selectedTemplateData && (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedTemplate('')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to templates
          </button>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {isSSETemplate ? (
              <Globe className="w-5 h-5 text-blue-600" />
            ) : (
              <Terminal className="w-5 h-5 text-gray-600" />
            )}
            <div>
              <p className="font-medium text-gray-900">{selectedTemplateData.display_name}</p>
              <p className="text-sm text-gray-500">{selectedTemplateData.description}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Server Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={selectedTemplateData.display_name}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* SSE/HTTP Config */}
          {isSSETemplate && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Server URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/mcp"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">HTTP Headers</label>
                  <button onClick={addHeader} className="text-xs text-purple-600 hover:text-purple-700">
                    + Add Header
                  </button>
                </div>
                {headers.length === 0 && (
                  <p className="text-xs text-gray-400">No headers configured</p>
                )}
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        placeholder="Header name"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      />
                      <input
                        type={header.key.toLowerCase().includes('auth') ? 'password' : 'text'}
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        placeholder="Header value"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      />
                      <button onClick={() => removeHeader(index)} className="p-2 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sslVerify}
                  onChange={(e) => setSslVerify(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Verify SSL Certificate</span>
              </label>
            </>
          )}

          {/* STDIO Credentials */}
          {!isSSETemplate && Object.keys(selectedTemplateData.env_schema).length > 0 && (
            <div className="space-y-3">
              {Object.entries(selectedTemplateData.env_schema).map(([key, schema]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key} {schema.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={schema.secret ? 'password' : 'text'}
                    value={credentials[key] || ''}
                    onChange={(e) => setCredentials({ ...credentials, [key]: e.target.value })}
                    placeholder={schema.description}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Custom STDIO */}
          {isCustomTemplate && !isSSETemplate && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <p className="text-sm font-medium text-blue-800">Custom Server Configuration</p>
              <div>
                <label className="block text-xs text-blue-700 mb-1">Command <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={customCommand}
                  onChange={(e) => setCustomCommand(e.target.value)}
                  placeholder="npx, python, uvx, etc."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-blue-700 mb-1">Arguments</label>
                <input
                  type="text"
                  value={customArgs}
                  onChange={(e) => setCustomArgs(e.target.value)}
                  placeholder="-y @example/mcp-server"
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Use Cache */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useCache}
              onChange={(e) => setUseCache(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Enable caching for better performance</span>
          </label>

          {/* Test Connection */}
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-600">Test your configuration</span>
            <button
              onClick={handleTestConnection}
              disabled={isTesting || (isSSETemplate && !url)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Test Connection
                </>
              )}
            </button>
          </div>
          {testResult && (
            <div className={`flex items-center gap-2 text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
              {testResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {testResult.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setSelectedTemplate('')} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating || (isSSETemplate && !url) || (isCustomTemplate && !isSSETemplate && !customCommand)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm disabled:opacity-50"
            >
              {isCreating ? 'Adding...' : 'Add Server'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { MCPConfigModal }
