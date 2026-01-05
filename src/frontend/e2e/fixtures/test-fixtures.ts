import { test as base, expect, Page } from '@playwright/test'
import { generateAgentName, testAgentData } from '../helpers/test-data'

/**
 * Extended test fixtures for Teach Charlie AI E2E tests.
 */

interface TestAgent {
  id: string
  name: string
}

interface TestFixtures {
  /** Dashboard page with authenticated user */
  dashboardPage: Page

  /** Create agent page */
  createAgentPage: Page

  /** Helper to create an agent via UI and return its info */
  createTestAgent: (name?: string) => Promise<TestAgent>

  /** Helper to delete an agent via UI */
  deleteTestAgent: (agentId: string) => Promise<void>
}

export const test = base.extend<TestFixtures>({
  /**
   * Navigate to dashboard before test.
   */
  dashboardPage: async ({ page }, use) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    await use(page)
  },

  /**
   * Navigate to create agent page before test.
   */
  createAgentPage: async ({ page }, use) => {
    await page.goto('/create')
    await page.waitForLoadState('networkidle')
    await use(page)
  },

  /**
   * Helper fixture to create an agent through the UI.
   * Returns the agent ID extracted from the redirect URL.
   */
  createTestAgent: async ({ page }, use) => {
    const createAgent = async (customName?: string): Promise<TestAgent> => {
      const agentName = customName || generateAgentName()

      // Navigate to create page
      await page.goto('/create')
      await page.waitForLoadState('networkidle')

      // Step 1: Who is Charlie?
      await page.fill('textarea', testAgentData.who.valid)
      await page.click('button:has-text("Continue")')

      // Step 2: Rules
      await page.waitForSelector('textarea')
      await page.fill('textarea', testAgentData.rules.valid)
      await page.click('button:has-text("Continue")')

      // Step 3: Tricks
      await page.waitForSelector('textarea')
      await page.fill('textarea', testAgentData.tricks.valid)
      await page.click('button:has-text("Create Charlie")')

      // Wait for redirect to playground
      await page.waitForURL('**/playground/**', { timeout: 30000 })

      // Extract agent ID from URL
      const url = page.url()
      const agentId = url.split('/playground/')[1]

      if (!agentId) {
        throw new Error('Failed to extract agent ID from URL')
      }

      return { id: agentId, name: agentName }
    }

    await use(createAgent)
  },

  /**
   * Helper fixture to delete an agent through the UI.
   */
  deleteTestAgent: async ({ page }, use) => {
    const deleteAgent = async (agentId: string): Promise<void> => {
      // Navigate to dashboard
      await page.goto('/dashboard')
      await page.waitForLoadState('networkidle')

      // Find the agent card and click delete
      // This assumes the delete button is implemented in the card
      const agentCard = page.locator(`[data-agent-id="${agentId}"]`).or(
        page.locator('.agent-card').filter({ has: page.locator(`a[href="/playground/${agentId}"]`) })
      )

      // Click the menu/delete button
      await agentCard.locator('button[aria-label="Delete agent"]').or(
        agentCard.locator('button:has-text("Delete")')
      ).click()

      // Confirm deletion in modal
      await page.click('button:has-text("Delete"):visible')

      // Wait for agent to be removed
      await expect(agentCard).not.toBeVisible({ timeout: 5000 })
    }

    await use(deleteAgent)
  },
})

export { expect }
