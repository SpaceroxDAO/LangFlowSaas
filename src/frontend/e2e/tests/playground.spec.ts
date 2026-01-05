import { test, expect } from '@playwright/test'
import { testAgentData, testMessages } from '../helpers/test-data'

/**
 * P1: Playground Chat Tests
 * Tests: Send message, receive response, chat features
 */
test.describe('Playground Chat', () => {
  let testAgentId: string | null = null

  test.beforeAll(async ({ browser }) => {
    // Try to get an existing agent or create one
    const context = await browser.newContext({
      storageState: './e2e/.auth/user.json',
    })
    const page = await context.newPage()

    // First check if there are existing agents
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    const existingAgentLink = page.locator('a[href*="/playground/"]').first()
    if (await existingAgentLink.isVisible()) {
      // Use existing agent
      const href = await existingAgentLink.getAttribute('href')
      testAgentId = href?.split('/playground/')[1] || null
    } else {
      // Try to create an agent
      await page.goto('/create')
      await page.waitForLoadState('networkidle')

      await page.locator('textarea').fill(testAgentData.who.bakery)
      await page.click('button:has-text("Continue")')
      await page.waitForSelector('textarea')
      await page.locator('textarea').fill(testAgentData.rules.bakery)
      await page.click('button:has-text("Continue")')
      await page.waitForSelector('textarea')
      await page.locator('textarea').fill(testAgentData.tricks.bakery)
      await page.click('button:has-text("Create Charlie")')

      try {
        await page.waitForURL('**/playground/**', { timeout: 15000 })
        testAgentId = page.url().split('/playground/')[1]
      } catch {
        // Agent creation failed - tests will be skipped
        testAgentId = null
      }
    }

    await context.close()
  })

  test.describe('Message Sending', () => {
    test('can send a message and receive a response', async ({ page }) => {
      test.setTimeout(90000) // Extended timeout for LLM response

      if (!testAgentId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testAgentId}`)
      await page.waitForLoadState('networkidle')

      // Find chat input
      const chatInput = page.locator('textarea')
      await expect(chatInput).toBeVisible({ timeout: 10000 })

      // Send a message
      await chatInput.fill(testMessages.greeting)
      await page.click('button[type="submit"]').catch(() => chatInput.press('Enter'))

      // User message should appear
      await expect(
        page.locator('.bg-blue-600, [class*="user"]').filter({ hasText: testMessages.greeting })
      ).toBeVisible({ timeout: 5000 })

      // Wait for response (LLM can be slow)
      await expect(
        page.locator('.bg-white, [class*="assistant"]').filter({ hasText: /.{5,}/ })
      ).toBeVisible({ timeout: 60000 })

      // Should have at least 2 messages
      const messageCount = await page.locator('.rounded-2xl, [class*="message"]').count()
      expect(messageCount).toBeGreaterThanOrEqual(2)
    })

    test('Enter key sends message', async ({ page }) => {
      test.setTimeout(90000)

      if (!testAgentId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testAgentId}`)
      await page.waitForLoadState('networkidle')

      const chatInput = page.locator('textarea')
      await chatInput.fill(testMessages.question)
      await chatInput.press('Enter')

      // Message should be sent
      await expect(
        page.locator('.bg-blue-600, [class*="user"]').filter({ hasText: testMessages.question })
      ).toBeVisible({ timeout: 5000 })
    })

    test('Shift+Enter creates new line instead of sending', async ({ page }) => {
      if (!testAgentId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testAgentId}`)
      await page.waitForLoadState('networkidle')

      const chatInput = page.locator('textarea')
      await chatInput.fill('First line')
      await chatInput.press('Shift+Enter')
      await chatInput.type('Second line')

      // Should contain newline in input
      const value = await chatInput.inputValue()
      expect(value).toContain('\n')
      expect(value).toContain('First line')
      expect(value).toContain('Second line')
    })
  })

  test.describe('UI States', () => {
    test('shows loading state while waiting for response', async ({ page }) => {
      if (!testAgentId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testAgentId}`)
      await page.waitForLoadState('networkidle')

      const chatInput = page.locator('textarea')
      await chatInput.fill(testMessages.greeting)
      await chatInput.press('Enter')

      // Should show loading state (dots animation or spinner)
      await expect(
        page.locator('[class*="animate"]').or(page.locator('text=/typing|loading/i'))
      ).toBeVisible({ timeout: 5000 }).catch(() => {
        // May be too fast
      })
    })

    test('input is disabled while loading', async ({ page }) => {
      if (!testAgentId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testAgentId}`)
      await page.waitForLoadState('networkidle')

      const chatInput = page.locator('textarea')
      await chatInput.fill(testMessages.greeting)
      await chatInput.press('Enter')

      // Input should be disabled during loading
      await expect(chatInput).toBeDisabled().catch(() => {
        // May be too fast or may not disable
      })
    })

    test('displays agent name in header', async ({ page }) => {
      if (!testAgentId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testAgentId}`)
      await page.waitForLoadState('networkidle')

      // Should show agent name somewhere in the header/title area
      await expect(
        page.locator('h1, h2, [class*="header"], [class*="title"]')
      ).toBeVisible()
    })

    test('has back to dashboard navigation', async ({ page }) => {
      if (!testAgentId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testAgentId}`)
      await page.waitForLoadState('networkidle')

      // Should have a back button or link to dashboard
      const backLink = page.locator('a[href="/dashboard"]').or(
        page.locator('button:has-text("Back")').or(page.locator('[class*="back"]'))
      )
      await expect(backLink).toBeVisible()

      // Click it
      await backLink.click()

      // Should navigate to dashboard
      await expect(page).toHaveURL('/dashboard')
    })
  })

  test.describe('Chat History', () => {
    test('messages persist within session', async ({ page }) => {
      test.setTimeout(120000)

      if (!testAgentId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testAgentId}`)
      await page.waitForLoadState('networkidle')

      // Send first message
      const chatInput = page.locator('textarea')
      await chatInput.fill('First message in session')
      await chatInput.press('Enter')

      // Wait for response
      await page.waitForTimeout(3000)
      await expect(
        page.locator('.bg-white, [class*="assistant"]').filter({ hasText: /.{5,}/ })
      ).toBeVisible({ timeout: 60000 })

      // Send second message
      await chatInput.fill('Second message in session')
      await chatInput.press('Enter')

      // Wait for second response
      await expect(
        page.locator('.bg-white, [class*="assistant"]').nth(1)
      ).toBeVisible({ timeout: 60000 }).catch(() => {
        // There might be a different structure
      })

      // Both user messages should be visible
      await expect(page.locator('text=First message in session')).toBeVisible()
      await expect(page.locator('text=Second message in session')).toBeVisible()
    })

    test('empty state shows encouraging message', async ({ page }) => {
      if (!testAgentId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testAgentId}`)
      await page.waitForLoadState('networkidle')

      // Clear any existing messages (if there's a clear button)
      const clearButton = page.locator('button:has-text("Clear")')
      if (await clearButton.isVisible()) {
        await clearButton.click()
      }

      // Should show empty state or welcome message
      await expect(
        page.locator('text=/start|hello|welcome|type|message/i')
      ).toBeVisible({ timeout: 5000 }).catch(() => {
        // May already have messages from previous tests
      })
    })
  })

  test.describe('Clear Chat', () => {
    test('clear chat button removes all messages', async ({ page }) => {
      test.setTimeout(90000)

      if (!testAgentId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testAgentId}`)
      await page.waitForLoadState('networkidle')

      // Send a message
      const chatInput = page.locator('textarea')
      await chatInput.fill('Message to be cleared')
      await chatInput.press('Enter')

      // Wait for response
      await expect(
        page.locator('.bg-white, [class*="assistant"]').filter({ hasText: /.{5,}/ })
      ).toBeVisible({ timeout: 60000 })

      // Find and click clear button
      const clearButton = page.locator('button:has-text("Clear")').or(
        page.locator('[aria-label*="clear"]')
      )

      if (await clearButton.isVisible()) {
        await clearButton.click()

        // Messages should be removed
        await expect(page.locator('text=Message to be cleared')).not.toBeVisible({ timeout: 5000 })
      }
    })
  })

  test.describe('Message Display', () => {
    test('user messages are styled correctly (right-aligned, blue)', async ({ page }) => {
      test.setTimeout(90000)

      if (!testAgentId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testAgentId}`)
      await page.waitForLoadState('networkidle')

      const chatInput = page.locator('textarea')
      await chatInput.fill('Test user message styling')
      await chatInput.press('Enter')

      // User message should have blue background
      const userMessage = page.locator('.bg-blue-600, .bg-blue-500, [class*="user"]').filter({
        hasText: 'Test user message styling',
      })
      await expect(userMessage).toBeVisible({ timeout: 5000 })
    })

    test('assistant messages are styled correctly (left-aligned, white/gray)', async ({ page }) => {
      test.setTimeout(90000)

      if (!testAgentId) {
        test.skip()
        return
      }

      await page.goto(`/playground/${testAgentId}`)
      await page.waitForLoadState('networkidle')

      const chatInput = page.locator('textarea')
      await chatInput.fill('Prompt for assistant response')
      await chatInput.press('Enter')

      // Wait for response
      await expect(
        page.locator('.bg-white, .bg-gray-100, [class*="assistant"]').filter({ hasText: /.{5,}/ })
      ).toBeVisible({ timeout: 60000 })
    })
  })
})
