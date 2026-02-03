import { SignUp } from '@clerk/clerk-react'
import { useSearchParams } from 'react-router-dom'

export function SignUpPage() {
  const [searchParams] = useSearchParams()

  // Check for redirect URL (used by checkout flow)
  const redirectUrl = searchParams.get('redirect_url')

  // Check for plan parameter (legacy flow from pricing page)
  const plan = searchParams.get('plan')

  // Determine where to redirect after signup
  // Priority: redirect_url > plan checkout > dashboard
  let afterSignUpUrl = '/dashboard'
  if (redirectUrl) {
    afterSignUpUrl = decodeURIComponent(redirectUrl)
  } else if (plan && plan !== 'free') {
    afterSignUpUrl = `/checkout/${plan}`
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: '#f8f9fa',
        backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl={afterSignUpUrl}
      />
    </div>
  )
}
