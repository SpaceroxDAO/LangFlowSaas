/**
 * Langflow Theme Constants
 * Used for programmatic access to theme colors when CSS classes aren't suitable
 */

export const langflowTheme = {
  colors: {
    // Primary violet/purple (Langflow brand)
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
    // Sidebar colors (dark theme)
    sidebar: {
      bg: '#111827',
      hover: '#1f2937',
      active: '#374151',
      border: '#374151',
      text: '#f9fafb',
      textMuted: '#9ca3af',
    },
    // General UI colors
    background: '#f9fafb',
    border: '#e5e7eb',
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      muted: '#9ca3af',
    },
  },
  // Common class combinations for reuse
  classes: {
    button: {
      primary: 'bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    },
    input: 'border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent',
    card: 'bg-white rounded-xl border border-gray-200 shadow-sm',
  },
} as const

export type LangflowTheme = typeof langflowTheme
