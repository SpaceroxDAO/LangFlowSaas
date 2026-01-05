import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for Teach Charlie AI E2E tests.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* Run tests sequentially to avoid shared DB state issues */
  fullyParallel: false,
  workers: 1,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry once on failure for workshop stability */
  retries: process.env.CI ? 1 : 0,

  /* Reporter configuration */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  /* Shared settings for all projects */
  use: {
    /* Base URL for navigation */
    baseURL: 'http://localhost:3000',

    /* Collect trace on first retry */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure',
  },

  /* Global timeout settings */
  timeout: 30000,
  expect: {
    timeout: 10000,
  },

  /* Configure projects */
  projects: [
    /* Main test project - uses pre-authenticated state */
    {
      name: 'chromium',
      testMatch: /tests\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: './e2e/.auth/user.json',
      },
    },
  ],

  /* Run local dev server before starting tests */
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
})
