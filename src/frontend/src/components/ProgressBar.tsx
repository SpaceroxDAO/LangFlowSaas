/**
 * ProgressBar - Header progress indicator for wizard steps
 * Shows colored segments for each step
 */

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const stepColors = [
  'bg-violet-500', // Step 1 - Identity
  'bg-pink-500',   // Step 2 - Coaching
  'bg-orange-500', // Step 3 - Tricks
  'bg-green-500',  // Step 4 - Complete (if needed)
]

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-1 w-12 rounded-full transition-colors ${
            index + 1 <= currentStep
              ? stepColors[index] || 'bg-gray-400'
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}
