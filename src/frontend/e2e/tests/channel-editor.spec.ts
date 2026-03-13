import { test, expect } from '@playwright/test'

/**
 * Channel Editor Tests — Verifies OpenClaw Phase 4 channel editing features.
 */

// Helper: aggressively dismiss any guided tour overlay (multi-step tours)
async function dismissAllTours(page: import('@playwright/test').Page) {
  // Keep closing tour popovers until none remain
  for (let i = 0; i < 10; i++) {
    const closeBtn = page.locator('.driver-popover-close-btn')
    if (await closeBtn.isVisible({ timeout: 500 }).catch(() => false)) {
      await closeBtn.click()
      await page.waitForTimeout(200)
    } else {
      break
    }
  }
  // Final escape to dismiss any remaining overlay
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
}

// Navigate from Step 1 to Step 4 of the Create wizard
async function navigateToStep4(page: import('@playwright/test').Page) {
  await page.goto('/create')
  await page.waitForLoadState('networkidle')
  await dismissAllTours(page)

  // Fill Step 1
  await page.locator('input[placeholder="Charlie"]').clear()
  await page.locator('input[placeholder="Charlie"]').fill('Channel Test Agent')
  await page.locator('textarea').first().clear()
  await page.locator('textarea').first().fill('A test agent for verifying channel editing features work correctly in the wizard.')

  // Step 1 → 2
  await dismissAllTours(page)
  await page.click('button:has-text("Next Step")', { force: true })
  await page.waitForTimeout(600)
  await dismissAllTours(page)

  // Step 2 → 3
  await page.click('button:has-text("Next Step")', { force: true })
  await page.waitForTimeout(600)
  await dismissAllTours(page)

  // Step 3 → 4
  await page.click('button:has-text("Next Step")', { force: true })
  await page.waitForTimeout(600)
  await dismissAllTours(page)
}

// Helper: find an existing agent ID from the dashboard
async function findAgentId(page: import('@playwright/test').Page): Promise<string | null> {
  await page.goto('/dashboard')
  await page.waitForLoadState('networkidle')
  const agentLink = page.locator('[href*="/playground/"]').first()
  if (await agentLink.count() === 0) return null
  const href = await agentLink.getAttribute('href')
  return href?.split('/').pop() || null
}

test.describe('Channel Editor — Phase 4 Polish', () => {

  test('CreateAgent Step 4 shows all 4 channel toggles', async ({ page }) => {
    await navigateToStep4(page)

    await expect(page.locator('text=Step 4: Channels')).toBeVisible()
    await expect(page.locator('button:has-text("WhatsApp")')).toBeVisible()
    await expect(page.locator('button:has-text("Telegram")')).toBeVisible()
    await expect(page.locator('button:has-text("Slack")')).toBeVisible()
    await expect(page.locator('button:has-text("Discord")')).toBeVisible()
  })

  test('CreateAgent Step 4 shows fixed channel text', async ({ page }) => {
    await navigateToStep4(page)

    // No channels: shows skip text
    await expect(page.locator('text=No channels selected yet')).toBeVisible()

    // Select 2 channels
    await page.click('button:has-text("WhatsApp")')
    await page.click('button:has-text("Slack")')

    // Verify FIXED text
    await expect(page.locator('text=These preferences are saved with your agent.')).toBeVisible()
    await expect(page.locator('text=2 channels selected')).toBeVisible()

    // Old text must NOT appear
    await expect(page.locator('text=Channel setup will happen after')).not.toBeVisible()
  })

  test('CreateAgent Step 4 channel toggle selects and deselects', async ({ page }) => {
    await navigateToStep4(page)

    const discordBtn = page.locator('button:has-text("Discord")')

    // Initially not selected
    await expect(discordBtn).not.toHaveClass(/border-cyan-500/)

    // Click to select
    await discordBtn.click()
    await expect(discordBtn).toHaveClass(/border-cyan-500/)
    await expect(page.locator('text=1 channel selected')).toBeVisible()

    // Click again to deselect
    await discordBtn.click()
    await expect(discordBtn).not.toHaveClass(/border-cyan-500/)
    await expect(page.locator('text=No channels selected yet')).toBeVisible()
  })

  test('EditAgentPage has Channels section in correct order', async ({ page }) => {
    const agentId = await findAgentId(page)
    test.skip(!agentId, 'No agents exist — create one first to test edit page')

    await page.goto(`/edit/${agentId}`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h2:has-text("Identity")')).toBeVisible({ timeout: 10000 })

    // Channels section exists
    await expect(page.locator('h2:has-text("Channels")')).toBeVisible()

    // All 4 channel buttons exist
    await expect(page.locator('button:has-text("WhatsApp")')).toBeVisible()
    await expect(page.locator('button:has-text("Telegram")')).toBeVisible()
    await expect(page.locator('button:has-text("Slack")')).toBeVisible()
    await expect(page.locator('button:has-text("Discord")')).toBeVisible()

    // Verify section order
    const sections = page.locator('h2')
    const sectionTexts = await sections.allTextContents()

    const identityIdx = sectionTexts.findIndex(t => t.includes('Identity'))
    const instructionsIdx = sectionTexts.findIndex(t => t.includes('Instructions'))
    const actionsIdx = sectionTexts.findIndex(t => t.includes('Actions'))
    const channelsIdx = sectionTexts.findIndex(t => t.includes('Channels'))

    expect(identityIdx).toBeGreaterThanOrEqual(0)
    expect(instructionsIdx).toBeGreaterThanOrEqual(0)
    expect(actionsIdx).toBeGreaterThanOrEqual(0)
    expect(channelsIdx).toBeGreaterThanOrEqual(0)

    expect(identityIdx).toBeLessThan(instructionsIdx)
    expect(instructionsIdx).toBeLessThan(actionsIdx)
    expect(actionsIdx).toBeLessThan(channelsIdx)
  })
})
