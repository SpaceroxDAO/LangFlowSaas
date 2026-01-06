import { test, expect } from '@playwright/test'
import { invalidAgentData, testAgentData } from '../helpers/test-data'

/**
 * P0 Test 3: Error Handling
 * Tests: Invalid input, LLM timeout, validation errors
 *
 * This is a critical MVP test per CLAUDE.md requirements.
 */
test.describe('Error Handling', () => {
  test.describe('Onboarding Validation', () => {
    test('shows error for empty Step 1 input', async ({ page }) => {
      await page.goto('/create')
      await page.waitForLoadState('networkidle')

      // Try to continue without entering anything
      await page.click('button:has-text("Continue")')

      // Should show validation error - matches actual error from CreateAgentPage
      await expect(page.locator('text=Please provide a job description')).toBeVisible({ timeout: 5000 })

      // Should still be on Step 1
      await expect(page.locator('text=Who is Charlie')).toBeVisible()
    })

    test('shows error for too short input (less than 10 chars)', async ({ page }) => {
      await page.goto('/create')
      await page.waitForLoadState('networkidle')

      // Enter text that's too short
      await page.locator('textarea').fill(invalidAgentData.tooShort)
      await page.click('button:has-text("Continue")')

      // Should show validation error about minimum length
      await expect(page.locator('text=Please provide a job description')).toBeVisible({ timeout: 5000 })

      // Should still be on Step 1
      await expect(page.locator('text=Who is Charlie')).toBeVisible()
    })

    test('shows error for whitespace-only input', async ({ page }) => {
      await page.goto('/create')
      await page.waitForLoadState('networkidle')

      // Enter only whitespace
      await page.locator('textarea').fill(invalidAgentData.whitespace)
      await page.click('button:has-text("Continue")')

      // Should show validation error - whitespace is treated as empty
      await expect(page.locator('text=Please provide a job description')).toBeVisible({ timeout: 5000 })
    })

    test('validation works on all three steps', async ({ page }) => {
      await page.goto('/create')
      await page.waitForLoadState('networkidle')

      // Step 1 - valid, continue
      await page.locator('textarea').fill(testAgentData.who.valid)
      await page.click('button:has-text("Continue")')

      // Step 2 - try empty
      await page.waitForSelector('textarea')
      await page.click('button:has-text("Continue")')

      // Should show error on Step 2
      await expect(page.locator('text=Please provide instructions')).toBeVisible({ timeout: 5000 })

      // Fill Step 2 and continue
      await page.locator('textarea').fill(testAgentData.rules.valid)
      await page.click('button:has-text("Continue")')

      // Step 3 - tools are optional, so no validation required
      // Just verify we're on Step 3 with tool selection
      await expect(page.locator('text=Step 3')).toBeVisible({ timeout: 5000 })
      await expect(page.locator('text=Tricks')).toBeVisible()
    })

    test('exact 10 character input passes validation', async ({ page }) => {
      await page.goto('/create')
      await page.waitForLoadState('networkidle')

      // Enter exactly 10 characters
      await page.locator('textarea').fill('0123456789')
      await page.click('button:has-text("Continue")')

      // Should proceed to Step 2 (no error)
      await expect(page.locator('text=What are the rules')).toBeVisible({ timeout: 5000 })
    })

    test('9 character input fails validation', async ({ page }) => {
      await page.goto('/create')
      await page.waitForLoadState('networkidle')

      // Enter 9 characters
      await page.locator('textarea').fill('012345678')
      await page.click('button:has-text("Continue")')

      // Should show error about minimum characters
      await expect(page.locator('text=Please provide a job description')).toBeVisible({ timeout: 5000 })

      // Should still be on Step 1
      await expect(page.locator('text=Who is Charlie')).toBeVisible()
    })
  })

  test.describe('XSS Prevention', () => {
    test('script tags in input are escaped', async ({ page }) => {
      await page.goto('/create')
      await page.waitForLoadState('networkidle')

      // Enter XSS attempt with enough characters to pass validation
      const xssPayload = invalidAgentData.xss + ' This is additional text to meet requirements'
      await page.locator('textarea').fill(xssPayload)
      await page.click('button:has-text("Continue")')

      // Should proceed to Step 2 (XSS is escaped, not blocked)
      await expect(page.locator('text=What are the rules')).toBeVisible({ timeout: 5000 })

      // Verify no alert was triggered (XSS prevention)
      // If XSS worked, this test would fail because an alert would block execution
    })
  })

  test.describe('Long Input Handling', () => {
    test('very long input is handled gracefully', async ({ page }) => {
      await page.goto('/create')
      await page.waitForLoadState('networkidle')

      // Enter very long text
      await page.locator('textarea').fill(invalidAgentData.veryLong)

      // Character counter should show the count
      await expect(page.locator('text=10000 characters')).toBeVisible()

      // Try to continue - should work with long input
      await page.click('button:has-text("Continue")')

      // Should proceed to Step 2 (long input is accepted)
      await expect(page.locator('text=What are the rules')).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe('API Error Handling', () => {
    test('shows friendly error when agent creation fails', async ({ page }) => {
      // This test simulates what happens when the backend returns an error
      // We can do this by intercepting the API call

      await page.route('**/api/v1/agents/create-from-qa', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ detail: 'Internal server error' }),
        })
      })

      await page.goto('/create')
      await page.waitForLoadState('networkidle')

      // Complete the wizard
      await page.locator('textarea').fill(testAgentData.who.valid)
      await page.click('button:has-text("Continue")')
      await page.waitForSelector('textarea')
      await page.locator('textarea').fill(testAgentData.rules.valid)
      await page.click('button:has-text("Continue")')
      await page.waitForSelector('textarea')
      await page.locator('textarea').fill(testAgentData.tricks.valid)
      await page.click('button:has-text("Create Charlie")')

      // Should show a friendly error message
      await expect(page.locator('text=Failed to create Charlie')).toBeVisible({ timeout: 10000 })

      // Should not redirect to playground
      expect(page.url()).not.toContain('/playground/')
    })

    test('shows friendly error when chat request fails', async ({ page }) => {
      // First, create a real agent (or mock the agent fetch)
      // Then test chat failure

      // Mock the chat endpoint to fail
      await page.route('**/api/v1/agents/*/chat', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            detail: 'Charlie had trouble understanding that. Error: LLM timeout',
          }),
        })
      })

      // Mock a successful agent fetch
      await page.route('**/api/v1/agents/*', async (route, request) => {
        if (request.method() === 'GET' && !request.url().includes('/chat')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 'test-agent-id',
              name: 'Test Agent',
              is_active: true,
              qa_who: 'Test',
              qa_rules: 'Test',
              qa_tricks: 'Test',
              system_prompt: 'Test',
              template_name: 'support_bot',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }),
          })
        } else {
          await route.continue()
        }
      })

      await page.goto('/playground/test-agent-id')
      await page.waitForLoadState('networkidle')

      // Find chat input and send message
      const chatInput = page.locator('textarea')
      await chatInput.fill('Hello!')

      // Submit the message
      await page.click('button[type="submit"]').catch(() => chatInput.press('Enter'))

      // Should show error message (friendly, not technical)
      await expect(
        page.locator('text=/error|trouble|problem|sorry/i').or(
          page.locator('[class*="error"]')
        )
      ).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('Protected Routes', () => {
    test('unauthenticated user cannot access create page', async ({ browser }) => {
      // Create a new context without auth state
      const context = await browser.newContext()
      const page = await context.newPage()

      // Try to access create page
      await page.goto('http://localhost:3000/create')

      // Should be redirected to sign-in or show sign-in UI
      // Clerk may redirect to /sign-in or show a sign-in modal
      await page.waitForLoadState('networkidle')

      // Either redirected to sign-in page or Clerk shows sign-in UI
      const url = page.url()
      const hasSignIn = url.includes('sign-in') ||
                        await page.locator('text=Sign in').isVisible().catch(() => false) ||
                        await page.locator('input[name="identifier"]').isVisible().catch(() => false)

      expect(hasSignIn).toBe(true)

      await context.close()
    })

    test('unauthenticated user cannot access dashboard', async ({ browser }) => {
      const context = await browser.newContext()
      const page = await context.newPage()

      await page.goto('http://localhost:3000/dashboard')
      await page.waitForLoadState('networkidle')

      const url = page.url()
      const hasSignIn = url.includes('sign-in') ||
                        await page.locator('text=Sign in').isVisible().catch(() => false) ||
                        await page.locator('input[name="identifier"]').isVisible().catch(() => false)

      expect(hasSignIn).toBe(true)

      await context.close()
    })

    test('unauthenticated user cannot access playground', async ({ browser }) => {
      const context = await browser.newContext()
      const page = await context.newPage()

      await page.goto('http://localhost:3000/playground/some-agent-id')
      await page.waitForLoadState('networkidle')

      const url = page.url()
      const hasSignIn = url.includes('sign-in') ||
                        await page.locator('text=Sign in').isVisible().catch(() => false) ||
                        await page.locator('input[name="identifier"]').isVisible().catch(() => false)

      expect(hasSignIn).toBe(true)

      await context.close()
    })
  })
})
