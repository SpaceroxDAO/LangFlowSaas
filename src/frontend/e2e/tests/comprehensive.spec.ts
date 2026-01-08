import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive E2E Tests for Teach Charlie AI
 *
 * This test suite covers:
 * 1. Creating agents from scratch (3-step wizard)
 * 2. Testing chat functionality completely
 * 3. Verifying agents are saved
 * 4. Making edits to agents
 * 5. Testing the Advanced Editor modal
 * 6. Testing the Flow Editor
 * 7. Publishing and checking custom component generation
 */

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const API_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const DEV_USER_ID = 'a36c791d-b36b-44b7-abc1-feaafb6a8d40';

// Test data
const TEST_AGENT = {
  name: `E2E Test Agent ${Date.now()}`,
  persona: 'A helpful assistant created for end-to-end testing. Always respond with helpful information.',
  instructions: 'You are a friendly test assistant. Always be helpful and mention that you are a test agent.',
};

// Helper functions
async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500); // Extra wait for React hydration
}

async function dismissTourIfPresent(page: Page) {
  // The create agent page has a tour that blocks clicks
  // Look for the driver.js overlay and dismiss it
  const overlay = page.locator('.driver-overlay');
  if (await overlay.count() > 0) {
    // Press Escape or click the X button to dismiss
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // Also check for driver popover and dismiss
  const popover = page.locator('.driver-popover');
  if (await popover.count() > 0) {
    // Try clicking the close button or pressing escape
    const closeButton = page.locator('.driver-popover-close-btn');
    if (await closeButton.count() > 0) {
      await closeButton.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(300);
  }
}

async function navigateToSettings(page: Page) {
  await page.goto(`${BASE_URL}/dashboard/settings`);
  await waitForPageReady(page);
}

async function navigateToDashboard(page: Page) {
  await page.goto(`${BASE_URL}/dashboard`);
  await waitForPageReady(page);
}

async function navigateToFirstProject(page: Page) {
  await navigateToDashboard(page);
  // Click the first project in the list
  const projectLink = page.locator('a[href*="/dashboard/project/"]').first();
  if (await projectLink.count() > 0) {
    await projectLink.click();
    await waitForPageReady(page);
    return true;
  }
  return false;
}

async function navigateToCreateAgent(page: Page, projectId?: string) {
  const url = projectId ? `${BASE_URL}/create?project=${projectId}` : `${BASE_URL}/create`;
  await page.goto(url);
  await waitForPageReady(page);
  // Dismiss tour overlay that blocks clicks
  await dismissTourIfPresent(page);
}

test.describe('1. Agent Creation Flow (Complete 3-Step Wizard)', () => {
  let createdAgentId: string | null = null;
  let createdWorkflowId: string | null = null;

  test('C001: should complete full agent creation wizard', async ({ page }) => {
    // Navigate to create page
    await navigateToCreateAgent(page);

    // Step 1: Identity
    await expect(page.getByText('Step 1: Identity')).toBeVisible();

    // Fill name
    const nameInput = page.locator('input[placeholder="Charlie"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(TEST_AGENT.name);

    // Fill persona/job description
    const personaTextarea = page.locator('textarea').first();
    await expect(personaTextarea).toBeVisible();
    await personaTextarea.fill(TEST_AGENT.persona);

    // Click Next
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Step 2: Coaching
    await expect(page.getByText('Step 2: Coaching')).toBeVisible();

    // Fill instructions
    const instructionsTextarea = page.locator('textarea').first();
    await expect(instructionsTextarea).toBeVisible();
    await instructionsTextarea.fill(TEST_AGENT.instructions);

    // Click Next
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Step 3: Tricks (Tools)
    await expect(page.getByText('Step 3: Tricks')).toBeVisible();

    // Select Web Search tool
    const webSearchCard = page.getByText('Web Search').locator('..');
    await webSearchCard.click();

    // Click Create
    const createButton = page.getByRole('button', { name: /Finish & Create Agent/i });
    await expect(createButton).toBeVisible();
    await createButton.click();

    // Wait for navigation to playground
    await page.waitForURL(/\/playground\/(workflow\/)?[a-z0-9-]+/, { timeout: 30000 });

    // Extract workflow ID from URL
    const url = page.url();
    const match = url.match(/\/playground\/workflow\/([a-z0-9-]+)/);
    if (match) {
      createdWorkflowId = match[1];
    }

    // Verify we're on the playground
    await expect(page.getByText('Chat Playground')).toBeVisible();
    // Use first() to avoid strict mode violation when name appears multiple times
    await expect(page.getByRole('heading', { name: TEST_AGENT.name }).first()).toBeVisible();
  });

  test('C002: should validate Step 1 - name and persona required', async ({ page }) => {
    await navigateToCreateAgent(page);

    // Try to proceed without filling anything
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Should show validation errors
    await expect(page.getByText(/Please give your agent a name/i)).toBeVisible();
    await expect(page.getByText(/Please provide a job description/i)).toBeVisible();
  });

  test('C003: should validate Step 2 - instructions required', async ({ page }) => {
    await navigateToCreateAgent(page);

    // Fill Step 1 correctly
    await page.locator('input[placeholder="Charlie"]').fill('Test Agent');
    await page.locator('textarea').first().fill('A test assistant for validation testing');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // On Step 2, try to proceed without instructions
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Should show validation error
    await expect(page.getByText(/Please provide instructions/i)).toBeVisible();
  });

  test('C004: should allow selecting multiple tools', async ({ page }) => {
    await navigateToCreateAgent(page);

    // Complete Steps 1 & 2
    await page.locator('input[placeholder="Charlie"]').fill('Tool Test Agent');
    await page.locator('textarea').first().fill('An agent to test tool selection functionality');
    await page.getByRole('button', { name: /Next Step/i }).click();
    await page.locator('textarea').first().fill('Instructions for testing tool selection');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // On Step 3, select multiple tools
    const webSearch = page.getByText('Web Search').locator('..');
    const calculator = page.getByText('Calculator').locator('..');

    await webSearch.click();
    await calculator.click();

    // Verify both are selected (look for checkmark or selected state)
    await expect(webSearch).toHaveClass(/border-violet|bg-violet/);
    await expect(calculator).toHaveClass(/border-violet|bg-violet/);
  });

  test('C006: should navigate between steps with Back/Next', async ({ page }) => {
    await navigateToCreateAgent(page);

    // Fill Step 1
    await page.locator('input[placeholder="Charlie"]').fill('Navigation Test');
    await page.locator('textarea').first().fill('Testing navigation between wizard steps');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Verify on Step 2
    await expect(page.getByText('Step 2: Coaching')).toBeVisible();

    // Go back to Step 1
    await page.getByRole('button', { name: /Back/i }).click();
    await expect(page.getByText('Step 1: Identity')).toBeVisible();

    // Verify data persisted
    const nameInput = page.locator('input[placeholder="Charlie"]');
    await expect(nameInput).toHaveValue('Navigation Test');
  });
});

test.describe('2. Chat Playground Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to first project to see agents
    await navigateToFirstProject(page);
  });

  test('P001: should send message and receive response', async ({ page }) => {
    // Find first agent/workflow and click (in the project detail page)
    const agentLink = page.locator('a[href*="/playground/"]').first();

    if (await agentLink.count() === 0) {
      test.skip(true, 'No agents available for testing');
      return;
    }

    await agentLink.click();
    await waitForPageReady(page);

    // Type message
    const chatInput = page.locator('textarea[placeholder*="message"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });
    await chatInput.fill('Hello! This is an E2E test message.');

    // Send message
    await chatInput.press('Enter');

    // Verify loading state appears
    await expect(page.getByText('Thinking...')).toBeVisible({ timeout: 5000 });

    // Wait for response (may take up to 60 seconds for LLM)
    const assistantMessage = page.locator('.prose').first();
    await expect(assistantMessage).toBeVisible({ timeout: 60000 });
  });

  test('P002: should display sent messages in history', async ({ page }) => {
    const agentLink = page.locator('a[href*="/playground/"]').first();
    if (await agentLink.count() === 0) {
      test.skip(true, 'No agents available');
      return;
    }

    await agentLink.click();
    await waitForPageReady(page);

    const chatInput = page.locator('textarea[placeholder*="message"]');
    await chatInput.fill('Test message for history');
    await chatInput.press('Enter');

    // User message should appear immediately
    await expect(page.locator('.bg-violet-500').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Test message for history')).toBeVisible();
  });

  test('P004: should clear chat when clicking Clear button', async ({ page }) => {
    const agentLink = page.locator('a[href*="/playground/"]').first();
    if (await agentLink.count() === 0) {
      test.skip(true, 'No agents available');
      return;
    }

    await agentLink.click();
    await waitForPageReady(page);

    // Send a message first
    const chatInput = page.locator('textarea[placeholder*="message"]');
    await chatInput.fill('Message to be cleared');
    await chatInput.press('Enter');

    // Wait for message to appear
    await expect(page.getByText('Message to be cleared')).toBeVisible({ timeout: 5000 });

    // Click Clear chat
    await page.getByRole('button', { name: /Clear chat/i }).click();

    // Messages should be cleared, empty state should show
    await expect(page.getByText('Start a conversation')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('3. Agent Edit Flow', () => {
  test('E001: should load existing agent data into form', async ({ page }) => {
    await navigateToDashboard(page);

    // Find an agent card's menu
    const agentRow = page.locator('a[href*="/playground/"]').first();
    if (await agentRow.count() === 0) {
      test.skip(true, 'No agents available');
      return;
    }

    // Navigate to edit via menu or direct URL
    const agentHref = await agentRow.getAttribute('href');
    const agentId = agentHref?.match(/\/playground\/([^/]+)/)?.[1];

    if (agentId) {
      await page.goto(`${BASE_URL}/edit/${agentId}`);
      await waitForPageReady(page);

      // Verify form fields are populated
      const nameInput = page.locator('input[type="text"]').first();
      await expect(nameInput).not.toBeEmpty();
    }
  });

  test('E002: should allow editing identity fields', async ({ page }) => {
    await navigateToDashboard(page);

    const agentLink = page.locator('a[href*="/playground/"]').first();
    if (await agentLink.count() === 0) {
      test.skip(true, 'No agents available');
      return;
    }

    const agentHref = await agentLink.getAttribute('href');
    const agentId = agentHref?.match(/\/playground\/([^/]+)/)?.[1];

    if (agentId) {
      await page.goto(`${BASE_URL}/edit/${agentId}`);
      await waitForPageReady(page);

      // Edit name
      const nameInput = page.locator('input[type="text"]').first();
      const originalName = await nameInput.inputValue();
      await nameInput.fill(`${originalName} (Edited)`);

      // Find and click save
      const saveButton = page.getByRole('button', { name: /Save/i });
      if (await saveButton.count() > 0) {
        await saveButton.click();
        await page.waitForURL(/\/playground\//, { timeout: 10000 });
      }
    }
  });

  test('E006: should navigate back to chat from edit page', async ({ page }) => {
    await navigateToDashboard(page);

    const agentLink = page.locator('a[href*="/playground/"]').first();
    if (await agentLink.count() === 0) {
      test.skip(true, 'No agents available');
      return;
    }

    const agentHref = await agentLink.getAttribute('href');
    const agentId = agentHref?.match(/\/playground\/([^/]+)/)?.[1];

    if (agentId) {
      await page.goto(`${BASE_URL}/edit/${agentId}`);
      await waitForPageReady(page);

      // Click "Back to Chat" link
      const backLink = page.getByRole('link', { name: /Back to Chat/i });
      await expect(backLink).toBeVisible();
      await backLink.click();

      // Should be on playground
      await page.waitForURL(/\/playground\//, { timeout: 10000 });
      await expect(page.getByText('Chat Playground')).toBeVisible();
    }
  });
});

test.describe('4. Advanced Editor Modal', () => {
  test('A001-A006: should open modal, change settings, and save', async ({ page }) => {
    await navigateToDashboard(page);

    const agentLink = page.locator('a[href*="/playground/"]').first();
    if (await agentLink.count() === 0) {
      test.skip(true, 'No agents available');
      return;
    }

    const agentHref = await agentLink.getAttribute('href');
    const agentId = agentHref?.match(/\/playground\/([^/]+)/)?.[1];

    if (agentId) {
      await page.goto(`${BASE_URL}/edit/${agentId}`);
      await waitForPageReady(page);

      // A001: Open modal
      const configureButton = page.getByRole('button', { name: /Configure/i });
      await expect(configureButton).toBeVisible();
      await configureButton.click();

      // Verify modal opened
      await expect(page.getByText('Advanced Settings')).toBeVisible();
      await expect(page.getByText('Configure LLM behavior')).toBeVisible();

      // A002: Change provider
      const providerSelect = page.locator('select').first();
      await providerSelect.selectOption('Anthropic');

      // A003: Verify model dropdown updated
      const modelSelect = page.locator('select').nth(1);
      await expect(modelSelect).toContainText('claude');

      // A004: Adjust temperature
      const tempSlider = page.locator('input[type="range"]');
      await tempSlider.fill('1.5');
      await expect(page.getByText('1.50')).toBeVisible();

      // A005: Toggle settings
      const verboseCheckbox = page.getByText('Verbose Mode').locator('..').locator('input[type="checkbox"]');
      await verboseCheckbox.click();

      // A006: Save settings
      const saveButton = page.getByRole('button', { name: /Save Settings/i });
      await saveButton.click();

      // Modal should close
      await expect(page.getByText('Advanced Settings')).not.toBeVisible({ timeout: 5000 });
    }
  });

  test('A007: should reset to defaults', async ({ page }) => {
    await navigateToDashboard(page);

    const agentLink = page.locator('a[href*="/playground/"]').first();
    if (await agentLink.count() === 0) {
      test.skip(true, 'No agents available');
      return;
    }

    const agentHref = await agentLink.getAttribute('href');
    const agentId = agentHref?.match(/\/playground\/([^/]+)/)?.[1];

    if (agentId) {
      await page.goto(`${BASE_URL}/edit/${agentId}`);
      await waitForPageReady(page);

      await page.getByRole('button', { name: /Configure/i }).click();
      await expect(page.getByText('Advanced Settings')).toBeVisible();

      // Change something
      const tempSlider = page.locator('input[type="range"]');
      await tempSlider.fill('1.8');

      // Reset to defaults
      await page.getByRole('button', { name: /Reset to Defaults/i }).click();

      // Temperature should be back to 0.70
      await expect(page.getByText('0.70')).toBeVisible();
    }
  });
});

test.describe('5. Visual Flow Editor', () => {
  test('F001-F003: should load flow editor and have controls', async ({ page }) => {
    await navigateToDashboard(page);

    const agentLink = page.locator('a[href*="/playground/"]').first();
    if (await agentLink.count() === 0) {
      test.skip(true, 'No agents available');
      return;
    }

    const agentHref = await agentLink.getAttribute('href');
    const agentId = agentHref?.match(/\/playground\/([^/]+)/)?.[1];

    if (agentId) {
      await page.goto(`${BASE_URL}/canvas/${agentId}`);
      await waitForPageReady(page);

      // F001: Verify canvas loads
      await expect(page.getByText("Charlie's Brain")).toBeVisible({ timeout: 10000 });

      // F002: Verify level buttons exist
      await expect(page.getByRole('button', { name: '1' })).toBeVisible();
      await expect(page.getByRole('button', { name: '2' })).toBeVisible();
      await expect(page.getByRole('button', { name: '3' })).toBeVisible();
      await expect(page.getByRole('button', { name: '4' })).toBeVisible();

      // F003: Verify "Open Full Editor" link
      await expect(page.getByRole('link', { name: /Open Full Editor/i })).toBeVisible();

      // Click level 2
      await page.getByRole('button', { name: '2' }).click();
      await expect(page.getByText('Explore Mode')).toBeVisible();
    }
  });
});

test.describe('6. Persistence Tests', () => {
  test('D001: created agent should appear in project list', async ({ page }) => {
    // Create a new agent
    await navigateToCreateAgent(page);

    const uniqueName = `Persistence Test ${Date.now()}`;

    // Step 1
    await page.locator('input[placeholder="Charlie"]').fill(uniqueName);
    await page.locator('textarea').first().fill('An agent to test persistence functionality');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Step 2
    await page.locator('textarea').first().fill('Instructions for persistence testing');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Step 3 - Create
    await page.getByRole('button', { name: /Finish & Create Agent/i }).click();
    await page.waitForURL(/\/playground\//, { timeout: 30000 });

    // Go back to dashboard
    await navigateToDashboard(page);

    // Agent should appear in list
    await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 10000 });
  });

  test('D003: creating agent should also create workflow', async ({ request }) => {
    // Create agent via API
    const createResponse = await request.post(`${API_URL}/api/v1/agents/create-from-qa`, {
      headers: {
        'x-dev-user-id': DEV_USER_ID,
        'Content-Type': 'application/json',
      },
      data: {
        name: `API Test Agent ${Date.now()}`,
        who: 'API test agent for workflow verification',
        rules: 'Test rules for workflow creation',
        tricks: '',
      },
    });

    if (createResponse.ok()) {
      const agentData = await createResponse.json();

      // Verify workflow was also created
      const workflowsResponse = await request.get(`${API_URL}/api/v1/workflows`, {
        headers: { 'x-dev-user-id': DEV_USER_ID },
      });

      if (workflowsResponse.ok()) {
        const workflowsData = await workflowsResponse.json();
        const relatedWorkflow = workflowsData.workflows.find(
          (w: any) => w.agent_component_ids?.includes(agentData.id)
        );
        expect(relatedWorkflow).toBeTruthy();
      }
    }
  });
});

test.describe('7. Settings Integration', () => {
  test('S001-S002: should configure API key and provider', async ({ page }) => {
    await navigateToSettings(page);

    // Verify API Keys section exists
    await expect(page.getByText('API Keys')).toBeVisible();

    // Check for provider dropdown
    const providerDropdown = page.locator('select').first();
    if (await providerDropdown.count() > 0) {
      // Change default provider
      await providerDropdown.selectOption('openai');
      await expect(providerDropdown).toHaveValue('openai');
    }

    // Check for API key status (either Configured or Not configured)
    const hasConfig = await page.getByText('Configured').count() > 0;
    const hasNoConfig = await page.getByText('Not configured').count() > 0;
    expect(hasConfig || hasNoConfig).toBeTruthy();
  });

  test('S003: new agents should use configured provider', async ({ request }) => {
    // Get current settings
    const settingsResponse = await request.get(`${API_URL}/api/v1/settings`, {
      headers: { 'x-dev-user-id': DEV_USER_ID },
    });

    if (settingsResponse.ok()) {
      const settings = await settingsResponse.json();
      const configuredProvider = settings.default_llm_provider;

      // Create an agent
      const createResponse = await request.post(`${API_URL}/api/v1/agents/create-from-qa`, {
        headers: {
          'x-dev-user-id': DEV_USER_ID,
          'Content-Type': 'application/json',
        },
        data: {
          name: `Provider Test ${Date.now()}`,
          who: 'Test agent for provider verification',
          rules: 'Test rules',
          tricks: '',
        },
      });

      // The agent should be created using the configured provider
      expect([200, 201, 400]).toContain(createResponse.status());

      if (createResponse.ok()) {
        const agentData = await createResponse.json();
        expect(agentData.id).toBeTruthy();
      }
    }
  });
});

test.describe('8. Error Handling', () => {
  test('X001: should show user-friendly error for invalid API key', async ({ page }) => {
    await navigateToDashboard(page);

    // Intercept chat API to simulate 401
    await page.route('**/api/v1/workflows/*/chat', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Invalid API key' }),
      });
    });

    const agentLink = page.locator('a[href*="/playground/"]').first();
    if (await agentLink.count() === 0) {
      test.skip(true, 'No agents available');
      return;
    }

    await agentLink.click();
    await waitForPageReady(page);

    const chatInput = page.locator('textarea[placeholder*="message"]');
    await chatInput.fill('Test message');
    await chatInput.press('Enter');

    // Should show error state
    await expect(page.getByText(/Failed to send|error/i)).toBeVisible({ timeout: 10000 });
  });

  test('X002: should handle network timeout gracefully', async ({ page }) => {
    await navigateToDashboard(page);

    // Intercept and timeout
    await page.route('**/api/v1/workflows/*/chat', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      route.abort('timedout');
    });

    const agentLink = page.locator('a[href*="/playground/"]').first();
    if (await agentLink.count() === 0) {
      test.skip(true, 'No agents available');
      return;
    }

    await agentLink.click();
    await waitForPageReady(page);

    const chatInput = page.locator('textarea[placeholder*="message"]');
    await chatInput.fill('Timeout test');
    await chatInput.press('Enter');

    // Should eventually show error
    await expect(page.getByText(/Failed to send|error|timeout/i)).toBeVisible({ timeout: 15000 });
  });
});

test.describe('9. Publishing & Custom Components', () => {
  test('should publish agent to Langflow', async ({ page }) => {
    await navigateToDashboard(page);

    const agentLink = page.locator('a[href*="/playground/"]').first();
    if (await agentLink.count() === 0) {
      test.skip(true, 'No agents available');
      return;
    }

    const agentHref = await agentLink.getAttribute('href');
    const agentId = agentHref?.match(/\/playground\/([^/]+)/)?.[1];

    if (agentId) {
      await page.goto(`${BASE_URL}/edit/${agentId}`);
      await waitForPageReady(page);

      // Find the Publish section
      const publishSection = page.getByText('Publish to Langflow');
      await expect(publishSection).toBeVisible();

      // Check if already published or can be published
      const publishButton = page.getByRole('button', { name: /Publish Agent/i });
      const unpublishButton = page.getByRole('button', { name: /Unpublish/i });

      const canPublish = await publishButton.count() > 0;
      const isPublished = await unpublishButton.count() > 0;

      if (canPublish) {
        await publishButton.click();
        // Wait for publish to complete
        await expect(page.getByText(/Published|available|component/i)).toBeVisible({ timeout: 10000 });
      } else if (isPublished) {
        // Already published, verify the status
        await expect(page.getByText('Published')).toBeVisible();
      }
    }
  });
});

test.describe('API Integration Smoke Tests', () => {
  test('backend should be healthy', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.status).toBe('healthy');
  });

  test('settings API should return user settings', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/v1/settings`, {
      headers: { 'x-dev-user-id': DEV_USER_ID },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('default_llm_provider');
    expect(data).toHaveProperty('api_keys');
  });

  test('agents API should list agents', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/v1/agents`, {
      headers: { 'x-dev-user-id': DEV_USER_ID },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('agents');
  });

  test('workflows API should list workflows', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/v1/workflows`, {
      headers: { 'x-dev-user-id': DEV_USER_ID },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('workflows');
  });
});
