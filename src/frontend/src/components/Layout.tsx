import { Link, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { isDevMode, DevUserButton } from '@/providers/DevModeProvider'

interface LayoutProps {
  children: React.ReactNode
}

// Development mode banner component
function DevModeBanner() {
  if (!isDevMode) return null

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center text-sm font-medium">
      Development Mode - Authentication Disabled
    </div>
  )
}

// Use dev or Clerk UserButton based on environment
const AuthUserButton = isDevMode ? DevUserButton : UserButton

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

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
      <DevModeBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-semibold text-gray-900">Teach Charlie</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'text-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/create"
                className={`text-sm font-medium transition-colors ${
                  isActive('/create')
                    ? 'text-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Create Agent
              </Link>
              {/* Dev mode only: Link to AI Canvas (Langflow) */}
              {isDevMode && (
                <a
                  href="http://localhost:7860"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
                >
                  AI Canvas
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </nav>

            {/* User */}
            <div className="flex items-center">
              {isDevMode ? <AuthUserButton /> : <UserButton afterSignOutUrl="/" />}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  )
}
