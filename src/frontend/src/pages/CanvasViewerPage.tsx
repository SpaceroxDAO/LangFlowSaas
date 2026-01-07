import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/DevModeProvider'
import { api } from '@/lib/api'
import { LangflowCanvasViewer } from '@/components/LangflowCanvasViewer'
import { useTour, useShouldShowTour } from '@/providers/TourProvider'
import type { AgentComponent, Workflow } from '@/types'

export function CanvasViewerPage() {
  const { agentId } = useParams<{ agentId: string }>()
  const { getToken } = useAuth()
  const [agentComponent, setAgentComponent] = useState<AgentComponent | null>(null)
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { completeTour, currentDisclosureLevel, setDisclosureLevel } = useTour()
  const shouldShowTour = useShouldShowTour('canvas')

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  useEffect(() => {
    async function fetchData() {
      if (!agentId) return

      try {
        setLoading(true)
        // Fetch agent component
        const componentData = await api.getAgentComponent(agentId)
        setAgentComponent(componentData)

        // Find associated workflow
        const workflowsResult = await api.listWorkflows(undefined, 1, 100)
        const associatedWorkflow = workflowsResult.workflows.find(w =>
          w.agent_component_ids?.includes(agentId)
        )
        setWorkflow(associatedWorkflow || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agent')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [agentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading canvas...</p>
        </div>
      </div>
    )
  }

  if (error || !agentComponent) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Couldn't Load Canvas</h2>
          <p className="text-gray-600 mb-4">{error || 'Agent not found'}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Check if agent has an associated workflow with a Langflow flow ID
  if (!workflow?.langflow_flow_id) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Flow Available</h2>
          <p className="text-gray-600 mb-4">
            This agent doesn't have a Langflow canvas yet. Try creating a new agent to see the canvas viewer.
          </p>
          <Link
            to={`/playground/${agentId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
          >
            Go to Playground
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={`/playground/${agentId}`}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{agentComponent.name}'s Brain</h1>
              <p className="text-sm text-gray-500">Explore how your agent thinks and processes messages</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/playground/${agentId}`}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
            >
              Back to Chat
            </Link>
            <Link
              to={`/edit/${agentId}`}
              className="px-4 py-2 text-white bg-violet-500 rounded-lg hover:bg-violet-600 text-sm"
            >
              Edit Agent
            </Link>
          </div>
        </div>
      </div>

      {/* Canvas Viewer */}
      <div className="flex-1 p-4 bg-gray-50">
        <LangflowCanvasViewer
          flowId={workflow.langflow_flow_id}
          agentName={agentComponent.name}
          level={currentDisclosureLevel}
          showTour={shouldShowTour}
          onTourComplete={() => completeTour('canvas')}
          onLevelChange={setDisclosureLevel}
        />
      </div>
    </div>
  )
}

export default CanvasViewerPage
