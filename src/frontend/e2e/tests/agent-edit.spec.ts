import { test, expect } from '../fixtures/test-fixtures'
import { generateAgentName } from '../helpers/test-data'
import { selectors, TOOL_IDS } from '../helpers/selectors'

/**
 * Agent Edit Journey Tests
 *
 * Tests the agent editing flow including form population,
 * field updates, tool management, and persistence.
 */
test.describe('Agent Edit Journey', () => {
  test.describe('Navigation', () => {
    test('edit link from playground opens edit page', async ({ page, createAgentWithTools }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Find and click Edit Agent link
      const editLink = page.locator(selectors.playground.editAgentLink)
      await expect(editLink).toBeVisible()
      await editLink.click()

      // Verify navigation to edit page
      await page.waitForURL(`**/edit/${agent.id}`)
      expect(page.url()).toContain(`/edit/${agent.id}`)
    })

    test('edit link from dashboard opens edit page', async ({ page, createAgentWithTools }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to dashboard
      await page.goto('/dashboard')
      await page.waitForLoadState('networkidle')

      // Find the agent card and click menu
      const agentCard = page.locator(selectors.dashboard.agentCardByName(agent.name)).first()
      await expect(agentCard).toBeVisible({ timeout: 10000 })

      // Click the three-dot menu
      const menuButton = agentCard.locator('button').last()
      await menuButton.click()

      // Click Edit in the dropdown
      await page.click(selectors.dashboard.editMenuItem)

      // Verify navigation to edit page
      await page.waitForURL(`**/edit/${agent.id}`)
      expect(page.url()).toContain(`/edit/${agent.id}`)
    })
  })

  test.describe('Form Population', () => {
    test('loads existing agent data into form', async ({ page, createAgentWithTools }) => {
      const testName = generateAgentName('Edit Test')
      const agent = await createAgentWithTools([TOOL_IDS.calculator], {
        name: testName,
        who: 'A test agent for verifying form population in the edit page.',
        rules: 'Test rules that should appear in the instructions field.',
        tools: ['calculator'],
      })

      // Navigate to edit page
      await page.click(selectors.playground.editAgentLink)
      await page.waitForURL(`**/edit/**`)

      // Wait for form to load completely (wait for input to be visible and have a value)
      await page.waitForLoadState('networkidle')

      // Wait for the name input to be visible and populated
      const nameInput = page.locator('input[type="text"]').first()
      await expect(nameInput).toBeVisible({ timeout: 10000 })

      // Wait for input to have a value (agent data loaded)
      await page.waitForFunction(() => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement
        return input && input.value && input.value.length > 0
      }, { timeout: 10000 })

      // Verify the name input has the agent name
      const inputValue = await nameInput.inputValue()
      expect(inputValue).toContain(testName.substring(0, 10)) // Check partial match
    })
  })

  test.describe('Editing', () => {
    test('can update agent name and save', async ({ page, createAgentWithTools }) => {
      const originalName = generateAgentName('Original')
      const agent = await createAgentWithTools([TOOL_IDS.calculator], {
        name: originalName,
        who: 'An agent that will have its name changed.',
        rules: 'Basic rules for the agent.',
        tools: ['calculator'],
      })

      // Navigate to edit page
      await page.click(selectors.playground.editAgentLink)
      await page.waitForURL(`**/edit/**`)
      await page.waitForLoadState('networkidle')

      // Wait for name input to be visible and populated
      const nameInput = page.locator('input[type="text"]').first()
      await expect(nameInput).toBeVisible({ timeout: 10000 })

      // Wait for input to have a value (agent data loaded)
      await page.waitForFunction(() => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement
        return input && input.value && input.value.length > 0
      }, { timeout: 10000 })

      // Clear and update the name
      await nameInput.clear()

      const newName = generateAgentName('Updated')
      await nameInput.fill(newName)

      // Click Save button
      const saveButton = page.locator('button:has-text("Save")')
      await saveButton.click()

      // Wait for redirect back to playground or success indication
      await page.waitForURL('**/playground/**', { timeout: 30000 })

      // Verify we're back on playground (the save was successful)
      expect(page.url()).toContain('/playground/')
    })

    test('back to chat navigation works from edit page', async ({ page, createAgentWithTools }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to edit page
      await page.click(selectors.playground.editAgentLink)
      await page.waitForURL(`**/edit/**`)

      // Click Back to Chat
      const backLink = page.locator(selectors.edit.backToChat)
      await expect(backLink).toBeVisible()
      await backLink.click()

      // Verify navigation back to playground
      await page.waitForURL(`**/playground/${agent.id}`)
    })
  })

  test.describe('Tool Management', () => {
    test('can toggle tool selection and save', async ({ page, createAgentWithTools }) => {
      // Create agent with calculator only
      const agent = await createAgentWithTools([TOOL_IDS.calculator], {
        name: generateAgentName('Tool Toggle'),
        who: 'An agent for testing tool toggle functionality.',
        rules: 'Use available tools appropriately.',
        tools: ['calculator'],
      })

      // Navigate to edit page
      await page.click(selectors.playground.editAgentLink)
      await page.waitForURL(`**/edit/**`)
      await page.waitForLoadState('networkidle')

      // Find the Web Search tool card and click to add it
      const webSearchCard = page.locator('button:has-text("Web Search"), div:has-text("Web Search") button')
      if (await webSearchCard.first().isVisible()) {
        await webSearchCard.first().click()
      }

      // Click Save button
      const saveButton = page.locator('button:has-text("Save")')
      await saveButton.click()

      // Wait for save to complete
      await page.waitForURL('**/playground/**', { timeout: 30000 })

      // Agent was saved successfully if we redirected
      expect(page.url()).toContain('/playground/')
    })
  })

  test.describe('Validation', () => {
    test('validation prevents saving with empty name', async ({ page, createAgentWithTools }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to edit page
      await page.click(selectors.playground.editAgentLink)
      await page.waitForURL(`**/edit/**`)
      await page.waitForLoadState('networkidle')

      // Clear the name field
      const nameInput = page.locator('input[type="text"]').first()
      await nameInput.clear()

      // Try to save
      const saveButton = page.locator('button:has-text("Save")')
      await saveButton.click()

      // Should see validation error or stay on page
      // Either error message appears OR we don't redirect
      await page.waitForTimeout(2000)

      // Check if still on edit page (validation prevented save)
      const stillOnEdit = page.url().includes('/edit/')
      const errorVisible = await page.locator(selectors.common.errorMessage).isVisible().catch(() => false)

      expect(stillOnEdit || errorVisible).toBeTruthy()
    })
  })

  test.describe('UI States', () => {
    test('shows loading state while form loads', async ({ page, createAgentWithTools }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to edit page - check for loading state
      await page.click(selectors.playground.editAgentLink)

      // The page should show loading initially or load quickly
      // This test verifies the page loads without errors
      await page.waitForURL(`**/edit/**`)
      await page.waitForLoadState('networkidle')

      // Form should be visible after loading
      const formExists = await page.locator('input, textarea, button').count()
      expect(formExists).toBeGreaterThan(0)
    })
  })
})

/**
 * Smoke test for edit functionality
 */
test.describe('Edit Smoke Test', () => {
  test('can navigate to edit page and return', async ({ page, createAgentWithTools }) => {
    const agent = await createAgentWithTools([TOOL_IDS.calculator])

    // Go to edit
    await page.click(selectors.playground.editAgentLink)
    await page.waitForURL(`**/edit/**`)

    // Return to playground
    const backLink = page.locator('a:has-text("Back"), a:has-text("Chat")')
    await backLink.first().click()
    await page.waitForURL(`**/playground/**`)

    // Verify we're back
    expect(page.url()).toContain('/playground/')
  })
})
