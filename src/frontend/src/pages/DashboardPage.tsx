import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Agent } from '@/types'

export function DashboardPage() {
  const { getToken } = useAuth()

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  const { data, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: () => api.listAgents(),
  })

  const agents = data?.agents || []

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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
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
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No agents yet</h2>
          <p className="text-gray-600 mb-6">Create your first AI agent to get started</p>
          <Link
            to="/create"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Your First Agent
          </Link>
        </div>
      )}

      {/* Agent grid */}
      {agents.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent: Agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  )
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <span className="text-blue-600 font-bold text-lg">
            {agent.name.charAt(0).toUpperCase()}
          </span>
        </div>
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
        {agent.description || agent.qa_who.substring(0, 100)}...
      </p>

      <div className="flex gap-2">
        <Link
          to={`/playground/${agent.id}`}
          className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          Chat
        </Link>
        <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
