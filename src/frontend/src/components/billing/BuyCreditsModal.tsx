/**
 * Buy Credits Modal - Stripe checkout for credit pack purchases.
 * Features an elegant card selection interface with volume discounts.
 */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CreditPack } from '@/types'

interface BuyCreditsModalProps {
  onClose: () => void
}

export function BuyCreditsModal({ onClose }: BuyCreditsModalProps) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { data: packs = [], isLoading: packsLoading, error } = useQuery({
    queryKey: ['credit-packs'],
    queryFn: () => api.listCreditPacks(),
  })

  const handlePurchase = async () => {
    if (!selectedPack) return

    setIsLoading(true)
    try {
      const { checkout_url } = await api.purchaseCredits({
        pack_id: selectedPack,
        success_url: `${window.location.origin}/dashboard/billing?credits_success=true`,
        cancel_url: `${window.location.origin}/dashboard/billing?credits_canceled=true`,
      })
      window.location.href = checkout_url
    } catch (err) {
      console.error('Purchase error:', err)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate savings percentage compared to smallest pack
  const getDiscount = (pack: CreditPack) => {
    const basePack = packs[0]
    if (!basePack || pack.id === basePack.id) return 0
    const baseRate = basePack.price_cents / basePack.credits
    const thisRate = pack.price_cents / pack.credits
    return Math.round((1 - thisRate / baseRate) * 100)
  }

  const formatCredits = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toLocaleString()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-950 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-neutral-800">
        {/* Header with gradient */}
        <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="modal-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="12" cy="12" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#modal-dots)" />
            </svg>
          </div>

          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Buy AI Credits</h2>
              <p className="text-violet-200 mt-1">
                Power your agents with additional credits
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {packsLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse h-40 bg-slate-100 dark:bg-neutral-900 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-slate-600 dark:text-neutral-400">Failed to load credit packs</p>
              <button onClick={() => window.location.reload()} className="mt-2 text-violet-600 hover:underline text-sm">
                Try again
              </button>
            </div>
          ) : (
            <>
              {/* Credit Packs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {packs.map((pack) => {
                  const isSelected = selectedPack === pack.id
                  const discount = getDiscount(pack)

                  return (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedPack(pack.id)}
                      className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 ring-4 ring-violet-500/20'
                          : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                      }`}
                    >
                      {/* Popular badge */}
                      {pack.popular && (
                        <div className="absolute -top-2.5 left-4 px-3 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                          BEST VALUE
                        </div>
                      )}

                      {/* Discount badge */}
                      {discount > 0 && (
                        <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                          Save {discount}%
                        </div>
                      )}

                      <div className="mb-3">
                        <span className={`text-3xl font-bold ${
                          isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-slate-900 dark:text-white'
                        }`}>
                          {formatCredits(pack.credits)}
                        </span>
                        <span className={`ml-1.5 ${
                          isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-neutral-400'
                        }`}>
                          credits
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className={`text-xl font-bold ${
                          isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-slate-900 dark:text-white'
                        }`}>
                          {pack.price_display}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-neutral-500">
                          ${(pack.price_per_credit * 1000).toFixed(2)}/1K credits
                        </span>
                      </div>

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Info section */}
              <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-violet-100 dark:bg-violet-950/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-neutral-300">
                      How credits work
                    </p>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                      Credits are used when Charlie runs your AI agents. Different models use different amounts.
                      Using your own API keys? Credits aren't consumed for those calls.
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase button */}
              <button
                onClick={handlePurchase}
                disabled={!selectedPack || isLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                  selectedPack && !isLoading
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50'
                    : 'bg-slate-300 dark:bg-neutral-700 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Redirecting to checkout...
                  </>
                ) : selectedPack ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Purchase {packs.find(p => p.id === selectedPack)?.name}
                  </>
                ) : (
                  'Select a credit pack'
                )}
              </button>

              <p className="text-center text-xs text-slate-400 dark:text-neutral-500 mt-4">
                Secure checkout powered by Stripe. Credits never expire.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
