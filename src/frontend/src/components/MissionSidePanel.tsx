/**
 * Mission Side Panel Component
 *
 * A collapsible right-side panel for showing mission step guidance
 * integrated into the canvas view.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MissionWithProgress } from '@/types'

interface NextMissionInfo {
  id: string
  name: string
}

interface StepHighlight {
  element?: string
  selector?: string
  title?: string
  description?: string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  auto_trigger?: boolean
  allow_click?: boolean
}

interface MissionStep {
  id: number
  title: string
  description?: string
  type: 'info' | 'action'
  phase?: string
  highlight?: StepHighlight
  hints?: string[]
  show_me_text?: string
  validation?: Record<string, unknown>
}

interface MissionSidePanelProps {
  mission: MissionWithProgress
  isOpen: boolean
  onToggle: () => void
  onCompleteStep: (stepId: number) => void
  onUncompleteStep: (stepId: number) => void
  onReset: () => void
  onClose: () => void
  onStartNextMission?: (missionId: string) => void
  nextMission?: NextMissionInfo | null
  isLoading: boolean
  iframeRef?: React.RefObject<HTMLIFrameElement>
}

export function MissionSidePanel({
  mission,
  isOpen,
  onToggle,
  onCompleteStep,
  onUncompleteStep,
  onReset,
  onClose,
  onStartNextMission,
  nextMission,
  isLoading,
  iframeRef,
}: MissionSidePanelProps) {
  const navigate = useNavigate()
  const { mission: m, progress } = mission
  const isCompleted = progress.status === 'completed'
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showHints, setShowHints] = useState<number | null>(null)

  // Function to trigger highlight in iframe via postMessage
  const triggerHighlight = (highlight: StepHighlight) => {
    console.log('[MissionSidePanel] Triggering highlight:', highlight)
    if (iframeRef?.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        source: 'teach-charlie-parent',
        type: 'highlight',
        highlight,
      }, '*')
      console.log('[MissionSidePanel] postMessage sent to iframe')
    } else {
      console.warn('[MissionSidePanel] No iframe ref available')
    }
  }

  // Function to clear highlight
  const clearHighlight = () => {
    if (iframeRef?.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        source: 'teach-charlie-parent',
        type: 'clear_highlight',
      }, '*')
    }
  }

  // Auto-trigger highlight when step becomes active (if auto_trigger is true)
  useEffect(() => {
    if (!isCompleted && m.steps[progress.current_step]) {
      const currentStepData = m.steps[progress.current_step] as unknown as MissionStep
      if (currentStepData.highlight?.auto_trigger !== false && currentStepData.highlight?.element) {
        // Small delay to ensure iframe is ready
        const timer = setTimeout(() => {
          triggerHighlight(currentStepData.highlight!)
        }, 500)
        return () => clearTimeout(timer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.current_step, isCompleted])

  // Auto-expand current step when progress changes
  useEffect(() => {
    if (!isCompleted && m.steps[progress.current_step]) {
      setExpandedStep(m.steps[progress.current_step].id)
    }
  }, [progress.current_step, progress.completed_steps.length, isCompleted, m.steps])

  // Closed state - just a floating button
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-4 bottom-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-full shadow-lg hover:bg-violet-700 transition-all hover:shadow-xl"
        title="Open mission guide"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span className="font-medium">Mission</span>
        <span className="w-6 h-6 bg-white/20 rounded-full text-xs flex items-center justify-center">
          {progress.completed_steps.length}/{m.steps.length}
        </span>
      </button>
    )
  }

  const handleStepClick = (stepId: number, stepIsCompleted: boolean) => {
    if (expandedStep === stepId) {
      setExpandedStep(null)
    } else {
      setExpandedStep(stepId)
    }
  }

  const handleReset = () => {
    onReset()
    setShowResetConfirm(false)
  }

  // Open state - full side panel
  return (
    <div className="w-80 h-full flex flex-col bg-white border-l border-gray-200 shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                Mission
              </span>
            </div>
            <h2 className="font-semibold text-gray-900 mt-1 truncate">{m.name}</h2>
            <p className="text-xs text-gray-500">
              Step {progress.current_step + 1} of {m.steps.length}
            </p>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Minimize panel"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full transition-all duration-500"
            style={{ width: `${(progress.completed_steps.length / m.steps.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1.5 text-right">
          {progress.completed_steps.length} / {m.steps.length} completed
        </p>
      </div>

      {/* Steps list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-2">
          {m.steps.map((step, index) => {
            const stepIsCompleted = progress.completed_steps.includes(step.id)
            const stepIsCurrent = !isCompleted && progress.current_step === index
            const isExpanded = expandedStep === step.id

            return (
              <div
                key={step.id}
                className={`rounded-xl border transition-all ${
                  stepIsCompleted
                    ? 'border-green-200 bg-green-50'
                    : stepIsCurrent
                      ? 'border-violet-300 bg-violet-50 shadow-sm ring-1 ring-violet-200'
                      : 'border-gray-200 bg-white opacity-60'
                }`}
              >
                {/* Step header - clickable */}
                <button
                  onClick={() => handleStepClick(step.id, stepIsCompleted)}
                  className="w-full p-3 text-left"
                >
                  <div className="flex items-start gap-3">
                    {/* Step indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                        stepIsCompleted
                          ? 'bg-green-500 text-white'
                          : stepIsCurrent
                            ? 'bg-violet-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {stepIsCompleted ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Step title */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-medium leading-tight ${
                          stepIsCompleted
                            ? 'text-green-800'
                            : stepIsCurrent
                              ? 'text-violet-800'
                              : 'text-gray-600'
                        }`}
                      >
                        {step.title}
                      </h4>
                    </div>

                    {/* Expand/collapse indicator */}
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-0">
                    {/* Cast step to MissionStep for type safety */}
                    {(() => {
                      const stepData = step as unknown as MissionStep
                      return (
                        <>
                          {step.description && (
                            <p className={`text-xs leading-relaxed ml-10 mb-3 ${
                              stepIsCompleted ? 'text-green-600' : stepIsCurrent ? 'text-violet-600' : 'text-gray-500'
                            }`}>
                              {step.description}
                            </p>
                          )}

                          {/* Show Me button - triggers highlight */}
                          {stepIsCurrent && stepData.highlight?.element && iframeRef && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                triggerHighlight(stepData.highlight!)
                              }}
                              className="ml-10 mb-3 flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-100 border border-violet-200 rounded-lg hover:bg-violet-200 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {stepData.show_me_text || 'Show Me'}
                            </button>
                          )}

                          {/* Hints section */}
                          {stepData.hints && stepData.hints.length > 0 && stepIsCurrent && (
                            <div className="ml-10 mb-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowHints(showHints === step.id ? null : step.id)
                                }}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-violet-600 transition-colors"
                              >
                                <svg className={`w-3 h-3 transition-transform ${showHints === step.id ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                Need a hint?
                              </button>
                              {showHints === step.id && (
                                <div className="mt-2 space-y-1.5">
                                  {stepData.hints.map((hint, hintIndex) => (
                                    <p key={hintIndex} className="text-xs text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                                      {hint}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className="ml-10">
                            {stepIsCompleted ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onUncompleteStep(step.id)
                                }}
                                disabled={isLoading}
                                className="w-full px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 border border-green-200 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {isLoading ? 'Updating...' : 'Mark as Incomplete'}
                              </button>
                            ) : stepIsCurrent ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onCompleteStep(step.id)
                                }}
                                disabled={isLoading}
                                className="w-full px-3 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {isLoading ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Marking...
                                  </span>
                                ) : (
                                  'Mark as Complete'
                                )}
                              </button>
                            ) : null}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      {isCompleted ? (
        <div className="px-4 py-4 bg-green-50 border-t border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-800">Mission Complete!</p>
              <p className="text-xs text-green-600">Great work! You can continue exploring.</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {nextMission && onStartNextMission ? (
              <button
                onClick={() => onStartNextMission(nextMission.id)}
                className="w-full px-3 py-2.5 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>Next: {nextMission.name}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard/missions')}
                className="w-full px-3 py-2.5 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                View All Missions
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full px-3 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
            >
              Close Panel & Continue Exploring
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full px-3 py-1.5 text-xs text-green-700 hover:bg-green-100 rounded-lg transition-colors"
            >
              Reset and Start Over
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2">
            <button
              onClick={() => navigate('/dashboard/missions')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Exit Mission
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full px-3 py-1.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Reset Progress
            </button>
          </div>
        </div>
      )}

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 m-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Mission?</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will clear all your progress on this mission. You'll start from Step 1 again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Resetting...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
