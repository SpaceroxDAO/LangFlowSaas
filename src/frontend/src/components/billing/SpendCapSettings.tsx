/**
 * Spend Cap Settings component.
 * Set a hard monthly spending limit for credit purchases.
 */
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { SpendCapSettings as SpendCapSettingsType } from '@/types'

interface SpendCapSettingsProps {
  settings: SpendCapSettingsType
}

const PRESET_CAPS = [
  { value: 2500, label: '$25' },
  { value: 5000, label: '$50' },
  { value: 10000, label: '$100' },
  { value: 25000, label: '$250' },
]

export function SpendCapSettings({ settings }: SpendCapSettingsProps) {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [localSettings, setLocalSettings] = useState(settings)

  // Mutation to update settings
  const updateMutation = useMutation({
    mutationFn: (data: typeof localSettings) => api.updateSpendCapSettings({
      enabled: data.enabled,
      max_monthly_spend_cents: data.max_monthly_spend_cents,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-overview'] })
      queryClient.invalidateQueries({ queryKey: ['spend-cap'] })
      setIsEditing(false)
    },
  })

  const handleToggle = async () => {
    const newSettings = { ...localSettings, enabled: !localSettings.enabled }
    setLocalSettings(newSettings)
    updateMutation.mutate(newSettings)
  }

  const handleSave = () => {
    updateMutation.mutate(localSettings)
  }

  // Calculate progress percentage
  const spendPercent = settings.max_monthly_spend_cents > 0
    ? Math.min(100, Math.round((settings.current_month_spend_cents / settings.max_monthly_spend_cents) * 100))
    : 0

  const isNearLimit = spendPercent >= 80
  const atLimit = settings.at_limit

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900 p-6">
      {/* Header with toggle */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            settings.enabled
              ? atLimit
                ? 'bg-gradient-to-br from-rose-400 to-red-500'
                : 'bg-gradient-to-br from-blue-400 to-indigo-500'
              : 'bg-slate-100 dark:bg-neutral-800'
          }`}>
            <svg className={`w-5 h-5 ${settings.enabled ? 'text-white' : 'text-slate-400 dark:text-neutral-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Monthly Spend Cap</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Set a hard limit on credit spending
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          onClick={handleToggle}
          disabled={updateMutation.isPending}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            localSettings.enabled
              ? 'bg-blue-500'
              : 'bg-slate-200 dark:bg-neutral-700'
          } ${updateMutation.isPending ? 'opacity-50' : ''}`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              localSettings.enabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {localSettings.enabled && (
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-neutral-800">
          {/* Spend progress */}
          {!isEditing && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-neutral-400">
                    {settings.current_month_spend_display} spent
                  </span>
                  <span className={`text-sm font-medium ${
                    atLimit
                      ? 'text-rose-600 dark:text-rose-400'
                      : isNearLimit
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-600 dark:text-neutral-300'
                  }`}>
                    {settings.spend_remaining_display} remaining
                  </span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${
                  atLimit
                    ? 'bg-rose-100 dark:bg-rose-950/30'
                    : isNearLimit
                    ? 'bg-amber-100 dark:bg-amber-950/30'
                    : 'bg-blue-100 dark:bg-blue-950/30'
                }`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      atLimit
                        ? 'bg-gradient-to-r from-rose-500 to-red-600'
                        : isNearLimit
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                        : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                    }`}
                    style={{ width: `${spendPercent}%` }}
                  />
                </div>
              </div>

              {/* Status alerts */}
              {atLimit && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-2">
                  <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Spend cap reached</p>
                    <p className="text-xs text-rose-600 dark:text-rose-500">
                      Credit purchases are blocked until the cap resets or is increased.
                    </p>
                  </div>
                </div>
              )}

              {isNearLimit && !atLimit && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    You're approaching your monthly spend cap
                  </p>
                </div>
              )}

              {/* Current cap display */}
              <div className="p-3 bg-slate-50 dark:bg-neutral-800/50 rounded-xl">
                <p className="text-xs text-slate-500 dark:text-neutral-400 mb-1">Monthly cap</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{settings.max_monthly_spend_display}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 px-4 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Change Cap
              </button>
            </>
          )}

          {/* Edit mode */}
          {isEditing && (
            <>
              {/* Preset buttons */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-2">
                  Quick select
                </label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_CAPS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setLocalSettings({ ...localSettings, max_monthly_spend_cents: preset.value })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        localSettings.max_monthly_spend_cents === preset.value
                          ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                          : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border-2 border-transparent hover:border-slate-300 dark:hover:border-neutral-600'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-2">
                  Custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    min={5}
                    max={1000}
                    value={localSettings.max_monthly_spend_cents / 100}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      max_monthly_spend_cents: Math.round(parseFloat(e.target.value) * 100) || 10000
                    })}
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
                  Min $5, max $1,000
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setLocalSettings(settings)
                    setIsEditing(false)
                  }}
                  className="flex-1 py-2.5 px-4 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="flex-1 py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {!localSettings.enabled && (
        <p className="text-sm text-slate-500 dark:text-neutral-400 pt-2">
          Enable to set a hard limit on how much you can spend on credits each month.
          Useful for controlling costs and preventing unexpected charges.
        </p>
      )}
    </div>
  )
}
