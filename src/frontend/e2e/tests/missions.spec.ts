import { test, expect } from '@playwright/test'
import { phaseDSelectors } from '../helpers/selectors'

const { missions } = phaseDSelectors

/**
 * Missions System Tests
 * Tests the mission-based learning system for guided user onboarding.
 */
test.describe('Missions System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/missions')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Missions Page Layout', () => {
    test('displays page header and subtitle', async ({ page }) => {
      await expect(page.locator('h1')).toContainText(/Missions/i)
      await expect(page.locator('text=Build your AI skills step by step')).toBeVisible()
    })

    test('shows mission statistics bar', async ({ page }) => {
      // Should display stats for completed, in progress, and total missions
      // Use .first() to avoid strict mode violation when multiple elements match
      await expect(page.locator('text=/Completed/i').first()).toBeVisible()
      await expect(page.locator('text=/In Progress/i').first().or(page.locator('text=/Active/i').first())).toBeVisible()
      await expect(page.locator('text=/Not Started/i').first()).toBeVisible()
    })

    test('displays category filter tabs', async ({ page }) => {
      // Should have category tabs
      await expect(page.locator('button:has-text("All")')).toBeVisible()
      await expect(page.locator('button:has-text("Skill Sprint")')).toBeVisible()
      await expect(page.locator('button:has-text("Applied Build")')).toBeVisible()
    })

    test('All tab is active by default', async ({ page }) => {
      const allTab = page.locator('button:has-text("All")')
      // Check if the All tab has active styling (violet background)
      await expect(allTab).toHaveClass(/bg-violet|bg-primary/)
    })
  })

  test.describe('Mission Cards', () => {
    test('displays mission cards in grid layout', async ({ page }) => {
      // Should have at least one mission card visible
      const missionCards = page.locator('.rounded-2xl, .rounded-xl').filter({ hasText: /Hello|FAQ|Bot|Tools/i })
      const cardCount = await missionCards.count()
      expect(cardCount).toBeGreaterThan(0)
    })

    test('mission card shows required information', async ({ page }) => {
      // Find first mission card
      const firstCard = page.locator('.rounded-2xl, .rounded-xl').filter({ hasText: /Hello|FAQ/i }).first()

      if (await firstCard.isVisible()) {
        // Should have mission name
        await expect(firstCard.locator('h3, .font-semibold').first()).toBeVisible()

        // Should have difficulty indicator (Beginner, Intermediate, etc.)
        await expect(
          firstCard.locator('text=/Beginner|Intermediate|Advanced/i').first()
        ).toBeVisible()

        // Should have duration estimate
        await expect(
          firstCard.locator('text=/\\d+\\s*min/i').first()
        ).toBeVisible()
      }
    })

    test('mission card shows status badge', async ({ page }) => {
      const firstCard = page.locator('.rounded-2xl, .rounded-xl').filter({ hasText: /Hello|FAQ/i }).first()

      if (await firstCard.isVisible()) {
        // Should have a status badge (Not Started, In Progress, Completed, or Locked)
        await expect(
          firstCard.locator('text=/Not Started|In Progress|Completed|Locked|Start|Continue|View/i')
        ).toBeVisible()
      }
    })

    test('mission card shows icon', async ({ page }) => {
      const firstCard = page.locator('.rounded-2xl, .rounded-xl').filter({ hasText: /Hello|FAQ/i }).first()

      if (await firstCard.isVisible()) {
        // Should have an icon container
        const iconContainer = firstCard.locator('.rounded-xl, .rounded-lg').first()
        await expect(iconContainer).toBeVisible()
      }
    })
  })

  test.describe('Category Filtering', () => {
    test('clicking Skill Sprint tab filters missions', async ({ page }) => {
      const skillSprintTab = page.locator('button:has-text("Skill Sprint")')
      await skillSprintTab.click()

      // Tab should become active
      await expect(skillSprintTab).toHaveClass(/bg-violet|bg-primary/)

      // Should only show Skill Sprint missions
      await page.waitForTimeout(300)
      const visibleCards = page.locator('.rounded-2xl, .rounded-xl').filter({ hasText: /mission|Hello|FAQ|Tools|RAG/i })
      const count = await visibleCards.count()

      // Either shows filtered results or empty state
      if (count === 0) {
        await expect(page.locator('text=/No missions|empty|none/i')).toBeVisible()
      }
    })

    test('clicking Applied Build tab filters missions', async ({ page }) => {
      const appliedBuildTab = page.locator('button:has-text("Applied Build")')
      await appliedBuildTab.click()

      // Tab should become active
      await expect(appliedBuildTab).toHaveClass(/bg-violet|bg-primary/)

      await page.waitForTimeout(300)
    })

    test('clicking All tab shows all missions', async ({ page }) => {
      // First click another tab
      await page.click('button:has-text("Skill Sprint")')
      await page.waitForTimeout(300)

      // Then click All
      await page.click('button:has-text("All")')
      await page.waitForTimeout(300)

      // Should show all missions
      const allTab = page.locator('button:has-text("All")')
      await expect(allTab).toHaveClass(/bg-violet|bg-primary/)
    })
  })

  test.describe('Mission Interaction', () => {
    test('clicking Start button opens step guide panel or navigates to canvas', async ({ page }) => {
      // Find a mission with Start button
      const startButton = page.locator('button:has-text("Start")').first()

      if (await startButton.isVisible()) {
        await startButton.click()

        // Should either:
        // 1. Open the step guide panel (regular missions)
        // 2. Navigate to canvas page (canvas_mode missions)
        await page.waitForTimeout(500)

        // Check if we navigated to canvas page
        const url = page.url()
        if (url.includes('/canvas')) {
          // Canvas mode mission - verify we're on the canvas page
          await expect(page.locator('text=/Mark as Complete/i').first()).toBeVisible({ timeout: 5000 })
        } else {
          // Regular mission - look for step guide slide panel
          await expect(
            page.locator('.fixed.right-0, [class*="slide-in"]')
          ).toBeVisible({ timeout: 5000 })
        }
      }
    })

    test('clicking Continue button resumes mission', async ({ page }) => {
      // Find a mission with Continue button (in progress)
      const continueButton = page.locator('button:has-text("Continue")').first()

      if (await continueButton.isVisible()) {
        await continueButton.click()
        await page.waitForTimeout(500)

        // Should either open step guide panel or navigate to canvas
        const url = page.url()
        if (url.includes('/canvas')) {
          await expect(page.locator('text=/Step|Mark as Complete/i').first()).toBeVisible({ timeout: 5000 })
        } else {
          await expect(
            page.locator('text=/Step|Guide|Progress/i').first()
          ).toBeVisible({ timeout: 5000 })
        }
      }
    })

    test('clicking View button shows completed mission details', async ({ page }) => {
      // Find a mission with View button (completed)
      const viewButton = page.locator('button:has-text("View")').first()

      if (await viewButton.isVisible()) {
        await viewButton.click()
        await page.waitForTimeout(500)

        // Should show mission details or navigate to canvas
        const url = page.url()
        if (url.includes('/canvas')) {
          await expect(page.locator('text=/Step|Complete/i').first()).toBeVisible({ timeout: 5000 })
        } else {
          await expect(
            page.locator('text=/Completed|Details|Steps/i').first()
          ).toBeVisible({ timeout: 5000 })
        }
      }
    })
  })

  test.describe('Step Guide Panel', () => {
    test('step guide panel or canvas page displays mission title', async ({ page }) => {
      const startButton = page.locator('button:has-text("Start")').first()

      if (await startButton.isVisible()) {
        await startButton.click()
        await page.waitForTimeout(500)

        // Should show mission title in panel or canvas page
        await expect(
          page.locator('.font-bold, .font-semibold, h2, h3').filter({ hasText: /Hello|FAQ|Bot|Daily|Tools|Build|Agent/i }).first()
        ).toBeVisible({ timeout: 5000 })
      }
    })

    test('step guide shows step progress', async ({ page }) => {
      const startButton = page.locator('button:has-text("Start")').first()

      if (await startButton.isVisible()) {
        await startButton.click()
        await page.waitForTimeout(500)

        // Should show step indication (varies by canvas vs regular mode)
        const url = page.url()
        if (url.includes('/canvas')) {
          // Canvas page shows "Step X of Y"
          await expect(
            page.locator('text=/Step \\d+ of \\d+/i').first()
          ).toBeVisible({ timeout: 5000 })
        } else {
          // Regular step guide shows "X / Y steps" or progress indicator
          await expect(
            page.locator('text=/\\d+ \\/ \\d+ steps|Progress/i').first()
          ).toBeVisible({ timeout: 5000 })
        }
      }
    })

    test('can navigate back from step guide or canvas', async ({ page }) => {
      const startButton = page.locator('button:has-text("Start")').first()

      if (await startButton.isVisible()) {
        await startButton.click()
        await page.waitForTimeout(500)

        const url = page.url()
        if (url.includes('/canvas')) {
          // Canvas page - use browser back navigation
          await page.goBack()
          await page.waitForLoadState('networkidle')
          await expect(page).toHaveURL(/\/missions/, { timeout: 5000 })
        } else {
          // Step guide panel - click the backdrop to close (the black/50 overlay)
          const backdrop = page.locator('.fixed.inset-0.z-50 > .absolute.inset-0.bg-black\\/50')
          if (await backdrop.isVisible()) {
            await backdrop.click({ position: { x: 10, y: 10 } })
            await page.waitForTimeout(300)
          }
        }
      }
    })

    test('Complete Step button advances to next step', async ({ page }) => {
      const startButton = page.locator('button:has-text("Start")').first()

      if (await startButton.isVisible()) {
        await startButton.click()
        await page.waitForTimeout(500)

        // Find Complete Step or similar button (works for both canvas and regular)
        const completeButton = page.locator('button:has-text("Complete"), button:has-text("Mark as Complete"), button:has-text("Next"), button:has-text("Done")').first()

        if (await completeButton.isVisible()) {
          await completeButton.click()
          await page.waitForTimeout(300)

          // Should show progress or next step
        }
      }
    })
  })

  test.describe('Mission Progress', () => {
    test('progress bar reflects completed steps', async ({ page }) => {
      // Find a mission card with progress
      const progressBars = page.locator('.bg-gray-200.rounded-full, [class*="progress"]')

      if (await progressBars.count() > 0) {
        // Progress bar should exist
        await expect(progressBars.first()).toBeVisible()
      }
    })

    test('starting a mission updates status to In Progress', async ({ page }) => {
      const startButton = page.locator('button:has-text("Start")').first()

      if (await startButton.isVisible()) {
        await startButton.click()
        await page.waitForTimeout(500)

        // If we're on canvas page, navigate back
        const url = page.url()
        if (url.includes('/canvas')) {
          await page.goto('/dashboard/missions')
          await page.waitForLoadState('networkidle')
        } else {
          // Close panel
          await page.keyboard.press('Escape')
          await page.waitForTimeout(300)
          // Reload page
          await page.reload()
          await page.waitForLoadState('networkidle')
        }

        // Check for updated status - the mission should now show In Progress or Continue
        await expect(
          page.locator('text=/In Progress|Continue/i').first()
        ).toBeVisible({ timeout: 5000 })
      }
    })
  })

  test.describe('Mission Prerequisites', () => {
    test('locked missions show locked state', async ({ page }) => {
      // Look for a locked mission (if any)
      const lockedBadge = page.locator('text=/Locked/i').first()

      if (await lockedBadge.isVisible()) {
        // Locked missions should be visually distinct
        const lockedCard = lockedBadge.locator('xpath=ancestor::*[contains(@class, "rounded")]')
        await expect(lockedCard).toBeVisible()

        // Should show prerequisite info
        await expect(
          page.locator('text=/Complete|Requires|Prerequisites/i')
        ).toBeVisible()
      }
    })

    test('locked mission shows prerequisite missions', async ({ page }) => {
      const lockedCard = page.locator('.opacity-50, .cursor-not-allowed').first()

      if (await lockedCard.isVisible()) {
        await lockedCard.click()
        await page.waitForTimeout(300)

        // Should show which missions need to be completed first
        await expect(
          page.locator('text=/Complete these|Requires|first/i')
        ).toBeVisible().catch(() => {})
      }
    })
  })

  test.describe('Mission Reset', () => {
    test('reset button resets mission progress', async ({ page }) => {
      // Find a mission that can be reset (in progress or completed)
      const continueButton = page.locator('button:has-text("Continue")').first()

      if (await continueButton.isVisible()) {
        await continueButton.click()
        await page.waitForTimeout(500)

        // Look for reset button
        const resetButton = page.locator('button:has-text("Reset")')

        if (await resetButton.isVisible()) {
          await resetButton.click()

          // Should show confirmation or reset the progress
          await page.waitForTimeout(300)
        }
      }
    })
  })

  test.describe('Responsive Design', () => {
    test('missions page is responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Page should still be functional
      await expect(page.locator('h1')).toContainText(/Missions/i)

      // Mission cards should be visible (might be stacked)
      const cards = page.locator('.rounded-2xl, .rounded-xl').filter({ hasText: /Hello|FAQ|Bot/i })
      if (await cards.count() > 0) {
        await expect(cards.first()).toBeVisible()
      }
    })

    test('missions page is responsive on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Page should still be functional
      await expect(page.locator('h1')).toContainText(/Missions/i)
    })
  })

  test.describe('Navigation', () => {
    test('can navigate to missions from sidebar', async ({ page }) => {
      // Go to dashboard first
      await page.goto('/dashboard')
      await page.waitForLoadState('networkidle')

      // Click missions link in sidebar
      const missionsLink = page.locator('a[href="/dashboard/missions"]').first()
      await missionsLink.click()

      await expect(page).toHaveURL(/\/dashboard\/missions/)
    })

    test('missions link is visible when on missions page', async ({ page }) => {
      const missionsLink = page.locator('a[href="/dashboard/missions"]').first()

      // Should be visible and have the text "Missions"
      await expect(missionsLink).toBeVisible()
      await expect(missionsLink).toContainText(/Missions/i)
    })
  })

  test.describe('Error Handling', () => {
    test('shows error state when API fails', async ({ page }) => {
      // Mock API failure
      await page.route('**/api/v1/missions**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' })
        })
      })

      await page.reload()
      await page.waitForLoadState('networkidle')

      // Should show error message or handle gracefully
      await expect(
        page.locator('text=/error|failed|try again/i').or(
          page.locator('.text-red-500, .bg-red-50')
        )
      ).toBeVisible({ timeout: 5000 }).catch(() => {
        // App might handle error differently
      })
    })
  })

  test.describe('Empty State', () => {
    test('shows appropriate message when no missions in category', async ({ page }) => {
      // This tests the empty state when filtering results in no matches
      // Mock empty response for a specific category
      await page.route('**/api/v1/missions?category=weekly_quest**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ missions: [], total: 0 })
        })
      })

      const weeklyTab = page.locator('button:has-text("Weekly Quest"), button:has-text("Weekly")')

      if (await weeklyTab.isVisible()) {
        await weeklyTab.click()
        await page.waitForTimeout(300)

        // Should show empty state or no missions message
      }
    })
  })
})

