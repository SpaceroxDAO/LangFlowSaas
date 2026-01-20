/**
 * Date Range Picker Component
 *
 * Provides preset time ranges (7d, 14d, 30d, 90d) and custom date selection.
 */
import { useState, useEffect } from 'react'

export interface DateRange {
  preset: number | null // Days for preset, null for custom
  startDate: string | null // ISO date string for custom range
  endDate: string | null // ISO date string for custom range
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

const PRESETS = [
  { value: 7, label: 'Last 7 days' },
  { value: 14, label: 'Last 14 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
] as const

export function DateRangePicker({ value, onChange, className = '' }: DateRangePickerProps) {
  const [isCustom, setIsCustom] = useState(value.preset === null)
  const [customStart, setCustomStart] = useState(value.startDate || '')
  const [customEnd, setCustomEnd] = useState(value.endDate || '')

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  // Get max date (today)
  const today = formatDateForInput(new Date())

  // Get default start date (30 days ago)
  const getDefaultStart = () => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return formatDateForInput(date)
  }

  // Initialize custom dates if switching to custom
  useEffect(() => {
    if (isCustom && !customStart && !customEnd) {
      const defaultStart = getDefaultStart()
      setCustomStart(defaultStart)
      setCustomEnd(today)
    }
  }, [isCustom, customStart, customEnd, today])

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value

    if (selectedValue === 'custom') {
      setIsCustom(true)
      // Don't emit change yet - wait for date selection
    } else {
      setIsCustom(false)
      const days = parseInt(selectedValue, 10)
      onChange({ preset: days, startDate: null, endDate: null })
    }
  }

  const handleCustomDateChange = (start: string, end: string) => {
    if (start && end && start <= end) {
      onChange({ preset: null, startDate: start, endDate: end })
    }
  }

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value
    setCustomStart(newStart)
    handleCustomDateChange(newStart, customEnd)
  }

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value
    setCustomEnd(newEnd)
    handleCustomDateChange(customStart, newEnd)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <select
        value={isCustom ? 'custom' : (value.preset || 7)}
        onChange={handlePresetChange}
        className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
      >
        {PRESETS.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
        <option value="custom">Custom range</option>
      </select>

      {isCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customStart}
            onChange={handleStartChange}
            max={customEnd || today}
            className="px-2 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
          />
          <span className="text-gray-500 dark:text-neutral-400 text-sm">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={handleEndChange}
            min={customStart}
            max={today}
            className="px-2 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
          />
        </div>
      )}
    </div>
  )
}
