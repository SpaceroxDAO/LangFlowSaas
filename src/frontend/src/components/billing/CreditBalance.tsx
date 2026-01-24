/**
 * Credit Balance display component.
 * Shows current AI credits with visual gauge and BYO API key status.
 */
import type { CreditBalance as CreditBalanceType } from '@/types'

interface CreditBalanceProps {
  balance: CreditBalanceType
  onBuyCredits?: () => void
  canBuyCredits?: boolean
}

export function CreditBalance({ balance, onBuyCredits, canBuyCredits = false }: CreditBalanceProps) {
  const usagePercent = balance.monthly_credits > 0
    ? Math.min(100, Math.round((balance.credits_used_this_month / balance.monthly_credits) * 100))
    : 0

  const isLow = balance.credits_remaining < balance.monthly_credits * 0.2
  const isCritical = balance.credits_remaining < balance.monthly_credits * 0.05

  // Format numbers with commas
  const formatNumber = (n: number) => n.toLocaleString()

  // Determine gauge color based on remaining credits
  const gaugeColor = isCritical
    ? 'from-rose-500 to-red-600'
    : isLow
    ? 'from-amber-400 to-orange-500'
    : 'from-emerald-400 to-teal-500'

  const gaugeTrackColor = isCritical
    ? 'bg-rose-100 dark:bg-rose-950/30'
    : isLow
    ? 'bg-amber-100 dark:bg-amber-950/30'
    : 'bg-emerald-100 dark:bg-emerald-950/30'

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-950 border border-slate-200/60 dark:border-neutral-800/60 p-6">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="credit-pattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#credit-pattern)" />
        </svg>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Credits</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-neutral-400">
              Power your agents with credits
            </p>
          </div>

          {balance.using_byo_key && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              BYO API Keys Active
            </div>
          )}
        </div>

        {/* Main balance display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold tracking-tight ${
              isCritical
                ? 'text-rose-600 dark:text-rose-400'
                : isLow
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-900 dark:text-white'
            }`}>
              {formatNumber(balance.credits_remaining)}
            </span>
            <span className="text-slate-400 dark:text-neutral-500 font-medium">
              / {formatNumber(balance.monthly_credits)} credits
            </span>
          </div>

          {balance.purchased_credits > 0 && (
            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
              + {formatNumber(balance.purchased_credits)} purchased credits
            </p>
          )}
        </div>

        {/* Usage gauge */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-500 dark:text-neutral-400">
              {formatNumber(balance.credits_used_this_month)} used this period
            </span>
            <span className={`font-medium ${
              isCritical
                ? 'text-rose-600 dark:text-rose-400'
                : isLow
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-600 dark:text-neutral-300'
            }`}>
              {usagePercent}% used
            </span>
          </div>
          <div className={`h-2.5 rounded-full ${gaugeTrackColor} overflow-hidden`}>
            <div
              className={`h-full rounded-full bg-gradient-to-r ${gaugeColor} transition-all duration-500 ease-out`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        {/* Status messages */}
        {isCritical && (
          <div className="mb-4 px-4 py-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Credits running low</p>
              <p className="text-xs text-rose-600 dark:text-rose-500">
                Your agents may stop working soon. Consider adding more credits.
              </p>
            </div>
          </div>
        )}

        {isLow && !isCritical && (
          <div className="mb-4 px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Credits getting low</p>
              <p className="text-xs text-amber-600 dark:text-amber-500">
                You have {formatNumber(balance.credits_remaining)} credits remaining.
              </p>
            </div>
          </div>
        )}

        {/* Reset date */}
        {balance.reset_date && (
          <p className="text-xs text-slate-400 dark:text-neutral-500 mb-4">
            Credits reset on {new Date(balance.reset_date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        )}

        {/* Actions */}
        {canBuyCredits && onBuyCredits && (
          <button
            onClick={onBuyCredits}
            className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Buy More Credits
          </button>
        )}

        {!canBuyCredits && (
          <p className="text-center text-xs text-slate-400 dark:text-neutral-500">
            Upgrade to Individual or Business to purchase additional credits
          </p>
        )}
      </div>
    </div>
  )
}
