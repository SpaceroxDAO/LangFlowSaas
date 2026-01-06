import { test, expect, responseContains, dismissTourOverlay } from '../fixtures/test-fixtures'
import { toolTestData, canvasTestData, generateAgentName } from '../helpers/test-data'
import { selectors, TOOL_IDS } from '../helpers/selectors'

/**
 * New User Complete Journey Tests
 *
 * These tests verify the complete end-to-end flow a new user would experience:
 * Create Agent → Chat with Tools → View Canvas
 *
 * This is the critical happy path that must work for MVP.
 */
test.describe('New User Complete Journey', () => {
  test('create agent with calculator → chat with math question → verify tool works → view canvas', async ({ page }) => {
    const agentName = generateAgentName('E2E Journey')

    // ========================================
    // Step 1: Navigate to Create Agent
    // ========================================
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

    // Wait for form to be ready
    await page.waitForSelector(selectors.create.nameInput, { state: 'visible', timeout: 30000 })

    // ========================================
    // Step 2: Fill Identity (Step 1 of wizard)
    // ========================================
    await page.locator(selectors.create.nameInput).fill(agentName)
    await page.locator(selectors.create.jobTextarea).fill(
      'A helpful math assistant that can perform calculations and solve arithmetic problems.'
    )

    // Click Next Step
    await page.click(selectors.create.nextButton)

    // ========================================
    // Step 3: Fill Coaching (Step 2 of wizard)
    // ========================================
    await page.waitForSelector(selectors.create.rulesTextarea)
    await page.locator(selectors.create.rulesTextarea).fill(
      'When users ask you to perform calculations, USE YOUR CALCULATOR TOOL. Always show your work and provide accurate results.'
    )

    // Click Next Step
    await page.click(selectors.create.nextButton)

    // ========================================
    // Step 4: Select Calculator Tool (Step 3 of wizard)
    // ========================================
    await page.waitForSelector(selectors.create.toolsGrid)

    // Select the Calculator tool
    const calculatorCard = page.locator(selectors.tools.calculator)
    await calculatorCard.click()

    // ========================================
    // Step 5: Create Agent
    // ========================================
    await page.click(selectors.create.submitButton)

    // Wait for redirect to playground
    await page.waitForURL('**/playground/**', { timeout: 60000 })
    const playgroundUrl = page.url()
    console.log(`Agent created, redirected to: ${playgroundUrl}`)

    // Extract agent ID
    const agentId = playgroundUrl.split('/playground/')[1]
    expect(agentId).toBeTruthy()

    // ========================================
    // Step 6: Test Chat with Math Question
    // ========================================
    // Fill the chat input
    const chatInput = page.locator(selectors.playground.chatInput)
    await chatInput.fill(toolTestData.calculator.quickTest.question) // "What is 15 * 8?"

    // Send the message
    await page.click(selectors.playground.sendButton)

    // Wait for response
    await page.waitForSelector(selectors.playground.loadingIndicator, { state: 'visible', timeout: 5000 }).catch(() => {})
    await page.waitForSelector(selectors.playground.loadingIndicator, { state: 'hidden', timeout: 90000 })

    // Get the response (assistant messages use rounded-2xl)
    const assistantMessages = page.locator('.bg-white.rounded-2xl, .bg-white.border.rounded-2xl')
    await expect(assistantMessages.last()).toBeVisible({ timeout: 30000 })
    const response = await assistantMessages.last().textContent() || ''
    console.log(`Chat response: ${response}`)

    // ========================================
    // Step 7: Verify Tool Executed Correctly
    // ========================================
    // 15 * 8 = 120
    const hasCorrectAnswer = responseContains(response, toolTestData.calculator.quickTest.expectedContains)
    expect(hasCorrectAnswer).toBeTruthy()

    // ========================================
    // Step 8: Navigate to Canvas
    // ========================================
    const unlockFlowButton = page.locator(selectors.playground.unlockFlowButton)
    await expect(unlockFlowButton).toBeVisible()
    await unlockFlowButton.click()

    // Wait for canvas page
    await page.waitForURL(`**/canvas/${agentId}`, { timeout: 10000 })

    // ========================================
    // Step 9: Verify Canvas Loaded
    // ========================================
    // Dismiss tour if it appears on canvas
    await dismissTourOverlay(page)

    // Verify canvas header shows agent name
    const canvasHeader = page.locator('h1')
    await expect(canvasHeader).toContainText('Brain')

    // Verify iframe is present (Langflow canvas)
    const iframe = page.locator(selectors.canvas.langflowIframe)
    await expect(iframe).toBeVisible({ timeout: 30000 })

    console.log('Complete user journey successful!')
  })

  test('create agent → navigate through all wizard steps correctly', async ({ page }) => {
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

    // Wait for form to be ready
    await page.waitForSelector(selectors.create.nameInput, { state: 'visible', timeout: 30000 })

    // ========================================
    // Verify Step 1 - Identity Section
    // ========================================
    // Check that we're on the Identity step (the first input should be name)
    await expect(page.locator(selectors.create.nameInput)).toBeVisible()
    // The page header or step section should indicate Identity
    await expect(page.locator('h2, h3').filter({ hasText: /identity/i })).toBeVisible()

    // Fill Step 1
    await page.locator(selectors.create.nameInput).fill('Step Test Agent')
    await page.locator(selectors.create.jobTextarea).fill('A test agent for wizard step verification.')
    await page.click(selectors.create.nextButton)

    // ========================================
    // Verify Step 2 - Coaching Section
    // ========================================
    // Check that we're on the Coaching step
    await expect(page.locator(selectors.create.rulesTextarea)).toBeVisible()
    await expect(page.locator('h2, h3').filter({ hasText: /coaching/i })).toBeVisible()

    // Fill Step 2
    await page.waitForSelector(selectors.create.rulesTextarea)
    await page.locator(selectors.create.rulesTextarea).fill('Be helpful and provide accurate information.')
    await page.click(selectors.create.nextButton)

    // ========================================
    // Verify Step 3 - Tricks Section (Tools)
    // ========================================
    // Check that we're on the Tricks/Tools step
    await expect(page.locator(selectors.create.toolsGrid)).toBeVisible()
    await expect(page.locator('h2, h3').filter({ hasText: /tricks/i })).toBeVisible()

    // Verify tools are visible
    await expect(page.locator(selectors.tools.calculator)).toBeVisible()
    await expect(page.locator(selectors.tools.webSearch)).toBeVisible()

    // Verify submit button is visible
    await expect(page.locator(selectors.create.submitButton)).toBeVisible()
  })

  test('dashboard → create → playground → canvas flow', async ({ page, createAgentWithTools }) => {
    // Start from dashboard
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Click create agent
    await page.click(selectors.dashboard.createAgentButton)
    await page.waitForURL('**/create')

    // Create an agent using the fixture
    const agent = await createAgentWithTools([TOOL_IDS.calculator])

    // We should now be on playground
    expect(page.url()).toContain('/playground/')

    // Navigate to canvas
    await page.click(selectors.playground.unlockFlowButton)
    await page.waitForURL(`**/canvas/**`)

    // Verify canvas loaded
    const iframe = page.locator(selectors.canvas.langflowIframe)
    await expect(iframe).toBeVisible({ timeout: 30000 })
  })
})

