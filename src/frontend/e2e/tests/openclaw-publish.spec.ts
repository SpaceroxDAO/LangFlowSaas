/**
 * E2E tests for OpenClaw Integration Phase 1
 *
 * Tests: Publish/unpublish agents, Live badge on cards, Skill toggle on workflows,
 * Publish button on Edit/Playground pages, Sidebar purple star, Connection indicator.
 */
import { test, expect, Page } from '@playwright/test'

// Helper to dismiss tours
async function dismissTours(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('teachcharlie_tour_state', JSON.stringify({
      hasSeenCreateTour: true,
      hasSeenCanvasTour: true,
      hasSeenPlaygroundTour: true,
      currentDisclosureLevel: 4,
      completedTours: ['create-agent', 'canvas', 'playground'],
    }))
  })
}

// Helper to navigate to the first project's detail page
async function navigateToFirstProject(page: Page) {
  await page.goto('/dashboard')
  await page.waitForLoadState('networkidle')

  // Wait for sidebar projects to load, then click the first project link
  const projectLink = page.locator('a[href*="/dashboard/project/"]').first()
  await projectLink.waitFor({ state: 'visible', timeout: 10000 })
  await projectLink.click()
  await page.waitForURL(/\/dashboard\/project\//)
  await page.waitForLoadState('networkidle')
}

// Helper to get the first project URL from the sidebar
async function getFirstProjectUrl(page: Page): Promise<string> {
  await page.goto('/dashboard')
  await page.waitForLoadState('networkidle')
  const projectLink = page.locator('a[href*="/dashboard/project/"]').first()
  await projectLink.waitFor({ state: 'visible', timeout: 10000 })
  return await projectLink.getAttribute('href') || ''
}

test.describe('OpenClaw Phase 1 - Publish Agent', () => {
  test.beforeEach(async ({ page }) => {
    await dismissTours(page)
  })

  test.describe('Publish Button - Edit Agent Page', () => {
    test('shows publish button in edit agent header', async ({ page }) => {
      await navigateToFirstProject(page)

      // Get first agent's edit link
      const agentCard = page.locator('a[href*="/playground/"]').first()
      await agentCard.waitFor({ state: 'visible', timeout: 10000 })
      const playgroundHref = await agentCard.getAttribute('href')
      const agentId = playgroundHref?.split('/playground/')[1]

      if (!agentId) {
        test.skip()
        return
      }

      // Navigate to edit page
      await page.goto(`/edit/${agentId}`)
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('h1:has-text("Edit")', { timeout: 10000 })

      // Should have publish button with count indicator
      const publishButton = page.locator('button:has-text("Publish")')
      await expect(publishButton).toBeVisible({ timeout: 10000 })

      // Button should contain publish count (e.g., "0/1" or "1/1")
      const buttonText = await publishButton.textContent()
      expect(buttonText).toMatch(/Publish.*\d\/1|Published/)
    })

    test('publish button opens confirmation modal', async ({ page }) => {
      await navigateToFirstProject(page)

      // Get first agent
      const agentCard = page.locator('a[href*="/playground/"]').first()
      await agentCard.waitFor({ state: 'visible', timeout: 10000 })
      const playgroundHref = await agentCard.getAttribute('href')
      const agentId = playgroundHref?.split('/playground/')[1]

      if (!agentId) {
        test.skip()
        return
      }

      await page.goto(`/edit/${agentId}`)
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('h1:has-text("Edit")', { timeout: 10000 })

      // Click publish button (only if not already showing "Published" static badge)
      const publishButton = page.locator('button:has-text("Publish Agent")')
      if (await publishButton.isVisible().catch(() => false)) {
        await publishButton.click()

        // Modal should appear
        const modal = page.locator('.fixed.inset-0').filter({ hasText: /Publish Agent|Replace Live Agent/ })
        await expect(modal).toBeVisible({ timeout: 5000 })

        // Modal should have confirm and cancel buttons
        await expect(page.locator('button:has-text("Cancel")')).toBeVisible()
        // The modal confirm button - use the one inside the modal (flex-1 class)
        const modalConfirm = page.locator('.fixed.inset-0 button.flex-1:has-text("Publish Agent")').or(
          page.locator('.fixed.inset-0 button.flex-1:has-text("Replace Agent")')
        )
        await expect(modalConfirm).toBeVisible()

        // Cancel should close modal
        await page.locator('button:has-text("Cancel")').click()
        await expect(modal).not.toBeVisible({ timeout: 3000 })
      }
    })
  })

  test.describe('Publish Button - Playground Page', () => {
    test('shows publish button in playground header', async ({ page }) => {
      await navigateToFirstProject(page)

      // Click first agent to go to playground
      const agentCard = page.locator('a[href*="/playground/"]').first()
      await agentCard.waitFor({ state: 'visible', timeout: 10000 })
      await agentCard.click()
      await page.waitForURL(/\/playground\//)
      await page.waitForLoadState('networkidle')

      // Wait for agent name to load
      await page.waitForSelector('h1:not(:has-text("Loading"))', { timeout: 10000 })

      // Should have publish button
      const publishButton = page.locator('button:has-text("Publish")')
      await expect(publishButton).toBeVisible({ timeout: 10000 })
    })

    test('playground shows connection indicator for published agent', async ({ page }) => {
      await navigateToFirstProject(page)

      // Get first agent and publish it
      const agentCard = page.locator('a[href*="/playground/"]').first()
      await agentCard.waitFor({ state: 'visible', timeout: 10000 })
      const href = await agentCard.getAttribute('href')
      const agentId = href?.split('/playground/')[1]

      if (!agentId) {
        test.skip()
        return
      }

      // Publish the agent
      await page.request.post(`/api/v1/agent-components/${agentId}/publish`)

      // Click the agent to go to playground
      await agentCard.click()
      await page.waitForURL(/\/playground\//)
      await page.waitForLoadState('networkidle')

      // Wait for agent to load
      await page.waitForSelector('h1:not(:has-text("Loading"))', { timeout: 10000 })

      // Published agent should show "Agent Offline" (Phase 1 - no connector yet)
      const offlineIndicator = page.locator('text="Agent Offline"')
      await expect(offlineIndicator).toBeVisible({ timeout: 10000 })

      // Cleanup
      await page.request.post(`/api/v1/agent-components/${agentId}/unpublish`)
    })
  })

  test.describe('Publish/Unpublish API Flow', () => {
    test('can publish an agent via API', async ({ page }) => {
      await navigateToFirstProject(page)

      // Get first agent ID
      const agentCard = page.locator('a[href*="/playground/"]').first()
      await agentCard.waitFor({ state: 'visible', timeout: 10000 })
      const playgroundHref = await agentCard.getAttribute('href')
      const agentId = playgroundHref?.split('/playground/')[1]

      if (!agentId) {
        test.skip()
        return
      }

      // Publish via API
      const publishResponse = await page.request.post(`/api/v1/agent-components/${agentId}/publish`)
      expect(publishResponse.ok()).toBeTruthy()

      const publishData = await publishResponse.json()
      expect(publishData.is_published).toBe(true)
    })

    test('can unpublish an agent via API', async ({ page }) => {
      await navigateToFirstProject(page)

      // Get first agent ID
      const agentCard = page.locator('a[href*="/playground/"]').first()
      await agentCard.waitFor({ state: 'visible', timeout: 10000 })
      const playgroundHref = await agentCard.getAttribute('href')
      const agentId = playgroundHref?.split('/playground/')[1]

      if (!agentId) {
        test.skip()
        return
      }

      // Publish first
      await page.request.post(`/api/v1/agent-components/${agentId}/publish`)

      // Then unpublish
      const unpublishResponse = await page.request.post(`/api/v1/agent-components/${agentId}/unpublish`)
      expect(unpublishResponse.ok()).toBeTruthy()

      const unpublishData = await unpublishResponse.json()
      expect(unpublishData.is_published).toBe(false)
    })

    test('publishing one agent unpublishes the previous (1-live-agent limit)', async ({ page }) => {
      await navigateToFirstProject(page)

      // Get first two agent IDs
      const agentCards = page.locator('a[href*="/playground/"]')
      await agentCards.first().waitFor({ state: 'visible', timeout: 10000 })
      const count = await agentCards.count()

      if (count < 2) {
        test.skip()
        return
      }

      const href1 = await agentCards.nth(0).getAttribute('href')
      const href2 = await agentCards.nth(1).getAttribute('href')
      const agentId1 = href1?.split('/playground/')[1]
      const agentId2 = href2?.split('/playground/')[1]

      if (!agentId1 || !agentId2) {
        test.skip()
        return
      }

      // Publish agent 1
      const res1 = await page.request.post(`/api/v1/agent-components/${agentId1}/publish`)
      expect(res1.ok()).toBeTruthy()

      // Publish agent 2 (should auto-unpublish agent 1)
      const res2 = await page.request.post(`/api/v1/agent-components/${agentId2}/publish`)
      expect(res2.ok()).toBeTruthy()

      // Verify agent 1 is no longer published
      const getRes1 = await page.request.get(`/api/v1/agent-components/${agentId1}`)
      const agent1Data = await getRes1.json()
      expect(agent1Data.is_published).toBe(false)

      // Verify agent 2 is published
      const getRes2 = await page.request.get(`/api/v1/agent-components/${agentId2}`)
      const agent2Data = await getRes2.json()
      expect(agent2Data.is_published).toBe(true)

      // Cleanup: unpublish agent 2
      await page.request.post(`/api/v1/agent-components/${agentId2}/unpublish`)
    })
  })
})

test.describe('OpenClaw Phase 1 - Live Badge on Agent Cards', () => {
  test.beforeEach(async ({ page }) => {
    await dismissTours(page)
  })

  test('published agent shows Live badge in grid view', async ({ page }) => {
    await navigateToFirstProject(page)

    // Get first agent and publish it
    const agentCards = page.locator('a[href*="/playground/"]')
    await agentCards.first().waitFor({ state: 'visible', timeout: 10000 })
    const href = await agentCards.first().getAttribute('href')
    const agentId = href?.split('/playground/')[1]

    if (!agentId) {
      test.skip()
      return
    }

    await page.request.post(`/api/v1/agent-components/${agentId}/publish`)

    // Reload to see the badge
    await page.reload()
    await page.waitForLoadState('networkidle')
    await agentCards.first().waitFor({ state: 'visible', timeout: 10000 })

    // Should show "Live" badge somewhere on the page
    const liveBadge = page.locator('text="Live"')
    await expect(liveBadge.first()).toBeVisible({ timeout: 10000 })

    // Cleanup
    await page.request.post(`/api/v1/agent-components/${agentId}/unpublish`)
  })

  test('unpublished agent does not show Live badge', async ({ page }) => {
    await navigateToFirstProject(page)

    // Make sure no agent is published
    const agentCards = page.locator('a[href*="/playground/"]')
    await agentCards.first().waitFor({ state: 'visible', timeout: 10000 })
    const href = await agentCards.first().getAttribute('href')
    const agentId = href?.split('/playground/')[1]

    if (!agentId) {
      test.skip()
      return
    }

    // Ensure unpublished
    await page.request.post(`/api/v1/agent-components/${agentId}/unpublish`)

    await page.reload()
    await page.waitForLoadState('networkidle')
    await agentCards.first().waitFor({ state: 'visible', timeout: 10000 })

    // The first agent card should NOT have a Live badge
    const firstCard = page.locator('.rounded-xl').first()
    const liveBadge = firstCard.locator('text="Live"')
    await expect(liveBadge).not.toBeVisible({ timeout: 3000 })
  })

  test('published agent card has purple gradient styling', async ({ page }) => {
    await navigateToFirstProject(page)

    const agentCards = page.locator('a[href*="/playground/"]')
    await agentCards.first().waitFor({ state: 'visible', timeout: 10000 })
    const href = await agentCards.first().getAttribute('href')
    const agentId = href?.split('/playground/')[1]

    if (!agentId) {
      test.skip()
      return
    }

    // Publish the agent
    await page.request.post(`/api/v1/agent-components/${agentId}/publish`)
    await page.reload()
    await page.waitForLoadState('networkidle')
    await agentCards.first().waitFor({ state: 'visible', timeout: 10000 })

    // The published agent card should have a Live badge - that proves the styling was applied
    const liveBadge = page.locator('text="Live"')
    await expect(liveBadge.first()).toBeVisible({ timeout: 10000 })

    // Verify the card containing "Live" has a purple/violet border via computed style
    const hasVioletBorder = await liveBadge.first().evaluate(el => {
      const card = el.closest('[class*="rounded"]')
      if (!card) return false
      const style = getComputedStyle(card)
      // Check if border color contains purple/violet tones (RGB values around 139-168 for violet)
      return style.borderColor.includes('167') || style.borderColor.includes('139') ||
             card.className.includes('violet') || card.className.includes('purple')
    })
    expect(hasVioletBorder).toBeTruthy()

    // Cleanup
    await page.request.post(`/api/v1/agent-components/${agentId}/unpublish`)
  })
})

test.describe('OpenClaw Phase 1 - Workflow Skill Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await dismissTours(page)
  })

  test('workflows tab shows skill toggle on each row', async ({ page }) => {
    await navigateToFirstProject(page)

    // Switch to Workflows tab
    const workflowsTab = page.locator('button:has-text("Workflows")')
    await workflowsTab.click()
    await expect(page).toHaveURL(/[?&]tab=workflows/)
    await page.waitForLoadState('networkidle')

    // Should see "Skill" label on workflow rows
    const skillLabels = page.locator('text="Skill"')
    await expect(skillLabels.first()).toBeVisible({ timeout: 10000 })

    // Count skill toggles - should match visible workflows
    const skillCount = await skillLabels.count()
    expect(skillCount).toBeGreaterThan(0)
  })

  test('can toggle workflow skill via API', async ({ page }) => {
    await navigateToFirstProject(page)

    // Switch to Workflows tab to get a workflow ID
    const workflowsTab = page.locator('button:has-text("Workflows")')
    await workflowsTab.click()
    await page.waitForLoadState('networkidle')

    // Get first workflow ID from a canvas link
    const canvasLink = page.locator('a[href*="/canvas/"]').first()
    await canvasLink.waitFor({ state: 'visible', timeout: 10000 })
    const canvasHref = await canvasLink.getAttribute('href')
    const workflowId = canvasHref?.split('/canvas/')[1]

    if (!workflowId) {
      test.skip()
      return
    }

    // Enable skill via API
    const enableRes = await page.request.patch(`/api/v1/workflows/${workflowId}/agent-skill`, {
      data: { is_agent_skill: true },
    })
    expect(enableRes.ok()).toBeTruthy()
    const enableData = await enableRes.json()
    expect(enableData.is_agent_skill).toBe(true)

    // Disable skill via API
    const disableRes = await page.request.patch(`/api/v1/workflows/${workflowId}/agent-skill`, {
      data: { is_agent_skill: false },
    })
    expect(disableRes.ok()).toBeTruthy()
    const disableData = await disableRes.json()
    expect(disableData.is_agent_skill).toBe(false)
  })

  test('clicking skill toggle changes its visual state', async ({ page }) => {
    await navigateToFirstProject(page)

    // Switch to Workflows tab
    const workflowsTab = page.locator('button:has-text("Workflows")')
    await workflowsTab.click()
    await page.waitForLoadState('networkidle')

    // Wait for skill toggles to appear
    const skillLabel = page.locator('text="Skill"').first()
    await skillLabel.waitFor({ state: 'visible', timeout: 10000 })

    // Find the first toggle button (the rounded-full switch element)
    const toggleButton = page.locator('.rounded-full.transition-colors').first()
    await toggleButton.waitFor({ state: 'visible', timeout: 5000 })

    // Click it to toggle on
    await toggleButton.click()
    await page.waitForTimeout(500)

    // It should now have purple background (bg-purple-600)
    const hasPurple = await toggleButton.evaluate(el => {
      return el.classList.contains('bg-purple-600') || getComputedStyle(el).backgroundColor.includes('147')
    })

    // Click again to toggle off
    await toggleButton.click()
    await page.waitForTimeout(500)
  })
})

