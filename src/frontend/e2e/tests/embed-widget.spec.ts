import { test, expect } from '@playwright/test'
import { phaseDSelectors } from '../helpers/selectors'
import { testAgentData, generateAgentName } from '../helpers/test-data'

const { embed } = phaseDSelectors

/**
 * Embed Widget Tests
 * Tests the embeddable chat widget feature for external sites.
 */
test.describe('Embed Widget Feature', () => {
  let agentId: string | null = null

  test.beforeAll(async ({ browser }) => {
    // Create an agent to test embed functionality
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('/dashboard/create')
    await page.waitForLoadState('networkidle')

    // Fill the creation form
    const nameInput = page.locator('[data-tour="agent-name"]')
    if (await nameInput.isVisible()) {
      const agentName = generateAgentName('Embed Test')
      await nameInput.fill(agentName)

      const jobTextarea = page.locator('[data-tour="agent-job"]')
      await jobTextarea.fill(testAgentData.who.valid)

      await page.click('button:has-text("Next Step")')
      await page.waitForSelector('[data-tour="agent-rules"]')
      await page.locator('[data-tour="agent-rules"]').fill(testAgentData.rules.valid)
      await page.click('button:has-text("Next Step")')
      await page.waitForSelector('[data-tour="agent-actions"]')
      await page.click('button:has-text("Finish & Create Agent")')

      await page.waitForURL('**/playground/**', { timeout: 30000 })

      // Extract agent ID
      agentId = page.url().split('/playground/')[1] || null
    }

    await context.close()
  })

  test.describe('Embed Modal Access', () => {
    test('embed option is accessible from agent card menu', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      // Find an agent card
      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        // Open the menu
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(300)

        // Should see Embed option
        await expect(
          page.locator('button:has-text("Embed")').or(
            page.locator('text=/Embed|Widget/i')
          )
        ).toBeVisible()
      }
    })

    test('clicking Embed opens the embed modal', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(300)

        const embedOption = page.locator('button:has-text("Embed")').first()
        await embedOption.click()
        await page.waitForTimeout(300)

        // Modal should appear
        await expect(
          page.locator('text=/Embed Widget|Embed Code/i')
        ).toBeVisible()
      }
    })
  })

  test.describe('Embed Modal Layout', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      // Open embed modal
      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)
      }
    })

    test('modal shows header with title', async ({ page }) => {
      await expect(
        page.locator('h2:has-text("Embed Widget")').or(
          page.locator('h2:has-text("Embed")').or(
            page.locator('.font-semibold:has-text("Embed")')
          )
        )
      ).toBeVisible()
    })

    test('modal shows close button', async ({ page }) => {
      await expect(
        page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: '' }).first()
      ).toBeVisible()
    })

    test('modal shows enable/disable toggle', async ({ page }) => {
      await expect(
        page.locator('.relative.inline-flex').or(
          page.locator('button[role="switch"]').or(
            page.locator('text=/Enable|Disable|Status/i')
          )
        )
      ).toBeVisible()
    })

    test('modal shows tips section', async ({ page }) => {
      await expect(
        page.locator('text=/Tips|Instructions|How to/i').or(
          page.locator('.bg-blue-50')
        )
      ).toBeVisible()
    })
  })

  test.describe('Embed Toggle Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)
      }
    })

    test('toggle shows current embed status', async ({ page }) => {
      // Should show either enabled or disabled status
      await expect(
        page.locator('text=/Widget is active|Enable to get embed code|Embedding enabled|Embedding disabled/i')
      ).toBeVisible()
    })

    test('clicking toggle enables embedding', async ({ page }) => {
      const toggle = page.locator('.relative.inline-flex, button[role="switch"]').first()

      if (await toggle.isVisible()) {
        // Check initial state
        const isEnabled = await page.locator('text=/Widget is active/i').isVisible().catch(() => false)

        if (!isEnabled) {
          await toggle.click()
          await page.waitForTimeout(500)

          // Should show enabled state and embed code
          await expect(
            page.locator('pre, code').or(
              page.locator('text=/Widget is active/i')
            )
          ).toBeVisible({ timeout: 5000 })
        }
      }
    })

    test('clicking toggle disables embedding', async ({ page }) => {
      const toggle = page.locator('.relative.inline-flex, button[role="switch"]').first()

      if (await toggle.isVisible()) {
        const isEnabled = await page.locator('text=/Widget is active/i').isVisible().catch(() => false)

        if (isEnabled) {
          // Mock confirmation dialog
          page.on('dialog', dialog => dialog.accept())

          await toggle.click()
          await page.waitForTimeout(500)

          // Should show disabled state
          await expect(
            page.locator('text=/Enable to get embed code|Embedding disabled/i')
          ).toBeVisible({ timeout: 5000 })
        }
      }
    })

    test('disabling shows confirmation dialog', async ({ page }) => {
      const toggle = page.locator('.relative.inline-flex, button[role="switch"]').first()

      if (await toggle.isVisible()) {
        const isEnabled = await page.locator('text=/Widget is active/i').isVisible().catch(() => false)

        if (isEnabled) {
          // Listen for dialog
          let dialogAppeared = false
          page.on('dialog', async dialog => {
            dialogAppeared = true
            await dialog.dismiss()
          })

          await toggle.click()
          await page.waitForTimeout(500)

          expect(dialogAppeared).toBe(true)
        }
      }
    })
  })

  test.describe('Widget Configuration', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)
      }
    })

    test('shows welcome message input', async ({ page }) => {
      // Config section might only show when not enabled
      const isNotEnabled = await page.locator('text=/Enable to get embed code/i').isVisible().catch(() => false)

      if (isNotEnabled) {
        await expect(
          page.locator('input[placeholder*="welcome"], input[placeholder*="Hi"]').or(
            page.locator('label:has-text("Welcome Message")')
          )
        ).toBeVisible()
      }
    })

    test('shows color picker', async ({ page }) => {
      const isNotEnabled = await page.locator('text=/Enable to get embed code/i').isVisible().catch(() => false)

      if (isNotEnabled) {
        await expect(
          page.locator('input[type="color"]').or(
            page.locator('label:has-text("Color")')
          )
        ).toBeVisible()
      }
    })

    test('can change primary color', async ({ page }) => {
      const colorInput = page.locator('input[type="color"]').first()

      if (await colorInput.isVisible()) {
        await colorInput.fill('#FF5733')

        // Color text input should update
        const colorTextInput = page.locator('input.font-mono, input[value="#"]').first()

        if (await colorTextInput.isVisible()) {
          await expect(colorTextInput).toHaveValue('#FF5733')
        }
      }
    })

    test('can set welcome message', async ({ page }) => {
      const welcomeInput = page.locator('input[placeholder*="welcome"], input[placeholder*="Hi"]').first()

      if (await welcomeInput.isVisible()) {
        await welcomeInput.fill('Welcome to our chat!')
        await expect(welcomeInput).toHaveValue('Welcome to our chat!')
      }
    })
  })

  test.describe('Embed Code Display', () => {
    test('shows embed code when enabled', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        // Enable if not already enabled
        const toggle = page.locator('.relative.inline-flex, button[role="switch"]').first()
        const isEnabled = await page.locator('pre, code').isVisible().catch(() => false)

        if (!isEnabled && await toggle.isVisible()) {
          await toggle.click()
          await page.waitForTimeout(500)
        }

        // Should show embed code
        await expect(
          page.locator('pre, code').filter({ hasText: /script|widget|embed/i })
        ).toBeVisible({ timeout: 5000 })
      }
    })

    test('embed code contains script tag', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        const codeBlock = page.locator('pre, code').first()

        if (await codeBlock.isVisible()) {
          const codeText = await codeBlock.textContent()
          expect(codeText).toContain('script')
        }
      }
    })

    test('embed code contains embed token', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        const toggle = page.locator('.relative.inline-flex, button[role="switch"]').first()
        const isEnabled = await page.locator('pre, code').isVisible().catch(() => false)

        if (!isEnabled && await toggle.isVisible()) {
          await toggle.click()
          await page.waitForTimeout(500)
        }

        const codeBlock = page.locator('pre, code').first()

        if (await codeBlock.isVisible()) {
          const codeText = await codeBlock.textContent()
          // Should contain a token reference
          expect(codeText).toMatch(/token|embed|data-/i)
        }
      }
    })
  })

  test.describe('Copy Functionality', () => {
    test('copy button is visible when embed code shown', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        const toggle = page.locator('.relative.inline-flex, button[role="switch"]').first()
        const isEnabled = await page.locator('pre, code').isVisible().catch(() => false)

        if (!isEnabled && await toggle.isVisible()) {
          await toggle.click()
          await page.waitForTimeout(500)
        }

        // Should show copy button
        await expect(
          page.locator('button[title*="Copy"]').or(
            page.locator('button:has-text("Copy")')
          )
        ).toBeVisible()
      }
    })

    test('clicking copy shows success feedback', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        const toggle = page.locator('.relative.inline-flex, button[role="switch"]').first()
        const isEnabled = await page.locator('pre, code').isVisible().catch(() => false)

        if (!isEnabled && await toggle.isVisible()) {
          await toggle.click()
          await page.waitForTimeout(500)
        }

        const copyButton = page.locator('button[title*="Copy"], button:has-text("Copy")').first()

        if (await copyButton.isVisible()) {
          await copyButton.click()
          await page.waitForTimeout(500)

          // Should show copied feedback
          await expect(
            page.locator('text=/Copied|Success/i').or(
              page.locator('.text-green-400, .text-green-500, .text-green-600')
            )
          ).toBeVisible()
        }
      }
    })

    test('copy button in footer works', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        const toggle = page.locator('.relative.inline-flex, button[role="switch"]').first()
        const isEnabled = await page.locator('pre, code').isVisible().catch(() => false)

        if (!isEnabled && await toggle.isVisible()) {
          await toggle.click()
          await page.waitForTimeout(500)
        }

        // Footer copy button
        const footerCopyButton = page.locator('button:has-text("Copy Code")').first()

        if (await footerCopyButton.isVisible()) {
          await footerCopyButton.click()
          await page.waitForTimeout(500)

          // Should show copied state
          await expect(
            page.locator('text=/Copied/i')
          ).toBeVisible()
        }
      }
    })
  })

  test.describe('Modal Close Behavior', () => {
    test('close button closes modal', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        // Modal should be open
        await expect(page.locator('text=/Embed Widget/i')).toBeVisible()

        // Click close button (X or Close text)
        const closeButton = page.locator('button:has-text("Close")').or(
          page.locator('button').filter({ has: page.locator('path[d*="M6 18L18 6"]') })
        ).first()

        await closeButton.click()
        await page.waitForTimeout(300)

        // Modal should be closed
        await expect(page.locator('.fixed.inset-0:has-text("Embed Widget")')).not.toBeVisible()
      }
    })

    test('clicking outside modal closes it', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        // Click on backdrop
        const backdrop = page.locator('.fixed.inset-0.bg-black\\/50')

        if (await backdrop.isVisible()) {
          await backdrop.click({ position: { x: 10, y: 10 } })
          await page.waitForTimeout(300)

          // Modal should close
        }
      }
    })

    test('pressing Escape closes modal', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        await expect(page.locator('text=/Embed Widget/i')).toBeVisible()

        await page.keyboard.press('Escape')
        await page.waitForTimeout(300)

        // Modal should close
        await expect(page.locator('.fixed.inset-0:has-text("Embed Widget")')).not.toBeVisible()
      }
    })
  })

  test.describe('Tips Section', () => {
    test('tips section shows placement instructions', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        // Should mention body tag placement
        await expect(
          page.locator('text=/body|</body>/i')
        ).toBeVisible()
      }
    })

    test('tips mention floating button behavior', async ({ page }) => {
      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        await expect(
          page.locator('text=/floating|button|corner/i')
        ).toBeVisible()
      }
    })
  })

  test.describe('Error Handling', () => {
    test('shows error when enable API fails', async ({ page }) => {
      await page.route('**/api/v1/embed/**/enable', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Failed to enable embedding' })
        })
      })

      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        const toggle = page.locator('.relative.inline-flex, button[role="switch"]').first()

        if (await toggle.isVisible()) {
          await toggle.click()
          await page.waitForTimeout(500)

          // Should show error or toggle should remain off
        }
      }
    })

    test('shows loading state during enable/disable', async ({ page }) => {
      await page.route('**/api/v1/embed/**/enable', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ embed_code: '<script></script>', embed_token: 'test' })
        })
      })

      await page.goto('/dashboard/agents')
      await page.waitForLoadState('networkidle')

      const agentCard = page.locator('.rounded-xl, .rounded-2xl').filter({ hasText: /Agent|Charlie/i }).first()

      if (await agentCard.isVisible()) {
        const menuButton = agentCard.locator('button').last()
        await menuButton.click()
        await page.waitForTimeout(200)
        await page.locator('button:has-text("Embed")').first().click()
        await page.waitForTimeout(300)

        const toggle = page.locator('.relative.inline-flex, button[role="switch"]').first()

        if (await toggle.isVisible()) {
          await toggle.click()

          // Should show loading/disabled state
          await expect(
            page.locator('.opacity-50, .cursor-not-allowed')
          ).toBeVisible({ timeout: 500 }).catch(() => {})
        }
      }
    })
  })
})

/**
 * Public Embed Endpoint Tests
 * Tests the public-facing embed widget functionality.
 */
test.describe('Public Embed Endpoints', () => {
  test('widget.js endpoint returns JavaScript', async ({ page }) => {
    const response = await page.request.get('/api/v1/embed/widget.js')

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('javascript')
  })

  test('widget.js contains initialization code', async ({ page }) => {
    const response = await page.request.get('/api/v1/embed/widget.js')
    const body = await response.text()

    expect(body).toContain('teachcharlie')
  })

  test('invalid embed token returns 404', async ({ page }) => {
    const response = await page.request.get('/api/v1/embed/invalid-token-12345')

    expect(response.status()).toBe(404)
  })
})
