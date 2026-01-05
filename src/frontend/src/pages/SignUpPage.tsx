import { SignUp } from '@clerk/clerk-react'

export function SignUpPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: '#f8f9fa',
        backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  )
}
