import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react'
import { isDevMode, DevSignedIn, DevSignedOut } from '@/providers/DevModeProvider'
import { CharlieMascot } from '@/components/icons'

// Use dev or Clerk components based on environment
const AuthSignedIn = isDevMode ? DevSignedIn : SignedIn
const AuthSignedOut = isDevMode ? DevSignedOut : SignedOut

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dev mode banner */}
      {isDevMode && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center text-sm font-medium">
          Development Mode - Authentication Disabled
        </div>
      )}

      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Teach Charlie</span>
          </div>

          <div className="flex items-center gap-4">
            {isDevMode ? (
              <Link
                to="/dashboard"
                className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <AuthSignedOut>
                  <SignInButton mode="modal">
                    <button className="text-gray-600 hover:text-gray-900 font-medium">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors">
                      Get Started
                    </button>
                  </SignUpButton>
                </AuthSignedOut>
                <AuthSignedIn>
                  <Link
                    to="/dashboard"
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors"
                  >
                    Dashboard
                  </Link>
                </AuthSignedIn>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Charlie Mascot */}
          <div className="flex justify-center mb-8">
            <CharlieMascot className="w-24 h-24" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-violet-500">Teach Charlie AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            The education-first platform for building AI agents. No coding required.
          </p>

          {/* Quote Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12 max-w-2xl mx-auto shadow-sm">
            <blockquote className="text-lg text-gray-700 italic leading-relaxed">
              "Think of building an AI agent like training a dog. First, you give it an{' '}
              <span className="font-semibold text-violet-600">identity</span> — its name and job.
              Then you teach it the <span className="font-semibold text-pink-500">rules</span> of the house.
              Finally, you teach it <span className="font-semibold text-violet-500">tricks</span> —
              the special skills that make it useful."
            </blockquote>
          </div>

          {/* CTA Button */}
          {isDevMode ? (
            <Link
              to="/framework"
              className="inline-flex items-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-900 transition-colors shadow-lg"
            >
              Start Teaching
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ) : (
            <>
              <AuthSignedOut>
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-900 transition-colors shadow-lg">
                    Start Teaching
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </SignUpButton>
              </AuthSignedOut>
              <AuthSignedIn>
                <Link
                  to="/framework"
                  className="inline-flex items-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-900 transition-colors shadow-lg"
                >
                  Start Teaching
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </AuthSignedIn>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
