/**
 * Test Utilities
 *
 * Custom render function and utilities for testing components
 * with all necessary providers (React Query, Router, etc.)
 */

import { ReactElement, ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

interface AllProvidersProps {
  children: ReactNode
}

// Wrapper with all providers
function AllProviders({ children }: AllProvidersProps) {
  const queryClient = createTestQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

// Custom render that wraps components with providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'

// Override render with our custom version
export { customRender as render }

// Helper to create mock chat messages
export function createMockMessage(
  overrides: Partial<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    status?: 'sending' | 'sent' | 'error'
    isEdited?: boolean
    editedAt?: string
    feedback?: 'positive' | 'negative' | null
  }> = {}
) {
  return {
    id: 'msg-1',
    role: 'user' as const,
    content: 'Hello, world!',
    timestamp: new Date('2026-01-24T12:00:00Z'),
    ...overrides,
  }
}
