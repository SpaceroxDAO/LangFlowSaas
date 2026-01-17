/**
 * Upgrade prompt CTA shown when users hit plan limits.
 */
import { useState } from 'react'
import { PricingModal } from './PricingModal'

interface UpgradePromptProps {
  message?: string
  limitType?: 'messages' | 'tokens' | 'agents' | 'workflows'
}

export function UpgradePrompt({
  message = "You've reached your plan limit.",
  limitType
}: UpgradePromptProps) {
  const [showPricing, setShowPricing] = useState(false)

  const getLimitMessage = () => {
    switch (limitType) {
      case 'messages':
        return "You've used all your messages this month."
      case 'tokens':
        return "You've used all your tokens this month."
      case 'agents':
        return "You've reached your agent limit."
      case 'workflows':
        return "You've reached your workflow limit."
      default:
        return message
    }
  }

  return (
    <>
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-violet-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-violet-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">Upgrade for more</h4>
            <p className="text-sm text-gray-600 mt-1">{getLimitMessage()}</p>
            <button
              onClick={() => setShowPricing(true)}
              className="mt-3 px-4 py-2 bg-violet-500 text-white text-sm font-medium rounded-lg hover:bg-violet-600 transition-colors"
            >
              View Plans
            </button>
          </div>
        </div>
      </div>

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </>
  )
}
