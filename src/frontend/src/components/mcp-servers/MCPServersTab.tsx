import React, { useState } from 'react'
import { Server, AlertTriangle, RefreshCw, Plus, Search, List, LayoutGrid } from 'lucide-react'
import { useMCPServers, useFilteredServers } from './useMCPServers'
import { MCPServerList } from './MCPServerList'
import { MCPServerGrid } from './MCPServerGrid'
import { MCPConfigModal } from './MCPServerModal'
import { getHealthIcon } from './utils'
import type { MCPServersTabProps, ViewMode } from './types'

export function MCPServersTab({ projectId }: MCPServersTabProps) {
  const [mcpModalOpen, setMcpModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const {
    servers,
    workflows,
    pendingChanges,
    hasPendingChanges,
    isLoading,
    togglingServerId,
    syncMutation,
    handleToggleServer,
    handleDeleteServer,
  } = useMCPServers(projectId)

  const filteredServers = useFilteredServers(servers, searchQuery)

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
            <MCPServerList
              servers={filteredServers}
              onToggle={handleToggleServer}
              onDelete={handleDeleteServer}
              getHealthIcon={getHealthIcon}
              togglingServerId={togglingServerId}
            />
          ) : (
            <MCPServerGrid
              servers={filteredServers}
              onToggle={handleToggleServer}
              onDelete={handleDeleteServer}
              getHealthIcon={getHealthIcon}
              togglingServerId={togglingServerId}
            />
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
