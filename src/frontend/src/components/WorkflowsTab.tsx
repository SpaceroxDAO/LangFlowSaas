import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GitBranch, ExternalLink } from 'lucide-react'
import { api } from '@/lib/api'
import { TemplateGalleryModal } from '@/components/TemplateGallery'
import type { Workflow } from '@/types'

interface WorkflowsTabProps {
  projectId: string
}

// Generate gradient color based on index
const getGradientColor = (index: number) => {
  const colors = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-violet-400',
    'from-green-500 to-emerald-400',
    'from-orange-500 to-amber-400',
    'from-pink-500 to-rose-400',
    'from-indigo-500 to-blue-400',
    'from-teal-500 to-cyan-400',
    'from-red-500 to-pink-400',
  ]
  return colors[index % colors.length]
}

// Persist view mode in localStorage
const getStoredViewMode = () => (localStorage.getItem('workflowViewMode') as 'grid' | 'list') || 'list'
const setStoredViewMode = (mode: 'grid' | 'list') => localStorage.setItem('workflowViewMode', mode)

export function WorkflowsTab({ projectId }: WorkflowsTabProps) {
  const queryClient = useQueryClient()

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; workflow: Workflow | null }>({
    isOpen: false,
    workflow: null,
  })
  const [createModal, setCreateModal] = useState(false)

  // Toolbar state
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(getStoredViewMode)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Fetch workflows
  const { data, isLoading } = useQuery({
    queryKey: ['workflows', projectId],
    queryFn: () => api.listWorkflows(projectId),
  })

  // Delete workflow mutation
  const deleteWorkflowMutation = useMutation({
    mutationFn: (workflowId: string) => api.deleteWorkflow(workflowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows', projectId] })
      setDeleteModal({ isOpen: false, workflow: null })
    },
  })

  const workflows = data?.workflows || []

  // Filter workflows by search query
  const filteredWorkflows = useMemo(() => {
    if (!searchQuery.trim()) return workflows
    const query = searchQuery.toLowerCase()
    return workflows.filter(
      (workflow) =>
        workflow.name.toLowerCase().includes(query) ||
        workflow.description?.toLowerCase().includes(query)
    )
  }, [workflows, searchQuery])

  // Paginate filtered workflows
  const totalPages = Math.ceil(filteredWorkflows.length / itemsPerPage)
  const paginatedWorkflows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredWorkflows.slice(start, start + itemsPerPage)
  }, [filteredWorkflows, currentPage, itemsPerPage])

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    setStoredViewMode(mode)
  }

  const handleDeleteWorkflow = (workflow: Workflow) => {
    setDeleteModal({ isOpen: true, workflow })
  }

  const handleExportWorkflow = async (workflow: Workflow) => {
    try {
      const exportData = await api.exportWorkflow(workflow.id)
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${workflow.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_workflow.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export workflow:', error)
      alert('Failed to export workflow. Please try again.')
    }
  }

  const handleDuplicateWorkflow = async (workflow: Workflow) => {
    try {
      await api.duplicateWorkflow(workflow.id)
      queryClient.invalidateQueries({ queryKey: ['workflows', projectId] })
    } catch (error) {
      console.error('Failed to duplicate workflow:', error)
      alert('Failed to duplicate workflow. Please try again.')
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
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600" />
      </div>
    )
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, filteredWorkflows.length)

  return (
    <>
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
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleViewModeChange('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
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
              viewMode === 'grid' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
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
        {workflows.length === 0 && (
          <div className="text-center py-16">
            <GitBranch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No workflows in this project yet</p>
            <button
              onClick={() => setCreateModal(true)}
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create your first workflow
            </button>
          </div>
        )}

        {/* No search results */}
        {workflows.length > 0 && filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No workflows found matching "{searchQuery}"</p>
          </div>
        )}

        {/* List View */}
        {filteredWorkflows.length > 0 && viewMode === 'list' && (
          <div className="divide-y divide-gray-100">
            {paginatedWorkflows.map((workflow, index) => (
              <WorkflowRow
                key={workflow.id}
                workflow={workflow}
                colorIndex={index}
                getRelativeTime={getRelativeTime}
                onDelete={handleDeleteWorkflow}
                onExport={handleExportWorkflow}
                onDuplicate={handleDuplicateWorkflow}
              />
            ))}
          </div>
        )}

        {/* Grid View */}
        {filteredWorkflows.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
            {paginatedWorkflows.map((workflow, index) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                colorIndex={index}
                getRelativeTime={getRelativeTime}
                onDelete={handleDeleteWorkflow}
                onExport={handleExportWorkflow}
                onDuplicate={handleDuplicateWorkflow}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredWorkflows.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>
            {startItem}-{endItem} of {filteredWorkflows.length} workflows
          </span>
          <div className="flex items-center gap-2">
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
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
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Workflow Modal */}
      {deleteModal.isOpen && deleteModal.workflow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Delete Workflow</h2>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete{' '}
              <span className="font-medium text-gray-900">{deleteModal.workflow.name}</span>?
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ isOpen: false, workflow: null })}
                disabled={deleteWorkflowMutation.isPending}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteModal.workflow) {
                    deleteWorkflowMutation.mutate(deleteModal.workflow.id)
                  }
                }}
                disabled={deleteWorkflowMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
              >
                {deleteWorkflowMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Gallery Modal */}
      <TemplateGalleryModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        projectId={projectId}
      />
    </>
  )
}

