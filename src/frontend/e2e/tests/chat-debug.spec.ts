import { test, expect } from '@playwright/test';

/**
 * Debug test for chat functionality
 * Creates a new agent and immediately tests chat
 */

const BASE_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:8000';
const DEV_USER_ID = 'a36c791d-b36b-44b7-abc1-feaafb6a8d40';

test.describe('Chat Debug Tests', () => {

  test('should create agent and chat successfully', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    // Intercept network requests to see what's happening
    page.on('response', response => {
      if (response.url().includes('/chat') || response.url().includes('/workflow')) {
        console.log(`NETWORK: ${response.status()} ${response.url()}`);
      }
    });

    // Step 1: Navigate to create page
    await page.goto(`${BASE_URL}/create`);
    await page.waitForLoadState('networkidle');

    // Dismiss tour if present
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Step 2: Fill wizard Step 1
    const uniqueName = `Debug Agent ${Date.now()}`;
    await page.locator('input[placeholder="Charlie"]').fill(uniqueName);
    await page.locator('textarea').first().fill('A debug test agent for chat testing');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Step 3: Fill wizard Step 2
    await page.waitForTimeout(500);
    await page.locator('textarea').first().fill('You are a helpful debug test agent. Always respond with "Debug test successful!"');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Step 4: Skip tools, create agent
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Finish & Create Agent/i }).click();

    // Step 5: Wait for navigation to playground
    await page.waitForURL(/\/playground\//, { timeout: 30000 });
    console.log('Navigated to:', page.url());

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Step 6: Take screenshot before chat
    await page.screenshot({ path: 'test-results/debug-before-chat.png' });

    // Step 7: Find and use chat input
    const chatInput = page.locator('textarea[placeholder*="message"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    // Step 8: Send test message
    await chatInput.fill('Hello, please respond!');
    await chatInput.press('Enter');

    console.log('Message sent, waiting for response...');

    // Step 9: Take screenshot after sending
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/debug-after-send.png' });

    // Step 10: Check for various response states
    const thinkingVisible = await page.getByText('Thinking...').isVisible().catch(() => false);
    const failedVisible = await page.getByText(/Failed to send/i).isVisible().catch(() => false);
    const errorVisible = await page.locator('.text-red-300').isVisible().catch(() => false);

    console.log('States - Thinking:', thinkingVisible, 'Failed:', failedVisible, 'Error:', errorVisible);

    // Step 11: Wait for response or error
    try {
      // Wait for either success or failure
      await Promise.race([
        page.locator('.prose').first().waitFor({ timeout: 60000 }),
        page.getByText(/Failed to send/i).waitFor({ timeout: 60000 }),
      ]);
    } catch (e) {
      console.log('Timeout waiting for response');
    }

    // Step 12: Final screenshot
    await page.screenshot({ path: 'test-results/debug-final.png' });

    // Step 13: Check final state
    const proseContent = await page.locator('.prose').first().textContent().catch(() => null);
    const failedText = await page.getByText(/Failed to send/i).isVisible().catch(() => false);

    console.log('Prose content:', proseContent);
    console.log('Failed visible:', failedText);

    // Assert success
    if (failedText) {
      // Get more context about the error
      const allMessages = await page.locator('.rounded-2xl').allTextContents();
      console.log('All message bubbles:', allMessages);
      throw new Error('Chat failed - "Failed to send" message visible');
    }

    expect(proseContent).toBeTruthy();
  });

  test('API direct chat test', async ({ request }) => {
    // First get user settings
    const settingsResponse = await request.get(`${API_URL}/api/v1/settings`, {
      headers: { 'x-dev-user-id': DEV_USER_ID },
    });
    const settings = await settingsResponse.json();
    console.log('User settings:', JSON.stringify(settings, null, 2));

    // Get workflows
    const workflowsResponse = await request.get(`${API_URL}/api/v1/workflows`, {
      headers: { 'x-dev-user-id': DEV_USER_ID },
    });
    const workflowsData = await workflowsResponse.json();
    console.log('Workflows count:', workflowsData.workflows?.length);

    if (workflowsData.workflows?.length > 0) {
      const workflow = workflowsData.workflows[0];
      console.log('Testing workflow:', workflow.id, workflow.name);

      // Try to chat
      const chatResponse = await request.post(`${API_URL}/api/v1/workflows/${workflow.id}/chat`, {
        headers: {
          'x-dev-user-id': DEV_USER_ID,
          'Content-Type': 'application/json',
        },
        data: {
          message: 'Hello, this is a test!',
        },
        timeout: 60000,
      });

      console.log('Chat response status:', chatResponse.status());
      const chatData = await chatResponse.json().catch(() => chatResponse.text());
      console.log('Chat response:', JSON.stringify(chatData, null, 2));

      expect(chatResponse.status()).toBeLessThan(500);
    }
  });
});
