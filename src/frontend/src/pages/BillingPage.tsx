/**
 * Billing page for subscription management and usage tracking.
 */
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/providers/DevModeProvider'
import { UsageBar } from '@/components/UsageBar'
import { PricingModal } from '@/components/PricingModal'

export function BillingPage() {
  const { getToken } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showPricing, setShowPricing] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  // Check for success/canceled params from Stripe redirect
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Clear URL params after showing message
  useEffect(() => {
    if (success || canceled) {
      const timer = setTimeout(() => {
        setSearchParams({})
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, canceled, setSearchParams])

  // Fetch subscription
  const { data: subscription, isLoading: subLoading, refetch: refetchSub } = useQuery({
    queryKey: ['billing-subscription'],
    queryFn: () => api.getSubscription(),
    refetchOnWindowFocus: true,
  })

  // Fetch usage
  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['billing-usage'],
    queryFn: () => api.getUsage(),
    refetchOnWindowFocus: true,
  })

  // Fetch plans for comparison
  const { data: plans = [] } = useQuery({
    queryKey: ['billing-plans'],
    queryFn: () => api.listPlans(),
  })

  const handleManageSubscription = async () => {
    setPortalLoading(true)
    try {
      const { portal_url } = await api.createPortalSession({
        return_url: window.location.href,
      })
      window.location.href = portal_url
    } catch (error) {
      console.error('Portal error:', error)
      alert('Failed to open billing portal. Please try again.')
    } finally {
      setPortalLoading(false)
    }
  }

  // Refresh subscription after successful checkout
  useEffect(() => {
    if (success === 'true') {
      refetchSub()
    }
  }, [success, refetchSub])

  const currentPlan = plans.find(p => p.id === subscription?.plan_id)

  if (subLoading || usageLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-64 bg-gray-100 rounded mb-8" />
          <div className="bg-white rounded-xl p-6 mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded" />
              <div className="h-4 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Billing & Usage</h1>
      <p className="text-gray-500 mb-8">Manage your subscription and monitor usage</p>

      {/* Success/Cancel alerts */}
      {success === 'true' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-green-700">
            Your subscription has been updated successfully!
          </span>
        </div>
      )}

      {canceled === 'true' && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-amber-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-amber-700">
            Checkout was canceled. No changes were made.
          </span>
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-violet-600">
                {subscription?.plan_name || 'Free'}
              </span>
              {subscription?.is_paid && (
                <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                  Active
                </span>
              )}
              {subscription?.cancel_at_period_end && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  Cancels at period end
                </span>
              )}
              {subscription?.status === 'past_due' && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  Past Due
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {subscription?.is_paid && (
              <button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {portalLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
            )}
            <button
              onClick={() => setShowPricing(true)}
              className="px-4 py-2 bg-violet-500 text-white text-sm font-medium rounded-lg hover:bg-violet-600 transition-colors"
            >
              {subscription?.is_paid ? 'Change Plan' : 'Upgrade'}
            </button>
          </div>
        </div>

        {subscription?.current_period_end && (
          <p className="text-sm text-gray-500">
            {subscription.cancel_at_period_end
              ? 'Your subscription ends on '
              : 'Next billing date: '}
            {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

        {/* Plan features */}
        {currentPlan && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Plan includes:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {currentPlan.limits.agents}
                </div>
                <div className="text-xs text-gray-500">Agents</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {currentPlan.limits.messages_per_month.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Messages/mo</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {(currentPlan.limits.tokens_per_month / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-gray-500">Tokens/mo</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {currentPlan.limits.workflows}
                </div>
                <div className="text-xs text-gray-500">Workflows</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Usage Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">This Month's Usage</h2>

        {usage && (
          <div className="space-y-1">
            <UsageBar
              label="Messages"
              current={usage.messages_sent}
              max={usage.limits.messages_per_month}
            />
            <UsageBar
              label="Tokens"
              current={usage.tokens_used}
              max={usage.limits.tokens_per_month}
            />
            <UsageBar
              label="Agents"
              current={usage.agents_count}
              max={usage.limits.agents}
            />
            <UsageBar
              label="Workflows"
              current={usage.workflows_count}
              max={usage.limits.workflows}
            />
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Usage resets at the beginning of each billing period.
        </p>
      </div>

      {/* Compare Plans */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Compare Plans</h2>
          <button
            onClick={() => setShowPricing(true)}
            className="text-sm text-violet-600 hover:text-violet-700"
          >
            View all details
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 font-medium text-gray-500">Feature</th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    className={`text-center py-3 font-medium ${
                      plan.id === subscription?.plan_id
                        ? 'text-violet-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="py-3 text-gray-700">Agents</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center py-3 text-gray-900">
                    {plan.limits.agents}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-3 text-gray-700">Messages / month</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center py-3 text-gray-900">
                    {plan.limits.messages_per_month.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-3 text-gray-700">Tokens / month</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center py-3 text-gray-900">
                    {(plan.limits.tokens_per_month / 1000).toFixed(0)}K
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-3 text-gray-700">Workflows</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center py-3 text-gray-900">
                    {plan.limits.workflows}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 text-gray-700">MCP Servers</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center py-3 text-gray-900">
                    {plan.limits.mcp_servers}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <PricingModal
          onClose={() => setShowPricing(false)}
          currentPlanId={subscription?.plan_id}
        />
      )}
    </div>
  )
}
