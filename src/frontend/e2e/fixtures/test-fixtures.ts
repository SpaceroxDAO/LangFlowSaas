import { test as base, expect, Page } from '@playwright/test'
import { generateAgentName, testAgentData, toolAgentData } from '../helpers/test-data'
import { selectors, TOOL_IDS, type ToolId } from '../helpers/selectors'

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

  /** Helper to create an agent with specific tools selected */
  createAgentWithTools: (tools: ToolId[], config?: Partial<typeof toolAgentData.calculator>) => Promise<TestAgent>

  /** Helper to delete an agent via UI */
  deleteTestAgent: (agentId: string) => Promise<void>

  /** Helper to send a chat message and wait for response */
  sendChatMessage: (page: Page, message: string) => Promise<string>

  /** Helper to clear localStorage tour state for fresh tour testing */
  clearTourState: (page: Page) => Promise<void>

  /** Helper to set canvas disclosure level */
  setCanvasLevel: (page: Page, level: 1 | 2 | 3 | 4) => Promise<void>
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
   * Automatically disables tour and waits for form to be ready.
   */
  createAgentPage: async ({ page }, use) => {
    // Set tour state BEFORE navigation so tour doesn't trigger
    await page.addInitScript(() => {
      localStorage.setItem('teachcharlie_tour_state', JSON.stringify({
        hasSeenCreateTour: true,
        hasSeenCanvasTour: true,
        hasSeenPlaygroundTour: true,
        currentDisclosureLevel: 1,
        completedTours: ['create-agent', 'canvas', 'playground']
      }))
    })

    await page.goto('/create')
    await page.waitForLoadState('networkidle')

    // Additional safety: dismiss any overlay that might still appear
    await dismissTourOverlay(page)

    // Wait for the form to be ready
    await page.waitForSelector(selectors.create.nameInput, { state: 'visible', timeout: 30000 })
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

      // Dismiss any tour overlay
      await dismissTourOverlay(page)

      // Step 1: Identity - Name + Job Description
      await page.locator(selectors.create.nameInput).fill(agentName)
      await page.locator(selectors.create.jobTextarea).fill(testAgentData.who.valid)

      await dismissTourOverlay(page)
      await page.click(selectors.create.nextButton)

      // Step 2: Coaching - Rules/Instructions
      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill(testAgentData.rules.valid)
      await page.click(selectors.create.nextButton)

      // Step 3: Tricks - Tool selection (no tools selected for basic agent)
      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)
      await page.click(selectors.create.submitButton)

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
   * Helper fixture to create an agent with specific tools selected.
   * Useful for testing tool execution (Phase 6).
   */
  createAgentWithTools: async ({ page }, use) => {
    const createAgent = async (
      tools: ToolId[],
      config?: Partial<typeof toolAgentData.calculator>
    ): Promise<TestAgent> => {
      const agentConfig = config || toolAgentData.calculator
      const agentName = config?.name || generateAgentName('Tool Agent')

      console.log('[FIXTURE] Starting createAgentWithTools...')
      console.log(`[FIXTURE] Agent name: ${agentName}`)

      // Navigate to create page
      console.log('[FIXTURE] Navigating to /create...')
      await page.goto('/create')
      console.log('[FIXTURE] Navigation complete, waiting for networkidle...')

      await page.waitForLoadState('networkidle')
      console.log('[FIXTURE] networkidle complete')

      // Take diagnostic screenshot
      await page.screenshot({ path: 'test-results/fixture-after-networkidle.png' }).catch(() => {})

      // Check page state
      const rootChildren = await page.evaluate(() => {
        const root = document.getElementById('root')
        return root ? root.children.length : -1
      })
      console.log(`[FIXTURE] React root children count: ${rootChildren}`)

      // Check if the element exists
      const inputCount = await page.locator(selectors.create.nameInput).count()
      console.log(`[FIXTURE] Name input count BEFORE waitForSelector: ${inputCount}`)

      // Wait for React hydration - ensure input is actually visible and interactive
      console.log('[FIXTURE] Waiting for name input to be visible...')
      await page.waitForSelector(selectors.create.nameInput, { state: 'visible', timeout: 30000 })
      console.log('[FIXTURE] Name input is visible!')

      // Aggressively dismiss any tour/overlay that might appear
      console.log('[FIXTURE] Dismissing tour overlay...')
      await dismissTourOverlay(page)
      console.log('[FIXTURE] Tour overlay dismissed')

      // Check element again after dismissTourOverlay
      const inputCountAfter = await page.locator(selectors.create.nameInput).count()
      console.log(`[FIXTURE] Name input count AFTER dismissTourOverlay: ${inputCountAfter}`)

      // Take another screenshot
      await page.screenshot({ path: 'test-results/fixture-before-fill.png' }).catch(() => {})

      // Step 1: Identity - Name + Job Description
      console.log('[FIXTURE] About to fill name input...')
      await page.locator(selectors.create.nameInput).fill(agentName)
      await page.locator(selectors.create.jobTextarea).fill(agentConfig.who || testAgentData.who.valid)

      // Dismiss tour again in case it appeared after focusing
      await dismissTourOverlay(page)

      await page.click(selectors.create.nextButton)

      // Step 2: Coaching - Rules/Instructions
      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill(agentConfig.rules || testAgentData.rules.valid)
      await page.click(selectors.create.nextButton)

      // Step 3: Tricks - Select tools
      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)

      // Click each tool card to select it
      for (const toolId of tools) {
        const toolName = getToolDisplayName(toolId)
        const toolCard = page.locator(`${selectors.create.toolsGrid} button`).filter({ hasText: toolName })
        await toolCard.click()
        // Small delay to ensure state updates
        await page.waitForTimeout(100)
      }

      // Submit
      await page.click(selectors.create.submitButton)

      // Wait for redirect to playground (increased timeout for tool setup)
      await page.waitForURL('**/playground/**', { timeout: 60000 })

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

  /**
   * Helper to send a chat message and wait for the response.
   * Returns the assistant's response text.
   */
  sendChatMessage: async ({}, use) => {
    const sendMessage = async (page: Page, message: string): Promise<string> => {
      // Find and fill the chat input
      const chatInput = page.locator(selectors.playground.chatInput)
      await chatInput.fill(message)

      // Click send button
      await page.click(selectors.playground.sendButton)

      // Wait for loading to complete (thinking indicator to appear and disappear)
      await page.waitForSelector(selectors.playground.loadingIndicator, { state: 'visible', timeout: 5000 }).catch(() => {})
      await page.waitForSelector(selectors.playground.loadingIndicator, { state: 'hidden', timeout: 90000 })

      // Get the last assistant message (uses rounded-2xl, not rounded-xl)
      const assistantMessages = page.locator('.bg-white.rounded-2xl, .bg-white.border.rounded-2xl')

      // Wait for at least one assistant message
      await expect(assistantMessages.last()).toBeVisible({ timeout: 30000 })

      // Get the text content of the last assistant message
      const responseText = await assistantMessages.last().textContent() || ''
      return responseText.trim()
    }

    await use(sendMessage)
  },

  /**
   * Helper to clear tour state from localStorage for fresh tour testing.
   */
  clearTourState: async ({}, use) => {
    const clearState = async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        localStorage.removeItem('teachcharlie_tour_state')
      })
    }

    await use(clearState)
  },

  /**
   * Helper to set canvas disclosure level.
   */
  setCanvasLevel: async ({}, use) => {
    const setLevel = async (page: Page, level: 1 | 2 | 3 | 4): Promise<void> => {
      const levelButton = page.locator(selectors.canvas.levelButton(level))
      await levelButton.click()
      // Wait for UI to update
      await page.waitForTimeout(300)
    }

    await use(setLevel)
  },
})

