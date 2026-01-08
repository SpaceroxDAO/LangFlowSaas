import { test, expect } from '@playwright/test';

/**
 * Multi-turn chat test - verifies conversation goes 2+ turns
 */

const BASE_URL = 'http://localhost:3001';

test.describe('Multi-Turn Chat Tests', () => {

  test('should complete 2-turn conversation successfully', async ({ page }) => {
    // Enable console logging for debugging
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('chat') || msg.text().includes('Chat')) {
        console.log('BROWSER:', msg.text());
      }
    });
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    // Track network requests
    page.on('response', response => {
      if (response.url().includes('/chat')) {
        console.log(`CHAT API: ${response.status()} ${response.url()}`);
      }
    });

    // Step 1: Create a new agent
    await page.goto(`${BASE_URL}/create`);
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Escape'); // Dismiss tour
    await page.waitForTimeout(300);

    // Fill wizard Step 1
    const uniqueName = `MultiTurn Agent ${Date.now()}`;
    await page.locator('input[placeholder="Charlie"]').fill(uniqueName);
    await page.locator('textarea').first().fill('A test agent for multi-turn chat');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Fill wizard Step 2
    await page.waitForTimeout(300);
    await page.locator('textarea').first().fill('You are a helpful test agent. Keep responses short (1-2 sentences). Always be helpful.');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Skip tools, create agent
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Finish & Create Agent/i }).click();

    // Wait for navigation to playground
    await page.waitForURL(/\/playground\//, { timeout: 30000 });
    console.log('Navigated to:', page.url());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Step 2: Find chat input
    const chatInput = page.locator('textarea[placeholder*="message"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    // ========== TURN 1 ==========
    console.log('\n=== TURN 1: Sending first message ===');
    await chatInput.fill('Hello! What is 2 + 2?');
    await chatInput.press('Enter');

    // Wait for first response
    console.log('Waiting for first response...');

    // Wait for response (look for assistant message)
    const firstResponse = page.locator('.prose').first();
    await expect(firstResponse).toBeVisible({ timeout: 60000 });

    const firstResponseText = await firstResponse.textContent();
    console.log('First response:', firstResponseText);

    // Verify first response is not an error
    const hasError1 = await page.getByText(/Failed to send/i).isVisible().catch(() => false);
    expect(hasError1).toBe(false);
    expect(firstResponseText).toBeTruthy();
    expect(firstResponseText!.length).toBeGreaterThan(0);

    // Wait a moment before second message
    await page.waitForTimeout(1000);

    // ========== TURN 2 ==========
    console.log('\n=== TURN 2: Sending second message ===');

    // Make sure input is ready for second message
    await expect(chatInput).toBeVisible();
    await expect(chatInput).toBeEnabled();

    await chatInput.fill('Great! Now what is 3 + 3?');
    await chatInput.press('Enter');

    // Wait for second response
    console.log('Waiting for second response...');

    // Wait for loading to appear and disappear, or for new content
    await page.waitForTimeout(2000);

    // Count prose elements - should have 2 now (one for each assistant response)
    const proseElements = page.locator('.prose');
    await expect(proseElements).toHaveCount(2, { timeout: 60000 });

    const secondResponse = proseElements.nth(1);
    const secondResponseText = await secondResponse.textContent();
    console.log('Second response:', secondResponseText);

    // Verify second response
    const hasError2 = await page.getByText(/Failed to send/i).isVisible().catch(() => false);
    expect(hasError2).toBe(false);
    expect(secondResponseText).toBeTruthy();
    expect(secondResponseText!.length).toBeGreaterThan(0);

    // Verify both messages are different (not duplicates)
    expect(firstResponseText).not.toBe(secondResponseText);

    // Take final screenshot
    await page.screenshot({ path: 'test-results/multi-turn-final.png' });

    console.log('\n=== MULTI-TURN TEST PASSED ===');
    console.log('Turn 1 response:', firstResponseText?.substring(0, 50) + '...');
    console.log('Turn 2 response:', secondResponseText?.substring(0, 50) + '...');
  });

  test('should test existing workflow with 2 turns', async ({ page }) => {
    // Test with the "Plane expert" workflow that was fixed
    const workflowId = 'a1238c1c-5da1-453f-9a1f-00686e6b6c9e';

    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('BROWSER ERROR:', msg.text());
      }
    });

    page.on('response', response => {
      if (response.url().includes('/chat')) {
        console.log(`CHAT API: ${response.status()} ${response.url()}`);
      }
    });

    // Navigate directly to the workflow playground
    await page.goto(`${BASE_URL}/playground/workflow/${workflowId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const chatInput = page.locator('textarea[placeholder*="message"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    // ========== TURN 1 ==========
    console.log('\n=== TURN 1: First message to Plane expert ===');
    await chatInput.fill('What is the wingspan of a Boeing 747?');
    await chatInput.press('Enter');

    const firstResponse = page.locator('.prose').first();
    await expect(firstResponse).toBeVisible({ timeout: 60000 });

    const firstText = await firstResponse.textContent();
    console.log('First response:', firstText?.substring(0, 100));

    await page.waitForTimeout(1000);

    // ========== TURN 2 ==========
    console.log('\n=== TURN 2: Second message to Plane expert ===');
    await chatInput.fill('How does that compare to an Airbus A380?');
    await chatInput.press('Enter');

    // Wait for second response
    await page.waitForTimeout(2000);

    const proseElements = page.locator('.prose');
    await expect(proseElements).toHaveCount(2, { timeout: 60000 });

    const secondText = await proseElements.nth(1).textContent();
    console.log('Second response:', secondText?.substring(0, 100));

    // Verify no errors
    const hasError = await page.getByText(/Failed to send/i).isVisible().catch(() => false);
    expect(hasError).toBe(false);

    console.log('\n=== EXISTING WORKFLOW MULTI-TURN TEST PASSED ===');
  });
});