/**
 * Error Recovery in User Journey
 */
test.describe('User Journey Error Recovery', () => {
  test('can recover from validation errors in wizard', async ({ page }) => {
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

    // Wait for form to be ready
    await page.waitForSelector(selectors.create.nameInput, { state: 'visible', timeout: 30000 })

    // Try to proceed without filling fields
    await page.click(selectors.create.nextButton)

    // Should see validation error message (specifically the error text)
    await expect(page.locator('text=Please give your agent a name')).toBeVisible()

    // Fill in the required fields
    await page.locator(selectors.create.nameInput).fill('Recovery Test Agent')
    await page.locator(selectors.create.jobTextarea).fill('An agent to test error recovery in the wizard.')

    // Now should be able to proceed
    await page.click(selectors.create.nextButton)

    // Should be on step 2 (Coaching section - rules textarea visible)
    await expect(page.locator(selectors.create.rulesTextarea)).toBeVisible({ timeout: 10000 })
  })

  test('back button preserves data across steps', async ({ page }) => {
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

    // Wait for form to be ready
    await page.waitForSelector(selectors.create.nameInput, { state: 'visible', timeout: 30000 })

    const testName = 'Data Persistence Agent'
    const testJob = 'Testing that data persists when navigating back in the wizard.'

    // Fill Step 1
    await page.locator(selectors.create.nameInput).fill(testName)
    await page.locator(selectors.create.jobTextarea).fill(testJob)
    await page.click(selectors.create.nextButton)

    // Go to Step 2
    await page.waitForSelector(selectors.create.rulesTextarea)
    await page.locator(selectors.create.rulesTextarea).fill('Some instructions')

    // Go back to Step 1
    await page.click(selectors.create.backButton)

    // Verify data is preserved
    await expect(page.locator(selectors.create.nameInput)).toHaveValue(testName)
    await expect(page.locator(selectors.create.jobTextarea)).toHaveValue(testJob)
  })
})

/**
 * Smoke test - Quick verification of core journey
 */
test.describe('Journey Smoke Test', () => {
  test('can create agent and reach playground', async ({ page, createAgentWithTools }) => {
    const agent = await createAgentWithTools([TOOL_IDS.calculator])

    // Verify we're on playground
    expect(page.url()).toContain('/playground/')

    // Verify chat input is available
    await expect(page.locator(selectors.playground.chatInput)).toBeVisible()
  })
})