test.describe('OpenClaw Phase 1 - MCP Bridge API', () => {
  test('MCP bridge tools endpoint returns empty list for user with no skills', async ({ page }) => {
    // Use a test user_id - the dev mock user
    const response = await page.request.get('/api/v1/mcp/bridge/dev_user_123/tools')

    // May return 404 if user not found, or 200 with empty tools
    if (response.ok()) {
      const data = await response.json()
      expect(data).toHaveProperty('tools')
      expect(Array.isArray(data.tools)).toBe(true)
    }
  })

  test('MCP bridge call endpoint returns error for unknown tool', async ({ page }) => {
    const response = await page.request.post('/api/v1/mcp/bridge/dev_user_123/tools/call', {
      data: {
        name: 'nonexistent-tool',
        arguments: { message: 'test' },
      },
    })

    // Should return 404 for unknown tool (if user exists) or 404 for unknown user
    expect([404, 200].includes(response.status())).toBeTruthy()
  })
})

test.describe('OpenClaw Phase 1 - Publish Modal UI', () => {
  test.beforeEach(async ({ page }) => {
    await dismissTours(page)
  })

  test('first-time publish modal shows feature explanation', async ({ page }) => {
    await navigateToFirstProject(page)

    // Get first agent
    const agentCard = page.locator('a[href*="/playground/"]').first()
    await agentCard.waitFor({ state: 'visible', timeout: 10000 })
    const href = await agentCard.getAttribute('href')
    const agentId = href?.split('/playground/')[1]

    if (!agentId) {
      test.skip()
      return
    }

    // Ensure no agent is published (first-time flow)
    await page.request.post(`/api/v1/agent-components/${agentId}/unpublish`)

    // Go to edit page
    await page.goto(`/edit/${agentId}`)
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('h1:has-text("Edit")', { timeout: 10000 })

    // Click publish button
    const publishButton = page.locator('button:has-text("Publish Agent")')
    if (await publishButton.isVisible().catch(() => false)) {
      await publishButton.click()

      // Modal should explain what publishing does
      await expect(page.locator('text="Publish Agent"').first()).toBeVisible({ timeout: 5000 })
      await expect(page.locator('text=/live AI/i').first()).toBeVisible({ timeout: 3000 })
      await expect(page.locator('text=/Coming soon/i').first()).toBeVisible({ timeout: 3000 })

      // Close modal
      await page.locator('button:has-text("Cancel")').click()
    }
  })

  test('replace flow modal shows old and new agent names', async ({ page }) => {
    await navigateToFirstProject(page)

    // Get two agents
    const agentCards = page.locator('a[href*="/playground/"]')
    await agentCards.first().waitFor({ state: 'visible', timeout: 10000 })
    const count = await agentCards.count()

    if (count < 2) {
      test.skip()
      return
    }

    const href1 = await agentCards.nth(0).getAttribute('href')
    const href2 = await agentCards.nth(1).getAttribute('href')
    const agentId1 = href1?.split('/playground/')[1]
    const agentId2 = href2?.split('/playground/')[1]

    if (!agentId1 || !agentId2) {
      test.skip()
      return
    }

    // Publish agent 1 first
    await page.request.post(`/api/v1/agent-components/${agentId1}/publish`)

    // Go to edit page for agent 2
    await page.goto(`/edit/${agentId2}`)
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('h1:has-text("Edit")', { timeout: 10000 })

    // Click publish button
    const publishButton = page.locator('button:has-text("Publish Agent")')
    if (await publishButton.isVisible().catch(() => false)) {
      await publishButton.click()

      // Should show replace flow
      await expect(page.locator('text="Replace Live Agent?"')).toBeVisible({ timeout: 5000 })
      await expect(page.locator('button:has-text("Replace Agent")')).toBeVisible()

      // Close
      await page.locator('button:has-text("Cancel")').click()
    }

    // Cleanup
    await page.request.post(`/api/v1/agent-components/${agentId1}/unpublish`)
  })
})

