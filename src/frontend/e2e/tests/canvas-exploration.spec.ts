import { test, expect } from '../fixtures/test-fixtures'
import { canvasTestData } from '../helpers/test-data'
import { selectors, TOOL_IDS } from '../helpers/selectors'

/**
 * Phase 5 Verification: Canvas Viewer Tests
 *
 * These tests verify the progressive canvas disclosure feature,
 * including navigation, level switching, and educational overlays.
 *
 * Key verification: All 4 disclosure levels work correctly with appropriate UI changes
 */
test.describe('Canvas Exploration Journey', () => {
  test.describe('Navigation', () => {
    test('Unlock Flow button navigates from playground to canvas', async ({ page, createAgentWithTools }) => {
      // Create an agent with a tool so there's something to see in the canvas
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Verify we're on the playground
      await expect(page).toHaveURL(/\/playground\//)

      // Find and click the "Unlock Flow" button
      const unlockButton = page.locator(selectors.playground.unlockFlowButton)
      await expect(unlockButton).toBeVisible()
      await unlockButton.click()

      // Verify navigation to canvas page
      await page.waitForURL(`**/canvas/${agent.id}`, { timeout: 10000 })
      expect(page.url()).toContain(`/canvas/${agent.id}`)
    })

    test('Back to Chat link returns to playground', async ({ page, createAgentWithTools }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to canvas
      await page.click(selectors.playground.unlockFlowButton)
      await page.waitForURL(`**/canvas/**`)

      // Dismiss tour if it appears
      const tourClose = page.locator(selectors.canvas.tourCloseButton)
      if (await tourClose.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tourClose.click()
      }

      // Click Back to Chat
      const backLink = page.locator(selectors.canvas.backToChat)
      await expect(backLink).toBeVisible()
      await backLink.click()

      // Verify navigation back to playground
      await page.waitForURL(`**/playground/${agent.id}`)
      expect(page.url()).toContain(`/playground/${agent.id}`)
    })

    test('Edit Agent link navigates to edit page', async ({ page, createAgentWithTools }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to canvas
      await page.click(selectors.playground.unlockFlowButton)
      await page.waitForURL(`**/canvas/**`)

      // Dismiss tour if visible
      const tourClose = page.locator(selectors.canvas.tourCloseButton)
      if (await tourClose.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tourClose.click()
      }

      // Click Edit Agent
      const editLink = page.locator(selectors.canvas.editAgent)
      await expect(editLink).toBeVisible()
      await editLink.click()

      // Verify navigation to edit page
      await page.waitForURL(`**/edit/${agent.id}`)
      expect(page.url()).toContain(`/edit/${agent.id}`)
    })
  })

  test.describe('Progressive Disclosure Levels', () => {
    test('Level 1 - Peek Mode shows read-only view', async ({ page, createAgentWithTools, setCanvasLevel }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to canvas
      await page.click(selectors.playground.unlockFlowButton)
      await page.waitForURL(`**/canvas/**`)

      // Dismiss tour if visible
      const tourClose = page.locator(selectors.canvas.tourCloseButton)
      if (await tourClose.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tourClose.click()
      }

      // Level 1 should be default
      const levelHeader = page.locator(selectors.canvas.levelHeader)
      await expect(levelHeader).toContainText(canvasTestData.levels[1].title)

      // Verify educational message mentions read-only
      const pageContent = await page.textContent('body')
      expect(pageContent?.toLowerCase()).toContain('read')
    })

    test('Level 2 - Explore Mode shows exploration UI', async ({ page, createAgentWithTools, setCanvasLevel }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to canvas
      await page.click(selectors.playground.unlockFlowButton)
      await page.waitForURL(`**/canvas/**`)

      // Dismiss tour if visible
      const tourClose = page.locator(selectors.canvas.tourCloseButton)
      if (await tourClose.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tourClose.click()
      }

      // Click level 2 button
      await setCanvasLevel(page, 2)

      // Verify header changes to Explore Mode
      const levelHeader = page.locator(selectors.canvas.levelHeader)
      await expect(levelHeader).toContainText(canvasTestData.levels[2].title)
    })

    test('Level 3 - Builder Mode shows building UI', async ({ page, createAgentWithTools, setCanvasLevel }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to canvas
      await page.click(selectors.playground.unlockFlowButton)
      await page.waitForURL(`**/canvas/**`)

      // Dismiss tour if visible
      const tourClose = page.locator(selectors.canvas.tourCloseButton)
      if (await tourClose.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tourClose.click()
      }

      // Click level 3 button
      await setCanvasLevel(page, 3)

      // Verify header changes to Builder Mode
      const levelHeader = page.locator(selectors.canvas.levelHeader)
      await expect(levelHeader).toContainText(canvasTestData.levels[3].title)
    })

    test('Level 4 - Expert Mode shows full Langflow', async ({ page, createAgentWithTools, setCanvasLevel }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to canvas
      await page.click(selectors.playground.unlockFlowButton)
      await page.waitForURL(`**/canvas/**`)

      // Dismiss tour if visible
      const tourClose = page.locator(selectors.canvas.tourCloseButton)
      if (await tourClose.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tourClose.click()
      }

      // Click level 4 button
      await setCanvasLevel(page, 4)

      // Verify header changes to Expert Mode
      const levelHeader = page.locator(selectors.canvas.levelHeader)
      await expect(levelHeader).toContainText(canvasTestData.levels[4].title)

      // Verify description mentions Full Langflow
      const pageContent = await page.textContent('body')
      expect(pageContent?.toLowerCase()).toContain('langflow')
    })

    test('level selector cycles through all modes', async ({ page, createAgentWithTools, setCanvasLevel }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to canvas
      await page.click(selectors.playground.unlockFlowButton)
      await page.waitForURL(`**/canvas/**`)

      // Dismiss tour if visible
      const tourClose = page.locator(selectors.canvas.tourCloseButton)
      if (await tourClose.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tourClose.click()
      }

      const levelHeader = page.locator(selectors.canvas.levelHeader)

      // Test all levels
      for (const level of [1, 2, 3, 4] as const) {
        await setCanvasLevel(page, level)
        await expect(levelHeader).toContainText(canvasTestData.levels[level].title)
      }
    })
  })

  test.describe('Canvas Loading States', () => {
    test('canvas iframe loads successfully', async ({ page, createAgentWithTools }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to canvas
      await page.click(selectors.playground.unlockFlowButton)
      await page.waitForURL(`**/canvas/**`)

      // Dismiss tour if visible
      const tourClose = page.locator(selectors.canvas.tourCloseButton)
      if (await tourClose.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tourClose.click()
      }

      // Verify iframe is present
      const iframe = page.locator(selectors.canvas.langflowIframe)
      await expect(iframe).toBeVisible({ timeout: 30000 })
    })

    test('Open Full Editor link exists and points to Langflow', async ({ page, createAgentWithTools }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to canvas
      await page.click(selectors.playground.unlockFlowButton)
      await page.waitForURL(`**/canvas/**`)

      // Dismiss tour if visible
      const tourClose = page.locator(selectors.canvas.tourCloseButton)
      if (await tourClose.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tourClose.click()
      }

      // Find the Open Full Editor link
      const fullEditorLink = page.locator(selectors.canvas.openFullEditor)
      await expect(fullEditorLink).toBeVisible()

      // Verify it has target="_blank" (opens in new tab)
      const target = await fullEditorLink.getAttribute('target')
      expect(target).toBe('_blank')

      // Verify href points to Langflow
      const href = await fullEditorLink.getAttribute('href')
      expect(href).toContain('localhost:7860') // Langflow URL
    })
  })

  test.describe('Educational Tour', () => {
    test('first visit triggers canvas tour', async ({ page, createAgentWithTools, clearTourState }) => {
      // Clear any existing tour state
      await page.goto('/dashboard')
      await clearTourState(page)

      // Create agent
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to canvas
      await page.click(selectors.playground.unlockFlowButton)
      await page.waitForURL(`**/canvas/**`)

      // Tour dialog should appear
      const tourDialog = page.locator(selectors.canvas.tourDialog)
      await expect(tourDialog).toBeVisible({ timeout: 5000 })
    })

    test('tour can be closed', async ({ page, createAgentWithTools }) => {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])

      // Navigate to canvas
      await page.click(selectors.playground.unlockFlowButton)
      await page.waitForURL(`**/canvas/**`)

      // If tour appears, close it
      const tourDialog = page.locator(selectors.canvas.tourDialog)
      if (await tourDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
        const closeButton = page.locator(selectors.canvas.tourCloseButton)
        await closeButton.click()

        // Verify tour is closed
        await expect(tourDialog).not.toBeVisible()
      }
    })
  })
})

/**
 * Smoke test for canvas viewer
 */
test.describe('Canvas Smoke Test', () => {
  test('canvas page loads and shows level selector', async ({ page, createAgentWithTools }) => {
    const agent = await createAgentWithTools([TOOL_IDS.calculator])

    // Navigate to canvas
    await page.click(selectors.playground.unlockFlowButton)
    await page.waitForURL(`**/canvas/**`)

    // Verify level buttons are visible
    for (const level of [1, 2, 3, 4]) {
      const button = page.locator(selectors.canvas.levelButton(level))
      await expect(button).toBeVisible()
    }
  })
})
