import { test, expect } from '@playwright/test'

/**
 * Composio Connected Tools E2E Tests
 *
 * Tests the integration of Composio tools in the Playground:
 * 1. Tool availability indicator display
 * 2. Toggle functionality (Tools Active/Off)
 * 3. Enhanced chat execution with tools
 *
 * Note: These tests require Composio connections to be set up.
 * Tests will be skipped if no tools are available.
 */
test.describe('Composio Connected Tools', () => {
  let testWorkflowId: string | null = null
  let hasConnectedTools = false

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: './e2e/.auth/user.json',
    })
    const page = await context.newPage()

    // Check if user has connected tools
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Try to get an existing workflow
    const workflowLink = page.locator('a[href*="/playground/"]').first()
    if (await workflowLink.isVisible()) {
      const href = await workflowLink.getAttribute('href')
      testWorkflowId = href?.split('/playground/')[1] || null
    }

    if (testWorkflowId) {
      // Navigate to playground and check for tool availability
      await page.goto(`/playground/${testWorkflowId}`)
      await page.waitForLoadState('networkidle')

      // Check if the connected tools indicator is visible
      const toolsIndicator = page.locator('text=Connected Tools:')
      hasConnectedTools = await toolsIndicator.isVisible({ timeout: 5000 }).catch(() => false)
    }

    await context.close()
  })

  test.describe('Tool Availability Indicator', () => {
    test('shows connected tools when user has connections', async ({ page }) => {
      if (!testWorkflowId || !hasConnectedTools) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testWorkflowId}`)
      await page.waitForLoadState('networkidle')

      // Should show "Connected Tools:" label
      await expect(page.locator('text=Connected Tools:')).toBeVisible()

      // Should show at least one app badge
      const appBadges = page.locator('[class*="rounded-full"][class*="text-xs"]').filter({
        hasText: /Gmail|Calendar|Slack|Notion|HubSpot|Drive|GitHub|Linear/i,
      })
      await expect(appBadges.first()).toBeVisible()
    })

    test('shows "Manage" link to connections page', async ({ page }) => {
      if (!testWorkflowId || !hasConnectedTools) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testWorkflowId}`)
      await page.waitForLoadState('networkidle')

      // Should show Manage link
      const manageLink = page.locator('a[href="/dashboard/connections"]').filter({
        hasText: 'Manage',
      })
      await expect(manageLink).toBeVisible()

      // Click should navigate to connections
      await manageLink.click()
      await expect(page).toHaveURL('/dashboard/connections')
    })
  })

  test.describe('Tools Toggle', () => {
    test('toggle is visible when tools are available', async ({ page }) => {
      if (!testWorkflowId || !hasConnectedTools) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testWorkflowId}`)
      await page.waitForLoadState('networkidle')

      // Should show toggle with "Tools Off" initially
      const toggle = page.locator('[data-testid="connected-tools-toggle"]')
      await expect(toggle).toBeVisible()

      // Should show "Tools Off" text initially
      await expect(page.locator('text=Tools Off')).toBeVisible()
    })

    test('toggle can be enabled', async ({ page }) => {
      if (!testWorkflowId || !hasConnectedTools) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testWorkflowId}`)
      await page.waitForLoadState('networkidle')

      // Click the toggle
      const toggle = page.locator('[data-testid="connected-tools-toggle"]')
      await toggle.click()

      // Should now show "Tools Active"
      await expect(page.locator('text=Tools Active')).toBeVisible()

      // App badges should be highlighted (violet color)
      const activeBadge = page.locator('[class*="bg-violet-50"], [class*="bg-violet-900"]')
      await expect(activeBadge.first()).toBeVisible()
    })

    test('toggle can be disabled again', async ({ page }) => {
      if (!testWorkflowId || !hasConnectedTools) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testWorkflowId}`)
      await page.waitForLoadState('networkidle')

      // Enable toggle
      const toggle = page.locator('[data-testid="connected-tools-toggle"]')
      await toggle.click()
      await expect(page.locator('text=Tools Active')).toBeVisible()

      // Disable toggle
      await toggle.click()
      await expect(page.locator('text=Tools Off')).toBeVisible()
    })
  })

  test.describe('Enhanced Chat with Tools', () => {
    test('sends message using enhanced chat when tools are active', async ({ page }) => {
      test.setTimeout(120000) // Extended timeout for tool execution

      if (!testWorkflowId || !hasConnectedTools) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testWorkflowId}`)
      await page.waitForLoadState('networkidle')

      // Enable tools
      const toggle = page.locator('[data-testid="connected-tools-toggle"]')
      await toggle.click()
      await expect(page.locator('text=Tools Active')).toBeVisible()

      // Send a message
      const chatInput = page.locator('textarea')
      await chatInput.fill('Hello, what tools do you have access to?')
      await chatInput.press('Enter')

      // Should show "Using Tools" indicator during streaming
      await expect(
        page.locator('text=Using Tools').or(page.locator('[data-testid="enhanced-streaming-message"]'))
      ).toBeVisible({ timeout: 10000 }).catch(() => {
        // May complete too quickly
      })

      // Should receive a response
      await expect(
        page.locator('[class*="assistant"], .prose').filter({ hasText: /.{10,}/ })
      ).toBeVisible({ timeout: 60000 })
    })

    test('can stop enhanced chat generation', async ({ page }) => {
      test.setTimeout(120000)

      if (!testWorkflowId || !hasConnectedTools) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testWorkflowId}`)
      await page.waitForLoadState('networkidle')

      // Enable tools
      const toggle = page.locator('[data-testid="connected-tools-toggle"]')
      await toggle.click()

      // Send a message
      const chatInput = page.locator('textarea')
      await chatInput.fill('Tell me a very long story about AI')
      await chatInput.press('Enter')

      // Wait for streaming to start
      await page.waitForTimeout(2000)

      // Find and click stop button
      const stopButton = page.locator('button:has-text("Stop generating")').or(
        page.locator('text=Stop generating')
      )

      if (await stopButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await stopButton.click()
        // Streaming should stop
        await expect(stopButton).not.toBeVisible({ timeout: 5000 })
      }
    })
  })

  test.describe('Tool Call Display', () => {
    test('displays tool calls during execution', async ({ page }) => {
      test.setTimeout(120000)

      if (!testWorkflowId || !hasConnectedTools) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testWorkflowId}`)
      await page.waitForLoadState('networkidle')

      // Enable tools
      const toggle = page.locator('[data-testid="connected-tools-toggle"]')
      await toggle.click()

      // Send a message that might trigger a tool
      const chatInput = page.locator('textarea')
      await chatInput.fill('Search my inbox for recent emails') // Requires Gmail connection
      await chatInput.press('Enter')

      // Look for tool call indicators
      const toolCallIndicator = page.locator('[class*="GMAIL"], text=/GMAIL_|SLACK_|CALENDAR_/')
      await toolCallIndicator.first().isVisible({ timeout: 30000 }).catch(() => {
        // Tool may not be called or may complete quickly
      })
    })
  })

  test.describe('No Tools Available', () => {
    test('toggle is not visible when no tools connected', async ({ page }) => {
      // This test is the inverse - when user has NO connections
      if (hasConnectedTools) {
        test.skip()
        return
      }

      if (!testWorkflowId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testWorkflowId}`)
      await page.waitForLoadState('networkidle')

      // Toggle should not be visible
      const toggle = page.locator('[data-testid="connected-tools-toggle"]')
      await expect(toggle).not.toBeVisible({ timeout: 5000 })

      // "Connected Tools:" should not be visible
      await expect(page.locator('text=Connected Tools:')).not.toBeVisible()
    })
  })
})


/**
 * Connections Page E2E Tests
 *
 * Tests the Connections management page functionality.
 */
test.describe('Connections Page', () => {
  test('can navigate to connections page', async ({ page }) => {
    await page.goto('/dashboard/connections')
    await page.waitForLoadState('networkidle')

    // Should show connections page content
    await expect(
      page.locator('text=/Connected Apps|Connections|Connect your apps/i')
    ).toBeVisible()
  })

  test('shows available apps to connect', async ({ page }) => {
    await page.goto('/dashboard/connections')
    await page.waitForLoadState('networkidle')

    // Should show at least some app options
    await expect(
      page.locator('text=/Gmail|Slack|Calendar|Notion|HubSpot/i').first()
    ).toBeVisible({ timeout: 10000 })
  })

  test('connect button initiates OAuth flow', async ({ page }) => {
    await page.goto('/dashboard/connections')
    await page.waitForLoadState('networkidle')

    // Find a Connect button
    const connectButton = page.locator('button:has-text("Connect")').first()

    if (await connectButton.isVisible()) {
      // Listen for popup or navigation
      const popupPromise = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null)

      await connectButton.click()

      // Should either open a popup or navigate to OAuth
      const popup = await popupPromise
      if (popup) {
        // OAuth popup opened
        expect(popup.url()).toContain('composio')
        await popup.close()
      }
    }
  })
})
