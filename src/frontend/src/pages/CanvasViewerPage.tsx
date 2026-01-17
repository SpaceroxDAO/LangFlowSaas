import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '@/providers/DevModeProvider'
import { api } from '@/lib/api'
import { LangflowCanvasViewer } from '@/components/LangflowCanvasViewer'
import { MissionSidePanel } from '@/components/MissionSidePanel'
import { useTour, useShouldShowTour } from '@/providers/TourProvider'
import type { AgentComponent, Workflow, MissionWithProgress, CanvasEvent } from '@/types'

export function CanvasViewerPage() {
  // The ID can be either an agent component ID or a workflow ID
  const { agentId: id } = useParams<{ agentId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [agentComponent, setAgentComponent] = useState<AgentComponent | null>(null)
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [displayName, setDisplayName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { completeTour, currentDisclosureLevel, setDisclosureLevel } = useTour()
  const shouldShowTour = useShouldShowTour('canvas')

  // Mission state
  const missionId = searchParams.get('mission')
  const [mission, setMission] = useState<MissionWithProgress | null>(null)
  const [isMissionPanelOpen, setIsMissionPanelOpen] = useState(true)
  const [isCompletingStep, setIsCompletingStep] = useState(false)
  const [missionLoading, setMissionLoading] = useState(false)
  const [nextMission, setNextMission] = useState<{ id: string; name: string } | null>(null)

  // Iframe ref for mission postMessage communication
  const [iframeRef, setIframeRef] = useState<React.RefObject<HTMLIFrameElement> | null>(null)

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  useEffect(() => {
    async function fetchData() {
      if (!id) return

      try {
        setLoading(true)
        setError(null)

        // First, try to fetch as a workflow (since we're now passing workflow IDs from WorkflowsTab)
        try {
          const workflowData = await api.getWorkflow(id)
          setWorkflow(workflowData)
          setDisplayName(workflowData.name)

          // If workflow has agent_component_ids, fetch the first one for additional context
          if (workflowData.agent_component_ids?.length > 0) {
            try {
              const componentData = await api.getAgentComponent(workflowData.agent_component_ids[0])
              setAgentComponent(componentData)
              setDisplayName(componentData.name)
            } catch {
              // Agent component not found, use workflow name
            }
          }
          return
        } catch {
          // Not a workflow ID, try as agent component
        }

        // Fallback: try to fetch as agent component (legacy behavior)
        const componentData = await api.getAgentComponent(id)
        setAgentComponent(componentData)
        setDisplayName(componentData.name)

        // Find associated workflow
        const workflowsResult = await api.listWorkflows(undefined, 1, 100)
        const associatedWorkflow = workflowsResult.workflows.find(w =>
          w.agent_component_ids?.includes(id)
        )
        setWorkflow(associatedWorkflow || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load canvas')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Fetch mission data when missionId is present
  useEffect(() => {
    async function fetchMission() {
      if (!missionId) {
        setMission(null)
        return
      }

      try {
        setMissionLoading(true)
        const missionData = await api.getMission(missionId)
        setMission(missionData)
        // Open the panel when mission is loaded
        setIsMissionPanelOpen(true)
      } catch (err) {
        console.error('Failed to load mission:', err)
        // Remove mission param if mission not found
        searchParams.delete('mission')
        setSearchParams(searchParams)
      } finally {
        setMissionLoading(false)
      }
    }

    fetchMission()
  }, [missionId, searchParams, setSearchParams])

  // Find next available canvas-mode mission when current mission is completed
  useEffect(() => {
    async function findNextMission() {
      if (!mission || mission.progress.status !== 'completed') {
        setNextMission(null)
        return
      }

      try {
        // Fetch all missions to find the next canvas-mode one
        const response = await api.listMissions()
        const availableMissions = response.missions.filter(
          m =>
            m.progress.status !== 'completed' &&
            m.mission.id !== mission.mission.id &&
            m.mission.canvas_mode // Only show canvas-mode missions as next
        )

        if (availableMissions.length > 0) {
          // Pick the first available mission (could improve sorting logic later)
          const next = availableMissions[0]
          setNextMission({ id: next.mission.id, name: next.mission.name })
        } else {
          setNextMission(null)
        }
      } catch (err) {
        console.error('Failed to fetch next mission:', err)
        setNextMission(null)
      }
    }

    findNextMission()
  }, [mission])

  // Handle canvas events from iframe via postMessage (for mission step auto-validation)
  useEffect(() => {
    if (!missionId || !mission) return

    const handleMessage = async (event: MessageEvent) => {
      // Only process messages from Langflow overlay
      if (event.data?.source !== 'langflow-overlay') return

      const canvasEvent = event.data.event as CanvasEvent
      console.log('Canvas event received:', canvasEvent)

      try {
        // Send event to backend for validation
        const response = await api.sendCanvasEvent(missionId, canvasEvent)

        // If step was auto-completed, refresh mission data
        if (response.step_completed) {
          const updatedMission = await api.getMission(missionId)
          setMission(updatedMission)
        }
      } catch (err) {
        console.error('Failed to process canvas event:', err)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [missionId, mission])

  // Handle manual step completion
  const handleCompleteStep = useCallback(
    async (stepId: number) => {
      if (!missionId || isCompletingStep) return

      try {
        setIsCompletingStep(true)
        await api.completeMissionStep(missionId, { step_id: stepId })

        // Refresh mission data
        const updatedMission = await api.getMission(missionId)
        setMission(updatedMission)
      } catch (err) {
        console.error('Failed to complete step:', err)
      } finally {
        setIsCompletingStep(false)
      }
    },
    [missionId, isCompletingStep]
  )

  // Handle uncompleting a step
  const handleUncompleteStep = useCallback(
    async (stepId: number) => {
      if (!missionId || isCompletingStep) return

      try {
        setIsCompletingStep(true)
        await api.uncompleteMissionStep(missionId, { step_id: stepId })

        // Refresh mission data
        const updatedMission = await api.getMission(missionId)
        setMission(updatedMission)
      } catch (err) {
        console.error('Failed to uncomplete step:', err)
      } finally {
        setIsCompletingStep(false)
      }
    },
    [missionId, isCompletingStep]
  )

  // Handle resetting mission progress
  const handleResetMission = useCallback(async () => {
    if (!missionId || isCompletingStep) return

    try {
      setIsCompletingStep(true)
      await api.resetMissionProgress(missionId)

      // Refresh mission data
      const updatedMission = await api.getMission(missionId)
      setMission(updatedMission)
    } catch (err) {
      console.error('Failed to reset mission:', err)
    } finally {
      setIsCompletingStep(false)
    }
  }, [missionId, isCompletingStep])

  // Handle closing mission panel (remove mission param from URL)
  const handleCloseMission = useCallback(() => {
    searchParams.delete('mission')
    setSearchParams(searchParams)
    setMission(null)
    setIsMissionPanelOpen(false)
  }, [searchParams, setSearchParams])

  // Handle starting the next mission
  const handleStartNextMission = useCallback(async (nextMissionId: string) => {
    try {
      // Start the next mission and get canvas data
      const result = await api.startMissionWithCanvas(nextMissionId)

      if (result.workflow_id) {
        // Navigate to canvas with the new mission
        navigate(`/canvas/${result.workflow_id}?mission=${nextMissionId}`)
      } else {
        // Fallback to missions page
        navigate('/dashboard/missions')
      }
    } catch (err) {
      console.error('Failed to start next mission:', err)
      navigate('/dashboard/missions')
    }
  }, [navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading canvas...</p>
        </div>
      </div>
    )
  }

  if (error || (!agentComponent && !workflow)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Couldn't Load Canvas</h2>
          <p className="text-gray-600 mb-4">{error || 'Workflow or agent not found'}</p>
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

  // Check if we have a Langflow flow ID
  if (!workflow?.langflow_flow_id) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Flow Available</h2>
          <p className="text-gray-600 mb-4">
            This workflow doesn't have an AI canvas yet. The flow may need to be created first.
          </p>
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

  // Build component filter from mission data
  const componentFilter = mission?.mission.component_pack?.allowed_components?.join(',')

  // Extract ui_config from mission for canvas visibility settings
  const uiConfig = mission?.mission.ui_config as { hide_sidebar?: boolean; hide_minimap?: boolean; hide_toolbar?: boolean } | undefined

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Viewer with Mission Panel */}
      <div className="flex-1 flex">
        {/* Main Canvas Area */}
        <div className="flex-1 min-w-0">
          <LangflowCanvasViewer
            flowId={workflow.langflow_flow_id}
            agentName={displayName || workflow.name}
            level={currentDisclosureLevel}
            showTour={shouldShowTour && !missionId}
            onTourComplete={() => completeTour('canvas')}
            onLevelChange={setDisclosureLevel}
            componentFilter={componentFilter}
            uiConfig={uiConfig}
            onIframeRef={setIframeRef}
          />
        </div>

        {/* Mission Side Panel */}
        {mission && !missionLoading && (
          <MissionSidePanel
            mission={mission}
            isOpen={isMissionPanelOpen}
            onToggle={() => setIsMissionPanelOpen(!isMissionPanelOpen)}
            onCompleteStep={handleCompleteStep}
            onUncompleteStep={handleUncompleteStep}
            onReset={handleResetMission}
            onClose={handleCloseMission}
            onStartNextMission={handleStartNextMission}
            nextMission={nextMission}
            isLoading={isCompletingStep}
            iframeRef={iframeRef ?? undefined}
          />
        )}
      </div>
    </div>
  )
}

export default CanvasViewerPage
