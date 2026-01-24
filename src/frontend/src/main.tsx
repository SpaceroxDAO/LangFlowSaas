import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'
import { DevModeProvider, isDevMode } from '@/providers/DevModeProvider'
import { TourProvider } from '@/providers/TourProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { initSentry } from '@/lib/sentry'

// Initialize Sentry error monitoring (before anything else)
initSentry()

// Dev mode check - skips Clerk auth entirely
const IS_DEV_MODE = isDevMode

// Only require Clerk key in production mode
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!IS_DEV_MODE && !PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

// Wrapper component that conditionally uses Clerk or Dev mode
function AuthProvider({ children }: { children: React.ReactNode }) {
  if (IS_DEV_MODE) {
    console.log('[Dev Mode] Authentication disabled - using mock user')
    return <DevModeProvider>{children}</DevModeProvider>
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY!} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TourProvider>
            <App />
          </TourProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
