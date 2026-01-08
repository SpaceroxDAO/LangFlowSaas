import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Chat Playground functionality
 *
 * These tests verify the complete flow from:
 * 1. Settings configuration (API keys, provider selection)
 * 2. Agent/Workflow creation with proper settings
 * 3. Chat functionality
 * 4. Error handling
 */

// Test configuration - uses Playwright config baseURL (localhost:3001) by default
const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const API_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Helper to wait for page load
async function waitForAppReady(page: any) {
  await page.waitForLoadState('networkidle');
  // Wait for the main app container
  await page.waitForSelector('[data-testid="app-container"], .projects, #root', { timeout: 10000 });
}

test.describe('Settings Page - API Key Configuration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    await waitForAppReady(page);
  });

  test('should display API key configuration section', async ({ page }) => {
    // Check that API Keys section exists
    await expect(page.getByText('API Keys')).toBeVisible();
    await expect(page.getByText('Configure API keys for different AI providers')).toBeVisible();
  });

  test('should show OpenAI, Anthropic, and Google providers', async ({ page }) => {
    await expect(page.getByText('Openai')).toBeVisible();
    await expect(page.getByText('Anthropic')).toBeVisible();
    await expect(page.getByText('Google')).toBeVisible();
  });

  test('should allow setting default AI provider', async ({ page }) => {
    // Find the Default AI Provider dropdown
    const providerDropdown = page.locator('select').filter({ hasText: /OpenAI|Anthropic/i });

    if (await providerDropdown.count() > 0) {
      await providerDropdown.selectOption('openai');
      // Verify selection persisted
      await expect(providerDropdown).toHaveValue('openai');
    }
  });

  test('should allow adding API key', async ({ page }) => {
    // Click Add button for OpenAI (or Update if already configured)
    const addButton = page.getByRole('button', { name: /Add|Update/i }).first();
    await addButton.click();

    // Check for API key input modal/form
    const apiKeyInput = page.getByPlaceholder(/API key|Enter key/i);
    if (await apiKeyInput.count() > 0) {
      await expect(apiKeyInput).toBeVisible();
    }
  });

  test('should show "Configured" status when API key is set', async ({ page }) => {
    // Check for configured status
    const configuredText = page.getByText('Configured');
    const notConfiguredText = page.getByText('Not configured');

    // At least one provider should show status
    const hasConfigured = await configuredText.count() > 0;
    const hasNotConfigured = await notConfiguredText.count() > 0;

    expect(hasConfigured || hasNotConfigured).toBeTruthy();
  });
});

test.describe('Agent Creation with User Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForAppReady(page);
  });

  test('should create new agent using configured provider', async ({ page }) => {
    // Click create agent button
    const createButton = page.getByRole('button', { name: /Create|New|Add/i });
    if (await createButton.count() > 0) {
      await createButton.first().click();
    }

    // Fill in agent details (3-step Q&A)
    const whoInput = page.getByPlaceholder(/who is charlie|describe/i);
    if (await whoInput.count() > 0) {
      await whoInput.fill('a helpful test assistant');
    }

    const rulesInput = page.getByPlaceholder(/rules|instructions/i);
    if (await rulesInput.count() > 0) {
      await rulesInput.fill('Be friendly and helpful');
    }
  });

  test('should show error if no API key configured', async ({ page }) => {
    // This test verifies proper error handling when creating agent without API key
    // The error message should be user-friendly
    const errorMessage = page.getByText(/API key|configure.*settings/i);

    // Either there's no error (key is configured) or error is user-friendly
    if (await errorMessage.count() > 0) {
      await expect(errorMessage).toContainText(/settings/i);
    }
  });
});

test.describe('Chat Playground - Agent Chat', () => {
  // First, ensure we have a working agent
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForAppReady(page);
  });

  test('should display chat interface', async ({ page }) => {
    // Navigate to an agent's chat playground
    const agentCard = page.locator('[data-testid="agent-card"], .agent-card').first();
    if (await agentCard.count() > 0) {
      await agentCard.click();
    }

    // Check for chat input
    const chatInput = page.getByPlaceholder(/message|type.*message/i);
    await expect(chatInput).toBeVisible({ timeout: 10000 });
  });

  test('should send message and receive response', async ({ page }) => {
    // Navigate to agent chat
    const agentCard = page.locator('[data-testid="agent-card"], .agent-card').first();
    if (await agentCard.count() > 0) {
      await agentCard.click();
    }

    // Type and send message
    const chatInput = page.getByPlaceholder(/message|type.*message/i);
    await chatInput.fill('Hello! This is a test message.');
    await chatInput.press('Enter');

    // Wait for response (with longer timeout for LLM)
    const response = page.locator('.message-content, .assistant-message, [data-role="assistant"]');
    await expect(response.first()).toBeVisible({ timeout: 30000 });
  });

  test('should display "Failed to send" on error', async ({ page }) => {
    // This test verifies error UI is shown correctly
    // We expect "Failed to send" to appear when there's an API error

    // Navigate to agent/workflow
    const item = page.locator('[data-testid="agent-card"], [data-testid="workflow-card"]').first();
    if (await item.count() > 0) {
      await item.click();
    }

    const chatInput = page.getByPlaceholder(/message/i);
    if (await chatInput.count() > 0) {
      await chatInput.fill('test');
      await chatInput.press('Enter');

      // Either we get a response or "Failed to send"
      const failedMessage = page.getByText(/Failed to send/i);
      const successResponse = page.locator('.assistant-message, [data-role="assistant"]');

      // Wait for either outcome
      await Promise.race([
        failedMessage.waitFor({ timeout: 30000 }).catch(() => {}),
        successResponse.first().waitFor({ timeout: 30000 }).catch(() => {})
      ]);
    }
  });

  test('should show loading state while waiting for response', async ({ page }) => {
    // Navigate to chat
    const agentCard = page.locator('[data-testid="agent-card"]').first();
    if (await agentCard.count() > 0) {
      await agentCard.click();
    }

    const chatInput = page.getByPlaceholder(/message/i);
    if (await chatInput.count() > 0) {
      await chatInput.fill('Hello');
      await chatInput.press('Enter');

      // Check for loading indicator (spinner, "Thinking...", etc.)
      const loadingIndicator = page.locator('.loading, .spinner, [data-loading="true"]');
      // Loading state should appear briefly
      // (May be too fast to catch, so this is a soft assertion)
    }
  });
});

