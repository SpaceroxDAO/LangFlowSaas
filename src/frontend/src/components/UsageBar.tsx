/**
 * Usage progress bar component for billing limits.
 */
interface UsageBarProps {
  label: string
  current: number
  max: number
  unit?: string
  showPercent?: boolean
}

export function UsageBar({ label, current, max, unit = '', showPercent = true }: UsageBarProps) {
  const percent = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0

  // Color based on usage level
  const getBarColor = () => {
    if (percent >= 90) return 'bg-red-500'
    if (percent >= 75) return 'bg-amber-500'
    return 'bg-violet-500'
  }

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">{label}</span>
        <span className="text-sm text-gray-500 dark:text-neutral-400">
          {formatNumber(current)}{unit} / {formatNumber(max)}{unit}
          {showPercent && <span className="ml-1 text-gray-400 dark:text-neutral-500">({percent}%)</span>}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {percent >= 90 && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
          Approaching limit. Consider upgrading your plan.
        </p>
      )}
    </div>
  )
}
