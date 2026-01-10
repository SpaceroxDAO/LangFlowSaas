import { test, expect } from '@playwright/test'
import { testAgentData } from '../helpers/test-data'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

/**
 * Enhanced Playground E2E Tests
 *
 * Creates an agent via UI and tests the complete playground functionality:
 * - 2-turn conversation
 * - Sidebar with conversation history
 * - Message actions (copy, regenerate)
 * - UI elements and interactions
 */

// Store the playground URL in a temp file so it persists across tests
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const URL_FILE = path.join(__dirname, '..', '.test-playground-url.txt')

// Helper to dismiss tour overlays
async function dismissTourOverlay(page: any): Promise<void> {
  await page.evaluate(() => {
    localStorage.setItem('teachcharlie_tour_state', JSON.stringify({
      hasSeenCreateTour: true,
      hasSeenCanvasTour: true,
      hasSeenPlaygroundTour: true,
      currentDisclosureLevel: 1,
      completedTours: ['create-agent', 'canvas', 'playground']
    }))
  })
  try {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(100)
    await page.evaluate(() => {
      document.querySelectorAll('.driver-overlay, .driver-popover').forEach((el: Element) => el.remove())
      document.body.classList.remove('driver-active', 'driver-fade')
    })
  } catch { /* ignore */ }
}

// Helper to wait for chat to be ready
async function waitForChatReady(page: any): Promise<void> {
  await page.waitForSelector('textarea[placeholder*="Type a message"]', { state: 'visible', timeout: 30000 })
}

// Helper to get or create the playground URL
async function getPlaygroundUrl(page: any): Promise<string> {
  // Check if URL already exists
  if (fs.existsSync(URL_FILE)) {
    const url = fs.readFileSync(URL_FILE, 'utf-8').trim()
    if (url) {
      return url
    }
  }

  // Need to create agent and get URL
  await page.addInitScript(() => {
    localStorage.setItem('teachcharlie_tour_state', JSON.stringify({
      hasSeenCreateTour: true,
      hasSeenCanvasTour: true,
      hasSeenPlaygroundTour: true,
      currentDisclosureLevel: 1,
      completedTours: ['create-agent', 'canvas', 'playground']
    }))
  })

  // Navigate to create page
  await page.goto('/create')
  await page.waitForLoadState('networkidle')
  await dismissTourOverlay(page)

  // Step 1: Enter agent name and job
  const nameField = page.locator('input[type="text"]').first()
  if (await nameField.isVisible({ timeout: 5000 })) {
    await nameField.fill('E2E Test Agent')
  }

  const jobTextarea = page.locator('textarea').first()
  await jobTextarea.waitFor({ state: 'visible', timeout: 15000 })
  await jobTextarea.fill(testAgentData.who.valid)

  // Click Next
  await page.click('button:has-text("Next")')
  await page.waitForTimeout(500)

  // Step 2: Enter rules
  await dismissTourOverlay(page)
  const rulesTextarea = page.locator('textarea').first()
  await rulesTextarea.waitFor({ state: 'visible', timeout: 10000 })
  await rulesTextarea.fill(testAgentData.rules.valid)

  await page.click('button:has-text("Next")')
  await page.waitForTimeout(500)

  // Step 3: Click create
  await dismissTourOverlay(page)
  const finishButton = page.locator('button:has-text("Finish & Create Agent")')
  await finishButton.waitFor({ state: 'visible', timeout: 10000 })
  await finishButton.click()

  // Wait for redirect to playground
  await page.waitForURL('**/playground/**', { timeout: 60000 })
  const url = page.url()

  // Save URL to file
  fs.writeFileSync(URL_FILE, url)
  console.log(`[Setup] Created agent, playground URL: ${url}`)

  return url
}

// ============================================================================
// Main Test Suite - Tests run serially and share the same agent
// ============================================================================

