/**
 * FrameworkPage - Explains the "Dog with a Job" framework
 * Split-panel layout introducing the 3-step training methodology
 */
import { Link } from 'react-router-dom'
import { isDevMode } from '@/providers/DevModeProvider'
import { CharlieMascot, IdentityIcon, CoachingIcon, TricksIcon } from '@/components/icons'

export function FrameworkPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#f8f9fa',
        backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Dev mode banner */}
      {isDevMode && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center text-sm font-medium">
          Development Mode - Authentication Disabled
        </div>
      )}

      {/* Header */}
      <header className="py-6 px-4 border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Teach Charlie</span>
          </Link>

          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Info Card */}
          <div className="lg:w-[400px] flex-shrink-0 bg-gradient-to-br from-violet-400 to-violet-500 rounded-3xl p-8 text-white flex flex-col">
            {/* Mascot */}
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <CharlieMascot className="w-14 h-14" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4">The Dog with a Job Framework</h2>

            {/* Description */}
            <p className="text-white/90 leading-relaxed flex-1">
              Building an AI agent is like training a new puppy for a job. You don't just throw
              commands at it — you teach it who it is, what rules to follow, and what tricks
              to perform.
            </p>

            <p className="text-white/90 leading-relaxed mt-4">
              Our 3-step process makes it simple for anyone to create powerful AI assistants,
              no technical skills required.
            </p>
          </div>

          {/* Right Panel - Steps Card */}
          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Our 3-Step Training Plan</h3>

            <div className="space-y-6">
              {/* Step 1 - Identity */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IdentityIcon className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    <span className="text-violet-600">1.</span> Identity
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Give Charlie a name and define his job description. Is he a helpful support
                    agent? A knowledgeable sales assistant? A friendly tutor?
                  </p>
                </div>
              </div>

              {/* Step 2 - Coaching */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CoachingIcon className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    <span className="text-pink-500">2.</span> Coaching
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Teach Charlie the rules of the house. What knowledge does he need?
                    What guidelines should he follow? What's his tone and style?
                  </p>
                </div>
              </div>

              {/* Step 3 - Tricks */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TricksIcon className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    <span className="text-violet-500">3.</span> Tricks
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Enable special capabilities like web search, image generation, or
                    custom integrations. These are the skills that make Charlie truly useful.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link
                to="/create"
                className="inline-flex items-center gap-2 bg-violet-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-600 transition-colors w-full justify-center"
              >
                Start Training
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
