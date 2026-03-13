import { test, expect } from '../fixtures/test-fixtures'
import { generateAgentName, testAgentData } from '../helpers/test-data'
import { selectors } from '../helpers/selectors'
import type { Page } from '@playwright/test'

/**
 * OpenClaw E2E Journey Test
 *
 * Verifies the full OpenClaw user journey:
 *   Create Agent (3-step Q&A wizard) → Publish as OpenClaw Agent → Chat in Playground
 *
 * Before publishing: playground chat is powered by Langflow.
 * After publishing + connecting via OpenClaw desktop: chat is powered by OpenClaw.
 */

/**
 * Permanently disable driver.js tour overlays via CSS injection + DOM cleanup.
 * CSS injection persists across React re-renders unlike DOM removal.
 */
async function killTourOverlay(page: Page): Promise<void> {
  // Inject CSS to permanently hide and disable driver.js elements
  await page.addStyleTag({
    content: `
      .driver-overlay, .driver-popover, .driver-active-element,
      svg.driver-overlay, svg.driver-overlay-animated {
        display: none !important;
        pointer-events: none !important;
        opacity: 0 !important;
      }
      body.driver-active, body.driver-fade {
        pointer-events: auto !important;
      }
    `,
  })

  // Also clean up existing DOM elements and body classes
  await page.evaluate(() => {
    document.querySelectorAll(
      '.driver-overlay, .driver-popover, .driver-active-element, ' +
      'svg.driver-overlay, svg.driver-overlay-animated'
    ).forEach(el => el.remove())
    document.body.classList.remove('driver-active', 'driver-fade')
  })
  await page.waitForTimeout(100)
}

/** Navigate the 3-step wizard and create an agent. Returns the playground URL. */
async function createAgentViaWizard(
  page: Page,
  agentName: string,
  opts: { selectCalculator?: boolean } = {},
): Promise<string> {
  await page.goto('/create')
  await page.waitForLoadState('networkidle')
  await killTourOverlay(page)

  // Step 1: Identity — Name + Job
  await page.waitForSelector(selectors.create.nameInput, { state: 'visible', timeout: 30_000 })
  await page.locator(selectors.create.nameInput).fill(agentName)
  await page.locator(selectors.create.jobTextarea).fill(
    opts.selectCalculator
      ? 'A helpful math assistant that can perform calculations using the calculator tool.'
      : testAgentData.who.valid,
  )
  await killTourOverlay(page)
  await page.locator(selectors.create.nextButton).click({ force: true })

  // Step 2: Coaching — Rules
  await page.waitForSelector(selectors.create.rulesTextarea, { state: 'visible', timeout: 15_000 })
  await killTourOverlay(page)
  await page.locator(selectors.create.rulesTextarea).fill(
    opts.selectCalculator
      ? 'When users ask you to perform calculations, USE YOUR CALCULATOR TOOL to compute the answer. Always provide accurate results.'
      : testAgentData.rules.valid,
  )
  await page.locator(selectors.create.nextButton).click({ force: true })

  // Step 3: Actions — optionally select Calculator
  await page.waitForSelector(selectors.create.toolsGrid, { state: 'visible', timeout: 15_000 })
  // Tour "Give Your Agent Superpowers!" often re-triggers on step 3 transition
  await page.waitForTimeout(500)
  await killTourOverlay(page)
  if (opts.selectCalculator) {
    await page.locator('button:has-text("Calculator")').click({ force: true })
  }

  // Step 3 shows "Next Step" (wizard has 4 steps), advance to Step 4
  await killTourOverlay(page)
  await page.locator(selectors.create.nextButton).click({ force: true })

  // Step 4: Channels — skip channel selection, submit immediately
  // Wait for submit button OR step 4 content to confirm we advanced
  await page.waitForSelector(selectors.create.submitButton, { state: 'visible', timeout: 15_000 })
  await killTourOverlay(page)
  await page.locator(selectors.create.submitButton).click({ force: true })

  // Wait for redirect to playground
  await page.waitForURL('**/playground/workflow/**', { timeout: 60_000 })
  return page.url()
}