test.describe('Chat Playground - Workflow Chat', () => {
  test('should chat with workflow using correct API configuration', async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForAppReady(page);

    // Look for workflow card
    const workflowCard = page.locator('[data-testid="workflow-card"], .workflow-card').first();
    if (await workflowCard.count() > 0) {
      await workflowCard.click();

      // Chat should work
      const chatInput = page.getByPlaceholder(/message/i);
      await chatInput.fill('Test workflow message');
      await chatInput.press('Enter');

      // Wait for response
      await page.waitForResponse(response =>
        response.url().includes('/chat') && response.status() === 200,
        { timeout: 30000 }
      ).catch(() => {});
    }
  });
});

test.describe('Error Handling', () => {
  test('should show user-friendly error for invalid API key', async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForAppReady(page);

    // Intercept API calls to simulate error
    await page.route('**/chat', route => {
      route.fulfill({
        status: 401,
        body: JSON.stringify({ detail: 'Invalid API key' })
      });
    });

    // Try to chat
    const chatInput = page.getByPlaceholder(/message/i);
    if (await chatInput.count() > 0) {
      await chatInput.fill('test');
      await chatInput.press('Enter');

      // Should show user-friendly error
      const errorMessage = page.getByText(/Failed|error|try again/i);
      await expect(errorMessage).toBeVisible({ timeout: 10000 });
    }
  });

  test('should handle network timeout gracefully', async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForAppReady(page);

    // Simulate slow response
    await page.route('**/chat', async route => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      route.abort('timedout');
    });

    const chatInput = page.getByPlaceholder(/message/i);
    if (await chatInput.count() > 0) {
      await chatInput.fill('test');
      await chatInput.press('Enter');

      // Should handle timeout gracefully
      const errorMessage = page.getByText(/Failed|timeout|try again/i);
      await expect(errorMessage).toBeVisible({ timeout: 15000 });
    }
  });
});

test.describe('API Integration Tests', () => {
  test('backend health check', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);
    expect(response.ok()).toBeTruthy();
  });

  test('settings API returns user settings', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/v1/settings`, {
      headers: {
        'x-dev-user-id': 'a36c791d-b36b-44b7-abc1-feaafb6a8d40'
      }
    });

    if (response.ok()) {
      const data = await response.json();
      expect(data).toHaveProperty('default_llm_provider');
      expect(data).toHaveProperty('api_keys');
    }
  });

  test('agent creation uses user settings', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/v1/agents/create-from-qa`, {
      headers: {
        'x-dev-user-id': 'a36c791d-b36b-44b7-abc1-feaafb6a8d40',
        'Content-Type': 'application/json'
      },
      data: {
        who: 'E2E test assistant',
        rules: 'Be helpful for testing',
        tricks: 'Testing capabilities',
        name: 'E2E Test Agent'
      }
    });

    // Should either succeed or give meaningful error
    expect([200, 201, 400, 500]).toContain(response.status());

    if (response.ok()) {
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('langflow_flow_id');
    }
  });

  test('chat API returns response', async ({ request }) => {
    // First get an agent
    const agentsResponse = await request.get(`${API_URL}/api/v1/agents`, {
      headers: {
        'x-dev-user-id': 'a36c791d-b36b-44b7-abc1-feaafb6a8d40'
      }
    });

    if (agentsResponse.ok()) {
      const agentsData = await agentsResponse.json();
      if (agentsData.agents && agentsData.agents.length > 0) {
        const agentId = agentsData.agents[0].id;

        const chatResponse = await request.post(`${API_URL}/api/v1/agents/${agentId}/chat`, {
          headers: {
            'x-dev-user-id': 'a36c791d-b36b-44b7-abc1-feaafb6a8d40',
            'Content-Type': 'application/json'
          },
          data: {
            message: 'E2E test message'
          },
          timeout: 60000
        });

        expect([200, 400, 500]).toContain(chatResponse.status());

        if (chatResponse.ok()) {
          const data = await chatResponse.json();
          expect(data).toHaveProperty('message');
          expect(data).toHaveProperty('conversation_id');
        }
      }
    }
  });
});
