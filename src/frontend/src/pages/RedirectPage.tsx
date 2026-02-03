import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { isDevMode } from '@/providers/DevModeProvider'
import { Loader2 } from 'lucide-react'

/**
 * Smart redirect page for external links (e.g., from Webflow marketing site).
 *
 * URL: /go?to=signup|signin|dashboard|checkout
 *
 * If user is signed in -> goes to dashboard (or specified destination)
 * If user is not signed in -> goes to sign-up (or sign-in)
 *
 * Usage from Webflow:
 * - "Get Started" button -> https://app.teachcharlie.ai/go?to=signup
 * - "Sign In" button -> https://app.teachcharlie.ai/go?to=signin
 * - Any CTA -> https://app.teachcharlie.ai/go (defaults to signup or dashboard)
 */
export function RedirectPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isSignedIn, isLoaded } = useAuth()

  const destination = searchParams.get('to') || 'auto'

  useEffect(() => {
    if (!isLoaded && !isDevMode) return

    const userIsSignedIn = isDevMode || isSignedIn

    // Determine redirect based on auth state and requested destination
    let redirectTo = '/dashboard'

    if (userIsSignedIn) {
      // User is signed in
      switch (destination) {
        case 'checkout':
          redirectTo = '/checkout/individual'
          break
        case 'billing':
          redirectTo = '/dashboard/billing'
          break
        case 'settings':
          redirectTo = '/dashboard/settings'
          break
        case 'signin':
        case 'signup':
        case 'auto':
        default:
          redirectTo = '/dashboard'
      }
    } else {
      // User is not signed in
      switch (destination) {
        case 'signin':
          redirectTo = '/sign-in'
          break
        case 'checkout':
          redirectTo = '/checkout/individual'
          break
        case 'signup':
        case 'auto':
        default:
          redirectTo = '/sign-up'
      }
    }

    navigate(redirectTo, { replace: true })
  }, [isLoaded, isSignedIn, destination, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-neutral-400">Redirecting...</p>
      </div>
    </div>
  )
}