/** Publish the agent from the playground page. */
async function publishAgent(page: Page): Promise<void> {
  // Kill playground tour overlay (may trigger on first playground visit)
  await page.waitForTimeout(500)
  await killTourOverlay(page)

  // Wait for Publish button in header (needs agent data to load)
  const publishButton = page.locator('button:has-text("Publish")')
  await expect(publishButton.first()).toBeVisible({ timeout: 15_000 })
  await killTourOverlay(page)
  await publishButton.first().click({ force: true })

  // Phase A: modal opens — may say "Publish Agent" or "Replace Live Agent?"
  const modalHeading = page.locator('h2:has-text("Publish Agent"), h2:has-text("Replace Live Agent")')
  await expect(modalHeading.first()).toBeVisible({ timeout: 10_000 })

  // Kill tour overlay again — "Your Agent is Ready!" popover can appear over the modal
  await killTourOverlay(page)

  // Wait for skills to load — button shows "Loading skills..." then "Publish Agent"
  const modalPublishBtn = page.locator(
    '.fixed button:has-text("Publish Agent"), .fixed button:has-text("Replace & Publish")'
  )
  await expect(modalPublishBtn.first()).toBeVisible({ timeout: 15_000 })
  await modalPublishBtn.first().click({ force: true })

  // Phase B: success confirmation
  await expect(page.locator('h2:has-text("Agent Published!")')).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('text=/skill|No skills/')).toBeVisible({ timeout: 5_000 })

  // Close modal
  await page.locator('button:has-text("Done")').click({ force: true })

  // Verify badge
  await expect(page.locator('text=Published')).toBeVisible({ timeout: 10_000 })
}

test.describe('OpenClaw Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Suppress tours before any navigation
    await page.addInitScript(() => {
      localStorage.setItem('teachcharlie_tour_state', JSON.stringify({
        hasSeenCreateTour: true,
        hasSeenCanvasTour: true,
        hasSeenPlaygroundTour: true,
        currentDisclosureLevel: 1,
        completedTours: ['create-agent', 'canvas', 'playground'],
      }))
    })
  })

  test('Full OpenClaw journey: create agent → publish → verify status', async ({ page }) => {
    test.setTimeout(120_000)

    const agentName = generateAgentName('OpenClaw Agent')

    // ── Create Agent ───────────────────────────────────────────
    const playgroundUrl = await createAgentViaWizard(page, agentName, { selectCalculator: true })
    const workflowId = playgroundUrl.split('/playground/workflow/')[1]?.split('?')[0]
    console.log(`[OpenClaw] Agent created: ${agentName}, workflow: ${workflowId}`)
    expect(workflowId).toBeTruthy()

    // Verify chat input is ready
    await expect(page.locator(selectors.playground.chatInput)).toBeVisible({ timeout: 15_000 })

    // Before publishing: subtitle should show "Chat Playground"
    await expect(page.locator('p.text-xs:has-text("Chat Playground")')).toBeVisible({ timeout: 10_000 })

    // ── Publish as OpenClaw Agent ──────────────────────────────
    await publishAgent(page)
    console.log('[OpenClaw] Agent published successfully')

    // Reload to get fresh data
    await page.reload({ waitUntil: 'networkidle' })
    await killTourOverlay(page)

    // After publishing: should show "Published via OpenClaw" status indicator
    await expect(page.locator('text=Published via OpenClaw')).toBeVisible({ timeout: 15_000 })
    console.log('[OpenClaw] "Published via OpenClaw" indicator visible')

    // Verify "Published" badge in header
    await expect(page.locator('text=Published')).toBeVisible({ timeout: 10_000 })

    console.log('[OpenClaw] Full OpenClaw journey completed successfully!')
  })

  test('Published agent persists across navigation', async ({ page }) => {
    test.setTimeout(120_000)

    const agentName = generateAgentName('Persist Agent')

    // ── Create + Publish ───────────────────────────────────────
    const playgroundUrl = await createAgentViaWizard(page, agentName)
    await publishAgent(page)

    // ── Navigate away and back ─────────────────────────────────
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    await page.goto(new URL(playgroundUrl).pathname)
    await page.waitForLoadState('networkidle')

    // Verify "Published" badge is still visible
    await expect(page.locator('text=Published')).toBeVisible({ timeout: 15_000 })
    console.log('[OpenClaw] Published badge persists across navigation')
  })
})