/**
 * Helper to dismiss any tour/overlay that might be blocking interactions.
 * Uses targeted selectors to avoid accidentally removing form elements.
 */
async function dismissTourOverlay(page: Page): Promise<void> {
  // First, set localStorage to prevent tour from appearing in the first place
  await page.evaluate(() => {
    localStorage.setItem('teachcharlie_tour_state', JSON.stringify({
      hasSeenCreateTour: true,
      hasSeenCanvasTour: true,
      hasSeenPlaygroundTour: true,
      currentDisclosureLevel: 1,
      completedTours: ['create-agent', 'canvas', 'playground']
    }))
  })

  // Try to dismiss any existing tour
  try {
    // Method 1: Click close button if visible
    const closeButton = page.locator('.driver-popover-close-btn, button:has-text("Skip Tour")')
    if (await closeButton.first().isVisible({ timeout: 500 }).catch(() => false)) {
      await closeButton.first().click({ force: true })
      await page.waitForTimeout(200)
    }

    // Method 2: Press Escape key to close any modal/overlay
    await page.keyboard.press('Escape')
    await page.waitForTimeout(100)

    // Method 3: Remove driver.js overlay and classes via JavaScript
    await page.evaluate(() => {
      // Remove driver.js elements
      const driverElements = document.querySelectorAll(
        '.driver-overlay, .driver-popover, .driver-active-element, ' +
        'svg.driver-overlay, svg.driver-overlay-animated'
      )
      driverElements.forEach(el => el.remove())

      // Remove driver classes from body that block interactions
      document.body.classList.remove('driver-active', 'driver-fade')
    })
    await page.waitForTimeout(50)
  } catch {
    // Ignore errors - tour might not be present
  }
}

/**
 * Helper function to get the display name for a tool ID.
 */
function getToolDisplayName(toolId: ToolId): string {
  const names: Record<ToolId, string> = {
    [TOOL_IDS.calculator]: 'Calculator',
    [TOOL_IDS.webSearch]: 'Web Search',
    [TOOL_IDS.urlReader]: 'URL Reader',
    [TOOL_IDS.googleMaps]: 'Google Maps',
  }
  return names[toolId] || toolId
}

/**
 * Helper to check if response contains any of the expected strings.
 */
export function responseContains(response: string, expected: string[]): boolean {
  const lowerResponse = response.toLowerCase()
  return expected.some(exp => lowerResponse.includes(exp.toLowerCase()))
}

/**
 * Helper to wait for chat response with expected content.
 */
export async function waitForResponseContaining(
  page: Page,
  expected: string[],
  timeout = 90000
): Promise<string> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    // Get all assistant messages
    const assistantMessages = await page.locator('.bg-white.rounded-xl, .bg-gray-50.rounded-xl').allTextContents()

    for (const msg of assistantMessages) {
      if (responseContains(msg, expected)) {
        return msg
      }
    }

    await page.waitForTimeout(500)
  }

  throw new Error(`Timeout waiting for response containing: ${expected.join(' or ')}`)
}

export { expect, dismissTourOverlay }
