import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserButton } from '@clerk/clerk-react'
import { Dog } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { isDevMode, DevUserButton } from '@/providers/DevModeProvider'
import { api } from '@/lib/api'

interface AppShellProps {
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

export function AppShell({ children }: AppShellProps) {
  const queryClient = useQueryClient()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Fetch user settings to get sidebar state
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Mutation to update sidebar state
  const updateSettingsMutation = useMutation({
    mutationFn: (collapsed: boolean) =>
      api.updateSettings({ sidebar_collapsed: collapsed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })

  // Sync local state with server settings
  useEffect(() => {
    if (settings?.sidebar_collapsed !== undefined) {
      setSidebarCollapsed(settings.sidebar_collapsed)
    }
  }, [settings?.sidebar_collapsed])

  const handleToggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    // Persist to server
    updateSettingsMutation.mutate(newState)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Dev mode banner */}
      <DevModeBanner />

      {/* Top header bar - full width */}
      <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
        {/* Left side - Logo */}
        <Link to="/dashboard" className="text-gray-900 hover:text-gray-600 transition-colors">
          <Dog className="w-6 h-6" />
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Dev mode only: Link to AI Canvas (Langflow) */}
          {isDevMode && (
            <a
              href="http://localhost:7860"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
            >
              AI Canvas
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          {/* User button with dropdown */}
          {isDevMode ? <AuthUserButton /> : <UserButton afterSignOutUrl="/" />}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}
