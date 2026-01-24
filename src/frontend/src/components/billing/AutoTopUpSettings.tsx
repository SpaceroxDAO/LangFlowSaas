/**
 * Auto Top-Up Settings component.
 * Configure automatic credit purchases when balance runs low.
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AutoTopUpSettings as AutoTopUpSettingsType, CreditPack } from '@/types'

interface AutoTopUpSettingsProps {
  settings: AutoTopUpSettingsType
  canUse: boolean
}

export function AutoTopUpSettings({ settings, canUse }: AutoTopUpSettingsProps) {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [localSettings, setLocalSettings] = useState(settings)

  // Fetch credit packs for dropdown
  const { data: packs = [] } = useQuery({
    queryKey: ['credit-packs'],
    queryFn: () => api.listCreditPacks(),
    enabled: canUse,
  })

  // Mutation to update settings
  const updateMutation = useMutation({
    mutationFn: (data: typeof localSettings) => api.updateAutoTopUpSettings({
      enabled: data.enabled,
      threshold_credits: data.threshold_credits,
      top_up_pack_id: data.top_up_pack_id,
      max_monthly_top_ups: data.max_monthly_top_ups,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-overview'] })
      queryClient.invalidateQueries({ queryKey: ['auto-top-up'] })
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

  if (!canUse) {
    return (
      <div className="rounded-2xl border border-slate-200/60 dark:border-neutral-800/60 bg-slate-50 dark:bg-neutral-900/50 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-neutral-800 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-neutral-300">Auto Top-Up</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">Available on Individual & Business plans</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-neutral-400">
          Upgrade your plan to enable automatic credit top-ups when your balance runs low.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900 p-6">
      {/* Header with toggle */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            settings.enabled
              ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
              : 'bg-slate-100 dark:bg-neutral-800'
          }`}>
            <svg className={`w-5 h-5 ${settings.enabled ? 'text-white' : 'text-slate-400 dark:text-neutral-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Auto Top-Up</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Never run out of credits unexpectedly
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          onClick={handleToggle}
          disabled={updateMutation.isPending}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            localSettings.enabled
              ? 'bg-emerald-500'
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
          {/* Current configuration display */}
          {!isEditing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-neutral-800/50 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mb-1">When balance falls below</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{localSettings.threshold_credits.toLocaleString()} credits</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-neutral-800/50 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mb-1">Automatically purchase</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{localSettings.top_up_pack_name}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-neutral-800/50 rounded-xl">
                <div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">Top-ups this month</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {settings.top_ups_this_month} / {localSettings.max_monthly_top_ups}
                  </p>
                </div>
                {!settings.can_top_up && (
                  <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full">
                    Limit reached
                  </span>
                )}
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 px-4 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Edit Settings
              </button>
            </>
          ) : (
            /* Edit mode */
            <>
              {/* Threshold input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-2">
                  Trigger when balance falls below
                </label>
                <input
                  type="number"
                  min={50}
                  max={1000}
                  step={50}
                  value={localSettings.threshold_credits}
                  onChange={(e) => setLocalSettings({ ...localSettings, threshold_credits: parseInt(e.target.value) || 100 })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              {/* Pack selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-2">
                  Credit pack to purchase
                </label>
                <select
                  value={localSettings.top_up_pack_id}
                  onChange={(e) => setLocalSettings({ ...localSettings, top_up_pack_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  {packs.map((pack: CreditPack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.name} - {pack.price_display}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max monthly top-ups */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-2">
                  Maximum auto top-ups per month
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={localSettings.max_monthly_top_ups}
                  onChange={(e) => setLocalSettings({ ...localSettings, max_monthly_top_ups: parseInt(e.target.value) || 3 })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
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
                  className="flex-1 py-2.5 px-4 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
