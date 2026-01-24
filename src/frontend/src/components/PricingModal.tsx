/**
 * Pricing modal for plan selection and upgrade.
 * Uses the new plan structure with credits-based pricing.
 */
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/providers/DevModeProvider'
import type { Plan, PlanId } from '@/types'

interface PricingModalProps {
  onClose: () => void
  currentPlanId?: PlanId
}

export function PricingModal({ onClose, currentPlanId = 'free' }: PricingModalProps) {
  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Fetch plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['billing-plans'],
    queryFn: () => api.listPlans(),
  })

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.id === 'free' || plan.id === currentPlanId) return

    // Business plan -> contact sales
    if (plan.is_custom) {
      window.open('mailto:sales@teachcharlie.ai?subject=Business Plan Inquiry', '_blank')
      return
    }

    setIsLoading(plan.id)
    try {
      const { checkout_url } = await api.createCheckoutSession({
        plan_id: plan.id,
        success_url: `${window.location.origin}/dashboard/billing?success=true`,
        cancel_url: `${window.location.origin}/dashboard/billing?canceled=true`,
      })
      window.location.href = checkout_url
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-950 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-neutral-800">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pricing-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="12" cy="12" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pricing-dots)" />
            </svg>
          </div>

          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
              <p className="text-violet-200 mt-1">Scale your AI agents as you grow</p>
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

        {/* Plans Grid */}
        <div className="p-8">
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border border-slate-200 dark:border-neutral-800 rounded-2xl p-6">
                  <div className="h-6 bg-slate-200 dark:bg-neutral-700 rounded w-1/2 mb-4" />
                  <div className="h-10 bg-slate-200 dark:bg-neutral-700 rounded w-1/3 mb-4" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 bg-slate-100 dark:bg-neutral-800 rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrentPlan = plan.id === currentPlanId
                const isHighlight = plan.highlight

                return (
                  <div
                    key={plan.id}
                    className={`relative border-2 rounded-2xl p-6 transition-all ${
                      isHighlight
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20 ring-4 ring-violet-500/20'
                        : isCurrentPlan
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-neutral-700 hover:border-slate-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900'
                    }`}
                  >
                    {isHighlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                          RECOMMENDED
                        </span>
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">{plan.description}</p>
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-slate-900 dark:text-white">
                        {plan.price_display}
                      </span>
                      {!plan.is_custom && plan.price_monthly > 0 && (
                        <span className="text-slate-500 dark:text-neutral-400 ml-1">/month</span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.slice(0, 6).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <svg
                            className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-slate-600 dark:text-neutral-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrentPlan || isLoading === plan.id}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                        isCurrentPlan
                          ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 cursor-default'
                          : isHighlight
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25'
                          : plan.is_custom
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                          : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700'
                      } ${isLoading === plan.id ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {isLoading === plan.id
                        ? 'Redirecting...'
                        : isCurrentPlan
                        ? 'Current Plan'
                        : plan.is_custom
                        ? 'Contact Sales'
                        : plan.id === 'free'
                        ? 'Downgrade'
                        : 'Upgrade'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Footer note */}
          <p className="text-center text-sm text-slate-500 dark:text-neutral-400 mt-8">
            All plans include a 14-day money-back guarantee. Cancel anytime.
            <br />
            <span className="text-xs">Bring your own API keys? Those calls don't consume credits.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