// Workflow Row Component (List View)
function WorkflowRow({
  workflow,
  colorIndex,
  getRelativeTime,
  onDelete,
  onExport,
  onDuplicate,
}: {
  workflow: Workflow
  colorIndex: number
  getRelativeTime: (date: string) => string
  onDelete: (workflow: Workflow) => void
  onExport: (workflow: Workflow) => void
  onDuplicate: (workflow: Workflow) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const gradientColor = getGradientColor(colorIndex)

  return (
    <div className="flex items-center gap-4 py-3 hover:bg-gray-50 transition-colors group">
      {/* Gradient Icon */}
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0`}>
        <GitBranch className="w-4 h-4 text-white" />
      </div>

      {/* Name and timestamp */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <Link
          to={`/playground/workflow/${workflow.id}`}
          className="font-medium text-gray-900 hover:text-gray-600 truncate"
        >
          {workflow.name}
        </Link>
        <span className="text-gray-400 text-sm flex-shrink-0">
          Edited {getRelativeTime(workflow.updated_at)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
        <Link
          to={`/canvas/${workflow.id}`}
          className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
          title="Open in AI Canvas"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
          className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
            <Link
              to={`/canvas/${workflow.id}`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <ExternalLink className="w-4 h-4" />
              Open in AI Canvas
            </Link>
            <button
              onClick={() => { setMenuOpen(false); onExport(workflow) }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            <button
              onClick={() => { setMenuOpen(false); onDuplicate(workflow) }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Duplicate
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={() => { setMenuOpen(false); onDelete(workflow) }}
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
  )
}

// Workflow Card Component (Grid View)
function WorkflowCard({
  workflow,
  colorIndex,
  getRelativeTime,
  onDelete,
  onExport,
  onDuplicate,
}: {
  workflow: Workflow
  colorIndex: number
  getRelativeTime: (date: string) => string
  onDelete: (workflow: Workflow) => void
  onExport: (workflow: Workflow) => void
  onDuplicate: (workflow: Workflow) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const gradientColor = getGradientColor(colorIndex)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center`}>
          <GitBranch className="w-5 h-5 text-white" />
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
              <Link
                to={`/canvas/${workflow.id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4" />
                Open in AI Canvas
              </Link>
              <button
                onClick={() => { setMenuOpen(false); onExport(workflow) }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDuplicate(workflow) }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Duplicate
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => { setMenuOpen(false); onDelete(workflow) }}
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

      <Link to={`/playground/workflow/${workflow.id}`} className="block">
        <h3 className="font-medium text-gray-900 mb-1 truncate hover:text-gray-600">
          {workflow.name}
        </h3>
        <p className="text-sm text-gray-400">
          Edited {getRelativeTime(workflow.updated_at)}
        </p>
      </Link>
    </div>
  )
}

