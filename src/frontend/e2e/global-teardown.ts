import { test as teardown } from '@playwright/test'

/**
 * Global teardown - runs after all tests complete.
 * Currently empty but can be used for cleanup tasks.
 */
teardown('cleanup', async ({ }) => {
  // Future: Could clean up test agents created during tests
  console.log('Test suite completed')
})
