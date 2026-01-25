/**
 * Sentry Error Monitoring Configuration
 *
 * To enable Sentry:
 * 1. Create a Sentry account and project at https://sentry.io
 * 2. Set VITE_SENTRY_DSN environment variable to your DSN
 * 3. Optionally set VITE_SENTRY_ENVIRONMENT (defaults to 'production')
 */

import * as SentrySDK from '@sentry/react'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production'
const IS_PRODUCTION = import.meta.env.PROD

// Only initialize Sentry if DSN is provided
const isSentryEnabled = !!SENTRY_DSN

/**
 * Initialize Sentry error monitoring
 * Call this once in main.tsx before rendering the app
 */
export function initSentry(): void {
  if (!isSentryEnabled) {
    if (IS_PRODUCTION) {
      console.warn('[Sentry] DSN not configured - error monitoring disabled. Set VITE_SENTRY_DSN to enable.')
    }
    return
  }

  SentrySDK.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    integrations: [
      SentrySDK.browserTracingIntegration(),
      SentrySDK.replayIntegration({
        // Mask all text and block all media for privacy
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance monitoring
    tracesSampleRate: IS_PRODUCTION ? 0.1 : 1.0, // 10% in production, 100% in dev
    // Session replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    // Release tracking
    release: import.meta.env.VITE_APP_VERSION || 'unknown',
    // Filter out non-actionable errors
    beforeSend(event) {
      // Don't send errors from browser extensions
      if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
        frame => frame.filename?.includes('chrome-extension://')
      )) {
        return null
      }
      return event
    },
  })
}

/**
 * Set the current user for error attribution
 */
export function setSentryUser(userId: string | null, email?: string): void {
  if (!isSentryEnabled) return

  if (userId) {
    SentrySDK.setUser({ id: userId, email })
  } else {
    SentrySDK.setUser(null)
  }
}

/**
 * Add context information for debugging
 */
export function setSentryContext(
  name: string,
  context: Record<string, unknown>
): void {
  if (!isSentryEnabled) return
  SentrySDK.setContext(name, context)
}

/**
 * Capture an exception with optional context
 */
export function captureException(
  error: Error,
  context?: Record<string, unknown>
): void {
  if (!isSentryEnabled) {
    console.error('[Error]', error, context)
    return
  }

  SentrySDK.captureException(error, {
    extra: context,
  })
}

/**
 * Capture a message/event
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info'
): void {
  if (!isSentryEnabled) {
    console.log(`[${level}]`, message)
    return
  }

  SentrySDK.captureMessage(message, level)
}

// Export Sentry for ErrorBoundary usage
export const Sentry = SentrySDK
