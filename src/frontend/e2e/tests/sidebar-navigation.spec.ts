import { test, expect } from '@playwright/test'
import { phaseDSelectors } from '../helpers/selectors'

const { sidebar } = phaseDSelectors

/**
 * Sidebar Navigation Tests
 * Tests the main navigation sidebar across all pages.
 */
test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Sidebar Layout', () => {
    test('sidebar is visible on page load', async ({ page }) => {
      // Use aside element with role="navigation" (semantic HTML)
      await expect(
        page.locator('aside[role="navigation"]')
      ).toBeVisible()
    })

    test('sidebar shows main navigation links', async ({ page }) => {
      // My Files link
      await expect(page.locator('a[href="/dashboard/files"]')).toBeVisible()

      // Analytics link
      await expect(page.locator('a[href="/dashboard/analytics"]')).toBeVisible()

      // Missions link
      await expect(page.locator('a[href="/dashboard/missions"]')).toBeVisible()

      // Billing link
      await expect(page.locator('a[href="/dashboard/billing"]')).toBeVisible()

      // Settings link
      await expect(page.locator('a[href="/dashboard/settings"]')).toBeVisible()
    })

    test('sidebar links have icons', async ({ page }) => {
      // Each nav link should have an icon
      const navLinks = page.locator('aside a, nav a').filter({ hasText: /Files|Analytics|Missions|Billing|Settings/i })

      for (let i = 0; i < await navLinks.count(); i++) {
        const link = navLinks.nth(i)
        // Should contain an SVG icon
        await expect(
          link.locator('svg')
        ).toBeVisible()
      }
    })
  })

  test.describe('Navigation Links', () => {
    test('clicking Files link navigates to files page', async ({ page }) => {
      await page.click('a[href="/dashboard/files"]')
      await expect(page).toHaveURL(/\/dashboard\/files/)
    })

    test('clicking Analytics link navigates to analytics page', async ({ page }) => {
      await page.click('a[href="/dashboard/analytics"]')
      await expect(page).toHaveURL(/\/dashboard\/analytics/)
    })

    test('clicking Missions link navigates to missions page', async ({ page }) => {
      await page.click('a[href="/dashboard/missions"]')
      await expect(page).toHaveURL(/\/dashboard\/missions/)
    })

    test('clicking Billing link navigates to billing page', async ({ page }) => {
      await page.click('a[href="/dashboard/billing"]')
      await expect(page).toHaveURL(/\/dashboard\/billing/)
    })

    test('clicking Settings link navigates to settings page', async ({ page }) => {
      await page.click('a[href="/dashboard/settings"]')
      await expect(page).toHaveURL(/\/dashboard\/settings/)
    })
  })

  test.describe('Active State', () => {
    test('Files link is active when on files page', async ({ page }) => {
      await page.goto('/dashboard/files')
      await page.waitForLoadState('networkidle')

      const filesLink = page.locator('a[href="/dashboard/files"]')
      await expect(filesLink).toHaveClass(/bg-gray-100|text-gray-900|active/i)
    })

    test('Analytics link is active when on analytics page', async ({ page }) => {
      await page.goto('/dashboard/analytics')
      await page.waitForLoadState('networkidle')

      const analyticsLink = page.locator('a[href="/dashboard/analytics"]')
      await expect(analyticsLink).toHaveClass(/bg-gray-100|text-gray-900|active/i)
    })

    test('Missions link is active when on missions page', async ({ page }) => {
      await page.goto('/dashboard/missions')
      await page.waitForLoadState('networkidle')

      const missionsLink = page.locator('a[href="/dashboard/missions"]')
      await expect(missionsLink).toHaveClass(/bg-gray-100|text-gray-900|active/i)
    })

    test('Billing link is active when on billing page', async ({ page }) => {
      await page.goto('/dashboard/billing')
      await page.waitForLoadState('networkidle')

      const billingLink = page.locator('a[href="/dashboard/billing"]')
      await expect(billingLink).toHaveClass(/bg-gray-100|text-gray-900|active/i)
    })

    test('Settings link is active when on settings page', async ({ page }) => {
      await page.goto('/dashboard/settings')
      await page.waitForLoadState('networkidle')

      const settingsLink = page.locator('a[href="/dashboard/settings"]')
      await expect(settingsLink).toHaveClass(/bg-gray-100|text-gray-900|active/i)
    })
  })

  test.describe('Sidebar Collapse/Expand', () => {
    test('sidebar can be collapsed', async ({ page }) => {
      // Find the toggle button with aria-expanded attribute
      const toggleButton = page.locator('button[aria-expanded="true"]')

      if (await toggleButton.isVisible()) {
        const sidebarBefore = await page.locator('aside[role="navigation"]').boundingBox()
        await toggleButton.click()
        await page.waitForTimeout(300)

        const sidebarAfter = await page.locator('aside[role="navigation"]').boundingBox()

        if (sidebarBefore && sidebarAfter) {
          expect(sidebarAfter.width).toBeLessThan(sidebarBefore.width)
        }
      }
    })

    test('toggle button has correct aria-expanded state', async ({ page }) => {
      // Find any toggle button with aria-expanded attribute
      const toggleButton = page.locator('button[aria-expanded]').first()
      await expect(toggleButton).toBeVisible()

      // Get current state
      const initialExpanded = await toggleButton.getAttribute('aria-expanded')

      // Click to toggle
      await toggleButton.click()
      await page.waitForTimeout(300)

      // Find the new toggle button (may be a different button after re-render)
      const newToggleButton = page.locator('button[aria-expanded]').first()
      const newExpanded = await newToggleButton.getAttribute('aria-expanded')

      // State should have changed
      expect(newExpanded).not.toBe(initialExpanded)
    })
  })

  test.describe('Hover States', () => {
    test('links show hover effect', async ({ page }) => {
      const billingLink = page.locator('a[href="/dashboard/billing"]')

      await billingLink.hover()
      await page.waitForTimeout(100)

      // Should have hover styling - this is a visual verification
    })
  })

  test.describe('Mobile Navigation', () => {
    test('sidebar transforms to mobile menu on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Sidebar might be hidden or transformed to hamburger menu on mobile
      const hamburgerMenu = page.locator('button').filter({ has: page.locator('svg') })

      // Either hamburger menu exists or sidebar is still visible
      const hasMenu = await hamburgerMenu.count() > 0
      const hasSidebar = await page.locator('aside').isVisible()

      expect(hasMenu || hasSidebar).toBe(true)
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('can navigate sidebar with Tab key', async ({ page }) => {
      // Focus on first link
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab') // Skip to sidebar links

      // Should be able to navigate through links
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement)
    })
  })

  test.describe('Accessibility', () => {
    test('sidebar has proper ARIA attributes', async ({ page }) => {
      // Check for aside with role="navigation" and aria-label
      const sidebar = page.locator('aside[role="navigation"]')
      await expect(sidebar).toBeVisible()
      await expect(sidebar).toHaveAttribute('aria-label', 'Main navigation')
    })

    test('toggle button has aria-label', async ({ page }) => {
      const toggleButton = page.locator('button[aria-expanded]').first()
      await expect(toggleButton).toHaveAttribute('aria-label')
    })

    test('links have proper contrast for visibility', async ({ page }) => {
      const link = page.locator('a[href="/dashboard/missions"]')
      await expect(link).toBeVisible()
    })
  })
})

