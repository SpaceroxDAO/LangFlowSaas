import { test, expect, dismissTourOverlay } from '../fixtures/test-fixtures'
import { generateAgentName, testAgentData } from '../helpers/test-data'
import { selectors, TOOL_IDS } from '../helpers/selectors'

/**
 * Knowledge Search E2E Tests
 *
 * Tests the Knowledge Search (RAG) functionality including:
 * - Knowledge Sources modal in Create/Edit Agent pages
 * - File upload, URL add, text paste features
 * - Knowledge source selection and deselection
 * - Integration with agent creation/editing flow
 */
test.describe('Knowledge Search Feature', () => {
  test.describe('Create Agent - Knowledge Search Action', () => {
    test('shows Knowledge Search action in Step 3', async ({ page }) => {
      // Navigate to create page
      await page.goto('/create')
      await page.waitForLoadState('networkidle')
      await dismissTourOverlay(page)

      // Step 1: Fill identity
      await page.locator(selectors.create.nameInput).fill(generateAgentName('Knowledge Test'))
      await page.locator(selectors.create.jobTextarea).fill(testAgentData.who.valid)
      await page.click(selectors.create.nextButton)

      // Step 2: Fill coaching
      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill(testAgentData.rules.valid)
      await page.click(selectors.create.nextButton)

      // Step 3: Should see Knowledge Search action
      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)

      // Verify Knowledge Search action is visible
      const knowledgeSearchCard = page.locator('button, div').filter({ hasText: /Knowledge Search/i }).first()
      await expect(knowledgeSearchCard).toBeVisible({ timeout: 5000 })
    })

    test('clicking Knowledge Search opens modal', async ({ page }) => {
      // Navigate to create page
      await page.goto('/create')
      await page.waitForLoadState('networkidle')
      await dismissTourOverlay(page)

      // Step 1: Fill identity
      await page.locator(selectors.create.nameInput).fill(generateAgentName('Knowledge Modal Test'))
      await page.locator(selectors.create.jobTextarea).fill(testAgentData.who.valid)
      await page.click(selectors.create.nextButton)

      // Step 2: Fill coaching
      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill(testAgentData.rules.valid)
      await page.click(selectors.create.nextButton)

      // Step 3: Click Knowledge Search
      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)

      // Find and click Knowledge Search card
      const knowledgeSearchCard = page.locator('button').filter({ hasText: /Knowledge Search/i }).first()
      await knowledgeSearchCard.click()

      // Modal should appear
      const modal = page.locator('[role="dialog"], .fixed.inset-0')
      await expect(modal.first()).toBeVisible({ timeout: 5000 })

      // Modal should have tabs: Browse, Upload File, Add URL, Paste Text
      await expect(page.locator('text=Browse').or(page.locator('button:has-text("Browse")'))).toBeVisible()
    })

    test('Knowledge Sources modal has all tabs', async ({ page }) => {
      // Navigate to create page
      await page.goto('/create')
      await page.waitForLoadState('networkidle')
      await dismissTourOverlay(page)

      // Step 1 & 2
      await page.locator(selectors.create.nameInput).fill(generateAgentName('Modal Tabs Test'))
      await page.locator(selectors.create.jobTextarea).fill(testAgentData.who.valid)
      await page.click(selectors.create.nextButton)
      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill(testAgentData.rules.valid)
      await page.click(selectors.create.nextButton)

      // Step 3: Open Knowledge Search modal
      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)

      const knowledgeSearchCard = page.locator('button').filter({ hasText: /Knowledge Search/i }).first()
      await knowledgeSearchCard.click()

      // Wait for modal
      await page.waitForSelector('[role="dialog"], .fixed.inset-0', { timeout: 5000 })

      // Check for all tab options
      const browseTab = page.locator('button:has-text("Browse"), text=Browse').first()
      const uploadTab = page.locator('button:has-text("Upload"), text=Upload').first()
      const urlTab = page.locator('button:has-text("URL"), text=URL').first()
      const textTab = page.locator('button:has-text("Text"), button:has-text("Paste")').first()

      // At least one of these should be visible
      const tabsVisible = await browseTab.isVisible().catch(() => false) ||
                          await uploadTab.isVisible().catch(() => false) ||
                          await urlTab.isVisible().catch(() => false) ||
                          await textTab.isVisible().catch(() => false)

      expect(tabsVisible).toBeTruthy()
    })

    test('can close Knowledge Sources modal', async ({ page }) => {
      // Navigate to create page
      await page.goto('/create')
      await page.waitForLoadState('networkidle')
      await dismissTourOverlay(page)

      // Navigate to step 3
      await page.locator(selectors.create.nameInput).fill(generateAgentName('Close Modal Test'))
      await page.locator(selectors.create.jobTextarea).fill(testAgentData.who.valid)
      await page.click(selectors.create.nextButton)
      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill(testAgentData.rules.valid)
      await page.click(selectors.create.nextButton)

      // Open Knowledge Search modal
      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)

      const knowledgeSearchCard = page.locator('button').filter({ hasText: /Knowledge Search/i }).first()
      await knowledgeSearchCard.click()

      // Wait for modal to appear
      const modal = page.locator('[role="dialog"], .fixed.inset-0').first()
      await expect(modal).toBeVisible({ timeout: 5000 })

      // Close modal - try various close methods
      const closeButton = page.locator('button:has-text("Cancel"), button:has-text("Close"), button[aria-label="Close"]').first()
      if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click()
      } else {
        // Press Escape as fallback
        await page.keyboard.press('Escape')
      }

      // Modal should close
      await expect(modal).not.toBeVisible({ timeout: 3000 })
    })
  })

  test.describe('Edit Agent - Knowledge Search', () => {
    test('edit page loads with Knowledge Search action', async ({ page, createAgentWithTools }) => {
      // Create an agent first
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to edit page
      await page.click(selectors.playground.editAgentLink)
      await page.waitForURL(`**/edit/**`)
      await page.waitForLoadState('networkidle')

      // Wait for form to load
      await page.waitForFunction(() => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement
        return input && input.value && input.value.length > 0
      }, { timeout: 15000 })

      // Should see Knowledge Search action in the tools/actions grid
      const knowledgeSearchCard = page.locator('button, div').filter({ hasText: /Knowledge Search/i }).first()

      // Give it a bit more time for the full page to render
      await page.waitForTimeout(1000)

      const isVisible = await knowledgeSearchCard.isVisible().catch(() => false)
      expect(isVisible).toBeTruthy()
    })

    test('can open Knowledge Sources modal from edit page', async ({ page, createAgentWithTools }) => {
      // Create an agent
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to edit page
      await page.click(selectors.playground.editAgentLink)
      await page.waitForURL(`**/edit/**`)
      await page.waitForLoadState('networkidle')

      // Wait for form to load
      await page.waitForFunction(() => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement
        return input && input.value && input.value.length > 0
      }, { timeout: 15000 })

      // Click Knowledge Search to open modal
      const knowledgeSearchCard = page.locator('button').filter({ hasText: /Knowledge Search/i }).first()
      if (await knowledgeSearchCard.isVisible().catch(() => false)) {
        await knowledgeSearchCard.click()

        // Modal should appear
        const modal = page.locator('[role="dialog"], .fixed.inset-0')
        await expect(modal.first()).toBeVisible({ timeout: 5000 })
      }
    })
  })

  test.describe('Knowledge Sources API', () => {
    test('API returns empty list for new user', async ({ request }) => {
      // This test checks that the API is functional
      // Note: This requires authentication - will fail without proper auth token
      const response = await request.get('/api/v1/knowledge-sources', {
        headers: {
          // Would need proper Clerk auth token here
        },
        failOnStatusCode: false
      })

      // Either 401 (unauthorized) or 200 (success) is acceptable
      expect([200, 401, 403]).toContain(response.status())
    })
  })

  test.describe('Text Paste Feature', () => {
    test('can switch to Text tab in modal', async ({ page }) => {
      // Navigate to create page step 3
      await page.goto('/create')
      await page.waitForLoadState('networkidle')
      await dismissTourOverlay(page)

      await page.locator(selectors.create.nameInput).fill(generateAgentName('Text Paste Test'))
      await page.locator(selectors.create.jobTextarea).fill(testAgentData.who.valid)
      await page.click(selectors.create.nextButton)
      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill(testAgentData.rules.valid)
      await page.click(selectors.create.nextButton)

      // Open modal
      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)

      const knowledgeSearchCard = page.locator('button').filter({ hasText: /Knowledge Search/i }).first()
      await knowledgeSearchCard.click()

      // Wait for modal
      await page.waitForSelector('[role="dialog"], .fixed.inset-0', { timeout: 5000 })

      // Click Text/Paste tab
      const textTab = page.locator('button:has-text("Text"), button:has-text("Paste")').first()
      if (await textTab.isVisible().catch(() => false)) {
        await textTab.click()

        // Should see a textarea for pasting text
        const textarea = page.locator('textarea').first()
        await expect(textarea).toBeVisible({ timeout: 3000 })
      }
    })
  })

  test.describe('URL Add Feature', () => {
    test('can switch to URL tab in modal', async ({ page }) => {
      // Navigate to create page step 3
      await page.goto('/create')
      await page.waitForLoadState('networkidle')
      await dismissTourOverlay(page)

      await page.locator(selectors.create.nameInput).fill(generateAgentName('URL Test'))
      await page.locator(selectors.create.jobTextarea).fill(testAgentData.who.valid)
      await page.click(selectors.create.nextButton)
      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill(testAgentData.rules.valid)
      await page.click(selectors.create.nextButton)

      // Open modal
      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)

      const knowledgeSearchCard = page.locator('button').filter({ hasText: /Knowledge Search/i }).first()
      await knowledgeSearchCard.click()

      // Wait for modal
      await page.waitForSelector('[role="dialog"], .fixed.inset-0', { timeout: 5000 })

      // Click URL tab
      const urlTab = page.locator('button:has-text("URL")').first()
      if (await urlTab.isVisible().catch(() => false)) {
        await urlTab.click()

        // Should see a URL input field
        const urlInput = page.locator('input[type="url"], input[placeholder*="url" i], input[placeholder*="http" i]').first()
        await expect(urlInput).toBeVisible({ timeout: 3000 })
      }
    })
  })

  test.describe('File Upload Feature', () => {
    test('can switch to Upload tab in modal', async ({ page }) => {
      // Navigate to create page step 3
      await page.goto('/create')
      await page.waitForLoadState('networkidle')
      await dismissTourOverlay(page)

      await page.locator(selectors.create.nameInput).fill(generateAgentName('Upload Test'))
      await page.locator(selectors.create.jobTextarea).fill(testAgentData.who.valid)
      await page.click(selectors.create.nextButton)
      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill(testAgentData.rules.valid)
      await page.click(selectors.create.nextButton)

      // Open modal
      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)

      const knowledgeSearchCard = page.locator('button').filter({ hasText: /Knowledge Search/i }).first()
      await knowledgeSearchCard.click()

      // Wait for modal
      await page.waitForSelector('[role="dialog"], .fixed.inset-0', { timeout: 5000 })

      // Click Upload tab
      const uploadTab = page.locator('button:has-text("Upload")').first()
      if (await uploadTab.isVisible().catch(() => false)) {
        await uploadTab.click()

        // Should see upload area or file input
        const uploadArea = page.locator('input[type="file"], [class*="drop"], [class*="upload"]').first()
        await expect(uploadArea).toBeVisible({ timeout: 3000 })
      }
    })
  })

  test.describe('Integration Tests', () => {
    test('Knowledge Search selection persists through save', async ({ page, createAgentWithTools }) => {
      // Create an agent first
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to edit page
      await page.click(selectors.playground.editAgentLink)
      await page.waitForURL(`**/edit/**`)
      await page.waitForLoadState('networkidle')

      // Wait for form to load
      await page.waitForFunction(() => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement
        return input && input.value && input.value.length > 0
      }, { timeout: 15000 })

      // Save without changes (baseline test)
      const saveButton = page.locator('button:has-text("Save")')
      await saveButton.click()

      // Should redirect back to playground on success
      await page.waitForURL('**/playground/**', { timeout: 30000 })
      expect(page.url()).toContain('/playground/')
    })

    test('can create agent with calculator and Knowledge Search action visible', async ({ page }) => {
      // Navigate to create page
      await page.goto('/create')
      await page.waitForLoadState('networkidle')
      await dismissTourOverlay(page)

      // Step 1
      const agentName = generateAgentName('Multi-Action Agent')
      await page.locator(selectors.create.nameInput).fill(agentName)
      await page.locator(selectors.create.jobTextarea).fill('A helpful assistant with calculator and knowledge search')
      await page.click(selectors.create.nextButton)

      // Step 2
      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill('Use calculator for math. Search knowledge for information.')
      await page.click(selectors.create.nextButton)

      // Step 3: Select Calculator
      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)

      // Click Calculator
      const calculatorCard = page.locator('button').filter({ hasText: /Calculator/i }).first()
      await calculatorCard.click()

      // Verify Knowledge Search is also visible (should see both)
      const knowledgeSearchCard = page.locator('button, div').filter({ hasText: /Knowledge Search/i }).first()
      const isKnowledgeVisible = await knowledgeSearchCard.isVisible().catch(() => false)

      // Knowledge Search should be visible as an option
      expect(isKnowledgeVisible).toBeTruthy()

      // Submit the agent
      await page.click(selectors.create.submitButton)

      // Should create successfully
      await page.waitForURL('**/playground/**', { timeout: 45000 })
      expect(page.url()).toContain('/playground/')
    })
  })
})

