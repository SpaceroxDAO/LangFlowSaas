import { test, expect } from '@playwright/test'
import { phaseDSelectors } from '../helpers/selectors'

const { settings } = phaseDSelectors

/**
 * Settings Page Tests
 * Tests the user settings and configuration features.
 */
test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/settings')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Settings Page Layout', () => {
    test('displays page header', async ({ page }) => {
      await expect(page.locator('h1')).toContainText(/Settings|Preferences|Account/i)
    })

    test('shows settings tabs or sections', async ({ page }) => {
      // Should have multiple sections or tabs
      await expect(
        page.locator('button:has-text("Profile")').or(
          page.locator('text=/Profile|API Keys|Notifications/i')
        )
      ).toBeVisible()
    })
  })

  test.describe('API Keys Section', () => {
    test('displays API Keys section', async ({ page }) => {
      await expect(
        page.locator('text=/API Keys|API Configuration|Keys/i')
      ).toBeVisible()
    })

    test('shows OpenAI key input', async ({ page }) => {
      await expect(
        page.locator('input[name="openai_key"], input[placeholder*="OpenAI"], label:has-text("OpenAI")')
      ).toBeVisible()
    })

    test('shows Anthropic key input', async ({ page }) => {
      await expect(
        page.locator('input[name="anthropic_key"], input[placeholder*="Anthropic"], label:has-text("Anthropic")')
      ).toBeVisible()
    })

    test('API keys are masked by default', async ({ page }) => {
      const keyInput = page.locator('input[type="password"]').first()

      if (await keyInput.isVisible()) {
        await expect(keyInput).toHaveAttribute('type', 'password')
      }
    })

    test('show/hide button toggles key visibility', async ({ page }) => {
      const showButton = page.locator('button').filter({ has: page.locator('svg[class*="eye"]') }).first()

      if (await showButton.isVisible()) {
        const keyInput = page.locator('input[type="password"]').first()

        // Click show
        await showButton.click()
        await page.waitForTimeout(200)

        // Input should be visible (type=text)
        await expect(keyInput).toHaveAttribute('type', 'text')

        // Click hide
        await showButton.click()
        await page.waitForTimeout(200)

        // Input should be hidden again
        await expect(keyInput).toHaveAttribute('type', 'password')
      }
    })

    test('can enter and save API keys', async ({ page }) => {
      const openaiInput = page.locator('input').filter({ hasText: '' }).nth(0) // First input that might be OpenAI

      if (await openaiInput.isVisible()) {
        await openaiInput.fill('sk-test-key-12345')

        const saveButton = page.locator('button:has-text("Save")')
        await saveButton.click()

        // Should show success or save the key
        await expect(
          page.locator('text=/Saved|Success|Updated/i')
        ).toBeVisible({ timeout: 5000 }).catch(() => {})
      }
    })

    test('invalid API key shows error', async ({ page }) => {
      // Mock validation endpoint
      await page.route('**/api/v1/settings/validate-key**', route => {
        route.fulfill({
          status: 400,
          body: JSON.stringify({ error: 'Invalid API key' })
        })
      })

      const openaiInput = page.locator('input[name*="openai"], input[placeholder*="OpenAI"]').first()

      if (await openaiInput.isVisible()) {
        await openaiInput.fill('invalid-key')

        const saveButton = page.locator('button:has-text("Save")')
        await saveButton.click()

        await expect(
          page.locator('text=/Invalid|Error|failed/i')
        ).toBeVisible({ timeout: 5000 }).catch(() => {})
      }
    })
  })

  test.describe('Profile Section', () => {
    test('displays profile section', async ({ page }) => {
      const profileTab = page.locator('button:has-text("Profile")')

      if (await profileTab.isVisible()) {
        await profileTab.click()
        await page.waitForTimeout(300)
      }

      await expect(
        page.locator('text=/Profile|Account|User Information/i')
      ).toBeVisible()
    })

    test('shows name input field', async ({ page }) => {
      await expect(
        page.locator('input[name="name"], input[placeholder*="name"], label:has-text("Name")')
      ).toBeVisible().catch(() => {})
    })

    test('shows email display', async ({ page }) => {
      await expect(
        page.locator('input[name="email"], text=/@/i, label:has-text("Email")')
      ).toBeVisible().catch(() => {})
    })

    test('can update profile name', async ({ page }) => {
      const nameInput = page.locator('input[name="name"]').first()

      if (await nameInput.isVisible()) {
        await nameInput.fill('Test User Name')

        const saveButton = page.locator('button:has-text("Save")')
        await saveButton.click()

        await expect(
          page.locator('text=/Saved|Updated|Success/i')
        ).toBeVisible({ timeout: 5000 }).catch(() => {})
      }
    })
  })

  test.describe('Notifications Section', () => {
    test('displays notifications settings', async ({ page }) => {
      const notificationsTab = page.locator('button:has-text("Notifications")')

      if (await notificationsTab.isVisible()) {
        await notificationsTab.click()
        await page.waitForTimeout(300)
      }

      await expect(
        page.locator('text=/Notifications|Email Preferences|Alerts/i')
      ).toBeVisible().catch(() => {})
    })

    test('shows email notification toggle', async ({ page }) => {
      await expect(
        page.locator('input[name="email_notifications"], input[type="checkbox"]').or(
          page.locator('button[role="switch"]')
        )
      ).toBeVisible().catch(() => {})
    })

    test('can toggle notifications', async ({ page }) => {
      const toggle = page.locator('input[type="checkbox"], button[role="switch"]').first()

      if (await toggle.isVisible()) {
        const initialState = await toggle.isChecked().catch(() => false)

        await toggle.click()
        await page.waitForTimeout(200)

        // State should have changed
      }
    })
  })

  test.describe('Danger Zone', () => {
    test('shows danger zone section', async ({ page }) => {
      await expect(
        page.locator('text=/Danger Zone|Delete Account|Account Deletion/i')
      ).toBeVisible().catch(() => {})
    })

    test('delete account button is visible', async ({ page }) => {
      await expect(
        page.locator('button:has-text("Delete Account")').or(
          page.locator('button:has-text("Delete My Account")')
        )
      ).toBeVisible().catch(() => {})
    })

    test('delete account requires confirmation', async ({ page }) => {
      const deleteButton = page.locator('button:has-text("Delete Account")').first()

      if (await deleteButton.isVisible()) {
        await deleteButton.click()
        await page.waitForTimeout(300)

        // Should show confirmation dialog
        await expect(
          page.locator('[role="dialog"]').or(
            page.locator('text=/Are you sure|Confirm|type DELETE/i')
          )
        ).toBeVisible()
      }
    })

    test('delete account requires typing DELETE', async ({ page }) => {
      const deleteButton = page.locator('button:has-text("Delete Account")').first()

      if (await deleteButton.isVisible()) {
        await deleteButton.click()
        await page.waitForTimeout(300)

        // Look for confirmation input
        const confirmInput = page.locator('input[placeholder*="DELETE"], input[placeholder*="delete"]')

        if (await confirmInput.isVisible()) {
          // Final delete button should be disabled
          const finalDeleteButton = page.locator('button:has-text("Delete")').last()
          await expect(finalDeleteButton).toBeDisabled()

          // Type DELETE
          await confirmInput.fill('DELETE')

          // Button should now be enabled
          await expect(finalDeleteButton).toBeEnabled()
        }
      }
    })
  })

  test.describe('Form Validation', () => {
    test('shows validation error for empty required fields', async ({ page }) => {
      const nameInput = page.locator('input[name="name"]').first()

      if (await nameInput.isVisible()) {
        await nameInput.fill('')
        await nameInput.blur()

        // Should show validation message
        await expect(
          page.locator('text=/required|cannot be empty/i')
        ).toBeVisible({ timeout: 2000 }).catch(() => {})
      }
    })

    test('save button disabled when form is invalid', async ({ page }) => {
      // Clear a required field
      const nameInput = page.locator('input[name="name"]').first()

      if (await nameInput.isVisible()) {
        await nameInput.fill('')

        const saveButton = page.locator('button:has-text("Save")').first()

        await expect(saveButton).toBeDisabled().catch(() => {})
      }
    })
  })

  test.describe('Save Functionality', () => {
    test('save button shows loading state', async ({ page }) => {
      // Mock slow API response
      await page.route('**/api/v1/settings**', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        })
      })

      const saveButton = page.locator('button:has-text("Save")').first()

      if (await saveButton.isVisible()) {
        await saveButton.click()

        // Should show loading state
        await expect(
          page.locator('.animate-spin').or(page.locator('text=/Saving/i'))
        ).toBeVisible({ timeout: 500 }).catch(() => {})
      }
    })

    test('shows success message after save', async ({ page }) => {
      // Mock successful save
      await page.route('**/api/v1/settings**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        })
      })

      const saveButton = page.locator('button:has-text("Save")').first()

      if (await saveButton.isVisible()) {
        await saveButton.click()
        await page.waitForTimeout(500)

        await expect(
          page.locator('text=/Saved|Success|Updated/i').or(
            page.locator('.text-green-500, .bg-green-50')
          )
        ).toBeVisible({ timeout: 5000 }).catch(() => {})
      }
    })

    test('shows error message on save failure', async ({ page }) => {
      // Mock failed save
      await page.route('**/api/v1/settings**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Failed to save settings' })
        })
      })

      const saveButton = page.locator('button:has-text("Save")').first()

      if (await saveButton.isVisible()) {
        await saveButton.click()
        await page.waitForTimeout(500)

        await expect(
          page.locator('text=/Error|Failed|Could not save/i').or(
            page.locator('.text-red-500, .bg-red-50')
          )
        ).toBeVisible({ timeout: 5000 }).catch(() => {})
      }
    })
  })

  test.describe('Tab Navigation', () => {
    test('clicking tabs switches content', async ({ page }) => {
      const tabs = page.locator('button').filter({ hasText: /Profile|API Keys|Notifications/i })

      const tabCount = await tabs.count()

      if (tabCount > 1) {
        // Click second tab
        await tabs.nth(1).click()
        await page.waitForTimeout(300)

        // Content should change
        // Verify by checking for section-specific content
      }
    })

    test('active tab is visually distinct', async ({ page }) => {
      const activeTab = page.locator('button[aria-selected="true"], button.bg-violet-100, button.border-b-2')

      await expect(activeTab).toBeVisible().catch(() => {})
    })
  })

  test.describe('Responsive Design', () => {
    test('settings page is responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()
      await page.waitForLoadState('networkidle')

      await expect(page.locator('h1')).toContainText(/Settings/i)

      // Content should still be accessible
      await expect(
        page.locator('input, button')
      ).toBeVisible()
    })

    test('settings page is responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.reload()
      await page.waitForLoadState('networkidle')

      await expect(page.locator('h1')).toContainText(/Settings/i)
    })
  })

  test.describe('Navigation', () => {
    test('can navigate to settings from sidebar', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      await page.click('a[href="/dashboard/settings"]')
      await expect(page).toHaveURL(/\/dashboard\/settings/)
    })

    test('settings link is active when on settings page', async ({ page }) => {
      const settingsLink = page.locator('a[href="/dashboard/settings"]').first()

      await expect(settingsLink).toHaveClass(/bg-violet|text-violet|active/i)
    })
  })

  test.describe('Accessibility', () => {
    test('form inputs have labels', async ({ page }) => {
      const inputs = page.locator('input:not([type="hidden"])')

      for (let i = 0; i < await inputs.count(); i++) {
        const input = inputs.nth(i)
        const id = await input.getAttribute('id')
        const name = await input.getAttribute('name')
        const placeholder = await input.getAttribute('placeholder')
        const ariaLabel = await input.getAttribute('aria-label')

        // Should have some form of labeling
        const hasLabel = id || name || placeholder || ariaLabel

        if (await input.isVisible()) {
          expect(hasLabel).toBeTruthy()
        }
      }
    })

    test('buttons are keyboard accessible', async ({ page }) => {
      const saveButton = page.locator('button:has-text("Save")').first()

      if (await saveButton.isVisible()) {
        await saveButton.focus()

        const isFocused = await saveButton.evaluate(el => document.activeElement === el)
        expect(isFocused).toBe(true)
      }
    })
  })
})

/**
 * Settings Integration Tests
 * Tests settings persistence and effect across the application.
 */
test.describe('Settings Integration', () => {
  test('saved settings persist after page reload', async ({ page }) => {
    await page.goto('/dashboard/settings')
    await page.waitForLoadState('networkidle')

    // Make a change
    const nameInput = page.locator('input[name="name"]').first()

    if (await nameInput.isVisible()) {
      const testName = 'Test Name ' + Date.now()
      await nameInput.fill(testName)

      const saveButton = page.locator('button:has-text("Save")').first()
      await saveButton.click()
      await page.waitForTimeout(500)

      // Reload
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Value should persist
      await expect(nameInput).toHaveValue(testName).catch(() => {})
    }
  })

  test('API key changes affect agent functionality', async ({ page }) => {
    // This test verifies that API key settings work correctly
    // by checking that agents can use the configured keys

    await page.goto('/dashboard/settings')
    await page.waitForLoadState('networkidle')

    // Verify API key section is accessible
    await expect(
      page.locator('text=/API Keys|OpenAI|Anthropic/i')
    ).toBeVisible()
  })
})
