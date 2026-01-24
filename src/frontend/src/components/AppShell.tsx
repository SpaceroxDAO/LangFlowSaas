import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserButton } from '@clerk/clerk-react'
import { Dog, Sun, Moon, Bell } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Breadcrumbs } from './Breadcrumbs'
import { isDevMode, DevUserButton } from '@/providers/DevModeProvider'
import { useTheme } from '@/providers/ThemeProvider'
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
  const { theme, toggleTheme } = useTheme()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notificationCount] = useState(0) // Placeholder for future notifications

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
    <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-neutral-950 transition-colors duration-200">
      {/* Dev mode banner */}
      <DevModeBanner />

      {/* Top header bar - full width */}
      <header className="h-12 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 flex items-center px-4 shrink-0 transition-colors duration-200">
        {/* Left side - Logo */}
        <Link to="/dashboard" className="text-gray-900 dark:text-neutral-100 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors shrink-0">
          <Dog className="w-6 h-6" />
        </Link>

        {/* Breadcrumb navigation - in header, after logo */}
        <div className="flex-1 ml-4 min-w-0">
          <Breadcrumbs />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notification bell */}
          <button
            className="relative p-2 text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* User button with dropdown */}
          {isDevMode ? <AuthUserButton /> : <UserButton afterSignOutUrl="/" />}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-white dark:bg-neutral-950 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  )
}
