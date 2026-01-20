/**
 * Mission Step Panel Component
 *
 * A docked side panel for showing mission step guidance during canvas mode.
 * Can be collapsed to a slim progress indicator.
 * Supports Walk Me highlights and hints for guided learning.
 */
import { useState, useEffect } from 'react'
import type { MissionWithProgress } from '@/types'

interface StepHighlight {
  element?: string
  selector?: string
  title?: string
  description?: string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  auto_trigger?: boolean
  allow_click?: boolean
}

interface ExtendedMissionStep {
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

interface MissionStepPanelProps {
  mission: MissionWithProgress
  isCollapsed: boolean
  onToggleCollapse: () => void
  onCompleteStep: (stepId: number) => void
  isLoading: boolean
  iframeRef?: React.RefObject<HTMLIFrameElement>
}

export function MissionStepPanel({
  mission,
  isCollapsed,
  onToggleCollapse,
  onCompleteStep,
  isLoading,
  iframeRef,
}: MissionStepPanelProps) {
  const { mission: m, progress } = mission
  const isCompleted = progress.status === 'completed'
  const [showHints, setShowHints] = useState<number | null>(null)

  // Function to trigger highlight in iframe via postMessage
  const triggerHighlight = (highlight: StepHighlight) => {
    if (iframeRef?.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        source: 'teach-charlie-parent',
        type: 'highlight',
        highlight,
      }, '*')
    }
  }

  // Auto-trigger highlight when step becomes active (if auto_trigger is true)
  useEffect(() => {
    if (!isCompleted && m.steps[progress.current_step]) {
      const currentStepData = m.steps[progress.current_step] as unknown as ExtendedMissionStep
      if (currentStepData.highlight?.auto_trigger !== false && currentStepData.highlight?.element) {
        // Small delay to ensure iframe is ready
        const timer = setTimeout(() => {
          triggerHighlight(currentStepData.highlight!)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.current_step, isCompleted])

  // Collapsed view - just vertical progress indicators
  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800">
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          title="Expand guide"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Vertical progress indicators */}
        <div className="flex-1 flex flex-col items-center gap-2 mt-4">
          {m.steps.map((step, index) => {
            const stepIsCompleted = progress.completed_steps.includes(step.id)
            const stepIsCurrent = !isCompleted && progress.current_step === index

            return (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-colors ${
                  stepIsCompleted
                    ? 'bg-green-500'
                    : stepIsCurrent
                      ? 'bg-violet-500 animate-pulse'
                      : 'bg-gray-300 dark:bg-neutral-600'
                }`}
                title={step.title}
              />
            )
          })}
        </div>

        {/* Completion indicator */}
        {isCompleted && (
          <div className="mt-auto mb-2">
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
    )
  }

  // Expanded view - full step list
  return (
    <div className="h-full flex flex-col bg-white dark:bg-neutral-900">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 dark:text-white truncate">{m.name}</h2>
          <p className="text-xs text-gray-500 dark:text-neutral-400">
            Step {progress.current_step + 1} of {m.steps.length}
          </p>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors ml-2"
          title="Collapse panel"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
        <div className="h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${(progress.completed_steps.length / m.steps.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 text-right">
          {progress.completed_steps.length} / {m.steps.length} completed
        </p>
      </div>

      {/* Steps list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-3">
          {m.steps.map((step, index) => {
            const stepIsCompleted = progress.completed_steps.includes(step.id)
            const stepIsCurrent = !isCompleted && progress.current_step === index

            return (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all ${
                  stepIsCompleted
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : stepIsCurrent
                      ? 'border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/20 shadow-sm dark:shadow-neutral-900/50'
                      : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Step indicator */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                      stepIsCompleted
                        ? 'bg-green-500 text-white'
                        : stepIsCurrent
                          ? 'bg-violet-500 text-white'
                          : 'bg-gray-200 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400'
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

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-medium ${
                        stepIsCompleted
                          ? 'text-green-800 dark:text-green-400'
                          : stepIsCurrent
                            ? 'text-violet-800 dark:text-violet-400'
                            : 'text-gray-600 dark:text-neutral-400'
                      }`}
                    >
                      {step.title}
                    </h4>
                    {stepIsCurrent && (
                      <p className="text-xs text-violet-600 dark:text-violet-400 mt-1 leading-relaxed whitespace-pre-line">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional actions for current step */}
                {stepIsCurrent && !stepIsCompleted && (() => {
                  const stepData = step as unknown as ExtendedMissionStep
                  return (
                    <>
                      {/* Show Me button - triggers highlight */}
                      {stepData.highlight?.element && iframeRef && (
                        <button
                          onClick={() => triggerHighlight(stepData.highlight!)}
                          className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {stepData.show_me_text || 'Show Me'}
                        </button>
                      )}

                      {/* Hints section */}
                      {stepData.hints && stepData.hints.length > 0 && (
                        <div className="mt-2">
                          <button
                            onClick={() => setShowHints(showHints === step.id ? null : step.id)}
                            className="flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                          >
                            <svg className={`w-3 h-3 transition-transform ${showHints === step.id ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            Need a hint?
                          </button>
                          {showHints === step.id && (
                            <div className="mt-2 space-y-1.5">
                              {stepData.hints.map((hint, hintIndex) => (
                                <p key={hintIndex} className="text-xs text-gray-600 dark:text-neutral-300 bg-gray-50 dark:bg-neutral-800 px-2.5 py-1.5 rounded-lg">
                                  {hint}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )
                })()}

                {/* Manual complete button for current step */}
                {stepIsCurrent && !stepIsCompleted && (
                  <button
                    onClick={() => onCompleteStep(step.id)}
                    disabled={isLoading}
                    className="mt-3 w-full px-3 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Completion banner */}
      {isCompleted && (
        <div className="px-4 py-4 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-800 dark:text-green-400">Mission Complete!</p>
              <p className="text-xs text-green-600 dark:text-green-500">Great work! You can continue exploring.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
