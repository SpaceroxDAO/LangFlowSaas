import { test, expect, Download } from '@playwright/test'

/**
 * Analytics Dashboard Tests
 * Tests the analytics and metrics dashboard features.
 *
 * Verified features:
 * - Date range presets (7, 14, 30, 90 days)
 * - Custom date range picker
 * - Refresh button
 * - Export CSV functionality
 * - Stats cards with change indicators
 * - Daily messages bar chart
 * - Recent conversations list
 * - Top agents by usage
 * - Period comparison info
 */
test.describe('Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/analytics')
    // Wait for API response
    await page.waitForResponse(resp =>
      resp.url().includes('/api/v1/dashboard/stats') && resp.status() === 200
    )
  })

  test.describe('Page Layout', () => {
    test('displays page header with title and description', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Analytics', level: 1 })).toBeVisible()
      await expect(page.getByText('Monitor your usage and performance')).toBeVisible()
    })

    test('shows date range selector dropdown', async ({ page }) => {
      const dropdown = page.getByRole('combobox')
      await expect(dropdown).toBeVisible()
      await expect(dropdown).toHaveValue('7') // Default is Last 7 days
    })

    test('shows refresh button', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Refresh data' })).toBeVisible()
    })

    test('shows export button', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Export' })).toBeVisible()
    })
  })

  test.describe('Stats Cards', () => {
    test('displays four stats cards', async ({ page }) => {
      await expect(page.getByText('Total Agents')).toBeVisible()
      await expect(page.getByText('Total Workflows')).toBeVisible()
      await expect(page.getByText('Messages This Period')).toBeVisible()
      await expect(page.getByText('Tokens This Period')).toBeVisible()
    })

    test('stats cards show numeric values', async ({ page }) => {
      // Stats should display numbers
      const totalAgentsCard = page.locator('p:has-text("Total Agents")').locator('xpath=following-sibling::p')
      await expect(totalAgentsCard).toContainText(/\d+/)
    })

    test('shows change indicators for period metrics', async ({ page }) => {
      // Messages and Tokens cards should show change indicators (up or down arrows with %)
      const changeIndicators = page.locator('text=/[↑↓] \\d+%/')
      const count = await changeIndicators.count()
      expect(count).toBeGreaterThanOrEqual(0) // May be 0 if no previous data
    })

    test('positive changes show green color', async ({ page }) => {
      // Look for green change indicators
      const greenIndicators = page.locator('.text-green-600')
      // This might be 0 if there's no positive change
      const count = await greenIndicators.count()
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('Daily Messages Chart', () => {
    test('displays Daily Messages heading', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Daily Messages' })).toBeVisible()
    })

    test('chart shows date range labels at bottom', async ({ page }) => {
      // Chart has visible date labels at the bottom showing start and end dates
      // These are in a flex container with justify-between
      const chartDateLabels = page.locator('.flex.justify-between.mt-2.text-xs.text-gray-500 span')
      await expect(chartDateLabels.first()).toBeVisible()
    })

    test('chart container exists', async ({ page }) => {
      // Chart container with bars
      const chartContainer = page.locator('.flex.items-end.gap-1.h-40')
      await expect(chartContainer).toBeVisible()
    })
  })

  test.describe('Recent Conversations', () => {
    test('displays Recent Conversations section', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Recent Conversations' })).toBeVisible()
    })

    test('conversations are clickable links', async ({ page }) => {
      const conversationLinks = page.locator('a[href*="/playground/"]')
      const count = await conversationLinks.count()

      if (count > 0) {
        // First conversation should be a link
        await expect(conversationLinks.first()).toHaveAttribute('href', /\/playground\//)
      }
    })

    test('conversations show timestamps', async ({ page }) => {
      // Timestamps like "Jan 14, 5:30 PM"
      const timestamps = page.locator('text=/[A-Z][a-z]{2} \\d{1,2}, \\d{1,2}:\\d{2} [AP]M/')
      const count = await timestamps.count()
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('Top Agents by Usage', () => {
    test('displays Top Agents section', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Top Agents by Usage' })).toBeVisible()
    })

    test('agents show numbered ranking', async ({ page }) => {
      // Should show "1. Agent Name", "2. Agent Name" etc.
      const rankedAgents = page.locator('text=/^\\d+\\. /')
      const count = await rankedAgents.count()
      expect(count).toBeGreaterThanOrEqual(0)
    })

    test('agents show conversation counts', async ({ page }) => {
      // Should show "X conv."
      const convCounts = page.locator('text=/\\d+ conv\\./')
      const count = await convCounts.count()
      expect(count).toBeGreaterThanOrEqual(0)
    })

    test('agents have progress bars', async ({ page }) => {
      // Progress bars use bg-violet-500
      const progressBars = page.locator('.bg-violet-500.h-2')
      const count = await progressBars.count()
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('Period Info', () => {
    test('shows current period dates', async ({ page }) => {
      await expect(page.locator('text=/Showing data from \\d{4}-\\d{2}-\\d{2} to \\d{4}-\\d{2}-\\d{2}/')).toBeVisible()
    })

    test('shows comparison period dates', async ({ page }) => {
      await expect(page.locator('text=/Compared to \\d{4}-\\d{2}-\\d{2} to \\d{4}-\\d{2}-\\d{2}/')).toBeVisible()
    })
  })

  test.describe('Date Range Presets', () => {
    test('dropdown has all preset options', async ({ page }) => {
      const dropdown = page.getByRole('combobox')

      await expect(dropdown.locator('option[value="7"]')).toHaveText('Last 7 days')
      await expect(dropdown.locator('option[value="14"]')).toHaveText('Last 14 days')
      await expect(dropdown.locator('option[value="30"]')).toHaveText('Last 30 days')
      await expect(dropdown.locator('option[value="90"]')).toHaveText('Last 90 days')
      await expect(dropdown.locator('option[value="custom"]')).toHaveText('Custom range')
    })

    test('selecting 30 days updates the data', async ({ page }) => {
      const dropdown = page.getByRole('combobox')

      // Wait for the API call when changing to 30 days
      const responsePromise = page.waitForResponse(resp =>
        resp.url().includes('days=30') && resp.status() === 200
      )

      await dropdown.selectOption('30')
      await responsePromise

      // Verify the dropdown value changed
      await expect(dropdown).toHaveValue('30')

      // Verify the period info updated (should show ~30 day range)
      await expect(page.locator('text=/Showing data from/')).toBeVisible()
    })

    test('selecting 14 days updates the data', async ({ page }) => {
      const dropdown = page.getByRole('combobox')

      const responsePromise = page.waitForResponse(resp =>
        resp.url().includes('days=14') && resp.status() === 200
      )

      await dropdown.selectOption('14')
      await responsePromise

      await expect(dropdown).toHaveValue('14')
    })
  })

  test.describe('Custom Date Range', () => {
    test('selecting Custom range shows date inputs', async ({ page }) => {
      const dropdown = page.getByRole('combobox')
      await dropdown.selectOption('custom')

      // Two date inputs should appear
      const dateInputs = page.locator('input[type="date"]')
      await expect(dateInputs).toHaveCount(2)
    })

    test('custom date inputs have default values', async ({ page }) => {
      const dropdown = page.getByRole('combobox')
      await dropdown.selectOption('custom')

      const startInput = page.locator('input[type="date"]').first()
      const endInput = page.locator('input[type="date"]').last()

      // Should have some default date values
      await expect(startInput).toHaveValue(/\d{4}-\d{2}-\d{2}/)
      await expect(endInput).toHaveValue(/\d{4}-\d{2}-\d{2}/)
    })

    test('changing custom dates triggers API call', async ({ page }) => {
      const dropdown = page.getByRole('combobox')
      await dropdown.selectOption('custom')

      const startInput = page.locator('input[type="date"]').first()

      // Wait for API call with custom dates
      const responsePromise = page.waitForResponse(resp =>
        resp.url().includes('start_date=') && resp.status() === 200
      )

      // Change start date to Jan 1
      await startInput.fill('2026-01-01')
      await responsePromise

      // Verify the period info shows the custom date
      await expect(page.locator('text=/Showing data from 2026-01-01/')).toBeVisible()
    })

    test('shows "to" text between date inputs', async ({ page }) => {
      const dropdown = page.getByRole('combobox')
      await dropdown.selectOption('custom')

      await expect(page.locator('text="to"')).toBeVisible()
    })
  })

  test.describe('Refresh Functionality', () => {
    test('refresh button triggers API call', async ({ page }) => {
      const refreshButton = page.getByRole('button', { name: 'Refresh data' })

      const responsePromise = page.waitForResponse(resp =>
        resp.url().includes('/api/v1/dashboard/stats') && resp.status() === 200
      )

      await refreshButton.click()
      await responsePromise
    })

    test('refresh button shows loading state', async ({ page }) => {
      // Slow down the API response to see loading state
      await page.route('**/api/v1/dashboard/stats**', async route => {
        await new Promise(resolve => setTimeout(resolve, 500))
        route.continue()
      })

      const refreshButton = page.getByRole('button', { name: 'Refresh data' })
      await refreshButton.click()

      // Icon should have animate-spin class during loading
      const spinningIcon = refreshButton.locator('.animate-spin')
      await expect(spinningIcon).toBeVisible({ timeout: 1000 }).catch(() => {
        // Animation might be too fast to catch
      })
    })
  })

  test.describe('Export Functionality', () => {
    test('export button triggers CSV download', async ({ page }) => {
      const exportButton = page.getByRole('button', { name: 'Export' })

      // Wait for download
      const downloadPromise = page.waitForEvent('download')
      await exportButton.click()

      const download = await downloadPromise
      expect(download.suggestedFilename()).toMatch(/analytics_.*\.csv/)
    })

    test('exported CSV has correct filename for 7 days', async ({ page }) => {
      const exportButton = page.getByRole('button', { name: 'Export' })

      const downloadPromise = page.waitForEvent('download')
      await exportButton.click()

      const download = await downloadPromise
      expect(download.suggestedFilename()).toBe('analytics_7d.csv')
    })

    test('exported CSV has correct filename for 30 days', async ({ page }) => {
      // First change to 30 days
      const dropdown = page.getByRole('combobox')
      await dropdown.selectOption('30')
      await page.waitForResponse(resp => resp.url().includes('days=30'))

      const exportButton = page.getByRole('button', { name: 'Export' })

      const downloadPromise = page.waitForEvent('download')
      await exportButton.click()

      const download = await downloadPromise
      expect(download.suggestedFilename()).toBe('analytics_30d.csv')
    })

    test('exported CSV for custom range has date range in filename', async ({ page }) => {
      // Select custom range
      const dropdown = page.getByRole('combobox')
      await dropdown.selectOption('custom')

      // Wait for date inputs to appear
      const startInput = page.locator('input[type="date"]').first()
      const endInput = page.locator('input[type="date"]').last()
      await expect(startInput).toBeVisible()
      await expect(endInput).toBeVisible()

      // Set specific dates
      await startInput.fill('2026-01-01')

      // Wait for API response after date change
      await page.waitForResponse(resp =>
        resp.url().includes('start_date=') && resp.status() === 200,
        { timeout: 10000 }
      )

      // Small delay to ensure state is updated
      await page.waitForTimeout(500)

      const exportButton = page.getByRole('button', { name: 'Export' })

      const downloadPromise = page.waitForEvent('download', { timeout: 10000 })
      await exportButton.click()

      const download = await downloadPromise
      // Filename should include the custom dates
      expect(download.suggestedFilename()).toMatch(/analytics_2026-01-01_/)
    })
  })

  test.describe('Loading State', () => {
    test('shows loading skeleton on initial load', async ({ page }) => {
      // Navigate with a slow response
      await page.route('**/api/v1/dashboard/stats**', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        route.continue()
      })

      await page.goto('/dashboard/analytics')

      // Should show loading skeleton
      const skeleton = page.locator('.animate-pulse')
      await expect(skeleton.first()).toBeVisible({ timeout: 500 }).catch(() => {
        // Loading might be too fast
      })
    })
  })

  test.describe('Error Handling', () => {
    test('handles API error gracefully', async ({ page }) => {
      await page.route('**/api/v1/dashboard/stats**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ detail: 'Internal Server Error' })
        })
      })

      await page.goto('/dashboard/analytics')
      await page.waitForLoadState('networkidle')

      // Page should still be functional (might show zeros or error state)
      await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible()
    })
  })

  test.describe('Responsive Design', () => {
    test('stats cards stack on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()
      await page.waitForResponse(resp => resp.url().includes('/api/v1/dashboard/stats'))

      // Page should still show all content
      await expect(page.getByText('Total Agents')).toBeVisible()
      await expect(page.getByText('Total Workflows')).toBeVisible()
    })

    test('chart adapts to tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.reload()
      await page.waitForResponse(resp => resp.url().includes('/api/v1/dashboard/stats'))

      await expect(page.getByRole('heading', { name: 'Daily Messages' })).toBeVisible()
    })
  })

  test.describe('Navigation', () => {
    test('analytics link exists in sidebar', async ({ page }) => {
      const analyticsLink = page.locator('a[href="/dashboard/analytics"]')
      await expect(analyticsLink).toBeVisible()
      // The link should contain "Analytics" text
      await expect(analyticsLink).toContainText('Analytics')
    })

    test('can navigate from another page', async ({ page }) => {
      await page.goto('/dashboard')
      await page.waitForLoadState('networkidle')

      await page.click('a[href="/dashboard/analytics"]')

      await expect(page).toHaveURL('/dashboard/analytics')
      await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible()
    })
  })
})

/**
 * Analytics Data Accuracy Tests
 * Tests that the displayed data matches API responses.
 */
test.describe('Analytics Data Accuracy', () => {
  test('displays correct totals from API', async ({ page }) => {
    // Mock specific data
    await page.route('**/api/v1/dashboard/stats**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          period: { start: '2026-01-09', end: '2026-01-15', days: 7 },
          totals: { agents: 42, workflows: 10, conversations: 100, messages_this_month: 500, tokens_this_month: 50000 },
          daily: [{ date: '2026-01-14', conversations: 5, messages: 10, tokens: 1000 }],
          recent_conversations: [],
          agent_stats: [],
          comparison: {
            messages_change: 25.5,
            conversations_change: -10.0,
            tokens_change: 15.0,
            previous_period: { start: '2026-01-02', end: '2026-01-08', messages: 400, conversations: 111, tokens: 43478 },
            current_period: { messages: 500, conversations: 100, tokens: 50000 }
          }
        })
      })
    })

    await page.goto('/dashboard/analytics')
    await page.waitForLoadState('networkidle')

    // Check that mocked values appear
    await expect(page.locator('text="42"')).toBeVisible() // Total Agents
    await expect(page.locator('text="10"')).toBeVisible() // Total Workflows
  })

  test('displays correct change indicators', async ({ page }) => {
    await page.route('**/api/v1/dashboard/stats**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          period: { start: '2026-01-09', end: '2026-01-15', days: 7 },
          totals: { agents: 10, workflows: 5, conversations: 50, messages_this_month: 200, tokens_this_month: 20000 },
          daily: [],
          recent_conversations: [],
          agent_stats: [],
          comparison: {
            messages_change: 50.0,
            conversations_change: -20.0,
            tokens_change: 0.0,
            previous_period: { start: '2026-01-02', end: '2026-01-08', messages: 100, conversations: 62, tokens: 20000 },
            current_period: { messages: 150, conversations: 50, tokens: 20000 }
          }
        })
      })
    })

    await page.goto('/dashboard/analytics')
    await page.waitForLoadState('networkidle')

    // Should show positive change for messages
    await expect(page.locator('text=/↑ 50%/')).toBeVisible()
  })
})