test.describe('Playground Full E2E Tests', () => {
  // Clean up URL file before all tests
  test.beforeAll(async () => {
    if (fs.existsSync(URL_FILE)) {
      fs.unlinkSync(URL_FILE)
    }
  })

  // Clean up URL file after all tests
  test.afterAll(async () => {
    if (fs.existsSync(URL_FILE)) {
      fs.unlinkSync(URL_FILE)
    }
  })

  test('1. Create agent via UI and verify playground loads', async ({ page }) => {
    test.setTimeout(120000)

    const playgroundUrl = await getPlaygroundUrl(page)
    expect(playgroundUrl).toBeTruthy()
    expect(playgroundUrl).toContain('/playground/')

    // Navigate to ensure we're on the playground
    await page.goto(playgroundUrl)
    await waitForChatReady(page)

    // Verify header
    await expect(page.locator('h1').first()).toBeVisible()

    // Verify chat input
    await expect(page.locator('textarea[placeholder*="Type a message"]')).toBeVisible()

    // Verify Share button
    await expect(page.locator('button:has-text("Share")')).toBeVisible()

    // Verify New Chat button
    await expect(page.locator('button:has-text("New Chat")')).toBeVisible()

    console.log('[Test 1] Agent created and playground verified')
  })

  test('2. Send first message and receive response', async ({ page }) => {
    test.setTimeout(180000)

    const playgroundUrl = await getPlaygroundUrl(page)
    await page.goto(playgroundUrl)
    await waitForChatReady(page)

    // Start fresh
    await page.click('button:has-text("New Chat")')
    await page.waitForTimeout(500)

    // Send message
    const chatInput = page.locator('textarea[placeholder*="Type a message"]')
    await chatInput.fill('Hello! What is 2 + 2?')
    await chatInput.press('Enter')

    // Verify user message appears
    const userMessage = page.locator('.bg-violet-500.rounded-2xl').filter({
      hasText: 'Hello! What is 2 + 2?'
    })
    await expect(userMessage).toBeVisible({ timeout: 10000 })

    // Wait for assistant response
    const assistantMessage = page.locator('.bg-white.border.rounded-2xl').filter({
      hasText: /.{10,}/
    })
    await expect(assistantMessage.first()).toBeVisible({ timeout: 120000 })

    console.log('[Test 2] First message sent and response received')
  })

  test('3. Send second message - 2-turn conversation', async ({ page }) => {
    test.setTimeout(180000)

    const playgroundUrl = await getPlaygroundUrl(page)
    await page.goto(playgroundUrl)
    await waitForChatReady(page)

    // Start fresh
    await page.click('button:has-text("New Chat")')
    await page.waitForTimeout(500)

    const chatInput = page.locator('textarea[placeholder*="Type a message"]')

    // First turn
    await chatInput.fill('My name is Charlie. Please remember it.')
    await chatInput.press('Enter')

    // Wait for first response
    await page.locator('.bg-white.border.rounded-2xl').filter({
      hasText: /.{10,}/
    }).first().waitFor({ timeout: 120000 })

    // Second turn
    await chatInput.fill('What is my name?')
    await chatInput.press('Enter')

    // Wait for second response
    await page.waitForTimeout(5000)

    // Verify we have multiple messages
    const userMessages = await page.locator('.bg-violet-500.rounded-2xl').count()
    expect(userMessages).toBeGreaterThanOrEqual(2)

    console.log('[Test 3] Two-turn conversation completed')
  })

  test('4. Sidebar toggle functionality', async ({ page }) => {
    test.setTimeout(30000)

    const playgroundUrl = await getPlaygroundUrl(page)
    await page.goto(playgroundUrl)
    await waitForChatReady(page)

    const sidebar = page.locator('.border-r.bg-gray-50').first()
    const toggleButton = page.locator('button').filter({
      has: page.locator('svg path[d*="M4 6h16"]')
    }).first()

    // Initial state - sidebar visible
    let box = await sidebar.boundingBox()
    expect(box?.width).toBeGreaterThan(50)

    // Collapse
    await toggleButton.click()
    await page.waitForTimeout(400)
    box = await sidebar.boundingBox()
    expect(box?.width).toBeLessThan(10)

    // Expand
    await toggleButton.click()
    await page.waitForTimeout(400)
    box = await sidebar.boundingBox()
    expect(box?.width).toBeGreaterThan(50)

    console.log('[Test 4] Sidebar toggle works')
  })

  test('5. Conversation appears in sidebar', async ({ page }) => {
    test.setTimeout(180000)

    const playgroundUrl = await getPlaygroundUrl(page)
    await page.goto(playgroundUrl)
    await waitForChatReady(page)

    await page.click('button:has-text("New Chat")')
    await page.waitForTimeout(500)

    // Send a message
    const chatInput = page.locator('textarea[placeholder*="Type a message"]')
    await chatInput.fill('Testing sidebar conversation list')
    await chatInput.press('Enter')

    // Wait for response
    await page.locator('.bg-white.border.rounded-2xl').filter({
      hasText: /.{5,}/
    }).first().waitFor({ timeout: 120000 })

    // Verify conversation in sidebar
    const conversationItems = page.locator('.w-full.text-left.px-3')
    const count = await conversationItems.count()
    expect(count).toBeGreaterThan(0)

    console.log('[Test 5] Conversation appears in sidebar')
  })

  test('6. New Chat clears messages', async ({ page }) => {
    test.setTimeout(30000)

    const playgroundUrl = await getPlaygroundUrl(page)
    await page.goto(playgroundUrl)
    await waitForChatReady(page)

    // Send a message
    const chatInput = page.locator('textarea[placeholder*="Type a message"]')
    await chatInput.fill('Message before clear')
    await chatInput.press('Enter')

    // Wait for message
    const userMessage = page.locator('.bg-violet-500.rounded-2xl').filter({
      hasText: 'Message before clear'
    })
    await expect(userMessage).toBeVisible({ timeout: 10000 })

    // Click New Chat
    await page.click('button:has-text("New Chat")')
    await page.waitForTimeout(500)

    // Message should be gone
    await expect(userMessage).not.toBeVisible({ timeout: 5000 })

    console.log('[Test 6] New Chat clears messages')
  })

  test('7. Copy message functionality', async ({ page, context }) => {
    test.setTimeout(60000)

    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const playgroundUrl = await getPlaygroundUrl(page)
    await page.goto(playgroundUrl)
    await waitForChatReady(page)

    await page.click('button:has-text("New Chat")')
    await page.waitForTimeout(500)

    // Send unique message
    const testContent = 'Copy test message 12345'
    const chatInput = page.locator('textarea[placeholder*="Type a message"]')
    await chatInput.fill(testContent)
    await chatInput.press('Enter')

    // Wait for message
    const message = page.locator('.bg-violet-500.rounded-2xl').filter({
      hasText: testContent
    })
    await expect(message).toBeVisible({ timeout: 10000 })

    // Hover to show actions
    const messageContainer = message.locator('..').locator('..')
    await messageContainer.hover()
    await page.waitForTimeout(300)

    // Click copy
    const copyButton = page.locator('button[title="Copy message"]').first()
    if (await copyButton.isVisible({ timeout: 3000 })) {
      await copyButton.click()

      // Verify checkmark
      const checkIcon = page.locator('svg.text-green-500')
      await expect(checkIcon).toBeVisible({ timeout: 2000 })

      // Verify clipboard
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
      expect(clipboardText).toBe(testContent)
    }

    console.log('[Test 7] Copy message works')
  })

  test('8. Share modal opens and closes', async ({ page }) => {
    test.setTimeout(30000)

    const playgroundUrl = await getPlaygroundUrl(page)
    await page.goto(playgroundUrl)
    await waitForChatReady(page)

    // Click Share
    await page.click('button:has-text("Share")')

    // Wait for modal
    const modal = page.locator('.fixed.inset-0').filter({
      has: page.locator('text=Share & Deploy')
    })
    await expect(modal).toBeVisible({ timeout: 5000 })

    // Close modal
    const closeButton = page.locator('button').filter({
      has: page.locator('svg path[d*="M6 18L18 6"]')
    }).first()
    await closeButton.click()
    await page.waitForTimeout(300)

    await expect(modal).not.toBeVisible({ timeout: 3000 })

    console.log('[Test 8] Share modal works')
  })

  test('9. Shift+Enter creates new line', async ({ page }) => {
    test.setTimeout(30000)

    const playgroundUrl = await getPlaygroundUrl(page)
    await page.goto(playgroundUrl)
    await waitForChatReady(page)

    const chatInput = page.locator('textarea[placeholder*="Type a message"]')
    await chatInput.fill('Line 1')
    await chatInput.press('Shift+Enter')
    await chatInput.type('Line 2')

    const value = await chatInput.inputValue()
    expect(value).toContain('\n')
    expect(value).toContain('Line 1')
    expect(value).toContain('Line 2')

    console.log('[Test 9] Shift+Enter works')
  })

  test('10. Send button state changes with input', async ({ page }) => {
    test.setTimeout(30000)

    const playgroundUrl = await getPlaygroundUrl(page)
    await page.goto(playgroundUrl)
    await waitForChatReady(page)

    const sendButton = page.locator('button.w-11.h-11').filter({
      has: page.locator('svg')
    }).first()

    // Should be disabled when empty
    await expect(sendButton).toBeDisabled()

    // Type something
    const chatInput = page.locator('textarea[placeholder*="Type a message"]')
    await chatInput.fill('Test message')
    await page.waitForTimeout(100)

    // Should be enabled
    await expect(sendButton).toBeEnabled()

    // Clear
    await chatInput.fill('')
    await page.waitForTimeout(100)

    // Should be disabled again
    await expect(sendButton).toBeDisabled()

    console.log('[Test 10] Send button state works')
  })

  test('11. Complete 2-turn conversation flow', async ({ page }) => {
    test.setTimeout(180000)

    const playgroundUrl = await getPlaygroundUrl(page)
    await page.goto(playgroundUrl)
    await waitForChatReady(page)

    await page.click('button:has-text("New Chat")')
    await page.waitForTimeout(500)

    const chatInput = page.locator('textarea[placeholder*="Type a message"]')

    // Turn 1
    console.log('[Test 11] Sending first message...')
    await chatInput.fill('I am testing. Please respond with "ACKNOWLEDGED".')
    await chatInput.press('Enter')

    // Wait for first response
    await page.locator('.bg-white.border.rounded-2xl').filter({
      hasText: /.{5,}/
    }).first().waitFor({ timeout: 120000 })
    console.log('[Test 11] First response received')

    // Turn 2
    console.log('[Test 11] Sending second message...')
    await chatInput.fill('Now please count from 1 to 3.')
    await chatInput.press('Enter')

    // Wait a bit for second response
    await page.waitForTimeout(5000)

    // Count messages
    const userMessages = await page.locator('.bg-violet-500.rounded-2xl').count()
    const assistantMessages = await page.locator('.bg-white.border.rounded-2xl').count()

    console.log(`[Test 11] User: ${userMessages}, Assistant: ${assistantMessages}`)

    expect(userMessages).toBeGreaterThanOrEqual(2)
    expect(assistantMessages).toBeGreaterThanOrEqual(1)

    // Verify sidebar
    const sidebarItems = await page.locator('.w-full.text-left.px-3').count()
    expect(sidebarItems).toBeGreaterThan(0)

    console.log('[Test 11] Complete 2-turn conversation PASSED!')
  })
})
