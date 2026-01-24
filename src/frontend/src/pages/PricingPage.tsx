/**
 * Public Pricing Page - showcase plans to prospective customers.
 * Features a distinctive, premium design with animated elements.
 */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import type { PlanId } from '@/types'

// FAQ data
const FAQ_ITEMS = [
  {
    question: "What are AI credits?",
    answer: "AI credits are the currency that powers your agents. When Charlie runs your AI agents, credits are consumed based on the model used. Different models have different credit costs. If you bring your own API keys, those calls don't consume credits."
  },
  {
    question: "Can I use my own API keys?",
    answer: "Yes! All plans support Bring Your Own (BYO) API keys. When you use your own OpenAI, Anthropic, or other provider keys, those calls don't consume your AI credits. It's perfect for power users who want more control over costs."
  },
  {
    question: "What happens when I run out of credits?",
    answer: "Your agents will pause until you get more credits. On paid plans, you can purchase additional credit packs anytime, or set up auto top-up to automatically buy more when you run low."
  },
  {
    question: "Can I change plans anytime?",
    answer: "Absolutely. Upgrade anytime and your new features are available immediately. If you downgrade, you'll keep your current plan until the end of your billing period."
  },
  {
    question: "What's included in the Business plan?",
    answer: "Business plans include everything in Individual, plus SSO authentication, audit logs, custom branding, API access, dedicated support, and volume discounts on credits. Contact us to discuss your specific needs."
  },
]

export function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const { data: comparison, isLoading: comparisonLoading } = useQuery({
    queryKey: ['pricing-comparison'],
    queryFn: () => api.getPricingComparison(),
  })

  const handleSelectPlan = async (planId: PlanId) => {
    if (planId === 'free') {
      window.location.href = '/sign-up'
      return
    }

    if (planId === 'business') {
      window.open('mailto:sales@teachcharlie.ai?subject=Business Plan Inquiry', '_blank')
      return
    }

    // Redirect to sign up with plan preselected
    window.location.href = `/sign-up?plan=${planId}`
  }

  const plans = comparison?.plans ?? []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200 dark:bg-violet-900/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-25" />
      </div>

      {/* Header/Nav */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">C</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Teach Charlie</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/framework" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Framework
            </Link>
            <span className="text-violet-600 dark:text-violet-400 font-medium">Pricing</span>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/sign-in"
              className="px-4 py-2 text-slate-700 dark:text-neutral-300 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 transition-colors shadow-lg shadow-violet-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative z-10 px-6 pt-16 pb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Simple, transparent
            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              pricing for everyone
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Start free, then scale as you grow. No hidden fees, no surprises.
            Bring your own API keys to save even more.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {comparisonLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse h-96 bg-slate-100 dark:bg-neutral-800 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isHighlight = plan.highlight

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-3xl p-8 transition-all duration-300 ${
                      isHighlight
                        ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white ring-4 ring-violet-500/50 scale-105 z-10 shadow-2xl shadow-violet-500/30'
                        : 'bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-violet-300 dark:hover:border-violet-800 hover:shadow-xl'
                    }`}
                  >
                    {isHighlight && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-xs font-bold rounded-full shadow-lg">
                        MOST POPULAR
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className={`text-2xl font-bold ${isHighlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {plan.name}
                      </h3>
                      <p className={`mt-1 text-sm ${isHighlight ? 'text-violet-200' : 'text-slate-500 dark:text-neutral-400'}`}>
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-8">
                      <span className={`text-5xl font-bold tracking-tight ${isHighlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {plan.price_display}
                      </span>
                      {!plan.is_custom && plan.price_monthly > 0 && (
                        <span className={`ml-2 ${isHighlight ? 'text-violet-200' : 'text-slate-500 dark:text-neutral-400'}`}>
                          /month
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.slice(0, 6).map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg
                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHighlight ? 'text-emerald-300' : 'text-emerald-500'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={`text-sm ${isHighlight ? 'text-white/90' : 'text-slate-600 dark:text-neutral-300'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan.id as PlanId)}
                      disabled={isLoading === plan.id}
                      className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all ${
                        isHighlight
                          ? 'bg-white text-violet-700 hover:bg-slate-100 shadow-lg'
                          : plan.is_custom
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                          : 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/25'
                      } ${isLoading === plan.id ? 'opacity-50' : ''}`}
                    >
                      {plan.is_custom ? 'Contact Sales' : plan.id === 'free' ? 'Get Started Free' : 'Start Free Trial'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-4">
            Compare all features
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to build, deploy, and scale AI agents for your business
          </p>

          {comparison && (
            <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              {/* Table header */}
              <div className="grid grid-cols-4 bg-slate-50 dark:bg-neutral-800/50 border-b border-slate-200 dark:border-neutral-800">
                <div className="p-6">
                  <span className="text-sm font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wide">
                    Feature
                  </span>
                </div>
                {plans.map((plan) => (
                  <div key={plan.id} className={`p-6 text-center ${plan.highlight ? 'bg-violet-50 dark:bg-violet-950/20' : ''}`}>
                    <span className={`text-lg font-bold ${plan.highlight ? 'text-violet-600 dark:text-violet-400' : 'text-slate-900 dark:text-white'}`}>
                      {plan.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Feature rows */}
              {comparison.categories.map((category) => (
                <div key={category.category}>
                  <div className="px-6 py-3 bg-slate-50 dark:bg-neutral-800/30">
                    <span className="text-xs font-semibold text-slate-500 dark:text-neutral-500 uppercase tracking-wide">
                      {category.category}
                    </span>
                  </div>
                  {category.features.map((feature, idx) => (
                    <div key={feature.name} className={`grid grid-cols-4 ${idx < category.features.length - 1 ? 'border-b border-slate-100 dark:border-neutral-800/50' : ''}`}>
                      <div className="p-4 flex items-center">
                        <span className="text-sm text-slate-600 dark:text-neutral-400">{feature.name}</span>
                      </div>
                      {plans.map((plan) => {
                        const value = feature[plan.id as keyof typeof feature]
                        return (
                          <div key={plan.id} className={`p-4 flex items-center justify-center ${plan.highlight ? 'bg-violet-50/50 dark:bg-violet-950/10' : ''}`}>
                            {typeof value === 'boolean' ? (
                              value ? (
                                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-slate-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )
                            ) : (
                              <span className="text-sm font-medium text-slate-900 dark:text-white">{value}</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ section */}
      <section className="relative z-10 px-6 py-16 bg-slate-50/50 dark:bg-neutral-900/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-4">
            Frequently asked questions
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 text-center mb-12">
            Everything you need to know about our pricing
          </p>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-600 dark:text-neutral-400">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to build your AI agents?
          </h2>
          <p className="text-xl text-slate-600 dark:text-neutral-400 mb-8">
            Start for free. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-up"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 transition-colors shadow-lg shadow-violet-500/30"
            >
              Get Started Free
            </Link>
            <Link
              to="/"
              className="px-8 py-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 text-lg font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-slate-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-500 dark:text-neutral-400">
          <p>2026 Teach Charlie AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
