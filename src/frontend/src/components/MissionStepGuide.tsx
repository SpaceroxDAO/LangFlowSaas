import { useState } from 'react'
import type { MissionWithProgress, MissionStep } from '@/types'

interface MissionStepGuideProps {
  mission: MissionWithProgress
  onCompleteStep: (stepId: number) => void
  onReset: () => void
  onClose: () => void
  isLoading?: boolean
}

// Step type icon
function StepTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'action':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'info':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'quiz':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    default:
      return null
  }
}

// Step status indicator
function StepIndicator({ step, index, isCompleted, isCurrent }: {
  step: MissionStep
  index: number
  isCompleted: boolean
  isCurrent: boolean
}) {
  if (isCompleted) {
    return (
      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    )
  }

  if (isCurrent) {
    return (
      <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center font-medium">
        {index + 1}
      </div>
    )
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-medium">
      {index + 1}
    </div>
  )
}

export function MissionStepGuide({ mission, onCompleteStep, onReset, onClose, isLoading }: MissionStepGuideProps) {
  const { mission: m, progress } = mission
  const [expandedStep, setExpandedStep] = useState<number | null>(progress.current_step)

  const isCompleted = progress.status === 'completed'
  const completedSteps = progress.completed_steps

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Slide-out panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{m.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {m.category === 'skill_sprint' ? 'Skill Sprint' : 'Applied Build'}
                <span className="mx-2">•</span>
                {m.estimated_minutes} min
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress */}
          {!isCompleted && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{completedSteps.length} / {m.steps.length} steps</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSteps.length / m.steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Completed banner */}
          {isCompleted && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-800">Mission Completed!</p>
                <p className="text-sm text-green-600">Great job finishing this mission.</p>
              </div>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {m.steps.map((step, index) => {
              const stepIsCompleted = completedSteps.includes(step.id)
              const stepIsCurrent = !isCompleted && progress.current_step === index
              const isExpanded = expandedStep === index

              return (
                <div
                  key={step.id}
                  className={`rounded-lg border transition-all ${
                    stepIsCompleted
                      ? 'border-green-200 bg-green-50'
                      : stepIsCurrent
                        ? 'border-violet-200 bg-violet-50'
                        : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Step header */}
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : index)}
                    className="w-full p-4 flex items-center gap-3 text-left"
                  >
                    <StepIndicator
                      step={step}
                      index={index}
                      isCompleted={stepIsCompleted}
                      isCurrent={stepIsCurrent}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          stepIsCompleted ? 'text-green-800' : stepIsCurrent ? 'text-violet-800' : 'text-gray-700'
                        }`}>
                          {step.title}
                        </span>
                        <span className={`p-1 rounded ${
                          step.type === 'action' ? 'bg-blue-100 text-blue-600' :
                          step.type === 'info' ? 'bg-gray-100 text-gray-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          <StepTypeIcon type={step.type} />
                        </span>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <p className={`text-sm mb-4 ml-11 whitespace-pre-line ${
                        stepIsCompleted ? 'text-green-700' : stepIsCurrent ? 'text-violet-700' : 'text-gray-600'
                      }`}>
                        {step.description}
                      </p>

                      {/* Complete button (only for current step) */}
                      {stepIsCurrent && !stepIsCompleted && (
                        <div className="ml-11">
                          <button
                            onClick={() => onCompleteStep(step.id)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isLoading ? (
                              <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Marking complete...
                              </span>
                            ) : (
                              'Mark as Complete'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {/* Outcomes */}
          {m.outcomes && m.outcomes.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                What you'll learn
              </h4>
              <ul className="space-y-1">
                {m.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reset button */}
          {(progress.status === 'in_progress' || progress.status === 'completed') && (
            <button
              onClick={onReset}
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Reset Progress
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
