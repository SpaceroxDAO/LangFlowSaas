/**
 * Pricing Table component.
 * Full-featured pricing comparison with plan selection.
 * Supports monthly/yearly billing toggle.
 */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { PlanId } from '@/types'

interface PricingTableProps {
  currentPlanId?: PlanId
  onSelectPlan?: (planId: PlanId) => void
  compact?: boolean
}

type BillingCycle = 'monthly' | 'yearly'

export function PricingTable({ currentPlanId = 'free', onSelectPlan, compact = false }: PricingTableProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')

  const { data: comparison, isLoading: comparisonLoading } = useQuery({
    queryKey: ['pricing-comparison'],
    queryFn: () => api.getPricingComparison(),
  })

  const handleSelectPlan = async (planId: PlanId) => {
    if (planId === currentPlanId || planId === 'free') {
      onSelectPlan?.(planId)
      return
    }

    // Business plan -> contact sales
    if (planId === 'business') {
      window.open('mailto:sales@teachcharlie.ai?subject=Business Plan Inquiry', '_blank')
      return
    }

    setIsLoading(planId)
    try {
      const { checkout_url } = await api.createCheckoutSession({
        plan_id: planId,
        success_url: `${window.location.origin}/dashboard/billing?success=true`,
        cancel_url: `${window.location.origin}/dashboard/billing?canceled=true`,
        billing_cycle: billingCycle,
      })
      window.location.href = checkout_url
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  // Helper to get display price based on billing cycle
  const getDisplayPrice = (plan: { price_display: string; yearly_price_display: string; price_yearly: number }) => {
    if (billingCycle === 'yearly' && plan.price_yearly > 0) {
      // Show monthly equivalent for yearly billing
      const monthlyEquivalent = Math.round(plan.price_yearly / 12 / 100)
      return `$${monthlyEquivalent}/mo`
    }
    return plan.price_display
  }

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-slate-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
    return <span className="text-sm font-medium text-slate-900 dark:text-white">{value}</span>
  }

  if (comparisonLoading || !comparison) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-neutral-700 rounded mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-neutral-800 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const plans = comparison.plans

  if (compact) {
    // Compact version for embedded use
    return (
      <div>
        {/* Billing cycle toggle for compact view */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 p-1 bg-slate-100 dark:bg-neutral-800 rounded-lg text-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-neutral-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-neutral-400'
              }`}
            >
              Yearly
              <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded">
                -21%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId
            const isHighlight = plan.highlight

            return (
              <div
                key={plan.id}
                className={`relative p-5 rounded-2xl border-2 transition-all ${
                  isHighlight
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20'
                    : isCurrent
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold rounded-full">
                    RECOMMENDED
                  </div>
                )}

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    {plan.is_custom ? 'Custom' : plan.id === 'free' ? 'Free' : getDisplayPrice(plan)}
                  </span>
                  {billingCycle === 'yearly' && plan.price_yearly > 0 && plan.yearly_savings_display && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                      {plan.yearly_savings_display}
                    </div>
                  )}
                </div>

              <button
                onClick={() => handleSelectPlan(plan.id as PlanId)}
                disabled={isCurrent || isLoading === plan.id}
                className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${
                  isCurrent
                    ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 cursor-default'
                    : isHighlight
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700'
                    : plan.is_custom
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                    : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700'
                }`}
              >
                {isLoading === plan.id ? 'Loading...' : isCurrent ? 'Current Plan' : plan.is_custom ? 'Contact Sales' : 'Upgrade'}
              </button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Full pricing table
  return (
    <div className="relative mt-4">
      {/* Billing cycle toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-3 p-1.5 bg-slate-100 dark:bg-neutral-800 rounded-xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Yearly
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
              Save 21%
            </span>
          </button>
        </div>
      </div>

      {/* Most Popular badge - positioned outside the overflow container */}
      <div className="absolute top-[52px] left-1/2 ml-[12.5%] -translate-x-1/2 z-10 px-4 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
        MOST POPULAR
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        {/* Plan headers */}
        <div className="grid grid-cols-4 border-b border-slate-200 dark:border-neutral-800">
          <div className="p-6 bg-slate-50 dark:bg-neutral-900/50">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your AI Learning Journey</h3>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">Where will you be in 30 days?</p>
          </div>

          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId
            const isHighlight = plan.highlight

            return (
              <div
                key={plan.id}
                className={`relative p-6 text-center ${
                  isHighlight ? 'bg-violet-50 dark:bg-violet-950/20' : ''
                }`}
              >
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h4>
              <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">{plan.description}</p>

              <div className="mt-4 mb-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  {plan.is_custom ? 'Custom' : plan.id === 'free' ? 'Free' : getDisplayPrice(plan)}
                </span>
                {billingCycle === 'yearly' && plan.price_yearly > 0 && plan.yearly_savings_display && (
                  <div className="mt-1">
                    <span className="text-xs text-slate-500 dark:text-neutral-400">
                      Billed {plan.yearly_price_display}
                    </span>
                    <span className="ml-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {plan.yearly_savings_display}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleSelectPlan(plan.id as PlanId)}
                disabled={isCurrent || isLoading === plan.id}
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  isCurrent
                    ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 cursor-default'
                    : isHighlight
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25'
                    : plan.is_custom
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                    : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700'
                } ${isLoading === plan.id ? 'opacity-50' : ''}`}
              >
                {isLoading === plan.id
                  ? 'Redirecting...'
                  : isCurrent
                  ? 'Current Plan'
                  : plan.is_custom
                  ? 'Contact Sales'
                  : plan.id === 'free'
                  ? 'Get Started'
                  : 'Upgrade Now'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Feature comparison rows */}
      {comparison.categories.map((category, catIndex) => (
        <div key={category.category}>
          {/* Category header */}
          <div className="grid grid-cols-4 bg-slate-50 dark:bg-neutral-800/50">
            <div className="col-span-4 px-6 py-3">
              <h5 className="text-sm font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-wide">
                {category.category}
              </h5>
            </div>
          </div>

          {/* Feature rows */}
          {category.features.map((feature, featureIndex) => (
            <div
              key={feature.name}
              className={`grid grid-cols-4 ${
                featureIndex < category.features.length - 1 || catIndex < comparison.categories.length - 1
                  ? 'border-b border-slate-100 dark:border-neutral-800/50'
                  : ''
              }`}
            >
              <div className="px-6 py-4 flex items-center">
                <span className="text-sm text-slate-600 dark:text-neutral-400">{feature.name}</span>
              </div>

              {plans.map((plan) => {
                const isHighlight = plan.highlight
                const value = feature[plan.id as keyof typeof feature]

                return (
                  <div
                    key={plan.id}
                    className={`px-6 py-4 flex items-center justify-center ${
                      isHighlight ? 'bg-violet-50/50 dark:bg-violet-950/10' : ''
                    }`}
                  >
                    {renderFeatureValue(value as boolean | string)}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      ))}

        {/* Footer */}
        <div className="p-6 bg-slate-50 dark:bg-neutral-900/50 text-center">
          <p className="text-sm text-slate-500 dark:text-neutral-400">
            Start learning free, upgrade when you're ready for more. 14-day money-back guarantee on all paid plans.
          </p>
        </div>
      </div>
    </div>
  )
}
