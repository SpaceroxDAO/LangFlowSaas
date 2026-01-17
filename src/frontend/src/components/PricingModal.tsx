/**
 * Pricing modal for plan selection and upgrade.
 */
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/providers/DevModeProvider'
import type { Plan } from '@/types'

interface PricingModalProps {
  onClose: () => void
  currentPlanId?: string
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

  const formatPrice = (cents: number) => {
    if (cents === 0) return 'Free'
    return `$${(cents / 100).toFixed(0)}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
              <p className="text-gray-500 mt-1">
                Scale your AI agents as you grow
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6">
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border border-gray-200 rounded-xl p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-10 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 bg-gray-100 rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrentPlan = plan.id === currentPlanId
                const isPopular = plan.id === 'pro'

                return (
                  <div
                    key={plan.id}
                    className={`relative border rounded-xl p-6 transition-all ${
                      isPopular
                        ? 'border-violet-500 ring-2 ring-violet-500 ring-opacity-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isCurrentPlan ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 bg-violet-500 text-white text-xs font-semibold rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(plan.price_monthly)}
                      </span>
                      {plan.price_monthly > 0 && (
                        <span className="text-gray-500 ml-1">/month</span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrentPlan || isLoading === plan.id}
                      className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
                        isCurrentPlan
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isPopular
                          ? 'bg-violet-500 text-white hover:bg-violet-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${isLoading === plan.id ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {isLoading === plan.id
                        ? 'Redirecting...'
                        : isCurrentPlan
                        ? 'Current Plan'
                        : plan.id === 'free'
                        ? 'Get Started'
                        : 'Upgrade'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Footer note */}
          <p className="text-center text-sm text-gray-500 mt-6">
            All plans include a 14-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
