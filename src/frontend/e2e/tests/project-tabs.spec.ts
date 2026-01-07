/**
 * E2E tests for the three-tab project architecture (Phase 9)
 * Tests navigation between Agents, Workflows, and MCP Servers tabs
 */
import { test, expect } from '@playwright/test'

// Helper to dismiss tours by setting localStorage
async function dismissTours(page: import('@playwright/test').Page) {
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

test.describe('Project Three-Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Dismiss tours before navigating
    await dismissTours(page)

    // Navigate to dashboard first
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Wait for projects to load and click on first project
    const projectLink = page.locator('[data-testid="project-item"], .project-item, a[href*="/dashboard/project/"]').first()
    await projectLink.waitFor({ state: 'visible', timeout: 10000 })
    await projectLink.click()

    // Wait for project detail page to load
    await page.waitForURL(/\/dashboard\/project\//)
    await page.waitForLoadState('networkidle')
  })

  test('should display all three tabs', async ({ page }) => {
    // Check for Agents tab
    const agentsTab = page.getByRole('tab', { name: /agents/i }).or(page.locator('button:has-text("Agents")'))
    await expect(agentsTab).toBeVisible()

    // Check for Workflows tab
    const workflowsTab = page.getByRole('tab', { name: /workflows/i }).or(page.locator('button:has-text("Workflows")'))
    await expect(workflowsTab).toBeVisible()

    // Check for MCP Servers tab
    const mcpTab = page.getByRole('tab', { name: /mcp/i }).or(page.locator('button:has-text("MCP")'))
    await expect(mcpTab).toBeVisible()
  })

  test('should switch between tabs', async ({ page }) => {
    // Click Workflows tab
    const workflowsTab = page.getByRole('tab', { name: /workflows/i }).or(page.locator('button:has-text("Workflows")'))
    await workflowsTab.click()

    // URL should update with tab parameter
    await expect(page).toHaveURL(/[?&]tab=workflows/)

    // Click MCP Servers tab
    const mcpTab = page.getByRole('tab', { name: /mcp/i }).or(page.locator('button:has-text("MCP")'))
    await mcpTab.click()

    // URL should update
    await expect(page).toHaveURL(/[?&]tab=mcp/)

    // Click Agents tab to go back
    const agentsTab = page.getByRole('tab', { name: /agents/i }).or(page.locator('button:has-text("Agents")'))
    await agentsTab.click()

    // URL should update
    await expect(page).toHaveURL(/[?&]tab=agents/)
  })

  test('should preserve tab state in URL', async ({ page }) => {
    // Navigate directly to workflows tab via URL
    const currentUrl = page.url()
    const baseUrl = currentUrl.split('?')[0]
    await page.goto(`${baseUrl}?tab=workflows`)
    await page.waitForLoadState('networkidle')

    // Workflows tab should be visible and the URL should contain workflows
    await expect(page).toHaveURL(/[?&]tab=workflows/)

    // The workflows content area should be visible
    const workflowsContent = page.locator('text=/workflows|create workflow/i').first()
    await expect(workflowsContent).toBeVisible({ timeout: 5000 })
  })

  test('should show empty state for empty tabs', async ({ page }) => {
    // Click on Workflows tab
    const workflowsTab = page.getByRole('tab', { name: /workflows/i }).or(page.locator('button:has-text("Workflows")'))
    await workflowsTab.click()

    // Wait for tab content to load
    await page.waitForTimeout(500)

    // Either show empty state or workflow list - check both possibilities
    const emptyState = page.locator('text=/No workflows in this project|Create your first workflow/i')
    const workflowRows = page.locator('[class*="workflow"], [class*="GitBranch"]')
    const searchInput = page.locator('input[placeholder*="Search workflows"]')

    // Check if we're on the workflows tab by looking for search input or empty state
    const hasSearchInput = await searchInput.isVisible().catch(() => false)
    const hasEmptyState = await emptyState.first().isVisible().catch(() => false)
    const hasWorkflows = await workflowRows.first().isVisible().catch(() => false)

    // At least one of these should be true (we're on the workflows tab)
    expect(hasSearchInput || hasEmptyState || hasWorkflows).toBeTruthy()
  })
})

test.describe('Create Agent Flow with New Tables', () => {
  test('should create agent and navigate to workflow playground', async ({ page }) => {
    // Dismiss tours before navigating
    await dismissTours(page)

    // Navigate to create agent page
    await page.goto('/create')
    await page.waitForLoadState('networkidle')

    // Also try to dismiss any active driver.js tour overlay
    const tourOverlay = page.locator('.driver-overlay')
    if (await tourOverlay.isVisible().catch(() => false)) {
      // Press Escape to dismiss the tour
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)
    }

    // Step 1: Fill in Identity
    const nameInput = page.locator('input[type="text"]').first()
    await nameInput.waitFor({ state: 'visible', timeout: 5000 })
    await nameInput.fill('E2E Test Agent')

    // Fill description textarea (second one on the page)
    const textareas = page.locator('textarea')
    const descTextarea = textareas.first()
    await descTextarea.fill('A helpful assistant for testing the new three-tab architecture')

    // Click Next
    await page.click('button:has-text("Next")')
    await page.waitForTimeout(500)

    // Step 2: Fill in Instructions
    const rulesTextarea = page.locator('textarea').first()
    await rulesTextarea.fill('You are a test agent. Always be helpful and confirm you are working correctly.')

    // Click Next
    await page.click('button:has-text("Next")')
    await page.waitForTimeout(500)

    // Step 3: Select tools (optional) and Finish
    await page.click('button:has-text("Finish")')

    // Wait for navigation to workflow playground
    await page.waitForURL(/\/playground\/workflow\//, { timeout: 30000 })

    // Should be on workflow playground
    expect(page.url()).toContain('/playground/workflow/')

    // Chat interface should be visible
    await expect(page.locator('textarea[placeholder*="message"]').or(page.locator('[data-testid="chat-input"]'))).toBeVisible()
  })
})