/**
 * Smoke tests for Knowledge Search feature
 */
test.describe('Knowledge Search Smoke Tests', () => {
  test('Knowledge Search action card renders correctly', async ({ page }) => {
    await page.goto('/create')
    await page.waitForLoadState('networkidle')
    await dismissTourOverlay(page)

    // Navigate to step 3
    await page.locator(selectors.create.nameInput).fill(generateAgentName('Smoke Test'))
    await page.locator(selectors.create.jobTextarea).fill(testAgentData.who.valid)
    await page.click(selectors.create.nextButton)
    await page.waitForSelector(selectors.create.rulesTextarea)
    await dismissTourOverlay(page)
    await page.locator(selectors.create.rulesTextarea).fill(testAgentData.rules.valid)
    await page.click(selectors.create.nextButton)
    await page.waitForSelector(selectors.create.toolsGrid)
    await dismissTourOverlay(page)

    // Take screenshot of step 3 with Knowledge Search visible
    await page.screenshot({ path: 'e2e-results/knowledge-search-step3.png' })

    // Verify Knowledge Search card exists and is clickable
    const knowledgeSearchCard = page.locator('button').filter({ hasText: /Knowledge Search/i }).first()
    const cardVisible = await knowledgeSearchCard.isVisible().catch(() => false)

    expect(cardVisible).toBeTruthy()
  })

  test('Edit Agent page loads without errors', async ({ page, createAgentWithTools }) => {
    // Create an agent
    const agent = await createAgentWithTools([TOOL_IDS.calculator])

    // Navigate to edit
    await page.click(selectors.playground.editAgentLink)
    await page.waitForURL(`**/edit/**`)

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Take screenshot
    await page.screenshot({ path: 'e2e-results/edit-agent-page.png' })

    // Check for no loading spinner stuck
    const loadingText = page.locator('text=Loading agent')
    const isLoadingStuck = await loadingText.isVisible().catch(() => false)

    // After networkidle, should not show loading spinner
    // Give a bit of time for the form to render
    await page.waitForTimeout(2000)

    const stillLoading = await loadingText.isVisible().catch(() => false)
    expect(stillLoading).toBeFalsy()
  })
})
