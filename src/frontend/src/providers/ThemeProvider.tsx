import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'theme'

/**
 * Broadcasts theme change to all Langflow iframes via postMessage
 */
function broadcastThemeToIframes(theme: Theme) {
  // Find all iframes that might be Langflow
  const iframes = document.querySelectorAll('iframe')
  iframes.forEach((iframe) => {
    try {
      iframe.contentWindow?.postMessage(
        {
          source: 'teach-charlie-parent',
          type: 'theme_change',
          theme: theme,
        },
        '*'
      )
    } catch (e) {
      // Iframe might not be accessible (cross-origin)
      console.debug('Could not post theme to iframe:', e)
    }
  })
}

/**
 * Apply theme class to document
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * Get initial theme from localStorage or system preference
 */
function getInitialTheme(): Theme {
  // Check localStorage first
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
  if (stored === 'dark' || stored === 'light') {
    return stored
  }

  // Fall back to system preference
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  // Apply theme on mount and changes
  useEffect(() => {
    applyTheme(theme)
    broadcastThemeToIframes(theme)
  }, [theme])

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't set a preference
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (!stored) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Set up listener for iframe load events to sync theme
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // When iframe signals it's ready, send current theme
      if (event.data?.source === 'langflow-overlay' && event.data?.type === 'ready') {
        broadcastThemeToIframes(theme)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

/**
 * Hook to sync theme to a specific iframe when it loads
 * Call this in components that render Langflow iframes
 */
export function useSyncThemeToIframe(iframeRef: React.RefObject<HTMLIFrameElement>) {
  const { theme } = useTheme()

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const sendTheme = () => {
      try {
        iframe.contentWindow?.postMessage(
          {
            source: 'teach-charlie-parent',
            type: 'theme_change',
            theme: theme,
          },
          '*'
        )
      } catch (e) {
        console.debug('Could not sync theme to iframe:', e)
      }
    }

    // Send theme when iframe loads
    iframe.addEventListener('load', sendTheme)

    // Also send immediately if iframe is already loaded
    if (iframe.contentDocument?.readyState === 'complete') {
      sendTheme()
    }

    return () => iframe.removeEventListener('load', sendTheme)
  }, [iframeRef, theme])
}
