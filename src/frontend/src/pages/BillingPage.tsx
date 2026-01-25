/**
 * Billing & Usage page - comprehensive dashboard for credits, usage, and subscription management.
 * Features a modern, credit-first design with prominent balance display.
 */
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/providers/DevModeProvider'
import { UsageBar } from '@/components/UsageBar'
import { CreditBalance, BuyCreditsModal, AutoTopUpSettings, SpendCapSettings, PricingTable } from '@/components/billing'
import type { PlanId, BillingOverview, CreditBalance as CreditBalanceType, AutoTopUpSettings as AutoTopUpSettingsType, SpendCapSettings as SpendCapSettingsType } from '@/types'

export function BillingPage() {
  const { getToken } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showPricing, setShowPricing] = useState(false)
  const [showBuyCredits, setShowBuyCredits] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'plans'>('overview')

  // Check for success/canceled params from Stripe redirect
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')
  const creditsSuccess = searchParams.get('credits_success')
  const creditsCanceled = searchParams.get('credits_canceled')

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Clear URL params after showing message
  useEffect(() => {
    if (success || canceled || creditsSuccess || creditsCanceled) {
      const timer = setTimeout(() => {
        setSearchParams({})
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, canceled, creditsSuccess, creditsCanceled, setSearchParams])

  // Fetch complete billing overview
  const { data: overview, isLoading, refetch } = useQuery({
    queryKey: ['billing-overview'],
    queryFn: () => api.getBillingOverview(),
    refetchOnWindowFocus: true,
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

  // Refresh after successful checkout
  useEffect(() => {
    if (success === 'true' || creditsSuccess === 'true') {
      refetch()
    }
  }, [success, creditsSuccess, refetch])

  // Build credit balance object for component
  const creditBalance: CreditBalanceType = overview?.credits ?? {
    balance: 0,
    monthly_credits: 500,
    purchased_credits: 0,
    credits_used_this_month: 0,
    credits_remaining: 500,
    reset_date: null,
    using_byo_key: false,
  }

  // Build auto top-up settings object
  const autoTopUpSettings: AutoTopUpSettingsType = {
    enabled: overview?.auto_top_up?.enabled ?? false,
    threshold_credits: overview?.auto_top_up?.threshold_credits ?? 100,
    top_up_pack_id: overview?.auto_top_up?.top_up_pack_id ?? 'credits_5500',
    top_up_pack_name: '5,500 Credits',
    top_up_credits: 5500,
    top_up_price_display: '$25',
    max_monthly_top_ups: 3,
    top_ups_this_month: overview?.auto_top_up?.top_ups_this_month ?? 0,
    can_top_up: true,
  }

  // Build spend cap settings object
  const spendCapSettings: SpendCapSettingsType = {
    enabled: overview?.spend_cap?.enabled ?? false,
    max_monthly_spend_cents: overview?.spend_cap?.max_monthly_spend_cents ?? 10000,
    max_monthly_spend_display: `$${((overview?.spend_cap?.max_monthly_spend_cents ?? 10000) / 100).toFixed(2)}`,
    current_month_spend_cents: overview?.spend_cap?.current_month_spend_cents ?? 0,
    current_month_spend_display: `$${((overview?.spend_cap?.current_month_spend_cents ?? 0) / 100).toFixed(2)}`,
    spend_remaining_cents: Math.max(0, (overview?.spend_cap?.max_monthly_spend_cents ?? 10000) - (overview?.spend_cap?.current_month_spend_cents ?? 0)),
    spend_remaining_display: `$${(Math.max(0, (overview?.spend_cap?.max_monthly_spend_cents ?? 10000) - (overview?.spend_cap?.current_month_spend_cents ?? 0)) / 100).toFixed(2)}`,
    at_limit: false,
  }

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-slate-200 dark:bg-neutral-700 rounded" />
          <div className="h-4 w-96 bg-slate-100 dark:bg-neutral-800 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-slate-100 dark:bg-neutral-800 rounded-2xl" />
            <div className="lg:col-span-2 h-64 bg-slate-100 dark:bg-neutral-800 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Usage & Billing
        </h1>
        <p className="text-slate-500 dark:text-neutral-400 mt-1">
          Manage your AI credits, subscription, and spending controls
        </p>
      </div>

      {/* Alerts */}
      {(success === 'true' || creditsSuccess === 'true') && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-emerald-800 dark:text-emerald-300">
              {creditsSuccess ? 'Credits purchased successfully!' : 'Subscription updated successfully!'}
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {creditsSuccess ? 'Your new credits are now available.' : 'Your plan changes are now active.'}
            </p>
          </div>
        </div>
      )}

      {(canceled === 'true' || creditsCanceled === 'true') && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="font-medium text-amber-800 dark:text-amber-300">
            Checkout was canceled. No changes were made.
          </p>
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === 'overview'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === 'plans'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
          }`}
        >
          Compare Plans
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Main grid: Credits + Subscription side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Credit Balance - prominent position */}
            <div className="lg:col-span-1">
              <CreditBalance
                balance={creditBalance}
                onBuyCredits={() => setShowBuyCredits(true)}
                canBuyCredits={overview?.feature_access?.can_buy_credits ?? false}
              />
            </div>

            {/* Subscription & Plan */}
            <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800/60 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Current Plan</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {overview?.subscription?.plan_name || 'Free'}
                    </span>
                    {overview?.subscription?.is_paid && (
                      <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full">
                        Active
                      </span>
                    )}
                    {overview?.subscription?.cancel_at_period_end && (
                      <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
                        Cancels soon
                      </span>
                    )}
                  </div>
                  {overview?.subscription?.current_period_end && (
                    <p className="text-sm text-slate-500 dark:text-neutral-400 mt-2">
                      {overview.subscription.cancel_at_period_end ? 'Ends on ' : 'Renews on '}
                      {new Date(overview.subscription.current_period_end).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {overview?.subscription?.is_paid && (
                    <button
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                      className="px-4 py-2.5 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                      {portalLoading ? 'Loading...' : 'Manage'}
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 transition-colors shadow-lg shadow-violet-500/20"
                  >
                    {overview?.subscription?.is_paid ? 'Change Plan' : 'Upgrade'}
                  </button>
                </div>
              </div>

              {/* Plan limits grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-neutral-800">
                <div className="p-3 bg-slate-50 dark:bg-neutral-800/50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {overview?.plan?.limits?.agents === -1 ? '...' : overview?.plan?.limits?.agents || 3}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-neutral-400">Agents</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-neutral-800/50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {overview?.plan?.limits?.workflows === -1 ? '...' : overview?.plan?.limits?.workflows || 2}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-neutral-400">Workflows</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-neutral-800/50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(overview?.plan?.limits?.monthly_credits || 500).toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-neutral-400">Credits/mo</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-neutral-800/50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {overview?.plan?.limits?.knowledge_files === -1 ? '...' : overview?.plan?.limits?.knowledge_files || 5}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-neutral-400">Knowledge Files</div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage section */}
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800/60 p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Resource Usage</h2>

            {overview?.usage && (
              <div className="space-y-4">
                <UsageBar
                  label="Agents"
                  current={overview.usage.agents?.used ?? 0}
                  max={overview.usage.agents?.limit ?? 3}
                />
                <UsageBar
                  label="Workflows"
                  current={overview.usage.workflows?.used ?? 0}
                  max={overview.usage.workflows?.limit ?? 2}
                />
                <UsageBar
                  label="AI Credits"
                  current={overview.usage.credits?.used ?? 0}
                  max={overview.usage.credits?.limit ?? 500}
                />
              </div>
            )}

            <p className="text-xs text-slate-400 dark:text-neutral-500 mt-4">
              Usage resets at the beginning of each billing period.
              {creditBalance.using_byo_key && ' You\'re using your own API keys - credits are not consumed for those calls.'}
            </p>
          </div>

          {/* Spending controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AutoTopUpSettings
              settings={autoTopUpSettings}
              canUse={overview?.feature_access?.can_use_auto_top_up ?? false}
            />
            <SpendCapSettings settings={spendCapSettings} />
          </div>
        </>
      )}

      {activeTab === 'plans' && (
        <PricingTable
          currentPlanId={overview?.subscription?.plan_id as PlanId}
          onSelectPlan={() => setShowPricing(false)}
        />
      )}

      {/* Buy Credits Modal */}
      {showBuyCredits && (
        <BuyCreditsModal onClose={() => setShowBuyCredits(false)} />
      )}
    </div>
  )
}