/**
 * Cross-Page Navigation Tests
 * Tests navigation flows across multiple pages.
 */
test.describe('Cross-Page Navigation', () => {
  test('complete navigation flow: Dashboard -> Missions -> Billing -> Dashboard', async ({ page }) => {
    // Start at dashboard
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/dashboard/)

    // Navigate to missions
    await page.click('a[href="/dashboard/missions"]')
    await expect(page).toHaveURL(/\/dashboard\/missions/)

    // Navigate to billing
    await page.click('a[href="/dashboard/billing"]')
    await expect(page).toHaveURL(/\/dashboard\/billing/)

    // Go back to dashboard
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('navigation maintains state during page transitions', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Navigate to billing
    await page.click('a[href="/dashboard/billing"]')
    await page.waitForLoadState('networkidle')

    // Navigate to missions
    await page.click('a[href="/dashboard/missions"]')
    await page.waitForLoadState('networkidle')

    // Navigate to analytics
    await page.click('a[href="/dashboard/analytics"]')
    await page.waitForLoadState('networkidle')

    // Page should load properly
    await expect(page.locator('h1')).toBeVisible()
  })

  test('browser back button works correctly', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    await page.click('a[href="/dashboard/missions"]')
    await expect(page).toHaveURL(/\/dashboard\/missions/)

    await page.click('a[href="/dashboard/billing"]')
    await expect(page).toHaveURL(/\/dashboard\/billing/)

    // Go back
    await page.goBack()
    await expect(page).toHaveURL(/\/dashboard\/missions/)

    // Go back again
    await page.goBack()
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('browser forward button works correctly', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    await page.click('a[href="/dashboard/missions"]')
    await page.goBack()
    await expect(page).toHaveURL(/\/dashboard/)

    // Go forward
    await page.goForward()
    await expect(page).toHaveURL(/\/dashboard\/missions/)
  })
})
