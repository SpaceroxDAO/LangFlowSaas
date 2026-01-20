/**
 * Mission Canvas Page
 *
 * Combines the mission step panel with the Langflow canvas for guided learning.
 * Handles canvas events via postMessage for automatic step validation.
 */
import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@/lib/api'
import type { MissionWithProgress, CanvasEvent, CanvasStartResponse } from '@/types'
import { MissionStepPanel } from '@/components/MissionStepPanel'

export function MissionCanvasPage() {
  const { missionId } = useParams<{ missionId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // State
  const [mission, setMission] = useState<MissionWithProgress | null>(null)
  const [canvasData, setCanvasData] = useState<CanvasStartResponse | null>(null)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompletingStep, setIsCompletingStep] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get flow and filter from URL params (fallback) or canvas data
  const flowId = searchParams.get('flow') || canvasData?.flow_id
  const componentFilter = searchParams.get('filter') || canvasData?.component_filter

  // Get ui_config from mission data
  const uiConfig = mission?.mission?.ui_config as Record<string, boolean> | undefined

  // Build canvas URL with component filter and ui_config
  const langflowUrl = import.meta.env.VITE_LANGFLOW_URL || 'http://localhost:7861'
  const buildCanvasUrl = () => {
    if (!flowId) return null
    const params = new URLSearchParams()
    if (componentFilter) {
      params.set('filter_components', componentFilter)
    }
    if (uiConfig) {
      params.set('ui_config', encodeURIComponent(JSON.stringify(uiConfig)))
    }
    const queryString = params.toString()
    return `${langflowUrl}/flow/${flowId}${queryString ? `?${queryString}` : ''}`
  }
  const canvasUrl = buildCanvasUrl()

  // Load mission and start canvas mode
  useEffect(() => {
    if (!missionId) return

    const initMission = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Start mission with canvas
        const result = await api.startMissionWithCanvas(missionId)
        setCanvasData(result)

        // Get full mission data
        const missionData = await api.getMission(missionId)
        setMission(missionData)

        // Update URL with flow and filter params if not present
        if (!searchParams.get('flow') && result.flow_id) {
          const params = new URLSearchParams(searchParams)
          params.set('flow', result.flow_id)
          if (result.component_filter) {
            params.set('filter', result.component_filter)
          }
          navigate(`/mission/${missionId}/canvas?${params.toString()}`, { replace: true })
        }
      } catch (err) {
        console.error('Failed to start mission canvas:', err)
        setError(err instanceof Error ? err.message : 'Failed to load mission')
      } finally {
        setIsLoading(false)
      }
    }

    initMission()
  }, [missionId, navigate, searchParams])

  // Handle canvas events from iframe via postMessage
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Only process messages from Langflow overlay
      if (event.data?.source !== 'langflow-overlay') return
      if (!missionId || !mission) return

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
        await api.completeMissionStep(missionId, stepId)

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

  // Handle iframe load
  const [isCanvasLoading, setIsCanvasLoading] = useState(true)
  const handleIframeLoad = useCallback(() => {
    setIsCanvasLoading(false)
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-neutral-400">Preparing your mission...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unable to Load Mission</h2>
          <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard/missions')}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Return to Missions
          </button>
        </div>
      </div>
    )
  }

  // No mission data
  if (!mission || !canvasUrl) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-neutral-400">Mission not found</p>
          <button
            onClick={() => navigate('/dashboard/missions')}
            className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Return to Missions
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex bg-gray-100 dark:bg-neutral-950">
      {/* Side Panel */}
      <div
        className={`transition-all duration-300 flex-shrink-0 ${isPanelCollapsed ? 'w-12' : 'w-80'}`}
      >
        <MissionStepPanel
          mission={mission}
          isCollapsed={isPanelCollapsed}
          onToggleCollapse={() => setIsPanelCollapsed(!isPanelCollapsed)}
          onCompleteStep={handleCompleteStep}
          isLoading={isCompletingStep}
          iframeRef={iframeRef}
        />
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Canvas Header */}
        <div className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/missions')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              title="Back to missions"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="font-semibold text-gray-900 dark:text-white">{mission.mission.name}</h1>
              <p className="text-xs text-gray-500 dark:text-neutral-400">Build your flow to complete the mission</p>
            </div>
          </div>

          {/* Mission Mode Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-medium rounded-full">
              Mission Mode
            </span>
          </div>
        </div>

        {/* Canvas Loading State */}
        {isCanvasLoading && (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500 mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-neutral-400">Loading canvas...</p>
            </div>
          </div>
        )}

        {/* Langflow Canvas iframe */}
        <iframe
          ref={iframeRef}
          src={canvasUrl}
          className={`flex-1 w-full border-0 ${isCanvasLoading ? 'invisible h-0' : 'visible'}`}
          onLoad={handleIframeLoad}
          onError={() => {
            setIsCanvasLoading(false)
            console.error('Failed to load Langflow canvas')
          }}
          title={`${mission.mission.name} Canvas`}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  )
}

export default MissionCanvasPage
