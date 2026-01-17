import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { MissionCard } from '@/components/MissionCard'
import { MissionStepGuide } from '@/components/MissionStepGuide'
import type { MissionWithProgress } from '@/types'

export function MissionsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeMission, setActiveMission] = useState<MissionWithProgress | null>(null)

  // Fetch missions
  const { data, isLoading, error } = useQuery({
    queryKey: ['missions', selectedCategory],
    queryFn: () => api.listMissions(selectedCategory || undefined),
  })

  // Start mission mutation
  const startMutation = useMutation({
    mutationFn: (missionId: string) => api.startMission(missionId),
    onSuccess: (_, missionId) => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      // Open the step guide for the started mission
      const mission = data?.missions.find(m => m.mission.id === missionId)
      if (mission) {
        // Refresh to get updated progress
        queryClient.invalidateQueries({ queryKey: ['missions'] }).then(() => {
          const updated = queryClient.getQueryData<{ missions: MissionWithProgress[] }>(['missions', selectedCategory])
          const updatedMission = updated?.missions.find(m => m.mission.id === missionId)
          if (updatedMission) {
            setActiveMission(updatedMission)
          }
        })
      }
    },
  })

  // Complete step mutation
  const completeStepMutation = useMutation({
    mutationFn: ({ missionId, stepId }: { missionId: string; stepId: number }) =>
      api.completeMissionStep(missionId, { step_id: stepId }),
    onSuccess: (result, { missionId }) => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      // Update active mission with new progress
      if (activeMission) {
        setActiveMission({
          ...activeMission,
          progress: {
            ...activeMission.progress,
            status: result.status,
            current_step: result.current_step,
            completed_steps: result.completed_steps,
          },
        })
      }
    },
  })

  // Reset progress mutation
  const resetMutation = useMutation({
    mutationFn: (missionId: string) => api.resetMissionProgress(missionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      setActiveMission(null)
    },
  })

  const missions = data?.missions || []
  const categories = data?.categories || []
  const stats = data?.stats

  // Filter missions by category
  const filteredMissions = selectedCategory
    ? missions.filter(m => m.mission.category === selectedCategory)
    : missions

  // Separate by status
  const inProgressMissions = filteredMissions.filter(m => m.progress.status === 'in_progress')
  const notStartedMissions = filteredMissions.filter(m => m.progress.status === 'not_started')
  const completedMissions = filteredMissions.filter(m => m.progress.status === 'completed')

  // Navigate to canvas with mission panel
  const navigateToCanvasMission = async (mission: MissionWithProgress) => {
    try {
      // Start the mission and get canvas data including workflow_id
      const result = await api.startMissionWithCanvas(mission.mission.id)

      if (result.workflow_id) {
        // Navigate to canvas page with mission parameter
        navigate(`/canvas/${result.workflow_id}?mission=${mission.mission.id}`)
      } else {
        // Fallback: show error or use old behavior
        console.error('No workflow_id returned from start-canvas')
        setActiveMission(mission)
      }
    } catch (err) {
      console.error('Failed to start canvas mission:', err)
      // Fallback to regular step guide
      setActiveMission(mission)
    }
  }

  const handleStart = (mission: MissionWithProgress) => {
    // For canvas_mode missions, navigate to the canvas page with mission panel
    if (mission.mission.canvas_mode) {
      navigateToCanvasMission(mission)
      return
    }
    startMutation.mutate(mission.mission.id)
  }

  const handleContinue = (mission: MissionWithProgress) => {
    // For canvas_mode missions, navigate to the canvas page with mission panel
    if (mission.mission.canvas_mode) {
      navigateToCanvasMission(mission)
      return
    }
    setActiveMission(mission)
  }

  const handleView = (mission: MissionWithProgress) => {
    // For canvas_mode missions, navigate to the canvas page with mission panel
    if (mission.mission.canvas_mode) {
      navigateToCanvasMission(mission)
      return
    }
    setActiveMission(mission)
  }

  const handleCompleteStep = (stepId: number) => {
    if (activeMission) {
      completeStepMutation.mutate({
        missionId: activeMission.mission.id,
        stepId,
      })
    }
  }

  const handleReset = () => {
    if (activeMission) {
      resetMutation.mutate(activeMission.mission.id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading missions...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Failed to load missions</h3>
          <p className="text-gray-500">{(error as Error).message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Missions</h1>
              <p className="text-gray-600 mt-1">Build your AI skills step by step</p>
            </div>

            {/* Stats */}
            {stats && (
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-600">{stats.completed}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
                  <div className="text-xs text-gray-500">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400">{stats.not_started}</div>
                  <div className="text-xs text-gray-500">Not Started</div>
                </div>
                <div className="ml-4 w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      strokeDasharray={`${stats.completion_percent}, 100`}
                    />
                  </svg>
                  <div className="text-center -mt-14 text-sm font-bold text-gray-700">
                    {stats.completion_percent}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Missions
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* In Progress Section */}
        {inProgressMissions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Continue Where You Left Off
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inProgressMissions.map(mission => (
                <MissionCard
                  key={mission.mission.id}
                  mission={mission}
                  onStart={() => handleStart(mission)}
                  onContinue={() => handleContinue(mission)}
                  onView={() => handleView(mission)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Not Started Section */}
        {notStartedMissions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Available Missions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notStartedMissions.map(mission => (
                <MissionCard
                  key={mission.mission.id}
                  mission={mission}
                  onStart={() => handleStart(mission)}
                  onContinue={() => handleContinue(mission)}
                  onView={() => handleView(mission)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Section */}
        {completedMissions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Completed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedMissions.map(mission => (
                <MissionCard
                  key={mission.mission.id}
                  mission={mission}
                  onStart={() => handleStart(mission)}
                  onContinue={() => handleContinue(mission)}
                  onView={() => handleView(mission)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredMissions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No missions found</h3>
            <p className="text-gray-500">Check back later for new learning missions.</p>
          </div>
        )}
      </div>

      {/* Step Guide Modal */}
      {activeMission && (
        <MissionStepGuide
          mission={activeMission}
          onCompleteStep={handleCompleteStep}
          onReset={handleReset}
          onClose={() => setActiveMission(null)}
          isLoading={completeStepMutation.isPending || resetMutation.isPending}
        />
      )}
    </div>
  )
}
