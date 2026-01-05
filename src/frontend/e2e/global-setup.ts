import { test as setup, expect } from '@playwright/test'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '.env.test') })

const authFile = path.join(__dirname, '.auth/user.json')

/**
 * Global setup test that authenticates via Clerk and saves the session.
 * This runs once before all other tests.
 */
setup('authenticate', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL
  const password = process.env.TEST_USER_PASSWORD

  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in e2e/.env.test')
  }

  // Navigate to sign-in page
  await page.goto('/sign-in')

  // Wait for Clerk to load - look for email input
  await page.waitForSelector('input[name="identifier"]', { timeout: 15000 })

  // Enter email
  await page.fill('input[name="identifier"]', email)

  // Click the email form's Continue button (not the Google OAuth button)
  // The form button is the one that comes after the email input, not "Continue with Google"
  await page.locator('button:has-text("Continue"):not(:has-text("Google"))').click()

  // Wait for password field to be enabled
  await page.waitForSelector('input[name="password"]:not([disabled])', { timeout: 15000 })

  // Enter password
  await page.fill('input[name="password"]', password)

  // Click Continue button for password submit
  await page.locator('button:has-text("Continue"):not(:has-text("Google"))').click()

  // Wait for redirect to dashboard (successful auth)
  await page.waitForURL('**/dashboard', { timeout: 30000 })

  // Verify we're authenticated by checking for dashboard content
  await expect(page.locator('text=Dashboard').or(page.locator('text=Your Agents')).or(page.locator('text=Create'))).toBeVisible({ timeout: 10000 })

  // Save authentication state
  await page.context().storageState({ path: authFile })

  console.log('Authentication successful - storage state saved')
})
