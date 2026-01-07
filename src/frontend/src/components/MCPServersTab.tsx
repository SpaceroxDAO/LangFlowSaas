import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Server, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { api } from '@/lib/api'
import type { MCPServer } from '@/types'

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

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; server: MCPServer | null }>({
    isOpen: false,
    server: null,
  })
  const [createModal, setCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch MCP servers
  const { data, isLoading } = useQuery({
    queryKey: ['mcp-servers', projectId],
    queryFn: () => api.listMCPServers(projectId),
  })

  // Fetch restart status
  const { data: restartStatus } = useQuery({
    queryKey: ['restart-status'],
    queryFn: () => api.getRestartStatus(),
    refetchInterval: 5000, // Poll every 5 seconds
  })

  // Delete MCP server mutation
  const deleteMutation = useMutation({
    mutationFn: (serverId: string) => api.deleteMCPServer(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['restart-status'] })
      setDeleteModal({ isOpen: false, server: null })
    },
  })

  // Enable/Disable mutations
  const enableMutation = useMutation({
    mutationFn: (serverId: string) => api.enableMCPServer(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['restart-status'] })
    },
  })

  const disableMutation = useMutation({
    mutationFn: (serverId: string) => api.disableMCPServer(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['restart-status'] })
    },
  })

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: () => api.syncMCPServers(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['restart-status'] })
    },
  })

  const servers = data?.mcp_servers || []
  const pendingChanges = restartStatus?.pending_changes || []
  const hasPendingChanges = pendingChanges.length > 0

  // Filter servers by search query
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

  const handleDeleteServer = (server: MCPServer) => {
    setDeleteModal({ isOpen: true, server })
  }

  const handleToggleServer = async (server: MCPServer) => {
    if (server.is_enabled) {
      disableMutation.mutate(server.id)
    } else {
      enableMutation.mutate(server.id)
    }
  }

  // Health status icon
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
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600" />
      </div>
    )
  }

  return (
    <>
      {/* Pending Changes Banner */}
      {hasPendingChanges && (
        <div className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {pendingChanges.length} pending change{pendingChanges.length > 1 ? 's' : ''} require a restart
              </p>
              <p className="text-xs text-amber-600">
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

      {/* Toolbar */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
            placeholder="Search MCP servers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6">
        {/* Empty state */}
        {servers.length === 0 && (
          <div className="text-center py-16">
            <Server className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No MCP servers configured yet</p>
            <button
              onClick={() => setCreateModal(true)}
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add your first MCP server
            </button>
          </div>
        )}

        {/* No search results */}
        {servers.length > 0 && filteredServers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No servers found matching "{searchQuery}"</p>
          </div>
        )}

        {/* Server List */}
        {filteredServers.length > 0 && (
          <div className="space-y-3 pb-6">
            {filteredServers.map((server, index) => (
              <MCPServerCard
                key={server.id}
                server={server}
                colorIndex={index}
                onToggle={handleToggleServer}
                onDelete={handleDeleteServer}
                getHealthIcon={getHealthIcon}
                isToggling={enableMutation.isPending || disableMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Server Modal */}
      {deleteModal.isOpen && deleteModal.server && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Delete MCP Server</h2>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete{' '}
              <span className="font-medium text-gray-900">{deleteModal.server.name}</span>?
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ isOpen: false, server: null })}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteModal.server) {
                    deleteMutation.mutate(deleteModal.server.id)
                  }
                }}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Server Modal */}
      {createModal && (
        <CreateMCPServerModal
          projectId={projectId}
          onClose={() => setCreateModal(false)}
          onSuccess={() => {
            setCreateModal(false)
            queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
            queryClient.invalidateQueries({ queryKey: ['restart-status'] })
          }}
        />
      )}
    </>
  )
}

// MCP Server Card Component
function MCPServerCard({
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
    <div className={`bg-white border rounded-lg p-4 transition-all ${server.is_enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0`}>
          <Server className="w-5 h-5 text-white" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{server.name}</h3>
            {getHealthIcon(server.health_status)}
            {server.needs_sync && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                Pending sync
              </span>
            )}
          </div>
          {server.description && (
            <p className="text-sm text-gray-500 mt-1">{server.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span>Type: {server.server_type}</span>
            <span>Command: {server.command}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Toggle Switch */}
          <button
            onClick={() => onToggle(server)}
            disabled={isToggling}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
              server.is_enabled ? 'bg-violet-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                server.is_enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                <button
                  onClick={() => { setMenuOpen(false); onDelete(server) }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
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
      </div>
    </div>
  )
}

// Create MCP Server Modal
function CreateMCPServerModal({
  projectId,
  onClose,
  onSuccess,
}: {
  projectId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [_mode] = useState<'template' | 'custom'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [name, setName] = useState('')
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [isCreating, setIsCreating] = useState(false)

  // Fetch templates
  const { data: templatesData } = useQuery({
    queryKey: ['mcp-templates'],
    queryFn: () => api.getMCPServerTemplates(),
  })

  const templates = templatesData?.templates || []
  const selectedTemplateData = templates.find((t) => t.name === selectedTemplate)

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      if (selectedTemplate) {
        await api.createMCPServerFromTemplate({
          template_name: selectedTemplate,
          name: name || undefined,
          credentials: Object.keys(credentials).length > 0 ? credentials : undefined,
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add MCP Server</h2>

        {/* Template Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a template
          </label>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <button
                key={template.name}
                onClick={() => setSelectedTemplate(template.name)}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  selectedTemplate === template.name
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900 text-sm">{template.display_name}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        {selectedTemplate && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Server Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedTemplateData?.display_name || 'My Server'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* Credentials */}
            {selectedTemplateData && Object.keys(selectedTemplateData.env_schema).length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Configuration
                </label>
                <div className="space-y-3">
                  {Object.entries(selectedTemplateData.env_schema).map(([key, schema]) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-600 mb-1">
                        {key} {schema.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={key.toLowerCase().includes('key') || key.toLowerCase().includes('password') ? 'password' : 'text'}
                        value={credentials[key] || ''}
                        onChange={(e) => setCredentials({ ...credentials, [key]: e.target.value })}
                        placeholder={schema.description}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">{schema.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isCreating || !selectedTemplate}
            className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors text-sm disabled:opacity-50"
          >
            {isCreating ? 'Adding...' : 'Add Server'}
          </button>
        </div>
      </div>
    </div>
  )
}

export { CreateMCPServerModal }
