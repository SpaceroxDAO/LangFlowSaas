/**
 * Development Mode Provider
 *
 * Provides mock Clerk auth hooks when VITE_DEV_MODE=true.
 * This allows frontend development without requiring Clerk authentication.
 *
 * The backend also needs DEV_MODE=true to accept requests without JWT tokens.
 */
import { createContext, useContext, type ReactNode } from 'react'
import { useAuth as useClerkAuth } from '@clerk/clerk-react'

// Dev mode check - available throughout the app
export const isDevMode = import.meta.env.VITE_DEV_MODE === 'true'

// Mock user data matching backend DEV_USER
export const DEV_USER = {
  id: 'dev_user_123',
  email: 'dev@teachcharlie.ai',
  firstName: 'Dev',
  lastName: 'User',
}

// Auth context type matching Clerk's useAuth return type
interface DevAuthContextType {
  isSignedIn: boolean
  isLoaded: boolean
  userId: string | null
  getToken: () => Promise<string | null>
  signOut: () => Promise<void>
}

const DevAuthContext = createContext<DevAuthContextType>({
  isSignedIn: true,
  isLoaded: true,
  userId: DEV_USER.id,
  getToken: async () => null,
  signOut: async () => {
    console.log('[Dev Mode] Sign out requested - no action taken')
  },
})

// DevModeProvider wraps the app when VITE_DEV_MODE=true
export function DevModeProvider({ children }: { children: ReactNode }) {
  const value: DevAuthContextType = {
    isSignedIn: true,
    isLoaded: true,
    userId: DEV_USER.id,
    getToken: async () => null, // No token needed - backend accepts unauthenticated requests in dev mode
    signOut: async () => {
      console.log('[Dev Mode] Sign out requested - no action taken')
    },
  }

  return (
    <DevAuthContext.Provider value={value}>{children}</DevAuthContext.Provider>
  )
}

// Hook to use dev auth context - matches Clerk's useAuth API
function useDevAuth() {
  return useContext(DevAuthContext)
}

/**
 * useAuth wrapper - use this instead of importing from @clerk/clerk-react
 *
 * In dev mode: returns mock auth values
 * In production: returns Clerk's useAuth values
 */
export function useAuth() {
  // In dev mode, use the dev auth context
  if (isDevMode) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useDevAuth()
  }
  // In production, use Clerk's auth
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useClerkAuth()
}

// Mock SignedIn component - always renders children in dev mode
export function DevSignedIn({ children }: { children: ReactNode }) {
  return <>{children}</>
}

// Mock SignedOut component - never renders children in dev mode
export function DevSignedOut(_props: { children: ReactNode }) {
  return null
}

// Mock UserButton component - shows a placeholder avatar in dev mode
export function DevUserButton() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-medium text-sm">
        D
      </div>
    </div>
  )
}
