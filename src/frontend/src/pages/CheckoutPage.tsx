import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { isDevMode } from '@/providers/DevModeProvider'
import { api } from '@/lib/api'
import { Loader2, AlertCircle } from 'lucide-react'

/**
 * Checkout page that handles the signup -> checkout flow.
 *
 * URL: /checkout/:planId (e.g., /checkout/individual)
 * Optional: ?billing=yearly for yearly billing
 *
 * Flow:
 * 1. If not signed in -> redirect to /sign-up with return URL
 * 2. If signed in -> create Stripe checkout session and redirect
 */
export function CheckoutPage() {
  const { planId } = useParams<{ planId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isSignedIn, isLoaded } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const billingCycle = searchParams.get('billing') || 'monthly'

  useEffect(() => {
    if (!isLoaded) return

    // In dev mode, skip auth check
    if (isDevMode) {
      handleCheckout()
      return
    }

    if (!isSignedIn) {
      // Redirect to sign-up with return URL to this checkout page
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
      navigate(`/sign-up?redirect_url=${returnUrl}`)
      return
    }

    // User is signed in, proceed to checkout
    handleCheckout()
  }, [isLoaded, isSignedIn, planId])

  const handleCheckout = async () => {
    if (isProcessing) return
    setIsProcessing(true)
    setError(null)

    try {
      const response = await api.createCheckoutSession({
        plan_id: planId || 'individual',
        billing_cycle: billingCycle,
        success_url: `${window.location.origin}/dashboard?upgrade=success`,
        cancel_url: `${window.location.origin}/pricing?canceled=true`,
      })

      if (response.checkout_url) {
        // Redirect to Stripe Checkout
        window.location.href = response.checkout_url
      } else {
        setError('Failed to create checkout session')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setIsProcessing(false)
    }
  }

  // Show loading state
  if (!isLoaded || isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-neutral-400">
            {!isLoaded ? 'Loading...' : 'Preparing checkout...'}
          </p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 p-4">
        <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Checkout Error
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              View Plans
            </button>
            <button
              onClick={() => {
                setError(null)
                handleCheckout()
              }}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
