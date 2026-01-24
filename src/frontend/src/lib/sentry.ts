/**
 * Sentry Error Monitoring Configuration (DISABLED)
 *
 * Sentry is currently disabled. To enable:
 * 1. Install @sentry/react: npm install @sentry/react
 * 2. Restore the original sentry.ts implementation
 * 3. Set VITE_SENTRY_DSN in your environment
 */

// Stub implementations - no-op when Sentry is disabled
export function initSentry(): void {
  console.log('[Sentry] Disabled - error monitoring not active')
}

export function setSentryUser(_userId: string | null, _email?: string): void {
  // No-op
}

export function setSentryContext(
  _name: string,
  _context: Record<string, unknown>
): void {
  // No-op
}

export function captureException(
  error: Error,
  context?: Record<string, unknown>
): void {
  console.error('[Error]', error, context)
}

export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info'
): void {
  console.log(`[${level}]`, message)
}

// Stub Sentry export for ErrorBoundary compatibility
export const Sentry = {
  ErrorBoundary: ({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode; showDialog?: boolean }) => {
    // Simple error boundary implementation
    return children
  },
}