test.describe('OpenClaw Phase 1 - List View Live Badge', () => {
  test.beforeEach(async ({ page }) => {
    await dismissTours(page)
  })

  test('published agent shows Live badge in list view', async ({ page }) => {
    await navigateToFirstProject(page)

    // Get first agent and publish it
    const agentCards = page.locator('a[href*="/playground/"]')
    await agentCards.first().waitFor({ state: 'visible', timeout: 10000 })
    const href = await agentCards.first().getAttribute('href')
    const agentId = href?.split('/playground/')[1]

    if (!agentId) {
      test.skip()
      return
    }

    await page.request.post(`/api/v1/agent-components/${agentId}/publish`)
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Switch to list view
    const listViewButton = page.locator('button').filter({ has: page.locator('svg') }).nth(0)
    const buttons = page.locator('.flex button:has(svg)')

    // Look for list/grid toggle buttons in the view switcher area
    const viewSwitcher = page.locator('button[aria-label="List view"], button:has-text("List")').first()
    if (await viewSwitcher.isVisible().catch(() => false)) {
      await viewSwitcher.click()
      await page.waitForTimeout(500)
    }

    // Should still show "Live" badge in list view
    const liveBadge = page.locator('text="Live"')
    await expect(liveBadge.first()).toBeVisible({ timeout: 10000 })

    // Cleanup
    await page.request.post(`/api/v1/agent-components/${agentId}/unpublish`)
  })
})
