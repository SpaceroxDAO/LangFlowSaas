import { useState, useMemo, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Dog, GitBranch, Server } from 'lucide-react'
import { api } from '@/lib/api'
import { ShareDeployModal } from '@/components/ShareDeployModal'
import { WorkflowsTab } from '@/components/WorkflowsTab'
import { TemplateGalleryModal } from '@/components/TemplateGallery'
import { MCPServersTab, MCPConfigModal } from '@/components/mcp-servers'
import type { AgentComponent, ProjectTab } from '@/types'

// Persist view mode in localStorage
const getStoredViewMode = () => (localStorage.getItem('agentViewMode') as 'grid' | 'list') || 'list'
const setStoredViewMode = (mode: 'grid' | 'list') => localStorage.setItem('agentViewMode', mode)

// Generate gradient color based on index
const getGradientColor = (index: number) => {
  const colors = [
    'from-pink-500 to-rose-400',
    'from-cyan-500 to-blue-400',
    'from-purple-500 to-violet-400',
    'from-green-500 to-emerald-400',
    'from-orange-500 to-amber-400',
    'from-red-500 to-pink-400',
    'from-indigo-500 to-blue-400',
    'from-teal-500 to-cyan-400',
  ]
  return colors[index % colors.length]
}

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  // Get tab from URL or default to 'agents'
  const currentTab = (searchParams.get('tab') as ProjectTab) || 'agents'

  const [deleteAgentModal, setDeleteAgentModal] = useState<{ isOpen: boolean; agent: AgentComponent | null }>({
    isOpen: false,
    agent: null,
  })
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; agent: AgentComponent | null }>({
    isOpen: false,
    agent: null,
  })
  const [createWorkflowModal, setCreateWorkflowModal] = useState(false)
  const [mcpConfigModal, setMcpConfigModal] = useState(false)

  // Toolbar state for Agents tab
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(getStoredViewMode)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Fetch project details
  const { data: projectData, isLoading: projectLoading, error: projectError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.getProject(projectId!),
    enabled: !!projectId,
  })

  // Fetch agent components (new table)
  const { data: agentComponentsData, isLoading: agentsLoading } = useQuery({
    queryKey: ['agent-components', projectId, 'all'],
    queryFn: () => api.listAgentComponents(projectId, 1, 100),
    enabled: !!projectId,
    staleTime: 0, // Always fetch fresh data
  })

  // Fetch workflows for count
  const { data: workflowsData } = useQuery({
    queryKey: ['workflows', projectId],
    queryFn: () => api.listWorkflows(projectId),
    enabled: !!projectId,
  })

  // Fetch MCP servers for count
  const { data: mcpServersData } = useQuery({
    queryKey: ['mcp-servers', projectId],
    queryFn: () => api.listMCPServers(projectId),
    enabled: !!projectId,
  })

  // Delete agent mutation
  const deleteAgentMutation = useMutation({
    mutationFn: (agentId: string) => api.deleteAgentComponent(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-components', projectId, 'all'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setDeleteAgentModal({ isOpen: false, agent: null })
    },
  })

  const isLoading = projectLoading || agentsLoading
  const error = projectError
  const project = projectData
  const agents = agentComponentsData?.agent_components || []
  const workflowsCount = workflowsData?.total || 0
  const mcpServersCount = mcpServersData?.total || 0

  // Set tab in URL
  const setTab = (tab: ProjectTab) => {
    setSearchParams({ tab })
    setSearchQuery('') // Reset search when switching tabs
    setCurrentPage(1) // Reset pagination
  }

  // Filter agents by search query
  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agents
    const query = searchQuery.toLowerCase()
    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(query) ||
        agent.description?.toLowerCase().includes(query)
    )
  }, [agents, searchQuery])

  // Paginate filtered agents
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage)
  const paginatedAgents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredAgents.slice(start, start + itemsPerPage)
  }, [filteredAgents, currentPage, itemsPerPage])

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    setStoredViewMode(mode)
  }

  const handleDeleteAgent = (agent: AgentComponent) => {
    setDeleteAgentModal({ isOpen: true, agent })
  }

  const handleExportAgent = async (agent: AgentComponent) => {
    try {
      const exportData = await api.exportAgentComponent(agent.id)
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${agent.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export agent:', error)
      alert('Failed to export agent. Please try again.')
    }
  }

  const handleDuplicateAgent = async (agent: AgentComponent) => {
    try {
      await api.duplicateAgentComponent(agent.id)
      queryClient.invalidateQueries({ queryKey: ['agent-components', projectId, 'all'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    } catch (error) {
      console.error('Failed to duplicate agent:', error)
      alert('Failed to duplicate agent. Please try again.')
    }
  }

  // Calculate relative time
  const getRelativeTime = (date: string) => {
    const now = new Date()
    const updated = new Date(date)
    const diffMs = now.getTime() - updated.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return updated.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 dark:border-neutral-600 border-t-gray-600 dark:border-t-gray-300" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-sm">
          Project not found or failed to load.
          <Link to="/dashboard" className="ml-2 underline">
            Go back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, filteredAgents.length)

  return (
    <div className="h-full flex flex-col bg-white dark:bg-neutral-950 transition-colors duration-200">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg font-medium text-gray-900 dark:text-white">{project.name}</h1>
          </div>

          {/* Action Button - changes based on tab */}
          {currentTab === 'agents' && (
            <Link
              to={`/create?project=${projectId}`}
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Agent
            </Link>
          )}
          {currentTab === 'workflows' && (
            <button
              onClick={() => setCreateWorkflowModal(true)}
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Workflow
            </button>
          )}
          {currentTab === 'mcp-servers' && (
            <button
              onClick={() => setMcpConfigModal(true)}
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add MCP Server
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-4 border-b border-gray-200 dark:border-neutral-700">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => setTab('agents')}
              className={`py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                currentTab === 'agents'
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Dog className="w-4 h-4" />
              Agents
              {agents.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 text-xs rounded-full">
                  {agents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('workflows')}
              className={`py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                currentTab === 'workflows'
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              Workflows
              {workflowsCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 text-xs rounded-full">
                  {workflowsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('mcp-servers')}
              className={`py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                currentTab === 'mcp-servers'
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Server className="w-4 h-4" />
              MCP Servers
              {mcpServersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 text-xs rounded-full">
                  {mcpServersCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {currentTab === 'agents' && (
        <>
          {/* Toolbar */}
          <div className="px-6 py-3 flex items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-neutral-800 border-0 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-neutral-600"
              />
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300'
                }`}
                title="List view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300'
                }`}
                title="Grid view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto px-6">
            {/* Empty state */}
            {agents.length === 0 && (
              <div className="text-center py-16">
                <Dog className="w-12 h-12 text-gray-300 dark:text-neutral-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-neutral-400 mb-4">No agents in this project yet</p>
                <Link
                  to={`/create?project=${projectId}`}
                  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/25 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create your first agent
                </Link>
              </div>
            )}

            {/* No search results */}
            {agents.length > 0 && filteredAgents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-neutral-400">No agents found matching "{searchQuery}"</p>
              </div>
            )}

            {/* List View */}
            {filteredAgents.length > 0 && viewMode === 'list' && (
              <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                {paginatedAgents.map((agent, index) => (
                  <AgentRow
                    key={agent.id}
                    agent={agent}
                    colorIndex={index}
                    getRelativeTime={getRelativeTime}
                    onDelete={handleDeleteAgent}
                    onExport={handleExportAgent}
                    onDuplicate={handleDuplicateAgent}
                  />
                ))}
              </div>
            )}

            {/* Grid View */}
            {filteredAgents.length > 0 && viewMode === 'grid' && (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
                {paginatedAgents.map((agent, index) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    colorIndex={index}
                    getRelativeTime={getRelativeTime}
                    onDelete={handleDeleteAgent}
                    onExport={handleExportAgent}
                    onDuplicate={handleDuplicateAgent}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredAgents.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between text-sm text-gray-500 dark:text-neutral-400">
              <span>
                {startItem}-{endItem} of {filteredAgents.length} agents
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-200 dark:border-neutral-700 rounded text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-neutral-600"
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <span>of {totalPages} pages</span>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {currentTab === 'workflows' && projectId && (
        <WorkflowsTab projectId={projectId} />
      )}

      {currentTab === 'mcp-servers' && projectId && (
        <MCPServersTab projectId={projectId} />
      )}

      {/* Delete Agent Modal */}
      {deleteAgentModal.isOpen && deleteAgentModal.agent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Agent</h2>
            <p className="text-gray-600 dark:text-neutral-400 text-sm mb-6">
              Are you sure you want to delete{' '}
              <span className="font-medium text-gray-900 dark:text-white">{deleteAgentModal.agent.name}</span>?
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteAgentModal({ isOpen: false, agent: null })}
                disabled={deleteAgentMutation.isPending}
                className="px-4 py-2 text-gray-700 dark:text-neutral-300 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteAgentModal.agent) {
                    deleteAgentMutation.mutate(deleteAgentModal.agent.id)
                  }
                }}
                disabled={deleteAgentMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
              >
                {deleteAgentMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModal.agent && (
        <ShareDeployModal
          agent={shareModal.agent}
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal({ isOpen: false, agent: null })}
        />
      )}

      {/* Template Gallery Modal */}
      {projectId && (
        <TemplateGalleryModal
          isOpen={createWorkflowModal}
          onClose={() => setCreateWorkflowModal(false)}
          projectId={projectId}
        />
      )}

      {/* MCP Config Modal */}
      {mcpConfigModal && projectId && (
        <MCPConfigModal
          projectId={projectId}
          workflows={workflowsData?.workflows || []}
          servers={mcpServersData?.mcp_servers || []}
          onClose={() => setMcpConfigModal(false)}
        />
      )}
    </div>
  )
}

// Agent Row Component (List View)
function AgentRow({
  agent,
  colorIndex,
  getRelativeTime,
  onDelete,
  onExport,
  onDuplicate,
}: {
  agent: AgentComponent
  colorIndex: number
  getRelativeTime: (date: string) => string
  onDelete: (agent: AgentComponent) => void
  onExport: (agent: AgentComponent) => void
  onDuplicate: (agent: AgentComponent) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const gradientColor = getGradientColor(colorIndex)

  return (
    <div className="flex items-center gap-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group">
      {/* Avatar with Gradient Background */}
      <div className={`w-8 h-8 rounded-full ${agent.avatar_url ? 'bg-violet-100 dark:bg-violet-900/40' : `bg-gradient-to-br ${gradientColor}`} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
        {agent.avatar_url ? (
          <img
            src={agent.avatar_url}
            alt={agent.name}
            className="w-full h-full object-contain scale-150"
          />
        ) : (
          <Dog className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Name and timestamp */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <Link
          to={`/playground/${agent.id}`}
          className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-neutral-300 truncate"
        >
          {agent.name}
        </Link>
        {agent.is_published && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-violet-500 to-purple-500 text-white flex-shrink-0">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Live
          </span>
        )}
        <span className="text-gray-400 dark:text-neutral-500 text-sm flex-shrink-0">
          Edited {getRelativeTime(agent.updated_at)}
        </span>
      </div>

      {/* Menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
          className="p-1.5 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 rounded transition-colors opacity-0 group-hover:opacity-100"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg z-10 py-1">
            <Link
              to={`/edit/${agent.id}`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit details
            </Link>
            <button
              onClick={() => { setMenuOpen(false); onExport(agent) }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            <button
              onClick={() => { setMenuOpen(false); onDuplicate(agent) }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Duplicate
            </button>
            <div className="border-t border-gray-100 dark:border-neutral-700 my-1" />
            <button
              onClick={() => { setMenuOpen(false); onDelete(agent) }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Agent Card Component (Grid View)
function AgentCard({
  agent,
  colorIndex,
  getRelativeTime,
  onDelete,
  onExport,
  onDuplicate,
}: {
  agent: AgentComponent
  colorIndex: number
  getRelativeTime: (date: string) => string
  onDelete: (agent: AgentComponent) => void
  onExport: (agent: AgentComponent) => void
  onDuplicate: (agent: AgentComponent) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const gradientColor = getGradientColor(colorIndex)
  const isLive = agent.is_published

  return (
    <div className={`${isLive ? 'bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-violet-950/30 dark:via-neutral-800 dark:to-purple-950/30 border-violet-400 dark:border-violet-600' : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700'} border rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all group`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full ${agent.avatar_url ? 'bg-violet-100 dark:bg-violet-900/40' : `bg-gradient-to-br ${gradientColor}`} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
            {agent.avatar_url ? (
              <img
                src={agent.avatar_url}
                alt={agent.name}
                className="w-full h-full object-contain scale-150"
              />
            ) : (
              <Dog className="w-5 h-5 text-white" />
            )}
          </div>
          {isLive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-violet-500 to-purple-500 text-white">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
            className="p-1 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg z-10 py-1">
              <Link
                to={`/edit/${agent.id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit details
              </Link>
              <button
                onClick={() => { setMenuOpen(false); onExport(agent) }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDuplicate(agent) }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Duplicate
              </button>
              <div className="border-t border-gray-100 dark:border-neutral-700 my-1" />
              <button
                onClick={() => { setMenuOpen(false); onDelete(agent) }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <Link to={`/playground/${agent.id}`} className="block">
        <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate hover:text-gray-600 dark:hover:text-neutral-300">
          {agent.name}
        </h3>
        <p className="text-sm text-gray-400 dark:text-neutral-500">
          Edited {getRelativeTime(agent.updated_at)}
        </p>
      </Link>
    </div>
  )
}
