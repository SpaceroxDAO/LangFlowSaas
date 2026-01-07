import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/providers/DevModeProvider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ShareDeployModal } from '@/components/ShareDeployModal'
import type { AgentComponent } from '@/types'

export function DashboardPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; agent: AgentComponent | null }>({
    isOpen: false,
    agent: null,
  })
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; agent: AgentComponent | null }>({
    isOpen: false,
    agent: null,
  })

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Fetch agent components (new table)
  const { data, isLoading, error } = useQuery({
    queryKey: ['agent-components'],
    queryFn: () => api.listAgentComponents(undefined, 1, 100),
  })

  const deleteMutation = useMutation({
    mutationFn: (agentId: string) => api.deleteAgentComponent(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-components'] })
      setDeleteModal({ isOpen: false, agent: null })
    },
  })

  const handleDeleteClick = (agent: AgentComponent) => {
    setDeleteModal({ isOpen: true, agent })
  }

  const handleShareClick = (agent: AgentComponent) => {
    setShareModal({ isOpen: true, agent })
  }

  const handleConfirmDelete = () => {
    if (deleteModal.agent) {
      deleteMutation.mutate(deleteModal.agent.id)
    }
  }

  const handleCancelDelete = () => {
    if (!deleteMutation.isPending) {
      setDeleteModal({ isOpen: false, agent: null })
    }
  }

  const agents = data?.agent_components || []

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Agents</h1>
          <p className="text-gray-600 mt-1">Manage and chat with your AI agents</p>
        </div>
        <Link
          to="/create"
          className="bg-violet-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Agent
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Failed to load agents. Please try again.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && agents.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No agents yet</h2>
          <p className="text-gray-600 mb-6">Create your first AI agent to get started</p>
          <Link
            to="/create"
            className="inline-block bg-violet-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-violet-600 transition-colors"
          >
            Create Your First Agent
          </Link>
        </div>
      )}

      {/* Agent grid */}
      {agents.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent: AgentComponent) => (
            <AgentCard key={agent.id} agent={agent} onDelete={handleDeleteClick} onShare={handleShareClick} />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.agent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete Agent</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium text-gray-900">{deleteModal.agent.name}</span>?
              This action cannot be undone.
            </p>

            {deleteMutation.isError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                Something went wrong. Please try again.
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleteMutation.isPending && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                )}
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share & Deploy Modal */}
      {shareModal.agent && (
        <ShareDeployModal
          agent={shareModal.agent}
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal({ isOpen: false, agent: null })}
        />
      )}
    </div>
  )
}

function AgentCard({ agent, onDelete, onShare }: { agent: AgentComponent; onDelete: (agent: AgentComponent) => void; onShare: (agent: AgentComponent) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        {agent.avatar_url ? (
          <div className="w-12 h-12 rounded-xl overflow-hidden">
            <img src={agent.avatar_url} alt={agent.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
            <span className="text-violet-600 font-bold text-lg">
              {agent.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            agent.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {agent.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{agent.name}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {agent.description || `${agent.qa_who?.substring(0, 100) ?? 'No description'}...`}
      </p>

      <div className="flex gap-2">
        <Link
          to={`/playground/${agent.id}`}
          className="flex-1 bg-violet-500 text-white text-center py-2 rounded-lg font-medium hover:bg-violet-600 transition-colors text-sm"
        >
          Chat
        </Link>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
              <Link
                to={`/edit/${agent.id}`}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onShare(agent)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Share
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onDelete(agent)
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
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
  )
}