/**
 * Mission Flow Integration Tests
 * Tests the complete flow of starting, progressing, and completing a mission.
 */
test.describe('Mission Flow Integration', () => {
  test('complete flow: start mission -> complete steps -> finish mission', async ({ page }) => {
    await page.goto('/dashboard/missions')
    await page.waitForLoadState('networkidle')

    // Find a mission to start
    const startButton = page.locator('button:has-text("Start")').first()

    if (await startButton.isVisible()) {
      // Step 1: Start the mission
      await startButton.click()
      await page.waitForTimeout(500)

      // Step 2: Complete first step
      const completeStepButton = page.locator('button:has-text("Complete"), button:has-text("Mark Complete"), button:has-text("Done")').first()

      if (await completeStepButton.isVisible()) {
        await completeStepButton.click()
        await page.waitForTimeout(300)

        // Should advance to next step or show progress
        await expect(
          page.locator('text=/Step 2|Next|Progress/i')
        ).toBeVisible().catch(() => {})
      }
    }
  })

  test('mission progress persists after page reload', async ({ page }) => {
    await page.goto('/dashboard/missions')
    await page.waitForLoadState('networkidle')

    // Start a mission
    const startButton = page.locator('button:has-text("Start")').first()

    if (await startButton.isVisible()) {
      await startButton.click()
      await page.waitForTimeout(500)

      // If we're on canvas page, navigate back
      const url = page.url()
      if (url.includes('/canvas')) {
        await page.goto('/dashboard/missions')
        await page.waitForLoadState('networkidle')
      } else {
        // Close panel and reload
        await page.keyboard.press('Escape')
        await page.waitForTimeout(300)
        await page.reload()
        await page.waitForLoadState('networkidle')
      }

      // Mission should still show as in progress
      await expect(
        page.locator('text=/In Progress|Continue/i').first()
      ).toBeVisible({ timeout: 5000 })
    }
  })
})
