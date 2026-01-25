import { useNavigate } from 'react-router-dom'
import type { MissionWithProgress } from '@/types'

interface MissionCardProps {
  mission: MissionWithProgress
  onStart: () => void
  onContinue: () => void
  onView: () => void
}

// Lock icon for gated missions
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)

// Icon mapping for mission icons
const iconMap: Record<string, React.ReactNode> = {
  wave: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    </svg>
  ),
  'help-circle': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  tool: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  link: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  inbox: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  ),
  'book-open': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  brain: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
}

// Get difficulty color
function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    case 'intermediate':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    case 'advanced':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    default:
      return 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300'
  }
}

// Get status badge
function getStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Completed
        </span>
      )
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          In Progress
        </span>
      )
    default:
      return null
  }
}

export function MissionCard({ mission, onStart, onContinue, onView }: MissionCardProps) {
  const navigate = useNavigate()
  const { mission: m, progress, access } = mission
  const Icon = iconMap[m.icon || 'wave'] || iconMap.wave
  const completedSteps = progress.completed_steps.length
  const totalSteps = m.steps.length
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  // Check if mission is locked (requires upgrade)
  const isLocked = access && !access.has_access
  const requiredPlan = access?.required_plan || 'free'

  const handleUpgradeClick = () => {
    navigate('/billing?tab=plans')
  }

  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5 transition-shadow ${
      isLocked
        ? 'opacity-75 hover:opacity-100'
        : 'hover:shadow-md dark:hover:shadow-neutral-900/50'
    }`}>
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
          isLocked
            ? 'bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500'
            : m.category === 'skill_sprint'
              ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}>
          {isLocked ? <LockIcon /> : Icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-semibold truncate ${
              isLocked ? 'text-gray-500 dark:text-neutral-500' : 'text-gray-900 dark:text-white'
            }`}>{m.name}</h3>
            {isLocked ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                <LockIcon />
                {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
              </span>
            ) : (
              getStatusBadge(progress.status)
            )}
          </div>
          <p className={`text-sm line-clamp-2 mb-3 ${
            isLocked ? 'text-gray-400 dark:text-neutral-500' : 'text-gray-600 dark:text-neutral-400'
          }`}>{m.description}</p>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-neutral-400">
            <span className={`px-2 py-0.5 rounded-full ${getDifficultyColor(m.difficulty)}`}>
              {m.difficulty.charAt(0).toUpperCase() + m.difficulty.slice(1)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {m.estimated_minutes} min
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {totalSteps} steps
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar (if in progress and not locked) */}
      {!isLocked && progress.status === 'in_progress' && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400 mb-1">
            <span>Progress</span>
            <span>{completedSteps} / {totalSteps} steps</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Action button */}
      <div className="mt-4 flex justify-end">
        {isLocked ? (
          <button
            onClick={handleUpgradeClick}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-violet-700 hover:to-purple-700 transition-colors flex items-center gap-2"
          >
            <LockIcon />
            Upgrade to Unlock
          </button>
        ) : (
          <>
            {progress.status === 'not_started' && (
              <button
                onClick={onStart}
                className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
              >
                Start Mission
              </button>
            )}
            {progress.status === 'in_progress' && (
              <button
                onClick={onContinue}
                className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
              >
                Continue
              </button>
            )}
            {progress.status === 'completed' && (
              <button
                onClick={onView}
                className="px-4 py-2 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Review
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
